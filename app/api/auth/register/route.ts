import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations";
import { badRequest, parseBody } from "@/lib/api";

export async function POST(request: Request) {
  const parsed = await parseBody(request, registerSchema);
  if ("error" in parsed) return parsed.error;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return badRequest(error.message);

  if (parsed.data.name && data.user) {
    await supabase.from("users").update({ name: parsed.data.name }).eq("id", data.user.id);
  }

  return NextResponse.json({ user: data.user });
}
