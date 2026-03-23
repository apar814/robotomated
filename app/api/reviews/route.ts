import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { starsToScore } from "@/lib/scoring/roboscore";

/** Strip HTML tags and limit length */
function sanitize(input: string, maxLen = 5000): string {
  return input.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  const { robot_id, stars, title, body, pros, cons, verified_purchase } = await request.json();

  if (!robot_id || !stars || !title || !body) {
    return NextResponse.json({ error: "Missing required fields", code: "MISSING_FIELDS" }, { status: 400 });
  }

  if (stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Rating must be 1-5 stars", code: "INVALID_RATING" }, { status: 400 });
  }

  const cleanBody = sanitize(body);
  const cleanTitle = sanitize(title, 200);
  const cleanPros = Array.isArray(pros) ? pros.map((p: string) => sanitize(p, 500)) : [];
  const cleanCons = Array.isArray(cons) ? cons.map((c: string) => sanitize(c, 500)) : [];

  const wordCount = cleanBody.split(/\s+/).filter(Boolean).length;
  if (wordCount < 50) {
    return NextResponse.json({ error: "Review must be at least 50 words", code: "TOO_SHORT" }, { status: 400 });
  }

  // Rate limit: 5 reviews per day per user
  const authSupabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await authSupabase.auth.getUser();

  if (user) {
    const supabase = createServerClient();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("reviewer_id", user.id)
      .gte("created_at", oneDayAgo);

    if ((count || 0) >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 reviews per day. Please try again tomorrow.", code: "RATE_LIMITED" },
        { status: 429 }
      );
    }
  }

  const supabase = createServerClient();
  const roboScore = starsToScore(stars);

  const { error } = await supabase.from("reviews").insert({
    robot_id,
    reviewer_id: user?.id || null,
    review_type: "community" as const,
    title: cleanTitle,
    body: cleanBody,
    robo_score: roboScore,
    pros: cleanPros,
    cons: cleanCons,
    verified_purchase: verified_purchase || false,
  });

  if (error) {
    console.error("Review insert error:", error);
    return NextResponse.json({ error: "Failed to submit review", code: "DB_ERROR" }, { status: 500 });
  }

  return NextResponse.json({ message: "Review submitted for moderation" });
}
