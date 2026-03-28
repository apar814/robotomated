import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface RobotRow {
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  robot_categories: { slug: string } | null;
}

// Map budget labels to price ranges
const BUDGET_RANGES: Record<string, [number | null, number | null]> = {
  "under5k": [0, 5000],
  "5k-25k": [5000, 25000],
  "25k-100k": [25000, 100000],
  "100k-500k": [100000, 500000],
  "500k-plus": [500000, null],
  "raas": [0, null], // Show all — RaaS is a pricing model, not a price range
};

// Map industry to category slugs
const INDUSTRY_TO_CATEGORY: Record<string, string[]> = {
  warehouse: ["warehouse"],
  manufacturing: ["manufacturing"],
  construction: ["construction"],
  medical: ["medical"],
  agricultural: ["agricultural"],
  consumer: ["consumer"],
  delivery: ["delivery"],
  drone: ["drone"],
};

export async function POST(request: NextRequest) {
  const { industry, budget, easeOfUse } = await request.json();

  const supabase = createServerClient();

  // Build query
  let query = supabase
    .from("robots")
    .select("slug, name, robo_score, price_current, description_short, robot_categories(slug)")
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false });

  // Filter by category
  if (industry && INDUSTRY_TO_CATEGORY[industry]) {
    const { data: cats } = await supabase
      .from("robot_categories")
      .select("id")
      .in("slug", INDUSTRY_TO_CATEGORY[industry]);
    if (cats?.length) {
      query = query.in("category_id", cats.map(c => c.id));
    }
  }

  const { data: robots } = await query.limit(50).returns<RobotRow[]>();
  if (!robots?.length) {
    return NextResponse.json({ recommendations: [] });
  }

  // Filter by budget
  const [minPrice, maxPrice] = BUDGET_RANGES[budget] || [0, null];
  let filtered = robots;
  if (budget && budget !== "raas") {
    filtered = robots.filter(r => {
      if (r.price_current == null) return true; // Include contact-for-pricing
      if (minPrice != null && r.price_current < minPrice) return false;
      if (maxPrice != null && r.price_current > maxPrice) return false;
      return true;
    });
  }

  // If ease of use is critical, boost robots with higher score
  if (easeOfUse === "critical" || easeOfUse === "important") {
    filtered.sort((a, b) => {
      const aScore = a.robo_score || 0;
      const bScore = b.robo_score || 0;
      return bScore - aScore;
    });
  }

  // Take top 3
  const top3 = filtered.slice(0, 3).map((r, i) => {
    const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "all";
    const reasons = [
      i === 0 ? "Highest RoboScore match for your criteria" :
      i === 1 ? "Strong alternative with different strengths" :
      "Budget-friendly option worth considering",
    ];
    return {
      slug: r.slug,
      name: r.name,
      category: catSlug,
      score: r.robo_score,
      price: r.price_current,
      description: r.description_short,
      reason: reasons[0],
    };
  });

  return NextResponse.json({ recommendations: top3 });
}
