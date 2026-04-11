import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const featuredOnly = searchParams.get("featured") === "true";

  const supabase = createServerClient();

  let query = supabase
    .from("news_items")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (featuredOnly) {
    query = query.eq("is_featured", true);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data || [],
    total: count || 0,
    limit,
    offset,
  });
}
