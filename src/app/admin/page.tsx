import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/server";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminShell section="overview" />;
}
