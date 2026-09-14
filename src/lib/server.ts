import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  settings as settingsTable,
  sessions as sessionsTable,
  notifications,
  bookings,
  messages,
  projects,
} from "@/db/schema";

export const SESSION_COOKIE = "oh_session";

/* ---------------- Settings ---------------- */

export async function getSettingsMap(): Promise<Record<string, any>> {
  const rows = await db.select().from(settingsTable);
  const map: Record<string, any> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const map = await getSettingsMap();
  return map[key] ?? fallback;
}

export async function setSetting(key: string, value: unknown) {
  await db
    .insert(settingsTable)
    .values({ key, value })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value } });
}

/* ---------------- Admin auth ---------------- */

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "wala-admin-2025";
}

export async function createSession() {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  await db.insert(sessionsTable).values({ id, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production" && !!process.env.FORCE_SECURE_COOKIES,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  store.delete(SESSION_COOKIE);
  if (token) await db.delete(sessionsTable).where(eq(sessionsTable.id, token));
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const rows = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, token));
  if (!rows.length) return false;
  if (rows[0].expiresAt.getTime() < Date.now()) return false;
  return true;
}

/** For route handlers: returns a 401 response when not authenticated. */
export async function requireAdmin(): Promise<Response | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

/* ---------------- Notifications ---------------- */

/**
 * Creates an admin notification row and (when configured) sends an
 * email via Resend and/or a WhatsApp webhook.
 */
export async function notify(kind: string, title: string, body: string) {
  await db
    .insert(notifications)
    .values({ kind, title, body })
    .catch(() => {});

  const map = await getSettingsMap();
  const socials = (map.socials ?? {}) as Record<string, string>;
  const to = process.env.ADMIN_EMAIL || socials.email;

  // Email via Resend (optional)
  if (process.env.RESEND_API_KEY && to) {
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Wala Khalid <onboarding@resend.dev>",
        to: [to],
        subject: title,
        text: body,
      }),
    }).catch(() => {});
  }

  // WhatsApp / webhook (optional)
  if (process.env.WHATSAPP_WEBHOOK_URL) {
    fetch(process.env.WHATSAPP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, title, body }),
    }).catch(() => {});
  }
}

/* ---------------- Admin dashboard stats ---------------- */

export async function getStats() {
  const [bookingsCount, pendingCount, projectsCount, unreadMessages, recentBookings, upcoming] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(bookings),
      db
        .select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(eq(bookings.status, "pending")),
      db.select({ count: sql<number>`count(*)` }).from(projects),
      db.select({ count: sql<number>`count(*)` }).from(messages).where(eq(messages.read, false)),
      db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(6),
      db
        .select()
        .from(bookings)
        .where(
          sql`${bookings.status} in ('pending','accepted') and ${bookings.date} >= ${new Date().toISOString().slice(0, 10)}`,
        )
        .orderBy(bookings.date, bookings.time)
        .limit(8),
    ]);
  return {
    bookings: bookingsCount[0]?.count ?? 0,
    pending: pendingCount[0]?.count ?? 0,
    projects: projectsCount[0]?.count ?? 0,
    unreadMessages: unreadMessages[0]?.count ?? 0,
    recentBookings,
    upcoming,
  };
}
