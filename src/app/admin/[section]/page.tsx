import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/server";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

const SECTIONS = [
  "overview",
  "projects",
  "clients",
  "testimonials",
  "courses",
  "services",
  "bookings",
  "availability",
  "cv",
  "contact",
  "settings",
];

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!SECTIONS.includes(section)) notFound();
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminShell section={section} />;
}
