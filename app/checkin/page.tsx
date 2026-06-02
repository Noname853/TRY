import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { CheckinChat } from "@/components/checkin/CheckinChat";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { todayISO } from "@/lib/date";
import type { ChatMessage } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function CheckinPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, checkinRes] = await Promise.all([
    supabase.from("users").select("ai_name,name").eq("id", user.id).maybeSingle(),
    supabase
      .from("checkins")
      .select("messages,mood")
      .eq("user_id", user.id)
      .eq("date", todayISO())
      .maybeSingle(),
  ]);

  const aiName = profileRes.data?.ai_name ?? "Luna";
  const messages = (checkinRes.data?.messages ?? []) as ChatMessage[];

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <CheckinChat aiName={aiName} initialMessages={messages} />
        <BottomNav />
      </PhoneShell>
    </main>
  );
}
