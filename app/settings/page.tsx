import { PhoneShell } from "@/components/phone/PhoneShell";
import { BottomNav } from "@/components/phone/BottomNav";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { PushToggle } from "@/components/settings/PushToggle";
import { LogoutButton } from "@/components/settings/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="py-10 px-4">
      <PhoneShell>
        <div className="flex justify-between items-center pt-1.5 pb-3.5 shrink-0">
          <div className="jakarta font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 21px)" }}>
            Pengaturan ⚙️
          </div>
        </div>

        <div className="text-[11px] text-[--color-text-muted] mb-2 uppercase tracking-[1.5px] font-bold">
          Akun
        </div>
        <div className="bg-[--color-bg-card] border border-[--color-border-base] rounded-2xl p-3 mb-4">
          <div className="text-[10px] text-[--color-text-muted] mb-1">Email</div>
          <div className="text-[13px] mb-2">{user.email}</div>
        </div>

        <SettingsForm
          initial={{
            name: profile?.name ?? "",
            ai_name: profile?.ai_name ?? "Luna",
            notification_time_morning: profile?.notification_time_morning ?? "07:00",
            notification_time_evening: profile?.notification_time_evening ?? "21:00",
            ai_notifications_enabled: profile?.ai_notifications_enabled ?? true,
          }}
        />

        <PushToggle enabled={Boolean(profile?.push_subscription)} />

        <LogoutButton />

        <BottomNav />
      </PhoneShell>
    </main>
  );
}
