"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GoalForm() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const router = useRouter();

  async function submit() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal membuat goal");
      } else {
        setReaction(json.reaction ?? "Tujuan baru tersimpan ✨");
        setText("");
        setTimeout(() => {
          setOpen(false);
          setReaction(null);
          router.refresh();
        }, 1500);
      }
    } catch {
      setError("Jaringan bermasalah");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <div className="text-center mt-4 shrink-0">
        <div className="text-[12px] text-[--color-text-muted] mb-2.5">Mau tambah tujuan baru?</div>
        <button
          onClick={() => setOpen(true)}
          className="jakarta font-bold text-[13px] text-white inline-block rounded-[22px] px-5 py-3"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #818CF8)",
            boxShadow: "0 4px 16px rgba(56,189,248,0.22)",
          }}
        >
          ✦ Breakdown dengan AI
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl p-3 mb-3 mt-4 shrink-0">
      <div className="text-[11px] text-[--color-accent-teal] font-bold uppercase tracking-[1.5px] mb-2">
        ✦ Ceritakan tujuanmu
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Contoh: aku ingin lari 5K dalam 2 bulan"
        rows={3}
        className="w-full bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-3 py-2 text-sm outline-none resize-none"
      />
      {error && <div className="text-[12px] text-[--color-accent-rose] mt-2">{error}</div>}
      {reaction && <div className="text-[12px] text-[--color-accent-emerald] mt-2">{reaction}</div>}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 glass rounded-xl py-2 text-[13px] text-[--color-text-secondary]"
        >
          Batal
        </button>
        <button
          onClick={submit}
          disabled={loading || !text.trim()}
          className="flex-1 rounded-xl py-2 text-[13px] font-bold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #38BDF8, #818CF8)" }}
        >
          {loading ? "AI sedang berpikir…" : "Breakdown"}
        </button>
      </div>
    </div>
  );
}
