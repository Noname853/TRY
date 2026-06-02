"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Init = {
  name: string;
  ai_name: string;
  notification_time_morning: string;
  notification_time_evening: string;
  ai_notifications_enabled: boolean;
};

export function SettingsForm({ initial }: { initial: Init }) {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  function save() {
    start(async () => {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 1500);
      }
    });
  }

  return (
    <>
      <div className="text-[11px] text-[--color-text-muted] mb-2 uppercase tracking-[1.5px] font-bold">
        Profil
      </div>
      <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl p-3 mb-4 flex flex-col gap-3">
        <Field label="Nama">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-3 py-2 text-sm outline-none w-full"
          />
        </Field>
        <Field label="Nama Asisten">
          <input
            value={form.ai_name}
            onChange={(e) => setForm({ ...form, ai_name: e.target.value })}
            className="bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-3 py-2 text-sm outline-none w-full"
          />
        </Field>
      </div>

      <div className="text-[11px] text-[--color-text-muted] mb-2 uppercase tracking-[1.5px] font-bold">
        Notifikasi
      </div>
      <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl p-3 mb-4 flex flex-col gap-3">
        <Field label="Pengingat Pagi">
          <input
            type="time"
            value={form.notification_time_morning}
            onChange={(e) =>
              setForm({ ...form, notification_time_morning: e.target.value })
            }
            className="bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-3 py-2 text-sm outline-none w-full"
          />
        </Field>
        <Field label="Pengingat Malam">
          <input
            type="time"
            value={form.notification_time_evening}
            onChange={(e) =>
              setForm({ ...form, notification_time_evening: e.target.value })
            }
            className="bg-[--color-bg-lift] border border-[--color-border-base] rounded-xl px-3 py-2 text-sm outline-none w-full"
          />
        </Field>
        <label className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-[--color-text-secondary]">
            Notifikasi pintar AI
          </span>
          <input
            type="checkbox"
            checked={form.ai_notifications_enabled}
            onChange={(e) =>
              setForm({ ...form, ai_notifications_enabled: e.target.checked })
            }
            className="w-4 h-4"
          />
        </label>
      </div>

      <button
        onClick={save}
        disabled={pending}
        className="w-full rounded-2xl py-3 jakarta text-sm font-bold text-white disabled:opacity-60 mb-2"
        style={{ background: "linear-gradient(135deg, #38BDF8, #818CF8)" }}
      >
        {pending ? "Menyimpan…" : saved ? "Tersimpan ✓" : "Simpan perubahan"}
      </button>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] text-[--color-text-muted] uppercase tracking-wide">
        {label}
      </span>
      {children}
    </label>
  );
}
