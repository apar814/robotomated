"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Button } from "@/components/ui/button";

export default function AdminManufacturerLogoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [mfr, setMfr] = useState<{ id: string; name: string; logo_url: string | null } | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/manufacturer-logo?slug=${slug}`).then(r => r.json()).then(d => {
      if (d.data) { setMfr(d.data); setLogoUrl(d.data.logo_url || ""); }
    });
  }, [slug]);

  async function save() {
    if (!mfr) return;
    setSaving(true);
    const res = await fetch("/api/admin/manufacturer-logo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: mfr.id, logo_url: logoUrl.trim() || null }),
    });
    setMsg(res.ok ? "Saved!" : "Error");
    setSaving(false);
    if (res.ok && mfr) setMfr({ ...mfr, logo_url: logoUrl.trim() || null });
  }

  if (!mfr) return <div className="py-20 text-center text-white/50">Loading...</div>;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link href="/admin/manufacturers" className="text-sm text-white/50 hover:text-white">&larr; All Manufacturers</Link>
      <h1 className="mt-4 font-display text-2xl font-bold">{mfr.name} Logo</h1>

      <div className="mt-6 flex gap-6">
        <div className="glass-card flex items-center justify-center p-6" style={{ background: "#0A0F1E" }}>
          <CompanyLogo logoUrl={logoUrl || null} name={mfr.name} height={64} />
        </div>
        <div className="glass-card flex items-center justify-center p-6" style={{ background: "#F5F5F5" }}>
          <CompanyLogo logoUrl={logoUrl || null} name={mfr.name} height={64} />
        </div>
      </div>
      <p className="mt-2 text-[13px] text-white/45">Preview on dark and light backgrounds</p>

      <div className="mt-6">
        <label className="mb-1 block text-xs text-white/40">Logo URL</label>
        <input type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png"
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-white/50 focus:outline-none" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Logo"}</Button>
        {msg && <span className={`text-sm ${msg === "Saved!" ? "text-green" : "text-orange"}`}>{msg}</span>}
      </div>
    </div>
  );
}
