"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Marquee strip ---------------- */
export function Marquee({
  items,
  reverse = false,
  speed = 28,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  speed?: number;
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={`marquee-pause overflow-hidden ${className}`}>
      <div
        className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
        style={{ ["--marquee-speed" as string]: `${speed}s` }}
      >
        {row.map((it, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="px-6 font-display text-2xl font-bold uppercase tracking-tight md:px-10 md:text-4xl">
              {it}
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0 text-lime" aria-hidden>
              <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.5-6.2-4.6-6.2 4.6 2.4-7.5L2 9.6h7.6z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHead({
  kicker,
  title,
  right,
}: {
  kicker: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
      <div>
        <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-lime">
          <span className="inline-block size-2 rounded-full bg-lime pulse-dot" />
          {kicker}
        </p>
        <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
          {title}
        </h2>
      </div>
      {right}
    </Reveal>
  );
}

/* ---------------- Project card ---------------- */
export type WorkItem = {
  id: number;
  title: string;
  slug: string;
  cover: string;
  video?: string | null;
  client?: string | null;
  category: string;
  year?: number | null;
};

export function ProjectCard({ p, big = false }: { p: WorkItem; big?: boolean }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-ink2"
    >
      <div className={`relative overflow-hidden ${big ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.cover}
          alt={`${p.title} — ${p.category} project by Wala Khalid`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
        {p.video && (
          <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-lime text-ink opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 md:p-5">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-lime">
              {p.category} · {p.year}
            </p>
            <h3 className={`font-display font-bold leading-tight ${big ? "text-xl md:text-3xl" : "text-lg"}`}>
              {p.title}
            </h3>
            {p.client && <p className="mt-1 text-xs text-bone/60">{p.client}</p>}
          </div>
          <span className="mb-1 grid size-10 shrink-0 -translate-x-2 place-items-center rounded-full border border-bone/30 text-bone opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:border-lime group-hover:text-lime">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ---------------- Stars ---------------- */
export function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-lime" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"
            fill={i < n ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={i < n ? 0 : 1.4}
          />
        </svg>
      ))}
    </div>
  );
}

/* ---------------- Testimonial card ---------------- */
export function TestimonialCard({
  t,
}: {
  t: { name: string; company?: string | null; position?: string | null; review: string; avatar?: string | null; rating: number };
}) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-ink2 p-6 transition-colors duration-300 hover:border-lime/40 md:p-7">
      <div>
        <Stars n={t.rating} />
        <blockquote className="mt-4 text-[15px] leading-relaxed text-bone/85">
          &ldquo;{t.review}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.avatar} alt={t.name} loading="lazy" className="size-11 rounded-full object-cover" />
        ) : (
          <span className="grid size-11 place-items-center rounded-full bg-violet/20 font-display text-sm font-bold text-violet">
            {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-mut">
            {[t.position, t.company].filter(Boolean).join(" · ")}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/* ---------------- CV download button ---------------- */
export function DownloadCVButton({ href, label }: { href?: string; label?: string }) {
  return href ? (
    <a href={href} download className="btn-primary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label || "Download CV (PDF)"}
    </a>
  ) : (
    <button onClick={() => window.print()} className="btn-primary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label || "Download CV"}
    </button>
  );
}

/* ---------------- Chip ---------------- */
export function Chip({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
        active
          ? "border-lime bg-lime text-ink font-semibold"
          : "border-line text-bone/70 hover:border-lime/50 hover:text-bone"
      }`}
    >
      {children}
    </Tag>
  );
}
