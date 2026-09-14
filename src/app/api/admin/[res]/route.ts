import { NextRequest, NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";
import { db } from "@/db";
import {
  projects,
  clients,
  testimonials,
  services,
  courses,
  bookings,
  messages,
  notifications,
  blockedSlots,
} from "@/db/schema";
import { requireAdmin, getSettingsMap, getStats } from "@/lib/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ res: string }> };

export const RESOURCES: Record<string, { table: any; fields: string[] }> = {
  projects: { table: projects, fields: ["title", "titleAr", "slug", "cover", "video", "description", "descriptionAr", "client", "category", "year", "tools", "media", "featured", "sortOrder"] },
  clients: { table: clients, fields: ["name", "logoUrl", "description", "descriptionAr", "website", "featured", "sortOrder"] },
  testimonials: { table: testimonials, fields: ["name", "company", "position", "review", "reviewAr", "avatar", "rating", "active", "sortOrder"] },
  services: { table: services, fields: ["title", "titleAr", "description", "descriptionAr", "tags", "active", "sortOrder"] },
  courses: { table: courses, fields: ["title", "titleAr", "slug", "description", "descriptionAr", "duration", "sessions", "learnings", "learningsAr", "price", "maxStudents", "groupPricing", "active", "sortOrder"] },
  blocks: { table: blockedSlots, fields: ["date", "time", "note"] },
  messages: { table: messages, fields: ["name", "email", "subject", "body", "read"] },
};

export function sanitize(res: string, body: any): Record<string, unknown> {
  const cfg = RESOURCES[res];
  if (!cfg) return {};
  const out: Record<string, unknown> = {};
  for (const f of cfg.fields) {
    if (body[f] !== undefined) {
      let v = body[f];
      if (typeof v === "string") v = v.trim();
      if (["year", "sortOrder", "sessions", "price", "maxStudents", "rating"].includes(f) && v !== "") {
        v = Number(v);
      }
      if (f === "time" && v === "") v = null;
      out[f] = v;
    }
  }
  return out;
}

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

/* ---------- GET: list / stats / settings / notifications ---------- */
export async function GET(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { res } = await ctx.params;

  if (res === "stats") return json({ ok: true, ...(await getStats()) });

  if (res === "notifications") {
    const rows = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(30);
    return json({ ok: true, notifications: rows });
  }

  if (res === "settings") {
    return json({ ok: true, settings: await getSettingsMap() });
  }

  if (res === "bookings") {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    const conds = [];
    if (type) conds.push(eq(bookings.type, type));
    if (status) conds.push(eq(bookings.status, status));
    const rows = conds.length
      ? await db.select().from(bookings).where(and(...conds)).orderBy(desc(bookings.createdAt))
      : await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return json({ ok: true, bookings: rows });
  }

  const cfg = RESOURCES[res];
  if (cfg) {
    const rows = await db.select().from(cfg.table).orderBy(desc((cfg.table as any).createdAt));
    return json({ ok: true, items: rows });
  }
  return json({ ok: false, error: "Not found" }, { status: 404 });
}

/* ---------- POST: create ---------- */
export async function POST(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { res } = await ctx.params;
  const cfg = RESOURCES[res];
  if (!cfg) return json({ ok: false, error: "Not found" }, { status: 404 });

  const b = await req.json().catch(() => ({}));
  const values = sanitize(res, b);
  if (res === "courses" && b.learnings && typeof b.learnings === "string") {
    values.learnings = b.learnings.split("\n").map((s: string) => s.trim()).filter(Boolean);
  }
  if (res === "courses" && b.learningsAr && typeof b.learningsAr === "string") {
    values.learningsAr = b.learningsAr.split("\n").map((s: string) => s.trim()).filter(Boolean);
  }
  const inserted = (await db.insert(cfg.table).values(values).returning()) as any[];
  return json({ ok: true, item: inserted[0] }, { status: 201 });
}
