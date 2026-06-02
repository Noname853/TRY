import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";

export async function GET() {
  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("ai_memory")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ memory: data ?? [] });
  });
}
