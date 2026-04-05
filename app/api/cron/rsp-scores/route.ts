import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { calculateRSPScore } from "@/lib/scoring/rsp-score";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  // Fetch all RSPs
  const { data: rsps, error: rspError } = await (supabase as any)
    .from("robot_service_providers")
    .select("id, completed_jobs, response_time_hours, verification_tier");

  if (rspError) {
    console.error("Failed to fetch RSPs:", rspError);
    return NextResponse.json({ error: "Failed to fetch RSPs" }, { status: 500 });
  }

  const providers = rsps || [];
  let processed = 0;
  let totalScore = 0;

  for (const rsp of providers) {
    // Fetch reviews for this RSP
    const { data: reviews } = await (supabase as any)
      .from("robowork_reviews")
      .select("rating, would_hire_again")
      .eq("rsp_id", rsp.id);

    // Count accepted bids (total accepted jobs) for this RSP
    const { count: acceptedCount } = await (supabase as any)
      .from("robowork_bids")
      .select("id", { count: "exact", head: true })
      .eq("rsp_id", rsp.id)
      .eq("status", "accepted");

    const score = calculateRSPScore({
      reviews: reviews || [],
      completedJobs: rsp.completed_jobs ?? 0,
      totalAcceptedJobs: acceptedCount ?? 0,
      responseTimeHours: rsp.response_time_hours ?? 24,
      verificationTier: rsp.verification_tier ?? 0,
    });

    // Update RSP rating
    await (supabase as any)
      .from("robot_service_providers")
      .update({ rating: score.overall })
      .eq("id", rsp.id);

    totalScore += score.overall;
    processed++;
  }

  const averageScore = processed > 0 ? Math.round((totalScore / processed) * 100) / 100 : 0;

  console.log(`RSP Scores: processed ${processed}, average score ${averageScore}`);

  return NextResponse.json({
    processed,
    averageScore,
    timestamp: new Date().toISOString(),
  });
}
