"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, Card, fileToDataUrl } from "./AdminShell";

function useList<T>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    setLoading(true);
    api(path)
      .then((d) => setItems(d.items ?? []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [path]);
  useEffect(load, [load]);
  return { items, loading, setItems, load };
}

function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-mut">{text}</p>;
}

function FormCard({ title, open, onClose, onSave, children, saving }: {
  title: string; open: boolean; onClose: () => void; onSave: () => void; children: React.ReactNode; saving?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 md:p-10" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-line bg-ink2 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-mut hover:text-bone" aria-label="Close">✕</button>
        </div>
        <div className="grid gap-4">{children}</div>
        <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
          <button onClick={onClose} className="btn-ghost !py-2.5 text-sm">Cancel</button>
          <button onClick={onSave} className="btn-primary !py-2.5 text-sm" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function MediaInput({ label, value, onChange, accept = "image/*" }: { label: string; value: string; onChange: (v: string) => void; accept?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <span className="lbl">{label}</span>
      <div className="flex gap-2">
        <input className="field" value={value.startsWith("data:") ? "(uploaded file)" : value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload" />
        <button type="button" onClick={() => ref.current?.click()} className="btn-ghost shrink-0 !px-4 !py-2 text-xs">Upload</button>
        <input ref={ref} type="file" accept={accept} hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) onChange(await fileToDataUrl(f));
        }} />
      </div>
    </div>
  );
}

/* ================= PROJECTS ================= */

type ProjectRow = any;
const EMPTY_P = { title: "", slug: "", cover: "", video: "", description: "", client: "", category: "Motion Graphics", year: new Date().getFullYear(), tools: "", featured: false, sortOrder: 0, media: [] as any[] };

export function ProjectsSection() {
  const { items, loading, load } = useList<ProjectRow>("projects");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const categories = Array.from(new Set(items.map((i) => i.category)));

  async function save() {
    setSaving(true);
    try {
      const payload = { ...edit, year: Number(edit.year) || undefined, sortOrder: Number(edit.sortOrder) || 0 };
      if (edit.id) await api(`projects/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      else await api("projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setEdit(null);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id: number) {
    if (!confirm("Delete this project?")) return;
    await api(`projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <Card title={`Projects (${items.length})`} action={<button onClick={() => setEdit({ ...EMPTY_P })} className="btn-primary !px-4 !py-2 text-xs">+ Add Project</button>}>
        {loading ? <Empty text="Loading…" /> : items.length === 0 ? <Empty text="No projects yet — add your first one." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="adm-th">Cover</th><th className="adm-th">Title</th><th className="adm-th">Client</th><th className="adm-th">Category</th><th className="adm-th">Year</th><th className="adm-th">Featured</th><th className="adm-th">Order</th><th className="adm-th"></th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-ink3/40">
                    <td className="adm-td"><img src={p.cover} alt="" className="h-10 w-16 rounded-md object-cover" /></td>
                    <td className="adm-td font-semibold">{p.title}</td>
                    <td className="adm-td text-mut">{p.client}</td>
                    <td className="adm-td text-mut">{p.category}</td>
                    <td className="adm-td text-mut">{p.year}</td>
                    <td className="adm-td">{p.featured ? <span className="text-lime">★</span> : <span className="text-mut">—</span>}</td>
                    <td className="adm-td text-mut">{p.sortOrder}</td>
                    <td className="adm-td text-right whitespace-nowrap">
                      <button onClick={() => setEdit(p)} className="mr-3 text-sm text-lime hover:underline">Edit</button>
                      <button onClick={() => del(p.id)} className="text-sm text-red-300 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <FormCard title={edit?.id ? "Edit Project" : "New Project"} open={!!edit} onClose={() => setEdit(null)} onSave={save} saving={saving}>
        {edit && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="lbl">Title *</span><input className="field" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value, slug: edit.id ? edit.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></div>
              <div><span className="lbl">Slug</span><input className="field" value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></div>
            </div>
            <div><span className="lbl">Title (Arabic — optional)</span><input dir="rtl" className="field" value={edit.titleAr ?? ""} onChange={(e) => setEdit({ ...edit, titleAr: e.target.value })} placeholder="العنوان بالعربي" /></div>
            <MediaInput label="Cover image *" value={edit.cover} onChange={(v) => setEdit({ ...edit, cover: v })} />
            <div><span className="lbl">Video URL (MP4 — plays on the project page)</span><input className="field" value={edit.video} onChange={(e) => setEdit({ ...edit, video: e.target.value })} placeholder="https://… .mp4" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="lbl">Client / Company</span><input className="field" value={edit.client} onChange={(e) => setEdit({ ...edit, client: e.target.value })} /></div>
              <div><span className="lbl">Category</span><input className="field" list="adm-cats" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} /><datalist id="adm-cats">{categories.map((c: string) => <option key={c} value={c} />)}</datalist></div>
              <div><span className="lbl">Year</span><input type="number" className="field" value={edit.year} onChange={(e) => setEdit({ ...edit, year: e.target.value })} /></div>
              <div><span className="lbl">Sort order</span><input type="number" className="field" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: e.target.value })} /></div>
            </div>
            <div><span className="lbl">Tools (comma separated)</span><input className="field" value={edit.tools} onChange={(e) => setEdit({ ...edit, tools: e.target.value })} placeholder="After Effects, Cinema 4D" /></div>
            <div><span className="lbl">Description</span><textarea rows={4} className="field" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <div><span className="lbl">Description (Arabic — optional)</span><textarea dir="rtl" rows={4} className="field" value={edit.descriptionAr ?? ""} onChange={(e) => setEdit({ ...edit, descriptionAr: e.target.value })} placeholder="الوصف بالعربي" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /> Featured on homepage</label>
          </>
        )}
      </FormCard>
    </div>
  );
}

