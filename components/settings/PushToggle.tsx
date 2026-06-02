"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function PushToggle({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState(enabled);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function turnOn() {
    setBusy(true);
    setError(null);
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setError("Browser tidak mendukung notifikasi");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Izin notifikasi ditolak");
        return;
      }
      const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!pub) {
        setError("VAPID key belum dikonfigurasi");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pub),
      });
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!res.ok) {
        setError("Gagal menyimpan subscription");
      } else {
        setState(true);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker?.ready;
      const sub = await reg?.pushManager.getSubscription();
      await sub?.unsubscribe();
      await fetch("/api/notifications/subscribe", { method: "DELETE" });
      setState(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="text-[11px] text-[--color-text-muted] mb-2 uppercase tracking-[1.5px] font-bold">
        Push Notification
      </div>
      <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl p-3 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[13px] font-medium">
              {state ? "Aktif ✓" : "Belum aktif"}
            </div>
            <div className="text-[11px] text-[--color-text-muted] mt-0.5">
              Aktifkan untuk menerima pengingat
            </div>
          </div>
          <button
            disabled={busy}
            onClick={state ? turnOff : turnOn}
            className={`rounded-xl px-3 py-2 text-[12px] font-bold disabled:opacity-60 ${
              state ? "bg-[--color-bg-lift] text-[--color-text-secondary]" : "text-white"
            }`}
            style={
              state
                ? undefined
                : { background: "linear-gradient(135deg, #38BDF8, #818CF8)" }
            }
          >
            {busy ? "…" : state ? "Matikan" : "Aktifkan"}
          </button>
        </div>
        {error && <div className="text-[11px] text-[--color-accent-rose] mt-2">{error}</div>}
      </div>
    </>
  );
}
