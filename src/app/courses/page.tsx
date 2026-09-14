import Link from "next/link";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getLang } from "@/i18n/lang";
import { pick } from "@/i18n/strings";
import { Reveal } from "@/components/ui";
import { WordReveal } from "@/components/motionx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Private Courses | كورسات خاصة",
  description:
    "Learn motion design through live, private sessions with Wala Khalid — taught personally, 1 to 5 students, with real briefs and frame-by-frame reviews.",
};

function durLabel(dur: string, ar: boolean): string {
  const m = dur?.match(/(\d+)/);
  if (!m) return dur;
  return ar ? `${m[1]} أسابيع` : dur;
}

export default async function CoursesPage() {
  const { ar, s } = await getLang();
  const rows = await db.select().from(courses).where(eq(courses.active, true)).orderBy(asc(courses.sortOrder));

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <div className="mb-14 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-lime">{s.courses.kicker}</p>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            <WordReveal text={s.courses.titleA} />
            <br />
            <WordReveal text={s.courses.titleB} delay={0.25} className="text-outline-lime" />
          </h1>
        </div>
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-line bg-ink2 p-6 text-sm leading-relaxed text-bone/70">
            <p className="mb-2 font-semibold text-bone">{s.courses.notPre}</p>
            <p>{s.courses.liveNote}</p>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {rows.map((c, i) => {
          const pricing = c.groupPricing ?? { "1": 1 };
          const per = (n: number) => Math.round((c.price * (pricing[String(n)] ?? 1)));
          const learnings = (ar ? c.learningsAr?.length ? c.learningsAr : c.learnings : c.learnings) ?? [];
          return (
            <Reveal key={c.id} delay={(i % 2) * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-ink2 p-7 transition-colors duration-300 hover:border-lime/40 md:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">{c.sessions} {s.courses.sessions}</span>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-mut">{durLabel(c.duration ?? "", ar)}</span>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-mut">1–{c.maxStudents} {s.courses.size}</span>
                </div>
                <h2 className="font-display text-2xl font-extrabold md:text-3xl">{pick(c.titleAr, c.title, ar)}</h2>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{pick(c.descriptionAr, c.description, ar)}</p>

                <div className="mt-5">
                  <p className="lbl !mb-2">{s.courses.learn}</p>
                  <ul className="grid gap-1.5 text-sm text-bone/80 sm:grid-cols-2">
                    {learnings.map((l: string) => (
                      <li key={l} className="flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-lime" fill="none" aria-hidden>
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex-1" />
                <div className="rounded-xl border border-line bg-ink px-5 py-4">
                  <p className="text-xs uppercase tracking-wider text-mut">{s.courses.perStudent}</p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p className="font-display text-3xl font-extrabold text-lime" dir="ltr">${c.price}</p>
                    <p className="text-xs text-mut" dir="ltr">
                      {Object.keys(pricing).length > 1 ? `${s.courses.groupOf} ${c.maxStudents} → $${per(c.maxStudents)}${s.courses.perPerson}` : ""}
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[11px]">
                    {Array.from({ length: c.maxStudents }).map((_, idx) => {
                      const n = idx + 1;
                      return (
                        <div key={n} className="rounded-md border border-line py-1.5">
                          <p className="text-mut">{n} {ar ? "طالب" : "st"}</p>
                          <p className="font-semibold text-bone" dir="ltr">${per(n)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Link href={`/book-course/${c.id}`} className="btn-primary mt-6 justify-center">{s.courses.book}</Link>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-16">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {s.courses.steps.map((st: string[]) => (
            <div key={st[1]} className="bg-ink2 p-6">
              <p className="font-display text-2xl font-extrabold text-lime" dir="ltr">{st[0]}</p>
              <p className="mt-2 font-display font-bold">{st[1]}</p>
              <p className="mt-1 text-sm text-bone/60">{st[2]}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
