import { NextResponse } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { habitLogSchema } from "@/lib/validations";
import { todayISO } from "@/lib/date";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("habit_id", id)
      .order("date", { ascending: false })
      .limit(90);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ logs: data ?? [] });
  });
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parsed = await parseBody(request, habitLogSchema);
  if ("error" in parsed) return parsed.error;

  return withAuth(async ({ user, supabase }) => {
    const date = parsed.data.date ?? todayISO();
    const { data, error } = await supabase
      .from("habit_logs")
      .upsert(
        {
          habit_id: id,
          user_id: user.id,
          date,
          completed: parsed.data.completed,
          note: parsed.data.note ?? null,
        },
        { onConflict: "habit_id,date" },
      )
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ log: data });
  });
}
