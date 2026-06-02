import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";
import { callClaude } from "@/lib/claude";
import { WEEKLY_REFLECTION_PROMPT, systemPrompt } from "@/lib/prompts";
import { shiftDays, weekRange } from "@/lib/date";
import { weeklyCompletionRate } from "@/lib/streak";
import type { HabitLogRow, HabitRow, CheckinRow } from "@/lib/supabase/types";

export async function GET() {
  return withAuth(async ({ user, supabase }) => {
    const { start, end } = weekRange();
    const [profileRes, habitsRes, logsRes, checkinsRes, memoryRes] = await Promise.all([
      supabase.from("users").select("name,ai_name").eq("id", user.id).maybeSingle(),
      supabase.from("habits").select("*").eq("user_id", user.id).eq("is_active", true),
      supabase
        .from("habit_logs")
        .select("habit_id,date,completed")
        .eq("user_id", user.id)
        .gte("date", start)
        .lte("date", end),
      supabase
        .from("checkins")
        .select("date,mood,energy")
        .eq("user_id", user.id)
        .gte("date", start)
        .lte("date", end),
      supabase.from("ai_memory").select("category,content").eq("user_id", user.id).limit(10),
    ]);

    const habits = (habitsRes.data ?? []) as HabitRow[];
    const logs = (logsRes.data ?? []) as Pick<HabitLogRow, "habit_id" | "date" | "completed">[];
    const checkins = (checkinsRes.data ?? []) as Pick<CheckinRow, "date" | "mood" | "energy">[];

    const rate = weeklyCompletionRate(logs, habits.length, start);

    // Per habit performance
    const perHabit = habits
      .map((h) => {
        const done = logs.filter((l) => l.habit_id === h.id && l.completed).length;
        return `${h.name}: ${done}/7`;
      })
      .join("; ");

    // Daily counts
    const days = Array.from({ length: 7 }, (_, i) => shiftDays(start, i));
    const dayScores = days.map((d) => ({
      date: d,
      completed: logs.filter((l) => l.date === d && l.completed).length,
    }));
    const sorted = [...dayScores].sort((a, b) => b.completed - a.completed);
    const bestDays = sorted.slice(0, 2).map((d) => d.date).join(", ");
    const worstDays = sorted.slice(-2).map((d) => d.date).join(", ");

    const moods = checkins.map((c) => c.mood).filter(Boolean);
    const energies = checkins.map((c) => c.energy).filter(Boolean);
    const mode = (arr: (string | null)[]) => {
      const m = new Map<string, number>();
      for (const v of arr) if (v) m.set(v, (m.get(v) ?? 0) + 1);
      return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
    };

    const sys = systemPrompt({
      aiName: profileRes.data?.ai_name ?? "Luna",
      userName: profileRes.data?.name ?? "kamu",
      memory: memoryRes.data ?? [],
    });

    const userPrompt = WEEKLY_REFLECTION_PROMPT({
      userName: profileRes.data?.name ?? "kamu",
      weekStart: start,
      weekEnd: end,
      rate,
      habitsPerformance: perHabit || "(belum ada kebiasaan)",
      avgMood: mode(moods),
      avgEnergy: mode(energies),
      bestDays,
      worstDays,
    });

    const result = await callClaude({
      systemPrompt: sys,
      messages: [{ role: "user", content: userPrompt }],
      maxTokens: 800,
    });

    return NextResponse.json({
      week: { start, end },
      rate,
      dayScores,
      perHabit,
      reflection: result.text,
    });
  });
}
