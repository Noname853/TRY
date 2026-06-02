"use client";

import { PhoneShell } from "@/components/phone/PhoneShell";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type ActionState } from "@/app/actions/auth.actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(registerAction, null);

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="text-center pt-7 pb-4">
          <div className="text-[46px] mb-3">🌿</div>
          <div
            className="jakarta font-extrabold grad-text"
            style={{ fontSize: "clamp(22px, 6vw, 27px)" }}
          >
            Buat akun
          </div>
          <div className="text-[12px] text-[--color-text-muted] mt-1">
            Mulai perjalananmu hari ini
          </div>
        </div>

        <form action={formAction} className="contents">
          <input
            name="name"
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm w-full outline-none mb-2.5"
            placeholder="Nama panggilanmu"
          />
          <input
            name="email"
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm w-full outline-none mb-2.5"
            placeholder="Email"
            type="email"
            required
          />
          <input
            name="password"
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm w-full outline-none mb-2.5"
            placeholder="Password (min 6 karakter)"
            type="password"
            required
          />
          {state?.error && (
            <div className="text-[12px] text-[--color-accent-rose] mb-2">{state.error}</div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="block text-center w-full rounded-2xl py-3.5 jakarta text-sm font-bold text-white disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #818CF8)",
              boxShadow: "0 4px 16px rgba(56,189,248,0.22)",
            }}
          >
            {pending ? "Memproses…" : "Daftar"}
          </button>
        </form>

        <div className="text-center mt-4 text-[12px] text-[--color-text-muted]">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[--color-accent-teal] font-semibold">
            Masuk
          </Link>
        </div>
      </PhoneShell>
    </main>
  );
}
