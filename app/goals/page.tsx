import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";

export default function GoalsPage() {
  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div
            className="jakarta font-extrabold"
            style={{ fontSize: "clamp(18px, 5vw, 21px)" }}
          >
            Tujuanku 🎯
          </div>
          <button className="w-9 h-9 rounded-[10px] glass flex items-center justify-center text-lg">
            ＋
          </button>
        </div>

        {/* Goal 1 */}
        <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-[17px] p-4 mb-3 relative overflow-hidden shrink-0">
          <span
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #38BDF8, #818CF8)" }}
          />
          <div
            className="jakarta font-bold mb-2.5 leading-[1.3]"
            style={{ fontSize: "clamp(12px, 4vw, 14px)" }}
          >
            Lari 5K dalam 2 Bulan
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex-1">
              <div className="h-[5px] bg-[--color-bg-lift] rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{ width: "40%", background: "linear-gradient(90deg, #38BDF8, #818CF8)" }}
                />
              </div>
            </div>
            <div className="text-[11px] text-[--color-accent-teal] font-bold shrink-0">40%</div>
          </div>
          <div className="flex flex-col gap-2">
            <Milestone state="done" text="Lari 1K tanpa berhenti" />
            <Milestone state="active" text="⟶ Tingkatkan ke 3K — Minggu 4" />
            <Milestone state="todo" text="Lari 5K penuh — Target 15 Juli" last />
          </div>
        </div>

        {/* Goal 2 */}
        <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-[17px] p-4 mb-3 relative overflow-hidden shrink-0">
          <span
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #FBBF24, #FB7185)" }}
          />
          <div
            className="jakarta font-bold mb-2.5 leading-[1.3]"
            style={{ fontSize: "clamp(12px, 4vw, 14px)" }}
          >
            Baca 12 Buku Tahun Ini
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex-1">
              <div className="h-[5px] bg-[--color-bg-lift] rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{ width: "33%", background: "linear-gradient(90deg, #FBBF24, #FB7185)" }}
                />
              </div>
            </div>
            <div className="text-[11px] text-[--color-accent-amber] font-bold shrink-0">4/12</div>
          </div>
          <div className="text-[12px] text-[--color-text-muted]">
            Terakhir: Atomic Habits · Maret
          </div>
        </div>

        <div className="text-center mt-4 shrink-0">
          <div className="text-[12px] text-[--color-text-muted] mb-2.5">Mau tambah tujuan baru?</div>
          <button
            className="jakarta font-bold text-[13px] text-white inline-block rounded-[22px] px-5 py-3"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #818CF8)",
              boxShadow: "0 4px 16px rgba(56,189,248,0.22)",
            }}
          >
            ✦ Breakdown dengan AI
          </button>
        </div>

        <BottomNav />
      </PhoneShell>
    </main>
  );
}

function Milestone({
  state,
  text,
  last,
}: {
  state: "done" | "active" | "todo";
  text: string;
  last?: boolean;
}) {
  const dotCls =
    state === "done"
      ? "bg-[--color-accent-emerald] border-[--color-accent-emerald]"
      : state === "active"
      ? "border-[--color-accent-teal]"
      : "border-[--color-text-muted]";

  const textCls =
    state === "done"
      ? "line-through text-[--color-text-muted]"
      : state === "active"
      ? "text-[--color-text-primary] font-medium"
      : "text-[--color-text-secondary]";

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex flex-col items-center pt-1">
        <div
          className={`w-[9px] h-[9px] rounded-full border-2 shrink-0 ${dotCls}`}
          style={state === "active" ? { boxShadow: "0 0 7px rgba(56,189,248,0.4)" } : undefined}
        />
        {!last && <div className="w-px h-[18px] bg-[--color-border-base] mt-1" />}
      </div>
      <div className={`text-[12px] leading-[1.4] ${textCls}`}>{text}</div>
    </div>
  );
}
