import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";

const days = [
  { d: "Sen", h: 30, fill: true },
  { d: "Sel", h: 44, fill: true },
  { d: "Rab", h: 12, fill: false },
  { d: "Kam", h: 38, fill: true },
  { d: "Jum", h: 44, fill: true },
  { d: "Sab", h: 8, fill: false },
  { d: "Min", h: 28, fill: true },
];

export default function ReflectionPage() {
  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div
            className="jakarta font-extrabold"
            style={{ fontSize: "clamp(18px, 5vw, 21px)" }}
          >
            Refleksi 📊
          </div>
          <div className="text-[12px] text-[--color-text-muted] font-medium">Mei #4</div>
        </div>

        <div
          className="rounded-[17px] py-4 px-3.5 mb-3.5 text-center relative overflow-hidden shrink-0 border"
          style={{
            background: "linear-gradient(135deg, rgba(129,140,248,0.13), rgba(56,189,248,0.07))",
            borderColor: "rgba(129,140,248,0.2)",
          }}
        >
          <div className="text-[10px] text-[--color-accent-violet] font-bold uppercase tracking-[1.5px] mb-2">
            Minggu 19–25 Mei
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
            78
          </div>
          <div className="text-[12px] text-[--color-text-muted] mt-1 font-medium">
            Completion Rate
          </div>
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 shrink-0">
          Aktivitas Mingguan
        </div>
        <div className="flex items-end gap-1 h-[52px] mb-3.5 shrink-0">
          {days.map((d) => (
            <div key={d.d} className="flex-1 flex flex-col gap-1 items-center">
              <div
                className="w-full rounded-t min-h-[4px]"
                style={{
                  height: d.h,
                  background: d.fill
                    ? "linear-gradient(180deg, #38BDF8, #818CF8)"
                    : "#1A2235",
                  boxShadow: d.fill ? "0 0 6px rgba(56,189,248,0.2)" : undefined,
                }}
              />
              <div className="text-[10px] text-[--color-text-muted] font-medium">{d.d}</div>
            </div>
          ))}
        </div>

        <div className="jakarta text-[11px] font-bold uppercase tracking-[1.5px] text-[--color-text-muted] mb-2.5 shrink-0">
          Insight Luna
        </div>

        <InsightBox
          icon="🏆"
          type="Pencapaian"
          desc="Streak olahraga terpanjangmu — 12 hari berturut! Ini rekor baru Rafi 🎉"
        />
        <InsightBox
          icon="🔍"
          type="Pola Ditemukan"
          desc="Rabu & Sabtu jadi titik lemahmu. Coba set reminder lebih awal di dua hari itu."
        />

        <BottomNav />
      </PhoneShell>
    </main>
  );
}

function InsightBox({ icon, type, desc }: { icon: string; type: string; desc: string }) {
  return (
    <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-[13px] p-3 mb-2 flex gap-3 items-start shrink-0">
      <div className="text-[19px] shrink-0 mt-px">{icon}</div>
      <div>
        <div className="text-[10px] text-[--color-text-muted] mb-1 uppercase tracking-[1.2px] font-semibold">
          {type}
        </div>
        <div className="text-[12px] text-[--color-text-primary] leading-[1.55]">{desc}</div>
      </div>
    </div>
  );
}
