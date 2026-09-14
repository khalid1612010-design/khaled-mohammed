"use client";

import { useEffect, useState } from "react";
import { STRINGS, clientLang } from "@/i18n/strings";

type Slot = { time: string; free: boolean };

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}

export default function SlotPicker({
  value,
  onChange,
}: {
  value: { date: string; time: string };
  onChange: (v: { date: string; time: string }) => void;
}) {
  const [ar, setAr] = useState(false);
  const [dates, setDates] = useState<{ d: string; label: string; day: string; open: boolean }[]>([]);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [meta, setMeta] = useState<{ days: number[]; start: number; end: number } | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const s = ar ? STRINGS.ar.slot : STRINGS.en.slot;
  const WD = ar ? ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    setAr(clientLang() === "ar");
  }, []);

  useEffect(() => {
    const out: { d: string; label: string; day: string; open: boolean }[] = [];
    const today = new Date();
    for (let i = 1; i <= 42; i++) {
      const dt = new Date(today.getTime() + i * 86400000);
      const wd = dt.getUTCDay();
      const open = meta ? meta.days.includes(wd) : true;
      out.push({
        d: dt.toISOString().slice(0, 10),
        label: `${dt.getUTCDate()}`,
        day: WD[wd],
        open,
      });
    }
    setDates(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, ar]);

  useEffect(() => {
    fetch("/api/availability").then((r) => r.json()).then((d) => {
      if (d.meta) setMeta({ days: d.meta.days, start: d.meta.start, end: d.meta.end });
    });
  }, []);

  useEffect(() => {
    if (!value.date) {
      setSlots(null);
      return;
    }
    setLoadingSlots(true);
    fetch(`/api/availability?date=${value.date}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots))
      .finally(() => setLoadingSlots(false));
  }, [value.date]);

  return (
    <div>
      <p className="lbl">{s.date}</p>
      <div className="grid max-h-56 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-7">
        {dates.map((x) => {
          const active = value.date === x.d;
          return (
            <button
              key={x.d}
              type="button"
              disabled={!x.open}
              onClick={() => onChange({ date: x.d, time: "" })}
              className={`flex flex-col items-center rounded-xl border py-2.5 transition-all duration-150 ${
                active
                  ? "border-lime bg-lime text-ink"
                  : x.open
                    ? "border-line text-bone hover:border-lime/60"
                    : "cursor-not-allowed border-transparent text-bone/20"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-70">{x.day}</span>
              <span className="font-display text-lg font-bold leading-tight" dir="ltr">{x.d.slice(5)}</span>
            </button>
          );
        })}
      </div>

      <p className="lbl mt-6">
        {s.time} {value.date && <span className="normal-case text-mut" dir="ltr">— {value.date} (UTC)</span>}
      </p>
      {!value.date ? (
        <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-mut">{s.selectFirst}</div>
      ) : loadingSlots ? (
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-20 animate-pulse rounded-lg bg-ink3" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(slots ?? []).map((sl) => (
            <button
              key={sl.time}
              type="button"
              disabled={!sl.free}
              onClick={() => onChange({ ...value, time: sl.time })}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                value.time === sl.time
                  ? "border-lime bg-lime font-semibold text-ink"
                  : sl.free
                    ? "border-line text-bone hover:border-lime/60"
                    : "cursor-not-allowed border-transparent text-bone/20 line-through"
              }`}
            >
              <span dir="ltr">{fmtTime(sl.time)}</span>
            </button>
          ))}
          {slots && slots.length > 0 && slots.every((sl) => !sl.free) && (
            <p className="text-sm text-mut">{s.none}</p>
          )}
        </div>
      )}
      <p className="mt-3 text-xs text-mut">{s.utc}</p>
    </div>
  );
}
