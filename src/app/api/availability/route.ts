import { NextResponse } from "next/server";
import { availabilityForDate, getAvailability } from "@/lib/slots";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  if (!date) {
    const meta = await getAvailability();
    return NextResponse.json({ ok: true, meta });
  }
  const data = await availabilityForDate(date);
  return NextResponse.json({ ok: true, ...data });
}
