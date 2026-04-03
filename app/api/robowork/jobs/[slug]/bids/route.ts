import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;

  const supabase = createServerClient(
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

  // First resolve slug to job id
  const { data: job, error: jobError } = await supabase
    .from("robowork_jobs")
    .select("id")
    .eq("slug", slug)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const { data, error, count } = await supabase
    .from("robowork_bids")
    .select("*, robot_service_providers(id, company_name, slug, rating, verified, profile_image)", { count: "exact" })
    .eq("job_id", job.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }

  return NextResponse.json({
    bids: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

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

  const { rsp_id, proposed_price } = body;

  if (!rsp_id || proposed_price === undefined || proposed_price === null) {
    return NextResponse.json(
      { error: "rsp_id and proposed_price are required" },
      { status: 400 }
    );
  }

  if (typeof proposed_price !== "number" || proposed_price <= 0) {
    return NextResponse.json(
      { error: "proposed_price must be a positive number" },
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

  if (job.status !== "open") {
    return NextResponse.json({ error: "Job is not accepting bids" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("robowork_bids")
    .insert({
      job_id: job.id,
      rsp_id: rsp_id as string,
      rsp_robot_id: (body.rsp_robot_id as string) || null,
      proposed_price: proposed_price as number,
      price_breakdown: (body.price_breakdown as Record<string, unknown>) || {},
      message: (body.message as string) || null,
      fulfillment_type: (body.fulfillment_type as string) || null,
      proposed_start_date: (body.proposed_start_date as string) || null,
      proposed_end_date: (body.proposed_end_date as string) || null,
      includes_operator: (body.includes_operator as boolean) || false,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to submit bid" }, { status: 500 });
  }

  // Increment bid_count on the job (best-effort)
  const { data: currentJob } = await supabase
    .from("robowork_jobs")
    .select("bid_count")
    .eq("id", job.id)
    .single();

  await supabase
    .from("robowork_jobs")
    .update({
      bid_count: (currentJob?.bid_count || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id);

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
