"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid-bg flex min-h-screen items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl border border-line bg-ink2 p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-lime font-display text-sm font-extrabold text-ink">WK</span>
          <div>
            <h1 className="font-display text-lg font-bold">Admin Dashboard</h1>
            <p className="text-xs text-mut">Wala Khalid — Motion Designer</p>
          </div>
        </div>
        <label className="lbl" htmlFor="adm-pw">Password</label>
        <input
          id="adm-pw"
          type="password"
          className="field"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pw && submit()}
          placeholder="••••••••"
          autoFocus
        />
        {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
        <button onClick={submit} disabled={!pw || busy} className="btn-primary mt-5 w-full justify-center" style={!pw || busy ? { opacity: 0.5 } : undefined}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
        <p className="mt-4 text-center text-xs text-mut">
          Default password: <code className="text-lime">wala-admin-2025</code> (change via ADMIN_PASSWORD env)
        </p>
      </motion.div>
    </div>
  );
}
