import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return withAuth(async ({ user, supabase }) => {
    const { error } = await supabase
      .from("ai_memory")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  });
}
