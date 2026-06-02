import { NextResponse, after } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { checkinMessageSchema } from "@/lib/validations";
import { streamClaude, type ChatTurn } from "@/lib/claude";
import { checkinSystemPrompt, systemPrompt } from "@/lib/prompts";
import { dayOfWeekID, shiftDays, todayISO } from "@/lib/date";
import { calcStreak } from "@/lib/streak";
import { extractMemoriesForCheckin } from "@/lib/memory";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatMessage, HabitLogRow } from "@/lib/supabase/types";

/**
 * Streaming variant dari /api/checkin.
 * Response: text/plain UTF-8 stream — client baca via `response.body.getReader()`.
 * Save ke DB dilakukan setelah stream selesai, lewat `after()`.
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, checkinMessageSchema);
  if ("error" in parsed) return parsed.error;

  const authed = await withAuth(async ({ user, supabase }) => {
    const today = todayISO();
    const yesterday = shiftDays(today, -1);

    const [profileRes, habitsRes, memoryRes, logsRes, todayRes, yesterdayRes] =
      await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).maybeSingle(),
        supabase
          .from("habits")
          .select("id,name,target")
          .eq("user_id", user.id)
          .eq("is_active", true),
        supabase
          .from("ai_memory")
          .select("category,content")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(20),
        supabase
          .from("habit_logs")
          .select("habit_id,date,completed")
          .eq("user_id", user.id)
          .gte("date", shiftDays(today, -45)),
        supabase
          .from("checkins")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .maybeSingle(),
        supabase
          .from("checkins")
          .select("mood,energy")
          .eq("user_id", user.id)
          .eq("date", yesterday)
          .maybeSingle(),
      ]);

    const profile = profileRes.data;
    const habits = habitsRes.data ?? [];
    const memory = memoryRes.data ?? [];
    const logs = (logsRes.data ?? []) as Pick<
      HabitLogRow,
      "habit_id" | "date" | "completed"
    >[];

    const streaks: Record<string, number> = {};
    for (const h of habits) {
      streaks[h.name] = calcStreak(logs.filter((l) => l.habit_id === h.id));
    }

    const base = systemPrompt({
      aiName: profile?.ai_name ?? "Luna",
      userName: profile?.name ?? "kamu",
      memory,
    });
    const sys = checkinSystemPrompt({
      base,
      userName: profile?.name ?? "kamu",
      date: today,
      dayOfWeek: dayOfWeekID(today),
      habits,
      streaks,
      yesterday: yesterdayRes.data ?? undefined,
    });

    const existing: ChatMessage[] = (todayRes.data?.messages as ChatMessage[]) ?? [];
    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      role: "user",
      content: parsed.data.content,
      timestamp: now,
    };

    const turns: ChatTurn[] = [...existing, userMsg].map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const { textChunks, final } = streamClaude({
      systemPrompt: sys,
      messages: turns,
      maxTokens: 400,
    });

    const encoder = new TextEncoder();
    const userId = user.id;
    const userName = profile?.name ?? "Pengguna";

    const body = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textChunks()) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
          return;
        }

        // Setelah stream user selesai dikirim, simpan ke DB di background.
        after(async () => {
          try {
            const { text } = await final();
            const aiMsg: ChatMessage = {
              role: "assistant",
              content: text,
              timestamp: new Date().toISOString(),
            };
            const merged = [...existing, userMsg, aiMsg];

            const update = {
              user_id: userId,
              date: today,
              mood: parsed.data.mood ?? todayRes.data?.mood ?? null,
              energy: parsed.data.energy ?? todayRes.data?.energy ?? null,
              sleep_quality:
                parsed.data.sleep_quality ?? todayRes.data?.sleep_quality ?? null,
              messages: merged,
            };

            // Pakai admin client karena context cookie request sudah tidak
            // dijamin valid setelah response selesai dikirim.
            const admin = createAdminClient();
            await admin
              .from("checkins")
              .upsert(update, { onConflict: "user_id,date" });

            await extractMemoriesForCheckin({
              userId,
              userName,
              messages: merged,
            });
          } catch (err) {
            console.error("[checkin.stream] gagal save/extract:", err);
          }
        });
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  });

  if (authed instanceof Response) return authed;
  return NextResponse.json({ error: "Unexpected" }, { status: 500 });
}
