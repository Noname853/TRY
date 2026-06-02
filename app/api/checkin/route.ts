import { NextResponse, after } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { checkinMessageSchema } from "@/lib/validations";
import { callClaude, type ChatTurn } from "@/lib/claude";
import { checkinSystemPrompt, systemPrompt } from "@/lib/prompts";
import { dayOfWeekID, shiftDays, todayISO } from "@/lib/date";
import { calcStreak } from "@/lib/streak";
import { extractMemoriesForCheckin } from "@/lib/memory";
import type { ChatMessage, HabitLogRow } from "@/lib/supabase/types";

export async function POST(request: Request) {
  const parsed = await parseBody(request, checkinMessageSchema);
  if ("error" in parsed) return parsed.error;

  return withAuth(async ({ user, supabase }) => {
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
    const logs = (logsRes.data ?? []) as Pick<HabitLogRow, "habit_id" | "date" | "completed">[];

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
    const userMsg: ChatMessage = { role: "user", content: parsed.data.content, timestamp: now };

    const turns: ChatTurn[] = [...existing, userMsg].map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const result = await callClaude({ systemPrompt: sys, messages: turns, maxTokens: 400 });
    const aiMsg: ChatMessage = {
      role: "assistant",
      content: result.text,
      timestamp: new Date().toISOString(),
    };

    const merged = [...existing, userMsg, aiMsg];

    const update = {
      user_id: user.id,
      date: today,
      mood: parsed.data.mood ?? todayRes.data?.mood ?? null,
      energy: parsed.data.energy ?? todayRes.data?.energy ?? null,
      sleep_quality: parsed.data.sleep_quality ?? todayRes.data?.sleep_quality ?? null,
      messages: merged,
    };

    const { data: saved, error } = await supabase
      .from("checkins")
      .upsert(update, { onConflict: "user_id,date" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Fire-and-forget memory extraction setelah response terkirim.
    after(() =>
      extractMemoriesForCheckin({
        userId: user.id,
        userName: profile?.name ?? "Pengguna",
        messages: merged,
      }),
    );

    return NextResponse.json({ checkin: saved, reply: aiMsg });
  });
}
