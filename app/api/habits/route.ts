import { NextResponse } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { habitCreateSchema } from "@/lib/validations";

export async function GET() {
  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ habits: data ?? [] });
  });
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, habitCreateSchema);
  if ("error" in parsed) return parsed.error;

  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("habits")
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ habit: data });
  });
}
