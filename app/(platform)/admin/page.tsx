"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminCharts } from "@/components/admin/admin-charts";
import { cn } from "@/lib/utils/cn";

interface DashboardData {
  overview: {
    totalRobots: number;
    activeRobots: number;
    discontinuedRobots: number;
    comingSoon: number;
    totalUsers: number;
    totalReviews: number;
    totalSubscribers: number;
    todayClicks: number;
    yesterdayClicks: number;
    estimatedMRR: number;
  };
  charts: {
    topRobotClicks: { name: string; count: number }[];
    subscribersByDay: { day: string; count: number }[];
    advisorByDay: { day: string; count: number }[];
  };
  moderation: {
    pendingReviews: number;
    pendingSubmissions: number;
    reviewsList: { id: string; title: string; robo_score: number | null; review_type: string; created_at: string; robots: { name: string } | null }[];
    submissionsList: { id: string; company_name: string; robot_name: string; created_at: string }[];
  };
  revenue: { id: string; month: string; source: string; amount: number; notes: string | null }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueForm, setRevenueForm] = useState({ month: "", source: "affiliate", amount: "", notes: "" });
  const [revenueStatus, setRevenueStatus] = useState<"idle" | "saving">("idle");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  async function moderateReview(id: string, action: "approve" | "reject") {
    await fetch("/api/admin/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    // Refresh
    const res = await fetch("/api/admin/dashboard");
    setData(await res.json());
  }

  async function addRevenue(e: React.FormEvent) {
    e.preventDefault();
    setRevenueStatus("saving");
    await fetch("/api/admin/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(revenueForm),
    });
    setRevenueForm({ month: "", source: "affiliate", amount: "", notes: "" });
    setRevenueStatus("idle");
    const res = await fetch("/api/admin/dashboard");
    setData(await res.json());
  }

  if (loading) return <div className="py-20 text-center text-muted">Loading dashboard...</div>;
  if (!data) return <div className="py-20 text-center text-muted">Failed to load dashboard</div>;

  const { overview: o, moderation: m } = data;
  const clickDelta = o.todayClicks - o.yesterdayClicks;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/robots/new" className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-navy hover:opacity-90">
            + Add Robot
          </Link>
          <Link href="/admin/robots/import" className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
            CSV Import
          </Link>
          <a href="/api/admin/export-emails" className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
            Export Emails
          </a>
        </div>
      </div>

      {/* Overview cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Robots" value={o.totalRobots} detail={`${o.activeRobots} active`} />
        <StatCard label="Users" value={o.totalUsers} />
        <StatCard label="Today's Clicks" value={o.todayClicks} delta={clickDelta} />
        <StatCard label="Est. MRR" value={`$${o.estimatedMRR.toLocaleString()}`} />
        <StatCard label="Reviews" value={o.totalReviews} detail={`${m.pendingReviews} pending`} />
        <StatCard label="Subscribers" value={o.totalSubscribers} />
        <StatCard label="Portal Submissions" value={m.pendingSubmissions} detail="pending" />
        <StatCard label="Coming Soon" value={o.comingSoon} />
      </div>

      {/* Charts */}
      <div className="mt-8">
        <AdminCharts
          topRobotClicks={data.charts.topRobotClicks}
          subscribersByDay={data.charts.subscribersByDay}
          advisorByDay={data.charts.advisorByDay}
        />
      </div>

      {/* Content Status */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Pending reviews */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Pending Reviews ({m.pendingReviews})
          </h2>
          {m.reviewsList.length === 0 ? (
            <p className="text-sm text-muted">No reviews pending</p>
          ) : (
            <div className="space-y-3">
              {m.reviewsList.map((rv) => (
                <div key={rv.id} className="flex items-center justify-between rounded-lg bg-navy-lighter p-3">
                  <div>
                    <p className="text-sm font-medium">{rv.title}</p>
                    <p className="text-xs text-muted">
                      {(rv.robots as { name: string } | null)?.name} &middot; {rv.review_type}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moderateReview(rv.id, "approve")}
                      className="rounded px-2 py-1 text-xs text-green hover:bg-green/10"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => moderateReview(rv.id, "reject")}
                      className="rounded px-2 py-1 text-xs text-orange hover:bg-orange/10"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portal submissions */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Portal Submissions ({m.pendingSubmissions})
          </h2>
          {m.submissionsList.length === 0 ? (
            <p className="text-sm text-muted">No submissions pending</p>
          ) : (
            <div className="space-y-3">
              {m.submissionsList.map((sub) => (
                <div key={sub.id} className="rounded-lg bg-navy-lighter p-3">
                  <p className="text-sm font-medium">{sub.robot_name}</p>
                  <p className="text-xs text-muted">
                    {sub.company_name} &middot; {new Date(sub.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue tracker */}
      <div className="mt-8 rounded-xl border border-border bg-navy-light p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Revenue Tracker</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Entry form */}
          <form onSubmit={addRevenue} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="month"
                value={revenueForm.month}
                onChange={(e) => setRevenueForm({ ...revenueForm, month: e.target.value })}
                required
                className="flex-1 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-blue focus:outline-none"
              />
              <select
                value={revenueForm.source}
                onChange={(e) => setRevenueForm({ ...revenueForm, source: e.target.value })}
                className="rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-blue focus:outline-none"
              >
                <option value="affiliate">Affiliate</option>
                <option value="stripe">Stripe Subscriptions</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Amount ($)"
                value={revenueForm.amount}
                onChange={(e) => setRevenueForm({ ...revenueForm, amount: e.target.value })}
                required
                className="flex-1 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-blue focus:outline-none"
              />
              <input
                type="text"
                placeholder="Notes"
                value={revenueForm.notes}
                onChange={(e) => setRevenueForm({ ...revenueForm, notes: e.target.value })}
                className="flex-1 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-blue focus:outline-none"
              />
            </div>
            <Button type="submit" disabled={revenueStatus === "saving"} className="text-xs">
              {revenueStatus === "saving" ? "Saving..." : "Log Revenue"}
            </Button>
          </form>

          {/* Recent entries */}
          <div>
            {data.revenue.length === 0 ? (
              <p className="text-sm text-muted">No revenue logged yet</p>
            ) : (
              <div className="space-y-2">
                {data.revenue.slice(0, 6).map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{r.month} — {r.source}</span>
                    <span className="font-mono font-semibold">${r.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav to sub-pages */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/admin/affiliate" className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
          Affiliate Analytics
        </Link>
        <Link href="/admin/reviews/new" className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
          New Expert Review
        </Link>
        <Link href="/admin/robots/new" className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
          Add Robot
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, detail, delta }: { label: string; value: string | number; detail?: string; delta?: number }) {
  return (
    <div className="rounded-xl border border-border bg-navy-light p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {detail && <span className="text-[10px] text-muted">{detail}</span>}
        {delta !== undefined && delta !== 0 && (
          <span className={cn("text-[10px] font-medium", delta > 0 ? "text-green" : "text-orange")}>
            {delta > 0 ? "+" : ""}{delta} vs yesterday
          </span>
        )}
      </div>
    </div>
  );
}
