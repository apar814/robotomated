import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Analytics Dashboard | Robotomated Admin",
  robots: { index: false, follow: false },
};

interface RobotViewRow {
  slug: string;
  name: string;
  robo_score: number | null;
  manufacturers: { name: string } | null;
  robot_categories: { name: string } | null;
}

export default async function AnalyticsDashboard() {
  const supabase = createServerClient();

  // Top 10 robots (by score as proxy for views until PostHog API is connected)
  const { data: topRobots } = await supabase
    .from("robots")
    .select("slug, name, robo_score, manufacturers(name), robot_categories(name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(10)
    .returns<RobotViewRow[]>();

  // Newsletter stats
  const { count: totalSubscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true });

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { count: weekSubscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .gte("created_at", weekAgo);

  // Robot counts by category
  const { data: categories } = await supabase
    .from("robot_categories")
    .select("name, slug")
    .order("display_order");

  const { data: allRobots } = await supabase
    .from("robots")
    .select("category_id, status")
    .eq("status", "active");

  const { data: catIds } = await supabase
    .from("robot_categories")
    .select("id, name");

  const catCounts: Record<string, number> = {};
  if (catIds && allRobots) {
    const idToName = new Map(catIds.map(c => [c.id, c.name]));
    for (const r of allRobots) {
      const name = idToName.get(r.category_id) || "Other";
      catCounts[name] = (catCounts[name] || 0) + 1;
    }
  }

  // Total robots
  const { count: totalRobots } = await supabase
    .from("robots")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  // Total manufacturers
  const { count: totalMfrs } = await supabase
    .from("manufacturers")
    .select("id", { count: "exact", head: true });

  // Total articles (approximate from content count)
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true });

  // Referral stats (columns may not exist yet — handle gracefully)
  let topReferrers: { email: string; referral_code: string; referral_count: number }[] = [];
  try {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("email, referral_code, referral_count")
      .not("referral_count", "is", null)
      .gt("referral_count", 0)
      .order("referral_count", { ascending: false })
      .limit(5) as { data: { email: string; referral_code: string; referral_count: number }[] | null };
    topReferrers = data || [];
  } catch {
    // referral columns don't exist yet
  }

  return (
    <div style={{ background: "#080808", minHeight: "100vh", padding: "32px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid #222", paddingBottom: 24, marginBottom: 32 }}>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, fontFamily: "Arial, sans-serif", margin: 0 }}>
            Robotomated Analytics
          </h1>
          <p style={{ color: "#666", fontSize: 13, marginTop: 4, fontFamily: "Arial, sans-serif" }}>
            Internal dashboard. Connect PostHog API for real-time event data.
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Active Robots", value: totalRobots || 0 },
            { label: "Manufacturers", value: totalMfrs || 0 },
            { label: "Subscribers", value: totalSubscribers || 0 },
            { label: "New This Week", value: weekSubscribers || 0 },
          ].map((kpi) => (
            <div key={kpi.label} style={{ background: "#111", border: "1px solid #222", padding: "20px 16px", textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>{kpi.value}</div>
              <div style={{ color: "#666", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" as const, marginTop: 4, fontFamily: "Arial, sans-serif" }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Top Robots */}
          <div style={{ background: "#111", border: "1px solid #222", padding: 24 }}>
            <h2 style={{ color: "#888", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" as const, margin: "0 0 16px", fontFamily: "Arial, sans-serif" }}>
              Top 10 Robots by RoboScore
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <tbody>
                {(topRobots || []).map((r, i) => {
                  const mfr = (r.manufacturers as { name: string } | null)?.name || "";
                  return (
                    <tr key={r.slug} style={{ borderBottom: "1px solid #1E1E1E" }}>
                      <td style={{ color: "#555", fontSize: 12, padding: "8px 4px", fontFamily: "monospace" }}>#{i + 1}</td>
                      <td style={{ padding: "8px 4px" }}>
                        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "Arial, sans-serif" }}>{r.name}</div>
                        <div style={{ color: "#555", fontSize: 11, fontFamily: "Arial, sans-serif" }}>{mfr}</div>
                      </td>
                      <td style={{ color: "#0EA5E9", fontSize: 14, fontWeight: 700, textAlign: "right" as const, padding: "8px 4px", fontFamily: "monospace" }}>
                        {r.robo_score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Robots by Category */}
          <div style={{ background: "#111", border: "1px solid #222", padding: 24 }}>
            <h2 style={{ color: "#888", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" as const, margin: "0 0 16px", fontFamily: "Arial, sans-serif" }}>
              Robots by Category
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <tbody>
                {Object.entries(catCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <tr key={name} style={{ borderBottom: "1px solid #1E1E1E" }}>
                      <td style={{ color: "#ccc", fontSize: 13, padding: "8px 4px", fontFamily: "Arial, sans-serif" }}>{name}</td>
                      <td style={{ color: "#0EA5E9", fontSize: 14, fontWeight: 700, textAlign: "right" as const, padding: "8px 4px", fontFamily: "monospace" }}>
                        {count}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Newsletter & Referrals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          <div style={{ background: "#111", border: "1px solid #222", padding: 24 }}>
            <h2 style={{ color: "#888", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" as const, margin: "0 0 16px", fontFamily: "Arial, sans-serif" }}>
              Newsletter Growth
            </h2>
            <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.8, fontFamily: "Arial, sans-serif" }}>
              <div>Total subscribers: <strong style={{ color: "#fff" }}>{totalSubscribers || 0}</strong></div>
              <div>New this week: <strong style={{ color: "#0EA5E9" }}>{weekSubscribers || 0}</strong></div>
              <div>Reviews in DB: <strong style={{ color: "#fff" }}>{totalReviews || 0}</strong></div>
            </div>
          </div>

          <div style={{ background: "#111", border: "1px solid #222", padding: 24 }}>
            <h2 style={{ color: "#888", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" as const, margin: "0 0 16px", fontFamily: "Arial, sans-serif" }}>
              Top Referrers
            </h2>
            {topReferrers?.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <tbody>
                  {topReferrers.map((r) => (
                    <tr key={r.email} style={{ borderBottom: "1px solid #1E1E1E" }}>
                      <td style={{ color: "#ccc", fontSize: 12, padding: "8px 4px", fontFamily: "Arial, sans-serif" }}>{r.email}</td>
                      <td style={{ color: "#0EA5E9", fontSize: 14, fontWeight: 700, textAlign: "right" as const, padding: "8px 4px", fontFamily: "monospace" }}>
                        {r.referral_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: "#555", fontSize: 13, fontFamily: "Arial, sans-serif" }}>No referrals yet</div>
            )}
          </div>
        </div>

        {/* PostHog Integration Note */}
        <div style={{ background: "#0F1117", border: "1px solid #1E293B", padding: 20, marginTop: 24 }}>
          <p style={{ color: "#64748B", fontSize: 13, margin: 0, fontFamily: "Arial, sans-serif" }}>
            Real-time event tracking (robot_viewed, compare_started, tco_calculated, newsletter_signup, advisor_session, affiliate_click) is captured via PostHog.
            Connect the PostHog API to surface live event counts here. Dashboard at{" "}
            <Link href="https://us.posthog.com" style={{ color: "#0EA5E9", textDecoration: "none" }}>us.posthog.com</Link>.
          </p>
        </div>

        <div style={{ textAlign: "center" as const, marginTop: 32 }}>
          <Link href="/" style={{ color: "#555", fontSize: 12, textDecoration: "none", fontFamily: "Arial, sans-serif" }}>
            Back to Robotomated
          </Link>
        </div>
      </div>
    </div>
  );
}
