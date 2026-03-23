import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 20;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const supabase = createServerClient();

  let query = supabase
    .from("robots")
    .select("id, slug, name, robo_score, price_current, status, manufacturer_id, category_id, updated_at, manufacturers(name), robot_categories(name)", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  }
  if (status) {
    query = query.eq("status", status as "active" | "discontinued" | "coming_soon");
  }

  query = query.order("updated_at", { ascending: false });

  const from = (page - 1) * perPage;
  query = query.range(from, from + perPage - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    robots: (data || []).map((r: Record<string, unknown>) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      robo_score: r.robo_score,
      price_current: r.price_current,
      status: r.status,
      manufacturer_name: (r.manufacturers as { name: string } | null)?.name || "",
      category_name: (r.robot_categories as { name: string } | null)?.name || "",
      updated_at: r.updated_at,
    })),
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const supabase = createServerClient();

  // Generate slug from name if not provided
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const { data: robot, error } = await supabase
    .from("robots")
    .insert(data)
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ robot });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase.from("robots").update(data).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// Bulk import
export async function PATCH(request: NextRequest) {
  const { robots } = await request.json();
  if (!Array.isArray(robots) || robots.length === 0) {
    return NextResponse.json({ error: "No robots to import" }, { status: 400 });
  }
  if (robots.length > 100) {
    return NextResponse.json({ error: "Maximum 100 robots per import" }, { status: 400 });
  }

  const supabase = createServerClient();
  const results: { success: number; errors: string[] } = { success: 0, errors: [] };

  for (let i = 0; i < robots.length; i++) {
    const r = robots[i];
    if (!r.slug) {
      r.slug = (r.name || `robot-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const { error } = await supabase.from("robots").insert(r);
    if (error) {
      results.errors.push(`Row ${i + 1} (${r.name || "unnamed"}): ${error.message}`);
    } else {
      results.success++;
    }
  }

  return NextResponse.json(results);
}
