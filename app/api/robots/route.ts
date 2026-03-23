import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface RobotResult {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  status: string;
  category_id: string;
  manufacturer_id: string;
  year_released: number | null;
  robot_categories: { slug: string } | null;
  manufacturers: { name: string } | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const manufacturer = searchParams.get("manufacturer") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const scoreMin = searchParams.get("scoreMin") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "score_desc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 12;

  const supabase = createServerClient();

  let query = supabase
    .from("robots")
    .select("id, slug, name, robo_score, price_current, description_short, status, category_id, manufacturer_id, year_released, robot_categories(slug), manufacturers(name)", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,description_short.ilike.%${search}%,model_number.ilike.%${search}%`);
  }
  if (category) {
    // category param is a slug — need to look up by joining
    query = query.eq("robot_categories.slug", category);
  }
  if (manufacturer) {
    query = query.eq("manufacturer_id", manufacturer);
  }
  if (priceMin) {
    query = query.gte("price_current", parseFloat(priceMin));
  }
  if (priceMax) {
    query = query.lte("price_current", parseFloat(priceMax));
  }
  if (scoreMin) {
    query = query.gte("robo_score", parseFloat(scoreMin));
  }
  if (status) {
    query = query.eq("status", status as "active" | "discontinued" | "coming_soon");
  }

  // Sorting
  switch (sort) {
    case "score_desc":
      query = query.order("robo_score", { ascending: false, nullsFirst: false });
      break;
    case "newest":
      query = query.order("year_released", { ascending: false, nullsFirst: false });
      break;
    case "price_asc":
      query = query.order("price_current", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price_current", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order("robo_score", { ascending: false, nullsFirst: false });
  }

  // Pagination
  const from = (page - 1) * perPage;
  query = query.range(from, from + perPage - 1);

  const { data, count, error } = await query.returns<RobotResult[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // When filtering by category slug via the join, Supabase inner-filters
  // the join but still returns all robots. Filter out robots where
  // the join returned null (category didn't match).
  let filtered = data || [];
  if (category) {
    filtered = filtered.filter((r) => r.robot_categories !== null);
  }

  const robots = filtered.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    robo_score: r.robo_score,
    price_current: r.price_current,
    description_short: r.description_short,
    status: r.status,
    category_slug: (r.robot_categories as { slug: string } | null)?.slug || "",
    manufacturer_name: (r.manufacturers as { name: string } | null)?.name || "",
  }));

  return NextResponse.json({
    robots,
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  });
}
