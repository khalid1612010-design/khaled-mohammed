import type { Metadata } from "next";
import { getSetting } from "@/lib/server";
import { getLang } from "@/i18n/lang";
import { pick } from "@/i18n/strings";
import { Reveal, SectionHead } from "@/components/ui";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact | تواصل",
  description: "Get in touch with motion designer Wala Khalid — email, WhatsApp, socials and a quick contact form.",
};

export default async function ContactPage() {
  const { ar, s } = await getLang();
  const socials = await getSetting<any>("socials", {});
  const site = await getSetting<any>("site", {});

  const rows = [
    { label: s.contact.rows.email, value: socials.email, href: `mailto:${socials.email}`, ltr: true },
    { label: s.contact.rows.whatsapp, value: socials.whatsapp, href: socials.whatsappNumber ? `https://wa.me/${socials.whatsappNumber}` : undefined, ltr: true },
    { label: s.contact.rows.location, value: `${pick(site.locationAr, site.location, ar) || "Cairo, Egypt"} ${s.contact.remote}` },
    { label: s.contact.rows.response, value: s.contact.responseVal },
  ];

  const socialLinks = [
    { label: "Instagram", handle: "@walakhalid.motion", href: socials.instagram },
    { label: "TikTok", handle: "@walakhalid.motion", href: socials.tiktok },
    { label: "Behance", handle: "walakhalid", href: socials.behance },
    { label: "LinkedIn", handle: "in/walakhalid", href: socials.linkedin },
    { label: "YouTube", handle: "@walakhalid", href: socials.youtube },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <SectionHead kicker={s.contact.kicker} title={s.contact.title} right={<p className="max-w-xs text-sm text-mut">{s.contact.right}</p>} />
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-line">
              {rows.map((r, i) => (
                <div key={r.label} className={`flex items-center justify-between gap-4 bg-ink2 px-6 py-4 ${i > 0 ? "border-t border-line" : ""}`}>
                  <p className="text-xs uppercase tracking-wider text-mut">{r.label}</p>
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-end text-sm font-semibold text-bone transition-colors hover:text-lime" dir={r.ltr ? "ltr" : undefined}>
                      {r.value}
                    </a>
                  ) : (
                    <p className="text-end text-sm font-semibold">{r.value}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-line bg-ink2 p-6">
              <p className="lbl !mb-4">{s.contact.elsewhere}</p>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((sc) => (
                  <a key={sc.label} href={sc.href} target="_blank" rel="noreferrer" className="group rounded-xl border border-line px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-lime/50">
                    <p className="text-sm font-semibold group-hover:text-lime">{sc.label}</p>
                    <p className="text-xs text-mut" dir="ltr">{sc.handle}</p>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="rounded-2xl border border-lime/30 bg-lime/5 p-6 text-sm leading-relaxed text-bone/75">
              <p className="mb-1 font-display text-base font-bold text-bone">{s.contact.prefer}</p>
              <p>
                {s.contact.prefer2}{" "}
                <a className="text-lime hover:underline" href="/book-meeting">{s.contact.meetingLink}</a>
                {" / "}
                <a className="text-lime hover:underline" href="/book-course">{s.contact.courseLink}</a>.
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
