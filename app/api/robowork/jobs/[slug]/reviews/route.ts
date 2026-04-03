import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { rsp_id, rating } = body;

  if (!rsp_id || typeof rsp_id !== "string") {
    return NextResponse.json({ error: "rsp_id is required" }, { status: 400 });
  }

  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "rating is required and must be between 1 and 5" },
      { status: 400 }
    );
  }

  const supabaseResponse = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Resolve slug to job id
  const { data: job, error: jobError } = await supabase
    .from("robowork_jobs")
    .select("id, status")
    .eq("slug", slug)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.status !== "completed") {
    return NextResponse.json(
      { error: "Reviews can only be submitted for completed jobs" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("robowork_reviews")
    .insert({
      job_id: job.id,
      rsp_id: rsp_id as string,
      reviewer_name: (body.reviewer_name as string) || null,
      reviewer_company: (body.reviewer_company as string) || null,
      rating: Math.round(rating as number),
      title: (body.title as string) || null,
      body: (body.body as string) || null,
      would_hire_again: body.would_hire_again !== false,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }

  // Update provider rating (recalculate average)
  const { data: allReviews } = await supabase
    .from("robowork_reviews")
    .select("rating")
    .eq("rsp_id", rsp_id as string);

  if (allReviews && allReviews.length > 0) {
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await supabase
      .from("robot_service_providers")
      .update({
        rating: Math.round(avgRating * 100) / 100,
        updated_at: new Date().toISOString(),
      })
      .eq("id", rsp_id as string);
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
