"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CompanyLogo } from "@/components/ui/company-logo";

interface Mfr { id: string; slug: string; name: string; logo_url: string | null; website: string | null }

export default function AdminManufacturersPage() {
  const [mfrs, setMfrs] = useState<Mfr[]>([]);
  useEffect(() => {
    fetch("/api/admin/meta?type=manufacturers-full").then(r => r.json()).then(d => setMfrs(d.data || []));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold">Manage Manufacturer Logos</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mfrs.map(m => (
          <Link key={m.id} href={`/admin/manufacturers/${m.slug}`} className="glass-card flex items-center gap-3 p-4">
            <CompanyLogo logoUrl={m.logo_url} name={m.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{m.name}</p>
              <p className="text-[10px] text-white/30">{m.logo_url ? "Logo set" : "No logo — using initials"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
