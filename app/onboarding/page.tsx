"use client";

import { PhoneShell } from "@/components/phone/PhoneShell";
import { useState, useTransition } from "react";
import { completeOnboarding } from "@/app/actions/onboarding.actions";

const categories = [
  { emoji: "💪", label: "Kesehatan" },
  { emoji: "🧠", label: "Produktivitas" },
  { emoji: "📚", label: "Belajar" },
  { emoji: "🧘", label: "Mindfulness" },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState(0);
  const [name, setName] = useState("");
  const [aiName, setAiName] = useState("Luna");
  const [step, setStep] = useState(0);
  const [pending, start] = useTransition();

  function submit() {
    const fd = new FormData();
    fd.set("name", name || "Teman");
    fd.set("ai_name", aiName || "Luna");
    fd.set("goal_category", categories[selected].label);
    start(() => completeOnboarding(fd));
  }

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
          <div className="jakarta font-extrabold" style={{ fontSize: "clamp(16px, 5vw, 20px)" }}>
            {step === 0 ? "Hai, siapa namamu?" : step === 1 ? "Beri aku nama" : "Apa fokusmu?"}
          </div>
          <div className="text-[12px] text-[--color-text-muted] mt-1">
            {step === 0
              ? "Aku akan jadi teman perjalananmu"
              : step === 1
              ? "Panggil aku apa saja yang kamu suka"
              : "Pilih satu untuk awal"}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 my-3.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-full ${
                i === step
                  ? "w-[18px] h-1.5 bg-[--color-accent-teal] rounded-[3px]"
                  : "w-1.5 h-1.5 bg-[--color-text-muted]"
              }`}
              style={i === step ? { boxShadow: "0 0 7px #38BDF8" } : undefined}
            />
          ))}
        </div>

        {step === 0 && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm w-full outline-none mb-2.5"
            placeholder="Nama panggilanmu"
          />
        )}

        {step === 1 && (
          <input
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm w-full outline-none mb-2.5"
            placeholder="Nama asistenmu (default: Luna)"
          />
        )}

        {step >= 2 && (
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
        )}

        <button
          onClick={() => (step < 2 ? setStep(step + 1) : submit())}
          disabled={pending || (step === 0 && !name)}
          className="block text-center w-full rounded-2xl py-3.5 jakarta text-sm font-bold text-white disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #818CF8)",
            boxShadow: "0 4px 16px rgba(56,189,248,0.22)",
          }}
        >
          {pending ? "Menyimpan…" : step < 2 ? "Lanjut →" : "Mulai"}
        </button>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="block text-center w-full glass rounded-2xl py-3 text-[13px] text-[--color-text-secondary] mt-2"
          >
            Kembali
          </button>
        )}
      </PhoneShell>
    </main>
  );
}
