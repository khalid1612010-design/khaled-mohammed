"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

/* ---------- shared helpers (exported for section files) ---------- */

export async function api(path: string, opts?: RequestInit) {
  const res = await fetch(`/api/admin/${path}`, opts);
  const d = await res.json().catch(() => ({}));
  if (!res.ok || !d.ok) throw new Error(d.error || `Request failed (${res.status})`);
  return d;
}

export function fileToDataUrl(file: File, maxKB = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      if (url.length > maxKB * 1024) {
        // downscale images on canvas to stay under the size cap
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, Math.sqrt((maxKB * 1024) / url.length));
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = url;
      } else {
        resolve(url);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-ink2/60">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="font-display text-base font-bold">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    accepted: "bg-lime/10 text-lime border-lime/30",
    rejected: "bg-red-400/10 text-red-300 border-red-400/30",
    cancelled: "bg-mut/10 text-mut border-mut/30",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${map[status] || map.cancelled}`}>
      {status}
    </span>
  );
}

/* ---------- sidebar ---------- */

const NAV: { section: string; label: string; icon: string }[] = [
  { section: "overview", label: "Overview", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { section: "projects", label: "Portfolio", icon: "M4 5h16v14H4zM4 15l4-4 3 3 4-5 5 6" },
  { section: "clients", label: "Clients", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-1a6 6 0 0112 0v1" },
  { section: "testimonials", label: "Testimonials", icon: "M4 5h16v11H9l-5 4z" },
  { section: "courses", label: "Courses", icon: "M12 4L2 9l10 5 10-5zM6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" },
  { section: "services", label: "Services", icon: "M14 6l4 4L7 21H3v-4zM12 8l4 4" },
  { section: "bookings", label: "Bookings", icon: "M5 5h14v16H5zM9 3v4M15 3v4M5 10h14" },
  { section: "availability", label: "Availability", icon: "M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z" },
  { section: "cv", label: "CV", icon: "M6 3h9l5 5v13H6zM14 3v6h6" },
  { section: "contact", label: "Messages", icon: "M4 6h16v12H4zM4 7l8 6 8-6" },
  { section: "settings", label: "Settings", icon: "M12 9a3 3 0 100 6 3 3 0 000-6zM19 12l2-1-2-4-2.3.7A7 7 0 0014 6l.4-2.4H10L10.4 6A7 7 0 008.3 8.7L6 8l-2 4 2 1-2 1 2 4 2.3-.7A7 7 0 0010 18l-.4 2.4h4L14 18a7 7 0 002.3-2.7L19 16l2-4z" },
];

export default function AdminShell({ section }: { section: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const render = useCallback(() => {
    switch (section) {
      case "overview": return <Overview />;
      case "projects": return <ProjectsSection />;
      case "clients": return <ClientsSection />;
      case "testimonials": return <TestimonialsSection />;
      case "courses": return <CoursesSection />;
      case "services": return <ServicesSection />;
      case "bookings": return <BookingsSection />;
      case "availability": return <AvailabilitySection />;
      case "cv": return <CVSection />;
      case "contact": return <MessagesSection />;
      case "settings": return <SettingsSection />;
      default: return <Overview />;
    }
  }, [section]);

  const active = NAV.find((n) => n.section === section) ?? NAV[0];

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 w-60 shrink-0 border-r border-line bg-ink2/80 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-line px-5">
          <span className="grid size-9 place-items-center rounded-full bg-lime font-display text-sm font-extrabold text-ink">WK</span>
          <div>
            <p className="font-display text-sm font-bold">Admin</p>
            <p className="text-[11px] text-mut">Motion Studio</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-y-auto p-3" style={{ height: "calc(100% - 4rem - 4.5rem)" }}>
          {NAV.map((n) => (
            <Link
              key={n.section}
              href={n.section === "overview" ? "/admin" : `/admin/${n.section}`}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                n.section === section
                  ? "bg-lime/10 font-semibold text-lime"
                  : "text-bone/60 hover:bg-ink3 hover:text-bone"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={n.icon} />
              </svg>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-line p-3">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm text-bone/60 hover:bg-ink3 hover:text-bone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M14 4h6v6M20 4L10 14M9 5H5v14h14v-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            View Site
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm text-bone/60 hover:bg-ink3 hover:text-red-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M9 4H5v16h4M15 8l4 4-4 4M19 12H9" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Log out
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* main */}
      <div className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-ink/85 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-line p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/></svg>
            </button>
            <h1 className="font-display text-lg font-bold">{active.label}</h1>
          </div>
          <p className="hidden text-xs text-mut sm:block">{pathname.replace("/admin", "") || "/admin"}</p>
        </header>
        <main className="p-5 md:p-8">{render()}</main>
      </div>
    </div>
  );
}

/* section imports (defined in separate files) */
import { Overview } from "./sections-ops";
import { MessagesSection, SettingsSection, AvailabilitySection, CVSection, BookingsSection } from "./sections-ops";
import { ProjectsSection, ClientsSection, TestimonialsSection, CoursesSection, ServicesSection } from "./sections-data";
