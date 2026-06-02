"use client";

import { PhoneShell } from "@/components/phone/PhoneShell";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions/auth.actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, null);

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="text-center pt-7 pb-4">
          <div className="text-[46px] mb-3">🌿</div>
          <div
            className="jakarta font-extrabold grad-text"
            style={{ fontSize: "clamp(22px, 6vw, 27px)" }}
          >
            HabitAI
          </div>
          <div className="text-[12px] text-[--color-text-muted] mt-1">
            Teman perjalananmu setiap hari
          </div>
        </div>

        <form action={formAction} className="contents">
          <input
            name="email"
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm text-[--color-text-primary] w-full outline-none mb-2.5 focus:border-[rgba(56,189,248,0.4)]"
            placeholder="Email kamu"
            type="email"
            required
          />
          <input
            name="password"
            className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl px-4 py-3 text-sm text-[--color-text-primary] w-full outline-none mb-2.5"
            placeholder="Password"
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
              letterSpacing: "0.3px",
            }}
          >
            {pending ? "Memproses…" : "Masuk"}
          </button>
        </form>

        <div className="flex items-center gap-2.5 my-3">
          <div className="flex-1 h-px bg-[--color-border-base]" />
          <div className="text-[11px] text-[--color-text-muted] font-medium">atau</div>
          <div className="flex-1 h-px bg-[--color-border-base]" />
        </div>

        <Link
          href="/register"
          className="block text-center w-full bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl py-3 text-[13px] text-[--color-text-secondary]"
        >
          Buat akun baru
        </Link>

        <div className="text-center mt-4 text-[12px] text-[--color-text-muted]">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[--color-accent-teal] font-semibold">
            Daftar
          </Link>
        </div>
      </PhoneShell>
    </main>
  );
}
