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

  const { robot_id, custom_name, serial_number, purchase_date, purchase_price, site_location, department, notes } = body;

  if (!serial_number || !site_location) {
    return NextResponse.json(
      { error: "Serial number and site location are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("robot_assets").insert({
    user_id: user.id,
    robot_id: robot_id || null,
    custom_name: custom_name || null,
    serial_number,
    purchase_date: purchase_date || null,
    purchase_price: purchase_price || null,
    site_location,
    department: department || null,
    notes: notes || null,
    status: "active",
  }).select("id").single();

  if (error) {
    return NextResponse.json({ error: "Failed to add asset" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
