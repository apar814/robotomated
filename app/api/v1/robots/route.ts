// Rate limiting: should be handled via Upstash Redis middleware (e.g., @upstash/ratelimit)

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=300",
};

function validateApiKey(req: NextRequest): boolean {
  const headerKey = req.headers.get("x-api-key");
  const queryKey = req.nextUrl.searchParams.get("api_key");
  const key = headerKey || queryKey;
  return typeof key === "string" && key.length > 0;
}

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { ...CORS_HEADERS, ...CACHE_HEADERS },
  });
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: CORS_HEADERS }
  );
}

const VALID_SORT_FIELDS = ["name", "robo_score", "price_current"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return errorResponse("Missing or invalid API key", 401);
  }

  const params = req.nextUrl.searchParams;

  const category = params.get("category");
  const manufacturer = params.get("manufacturer");
  const limitParam = Math.min(Math.max(parseInt(params.get("limit") || "20", 10) || 20, 1), 100);
  const offsetParam = Math.max(parseInt(params.get("offset") || "0", 10) || 0, 0);
  const sortParam = params.get("sort") as SortField | null;
  const sortField: SortField = sortParam && VALID_SORT_FIELDS.includes(sortParam) ? sortParam : "name";

  const supabase = createServerClient();

  let query = supabase
    .from("robots")
    .select(
      `
      id, slug, name, robo_score, price_current, description_short,
      status, year_released, images, manufacturer_id, category_id,
      manufacturers ( name ),
      robot_categories ( name )
      `,
      { count: "exact" }
    )
    .order(sortField, { ascending: sortField === "name", nullsFirst: false })
    .range(offsetParam, offsetParam + limitParam - 1);

  if (category) {
    query = query.eq("robot_categories.slug", category);
    // Filter by category slug via a subquery approach:
    // We need to filter the parent row, so use category_id lookup
    const { data: cat } = await supabase
      .from("robot_categories")
      .select("id")
      .eq("slug", category)
      .single();
    if (cat) {
      query = supabase
        .from("robots")
        .select(
          `
          id, slug, name, robo_score, price_current, description_short,
          status, year_released, images, manufacturer_id, category_id,
          manufacturers ( name ),
          robot_categories ( name )
          `,
          { count: "exact" }
        )
        .eq("category_id", cat.id)
        .order(sortField, { ascending: sortField === "name", nullsFirst: false })
        .range(offsetParam, offsetParam + limitParam - 1);
    } else {
      return jsonResponse({ data: [], total: 0, limit: limitParam, offset: offsetParam });
    }
  }

  if (manufacturer) {
    const { data: mfr } = await supabase
      .from("manufacturers")
      .select("id")
      .eq("slug", manufacturer)
      .single();
    if (mfr) {
      query = query.eq("manufacturer_id", mfr.id);
    } else {
      return jsonResponse({ data: [], total: 0, limit: limitParam, offset: offsetParam });
    }
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("[API v1 /robots] Query error:", error.message);
    return errorResponse("Internal server error", 500);
  }

  return jsonResponse({
    data: data ?? [],
    total: count ?? 0,
    limit: limitParam,
    offset: offsetParam,
  });
}
