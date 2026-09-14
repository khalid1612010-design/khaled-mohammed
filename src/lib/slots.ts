import "server-only";
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { blockedSlots, bookings, settings as settingsTable } from "@/db/schema";

export type Availability = {
  days: number[]; // 0 = Sunday
  start: number; // hour
  end: number; // hour (exclusive)
  slot: number; // minutes per slot
};

export const DEFAULT_AVAILABILITY: Availability = {
  days: [0, 1, 2, 3, 4],
  start: 10,
  end: 18,
  slot: 60,
};

export async function getAvailability(): Promise<Availability> {
  const rows = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, "availability"));
  if (!rows.length) return DEFAULT_AVAILABILITY;
  const v = rows[0].value as Partial<Availability>;
  return {
    days: Array.isArray(v.days) && v.days.length ? v.days : DEFAULT_AVAILABILITY.days,
    start: typeof v.start === "number" ? v.start : DEFAULT_AVAILABILITY.start,
    end: typeof v.end === "number" ? v.end : DEFAULT_AVAILABILITY.end,
    slot: typeof v.slot === "number" ? v.slot : DEFAULT_AVAILABILITY.slot,
  };
}

export function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function slotsFor(av: Availability): string[] {
  const out: string[] = [];
  for (let h = av.start; h < av.end; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
  }
  return out;
}

export function weekdayOf(dateStr: string): number {
  return new Date(dateStr + "T12:00:00Z").getUTCDay();
}

export function isPastSlot(dateStr: string, time: string): boolean {
  const dt = new Date(`${dateStr}T${time}:00Z`);
  const now = new Date();
  // allow booking up to 90 minutes from now
  return dt.getTime() < now.getTime() + 90 * 60 * 1000;
}

export async function isDayBlocked(dateStr: string): Promise<boolean> {
  const rows = await db
    .select()
    .from(blockedSlots)
    .where(and(eq(blockedSlots.date, dateStr), isNull(blockedSlots.time)));
  return rows.length > 0;
}

export async function blockedTimes(dateStr: string): Promise<string[]> {
  const rows = await db
    .select()
    .from(blockedSlots)
    .where(eq(blockedSlots.date, dateStr));
  return rows.filter((r) => r.time).map((r) => r.time as string);
}

export async function takenTimes(dateStr: string): Promise<string[]> {
  const rows = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.date, dateStr),
        inArray(bookings.status, ["pending", "accepted"]),
      ),
    );
  return rows.map((r) => r.time);
}

/** Full availability map for a date. */
export async function availabilityForDate(dateStr: string) {
  const av = await getAvailability();
  const wd = weekdayOf(dateStr);
  const dayOk = av.days.includes(wd);
  const all = slotsFor(av);
  const blocked = new Set(await blockedTimes(dateStr));
  const taken = new Set(await takenTimes(dateStr));
  const dayBlocked = await isDayBlocked(dateStr);
  return {
    open: dayOk && !dayBlocked,
    slots: all.map((t) => ({
      time: t,
      free: dayOk && !dayBlocked && !blocked.has(t) && !taken.has(t) && !isPastSlot(dateStr, t),
    })),
    meta: av,
  };
}

export type SlotCheck = { ok: boolean; reason?: string };

export async function checkSlot(dateStr: string, time: string): Promise<SlotCheck> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return { ok: false, reason: "Invalid date" };
  const info = await availabilityForDate(dateStr);
  if (!info.open) return { ok: false, reason: "That date is not available" };
  const slot = info.slots.find((s) => s.time === time);
  if (!slot) return { ok: false, reason: "That time is outside working hours" };
  if (!slot.free) return { ok: false, reason: "That slot was just taken — please pick another" };
  return { ok: true };
}

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
