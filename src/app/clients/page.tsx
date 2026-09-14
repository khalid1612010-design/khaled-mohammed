import Link from "next/link";
import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getLang } from "@/i18n/lang";
import { pick } from "@/i18n/strings";
import { Reveal, SectionHead } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clients & Companies | العملاء والشركات",
  description:
    "The startups, studios and brands that have trusted Wala Khalid with their motion — fintech, gaming, energy, coffee and more.",
};

export default async function ClientsPage() {
  const { ar, s } = await getLang();
  const [clientRows, projRows] = await Promise.all([
    db.select().from(clients).orderBy(asc(clients.sortOrder)),
    db.select().from(projects).orderBy(asc(projects.sortOrder)),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <SectionHead kicker={s.clients.kicker} title={s.clients.title} right={<p className="max-w-xs text-sm text-mut">{s.clients.pageRight}</p>} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clientRows.map((c, i) => {
          const related = projRows.filter((p) => p.client === c.name);
          return (
            <Reveal key={c.id} delay={(i % 3) * 0.06}>
              <div className="group flex h-full flex-col rounded-2xl border border-line bg-ink2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40">
                <div className="mb-5 flex items-center justify-between">
                  {c.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logoUrl} alt={`${c.name} logo`} className="max-h-10 max-w-[140px] object-contain" />
                  ) : (
                    <span className="font-display text-2xl font-extrabold tracking-tight transition-colors group-hover:text-lime">{c.name}</span>
                  )}
                  <span className="grid size-10 place-items-center rounded-full border border-line text-mut transition-all group-hover:border-lime group-hover:text-lime">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-bone/65">{pick(c.descriptionAr, c.description, ar)}</p>
                {related.length > 0 && (
                  <div className="mt-6 border-t border-line pt-4">
                    <p className="lbl !mb-2">{s.clients.together}</p>
                    <div className="flex flex-wrap gap-2">
                      {related.map((p) => (
                        <Link key={p.id} href={`/work/${p.slug}`} className="rounded-full border border-line px-3 py-1 text-xs text-bone/75 transition-colors hover:border-lime hover:text-lime">
                          {pick(p.titleAr, p.title, ar)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-ink2 px-8 py-14 text-center">
          <h2 className="font-display text-3xl font-extrabold md:text-5xl">{s.clients.next}</h2>
          <p className="max-w-md text-bone/60">{s.clients.nextDesc}</p>
          <Link href="/book-meeting" className="btn-primary mt-2">{s.clients.book}</Link>
        </div>
      </Reveal>
    </div>
  );
}
