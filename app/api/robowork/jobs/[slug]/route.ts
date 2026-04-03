import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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

  const { data, error } = await supabase
    .from("robowork_jobs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Increment view count (fire-and-forget)
  supabase
    .from("robowork_jobs")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", data.id)
    .then();

  return NextResponse.json({ job: data });
}

export async function PUT(
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

  // Build update object from allowed fields
  const allowedFields = [
    "title", "description", "task_type", "industry", "city", "state",
    "remote_ok", "start_date", "end_date", "duration_days",
    "budget_min", "budget_max", "fulfillment_type", "robot_type",
    "status", "urgency", "requirements", "site_details", "selected_bid_id",
    "expires_at",
  ];

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  const { data, error } = await supabase
    .from("robowork_jobs")
    .update(updates)
    .eq("slug", slug)
    .select("id, slug, status")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, job: data });
}
