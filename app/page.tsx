import Link from "next/link";

const palette = [
  { c: "#080B10", n: "Void" },
  { c: "#111827", n: "Card" },
  { c: "#1A2235", n: "Lift" },
  { c: "#38BDF8", n: "Teal" },
  { c: "#818CF8", n: "Violet" },
  { c: "#34D399", n: "Emerald" },
  { c: "#FBBF24", n: "Amber" },
  { c: "#FB7185", n: "Rose" },
];

const screens = [
  { href: "/login", label: "01 — Login" },
  { href: "/onboarding", label: "02 — Onboarding" },
  { href: "/dashboard", label: "03 — Dashboard" },
  { href: "/checkin", label: "04 — Daily Check-in" },
  { href: "/goals", label: "05 — Goals" },
  { href: "/reflection", label: "06 — Weekly Reflection" },
];

export default function Home() {
  return (
    <main>
      <div className="text-center px-5 py-[clamp(32px,6vw,60px)] relative">
        <div
          className="inline-block jakarta uppercase font-bold text-[--color-accent-teal] border border-[rgba(56,189,248,0.3)] rounded-[20px] mb-5"
          style={{
            fontSize: "clamp(9px, 2vw, 11px)",
            letterSpacing: "2.5px",
            padding: "5px 14px",
            background: "rgba(56,189,248,0.06)",
          }}
        >
          UI / UX Mockup
        </div>
        <h1
          className="jakarta font-extrabold"
          style={{ fontSize: "clamp(22px, 4.5vw, 46px)", lineHeight: 1.15 }}
        >
          Habit AI — <span className="grad-text">Dark Theme</span>
        </h1>
        <p
          className="mt-3 text-[--color-text-secondary]"
          style={{ fontSize: "clamp(13px, 2vw, 15px)" }}
        >
          Next.js 16 · React 19 · Tailwind CSS v4
        </p>

        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {palette.map((p) => (
            <div key={p.n} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-[10px] border border-white/10"
                style={{ background: p.c }}
              />
              <div className="text-[10px] text-[--color-text-muted] font-medium">{p.n}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-20 flex flex-wrap gap-7 justify-center items-start">
        {screens.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex flex-col gap-2.5 w-[360px] shrink-0 group"
          >
            <div className="jakarta uppercase font-bold text-[10px] tracking-[2px] text-[--color-text-muted] pl-1 flex items-center gap-2 group-hover:text-[--color-accent-teal] transition">
              <span className="block w-3.5 h-px bg-current" />
              {s.label}
            </div>
            <div className="phone-shell aspect-[360/720] flex items-center justify-center transition group-hover:-translate-y-1">
              <div className="jakarta font-bold text-2xl grad-text">Buka →</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center px-5 py-6 border-t border-[--color-border-base] mx-6 text-[12px] text-[--color-text-muted]">
        Font: <span className="text-[--color-text-secondary]">Plus Jakarta Sans</span> ·{" "}
        <span className="text-[--color-text-secondary]">DM Sans</span> &nbsp;|&nbsp; Framework:{" "}
        <span className="text-[--color-text-secondary]">Next.js 16 + Tailwind CSS v4</span>
      </div>
    </main>
  );
}
