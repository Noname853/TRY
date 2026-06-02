"use client";

import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { useState } from "react";

const moods = [
  { e: "😊", l: "Semangat" },
  { e: "😌", l: "Tenang" },
  { e: "😫", l: "Stres" },
  { e: "😴", l: "Lemas" },
];

export default function CheckinPage() {
  const [mood, setMood] = useState(0);

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex items-center gap-2.5 pt-2 pb-3.5 shrink-0">
          <div className="text-xl text-[--color-text-muted] cursor-pointer">←</div>
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #818CF8)",
              boxShadow: "0 0 18px rgba(56,189,248,0.3)",
            }}
          >
            🌿
          </div>
          <div>
            <div className="jakarta text-[15px] font-bold">Luna</div>
            <div className="text-[11px] text-[--color-accent-emerald] font-medium flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[--color-accent-emerald] inline-block"
                style={{ boxShadow: "0 0 7px #34D399" }}
              />
              Online
            </div>
          </div>
        </div>

        <div className="self-center text-[11px] text-[--color-text-muted] mb-3.5 glass rounded-[20px] px-3 py-1 font-medium shrink-0">
          Hari ini · Senin, 26 Mei
        </div>

        <div className="max-w-[82%] mb-2.5 mr-auto">
          <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl rounded-bl py-2.5 px-3.5 text-[13px] leading-[1.55]">
            Hai Rafi! Semangat Senin! 🌟 Gimana tidurnya tadi malam?
          </div>
          <div className="text-[10px] text-[--color-text-muted] mt-1 px-1 font-medium">07:02</div>
        </div>
        <div className="max-w-[82%] mb-2.5 ml-auto">
          <div
            className="rounded-2xl rounded-br py-2.5 px-3.5 text-[13px] leading-[1.55]"
            style={{
              background: "linear-gradient(135deg, #1E3A5F, #1B2F4E)",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
          >
            Lumayan sih, tidur jam 11. Agak kurang tapi oke
          </div>
          <div className="text-[10px] text-[--color-text-muted] mt-1 px-1 font-medium text-right">07:05</div>
        </div>
        <div className="max-w-[82%] mb-2.5 mr-auto">
          <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl rounded-bl py-2.5 px-3.5 text-[13px] leading-[1.55]">
            Oke, 7 jam cukup! Sekarang mood & energimu gimana?
          </div>
          <div className="text-[10px] text-[--color-text-muted] mt-1 px-1 font-medium">07:05</div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 my-3 shrink-0">
          {moods.map((m, i) => {
            const sel = i === mood;
            return (
              <button
                key={m.l}
                onClick={() => setMood(i)}
                className={`rounded-xl py-2 px-1 text-center border ${
                  sel
                    ? "border-[--color-accent-teal] bg-[rgba(56,189,248,0.08)]"
                    : "border-[--color-border-base] bg-[--color-bg-card]"
                }`}
              >
                <span className="text-[19px] block mb-1">{m.e}</span>
                <div
                  className={`text-[10px] font-medium ${
                    sel ? "text-[--color-accent-teal]" : "text-[--color-text-muted]"
                  }`}
                >
                  {m.l}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-1.5 flex-wrap my-2.5 shrink-0">
          {["Segar banget ⚡", "Biasa aja", "Masih ngantuk 😴"].map((q) => (
            <button
              key={q}
              className="glass rounded-[18px] px-3 py-1.5 text-[12px] text-[--color-accent-teal] font-medium"
              style={{ border: "1px solid rgba(56,189,248,0.2)" }}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center bg-[--color-bg-card] border border-[--color-border-base] rounded-[22px] px-3 py-2 mt-3.5 shrink-0">
          <input
            className="flex-1 bg-transparent outline-none text-[13px] text-[--color-text-primary] placeholder:text-[--color-text-muted]"
            placeholder="Ketik pesanmu..."
          />
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #38BDF8, #818CF8)" }}
          >
            ↑
          </button>
        </div>

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
