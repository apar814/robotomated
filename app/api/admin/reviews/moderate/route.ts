import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/** GET — fetch reviews for moderation dashboard with stats */
export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get("filter") || "pending";
  const supabase = createServerClient();

  // Build query
  let query = (supabase as any)
    .from("reviews")
    .select("id, robot_id, reviewer_id, review_type, title, body, robo_score, status, created_at, published_at, robots(name, slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filter === "pending") {
    query = query.is("published_at", null).not("status", "eq", "rejected");
  } else if (filter === "published") {
    query = query.eq("status", "published");
  } else if (filter === "rejected") {
    query = query.eq("status", "rejected");
  }
  // "all" — no filter

  const { data: reviews, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Compute stats
  const { count: totalPending } = await (supabase as any)
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .is("published_at", null)
    .not("status", "eq", "rejected");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: publishedToday } = await (supabase as any)
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .gte("published_at", todayStart.toISOString());

  const { count: totalReviews } = await (supabase as any)
    .from("reviews")
    .select("id", { count: "exact", head: true });

  const { count: rejectedCount } = await (supabase as any)
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("status", "rejected");

  const rejectionRate = (totalReviews || 0) > 0
    ? ((rejectedCount || 0) / (totalReviews || 1)) * 100
    : 0;

  return NextResponse.json({
    reviews: reviews || [],
    stats: {
      totalPending: totalPending || 0,
      publishedToday: publishedToday || 0,
      rejectionRate,
      total: totalReviews || 0,
    },
  });
}

/** POST — approve or reject a review */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { review_id, action } = body;

  if (!review_id || typeof review_id !== "string") {
    return NextResponse.json({ error: "review_id is required" }, { status: 400 });
  }

  if (!action || !["approve", "reject"].includes(action as string)) {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
  }

  const supabase = createServerClient();

  if (action === "approve") {
    const { error } = await (supabase as any)
      .from("reviews")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", review_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await (supabase as any)
      .from("reviews")
      .update({
        status: "rejected",
      })
      .eq("id", review_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