/* ================= CLIENTS ================= */

export function ClientsSection() {
  const { items, loading, load } = useList<any>("clients");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const p = { ...edit, sortOrder: Number(edit.sortOrder) || 0 };
      if (edit.id) await api(`clients/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      else await api("clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      setEdit(null); load();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  }
  async function del(id: number) {
    if (!confirm("Delete this client?")) return;
    await api(`clients/${id}`, { method: "DELETE" }); load();
  }

  return (
    <div className="space-y-5">
      <Card title={`Clients (${items.length})`} action={<button onClick={() => setEdit({ name: "", logoUrl: "", description: "", website: "", featured: true, sortOrder: items.length + 1 })} className="btn-primary !px-4 !py-2 text-xs">+ Add Client</button>}>
        {loading ? <Empty text="Loading…" /> : items.length === 0 ? <Empty text="No clients yet." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="adm-th">Logo</th><th className="adm-th">Name</th><th className="adm-th">Description</th><th className="adm-th">Website</th><th className="adm-th"></th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="hover:bg-ink3/40">
                    <td className="adm-td">{c.logoUrl ? <img src={c.logoUrl} alt="" className="h-8 w-20 object-contain" /> : <span className="font-display font-bold">{c.name}</span>}</td>
                    <td className="adm-td font-semibold">{c.name}</td>
                    <td className="adm-td max-w-xs truncate text-mut">{c.description}</td>
                    <td className="adm-td text-mut">{c.website?.replace("https://", "")}</td>
                    <td className="adm-td text-right whitespace-nowrap">
                      <button onClick={() => setEdit(c)} className="mr-3 text-sm text-lime hover:underline">Edit</button>
                      <button onClick={() => del(c.id)} className="text-sm text-red-300 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <FormCard title={edit?.id ? "Edit Client" : "New Client"} open={!!edit} onClose={() => setEdit(null)} onSave={save} saving={saving}>
        {edit && (
          <>
            <div><span className="lbl">Company name *</span><input className="field" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <MediaInput label="Logo (optional — text wordmark shown if empty)" value={edit.logoUrl || ""} onChange={(v) => setEdit({ ...edit, logoUrl: v })} />
            <div><span className="lbl">Short description</span><textarea rows={2} className="field" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <div><span className="lbl">Short description (Arabic — optional)</span><textarea dir="rtl" rows={2} className="field" value={edit.descriptionAr ?? ""} onChange={(e) => setEdit({ ...edit, descriptionAr: e.target.value })} placeholder="وصف قصير بالعربي" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="lbl">Website</span><input className="field" value={edit.website} onChange={(e) => setEdit({ ...edit, website: e.target.value })} placeholder="https://…" /></div>
              <div><span className="lbl">Sort order</span><input type="number" className="field" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: e.target.value })} /></div>
            </div>
          </>
        )}
      </FormCard>
    </div>
  );
}

/* ================= TESTIMONIALS ================= */

export function TestimonialsSection() {
  const { items, loading, load } = useList<any>("testimonials");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const p = { ...edit, rating: Number(edit.rating) || 5, sortOrder: Number(edit.sortOrder) || 0 };
      if (edit.id) await api(`testimonials/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      else await api("testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      setEdit(null); load();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  }
  async function del(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await api(`testimonials/${id}`, { method: "DELETE" }); load();
  }

  return (
    <div className="space-y-5">
      <Card title={`Testimonials (${items.length})`} action={<button onClick={() => setEdit({ name: "", company: "", position: "", review: "", avatar: "", rating: 5, active: true, sortOrder: items.length + 1 })} className="btn-primary !px-4 !py-2 text-xs">+ Add Review</button>}>
        {loading ? <Empty text="Loading…" /> : items.length === 0 ? <Empty text="No testimonials yet." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="adm-th">Client</th><th className="adm-th">Company</th><th className="adm-th">Rating</th><th className="adm-th">Active</th><th className="adm-th"></th></tr></thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id} className="hover:bg-ink3/40">
                    <td className="adm-td">
                      <p className="font-semibold">{t.name}</p>
                      <p className="max-w-md truncate text-xs text-mut">{t.review}</p>
                    </td>
                    <td className="adm-td text-mut">{[t.position, t.company].filter(Boolean).join(" · ")}</td>
                    <td className="adm-td text-lime">{"★".repeat(t.rating)}</td>
                    <td className="adm-td">{t.active ? <span className="text-lime">Yes</span> : <span className="text-mut">No</span>}</td>
                    <td className="adm-td text-right whitespace-nowrap">
                      <button onClick={() => setEdit(t)} className="mr-3 text-sm text-lime hover:underline">Edit</button>
                      <button onClick={() => del(t.id)} className="text-sm text-red-300 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <FormCard title={edit?.id ? "Edit Testimonial" : "New Testimonial"} open={!!edit} onClose={() => setEdit(null)} onSave={save} saving={saving}>
        {edit && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="lbl">Client name *</span><input className="field" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div><span className="lbl">Rating (1–5)</span><input type="number" min={1} max={5} className="field" value={edit.rating} onChange={(e) => setEdit({ ...edit, rating: e.target.value })} /></div>
              <div><span className="lbl">Position</span><input className="field" value={edit.position} onChange={(e) => setEdit({ ...edit, position: e.target.value })} /></div>
              <div><span className="lbl">Company</span><input className="field" value={edit.company} onChange={(e) => setEdit({ ...edit, company: e.target.value })} /></div>
            </div>
            <div><span className="lbl">Review *</span><textarea rows={3} className="field" value={edit.review} onChange={(e) => setEdit({ ...edit, review: e.target.value })} /></div>
            <div><span className="lbl">Review (Arabic — optional)</span><textarea dir="rtl" rows={3} className="field" value={edit.reviewAr ?? ""} onChange={(e) => setEdit({ ...edit, reviewAr: e.target.value })} placeholder="الآراء بالعربي" /></div>
            <MediaInput label="Profile image (optional)" value={edit.avatar || ""} onChange={(v) => setEdit({ ...edit, avatar: v })} />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Active</label>
              <label className="flex items-center gap-2 text-sm">Order <input type="number" className="field !w-20" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: e.target.value })} /></label>
            </div>
          </>
        )}
      </FormCard>
    </div>
  );
}

