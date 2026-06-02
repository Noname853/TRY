import { NextResponse } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { pushSubscribeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const parsed = await parseBody(request, pushSubscribeSchema);
  if ("error" in parsed) return parsed.error;

  return withAuth(async ({ user, supabase }) => {
    const { error } = await supabase
      .from("users")
      .update({ push_subscription: parsed.data })
      .eq("id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  });
}

export async function DELETE() {
  return withAuth(async ({ user, supabase }) => {
    await supabase.from("users").update({ push_subscription: null }).eq("id", user.id);
    return NextResponse.json({ ok: true });
  });
}
