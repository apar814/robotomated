import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { starsToScore } from "@/lib/scoring/roboscore";

export async function POST(request: NextRequest) {
  const { robot_id, stars, title, body, pros, cons, verified_purchase } = await request.json();

  if (!robot_id || !stars || !title || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Rating must be 1-5 stars" }, { status: 400 });
  }

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 50) {
    return NextResponse.json({ error: "Review must be at least 50 words" }, { status: 400 });
  }

  const supabase = createServerClient();

  // Convert stars to RoboScore
  const roboScore = starsToScore(stars);

  const { error } = await supabase.from("reviews").insert({
    robot_id,
    review_type: "community" as const,
    title,
    body,
    robo_score: roboScore,
    pros: pros || [],
    cons: cons || [],
    verified_purchase: verified_purchase || false,
    // published_at is null — moderation queue
  });

  if (error) {
    console.error("Review insert error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }

  return NextResponse.json({ message: "Review submitted for moderation" });
}
