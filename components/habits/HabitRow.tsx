"use client";

import { useTransition } from "react";
import { toggleHabitLog } from "@/app/actions/habit.actions";

type Props = {
  id: string;
  icon: string;
  name: string;
  target: string | null;
  streak: number;
  done: boolean;
};

export function HabitRow({ id, icon, name, target, streak, done }: Props) {
  const [pending, start] = useTransition();

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl py-3 px-3 mb-2 relative overflow-hidden shrink-0 border ${
        done
          ? "border-[rgba(52,211,153,0.22)]"
          : "border-[--color-border-base] bg-[--color-bg-card]"
      }`}
      style={
        done
          ? { background: "linear-gradient(90deg, rgba(52,211,153,0.05), #111827)" }
          : undefined
      }
    >
      {done && (
        <span
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
          style={{ background: "linear-gradient(180deg, #34D399, #38BDF8)" }}
        />
      )}
      <div className="w-[38px] h-[38px] rounded-[10px] bg-[--color-bg-lift] flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate">{name}</div>
        <div className="text-[11px] text-[--color-text-muted] flex items-center gap-1.5 flex-wrap">
          {target ?? ""}
          {streak > 0 && (
            <span
              className={`rounded px-1.5 py-px text-[10px] font-semibold ${
                done
                  ? "bg-[rgba(56,189,248,0.12)] text-[--color-accent-teal]"
                  : "bg-[rgba(251,191,36,0.15)] text-[--color-accent-amber]"
              }`}
            >
              🔥 {streak} hari
            </span>
          )}
        </div>
      </div>
      <button
        disabled={pending}
        onClick={() => start(() => toggleHabitLog(id, !done))}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
          done
            ? "bg-[--color-accent-emerald] border-[--color-accent-emerald] text-black"
            : "border-[--color-text-muted]"
        }`}
        style={done ? { boxShadow: "0 0 10px rgba(52,211,153,0.4)" } : undefined}
      >
        {done ? "✓" : ""}
      </button>
    </div>
  );
}
