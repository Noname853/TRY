import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations";
import { badRequest, parseBody } from "@/lib/api";

export async function POST(request: Request) {
  const parsed = await parseBody(request, loginSchema);
  if ("error" in parsed) return parsed.error;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return badRequest(error.message);
  return NextResponse.json({ user: data.user });
}
