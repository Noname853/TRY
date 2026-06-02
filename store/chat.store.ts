"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/lib/supabase/types";

type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
  streaming: boolean;
  setMessages: (m: ChatMessage[]) => void;
  appendUser: (content: string) => void;
  appendAI: (content: string) => void;
  setLoading: (v: boolean) => void;
  send: (input: { content: string; mood?: string; energy?: string }) => Promise<void>;
};

/**
 * Append potongan teks ke pesan AI terakhir (dipakai saat streaming).
 * Kalau pesan terakhir bukan dari AI, buat bubble baru.
 */
function appendDelta(messages: ChatMessage[], delta: string): ChatMessage[] {
  const last = messages[messages.length - 1];
  if (last && last.role === "assistant") {
    const updated = { ...last, content: last.content + delta };
    return [...messages.slice(0, -1), updated];
  }
  return [
    ...messages,
    { role: "assistant", content: delta, timestamp: new Date().toISOString() },
  ];
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  streaming: false,
  setMessages: (messages) => set({ messages }),
  appendUser: (content) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { role: "user", content, timestamp: new Date().toISOString() },
      ],
    })),
  appendAI: (content) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { role: "assistant", content, timestamp: new Date().toISOString() },
      ],
    })),
  setLoading: (loading) => set({ loading }),
  send: async ({ content, mood, energy }) => {
    if (!content.trim() || get().loading) return;
    get().appendUser(content);
    set({ loading: true, streaming: false });

    try {
      const res = await fetch("/api/checkin/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content, mood, energy }),
      });

      if (!res.ok || !res.body) {
        // Fallback: coba endpoint non-streaming agar UX tetap berfungsi.
        const fb = await fetch("/api/checkin", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content, mood, energy }),
        });
        const json = await fb.json().catch(() => ({}));
        if (json.reply?.content) {
          get().appendAI(json.reply.content);
        } else {
          get().appendAI(`⚠️ ${json.error ?? "Gagal mengirim pesan"}`);
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      set({ streaming: true });
      let received = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        received = true;
        set((s) => ({ messages: appendDelta(s.messages, chunk) }));
      }

      // Flush sisa byte di decoder
      const tail = decoder.decode();
      if (tail) {
        set((s) => ({ messages: appendDelta(s.messages, tail) }));
        received = true;
      }

      if (!received) {
        get().appendAI("⚠️ Tidak ada respon dari server");
      }
    } catch (err) {
      console.error(err);
      get().appendAI("⚠️ Koneksi terputus. Coba lagi.");
    } finally {
      set({ loading: false, streaming: false });
    }
  },
}));
