import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Affiliate Analytics — Admin" };

interface ClickByRobot { robot_name: string; click_count: number }
interface ClickByRetailer { retailer: string; click_count: number }
interface ClickByDate { date: string; click_count: number }

export default async function AffiliateAnalyticsPage() {
  const supabase = createServerClient();

  // Get total clicks
  const { count: totalClicks } = await supabase
    .from("affiliate_clicks")
    .select("id", { count: "exact", head: true });

  // Get clicks by robot — using raw query via RPC or manual aggregation
  const { data: allClicks } = await supabase
    .from("affiliate_clicks")
    .select("robot_id, retailer, created_at, robots(name)")
    .order("created_at", { ascending: false })
    .limit(500)
    .returns<{ robot_id: string; retailer: string; created_at: string; robots: { name: string } | null }[]>();

  const clicks = allClicks || [];

  // Aggregate by robot
  const byRobot = new Map<string, { name: string; count: number }>();
  for (const c of clicks) {
    const name = (c.robots as { name: string } | null)?.name || "Unknown";
    const existing = byRobot.get(name);
    if (existing) existing.count++;
    else byRobot.set(name, { name, count: 1 });
  }
  const robotStats = Array.from(byRobot.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  // Aggregate by retailer
  const byRetailer = new Map<string, number>();
  for (const c of clicks) {
    byRetailer.set(c.retailer, (byRetailer.get(c.retailer) || 0) + 1);
  }
  const retailerStats = Array.from(byRetailer.entries())
    .map(([retailer, count]) => ({ retailer, count }))
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold">Affiliate Analytics</h1>
      <p className="mt-2 text-sm text-muted">
        Total affiliate clicks: <span className="font-mono font-semibold text-foreground">{totalClicks || 0}</span>
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* By Robot */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Top Robots</h2>
          {robotStats.length === 0 ? (
            <p className="text-sm text-muted">No clicks yet</p>
          ) : (
            <div className="space-y-2">
              {robotStats.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <span className="truncate text-muted">{r.name}</span>
                  <span className="font-mono font-semibold">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Retailer */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">By Retailer</h2>
          {retailerStats.length === 0 ? (
            <p className="text-sm text-muted">No clicks yet</p>
          ) : (
            <div className="space-y-2">
              {retailerStats.map((r) => (
                <div key={r.retailer} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{r.retailer}</span>
                  <span className="font-mono font-semibold">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Date */}
        <div className="rounded-xl border border-border bg-navy-light p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Recent Days</h2>
          {dateStats.length === 0 ? (
            <p className="text-sm text-muted">No clicks yet</p>
          ) : (
            <div className="space-y-2">
              {dateStats.map((d) => (
                <div key={d.date} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{d.date}</span>
                  <span className="font-mono font-semibold">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
