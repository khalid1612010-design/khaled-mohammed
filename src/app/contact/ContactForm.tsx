"use client";

import { useEffect, useState } from "react";
import { STRINGS, clientLang } from "@/i18n/strings";

export default function ContactForm() {
  const [ar, setAr] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    setAr(clientLang() === "ar");
  }, []);
  const s = (ar ? STRINGS.ar.contact : STRINGS.en.contact) as any;

  async function submit() {
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!d.ok) throw new Error();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="grid h-full min-h-72 place-items-center rounded-3xl border border-lime/40 bg-ink2 p-10 text-center">
        <div>
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-lime">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="#0b0b10" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-extrabold">{s.sentT}</h2>
          <p className="mt-2 text-sm text-bone/60">{s.sentD}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="rounded-3xl border border-line bg-ink2/70 p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="lbl" htmlFor="ct-name">{ar ? "الاسم *" : "Name *"}</label>
          <input id="ct-name" required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={ar ? "اسمك" : "Your name"} />
        </div>
        <div>
          <label className="lbl" htmlFor="ct-email">{s.email}</label>
          <input id="ct-email" type="email" required className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" dir="ltr" />
        </div>
        <div className="md:col-span-2">
          <label className="lbl" htmlFor="ct-subj">{s.subject}</label>
          <input id="ct-subj" className="field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={ar ? "الموضوع ده عن إيه؟" : "What's this about?"} />
        </div>
        <div className="md:col-span-2">
          <label className="lbl" htmlFor="ct-msg">{s.message}</label>
          <textarea id="ct-msg" required rows={5} className="field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={ar ? "قولي شوية عن اللي محتاجه…" : "Tell me a little about what you need…"} />
        </div>
      </div>
      {state === "error" && (
        <p className="mt-4 text-sm text-red-300">
          {ar ? "في حاجة حصلت — كلمني ديريكت بالإيميل." : "Something went wrong — please email me directly."}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="btn-primary mt-6" style={state === "sending" ? { opacity: 0.6 } : undefined}>
        {state === "sending" ? s.sending : s.send}
      </button>
    </form>
  );
}
