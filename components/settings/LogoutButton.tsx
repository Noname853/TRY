"use client";

import { logoutAction } from "@/app/actions/auth.actions";
import { useTransition } from "react";

export function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => logoutAction())}
      disabled={pending}
      className="w-full glass rounded-2xl py-3 text-[13px] text-[--color-accent-rose] disabled:opacity-60 mt-2"
    >
      {pending ? "…" : "Keluar"}
    </button>
  );
}
