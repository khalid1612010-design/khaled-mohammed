import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getLang } from "@/i18n/lang";
import { pick, categoryLabel } from "@/i18n/strings";
import { Reveal, SectionHead, type WorkItem } from "@/components/ui";
import WorkFilters from "./WorkFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio — Selected Work | أعمالي",
  description:
    "Browse Wala Khalid's motion design portfolio: brand motion, launch films, explainer videos, 3D pieces and social media motion, filterable by category.",
};

export default async function WorkPage() {
  const { ar, s } = await getLang();
  const all = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  const categories = Array.from(new Set(all.map((p) => p.category))).sort();
  const items: WorkItem[] = all.map((p) => ({
    id: p.id,
    title: pick(p.titleAr, p.title, ar) as string,
    slug: p.slug,
    cover: p.cover,
    video: p.video,
    client: p.client,
    category: categoryLabel(p.category, ar),
    year: p.year,
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <SectionHead
        kicker={s.work.kicker}
        title={s.work.title}
        right={<p className="text-sm text-mut">{all.length} {s.work.count}</p>}
      />
      <WorkFilters items={items} categories={categories} allLabel={`${s.nav.work} · ${all.length}`} ar={ar} />
    </div>
  );
}
