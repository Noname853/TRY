import { createAdminClient } from "./supabase/admin";
import { callClaude, MODEL_HAIKU, type ChatTurn } from "./claude";
import { MEMORY_EXTRACTION_PROMPT } from "./prompts";
import type { ChatMessage, MemoryCategory, MemoryRow } from "./supabase/types";

const VALID_CATEGORIES: MemoryCategory[] = [
  "personal",
  "pattern",
  "moment",
  "preference",
];

type ExtractedMemory = {
  category: MemoryCategory;
  content: string;
  confidence: number;
};

/**
 * Normalisasi string untuk dedup sederhana: lowercase, strip non-alnum,
 * collapse whitespace. Cukup untuk mendeteksi parafrase ringan.
 */
function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cek apakah `candidate` overlap signifikan dengan salah satu existing.
 * Pakai Jaccard token similarity sederhana — kalau ≥ 0.6 anggap duplikat.
 */
function isDuplicate(candidate: string, existing: string[]) {
  const norm = normalize(candidate);
  const tokensA = new Set(norm.split(" ").filter((w) => w.length > 2));
  if (tokensA.size === 0) return true;
  for (const e of existing) {
    const tokensB = new Set(
      normalize(e)
        .split(" ")
        .filter((w) => w.length > 2),
    );
    if (tokensB.size === 0) continue;
    let inter = 0;
    for (const t of tokensA) if (tokensB.has(t)) inter++;
    const union = tokensA.size + tokensB.size - inter;
    const jaccard = inter / union;
    if (jaccard >= 0.6) return true;
  }
  return false;
}

/**
 * Ekstrak memory dari satu sesi percakapan check-in.
 * Fire-and-forget — caller wajib jalankan via `after()` dari next/server.
 * Pakai service role client (admin) karena dipanggil di background tanpa cookie.
 */
export async function extractMemoriesForCheckin(args: {
  userId: string;
  userName: string;
  messages: ChatMessage[];
}) {
  try {
    if (args.messages.length < 2) return;

    const admin = createAdminClient();

    const existingRes = await admin
      .from("ai_memory")
      .select("content")
      .eq("user_id", args.userId)
      .order("updated_at", { ascending: false })
      .limit(50);

    const existing = (existingRes.data ?? []).map((m) => m.content);
    const existingTxt = existing.length
      ? existing.map((c) => `- ${c}`).join("\n")
      : "(belum ada)";

    const conversation = args.messages
      .map((m) => `${m.role === "user" ? args.userName : "AI"}: ${m.content}`)
      .join("\n");

    const prompt = MEMORY_EXTRACTION_PROMPT({
      userName: args.userName,
      conversation,
      existingMemory: existingTxt,
    });

    const turns: ChatTurn[] = [
      {
        role: "user",
        content: "Ekstrak memory dari percakapan di atas.",
      },
    ];

    const result = await callClaude({
      systemPrompt: prompt,
      messages: turns,
      model: MODEL_HAIKU,
      maxTokens: 400,
      jsonMode: true,
    });

    const items: ExtractedMemory[] = Array.isArray(result.json?.memories)
      ? result.json.memories
      : [];

    const toInsert: Pick<MemoryRow, "user_id" | "category" | "content" | "source">[] = [];

    for (const item of items) {
      if (!item?.content || typeof item.content !== "string") continue;
      if (!VALID_CATEGORIES.includes(item.category)) continue;
      if (typeof item.confidence === "number" && item.confidence < 0.7) continue;
      const trimmed = item.content.trim().slice(0, 300);
      if (trimmed.length < 5) continue;
      if (isDuplicate(trimmed, [...existing, ...toInsert.map((m) => m.content)])) {
        continue;
      }
      toInsert.push({
        user_id: args.userId,
        category: item.category,
        content: trimmed,
        source: "checkin",
      });
    }

    if (toInsert.length === 0) return;

    await admin.from("ai_memory").insert(toInsert);
  } catch (err) {
    // Background task — jangan ganggu UX. Log saja.
    console.error("[memory.extract] gagal:", err);
  }
}
