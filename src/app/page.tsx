import Link from "next/link";
import { db } from "@/db";
import { projects, clients, testimonials, services } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getSetting } from "@/lib/server";
import { getLang } from "@/i18n/lang";
import { pick, categoryLabel } from "@/i18n/strings";
import { Reveal, Marquee, SectionHead, ProjectCard, TestimonialCard, type WorkItem } from "@/components/ui";
import { WordReveal, ParallaxFrame, Magnetic, StatCounter } from "@/components/motionx";

export const dynamic = "force-dynamic";

const PORTRAIT =
  "https://images.pexels.com/photos/38017833/pexels-photo-38017833.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800";

export default async function HomePage() {
  const { ar, s } = await getLang();
  const [allProjects, clientRows, testimonialRows, serviceRows, hero, site] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.sortOrder)),
    db.select().from(clients).orderBy(asc(clients.sortOrder)),
    db.select().from(testimonials).where(eq(testimonials.active, true)).orderBy(asc(testimonials.sortOrder)),
    db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder)),
    getSetting<any>("hero", { name: "Wala Khalid", nameAr: "ولاء خالد", role: "Motion Designer", roleAr: "مصمم موشن", intro: "", introAr: "", location: "", locationAr: "", stats: [], statsAr: [] }),
    getSetting<any>("site", { availabilityNote: "", availabilityNoteAr: "" }),
  ]);

  const featured = allProjects.filter((p) => p.featured).slice(0, 4);
  const workItems: WorkItem[] = allProjects.map((p) => ({
    id: p.id,
    title: pick(p.titleAr, p.title, ar) as string,
    slug: p.slug,
    cover: p.cover,
    video: p.video,
    client: p.client,
    category: categoryLabel(p.category, ar),
    year: p.year,
  }));
  const t3 = testimonialRows.slice(0, 3);
  const tRest = testimonialRows.slice(3);
  const showTestimonials = tRest.length ? tRest : t3;
  const stats = (ar ? hero.statsAr : hero.stats) ?? hero.stats ?? [];
  const nameParts = (ar ? hero.nameAr ?? hero.name : hero.name).split(" ");

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="grid-bg relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[480px] rounded-full bg-violet/15 blur-[140px] float-y-slow" />
        <div className="pointer-events-none absolute -left-40 top-64 size-[420px] rounded-full bg-lime/10 blur-[140px] float-y" />
        {/* floating deco shapes */}
        <svg className="pointer-events-none absolute right-[12%] top-24 hidden size-16 text-lime/40 float-y lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.5-6.2-4.6-6.2 4.6 2.4-7.5L2 9.6h7.6z" />
        </svg>
        <svg className="pointer-events-none absolute bottom-24 left-[8%] hidden size-12 rotate-12 text-violet/50 float-y-slow lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 4v16M4 12h16" strokeLinecap="round" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Reveal>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-ink2/80 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-bone/70">
                  <span className="size-2 rounded-full bg-lime pulse-dot" />
                  {pick(site.availabilityNoteAr, site.availabilityNote, ar) || (ar ? "متاح للحجز" : "Available for projects")}
                </p>
              </Reveal>
              <h1 className="font-display font-extrabold uppercase leading-[0.98] tracking-tight">
                <WordReveal text={nameParts[0]} delay={0.05} className="block text-[15vw] md:text-8xl lg:text-8xl" />
                <WordReveal text={nameParts[1] ?? "Motion"} delay={0.2} className="text-outline block text-[15vw] md:text-8xl lg:text-8xl" />
              </h1>
              <Reveal delay={0.35}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/75 md:text-xl">
                  {ar ? "أنا " : "I'm a "}
                  <span className="font-semibold text-lime">{pick(hero.roleAr, hero.role, ar)}</span>
                  {" — "}
                  {pick(hero.introAr, hero.intro, ar)}
                </p>
              </Reveal>
              <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-4">
                <Magnetic>
                  <Link href="/work" className="btn-primary">
                    {s.hero.viewWork}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className={ar ? "rotate-180" : ""}>
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/book-meeting" className="btn-ghost">{s.hero.workWithMe}</Link>
                </Magnetic>
              </Reveal>
              <Reveal delay={0.55} className="mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
                {stats.map((st: any, i: number) => (
                  <div key={i} className="bg-ink2 px-4 py-4">
                    <StatCounter value={String(st.k)} />
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-mut">{st.l}</p>
                  </div>
                ))}
              </Reveal>
            </div>

            <Reveal delay={0.25} y={40} className="relative hidden lg:block">
              <ParallaxFrame className="group relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-lime/20 via-transparent to-violet/20 blur-xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero.jpg"
                  alt="Abstract motion design artwork — ribbons of light"
                  className="relative w-full rounded-3xl border border-line object-cover shadow-2xl shadow-violet/10"
                />
                <div className="absolute -start-8 -top-8 grid size-28 place-items-center">
                  <svg viewBox="0 0 100 100" className="spin-slow size-28" aria-hidden>
                    <defs>
                      <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                    </defs>
                    <text fill="#d7ff3f" fontSize="10.5" letterSpacing="2.5" className="font-display">
                      <textPath href="#circ">{ar ? "موشن • تصميم • 2D • 3D •" : "MOTION • DESIGN • 2D • 3D •"}</textPath>
                    </text>
                  </svg>
                </div>
                <div className="absolute -bottom-5 -end-4 rounded-2xl border border-line bg-ink2/95 px-5 py-4 backdrop-blur float-y-slow">
                  <p className="font-display text-sm font-bold text-lime">{s.hero.badge}</p>
                  <p className="text-xs text-mut">{pick(hero.locationAr, hero.location, ar)}</p>
                </div>
              </ParallaxFrame>
            </Reveal>
          </div>
        </div>

        <div className="relative mt-16 border-y border-line bg-ink2/60 py-5 md:mt-24">
          <Marquee items={s.hero.marquee} />
        </div>
      </section>

      {/* ================= SELECTED WORK ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHead
          kicker={s.work.kicker}
          title={ar ? "أحدث الأعمال" : "Recent projects"}
          right={
            <Link href="/work" className="group inline-flex items-center gap-2 text-sm font-semibold text-bone/80 hover:text-lime">
              {s.work.all}
              <span className={`transition-transform group-hover:translate-x-1 ${ar ? "rotate-180 group-hover:-translate-x-1" : ""}`}>→</span>
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProjectCard p={workItems.find((w) => w.id === p.id)!} big />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="border-y border-line bg-ink2/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="absolute -inset-3 rounded-3xl border border-lime/30" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt={ar ? "صورة ولاء خالد، مصمم موشن" : "Portrait of Wala Khalid, motion designer"} loading="lazy" className="relative w-full rounded-3xl border border-line object-cover" />
            <div className="absolute -bottom-4 start-6 rounded-full bg-lime px-4 py-2 font-display text-sm font-bold text-ink">{s.about.badge}</div>
          </Reveal>
          <div>
            <SectionHead kicker={s.about.kicker} title={s.about.title} />
            <Reveal delay={0.1}>
              <p className="-mt-6 max-w-2xl text-lg leading-relaxed text-bone/75">{s.about.p1}</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-bone/60">{s.about.p2}</p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-ink p-5">
                <p className="lbl !mb-3">{s.about.spec}</p>
                <ul className="space-y-1.5 text-sm text-bone/80">
                  {s.about.specItems.map((sp: string) => (
                    <li key={sp} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-lime" /> {sp}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-ink p-5">
                <p className="lbl !mb-3">{s.about.tools}</p>
                <div className="flex flex-wrap gap-2">
                  {s.about.toolList.map((tl: string) => (
                    <span key={tl} className="rounded-full border border-line px-3 py-1 text-xs text-bone/75" dir="ltr">{tl}</span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.24} className="mt-8 flex flex-wrap gap-4">
              <Link href="/cv" className="btn-ghost">{s.about.viewCv}</Link>
              <Link href="/book-course" className="btn-primary">{s.about.bookCourse}</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHead kicker={s.services.kicker} title={s.services.title} />
        <div className="divide-y divide-line border-y border-line">
          {serviceRows.map((sv, i) => (
            <Reveal key={sv.id} delay={i * 0.04}>
              <div className="group grid items-center gap-3 py-6 transition-colors duration-300 hover:bg-ink2/60 md:grid-cols-[80px_1fr_auto] md:gap-6 md:px-4">
                <span className="font-display text-lg font-bold text-mut transition-colors group-hover:text-lime">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-xl font-bold md:text-2xl">{pick(sv.titleAr, sv.title, ar)}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-bone/60">{pick(sv.descriptionAr, sv.description, ar)}</p>
                </div>
                <div className="hidden flex-wrap justify-end gap-2 md:flex">
                  {(sv.tags ?? "").split(",").filter(Boolean).map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-mut" dir="ltr">{t.trim()}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= CLIENTS ================= */}
      <section className="border-y border-line bg-ink2/50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            kicker={s.clients.kicker}
            title={s.clients.title}
            right={
              <Link href="/clients" className="group inline-flex items-center gap-2 text-sm font-semibold text-bone/80 hover:text-lime">
                {s.clients.all}
                <span className={`transition-transform group-hover:translate-x-1 ${ar ? "rotate-180 group-hover:-translate-x-1" : ""}`}>→</span>
              </Link>
            }
          />
        </div>
        <div className="space-y-0">
          <Marquee items={clientRows.slice(0, 4).map((c) => c.name)} speed={30} />
          <div className="border-y border-line py-0">
            <Marquee items={clientRows.slice(4, 8).map((c) => c.name)} speed={34} reverse />
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHead kicker={s.testi.kicker} title={s.testi.title} />
        <div className="grid gap-6 md:grid-cols-3">
          {showTestimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.07}>
              <TestimonialCard t={{ ...t, review: pick(t.reviewAr, t.review, ar) as string }} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/8 blur-[160px]" />
        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center md:px-8 md:py-36">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-lime">{s.cta.have}</p>
            <WordReveal text={s.cta.l1} className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl" />
            <br />
            <WordReveal text={s.cta.l2} delay={0.3} className="text-outline-lime font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl" />
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link href="/book-meeting" className="btn-primary text-base">
                {s.cta.bookM}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className={ar ? "rotate-180" : ""}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/book-course" className="btn-ghost text-base">{s.cta.bookC}</Link>
            </Magnetic>
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <p className="text-sm text-mut">{s.cta.note}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
