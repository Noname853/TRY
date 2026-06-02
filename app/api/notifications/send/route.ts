import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude, MODEL_HAIKU } from "@/lib/claude";
import { NOTIF_MORNING, NOTIF_EVENING, NOTIF_STREAK_WARNING, systemPrompt } from "@/lib/prompts";
import { sendPush } from "@/lib/push";
import { calcStreak } from "@/lib/streak";
import { todayISO } from "@/lib/date";
import type { HabitLogRow, UserRow } from "@/lib/supabase/types";

// Endpoint dipanggil oleh Vercel Cron — proteksi via CRON_SECRET.
// Body: { type: 'morning' | 'evening' | 'streak_warning' }
export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const type: "morning" | "evening" | "streak_warning" = body.type ?? "morning";

  const admin = createAdminClient();
  const { data: users } = await admin
    .from("users")
    .select("*")
    .eq("ai_notifications_enabled", true)
    .not("push_subscription", "is", null);

  const today = todayISO();
  let sent = 0;
  let failed = 0;

  for (const u of (users ?? []) as UserRow[]) {
    if (!u.push_subscription) continue;

    const { data: habits } = await admin
      .from("habits")
      .select("id,name")
      .eq("user_id", u.id)
      .eq("is_active", true);
    const { data: logs } = await admin
      .from("habit_logs")
      .select("habit_id,date,completed")
      .eq("user_id", u.id)
      .gte("date", today.replace(/\d+$/, "01"));

    const habitsList = habits ?? [];
    const allLogs = (logs ?? []) as Pick<HabitLogRow, "habit_id" | "date" | "completed">[];
    const maxStreak = habitsList.length
      ? Math.max(...habitsList.map((h) => calcStreak(allLogs.filter((l) => l.habit_id === h.id))))
      : 0;
    const doneToday = allLogs.filter((l) => l.date === today && l.completed).length;

    const sys = systemPrompt({
      aiName: u.ai_name ?? "Luna",
      userName: u.name ?? "kamu",
      memory: [],
    });
    const userPrompt =
      type === "morning"
        ? NOTIF_MORNING({ name: u.name ?? "kamu", streak: maxStreak })
        : type === "evening"
        ? NOTIF_EVENING({
            name: u.name ?? "kamu",
            doneToday,
            totalHabits: habitsList.length,
          })
        : NOTIF_STREAK_WARNING({ name: u.name ?? "kamu", streak: maxStreak });

    try {
      const result = await callClaude({
        systemPrompt: sys,
        messages: [{ role: "user", content: userPrompt }],
        model: MODEL_HAIKU,
        maxTokens: 120,
      });

      await sendPush(u.push_subscription as Parameters<typeof sendPush>[0], {
        title: u.ai_name ?? "Luna",
        body: result.text,
        url: "/dashboard",
        tag: `${type}-${today}`,
      });
      sent++;
    } catch (e) {
      failed++;
      console.error("Push failed", u.id, e);
    }
  }

  return NextResponse.json({ sent, failed, type });
}
