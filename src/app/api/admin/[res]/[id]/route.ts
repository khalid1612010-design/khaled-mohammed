import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, notifications } from "@/db/schema";
import { requireAdmin, setSetting } from "@/lib/server";
import { checkSlot } from "@/lib/slots";
import { RESOURCES, sanitize } from "../route";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ res: string; id: string }> };

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

/* ---------- GET single ---------- */
export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { res, id } = await ctx.params;
  const cfg = RESOURCES[res];
  if (!cfg) return json({ ok: false, error: "Not found" }, { status: 404 });
  const rows = await db.select().from(cfg.table).where(eq((cfg.table as any).id, Number(id)));
  return rows.length ? json({ ok: true, item: rows[0] }) : json({ ok: false, error: "Not found" }, { status: 404 });
}

/* ---------- PATCH: update / bookings actions / settings bulk ---------- */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { res, id } = await ctx.params;
  const b = await req.json().catch(() => ({}));

  // mark all notifications read
  if (res === "notifications" && id === "all") {
    await db.update(notifications).set({ read: true }).where(sql`${notifications.read} = false`);
    return json({ ok: true });
  }

  // bulk settings update
  if (res === "settings" && id === "save") {
    for (const [k, v] of Object.entries(b)) {
      if (k === "ok") continue;
      await setSetting(k, v);
    }
    return json({ ok: true });
  }

  // bookings actions
  if (res === "bookings") {
    const rows = await db.select().from(bookings).where(eq(bookings.id, Number(id)));
    if (!rows.length) return json({ ok: false, error: "Not found" }, { status: 404 });
    const bk = rows[0];
    const action = b.action;

    if (action === "reschedule" && b.date && b.time) {
      const other = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.date, b.date),
            eq(bookings.time, b.time),
            sql`${bookings.id} != ${bk.id}`,
            sql`${bookings.status} in ('pending','accepted')`,
          ),
        );
      if (other.length) {
        return json({ ok: false, error: "That slot is already taken by another booking." }, { status: 409 });
      }
      const check = await checkSlot(b.date, b.time);
      if (!check.ok) return json({ ok: false, error: check.reason }, { status: 409 });
      await db.update(bookings).set({ date: b.date, time: b.time }).where(eq(bookings.id, bk.id));
      return json({ ok: true, item: { ...bk, date: b.date, time: b.time } });
    }

    if (["accept", "reject", "cancel"].includes(action)) {
      const status = action === "accept" ? "accepted" : action === "reject" ? "rejected" : "cancelled";
      await db.update(bookings).set({ status, note: b.note ?? bk.note }).where(eq(bookings.id, bk.id));
      return json({ ok: true, item: { ...bk, status } });
    }

    if (b.note !== undefined) {
      await db.update(bookings).set({ note: b.note }).where(eq(bookings.id, bk.id));
      return json({ ok: true });
    }
    return json({ ok: false, error: "Unknown action" }, { status: 400 });
  }

  // generic update
  const cfg = RESOURCES[res];
  if (!cfg) return json({ ok: false, error: "Not found" }, { status: 404 });
  const values = sanitize(res, b);
  if (res === "courses" && b.learnings && typeof b.learnings === "string") {
    values.learnings = b.learnings.split("\n").map((s: string) => s.trim()).filter(Boolean);
  }
  if (res === "courses" && b.learningsAr && typeof b.learningsAr === "string") {
    values.learningsAr = b.learningsAr.split("\n").map((s: string) => s.trim()).filter(Boolean);
  }
  const updated = await db.update(cfg.table).set(values).where(eq((cfg.table as any).id, Number(id))).returning();
  return updated.length ? json({ ok: true, item: updated[0] }) : json({ ok: false, error: "Not found" }, { status: 404 });
}

/* ---------- DELETE ---------- */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { res, id } = await ctx.params;
  const cfg = RESOURCES[res];
  if (!cfg) return json({ ok: false, error: "Not found" }, { status: 404 });
  await db.delete(cfg.table).where(eq((cfg.table as any).id, Number(id)));
  return json({ ok: true });
}
