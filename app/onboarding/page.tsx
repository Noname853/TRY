"use client";

import { PhoneShell } from "@/components/phone/PhoneShell";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { emoji: "💪", label: "Kesehatan" },
  { emoji: "🧠", label: "Produktivitas" },
  { emoji: "📚", label: "Belajar" },
  { emoji: "🧘", label: "Mindfulness" },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState(0);
  const [name, setName] = useState("Rafi");

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="text-center pt-4 pb-2">
          <div className="w-[76px] h-[76px] rounded-full mx-auto mb-3.5 orb-spin flex items-center justify-center"
            style={{
              background: "conic-gradient(from 0deg, #38BDF8, #818CF8, #38BDF8)",
              boxShadow: "0 0 36px rgba(56,189,248,0.22)",
            }}>
            <div className="w-[63px] h-[63px] rounded-full bg-[--color-bg-deep] flex items-center justify-center text-[28px]">
              🌿
            </div>
          </div>
          <div
            className="jakarta font-extrabold"
            style={{ fontSize: "clamp(16px, 5vw, 20px)" }}
          >
            Hai, siapa namamu?
          </div>
          <div className="text-[12px] text-[--color-text-muted] mt-1">
            Aku akan jadi teman perjalananmu
          </div>
        </div>

        <div className="flex justify-center gap-1.5 my-3.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-full ${
                i === 0 ? "w-[18px] h-1.5 bg-[--color-accent-teal] rounded-[3px]" : "w-1.5 h-1.5 bg-[--color-text-muted]"
              }`}
              style={i === 0 ? { boxShadow: "0 0 7px #38BDF8" } : undefined}
            />
          ))}
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm text-[--color-text-primary] w-full outline-none mb-2.5"
          placeholder="Nama panggilanmu"
        />

        <div className="my-3 text-[12px] text-[--color-text-muted] font-medium">
          Tujuan utama kamu:
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3.5">
          {categories.map((c, i) => {
            const isSel = i === selected;
            return (
              <button
                key={c.label}
                onClick={() => setSelected(i)}
                className={`rounded-[13px] py-3 px-2 text-center border ${
                  isSel
                    ? "border-[--color-accent-teal] bg-[rgba(56,189,248,0.08)]"
                    : "border-[--color-border-base] bg-[--color-bg-card]"
                }`}
              >
                <div className="text-[22px] mb-1">{c.emoji}</div>
                <div
                  className={`text-[12px] font-medium ${
                    isSel ? "text-[--color-accent-teal]" : "text-[--color-text-secondary]"
                  }`}
                >
                  {c.label}
                </div>
              </button>
            );
          })}
        </div>

        <Link
          href="/dashboard"
          className="block text-center w-full rounded-2xl py-3.5 jakarta text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #818CF8)",
            boxShadow: "0 4px 16px rgba(56,189,248,0.22)",
          }}
        >
          Lanjut →
        </Link>
        <Link
          href="/dashboard"
          className="block text-center w-full glass rounded-2xl py-3 text-[13px] text-[--color-text-secondary] mt-2"
        >
          Lewati
        </Link>
      </PhoneShell>
    </main>
  );
}
