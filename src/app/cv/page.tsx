import Link from "next/link";
import { getSetting } from "@/lib/server";
import { getLang } from "@/i18n/lang";
import { Reveal, DownloadCVButton } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CV — Professional Profile | السيرة الذاتية",
  description:
    "Full CV of Wala Khalid, motion designer: experience, freelance work, skills, software, education, certifications and languages.",
};

type CV = {
  summary: string;
  experience: { role: string; company: string; period: string; desc: string }[];
  freelance: { role: string; company: string; period: string; desc: string }[];
  skills: string[];
  software: string[];
  education: { title: string; place: string; period: string }[];
  certifications: { title: string; place: string; period: string }[];
  languages: { name: string; level: string }[];
  pdfUrl: string;
};

const EMPTY: CV = {
  summary: "", experience: [], freelance: [], skills: [], software: [],
  education: [], certifications: [], languages: [], pdfUrl: "",
};

export default async function CVPage() {
  const { ar, s } = await getLang();
  const [cvEn, cvAr] = await Promise.all([
    getSetting<CV>("cv", EMPTY),
    getSetting<CV>("cv_ar", EMPTY),
  ]);
  const cv = ar ? { ...cvEn, ...pickCv(cvAr, cvEn) } : cvEn;
  const socials = await getSetting<any>("socials", {});

  function pickCv(a: CV, b: CV): Partial<CV> {
    const p: Partial<CV> = {};
    if (a.summary) p.summary = a.summary;
    if (a.experience?.length) p.experience = a.experience;
    if (a.freelance?.length) p.freelance = a.freelance;
    if (a.skills?.length) p.skills = a.skills;
    if (a.software?.length) p.software = a.software;
    if (a.education?.length) p.education = a.education;
    if (a.certifications?.length) p.certifications = a.certifications;
    if (a.languages?.length) p.languages = a.languages;
    return p;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <div className="no-print mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-lime">{s.cv.kicker}</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            {s.cv.titleA} <span className="text-outline-lime">{s.cv.titleB}</span>
          </h1>
        </div>
        <DownloadCVButton href={cv.pdfUrl || undefined} label={cv.pdfUrl ? s.cv.downloadPdf : s.cv.download} />
      </div>

      <div className="print-area space-y-10 rounded-3xl border border-line bg-ink2/60 p-7 md:p-12">
        <Reveal>
          <div className="border-b border-line pb-8">
            <h2 className="font-display text-3xl font-extrabold">{ar ? "ولاء خالد" : "Wala Khalid"}</h2>
            <p className="mt-1 text-lime">{ar ? "مصمم موشن — هوية متحركة · أفلام إطلاق · فيديوهات توضيحية" : "Motion Designer — Brand Motion · Launch Films · Explainers"}</p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-bone/60">
              <span>{ar ? "القاهرة، مصر" : "Cairo, Egypt"}</span>
              <span>·</span>
              <span dir="ltr">{socials.email}</span>
              <span>·</span>
              <span dir="ltr">{socials.whatsapp}</span>
            </p>
          </div>
        </Reveal>

        <Reveal>
          <section>
            <h3 className="lbl">{s.cv.summary}</h3>
            <p className="max-w-3xl text-lg leading-relaxed text-bone/80">{cv.summary}</p>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h3 className="lbl">{s.cv.experience}</h3>
            <div className="space-y-5">
              {cv.experience.map((e, i) => (
                <div key={i} className="rounded-2xl border border-line bg-ink p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-lg font-bold">{e.role} <span className="text-bone/50">— {e.company}</span></p>
                    <p className="text-xs uppercase tracking-wider text-lime" dir="ltr">{e.period}</p>
                  </div>
                  <p className="mt-2 text-sm text-bone/65">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h3 className="lbl">{s.cv.freelance}</h3>
            <div className="space-y-5">
              {cv.freelance.map((e, i) => (
                <div key={i} className="rounded-2xl border border-line bg-ink p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-lg font-bold">{e.role} <span className="text-bone/50">— {e.company}</span></p>
                    <p className="text-xs uppercase tracking-wider text-lime" dir="ltr">{e.period}</p>
                  </div>
                  <p className="mt-2 text-sm text-bone/65">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <section>
              <h3 className="lbl">{s.cv.skills}</h3>
              <div className="flex flex-wrap gap-2">
                {cv.skills.map((sk) => (
                  <span key={sk} className="rounded-full border border-line px-3.5 py-1.5 text-sm">{sk}</span>
                ))}
              </div>
            </section>
          </Reveal>
          <Reveal delay={0.05}>
            <section>
              <h3 className="lbl">{s.cv.software}</h3>
              <div className="flex flex-wrap gap-2">
                {cv.software.map((sw) => (
                  <span key={sw} className="rounded-full bg-lime/10 px-3.5 py-1.5 text-sm text-lime" dir="ltr">{sw}</span>
                ))}
              </div>
            </section>
          </Reveal>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <section>
              <h3 className="lbl">{s.cv.education}</h3>
              <ul className="space-y-3">
                {cv.education.map((e, i) => (
                  <li key={i} className="rounded-2xl border border-line bg-ink p-4">
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-sm text-bone/60">{e.place} · <span className="text-lime" dir="ltr">{e.period}</span></p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Reveal delay={0.05}>
            <section>
              <h3 className="lbl">{s.cv.certs}</h3>
              <ul className="space-y-3">
                {cv.certifications.map((e, i) => (
                  <li key={i} className="rounded-2xl border border-line bg-ink p-4">
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-sm text-bone/60">{e.place} · <span className="text-lime" dir="ltr">{e.period}</span></p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <Reveal>
          <section className="border-t border-line pt-8">
            <h3 className="lbl">{s.cv.languages}</h3>
            <div className="flex flex-wrap gap-3">
              {cv.languages.map((l) => (
                <span key={l.name} className="rounded-full border border-line px-4 py-2 text-sm">
                  {l.name} <span className="text-mut">— {l.level}</span>
                </span>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      <div className="no-print mt-10 flex flex-wrap gap-4">
        <Link href="/book-meeting" className="btn-primary">{s.cv.workCta}</Link>
        <Link href="/book-course" className="btn-ghost">{s.cv.learnCta}</Link>
      </div>
    </div>
  );
}
