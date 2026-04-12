"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CompanyLogo } from "@/components/ui/company-logo";

interface Mfr {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  partnership_status?: string | null;
  partnership_tier?: string | null;
  claimed_profile?: boolean;
  data_accuracy?: number | null;
}

interface Claim {
  id: string;
  manufacturer_id: string;
  contact_email: string;
  contact_name: string;
  job_title: string;
  status: string;
  created_at: string;
  manufacturers?: { name: string; slug: string } | null;
}

interface Partnership {
  id: string;
  manufacturer_id: string;
  contact_email: string;
  contact_name: string;
  tier_interest: string;
  message: string | null;
  status: string;
  created_at: string;
  manufacturers?: { name: string; slug: string } | null;
}

type Tab = "logos" | "claims" | "partnerships";

export default function AdminManufacturersPage() {
  const [tab, setTab] = useState<Tab>("claims");
  const [mfrs, setMfrs] = useState<Mfr[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/meta?type=manufacturers-full").then((r) => r.json()),
      fetch("/api/admin/manufacturers/claims").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/admin/manufacturers/partnerships").then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([mfrData, claimData, partnerData]) => {
      setMfrs(mfrData.data || []);
      setClaims(claimData.data || []);
      setPartnerships(partnerData.data || []);
      setLoading(false);
    });
  }, []);

  async function handleClaim(id: string, action: "approve" | "reject") {
    await fetch("/api/admin/manufacturers/claims", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setClaims((prev) => prev.filter((c) => c.id !== id));
  }

  async function handlePartnership(id: string, action: "approve" | "reject") {
    await fetch("/api/admin/manufacturers/partnerships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setPartnerships((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <div className="py-20 text-center text-white/40">Loading...</div>;

  const pendingClaims = claims.filter((c) => c.status === "pending");
  const pendingPartnerships = partnerships.filter((p) => p.status === "pending");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manufacturer Management</h1>
        <Link href="/admin" className="text-xs text-white/40 hover:text-white/60">Back to Dashboard</Link>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-white/10 pb-0">
        {(["claims", "partnerships", "logos"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "text-[#2563EB]" : "text-white/40 hover:text-white/60"
            }`}
          >
            {t}
            {t === "claims" && pendingClaims.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF006E] px-1 text-[13px] font-bold text-white">
                {pendingClaims.length}
              </span>
            )}
            {t === "partnerships" && pendingPartnerships.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#60A5FA] px-1 text-[13px] font-bold text-black">
                {pendingPartnerships.length}
              </span>
            )}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />}
          </button>
        ))}
      </div>

      {/* Claims tab */}
      {tab === "claims" && (
        <div className="mt-6 space-y-3">
          {pendingClaims.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/50">No pending claims</p>
          ) : (
            pendingClaims.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div>
                  <p className="text-sm font-medium">{c.manufacturers?.name || "Unknown"}</p>
                  <p className="text-xs text-white/40">
                    {c.contact_name} ({c.job_title}) -- {c.contact_email}
                  </p>
                  <p className="text-[13px] text-white/45">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleClaim(c.id, "approve")}
                    className="rounded bg-[#00E5A0]/10 px-3 py-1 text-xs font-medium text-[#00E5A0] hover:bg-[#00E5A0]/20"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleClaim(c.id, "reject")}
                    className="rounded bg-[#FF006E]/10 px-3 py-1 text-xs font-medium text-[#FF006E] hover:bg-[#FF006E]/20"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Partnerships tab */}
      {tab === "partnerships" && (
        <div className="mt-6 space-y-3">
          {pendingPartnerships.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/50">No pending partnership inquiries</p>
          ) : (
            pendingPartnerships.map((p) => (
              <div key={p.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.manufacturers?.name || "Unknown"}</p>
                    <p className="text-xs text-white/40">
                      {p.contact_name} -- {p.contact_email}
                    </p>
                    <p className="mt-1 text-xs">
                      Tier interest:{" "}
                      <span className="font-mono font-semibold text-[#60A5FA]">{p.tier_interest}</span>
                    </p>
                    {p.message && <p className="mt-1 text-xs text-white/50">{p.message}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePartnership(p.id, "approve")}
                      className="rounded bg-[#00E5A0]/10 px-3 py-1 text-xs font-medium text-[#00E5A0] hover:bg-[#00E5A0]/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handlePartnership(p.id, "reject")}
                      className="rounded bg-[#FF006E]/10 px-3 py-1 text-xs font-medium text-[#FF006E] hover:bg-[#FF006E]/20"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Logos tab */}
      {tab === "logos" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mfrs.map((m) => (
            <Link
              key={m.id}
              href={`/admin/manufacturers/${m.slug}`}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
            >
              <CompanyLogo logoUrl={m.logo_url} name={m.name} height={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="text-[13px] text-white/50">
                  {m.logo_url ? "Logo set" : "No logo"}
                  {m.claimed_profile && " | Claimed"}
                  {m.partnership_tier && ` | ${m.partnership_tier}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
