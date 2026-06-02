import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";
import { shiftDays, todayISO } from "@/lib/date";

export async function GET() {
  return withAuth(async ({ user, supabase }) => {
    const since = shiftDays(todayISO(), -30);
    const { data, error } = await supabase
      .from("checkins")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", since)
      .order("date", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ checkins: data ?? [] });
  });
}
