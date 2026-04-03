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

  // Verify provider ownership
  const { data: provider } = await supabase
    .from("robot_service_providers")
    .select("id, user_id")
    .eq("slug", slug)
    .single();

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  if (provider.user_id !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Require at least a custom_name or robot_id
  if (!body.custom_name && !body.robot_id) {
    return NextResponse.json(
      { error: "Either custom_name or robot_id is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("rsp_robots")
    .insert({
      rsp_id: provider.id,
      robot_id: (body.robot_id as string) || null,
      custom_name: (body.custom_name as string) || null,
      custom_manufacturer: (body.custom_manufacturer as string) || null,
      custom_category: (body.custom_category as string) || null,
      description: (body.description as string) || null,
      fulfillment_types: (body.fulfillment_types as string[]) || [],
      daily_rate: (body.daily_rate as number) || null,
      weekly_rate: (body.weekly_rate as number) || null,
      monthly_rate: (body.monthly_rate as number) || null,
      minimum_days: (body.minimum_days as number) || 1,
      available: body.available !== false,
      available_from: (body.available_from as string) || null,
      city: (body.city as string) || null,
      state: (body.state as string) || null,
      operator_included: (body.operator_included as boolean) || false,
      remote_capable: (body.remote_capable as boolean) || false,
      images: (body.images as string[]) || [],
      specifications: (body.specifications as Record<string, unknown>) || {},
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to add robot to fleet" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
