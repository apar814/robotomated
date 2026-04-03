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

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return errorResponse("Missing or invalid API key", 401);
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("robot_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[API v1 /categories] Query error:", error.message);
    return errorResponse("Internal server error", 500);
  }

  return jsonResponse({ data: data ?? [] });
}
