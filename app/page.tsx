import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-[64px] mb-4">🌿</div>
        <div
          className="jakarta font-extrabold grad-text mb-2"
          style={{ fontSize: "clamp(32px, 8vw, 56px)", letterSpacing: "-0.02em" }}
        >
          HabitAI
        </div>
        <p
          className="text-[--color-text-secondary] mb-8"
          style={{ fontSize: "clamp(14px, 2.5vw, 17px)" }}
        >
          Asisten AI yang mengenalmu — bantu bangun kebiasaan baik setiap hari, tanpa menghakimi.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/login"
            className="jakarta font-bold text-white rounded-2xl px-6 py-3 text-sm"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #818CF8)",
              boxShadow: "0 4px 16px rgba(56,189,248,0.22)",
            }}
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-2xl px-6 py-3 text-sm glass text-[--color-text-secondary]"
          >
            Buat akun
          </Link>
        </div>

        <div className="mt-12 text-[11px] text-[--color-text-muted] uppercase tracking-[2px]">
          Next.js 16 · React 19 · Tailwind v4
        </div>
      </div>
    </main>
  );
}
