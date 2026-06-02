import { NextResponse } from "next/server";
import { parseBody, withAuth } from "@/lib/api";
import { goalCreateSchema } from "@/lib/validations";
import { callClaude } from "@/lib/claude";
import { GOAL_BREAKDOWN_PROMPT, systemPrompt } from "@/lib/prompts";

export async function GET() {
  return withAuth(async ({ user, supabase }) => {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ goals: data ?? [] });
  });
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, goalCreateSchema);
  if ("error" in parsed) return parsed.error;

  return withAuth(async ({ user, supabase }) => {
    const { data: profile } = await supabase
      .from("users")
      .select("name,ai_name")
      .eq("id", user.id)
      .maybeSingle();
    const { data: memory } = await supabase
      .from("ai_memory")
      .select("category,content")
      .eq("user_id", user.id)
      .limit(10);

    const sys = systemPrompt({
      aiName: profile?.ai_name ?? "Luna",
      userName: profile?.name ?? "kamu",
      memory: memory ?? [],
    });

    const result = await callClaude({
      systemPrompt: sys,
      messages: [{ role: "user", content: GOAL_BREAKDOWN_PROMPT(parsed.data.prompt) }],
      maxTokens: 1200,
      jsonMode: true,
    });

    const breakdown = result.json as {
      title?: string;
      reaction?: string;
      milestones?: { title: string; description?: string; week?: string }[];
      habits?: { name: string; icon?: string; target?: string; reason?: string }[];
    } | null;

    if (!breakdown) {
      return NextResponse.json({ error: "AI gagal generate breakdown" }, { status: 502 });
    }

    const milestones = (breakdown.milestones ?? []).map((m) => ({
      ...m,
      completed: false,
    }));

    const { data: goal, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: breakdown.title ?? parsed.data.prompt.slice(0, 80),
        description: parsed.data.prompt,
        milestones,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Auto-create habit yang disarankan
    const habitsToInsert = (breakdown.habits ?? []).map((h) => ({
      user_id: user.id,
      goal_id: goal.id,
      name: h.name,
      icon: h.icon ?? "✨",
      target: h.target ?? null,
    }));
    if (habitsToInsert.length) {
      await supabase.from("habits").insert(habitsToInsert);
    }

    return NextResponse.json({ goal, reaction: breakdown.reaction, habits: habitsToInsert });
  });
}
