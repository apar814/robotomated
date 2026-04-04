import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { sendProviderRegisteredNotification } from "@/lib/email/robowork-emails";

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const specialization = searchParams.get("specialization");
  const fulfillment_type = searchParams.get("fulfillment_type");
  const verified = searchParams.get("verified");
  const available = searchParams.get("available");
  const sort = searchParams.get("sort") || "rating";
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

  let query = supabase
    .from("robot_service_providers")
    .select("*", { count: "exact" });

  if (city) query = query.ilike("city", city);
  if (state) query = query.eq("state", state);
  if (specialization) query = query.contains("specializations", [specialization]);
  if (fulfillment_type) query = query.contains("fulfillment_types", [fulfillment_type]);
  if (verified === "true") query = query.eq("verified", true);
  if (available === "true") {
    // Filter providers who have at least one available robot — handled client-side or via join
    // For now, just return all matching providers
  }

  switch (sort) {
    case "jobs":
      query = query.order("completed_jobs", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "name":
      query = query.order("company_name", { ascending: true });
      break;
    default:
      query = query.order("rating", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }

  return NextResponse.json({
    providers: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { company_name } = body;

  if (!company_name || typeof company_name !== "string") {
    return NextResponse.json(
      { error: "company_name is required" },
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const slug = slugify(company_name);

  const { data, error } = await supabase
    .from("robot_service_providers")
    .insert({
      user_id: user.id,
      company_name,
      slug,
      description: (body.description as string) || null,
      bio: (body.bio as string) || null,
      city: (body.city as string) || null,
      state: (body.state as string) || null,
      country: (body.country as string) || "US",
      service_radius: (body.service_radius as number) || 50,
      operating_regions: (body.operating_regions as string[]) || [],
      specializations: (body.specializations as string[]) || [],
      fulfillment_types: (body.fulfillment_types as string[]) || [],
      website: (body.website as string) || null,
      linkedin: (body.linkedin as string) || null,
      profile_image: (body.profile_image as string) || null,
      business_type: (body.business_type as string) || null,
      years_in_robotics: (body.years_in_robotics as number) || null,
      phone: (body.phone as string) || null,
      phone_verified: (body.phone_verified as boolean) || false,
      email_verified: (body.email_verified as boolean) || false,
      verification_tier: (body.verification_tier as number) || 0,
      specialization_levels: (body.specialization_levels as Record<string, string>) || {},
      onboarding_completed_at: new Date().toISOString(),
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to register provider" }, { status: 500 });
  }

  // Insert robots if provided from registration form
  const robots = body.robots as Array<Record<string, unknown>> | undefined;
  if (robots && Array.isArray(robots) && robots.length > 0) {
    const robotRows = robots.map((r) => ({
      rsp_id: data.id,
      custom_name: (r.custom_name as string) || "Unnamed Robot",
      custom_manufacturer: (r.custom_manufacturer as string) || null,
      custom_category: (r.custom_category as string) || null,
      description: (r.description as string) || null,
      daily_rate: (r.daily_rate as number) || null,
      weekly_rate: (r.weekly_rate as number) || null,
      monthly_rate: (r.monthly_rate as number) || null,
      minimum_days: (r.minimum_days as number) || 1,
      operator_included: (r.operator_included as boolean) || false,
      remote_capable: (r.remote_capable as boolean) || false,
      fulfillment_types: (r.fulfillment_types as string[]) || [],
      images: (r.images as string[]) || [],
    }));

    const { error: robotError } = await supabase.from("rsp_robots").insert(robotRows);
    if (robotError) {
      console.error("[robowork/providers] Robot insert error:", robotError);
    }
  }

  // Send registration emails (non-blocking)
  sendProviderRegisteredNotification({
    company_name: company_name as string,
    contact_email: user.email || "",
    city: (body.city as string) || null,
    state: (body.state as string) || null,
  });

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug }, { status: 201 });
}
