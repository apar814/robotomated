import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const body = await request.json();

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

  const {
    asset_id,
    log_date,
    maintenance_type,
    description,
    technician,
    cost,
    downtime_hours,
    parts_replaced,
    next_service_date,
  } = body;

  if (!asset_id || !log_date || !maintenance_type || !description) {
    return NextResponse.json(
      { error: "Asset, date, type, and description are required" },
      { status: 400 }
    );
  }

  // Verify the user owns this asset
  const { data: asset } = await supabase
    .from("robot_assets")
    .select("id")
    .eq("id", asset_id)
    .eq("user_id", user.id)
    .single();

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const { error } = await supabase.from("maintenance_logs").insert({
    asset_id,
    user_id: user.id,
    log_date,
    maintenance_type,
    description,
    technician: technician || null,
    cost: cost || null,
    downtime_hours: downtime_hours || null,
    parts_replaced: parts_replaced || null,
    next_service_date: next_service_date || null,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to log service" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
