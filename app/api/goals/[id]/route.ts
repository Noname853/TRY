import { NextResponse } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { goalUpdateSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parsed = await parseBody(request, goalUpdateSchema);
  if ("error" in parsed) return parsed.error;

  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("goals")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ goal: data });
  });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return withAuth(async ({ user, supabase }) => {
    const { error } = await supabase
      .from("goals")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  });
}
