import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { HabitRow } from "@/components/habits/HabitRow";
import { HabitForm } from "@/components/habits/HabitForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calcStreak, weeklyCompletionRate } from "@/lib/streak";
import { shiftDays, todayISO, weekRange } from "@/lib/date";
import type { HabitLogRow, HabitRow as HabitRowT } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = todayISO();
  const { start } = weekRange(today);

  const [profileRes, habitsRes, logsRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("habit_logs")
      .select("habit_id,date,completed")
      .eq("user_id", user.id)
      .gte("date", shiftDays(today, -45)),
  ]);

  const profile = profileRes.data;
  if (profile && !profile.onboarding_completed) redirect("/onboarding");

  const habits = (habitsRes.data ?? []) as HabitRowT[];
  const logs = (logsRes.data ?? []) as Pick<HabitLogRow, "habit_id" | "date" | "completed">[];

  const rows = habits.map((h) => {
    const hLogs = logs.filter((l) => l.habit_id === h.id);
    const done = hLogs.some((l) => l.date === today && l.completed);
    const streak = calcStreak(hLogs);
    return { ...h, done, streak };
  });

  const completedToday = rows.filter((r) => r.done).length;
  const maxStreak = rows.length ? Math.max(...rows.map((r) => r.streak)) : 0;
  const rate = weeklyCompletionRate(logs, habits.length, start);

  const greeting = (() => {
    const h = new Date().getUTCHours() + 7;
    if (h < 11) return "Selamat pagi 👋";
    if (h < 15) return "Selamat siang 👋";
    if (h < 19) return "Selamat sore 👋";
    return "Selamat malam 🌙";
  })();

  const displayName = profile?.name ?? "Teman";
  const aiName = profile?.ai_name ?? "Luna";

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div>
            <div className="text-[11px] text-[--color-text-muted] mb-0.5 font-medium">
              {greeting}
            </div>
            <div
              className="jakarta font-extrabold"
              style={{ fontSize: "clamp(18px, 5vw, 21px)", lineHeight: 1.2 }}
            >
              {displayName}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[--color-bg-void]"
              style={{
                background: "linear-gradient(135deg, #38BDF8, #818CF8)",
                boxShadow: "0 0 12px rgba(56,189,248,0.25)",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3.5 shrink-0">
          {[
            { n: String(maxStreak), d: "🔥 Streak" },
            { n: `${rate}%`, d: "📊 Minggu ini" },
            { n: String(completedToday), d: "✅ Selesai" },
          ].map((s) => (
            <div
              key={s.d}
              className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl py-3 px-2 text-center"
            >
              <div
                className="jakarta font-extrabold grad-text"
                style={{ fontSize: "clamp(16px, 4.5vw, 21px)", lineHeight: 1.2 }}
              >
                {s.n}
              </div>
              <div className="text-[10px] text-[--color-text-muted] mt-1 font-medium">{s.d}</div>
            </div>
          ))}
        </div>

        <div
          className="border rounded-2xl p-3.5 mb-3.5 relative overflow-hidden shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.08))",
            borderColor: "rgba(56,189,248,0.2)",
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[--color-accent-teal] mb-1.5">
            ✦ Insight dari {aiName}
          </div>
          <div className="text-[13px] leading-[1.55]">
            {maxStreak >= 3 ? (
              <>
                Streak{" "}
                <strong className="font-semibold text-[--color-accent-teal]">{maxStreak} hari</strong>
                -mu keren! Pertahankan momentum hari ini ya 💪
              </>
            ) : habits.length === 0 ? (
              <>Yuk mulai dengan satu kebiasaan kecil dulu — konsistensi lebih penting dari ukuran 🌱</>
            ) : (
              <>Hari baru, satu langkah kecil. Kamu pasti bisa 💫</>
            )}
          </div>
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 mt-3.5 shrink-0">
          Kebiasaan Hari Ini
        </div>

        {rows.map((r) => (
          <HabitRow
            key={r.id}
            id={r.id}
            icon={r.icon}
            name={r.name}
            target={r.target}
            streak={r.streak}
            done={r.done}
          />
        ))}

        <HabitForm />

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
