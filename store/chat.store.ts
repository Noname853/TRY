"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/lib/supabase/types";

type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
  setMessages: (m: ChatMessage[]) => void;
  appendUser: (content: string) => void;
  appendAI: (content: string) => void;
  setLoading: (v: boolean) => void;
  send: (input: { content: string; mood?: string; energy?: string }) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
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
    set({ loading: true });
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content, mood, energy }),
      });
      const json = await res.json();
      if (json.reply?.content) {
        get().appendAI(json.reply.content);
      } else if (json.error) {
        get().appendAI(`⚠️ ${json.error}`);
      }
    } finally {
      set({ loading: false });
    }
  },
}));
