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

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!validateApiKey(req)) {
    return errorResponse("Missing or invalid API key", 401);
  }

  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    return errorResponse("Invalid slug parameter", 400);
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("robots")
    .select(
      `
      *,
      manufacturers ( id, slug, name, country, founded_year, website, logo_url ),
      robot_categories ( id, slug, name, description, icon_name, display_order )
      `
    )
    .eq("slug", slug)
    .single();

  if (error && error.code === "PGRST116") {
    return errorResponse("Robot not found", 404);
  }

  if (error) {
    console.error("[API v1 /robots/[slug]] Query error:", error.message);
    return errorResponse("Internal server error", 500);
  }

  return jsonResponse({ data });
}
