import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(courses)
    .where(eq(courses.active, true))
    .orderBy(asc(courses.sortOrder));
  return NextResponse.json({ ok: true, courses: rows });
}
