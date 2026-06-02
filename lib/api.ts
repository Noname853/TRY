import { NextResponse } from "next/server";
import { ZodError, ZodType } from "zod";
import { createClient, getSessionUser } from "./supabase/server";

export type AuthedCtx = {
  user: { id: string; email?: string };
  supabase: Awaited<ReturnType<typeof createClient>>;
};

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function serverError(message = "Server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function withAuth<T>(
  fn: (ctx: AuthedCtx) => Promise<T>,
): Promise<T | NextResponse> {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const supabase = await createClient();
  return fn({ user: { id: user.id, email: user.email }, supabase });
}

export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T } | { error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { error: badRequest("Invalid JSON body") };
  }
  try {
    return { data: schema.parse(raw) };
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: badRequest("Validation failed", e.flatten()) };
    }
    return { error: badRequest("Validation failed") };
  }
}
