import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { sendJobPostedNotification } from "@/lib/email/robowork-emails";

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

  const status = searchParams.get("status");
  const industry = searchParams.get("industry");
  const task_type = searchParams.get("task_type");
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const fulfillment_type = searchParams.get("fulfillment_type");
  const urgency = searchParams.get("urgency");
  const budget_min = searchParams.get("budget_min");
  const budget_max = searchParams.get("budget_max");
  const sort = searchParams.get("sort") || "newest";
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
    .from("robowork_jobs")
    .select("*", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (industry) query = query.eq("industry", industry);
  if (task_type) query = query.eq("task_type", task_type);
  if (city) query = query.ilike("city", city);
  if (state) query = query.eq("state", state);
  if (fulfillment_type) query = query.eq("fulfillment_type", fulfillment_type);
  if (urgency) query = query.eq("urgency", urgency);
  if (budget_min) query = query.gte("budget_max", parseFloat(budget_min));
  if (budget_max) query = query.lte("budget_min", parseFloat(budget_max));

  switch (sort) {
    case "budget_high":
      query = query.order("budget_max", { ascending: false, nullsFirst: false });
      break;
    case "budget_low":
      query = query.order("budget_min", { ascending: true, nullsFirst: false });
      break;
    case "urgency":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }

  return NextResponse.json({
    jobs: data,
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

  const { title, description, business_name, business_email, task_type, industry } = body as Record<string, string>;

  if (!title || !description || !business_name || !business_email || !task_type || !industry) {
    return NextResponse.json(
      { error: "title, description, business_name, business_email, task_type, and industry are required" },
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

  const slug = slugify(title as string);

  const { data, error } = await supabase
    .from("robowork_jobs")
    .insert({
      slug,
      title: title as string,
      description: description as string,
      business_name: business_name as string,
      business_email: business_email as string,
      business_user_id: user?.id || null,
      task_type: task_type as string,
      industry: industry as string,
      city: (body.city as string) || null,
      state: (body.state as string) || null,
      country: (body.country as string) || "US",
      remote_ok: (body.remote_ok as boolean) || false,
      start_date: (body.start_date as string) || null,
      end_date: (body.end_date as string) || null,
      duration_days: (body.duration_days as number) || null,
      budget_min: (body.budget_min as number) || null,
      budget_max: (body.budget_max as number) || null,
      fulfillment_type: (body.fulfillment_type as string) || "any",
      robot_type: (body.robot_type as string) || "any",
      status: "draft",
      urgency: (body.urgency as string) || "flexible",
      requirements: (body.requirements as string) || null,
      site_details: (body.site_details as string) || null,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }

  // Send email notifications (non-blocking)
  sendJobPostedNotification({
    title: title as string,
    slug: data.slug,
    business_name: business_name as string,
    business_email: business_email as string,
    task_type: task_type as string,
    industry: industry as string,
  });

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug }, { status: 201 });
}
