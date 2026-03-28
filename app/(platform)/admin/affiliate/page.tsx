import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Affiliate Analytics — Admin" };

export default async function AffiliateAnalyticsPage() {
  const supabase = createServerClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Get counts for different periods
  const [{ count: totalClicks }, { count: todayClicks }, { count: weekClicks }, { count: monthClicks }] = await Promise.all([
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }),
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
  ]);

  // Get recent clicks with robot data
  const { data: allClicks } = await supabase
    .from("affiliate_clicks")
    .select("robot_id, retailer, created_at, referrer, robots(name, slug)")
    .order("created_at", { ascending: false })
    .limit(1000)
    .returns<{ robot_id: string; retailer: string; created_at: string; referrer: string | null; robots: { name: string; slug: string } | null }[]>();

  const clicks = allClicks || [];

  // Aggregate by robot (top 10)
  const byRobot = new Map<string, { name: string; slug: string; count: number }>();
  for (const c of clicks) {
    const name = (c.robots as { name: string; slug: string } | null)?.name || "Unknown";
    const slug = (c.robots as { name: string; slug: string } | null)?.slug || "";
    const existing = byRobot.get(name);
    if (existing) existing.count++;
    else byRobot.set(name, { name, slug, count: 1 });
  }
  const robotStats = Array.from(byRobot.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  // Aggregate by source/position
  const bySource = new Map<string, number>();
  for (const c of clicks) {
    const parts = c.retailer.split(":");
    const pos = parts[1] || "direct";
    bySource.set(pos, (bySource.get(pos) || 0) + 1);
  }
  const sourceStats = Array.from(bySource.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // Aggregate by date (last 14 days)
  const byDate = new Map<string, number>();
  for (const c of clicks) {
    const date = new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    byDate.set(date, (byDate.get(date) || 0) + 1);
  }
  const dateStats = Array.from(byDate.entries())
    .map(([date, count]) => ({ date, count }))
    .slice(0, 14);

  // Top referrers
  const byReferrer = new Map<string, number>();
  for (const c of clicks) {
    if (!c.referrer) continue;
    try {
      const host = new URL(c.referrer).hostname;
      byReferrer.set(host, (byReferrer.get(host) || 0) + 1);
    } catch {}
  }
  const referrerStats = Array.from(byReferrer.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold">Affiliate Analytics</h1>

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Today", value: todayClicks || 0, color: "text-blue" },
          { label: "This Week", value: weekClicks || 0, color: "text-green" },
          { label: "This Month", value: monthClicks || 0, color: "text-violet" },
          { label: "All Time", value: totalClicks || 0, color: "text-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-navy-light p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{stat.label}</p>
            <p className={`mt-1 font-mono text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
            <p className="text-[10px] text-muted">clicks</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Top Robots */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Top 10 Robots by Clicks</h2>
          {robotStats.length === 0 ? (
            <p className="text-sm text-muted">No clicks yet</p>
          ) : (
            <div className="space-y-3">
              {robotStats.map((r, i) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="w-5 text-right text-xs text-muted">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{r.name}</span>
                      <span className="font-mono text-sm font-bold">{r.count}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(r.count / (robotStats[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily trend */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Daily Clicks (Last 14 Days)</h2>
          {dateStats.length === 0 ? (
            <p className="text-sm text-muted">No clicks yet</p>
          ) : (
            <div className="space-y-2">
              {dateStats.map((d) => (
                <div key={d.date} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-muted">{d.date}</span>
                  <div className="flex-1">
                    <div className="h-4 rounded bg-white/[0.06]">
                      <div
                        className="h-full rounded bg-green"
                        style={{ width: `${(d.count / Math.max(...dateStats.map(x => x.count), 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right font-mono text-xs font-bold">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Click sources */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Click Sources (Page Position)</h2>
          {sourceStats.length === 0 ? (
            <p className="text-sm text-muted">No clicks yet</p>
          ) : (
            <div className="space-y-2">
              {sourceStats.map((s) => (
                <div key={s.source} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{s.source}</span>
                  <span className="font-mono font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top referrers */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Top Referrers</h2>
          {referrerStats.length === 0 ? (
            <p className="text-sm text-muted">No referrer data yet</p>
          ) : (
            <div className="space-y-2">
              {referrerStats.map((r) => (
                <div key={r.referrer} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{r.referrer}</span>
                  <span className="font-mono font-semibold">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
