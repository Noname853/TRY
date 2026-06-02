"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  category: string;
  content: string;
  date: string;
};

export function MemoryItem({ id, category, content, date }: Props) {
  const [removed, setRemoved] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  if (removed) return null;

  function remove() {
    start(async () => {
      const res = await fetch(`/api/memory/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRemoved(true);
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl p-3 mb-2 flex gap-3 items-start shrink-0">
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-[--color-accent-teal] uppercase tracking-[1.2px] font-bold mb-1">
          {category} · {date}
        </div>
        <div className="text-[12px] leading-[1.5]">{content}</div>
      </div>
      <button
        disabled={pending}
        onClick={remove}
        className="text-[--color-text-muted] hover:text-[--color-accent-rose] text-sm disabled:opacity-50"
      >
        ✕
      </button>
    </div>
  );
}
