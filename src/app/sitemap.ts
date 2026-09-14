import type { MetadataRoute } from "next";
import { db } from "@/db";
import { projects, courses } from "@/db/schema";

export const dynamic = "force-dynamic";

const BASE = "https://walakhalid.design";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectRows, courseRows] = await Promise.all([
    db.select({ slug: projects.slug }).from(projects),
    db.select({ slug: courses.slug }).from(courses),
  ]);

  const staticPages = ["", "work", "clients", "cv", "courses", "book-course", "book-meeting", "contact"].map(
    (p) => ({
      url: `${BASE}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    }),
  );

  return [
    ...staticPages,
    ...projectRows.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...courseRows.map((c) => ({
      url: `${BASE}/book-course/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
