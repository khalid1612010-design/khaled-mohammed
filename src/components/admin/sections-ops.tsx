"use client";

import { useCallback, useEffect, useState } from "react";
import { api, Card, StatusPill } from "./AdminShell";

function useFetch(path: string, deps: any[] = []) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");
  const load = useCallback(() => {
    api(path).then(setData).catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);
  useEffect(load, [load]);
  return { data, setData, load, err };
}

/* ================= OVERVIEW ================= */

export function Overview() {
  const stats = useFetch("stats");
  const notifs = useFetch("notifications");

  async function markAllRead() {
    await api("notifications/all", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: "{}" });
    notifs.load();
  }

  const s = stats.data;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Total bookings", v: s?.bookings },
          { l: "Pending approval", v: s?.pending },
          { l: "Projects", v: s?.projects },
          { l: "Unread messages", v: s?.unreadMessages },
        ].map((x) => (
          <div key={x.l} className="rounded-2xl border border-line bg-ink2/60 p-5">
            <p className="font-display text-4xl font-extrabold text-lime">{x.v ?? "—"}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-mut">{x.l}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Upcoming & recent bookings">
          {!s ? <p className="text-sm text-mut">Loading…</p> : s.upcoming?.length === 0 ? (
            <p className="py-6 text-center text-sm text-mut">No upcoming bookings yet.</p>
          ) : (
            <ul className="space-y-2">
              {s.upcoming.map((b: any) => (
                <li key={b.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{b.type === "course" ? `${b.courseTitle} (${b.students} st)` : b.name}</p>
                    <p className="text-xs text-mut">{b.name} · {b.date} at {b.time} UTC</p>
                  </div>
                  <StatusPill status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Notifications"
          action={
            <button onClick={markAllRead} className="text-xs text-lime hover:underline">Mark all read</button>
          }
        >
          {!notifs.data ? <p className="text-sm text-mut">Loading…</p> : notifs.data.notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-mut">No notifications yet.</p>
          ) : (
            <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {notifs.data.notifications.map((n: any) => (
                <li key={n.id} className={`rounded-xl border px-4 py-3 ${n.read ? "border-line bg-ink opacity-60" : "border-lime/30 bg-lime/5"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    <span className="text-[10px] uppercase tracking-wider text-mut">{n.createdAt?.slice(0, 10)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-xs text-bone/60">{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ================= BOOKINGS ================= */

export function BookingsSection() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const { data, load } = useFetch(`bookings?type=${type}&status=${status}`, [type, status]);
  const [open, setOpen] = useState<number | null>(null);
  const [rs, setRs] = useState<{ date: string; time: string }>({ date: "", time: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function action(id: number, a: string, extra: any = {}) {
    setBusy(true);
    setMsg("");
    try {
      await api(`bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: a, ...extra }) });
      load();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  const bs = data?.bookings ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full border border-line p-1">
          {[["", "All"], ["course", "Courses"], ["meeting", "Meetings"]].map(([v, l]) => (
            <button key={v} onClick={() => setType(v)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${type === v ? "bg-lime text-ink" : "text-bone/60 hover:text-bone"}`}>{l}</button>
          ))}
        </div>
        <select className="field !w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Card title={`Bookings (${bs.length})`}>
        {bs.length === 0 ? <p className="py-10 text-center text-sm text-mut">No bookings match this filter.</p> : (
          <div className="space-y-2">
            {bs.map((b: any) => (
              <div key={b.id} className="rounded-xl border border-line bg-ink">
                <button onClick={() => setOpen(open === b.id ? null : b.id)} className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left">
                  <div>
                    <p className="text-sm font-semibold">
                      <span className="mr-2 rounded bg-ink3 px-2 py-0.5 text-[10px] uppercase tracking-wider text-violet">{b.type}</span>
                      {b.type === "course" ? `${b.courseTitle} — ${b.students} student${b.students > 1 ? "s" : ""}` : `${b.name}${b.company ? ` · ${b.company}` : ""}`}
                    </p>
                    <p className="mt-0.5 text-xs text-mut">
                      {b.date} at {b.time} UTC · {b.email}{b.type === "course" ? ` · $${b.priceTotal} total` : ""}
                    </p>
                  </div>
                  <StatusPill status={b.status} />
                </button>

                {open === b.id && (
                  <div className="border-t border-line px-4 py-4">
                    <div className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                      <Info k="Name" v={b.name} />
                      <Info k="Email" v={b.email} />
                      <Info k="Phone / WhatsApp" v={b.phone || "—"} />
                      {b.type === "course" ? (
                        <>
                          <Info k="Course" v={b.courseTitle} />
                          <Info k="Students" v={`${b.students} (${b.experience || "level not stated"})`} />
                          <Info k="Price" v={`$${b.pricePer}/person — $${b.priceTotal} total`} />
                          <Info k="Message" v={b.message || "—"} />
                        </>
                      ) : (
                        <>
                          <Info k="Company" v={b.company || "—"} />
                          <Info k="Project type" v={b.projectType || "—"} />
                          <Info k="Duration" v={b.projectDuration || "—"} />
                          <Info k="Budget" v={b.budget || "—"} />
                          <Info k="Reference" v={b.reference || "—"} />
                          <div className="sm:col-span-2"><Info k="Description" v={b.projectDesc || "—"} wide /></div>
                        </>
                      )}
                      <Info k="Requested" v={b.createdAt?.slice(0, 16).replace("T", " ")} />
                      <Info k="Note" v={b.note || "—"} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                      {b.status === "pending" && (
                        <>
                          <button disabled={busy} onClick={() => action(b.id, "accept")} className="rounded-full bg-lime px-4 py-2 text-xs font-bold text-ink disabled:opacity-50">Accept</button>
                          <button disabled={busy} onClick={() => action(b.id, "reject")} className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-semibold text-red-300 disabled:opacity-50">Reject</button>
                        </>
                      )}
                      {(b.status === "pending" || b.status === "accepted") && (
                        <button disabled={busy} onClick={() => action(b.id, "cancel")} className="rounded-full border border-line px-4 py-2 text-xs text-mut disabled:opacity-50">Cancel booking</button>
                      )}
                      {(b.status === "pending" || b.status === "accepted") && (
                        <span className="ml-auto flex items-center gap-2">
                          <input type="date" className="field !w-36 !py-2 text-xs" value={rs.date} onChange={(e) => setRs({ ...rs, date: e.target.value })} />
                          <input type="time" className="field !w-28 !py-2 text-xs" value={rs.time} onChange={(e) => setRs({ ...rs, time: e.target.value })} />
                          <button
                            disabled={busy || !rs.date || !rs.time}
                            onClick={() => action(b.id, "reschedule", { date: rs.date, time: rs.time })}
                            className="btn-ghost !px-4 !py-2 text-xs disabled:opacity-40"
                          >
                            Reschedule
                          </button>
                        </span>
                      )}
                    </div>
                    {msg && <p className="mt-3 text-xs text-red-300">{msg}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Info({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[10px] uppercase tracking-wider text-mut">{k}</p>
      <p className="whitespace-pre-line text-bone/85">{v}</p>
    </div>
  );
}

/* ================= AVAILABILITY ================= */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7..21

export function AvailabilitySection() {
  const { data, load } = useFetch("settings");
  const blocks = useFetch("blocks");
  const [av, setAv] = useState<any>(null);
  const [nb, setNb] = useState({ date: "", time: "", note: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data?.settings?.availability) setAv(data.settings.availability);
  }, [data]);

  async function saveAv() {
    setBusy(true); setMsg("");
    try {
      await api("settings/save", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ availability: av }) });
      load();
      setMsg("Availability saved ✓");
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  }

  async function addBlock() {
    if (!nb.date) return;
    setBusy(true);
    try {
      await api("blocks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nb) });
      setNb({ date: "", time: "", note: "" });
      blocks.load();
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  }
  async function delBlock(id: number) {
    await api(`blocks/${id}`, { method: "DELETE" });
    blocks.load();
  }

  if (!av) return <p className="text-sm text-mut">Loading…</p>;
  const slotTimes: string[] = [];
  for (let h = av.start; h < av.end; h++) slotTimes.push(`${String(h).padStart(2, "0")}:00`);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Working hours">
        <p className="lbl">Available days</p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d, i) => (
            <button
              key={d}
              onClick={() => setAv({ ...av, days: av.days.includes(i) ? av.days.filter((x: number) => x !== i) : [...av.days, i] })}
              className={`rounded-lg border px-4 py-2 text-sm font-medium ${av.days.includes(i) ? "border-lime bg-lime text-ink" : "border-line text-bone/50"}`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div>
            <span className="lbl">From</span>
            <select className="field" value={av.start} onChange={(e) => setAv({ ...av, start: Number(e.target.value) })}>
              {HOURS.map((h) => <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>)}
            </select>
          </div>
          <div>
            <span className="lbl">To</span>
            <select className="field" value={av.end} onChange={(e) => setAv({ ...av, end: Number(e.target.value) })}>
              {HOURS.filter((h) => h > av.start).map((h) => <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>)}
            </select>
          </div>
          <div>
            <span className="lbl">Slot length</span>
            <select className="field" value={av.slot} onChange={(e) => setAv({ ...av, slot: Number(e.target.value) })}>
              <option value={60}>60 min</option>
              <option value={30}>30 min</option>
            </select>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-ink px-4 py-3 text-xs text-mut">
          Bookable slots: {slotTimes.length ? slotTimes.join(", ") : "none"} (UTC). Visitors see exactly these options.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={saveAv} disabled={busy} className="btn-primary !py-2.5 text-sm">Save availability</button>
          {msg && <span className="text-xs text-lime">{msg}</span>}
        </div>
      </Card>

      <Card title="Blocked dates & slots">
        <p className="mb-3 text-xs text-mut">Block a full day (vacation) or a single time slot. Blocked slots are hidden from visitors.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><span className="lbl">Date</span><input type="date" className="field" value={nb.date} onChange={(e) => setNb({ ...nb, date: e.target.value })} /></div>
          <div><span className="lbl">Time (empty = full day)</span>
            <select className="field" value={nb.time} onChange={(e) => setNb({ ...nb, time: e.target.value })}>
              <option value="">Full day</option>
              {slotTimes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><span className="lbl">Note</span><input className="field" value={nb.note} onChange={(e) => setNb({ ...nb, note: e.target.value })} placeholder="Vacation, sick day…" /></div>
          <div className="flex items-end"><button onClick={addBlock} disabled={busy || !nb.date} className="btn-primary w-full !py-2.5 text-sm disabled:opacity-40">Block</button></div>
        </div>
        <div className="mt-5 space-y-2">
          {(blocks.data?.items ?? []).length === 0 && <p className="py-4 text-center text-sm text-mut">Nothing blocked.</p>}
          {(blocks.data?.items ?? []).map((bl: any) => (
            <div key={bl.id} className="flex items-center justify-between rounded-xl border border-line bg-ink px-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{bl.date} {bl.time ? `at ${bl.time}` : <span className="text-lime">· full day</span>}</p>
                {bl.note && <p className="text-xs text-mut">{bl.note}</p>}
              </div>
              <button onClick={() => delBlock(bl.id)} className="text-xs text-red-300 hover:underline">Remove</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ================= CV ================= */

type CVData = any;

export function CVSection() {
  const { data, load } = useFetch("settings");
  const [cv, setCv] = useState<CVData | null>(null);
  const [cvLang, setCvLang] = useState<"en" | "ar">("en");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const cvKey = cvLang === "ar" ? "cv_ar" : "cv";

  useEffect(() => {
    if (data?.settings && cv) setCv(data.settings[cvKey] ?? data.settings.cv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, cvLang]);

  useEffect(() => {
    if (data?.settings && !cv) setCv(data.settings[cvKey] ?? data.settings.cv ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!cv) return <p className="text-sm text-mut">Loading…</p>;

  const up = (patch: any) => setCv({ ...cv, ...patch });

  async function save() {
    setBusy(true); setMsg("");
    try {
      await api("settings/save", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [cvKey]: cv }) });
      load();
      setMsg("CV saved ✓");
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  }

  const Row = ({ list, item, i, fields, cvKey }: { list: any[]; item: any; i: number; fields: string[]; cvKey: string }) => (
    <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-ink p-3">
      {fields.map((f) => (
        <input
          key={f}
          className="field flex-1 !py-2 text-xs"
          placeholder={f}
          value={item[f] ?? ""}
          onChange={(e) => {
            const next = list.map((x, xi) => (xi === i ? { ...x, [f]: e.target.value } : x));
            up({ [cvKey]: next });
          }}
        />
      ))}
      <button
        onClick={() => up({ [cvKey]: list.filter((_, xi) => xi !== i) })}
        className="px-2 text-red-300 hover:underline"
      >
        ✕
      </button>
    </div>
  );

  const addRow = (key: string, item: any) => up({ [key]: [...(cv[key] ?? []), item] });

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-full border border-line p-1 w-fit">
        {[["en", "English CV"], ["ar", "العربية"]].map(([v, l]) => (
          <button key={v} onClick={() => setCvLang(v as "en" | "ar")} className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-colors ${cvLang === v ? "bg-lime text-ink" : "text-bone/60 hover:text-bone"}`}>{l}</button>
        ))}
      </div>
      <Card title={cvLang === "ar" ? "السيرة الذاتية — عربي" : "Professional CV"}>
        <div className="space-y-5">
          <div><span className="lbl">Professional summary</span><textarea rows={3} className="field" value={cv.summary} onChange={(e) => up({ summary: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><span className="lbl">Skills (comma separated)</span><input className="field" value={(cv.skills ?? []).join(", ")} onChange={(e) => up({ skills: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} /></div>
            <div><span className="lbl">Software (comma separated)</span><input className="field" value={(cv.software ?? []).join(", ")} onChange={(e) => up({ software: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} /></div>
          </div>
          <div><span className="lbl">CV PDF URL (optional — enables direct download; empty = print-to-PDF)</span><input className="field" value={cv.pdfUrl} onChange={(e) => up({ pdfUrl: e.target.value })} placeholder="https://…/cv.pdf" /></div>

          <SectionRows title="Experience" cvKey="experience" items={cv.experience ?? []} fields={["role", "company", "period", "desc"]} onAdd={() => addRow("experience", { role: "", company: "", period: "", desc: "" })} Row={Row} />
          <SectionRows title="Freelance experience" cvKey="freelance" items={cv.freelance ?? []} fields={["role", "company", "period", "desc"]} onAdd={() => addRow("freelance", { role: "", company: "", period: "", desc: "" })} Row={Row} />
          <SectionRows title="Education" cvKey="education" items={cv.education ?? []} fields={["title", "place", "period"]} onAdd={() => addRow("education", { title: "", place: "", period: "" })} Row={Row} />
          <SectionRows title="Certifications" cvKey="certifications" items={cv.certifications ?? []} fields={["title", "place", "period"]} onAdd={() => addRow("certifications", { title: "", place: "", period: "" })} Row={Row} />
          <SectionRows title="Languages" cvKey="languages" items={cv.languages ?? []} fields={["name", "level"]} onAdd={() => addRow("languages", { name: "", level: "" })} Row={Row} />
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="btn-primary">Save CV</button>
        {msg && <span className="text-sm text-lime">{msg}</span>}
      </div>
    </div>
  );
}

function SectionRows({ title, items, fields, onAdd, Row, cvKey }: any) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="lbl !mb-0">{title}</span>
        <button onClick={onAdd} className="text-xs text-lime hover:underline">+ Add row</button>
      </div>
      <div className="space-y-2">
        {items.map((it: any, i: number) => (
          <Row key={i} list={items} item={it} i={i} fields={fields} cvKey={cvKey} />
        ))}
        {items.length === 0 && <p className="text-xs text-mut">Nothing here yet.</p>}
      </div>
    </div>
  );
}

/* ================= MESSAGES ================= */

export function MessagesSection() {
  const { data, load } = useFetch("messages");
  const [open, setOpen] = useState<number | null>(null);

  async function toggleRead(m: any) {
    await api(`messages/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: !m.read }) });
    load();
  }
  async function del(id: number) {
    if (!confirm("Delete this message?")) return;
    await api(`messages/${id}`, { method: "DELETE" });
    load();
  }

  const ms = data?.items ?? [];
  return (
    <Card title={`Contact messages (${ms.length})`}>
      {ms.length === 0 ? <p className="py-10 text-center text-sm text-mut">No messages yet.</p> : (
        <div className="space-y-2">
          {ms.map((m: any) => (
            <div key={m.id} className={`rounded-xl border ${m.read ? "border-line bg-ink" : "border-lime/30 bg-lime/5"}`}>
              <button onClick={() => setOpen(open === m.id ? null : m.id)} className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left">
                <div>
                  <p className="text-sm font-semibold">{m.name} <span className="font-normal text-mut">&lt;{m.email}&gt;</span></p>
                  <p className="text-xs text-mut">{m.subject || "(no subject)"} · {m.createdAt?.slice(0, 16).replace("T", " ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  {!m.read && <span className="size-2 rounded-full bg-lime" />}
                  <span className={`text-xs ${m.read ? "text-mut" : "text-lime"}`}>{m.read ? "Mark unread" : "Mark read"}</span>
                </div>
              </button>
              {open === m.id && (
                <div className="border-t border-line px-4 py-4">
                  <p className="whitespace-pre-line text-sm text-bone/80">{m.body}</p>
                  <div className="mt-4 flex gap-3">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent(m.subject || "Re: your message")}`} className="btn-ghost !py-2 text-xs">Reply by email</a>
                    <button onClick={() => del(m.id)} className="text-xs text-red-300 hover:underline">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ================= SETTINGS ================= */

export function SettingsSection() {
  const { data, load } = useFetch("settings");
  const [socials, setSocials] = useState<any>(null);
  const [site, setSite] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      setSocials(data.settings.socials ?? {});
      setSite(data.settings.site ?? {});
    }
  }, [data]);

  if (!socials || !site) return <p className="text-sm text-mut">Loading…</p>;

  async function save() {
    setBusy(true); setMsg("");
    try {
      await api("settings/save", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ socials, site }) });
      load();
      setMsg("Settings saved ✓");
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  }

  const F = ({ k, label, value, setV }: any) => (
    <div>
      <span className="lbl">{label}</span>
      <input className="field" value={value} onChange={(e) => setV(e.target.value)} />
    </div>
  );

  return (
    <div className="space-y-5">
      <Card title="Contact & social links">
        <div className="grid gap-4 sm:grid-cols-2">
          <F k="email" label="Email" value={socials.email} setV={(v: string) => setSocials({ ...socials, email: v })} />
          <F k="whatsapp" label="WhatsApp (display)" value={socials.whatsapp} setV={(v: string) => setSocials({ ...socials, whatsapp: v })} />
          <F k="whatsappNumber" label="WhatsApp number (digits for wa.me)" value={socials.whatsappNumber} setV={(v: string) => setSocials({ ...socials, whatsappNumber: v })} />
          <div />
          <F k="linkedin" label="LinkedIn URL" value={socials.linkedin} setV={(v: string) => setSocials({ ...socials, linkedin: v })} />
          <F k="behance" label="Behance URL" value={socials.behance} setV={(v: string) => setSocials({ ...socials, behance: v })} />
          <F k="instagram" label="Instagram URL" value={socials.instagram} setV={(v: string) => setSocials({ ...socials, instagram: v })} />
          <F k="tiktok" label="TikTok URL" value={socials.tiktok} setV={(v: string) => setSocials({ ...socials, tiktok: v })} />
          <F k="youtube" label="YouTube URL" value={socials.youtube} setV={(v: string) => setSocials({ ...socials, youtube: v })} />
        </div>
      </Card>
      <Card title="Site">
        <div className="grid gap-4 sm:grid-cols-2">
          <F k="availabilityNote" label="Hero availability note" value={site.availabilityNote} setV={(v: string) => setSite({ ...site, availabilityNote: v })} />
          <F k="location" label="Location" value={site.location} setV={(v: string) => setSite({ ...site, location: v })} />
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="btn-primary">Save settings</button>
        {msg && <span className="text-sm text-lime">{msg}</span>}
      </div>
      <p className="text-xs text-mut">
        Tip: email notifications activate automatically when RESEND_API_KEY + ADMIN_EMAIL are set in the environment; WhatsApp via WHATSAPP_WEBHOOK_URL.
      </p>
    </div>
  );
}
