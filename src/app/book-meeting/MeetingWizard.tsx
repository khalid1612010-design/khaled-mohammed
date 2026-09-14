"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SlotPicker from "@/components/SlotPicker";
import { STRINGS, clientLang, pick } from "@/i18n/strings";

type Service = { id: number; title: string; titleAr: string | null };

export default function MeetingWizard() {
  const [ar, setAr] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(0);
  const [slot, setSlot] = useState({ date: "", time: "" });
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    projectType: "", projectDuration: "", budget: "", projectDesc: "", reference: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const s = (ar ? STRINGS.ar.bookMeeting : STRINGS.en.bookMeeting) as any;

  useEffect(() => {
    const isAr = clientLang() === "ar";
    setAr(isAr);
    fetch("/api/services").then((r) => r.json()).then((d) => {
      setServices(d.services);
      if (d.services?.length) {
        setForm((f) => ({ ...f, projectType: f.projectType || (isAr ? d.services[0].titleAr || d.services[0].title : d.services[0].title) }));
      }
    });
  }, []);

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "meeting", ...form, date: slot.date, time: slot.time }),
      });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error || "Something went wrong");
      setDone(true);
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
          {form.name.split(" ")[0]} — <span className="text-lime" dir="ltr">{slot.date} {slot.time} UTC</span>
        </p>
        <p className="mt-3 text-sm text-mut">{s.doneBody}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/work" className="btn-ghost">{ar ? "ارجع للأعمال" : "Back to Work"}</Link>
          <Link href="/" className="btn-primary">{ar ? "الرئيسية" : "Home"}</Link>
        </div>
      </motion.div>
    );
  }

  const valid = form.name && form.email && form.projectDesc && /.+@.+\..+/.test(form.email);

  return (
    <div>
      <div className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-lime">{s.kicker}</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
          {s.titleA}
          <br />
          <span className="text-outline-lime">{s.titleB}</span>
        </h1>
        <p className="mt-4 max-w-xl text-bone/60">{s.intro}</p>
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
            {step === 0 && <SlotPicker value={slot} onChange={setSlot} />}

            {step === 1 && (
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="lbl" htmlFor="mm-name">{s.name}</label>
                  <input id="mm-name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={ar ? "اسمك" : "Full name"} />
                </div>
                <div>
                  <label className="lbl" htmlFor="mm-company">{s.company}</label>
                  <input id="mm-company" className="field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder={ar ? "شركتك أو ماركاتك" : "Company or brand"} />
                </div>
                <div>
                  <label className="lbl" htmlFor="mm-email">{s.email}</label>
                  <input id="mm-email" type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" dir="ltr" />
                </div>
                <div>
                  <label className="lbl" htmlFor="mm-phone">{s.phone}</label>
                  <input id="mm-phone" className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+20 555 000 0000" dir="ltr" />
                </div>
                <div>
                  <label className="lbl" htmlFor="mm-type">{s.type}</label>
                  <select id="mm-type" className="field" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
                    {services.map((sv) => (
                      <option key={sv.id} value={sv.title}>{pick(sv.titleAr, sv.title, ar)}</option>
                    ))}
                    <option value="Other">{s.somethingElse}</option>
                  </select>
                </div>
                <div>
                  <label className="lbl" htmlFor="mm-dur">{s.dur}</label>
                  <select id="mm-dur" className="field" value={form.projectDuration} onChange={(e) => setForm({ ...form, projectDuration: e.target.value })}>
                    {s.durOpts.map((d: string) => (
                      <option key={d} value={d === s.durOpts[0] ? "" : d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="lbl" htmlFor="mm-budget">{s.budget}</label>
                  <select id="mm-budget" className="field" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                    {s.budgetOpts.map((b: string) => (
                      <option key={b} value={b === s.budgetOpts[0] ? "" : b} dir="ltr">{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="lbl" htmlFor="mm-ref">{s.ref}</label>
                  <input id="mm-ref" className="field" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="https://…" dir="ltr" />
                </div>
                <div className="md:col-span-2">
                  <label className="lbl" htmlFor="mm-desc">{s.desc}</label>
                  <textarea id="mm-desc" rows={4} className="field" value={form.projectDesc} onChange={(e) => setForm({ ...form, projectDesc: e.target.value })} placeholder={s.descPh} />
                </div>
                <div className="rounded-2xl border border-line bg-ink px-5 py-4 text-sm text-bone/70 md:col-span-2">
                  <span className="font-semibold text-bone">{s.meetingTime}</span> <span dir="ltr">{slot.date} {slot.time} UTC</span> · 30 min · <span className="text-lime">{s.free}</span>
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
          {step === 0 ? (
            <button onClick={() => slot.date && slot.time && setStep(1)} className="btn-primary" style={!slot.date || !slot.time ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
              {s.cont} {ar ? "←" : "→"}
            </button>
          ) : (
            <button onClick={submit} disabled={submitting || !valid} className="btn-primary" style={!valid ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
              {submitting ? s.sending : s.request}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
