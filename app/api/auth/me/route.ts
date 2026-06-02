import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api";

export async function GET() {
  return withAuth(async ({ user, supabase }) => {
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return NextResponse.json({ user, profile });
  });
}

export async function PATCH(request: Request) {
  return withAuth(async ({ user, supabase }) => {
    const body = await request.json().catch(() => ({}));
    const allowed: Record<string, unknown> = {};
    for (const key of [
      "name",
      "ai_name",
      "goal_category",
      "notification_time_morning",
      "notification_time_evening",
      "ai_notifications_enabled",
      "onboarding_completed",
    ]) {
      if (key in body) allowed[key] = body[key];
    }
    const { data, error } = await supabase
      .from("users")
      .update(allowed)
      .eq("id", user.id)
      .select()
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ profile: data });
  });
}
