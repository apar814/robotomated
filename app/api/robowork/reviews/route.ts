import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

/** GET — list RSP reviews with optional filters */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rspId = searchParams.get("rsp_id");
  const minRating = searchParams.get("min_rating");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  const supabase = createServerClient();

  let query = (supabase as any)
    .from("robowork_reviews")
    .select("*, robowork_jobs(title, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (rspId) {
    query = query.eq("rsp_id", rspId);
  }

  if (minRating) {
    const rating = parseInt(minRating);
    if (rating >= 1 && rating <= 5) {
      query = query.gte("rating", rating);
    }
  }

  const { data: reviews, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    reviews: reviews || [],
    total: count || 0,
  });
}

/** POST — submit an RSP review */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { job_id, rsp_id, rating, title, body: reviewBody, would_hire_again } = body;

  // Validate required fields
  if (!job_id || typeof job_id !== "string") {
    return NextResponse.json({ error: "job_id is required" }, { status: 400 });
  }

  if (!rsp_id || typeof rsp_id !== "string") {
    return NextResponse.json({ error: "rsp_id is required" }, { status: 400 });
  }

  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating is required and must be between 1 and 5" }, { status: 400 });
  }

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  if (!reviewBody || typeof reviewBody !== "string" || reviewBody.trim().length < 20) {
    return NextResponse.json({ error: "body is required and must be at least 20 characters" }, { status: 400 });
  }

  // Get authenticated user for reviewer name/company
  const authSupabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await authSupabase.auth.getUser();

  // Resolve reviewer info from user profile if available
  let reviewerName: string | null = null;
  let reviewerCompany: string | null = null;

  if (user) {
    reviewerName = user.user_metadata?.full_name || user.email?.split("@")[0] || null;
    reviewerCompany = user.user_metadata?.company || null;
  }

  const supabase = createServerClient();

  // Verify job exists and is completed
  const { data: job, error: jobError } = await (supabase as any)
    .from("robowork_jobs")
    .select("id, status")
    .eq("id", job_id)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.status !== "completed") {
    return NextResponse.json({ error: "Reviews can only be submitted for completed jobs" }, { status: 400 });
  }

  // Check for duplicate review
  const { count: existing } = await (supabase as any)
    .from("robowork_reviews")
    .select("id", { count: "exact", head: true })
    .eq("job_id", job_id)
    .eq("rsp_id", rsp_id);

  if ((existing || 0) > 0) {
    return NextResponse.json({ error: "A review already exists for this job and provider" }, { status: 409 });
  }

  // Insert review
  const { data: review, error: insertError } = await (supabase as any)
    .from("robowork_reviews")
    .insert({
      job_id,
      rsp_id,
      reviewer_name: reviewerName,
      reviewer_company: reviewerCompany,
      rating: Math.round(rating),
      title: title.trim(),
      body: reviewBody.trim(),
      would_hire_again: would_hire_again !== false,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }

  // Recalculate provider average rating
  const { data: allReviews } = await (supabase as any)
    .from("robowork_reviews")
    .select("rating")
    .eq("rsp_id", rsp_id);

  if (allReviews && allReviews.length > 0) {
    const avgRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length;

    await (supabase as any)
      .from("robot_service_providers")
      .update({
        rating: Math.round(avgRating * 100) / 100,
        updated_at: new Date().toISOString(),
      })
      .eq("id", rsp_id);
  }

  return NextResponse.json({ success: true, id: review.id }, { status: 201 });
}
