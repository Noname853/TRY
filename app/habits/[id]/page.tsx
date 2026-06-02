import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { shiftDays, todayISO } from "@/lib/date";
import { calcStreak } from "@/lib/streak";
import Link from "next/link";
import type { HabitLogRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [habitRes, logsRes] = await Promise.all([
    supabase.from("habits").select("*").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase
      .from("habit_logs")
      .select("date,completed,note")
      .eq("habit_id", id)
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(90),
  ]);

  if (!habitRes.data) notFound();

  const habit = habitRes.data;
  const logs = (logsRes.data ?? []) as Pick<HabitLogRow, "date" | "completed" | "note">[];
  const completed = new Set(logs.filter((l) => l.completed).map((l) => l.date));
  const streak = calcStreak(logs);

  // 35-day grid (5 weeks back)
  const today = todayISO();
  const grid = Array.from({ length: 35 }, (_, i) => shiftDays(today, -(34 - i)));

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex items-center gap-2.5 pt-1.5 pb-3.5 shrink-0">
          <Link href="/dashboard" className="text-xl text-[--color-text-muted]">
            ←
          </Link>
          <div className="text-[24px]">{habit.icon}</div>
          <div className="flex-1">
            <div className="jakarta font-extrabold" style={{ fontSize: "clamp(16px, 5vw, 19px)" }}>
              {habit.name}
            </div>
            {habit.target && (
              <div className="text-[11px] text-[--color-text-muted]">{habit.target}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3.5 shrink-0">
          <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl py-3 text-center">
            <div className="jakarta font-extrabold grad-text text-lg">{streak}</div>
            <div className="text-[10px] text-[--color-text-muted] mt-1">🔥 Streak</div>
          </div>
          <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl py-3 text-center">
            <div className="jakarta font-extrabold grad-text text-lg">{completed.size}</div>
            <div className="text-[10px] text-[--color-text-muted] mt-1">Total ✓</div>
          </div>
          <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl py-3 text-center">
            <div className="jakarta font-extrabold grad-text text-lg">
              {Math.round((completed.size / Math.max(1, grid.length)) * 100)}%
            </div>
            <div className="text-[10px] text-[--color-text-muted] mt-1">35 hari</div>
          </div>
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 shrink-0">
          Kalender 5 Minggu
        </div>
        <div className="grid grid-cols-7 gap-1 mb-3.5 shrink-0">
          {grid.map((d) => {
            const ok = completed.has(d);
            const isToday = d === today;
            return (
              <div
                key={d}
                className="aspect-square rounded-lg flex items-center justify-center text-[10px]"
                style={{
                  background: ok ? "linear-gradient(135deg, #34D399, #38BDF8)" : "#1A2235",
                  color: ok ? "#000" : "var(--color-text-muted)",
                  outline: isToday ? "1.5px solid #38BDF8" : undefined,
                }}
              >
                {d.slice(8)}
              </div>
            );
          })}
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 shrink-0">
          Catatan Terbaru
        </div>
        {logs.filter((l) => l.note).slice(0, 5).map((l, i) => (
          <div
            key={i}
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-xl p-3 mb-2"
          >
            <div className="text-[10px] text-[--color-text-muted] mb-1">{l.date}</div>
            <div className="text-[12px]">{l.note}</div>
          </div>
        ))}
        {logs.every((l) => !l.note) && (
          <div className="text-[12px] text-[--color-text-muted] text-center py-2">
            Belum ada catatan
          </div>
        )}

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
