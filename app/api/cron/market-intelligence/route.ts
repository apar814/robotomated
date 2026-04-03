import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

function verifyCron(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const results: Record<string, unknown> = {};

  // 1. Robot count by category
  const { data: robots } = await supabase
    .from("robots")
    .select("category_id, status, created_at, robot_categories(slug, name)")
    .eq("status", "active");

  if (robots) {
    const catCounts: Record<string, number> = {};
    let newThisMonth = 0;
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    for (const r of robots) {
      const catName = (r.robot_categories as { name: string } | null)?.name || "unknown";
      catCounts[catName] = (catCounts[catName] || 0) + 1;
      if (new Date(r.created_at) > monthAgo) newThisMonth++;
    }

    results.totalRobots = robots.length;
    results.categoryBreakdown = catCounts;
    results.newRobotsLast30Days = newThisMonth;
  }

  // 2. Price trends by category
  const { data: priced } = await supabase
    .from("robots")
    .select("category_id, price_msrp, robot_categories(name)")
    .not("price_msrp", "is", null);

  if (priced) {
    const priceTrends: Record<string, { count: number; avgPrice: number; total: number }> = {};
    for (const r of priced) {
      const catName = (r.robot_categories as { name: string } | null)?.name || "unknown";
      if (!priceTrends[catName]) priceTrends[catName] = { count: 0, avgPrice: 0, total: 0 };
      priceTrends[catName].count++;
      priceTrends[catName].total += r.price_msrp || 0;
    }
    for (const cat of Object.values(priceTrends)) {
      cat.avgPrice = Math.round(cat.total / cat.count);
    }
    results.priceTrends = priceTrends;
  }

  // 3. Manufacturer activity
  const { data: mfrs } = await supabase
    .from("robots")
    .select("manufacturer_id, manufacturers(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (mfrs) {
    const mfrCounts: Record<string, number> = {};
    for (const r of mfrs) {
      const name = (r.manufacturers as { name: string } | null)?.name || "Unknown";
      mfrCounts[name] = (mfrCounts[name] || 0) + 1;
    }
    results.topManufacturers = Object.entries(mfrCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count]) => ({ name, count }));
  }

  // 4. Store snapshot for trending
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("market_snapshots").insert({
      snapshot_date: new Date().toISOString().slice(0, 10),
      data: results,
    });
  } catch {
    // market_snapshots table may not exist — non-critical
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    ...results,
  });
}
