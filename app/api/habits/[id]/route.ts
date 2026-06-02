import { NextResponse } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { habitUpdateSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parsed = await parseBody(request, habitUpdateSchema);
  if ("error" in parsed) return parsed.error;

  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("habits")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ habit: data });
  });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return withAuth(async ({ user, supabase }) => {
    const { error } = await supabase
      .from("habits")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  });
}
