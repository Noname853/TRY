import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { shiftDays, weekRange } from "@/lib/date";
import { weeklyCompletionRate } from "@/lib/streak";
import type { HabitLogRow, HabitRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const DAYS_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default async function ReflectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { start, end } = weekRange();
  const [habitsRes, logsRes] = await Promise.all([
    supabase.from("habits").select("*").eq("user_id", user.id).eq("is_active", true),
    supabase
      .from("habit_logs")
      .select("habit_id,date,completed")
      .eq("user_id", user.id)
      .gte("date", start)
      .lte("date", end),
  ]);

  const habits = (habitsRes.data ?? []) as HabitRow[];
  const logs = (logsRes.data ?? []) as Pick<HabitLogRow, "habit_id" | "date" | "completed">[];

  const rate = weeklyCompletionRate(logs, habits.length, start);
  const days = Array.from({ length: 7 }, (_, i) => shiftDays(start, i));
  const maxPerDay = habits.length || 1;
  const dayCounts = days.map((d) => logs.filter((l) => l.date === d && l.completed).length);
  const maxCount = Math.max(1, ...dayCounts);

  const monthLabel = new Date(start + "T00:00:00Z").toLocaleDateString("id-ID", {
    month: "long",
  });

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div className="jakarta font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 21px)" }}>
            Refleksi 📊
          </div>
          <div className="text-[12px] text-[--color-text-muted] font-medium">{monthLabel}</div>
        </div>

        <div
          className="rounded-[17px] py-4 px-3.5 mb-3.5 text-center relative overflow-hidden shrink-0 border"
          style={{
            background: "linear-gradient(135deg, rgba(129,140,248,0.13), rgba(56,189,248,0.07))",
            borderColor: "rgba(129,140,248,0.2)",
          }}
        >
          <div className="text-[10px] text-[--color-accent-violet] font-bold uppercase tracking-[1.5px] mb-2">
            Minggu {start.slice(8)} – {end.slice(8)} {monthLabel}
          </div>
          <div
            className="jakarta font-extrabold leading-none"
            style={{
              fontSize: "clamp(38px, 11vw, 50px)",
              color: "#818CF8",
              background: "linear-gradient(135deg, #818CF8, #38BDF8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {rate}
          </div>
          <div className="text-[12px] text-[--color-text-muted] mt-1 font-medium">
            Completion Rate
          </div>
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 shrink-0">
          Aktivitas Mingguan
        </div>
        <div className="flex items-end gap-1 h-[52px] mb-3.5 shrink-0">
          {dayCounts.map((c, i) => {
            const h = Math.max(4, Math.round((c / maxCount) * 48));
            const fill = c >= maxPerDay / 2;
            return (
              <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: h,
                    background: fill
                      ? "linear-gradient(180deg, #38BDF8, #818CF8)"
                      : "#1A2235",
                    boxShadow: fill ? "0 0 6px rgba(56,189,248,0.2)" : undefined,
                  }}
                />
                <div className="text-[10px] text-[--color-text-muted] font-medium">{DAYS_ID[i]}</div>
              </div>
            );
          })}
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 shrink-0">
          Per Kebiasaan
        </div>
        {habits.map((h) => {
          const done = logs.filter((l) => l.habit_id === h.id && l.completed).length;
          return (
            <div
              key={h.id}
              className="bg-[--color-bg-card] border border-[--color-border-base] rounded-[13px] p-3 mb-2 flex gap-3 items-center shrink-0"
            >
              <div className="text-[19px]">{h.icon}</div>
              <div className="flex-1 text-[13px]">{h.name}</div>
              <div className="text-[12px] text-[--color-accent-teal] font-bold">{done}/7</div>
            </div>
          );
        })}

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
