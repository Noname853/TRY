import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";

type Habit = {
  icon: string;
  name: string;
  meta: string;
  streak?: { text: string; teal?: boolean };
  done?: boolean;
  progress?: number;
};

const habits: Habit[] = [
  { icon: "🏃", name: "Olahraga", meta: "30 menit", streak: { text: "🔥 12 hari", teal: true }, done: true },
  { icon: "📖", name: "Baca Buku", meta: "20 halaman", streak: { text: "🔥 7 hari" }, progress: 60 },
  { icon: "💊", name: "Vitamin", meta: "1 tablet pagi" },
];

export default function DashboardPage() {
  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div>
            <div className="text-[11px] text-[--color-text-muted] mb-0.5 font-medium">
              Selamat pagi 👋
            </div>
            <div
              className="jakarta font-extrabold"
              style={{ fontSize: "clamp(18px, 5vw, 21px)", lineHeight: 1.2 }}
            >
              Rafi
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="w-9 h-9 rounded-[10px] glass flex items-center justify-center text-base relative">
              🔔
              <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] bg-[--color-accent-rose] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                2
              </span>
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[--color-bg-void]"
              style={{
                background: "linear-gradient(135deg, #38BDF8, #818CF8)",
                boxShadow: "0 0 12px rgba(56,189,248,0.25)",
              }}
            >
              R
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3.5 shrink-0">
          {[
            { n: "12", d: "🔥 Streak" },
            { n: "78%", d: "📊 Minggu ini" },
            { n: "4", d: "✅ Selesai" },
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
            ✦ Insight dari Luna
          </div>
          <div className="text-[13px] leading-[1.55]">
            Pagi Rafi! Streak <strong className="font-semibold text-[--color-accent-teal]">12 hari</strong>-mu luar
            biasa. Hari Senin biasanya berat buatmu — yuk mulai dengan olahraga ringan dulu ya 💪
          </div>
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 mt-3.5 shrink-0">
          Kebiasaan Hari Ini
        </div>

        {habits.map((h) => (
          <div
            key={h.name}
            className={`flex items-center gap-3 rounded-2xl py-3 px-3 mb-2 relative overflow-hidden shrink-0 border ${
              h.done
                ? "border-[rgba(52,211,153,0.22)]"
                : "border-[--color-border-base] bg-[--color-bg-card]"
            }`}
            style={
              h.done
                ? { background: "linear-gradient(90deg, rgba(52,211,153,0.05), #111827)" }
                : undefined
            }
          >
            {h.done && (
              <span
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
                style={{ background: "linear-gradient(180deg, #34D399, #38BDF8)" }}
              />
            )}
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[--color-bg-lift] flex items-center justify-center text-lg shrink-0">
              {h.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{h.name}</div>
              <div className="text-[11px] text-[--color-text-muted] flex items-center gap-1.5 flex-wrap">
                {h.meta}
                {h.streak && (
                  <span
                    className={`rounded px-1.5 py-px text-[10px] font-semibold ${
                      h.streak.teal
                        ? "bg-[rgba(56,189,248,0.12)] text-[--color-accent-teal]"
                        : "bg-[rgba(251,191,36,0.15)] text-[--color-accent-amber]"
                    }`}
                  >
                    {h.streak.text}
                  </span>
                )}
              </div>
              {h.progress !== undefined && (
                <div className="h-[3px] bg-[--color-bg-lift] rounded mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${h.progress}%`,
                      background: "linear-gradient(90deg, #38BDF8, #818CF8)",
                    }}
                  />
                </div>
              )}
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                h.done
                  ? "bg-[--color-accent-emerald] border-[--color-accent-emerald] text-black"
                  : "border-[--color-text-muted]"
              }`}
              style={h.done ? { boxShadow: "0 0 10px rgba(52,211,153,0.4)" } : undefined}
            >
              {h.done ? "✓" : ""}
            </div>
          </div>
        ))}

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
