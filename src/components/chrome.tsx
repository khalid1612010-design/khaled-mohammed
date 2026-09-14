"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LangToggle } from "./motionx";

function navLinks(nav: any) {
  return [
    { href: "/work", label: nav.work },
    { href: "/clients", label: nav.clients },
    { href: "/courses", label: nav.courses },
    { href: "/cv", label: nav.cv },
    { href: "/contact", label: nav.contact },
  ];
}

export function Nav({ ar, nav, brandName }: { ar: boolean; nav: any; brandName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const LINKS = navLinks(nav);

  return (
    <>
      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-ink/85 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="group flex items-center gap-2" aria-label={brandName}>
            <span className="grid size-9 place-items-center rounded-full bg-lime font-display text-sm font-extrabold text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
              WK
            </span>
            <span className="font-display text-sm font-bold tracking-wide">
              {brandName}
              <span className="text-lime">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm transition-colors hover:text-lime ${
                  pathname.startsWith(l.href) ? "text-lime" : "text-bone/80"
                }`}
              >
                {l.label}
                <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-lime transition-all duration-300 ${pathname.startsWith(l.href) ? "w-full" : "w-0"}`} />
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <LangToggle ar={ar} />
              <Link href="/book-meeting" className="btn-primary !px-5 !py-2.5 text-sm">
                {nav.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className={`transition-transform group-hover:translate-x-1 ${ar ? "rotate-180" : ""}`}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LangToggle ar={ar} />
            <button className="flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
              <span className={`h-0.5 w-6 bg-bone transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-6 bg-bone transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-6 bg-bone transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="no-print fixed inset-0 z-40 flex flex-col justify-center bg-ink/97 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link href={l.href} className="font-display text-4xl font-bold tracking-tight hover:text-lime">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link href="/book-meeting" className="btn-primary mt-4">
                  {nav.cta}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer({ ar, f, brandName, socials }: { ar: boolean; f: any; brandName: string; socials?: Record<string, string> }) {
  const so = socials ?? {};
  const SOCIALS = [
    { key: "instagram", label: "Instagram", href: so.instagram ?? "", handle: "@walakhalid.motion" },
    { key: "tiktok", label: "TikTok", href: so.tiktok ?? "", handle: "@walakhalid.motion" },
    { key: "behance", label: "Behance", href: so.behance ?? "", handle: "walakhalid" },
    { key: "linkedin", label: "LinkedIn", href: so.linkedin ?? "", handle: "in/walakhalid" },
    { key: "youtube", label: "YouTube", href: so.youtube ?? "", handle: "@walakhalid" },
  ].filter((x) => x.href);

  return (
    <footer className="no-print relative overflow-hidden border-t border-line bg-ink2">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-mut">{f.ready}</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {f.l1}
              <br />
              <span className="text-outline-lime">{f.l2}</span>
            </h2>
            <a href={`mailto:${so.email || "hello@walakhalid.design"}`} className="mt-5 inline-block text-lg text-lime hover:underline" dir="ltr">
              {so.email || "hello@walakhalid.design"}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            {SOCIALS.map((x) => (
              <a key={x.key} href={x.href} target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-bone/70 hover:text-lime" title={x.label}>
                <span className="size-1.5 rounded-full bg-lime/60 transition-transform group-hover:scale-150" />
                {x.label}
                <span className="text-mut" dir="ltr">· {x.handle}</span>
              </a>
            ))}
            <div className="col-span-2 mt-4 flex flex-wrap gap-6">
              <Link href="/book-meeting" className="text-lime hover:underline">{f.bookM}</Link>
              <Link href="/book-course" className="text-lime hover:underline">{f.bookC}</Link>
              <Link href="/cv" className="hover:underline">{f.viewCv}</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-mut md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brandName} — {ar ? "مصمم موشن" : "Motion Designer"}. {f.rights}
          </p>
          <p>{f.animated}</p>
        </div>
      </div>
    </footer>
  );
}
