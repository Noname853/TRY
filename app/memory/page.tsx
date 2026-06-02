import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { MemoryItem } from "@/components/memory/MemoryItem";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { MemoryRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  personal: "Personal",
  pattern: "Pola",
  moment: "Momen",
  preference: "Preferensi",
};

export default async function MemoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("ai_memory")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  const memory = (data ?? []) as MemoryRow[];

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div className="jakarta font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 21px)" }}>
            Memory 🧠
          </div>
          <div className="text-[12px] text-[--color-text-muted] font-medium">
            {memory.length} entri
          </div>
        </div>

        <div className="text-[12px] text-[--color-text-muted] mb-3.5">
          Hal yang aku ingat tentangmu. Kamu boleh hapus kapan saja.
        </div>

        {memory.length === 0 && (
          <div className="text-[12px] text-[--color-text-muted] text-center py-8">
            Belum ada memory. Mulai check-in untuk membangun konteks 🌱
          </div>
        )}

        {memory.map((m) => (
          <MemoryItem
            key={m.id}
            id={m.id}
            category={CATEGORY_LABEL[m.category] ?? m.category}
            content={m.content}
            date={m.updated_at.slice(0, 10)}
          />
        ))}

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
