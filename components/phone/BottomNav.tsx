"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/checkin", icon: "💬", label: "Check-in" },
  { href: "/goals", icon: "🎯", label: "Goals" },
  { href: "/reflection", icon: "📊", label: "Refleksi" },
  { href: "/settings", icon: "⚙️", label: "Setting" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="mt-auto">
      <div
        className="flex border-t border-[--color-border-base] -mx-4 -mb-6 px-2.5 pt-2.5 pb-4"
        style={{ background: "rgba(13,17,23,0.97)" }}
      >
        {items.map((it) => {
          const active = pathname?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
            >
              <div
                className="text-[20px]"
                style={active ? { filter: "drop-shadow(0 0 5px rgba(56,189,248,0.65))" } : undefined}
              >
                {it.icon}
              </div>
              <div
                className={`text-[10px] font-medium ${
                  active ? "text-[--color-accent-teal]" : "text-[--color-text-muted]"
                }`}
              >
                {it.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
