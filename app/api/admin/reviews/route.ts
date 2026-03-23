import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { robot_id, title, body, verdict, pros, cons, robo_score, score_breakdown } = await request.json();

  if (!robot_id || !title || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // TODO: In production, verify admin role via Supabase auth session
  // For now, the service role key grants full access

  const supabase = createServerClient();

  const { error } = await supabase.from("reviews").insert({
    robot_id,
    review_type: "expert" as const,
    title,
    body,
    robo_score,
    score_breakdown,
    pros: pros || [],
    cons: cons || [],
    verdict: verdict || null,
    verified_purchase: false,
    published_at: new Date().toISOString(), // Expert reviews publish immediately
  });

  if (error) {
    console.error("Admin review insert error:", error);
    return NextResponse.json({ error: "Failed to publish review" }, { status: 500 });
  }

  return NextResponse.json({ message: "Review published" });
}
