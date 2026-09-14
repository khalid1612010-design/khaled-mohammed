import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getLang } from "@/i18n/lang";
import { pick, categoryLabel } from "@/i18n/strings";
import { Reveal } from "@/components/ui";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return {
    title: "Case Study | دراسة حالة",
    description: "A detailed motion design case study by Wala Khalid.",
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { ar, s } = await getLang();
  const all = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  const { slug } = await params;
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();

  const idx = all.indexOf(p);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];
  const tools = (p.tools ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const title = pick(p.titleAr, p.title, ar) as string;
  const desc = pick(p.descriptionAr, p.description, ar) as string;

  return (
    <div className="pb-24 pt-28 md:pt-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <Link href="/work" className={`mb-8 inline-flex items-center gap-2 text-sm text-mut hover:text-lime ${ar ? "flex-row-reverse" : ""}`}>
            ← {s.work.back}
          </Link>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-lime">{categoryLabel(p.category, ar)} · {p.year}</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-7xl">{title}</h1>
          {p.client && <p className="mt-3 text-lg text-bone/60">{ar ? `مع ${p.client}` : `for ${p.client}`}</p>}
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {[
            [s.work.meta.client, p.client ?? "—"],
            [s.work.meta.year, String(p.year ?? "—")],
            [s.work.meta.category, categoryLabel(p.category, ar)],
            [s.work.meta.tools, tools.slice(0, 3).join(", ") || "—"],
          ].map(([k, v]) => (
            <div key={k} className="bg-ink2 px-5 py-4">
              <p className="text-[11px] uppercase tracking-wider text-mut">{k}</p>
              <p className="mt-1 text-sm font-semibold" dir={k === s.work.meta.tools ? "ltr" : undefined}>{v}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Video player */}
      <div className="mx-auto mt-10 max-w-6xl px-5 md:px-8">
        <Reveal y={40}>
          <div className="group relative overflow-hidden rounded-2xl border border-line bg-black">
            {p.video ? (
              <video
                key={p.video}
                src={p.video}
                poster={p.cover}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full"
              >
                Your browser does not support embedded video.
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.cover} alt={title} className="aspect-video w-full object-cover" />
            )}
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_320px]">
        <div>
          <Reveal>
            {desc.split("\n\n").map((para, i) => (
              <p key={i} className="mb-5 max-w-3xl text-lg leading-relaxed text-bone/80">{para}</p>
            ))}
          </Reveal>

          {p.media && p.media.length > 0 && (
            <div className="mt-10">
              <Reveal>
                <h2 className="font-display mb-6 text-2xl font-bold">{s.work.behind}</h2>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2">
                {p.media.map((m, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <figure className="overflow-hidden rounded-2xl border border-line bg-ink2">
                      {m.type === "video" ? (
                        <video src={m.url} poster={p.cover} controls playsInline preload="none" className="aspect-video w-full" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt={m.caption ?? "Project media"} loading="lazy" className="aspect-video w-full object-cover" />
                      )}
                      {m.caption && <figcaption className="px-4 py-3 text-xs text-mut">{m.caption}</figcaption>}
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:pt-24">
          {tools.length > 0 && (
            <Reveal>
              <div className="rounded-2xl border border-line bg-ink2 p-6">
                <p className="lbl !mb-3">{s.work.software}</p>
                <div className="flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 text-xs" dir="ltr">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-lime/30 bg-lime/5 p-6">
              <p className="font-display text-lg font-bold">{s.work.want}</p>
              <p className="mt-2 text-sm text-bone/70">{s.work.wantDesc}</p>
              <Link href="/book-meeting" className="btn-primary mt-5 w-full justify-center !py-3 text-sm">{s.work.book}</Link>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* prev / next */}
      <div className="mx-auto mt-16 grid max-w-7xl gap-4 px-5 md:grid-cols-2 md:px-8">
        <Link href={`/work/${prev.slug}`} className="group rounded-2xl border border-line bg-ink2 p-5 transition-colors hover:border-lime/40">
          <p className="text-xs uppercase tracking-wider text-mut">{s.work.prev} ←</p>
          <p className="mt-1 font-display text-lg font-bold group-hover:text-lime">{pick(prev.titleAr, prev.title, ar)}</p>
        </Link>
        <Link href={`/work/${next.slug}`} className="group rounded-2xl border border-line bg-ink2 p-5 text-end transition-colors hover:border-lime/40">
          <p className="text-xs uppercase tracking-wider text-mut">→ {s.work.next}</p>
          <p className="mt-1 font-display text-lg font-bold group-hover:text-lime">{pick(next.titleAr, next.title, ar)}</p>
        </Link>
      </div>
    </div>
  );
}
