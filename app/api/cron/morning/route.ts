// Wrapper Vercel Cron — proxy ke /api/notifications/send dengan type morning.
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const target = `${url.origin}/api/notifications/send`;
  const res = await fetch(target, {
    method: "POST",
    headers: { authorization: auth, "content-type": "application/json" },
    body: JSON.stringify({ type: "morning" }),
  });
  return NextResponse.json(await res.json());
}
