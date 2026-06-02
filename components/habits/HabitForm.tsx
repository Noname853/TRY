"use client";

import { useState, useTransition } from "react";
import { createHabit } from "@/app/actions/habit.actions";

export function HabitForm() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full glass rounded-2xl py-3 text-[13px] text-[--color-text-secondary] mb-2"
      >
        ＋ Tambah kebiasaan
      </button>
    );
  }

  return (
    <form
      action={(fd) =>
        start(async () => {
          await createHabit(fd);
          setOpen(false);
        })
      }
      className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl p-3 mb-2 flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <input
          name="icon"
          maxLength={4}
          defaultValue="✨"
          className="w-12 bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-2 py-2 text-sm outline-none text-center"
        />
        <input
          name="name"
          required
          placeholder="Nama kebiasaan"
          className="flex-1 bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-3 py-2 text-sm outline-none"
        />
      </div>
      <input
        name="target"
        placeholder="Target (cth: 30 menit)"
        className="bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-3 py-2 text-sm outline-none"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 glass rounded-xl py-2 text-[13px] text-[--color-text-secondary]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-xl py-2 text-[13px] font-bold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #38BDF8, #818CF8)" }}
        >
          {pending ? "…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
