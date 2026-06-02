"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chat.store";
import type { ChatMessage } from "@/lib/supabase/types";

const moods = [
  { e: "😊", l: "Semangat" },
  { e: "😌", l: "Tenang" },
  { e: "😫", l: "Stres" },
  { e: "😴", l: "Lemas" },
];

const dateLabel = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

type Props = {
  aiName: string;
  initialMessages: ChatMessage[];
};

export function CheckinChat({ aiName, initialMessages }: Props) {
  const messages = useChatStore((s) => s.messages);
  const loading = useChatStore((s) => s.loading);
  const setMessages = useChatStore((s) => s.setMessages);
  const send = useChatStore((s) => s.send);

  const [input, setInput] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hai! Aku ${aiName} ✨ Gimana harimu sejauh ini?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages(initialMessages);
    }
  }, [aiName, initialMessages, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, loading]);

  function submit() {
    if (!input.trim() || loading) return;
    const content = input;
    setInput("");
    send({
      content,
      mood: mood !== null ? moods[mood].l : undefined,
    });
  }

  return (
    <>
      <div className="flex items-center gap-2.5 pt-2 pb-3.5 shrink-0">
        <div
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-lg shrink-0"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #818CF8)",
            boxShadow: "0 0 18px rgba(56,189,248,0.3)",
          }}
        >
          🌿
        </div>
        <div>
          <div className="jakarta text-[15px] font-bold">{aiName}</div>
          <div className="text-[11px] text-[--color-accent-emerald] font-medium flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[--color-accent-emerald] inline-block"
              style={{ boxShadow: "0 0 7px #34D399" }}
            />
            Online
          </div>
        </div>
      </div>

      <div className="self-center text-[11px] text-[--color-text-muted] mb-3.5 glass rounded-[20px] px-3 py-1 font-medium shrink-0">
        Hari ini · {dateLabel}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin -mx-1 px-1">
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div key={i} className={`max-w-[82%] mb-2.5 ${isUser ? "ml-auto" : "mr-auto"}`}>
              <div
                className={`py-2.5 px-3.5 text-[13px] leading-[1.55] ${
                  isUser
                    ? "rounded-2xl rounded-br"
                    : "bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl rounded-bl"
                }`}
                style={
                  isUser
                    ? {
                        background: "linear-gradient(135deg, #1E3A5F, #1B2F4E)",
                        border: "1px solid rgba(56,189,248,0.2)",
                      }
                    : undefined
                }
              >
                {m.content}
              </div>
              <div
                className={`text-[10px] text-[--color-text-muted] mt-1 px-1 font-medium ${
                  isUser ? "text-right" : ""
                }`}
              >
                {formatTime(m.timestamp)}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="max-w-[82%] mb-2.5 mr-auto">
            <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl rounded-bl py-2.5 px-3.5 text-[13px] text-[--color-text-muted]">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:120ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:240ms]" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 my-3 shrink-0">
        {moods.map((m, i) => {
          const sel = i === mood;
          return (
            <button
              key={m.l}
              onClick={() => setMood(sel ? null : i)}
              className={`rounded-xl py-2 px-1 text-center border ${
                sel
                  ? "border-[--color-accent-teal] bg-[rgba(56,189,248,0.08)]"
                  : "border-[--color-border-base] bg-[--color-bg-card]"
              }`}
            >
              <span className="text-[19px] block mb-1">{m.e}</span>
              <div
                className={`text-[10px] font-medium ${
                  sel ? "text-[--color-accent-teal]" : "text-[--color-text-muted]"
                }`}
              >
                {m.l}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 items-center bg-[--color-bg-card] border border-[--color-border-base] rounded-[22px] px-3 py-2 mt-3.5 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="flex-1 bg-transparent outline-none text-[13px] text-[--color-text-primary] placeholder:text-[--color-text-muted]"
          placeholder="Ketik pesanmu..."
        />
        <button
          onClick={submit}
          disabled={loading || !input.trim()}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #38BDF8, #818CF8)" }}
        >
          ↑
        </button>
      </div>
    </>
  );
}
