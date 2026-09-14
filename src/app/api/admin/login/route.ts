import { NextRequest, NextResponse } from "next/server";
import { adminPassword, createSession } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b.password === adminPassword()) {
    await createSession();
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
}
