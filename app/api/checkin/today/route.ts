import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";
import { todayISO } from "@/lib/date";

export async function GET() {
  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("checkins")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", todayISO())
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ checkin: data ?? null });
  });
}
