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
    .from("robot_service_providers")
    .select("*, rsp_robots(*)")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  // Fetch reviews for this provider
  const { data: reviews } = await supabase
    .from("robowork_reviews")
    .select("*")
    .eq("rsp_id", data.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({ provider: data, reviews: reviews || [] });
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("robot_service_providers")
    .select("id, user_id")
    .eq("slug", slug)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  if (existing.user_id !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const allowedFields = [
    "company_name", "description", "bio", "city", "state", "country",
    "service_radius", "operating_regions", "specializations", "fulfillment_types",
    "website", "linkedin", "profile_image", "portfolio_images",
  ];

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  const { data, error } = await supabase
    .from("robot_service_providers")
    .update(updates)
    .eq("id", existing.id)
    .select("id, slug, company_name")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, provider: data });
}
