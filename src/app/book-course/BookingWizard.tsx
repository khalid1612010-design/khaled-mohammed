"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SlotPicker from "@/components/SlotPicker";
import { STRINGS, clientLang, pick } from "@/i18n/strings";

type Course = {
  id: number;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  duration: string;
  sessions: number;
  price: number;
  maxStudents: number;
  groupPricing: Record<string, number>;
};

export default function BookingWizard({ preselect }: { preselect?: number }) {
  const [ar, setAr] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState<number | null>(preselect ?? null);
  const [students, setStudents] = useState(1);
  const [slot, setSlot] = useState({ date: "", time: "" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState("");

  const s = (ar ? STRINGS.ar.bookCourse : STRINGS.en.bookCourse) as any;

  useEffect(() => {
    const isAr = clientLang() === "ar";
    setAr(isAr);
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => {
        setCourses(d.courses);
        if (preselect && d.courses.some((c: Course) => c.id === preselect)) setCourseId(preselect);
        setForm((f) => ({ ...f, experience: isAr ? STRINGS.ar.bookCourse.levels[1] : STRINGS.en.bookCourse.levels[1] }));
      });
  }, [preselect]);

  const course = useMemo(() => courses.find((c) => c.id === courseId) ?? null, [courses, courseId]);
  const per = course ? Math.round(course.price * (course.groupPricing?.[String(students)] ?? 1)) : 0;
  const total = per * students;
  const cTitle = (c: Course) => (pick(c.titleAr, c.title, ar) as string);
  const cDesc = (c: Course) => (pick(c.descriptionAr, c.description, ar) as string);

  function canNext() {
    if (step === 0) return !!courseId;
    if (step === 1) return students >= 1;
    if (step === 2) return !!slot.date && !!slot.time;
    return true;
  }

  async function submit() {
    if (!course) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "course",
          courseId: course.id,
          courseTitle: course.title,
          students,
          pricePer: per,
          priceTotal: total,
          experience: form.experience,
          message: form.message,
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: slot.date,
          time: slot.time,
        }),
      });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error || "Something went wrong");
      setDone(d.bookingId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl rounded-3xl border border-lime/40 bg-ink2 p-10 text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-lime">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="#0b0b10" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-extrabold">{s.done}</h1>
        <p className="mt-3 text-bone/70">
          {form.name.split(" ")[0] || (ar ? "يا صديقي" : "friend")} — {cTitle(course!)} ({students} {s.students}),{" "}
          <span className="text-lime" dir="ltr">${per}/{s.perPerson} · ${total}</span> — {slot.date} {s.time} {slot.time} UTC
        </p>
        <p className="mt-3 text-sm text-mut">{s.doneBody}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/work" className="btn-ghost">{ar ? "ارجع للأعمال" : "Back to Work"}</Link>
          <button onClick={() => { setDone(null); setStep(0); setForm({ name: "", email: "", phone: "", experience: s.levels[1], message: "" }); setSlot({ date: "", time: "" }); }} className="btn-primary">
            {s.bookAnother}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-lime">{s.kicker}</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
          {s.titleA} <span className="text-outline-lime">{s.titleB}</span>
        </h1>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {s.steps.map((st: string, i: number) => (
          <button
            key={st}
            onClick={() => i < step && setStep(i)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
              i === step ? "border-lime bg-lime font-semibold text-ink" : i < step ? "border-lime/40 text-lime hover:border-lime" : "border-line text-mut"
            }`}
          >
            <span className="font-display font-bold">{String(i + 1).padStart(2, "0")}</span> {st}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-line bg-ink2/70 p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: ar ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: ar ? 24 : -24 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {courses.map((c) => (
                  <button key={c.id} onClick={() => setCourseId(c.id)} className={`rounded-2xl border p-5 text-start transition-all ${courseId === c.id ? "border-lime bg-lime/5" : "border-line hover:border-lime/50"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold leading-snug">{cTitle(c)}</h3>
                      <span className={`size-5 shrink-0 rounded-full border-2 transition-colors ${courseId === c.id ? "border-lime bg-lime" : "border-line"}`} />
                    </div>
                    <p className="mt-2 text-sm text-bone/60">{cDesc(c).slice(0, 120)}…</p>
                    <p className="mt-3 text-xs text-mut">{c.sessions} {STRINGS[ar ? "ar" : "en"].courses.sessions} · <span className="text-lime" dir="ltr">from ${c.price}</span></p>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && course && (
              <div>
                <p className="mb-5 text-sm text-bone/70">{s.pickNote(cTitle(course))}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {Array.from({ length: course.maxStudents }).map((_, i) => {
                    const n = i + 1;
                    const pper = Math.round(course.price * (course.groupPricing?.[String(n)] ?? 1));
                    const save = Math.round((1 - pper / course.price) * 100);
                    return (
                      <button key={n} onClick={() => setStudents(n)} className={`rounded-2xl border p-4 text-center transition-all ${students === n ? "border-lime bg-lime/10" : "border-line hover:border-lime/50"}`}>
                        <p className="font-display text-2xl font-extrabold">{n}</p>
                        <p className="text-xs uppercase tracking-wider text-mut">{n === 1 ? s.private : s.students}</p>
                        <p className="mt-2 font-display text-lg font-bold text-lime" dir="ltr">${pper}</p>
                        <p className="text-[11px] text-mut">{s.perPerson}</p>
                        {save > 0 && <p className="mt-1 text-[11px] font-semibold text-lime">{s.save(save)}</p>}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-ink px-6 py-4">
                  <p className="text-sm text-bone/70">{students} {s.students} × <span dir="ltr">${per}</span></p>
                  <p className="font-display text-2xl font-extrabold text-lime"><span dir="ltr">${total}</span> <span className="text-sm font-normal text-mut">{s.total}</span></p>
                </div>
              </div>
            )}

            {step === 2 && <SlotPicker value={slot} onChange={setSlot} />}

            {step === 3 && (
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="lbl" htmlFor="bc-name">{s.name}</label>
                  <input id="bc-name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={ar ? "اسمك بالكامل" : "Your full name"} />
                </div>
                <div>
                  <label className="lbl" htmlFor="bc-email">{s.email}</label>
                  <input id="bc-email" type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" dir="ltr" />
                </div>
                <div>
                  <label className="lbl" htmlFor="bc-phone">{s.phone}</label>
                  <input id="bc-phone" className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+20 100 000 0000" dir="ltr" />
                </div>
                <div>
                  <label className="lbl" htmlFor="bc-exp">{s.level}</label>
                  <select id="bc-exp" className="field" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
                    {s.levels.map((l: string) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="lbl" htmlFor="bc-msg">{s.msg}</label>
                  <textarea id="bc-msg" rows={3} className="field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={s.msgPh} />
                </div>
                <div className="rounded-2xl border border-line bg-ink px-5 py-4 text-sm text-bone/70 md:col-span-2">
                  <span className="font-semibold text-bone">{s.summary}</span> {cTitle(course!)} · {students} {s.students} · <span dir="ltr">{slot.date} {slot.time} UTC</span> ·{" "}
                  <span className="text-lime" dir="ltr">${per}/{s.perPerson} — ${total}</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-4 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="btn-ghost !py-3" style={step === 0 ? { opacity: 0.3, pointerEvents: "none" } : undefined}>
            {ar ? s.back : `${s.back} ←`}
          </button>
          {step < 3 ? (
            <button onClick={() => canNext() && setStep(step + 1)} className="btn-primary" style={!canNext() ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
              {s.cont} {ar ? "←" : "→"}
            </button>
          ) : (
            <button onClick={submit} disabled={submitting || !form.name || !form.email} className="btn-primary" style={!form.name || !form.email ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
              {submitting ? s.sending : s.confirm}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