/* ================= COURSES ================= */

export function CoursesSection() {
  const { items, loading, load } = useList<any>("courses");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function newCourse() {
    return { title: "", slug: "", description: "", duration: "6 weeks", sessions: 8, price: 300, maxStudents: 5, learnings: "", groupPricing: { "1": 1, "2": 0.9, "3": 0.8, "4": 0.72, "5": 0.65 }, active: true, sortOrder: items.length + 1 };
  }

  async function save() {
    setSaving(true);
    try {
      const p = {
        ...edit,
        slug: edit.slug || edit.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        sessions: Number(edit.sessions) || 8,
        price: Number(edit.price) || 0,
        maxStudents: Math.min(5, Math.max(1, Number(edit.maxStudents) || 5)),
        sortOrder: Number(edit.sortOrder) || 0,
        learnings: edit.learnings.split("\n").map((s: string) => s.trim()).filter(Boolean),
        learningsAr: (edit.learningsAr ?? "").split("\n").map((s: string) => s.trim()).filter(Boolean),
        groupPricing: Object.fromEntries(Object.entries(edit.groupPricing).map(([k, v]) => [k, Number(v) || 1])),
      };
      if (edit.id) await api(`courses/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      else await api("courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      setEdit(null); load();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  }
  async function del(id: number) {
    if (!confirm("Delete this course?")) return;
    await api(`courses/${id}`, { method: "DELETE" }); load();
  }

  return (
    <div className="space-y-5">
      <Card title={`Courses (${items.length})`} action={<button onClick={() => setEdit(newCourse())} className="btn-primary !px-4 !py-2 text-xs">+ Add Course</button>}>
        {loading ? <Empty text="Loading…" /> : items.length === 0 ? <Empty text="No courses yet." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="adm-th">Course</th><th className="adm-th">Price</th><th className="adm-th">Sessions</th><th className="adm-th">Max</th><th className="adm-th">Active</th><th className="adm-th"></th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="hover:bg-ink3/40">
                    <td className="adm-td font-semibold">{c.title}</td>
                    <td className="adm-td text-lime">${c.price}</td>
                    <td className="adm-td text-mut">{c.sessions} · {c.duration}</td>
                    <td className="adm-td text-mut">{c.maxStudents}</td>
                    <td className="adm-td">{c.active ? <span className="text-lime">Yes</span> : <span className="text-mut">No</span>}</td>
                    <td className="adm-td text-right whitespace-nowrap">
                      <button onClick={() => setEdit({ ...c, learnings: (c.learnings ?? []).join("\n"), learningsAr: (c.learningsAr ?? []).join("\n") })} className="mr-3 text-sm text-lime hover:underline">Edit</button>
                      <button onClick={() => del(c.id)} className="text-sm text-red-300 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <FormCard title={edit?.id ? "Edit Course" : "New Course"} open={!!edit} onClose={() => setEdit(null)} onSave={save} saving={saving}>
        {edit && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="lbl">Title *</span><input className="field" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value, slug: edit.id ? edit.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></div>
              <div><span className="lbl">Slug</span><input className="field" value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></div>
            </div>
            <div><span className="lbl">Title (Arabic — optional)</span><input dir="rtl" className="field" value={edit.titleAr ?? ""} onChange={(e) => setEdit({ ...edit, titleAr: e.target.value })} placeholder="اسم الكورس بالعربي" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="lbl">Duration (e.g. "6 weeks")</span><input className="field" value={edit.duration} onChange={(e) => setEdit({ ...edit, duration: e.target.value })} /></div>
              <div><span className="lbl">Number of sessions</span><input type="number" className="field" value={edit.sessions} onChange={(e) => setEdit({ ...edit, sessions: e.target.value })} /></div>
              <div><span className="lbl">Base price — 1 student (USD)</span><input type="number" className="field" value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value })} /></div>
              <div><span className="lbl">Max students</span><input type="number" min={1} max={5} className="field" value={edit.maxStudents} onChange={(e) => setEdit({ ...edit, maxStudents: e.target.value })} /></div>
            </div>
            <div><span className="lbl">Description</span><textarea rows={3} className="field" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <div><span className="lbl">Description (Arabic — optional)</span><textarea dir="rtl" rows={3} className="field" value={edit.descriptionAr ?? ""} onChange={(e) => setEdit({ ...edit, descriptionAr: e.target.value })} placeholder="وصف الكورس بالعربي" /></div>
            <div><span className="lbl">What students will learn (one per line)</span><textarea rows={5} className="field" value={edit.learnings} onChange={(e) => setEdit({ ...edit, learnings: e.target.value })} /></div>
            <div><span className="lbl">What students will learn — Arabic (one per line, optional)</span><textarea dir="rtl" rows={5} className="field" value={edit.learningsAr ?? ""} onChange={(e) => setEdit({ ...edit, learningsAr: e.target.value })} placeholder="كل سطر نقطة واحدة" /></div>
            <div>
              <span className="lbl">Group pricing — price factor per group size (1 = full price, 0.8 = −20%)</span>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n}>
                    <p className="mb-1 text-center text-[11px] text-mut">{n} st${n > 1 ? ` · $${Math.round((Number(edit.price) || 0) * (Number(edit.groupPricing?.[String(n)]) || 1))}` : ""}</p>
                    <input
                      type="number" step={0.01} min={0.3} max={1.2}
                      className="field text-center"
                      value={edit.groupPricing?.[String(n)] ?? 1}
                      onChange={(e) => setEdit({ ...edit, groupPricing: { ...edit.groupPricing, [String(n)]: e.target.value } })}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Active (visible on site)</label>
              <label className="flex items-center gap-2 text-sm">Order <input type="number" className="field !w-20" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: e.target.value })} /></label>
            </div>
          </>
        )}
      </FormCard>
    </div>
  );
}

/* ================= SERVICES ================= */

export function ServicesSection() {
  const { items, loading, load } = useList<any>("services");
  const [edit, setEdit] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const p = { ...edit, sortOrder: Number(edit.sortOrder) || 0 };
      if (edit.id) await api(`services/${edit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      else await api("services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      setEdit(null); load();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  }
  async function del(id: number) {
    if (!confirm("Delete this service?")) return;
    await api(`services/${id}`, { method: "DELETE" }); load();
  }

  return (
    <div className="space-y-5">
      <Card title={`Services (${items.length})`} action={<button onClick={() => setEdit({ title: "", description: "", tags: "", active: true, sortOrder: items.length + 1 })} className="btn-primary !px-4 !py-2 text-xs">+ Add Service</button>}>
        {loading ? <Empty text="Loading…" /> : items.length === 0 ? <Empty text="No services yet." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="adm-th">Service</th><th className="adm-th">Tags</th><th className="adm-th">Active</th><th className="adm-th"></th></tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="hover:bg-ink3/40">
                    <td className="adm-td"><p className="font-semibold">{s.title}</p><p className="max-w-md truncate text-xs text-mut">{s.description}</p></td>
                    <td className="adm-td text-mut">{s.tags}</td>
                    <td className="adm-td">{s.active ? <span className="text-lime">Yes</span> : <span className="text-mut">No</span>}</td>
                    <td className="adm-td text-right whitespace-nowrap">
                      <button onClick={() => setEdit(s)} className="mr-3 text-sm text-lime hover:underline">Edit</button>
                      <button onClick={() => del(s.id)} className="text-sm text-red-300 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <FormCard title={edit?.id ? "Edit Service" : "New Service"} open={!!edit} onClose={() => setEdit(null)} onSave={save} saving={saving}>
        {edit && (
          <>
            <div><span className="lbl">Title *</span><input className="field" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></div>
            <div><span className="lbl">Title (Arabic — optional)</span><input dir="rtl" className="field" value={edit.titleAr ?? ""} onChange={(e) => setEdit({ ...edit, titleAr: e.target.value })} placeholder="اسم الخدمة بالعربي" /></div>
            <div><span className="lbl">Description</span><textarea rows={2} className="field" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <div><span className="lbl">Description (Arabic — optional)</span><textarea dir="rtl" rows={2} className="field" value={edit.descriptionAr ?? ""} onChange={(e) => setEdit({ ...edit, descriptionAr: e.target.value })} placeholder="الوصف بالعربي" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="lbl">Tags (comma separated)</span><input className="field" value={edit.tags} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} /></div>
              <label className="mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Active</label>
            </div>
          </>
        )}
      </FormCard>
    </div>
  );
}
