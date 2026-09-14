import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { notify } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name || !b.email || !b.message) {
      return NextResponse.json({ ok: false, error: "Please fill in name, email and message." }, { status: 400 });
    }
    await db.insert(messages).values({
      name: String(b.name).slice(0, 200),
      email: String(b.email).slice(0, 200),
      subject: b.subject ? String(b.subject).slice(0, 300) : null,
      body: String(b.message).slice(0, 4000),
    });
    await notify(
      "contact",
      `New contact message — ${b.name}`,
      `From: ${b.name} <${b.email}>\nSubject: ${b.subject || "-"}\n\n${b.message}`,
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Could not send the message." }, { status: 500 });
  }
}
