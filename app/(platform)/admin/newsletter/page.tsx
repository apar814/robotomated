"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalSubscribers: number;
  activeSubscribers: number;
  recentSubscribers: { email: string; created_at: string; source: string | null }[];
  byDay: { day: string; count: number }[];
}

export default function AdminNewsletterPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/meta?type=newsletter")
      .then((r) => r.json())
      .then((d) => setStats(d.data || null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  async function sendTestDigest(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/cron/weekly-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, testEmail }),
      });
      const data = await res.json();
      setSendResult(data.ok ? "Test email sent!" : data.error || "Failed");
    } catch {
      setSendResult("Failed to send");
    }
    setSending(false);
  }

  if (loading) return <div className="py-20 text-center text-white/40">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Newsletter Management</h1>
        <Link href="/admin" className="text-xs text-white/40 hover:text-white/60">Back to Dashboard</Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[13px] uppercase tracking-wider text-white/40">Total Subscribers</p>
          <p className="mt-1 text-2xl font-bold">{stats?.totalSubscribers || 0}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[13px] uppercase tracking-wider text-white/40">Active</p>
          <p className="mt-1 text-2xl font-bold text-[#00E5A0]">{stats?.activeSubscribers || 0}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[13px] uppercase tracking-wider text-white/40">New This Week</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {stats?.byDay?.reduce((s, d) => s + d.count, 0) || 0}
          </p>
        </div>
      </div>

      {/* Test email */}
      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold">Send Test Digest</h2>
        <form onSubmit={sendTestDigest} className="mt-3 flex gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            required
            className="flex-1 rounded border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/45"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded bg-white/10 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Test"}
          </button>
        </form>
        {sendResult && <p className="mt-2 text-xs text-white/60">{sendResult}</p>}
      </div>

      {/* Recent subscribers */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Recent Subscribers</h2>
        <div className="space-y-1">
          {(stats?.recentSubscribers || []).map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2">
              <span className="text-sm">{s.email}</span>
              <span className="text-[13px] text-white/50">
                {s.source || "direct"} -- {new Date(s.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {(!stats?.recentSubscribers || stats.recentSubscribers.length === 0) && (
            <p className="py-6 text-center text-sm text-white/50">No subscribers yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
