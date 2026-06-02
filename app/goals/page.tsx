import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { GoalForm } from "@/components/goals/GoalForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { GoalRow, Milestone } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const goals = (data ?? []) as GoalRow[];

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div className="jakarta font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 21px)" }}>
            Tujuanku 🎯
          </div>
        </div>

        {goals.length === 0 && (
          <div className="text-center py-6 text-[12px] text-[--color-text-muted]">
            Belum ada tujuan. Ceritakan apa yang ingin kamu capai 👇
          </div>
        )}

        {goals.map((g) => {
          const ms = (g.milestones ?? []) as Milestone[];
          const done = ms.filter((m) => m.completed).length;
          const pct = ms.length ? Math.round((done / ms.length) * 100) : 0;
          return (
            <div
              key={g.id}
              className="bg-[--color-bg-card] border border-[--color-border-base] rounded-[17px] p-4 mb-3 relative overflow-hidden shrink-0"
            >
              <span
                className="absolute top-0 inset-x-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #38BDF8, #818CF8)" }}
              />
              <div className="jakarta font-bold mb-2.5 leading-[1.3]" style={{ fontSize: "clamp(12px, 4vw, 14px)" }}>
                {g.title}
              </div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex-1">
                  <div className="h-[5px] bg-[--color-bg-lift] rounded overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{ width: `${pct}%`, background: "linear-gradient(90deg, #38BDF8, #818CF8)" }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-[--color-accent-teal] font-bold shrink-0">{pct}%</div>
              </div>
              <div className="flex flex-col gap-2">
                {ms.map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`w-[9px] h-[9px] rounded-full border-2 shrink-0 ${
                          m.completed
                            ? "bg-[--color-accent-emerald] border-[--color-accent-emerald]"
                            : "border-[--color-text-muted]"
                        }`}
                      />
                      {i < ms.length - 1 && <div className="w-px h-[18px] bg-[--color-border-base] mt-1" />}
                    </div>
                    <div
                      className={`text-[12px] leading-[1.4] ${
                        m.completed ? "line-through text-[--color-text-muted]" : "text-[--color-text-secondary]"
                      }`}
                    >
                      <span className="font-medium text-[--color-text-primary]">{m.title}</span>
                      {m.week && <span className="text-[--color-text-muted]"> · {m.week}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <GoalForm />

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
