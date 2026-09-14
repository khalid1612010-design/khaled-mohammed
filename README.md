# Wala Khalid — Motion Designer Portfolio & Booking Platform

A full-stack portfolio, booking and management platform for a freelance Motion Designer.

## What's included

| Feature | Where |
|---|---|
| Homepage (hero, selected work, about, services, clients, testimonials, CTA) | `/` |
| Filterable portfolio + case study pages with in-page video playback | `/work`, `/work/[slug]` |
| Clients & companies showcase (with related projects) | `/clients` |
| CV page + download (print-to-PDF, or your own PDF URL) | `/cv` |
| Private live courses with per-student group pricing (1–5 students) | `/courses`, `/book-course` |
| Project consultation booking (date/time + project brief) | `/book-meeting` |
| Contact page + form | `/contact` |
| Admin dashboard (full content management) | `/admin` |
| Availability engine: working days/hours, blocked dates & slots, double-booking prevention | `/admin/availability` |
| Bookings management: accept / reject / cancel / reschedule | `/admin/bookings` |
| Admin notification inbox (new bookings + contact messages) | `/admin` → Overview |
| SEO: per-page metadata, OG images, `sitemap.xml`, `robots.txt` | — |

## Tech stack

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Framer Motion
- **Backend:** Next.js route handlers (serverless API)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** HTTP-only session cookie (server-validated, 7-day expiry)
- **Video/media:** remote MP4 URLs (Pexels in the seed) + base64 uploads for images (auto-downscaled)
- **Email:** optional Resend integration (`RESEND_API_KEY`)
- **WhatsApp:** optional webhook (`WHATSAPP_WEBHOOK_URL`)

## Getting started

```bash
npm install
npx drizzle-kit push     # create tables
npx tsx src/db/seed.ts   # seed demo content (safe to re-run)
npm run dev
```

## Bilingual (EN / AR)

- Every visitor can switch language with the **عربي / EN** toggle in the header. The choice is stored in a `lang` cookie; Arabic mode flips the whole site to **RTL** and swaps to the Cairo typeface.
- All site copy lives in `src/i18n/strings.ts`.
- Database content is stored bilingually: projects, clients, testimonials, services and courses each have optional `_ar` fields (editable from the admin), and the CV exists as two settings documents (`cv` and `cv_ar`) with a language tab in the admin.
- Arabic fields are optional — if empty, the English value is shown automatically.

## Admin access

- URL: `/admin`
- Default password: `wala-admin-2025` — override with the env var `ADMIN_PASSWORD`.

## Managing content (no developer needed)

1. **Add a project** → Admin → Portfolio → *+ Add Project*. Paste a cover image (or upload it), paste an MP4 URL (host it on YouTube/Vimeo/Pexels/your storage), set category + *Featured* to show it on the homepage.
2. **Add a client** → Admin → Clients. Leave the logo empty to show a styled text wordmark.
3. **Add a review** → Admin → Testimonials.
4. **Edit your CV** → Admin → CV (summary, experience, skills, software, education, certifications, languages). Set a *CV PDF URL* to enable a direct PDF download, otherwise the Download button uses the browser's print-to-PDF.
5. **Manage courses & group pricing** → Admin → Courses. The five "price factor" inputs control the per-person price for 1–5 students (e.g. `0.8` = 20% off per person).
6. **Availability** → Admin → Availability: toggle working days, set start/end hours and slot length, block full days (vacations) or single slots.
7. **Bookings** → Admin → Bookings: expand a row to see all details, then Accept / Reject / Cancel / Reschedule (rescheduling re-checks the calendar so you can never double-book).
8. **Messages** → Admin → Messages: read, mark read, reply by email, delete.
9. **Socials & contact** → Admin → Settings.

## Notifications

Every course booking, project meeting and contact message:

- appears instantly in **Admin → Overview → Notifications**
- is emailed to you automatically when `RESEND_API_KEY` + `ADMIN_EMAIL` env vars are set (Resend)
- can be pushed to WhatsApp via `WHATSAPP_WEBHOOK_URL` (any HTTP endpoint / 3rd-party service)

## Booking rules

- Visitors can only pick dates/times that match your working days & hours, are not in the past, are not blocked, and are not already taken — double booking is prevented at creation **and** at reschedule time.
- Course requests carry the calculated price (per-student factor × students).
- Meetings are **free consultations** — no fixed project pricing anywhere in the funnel.

## SEO

- Unique `<title>`/meta description per page, Open Graph + Twitter cards (hero image as OG image).
- Dynamic `sitemap.xml` (includes all project + course URLs) and `robots.txt` (admin blocked).
- Lazy-loaded images, `preload="metadata"`/`preload="none"` videos so bandwidth is only spent when a visitor plays something.

## Scalability notes

The schema is deliberately generic: `bookings` is a single polymorphic table (type = `course` | `meeting`) so new booking types just need a new type + a wizard. `settings` is a key/value JSON store (hero, socials, CV, availability) so new site-wide content can be added without migrations. Courses, services and categories are all data-driven — add as many as you like from the dashboard.

## Default credentials / demo data

- Admin password: `wala-admin-2025`
- Seeded: 8 projects, 8 clients, 5 testimonials, 5 services, 4 courses.
