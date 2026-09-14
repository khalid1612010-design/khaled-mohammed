import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkSlot } from "@/lib/slots";
import { notify } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const kind = b.kind === "meeting" ? "meeting" : "course";

    // shared validation
    if (!b.name || !b.email || !b.date || !b.time) {
      return NextResponse.json({ ok: false, error: "Please fill in your name, email, date and time." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    // double-booking guard
    const check = await checkSlot(b.date, b.time);
    if (!check.ok) {
      return NextResponse.json({ ok: false, error: check.reason }, { status: 409 });
    }

    const row: any = {
      type: kind,
      status: "pending",
      name: String(b.name).slice(0, 200),
      email: String(b.email).slice(0, 200),
      phone: b.phone ? String(b.phone).slice(0, 60) : null,
      date: b.date,
      time: b.time,
    };

    if (kind === "course") {
      if (!b.courseId) {
        return NextResponse.json({ ok: false, error: "Please choose a course." }, { status: 400 });
      }
      const courseRows = await db.select().from(courses).where(eq(courses.id, Number(b.courseId)));
      const course = courseRows[0];
      if (!course || !course.active) {
        return NextResponse.json({ ok: false, error: "That course is not available." }, { status: 400 });
      }
      const students = Math.min(5, Math.max(1, Number(b.students) || 1));
      if (students > course.maxStudents) {
        return NextResponse.json({ ok: false, error: `This course accepts up to ${course.maxStudents} students.` }, { status: 400 });
      }
      const factor = (course.groupPricing as Record<string, number>)?.[String(students)] ?? 1;
      const pricePer = Math.round(course.price * factor);
      Object.assign(row, {
        courseId: course.id,
        courseTitle: course.title,
        students,
        pricePer,
        priceTotal: pricePer * students,
        experience: b.experience ? String(b.experience).slice(0, 60) : null,
        message: b.message ? String(b.message).slice(0, 2000) : null,
      });
    } else {
      Object.assign(row, {
        company: b.company ? String(b.company).slice(0, 200) : null,
        projectType: b.projectType ? String(b.projectType).slice(0, 120) : null,
        projectDuration: b.projectDuration ? String(b.projectDuration).slice(0, 60) : null,
        budget: b.budget ? String(b.budget).slice(0, 60) : null,
        projectDesc: b.projectDesc ? String(b.projectDesc).slice(0, 4000) : null,
        reference: b.reference ? String(b.reference).slice(0, 500) : null,
      });
    }

    const inserted = await db.insert(bookings).values(row).returning();
    const booking = inserted[0];

    // notify admin
    if (kind === "course") {
      await notify(
        "booking_course",
        `New course booking — ${row.courseTitle}`,
        `Student: ${row.name}\nEmail: ${row.email}\nPhone: ${row.phone || "-"}\nCourse: ${row.courseTitle}\nStudents: ${row.students} (level: ${row.experience || "-"})\nDate: ${row.date} at ${row.time} UTC\nPrice: $${row.pricePer}/person — $${row.priceTotal} total\n\n${row.message ? "Message: " + row.message : ""}`,
      );
    } else {
      await notify(
        "booking_meeting",
        `New project meeting — ${row.name}${row.company ? " (" + row.company + ")" : ""}`,
        `Client: ${row.name}\nCompany: ${row.company || "-"}\nEmail: ${row.email}\nPhone: ${row.phone || "-"}\nMeeting: ${row.date} at ${row.time} UTC\nProject type: ${row.projectType || "-"}\nDuration: ${row.projectDuration || "-"}\nBudget: ${row.budget || "-"}\nReference: ${row.reference || "-"}\n\nDescription:\n${row.projectDesc || "-"}`,
      );
    }

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Could not create the booking. Please try again." }, { status: 500 });
  }
}
