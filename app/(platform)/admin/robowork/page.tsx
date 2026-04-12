"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Job {
  id: string;
  slug: string;
  title: string;
  business_name: string;
  status: string;
  bid_count: number;
  created_at: string;
  task_type: string;
  industry: string;
}

interface Provider {
  id: string;
  slug: string;
  company_name: string;
  verified: boolean;
  rating: number;
  completed_jobs: number;
  created_at: string;
}

type Tab = "jobs" | "providers" | "stats";

export default function AdminRoboWorkPage() {
  const [tab, setTab] = useState<Tab>("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stats, setStats] = useState<{ activeJobs: number; totalProviders: number; verifiedProviders: number; totalBids: number }>({
    activeJobs: 0,
    totalProviders: 0,
    verifiedProviders: 0,
    totalBids: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/robowork/jobs?limit=50").then((r) => r.json()),
      fetch("/api/robowork/providers?limit=50").then((r) => r.json()),
      fetch("/api/robowork/stats").then((r) => r.json()),
    ]).then(([jobData, providerData, statsData]) => {
      setJobs(jobData.jobs || []);
      setProviders(providerData.providers || []);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-20 text-center text-white/40">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">RoboWork Management</h1>
        <Link href="/admin" className="text-xs text-white/40 hover:text-white/60">Back to Dashboard</Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Active Jobs</p>
          <p className="mt-1 text-2xl font-bold text-[#2563EB]">{stats.activeJobs}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Providers</p>
          <p className="mt-1 text-2xl font-bold">{stats.totalProviders}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Verified</p>
          <p className="mt-1 text-2xl font-bold text-[#60A5FA]">{stats.verifiedProviders}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Total Bids</p>
          <p className="mt-1 text-2xl font-bold">{stats.totalBids}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-white/10">
        {(["jobs", "providers"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? "text-[#2563EB]" : "text-white/40 hover:text-white/60"
            }`}
          >
            {t}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />}
          </button>
        ))}
      </div>

      {/* Jobs list */}
      {tab === "jobs" && (
        <div className="mt-4 space-y-2">
          {jobs.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/50">No jobs posted yet</p>
          ) : (
            jobs.map((j) => (
              <Link
                key={j.id}
                href={`/robowork/jobs/${j.slug}`}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div>
                  <p className="text-sm font-medium">{j.title}</p>
                  <p className="text-xs text-white/40">
                    {j.business_name} -- {j.task_type} -- {j.industry}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-white/40">{j.bid_count} bids</span>
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      j.status === "open"
                        ? "bg-[#00E5A0]/10 text-[#00E5A0]"
                        : j.status === "draft"
                          ? "bg-white/10 text-white/50"
                          : "bg-[#2563EB]/10 text-[#2563EB]"
                    }`}
                  >
                    {j.status}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Providers list */}
      {tab === "providers" && (
        <div className="mt-4 space-y-2">
          {providers.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/50">No providers registered yet</p>
          ) : (
            providers.map((p) => (
              <Link
                key={p.id}
                href={`/robowork/providers/${p.slug}`}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div>
                  <p className="text-sm font-medium">{p.company_name}</p>
                  <p className="text-xs text-white/40">
                    Rating: {p.rating}/5 -- {p.completed_jobs} completed jobs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {p.verified && (
                    <span className="rounded bg-[#60A5FA]/10 px-2 py-0.5 text-[10px] font-semibold text-[#60A5FA]">
                      Verified
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
