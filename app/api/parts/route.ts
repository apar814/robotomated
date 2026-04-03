import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const condition = searchParams.get("condition");
  const search = searchParams.get("q");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  const supabase = createServerClient();

  let query = supabase
    .from("parts_listings")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (condition) {
    query = query.eq("condition", condition);
  }

  if (search) {
    query = query.or(
      `part_name.ilike.%${search}%,part_number.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Parts listing query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch parts" },
      { status: 500 }
    );
  }

  return NextResponse.json({ parts: data || [], total: count || 0 });
}

export async function POST(request: NextRequest) {
  let body: {
    part_name: string;
    part_number?: string;
    compatible_robots: string;
    condition: string;
    price: number;
    seller_location: string;
    description: string;
    seller_email: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { part_name, part_number, compatible_robots, condition, price, seller_location, description, seller_email } = body;

  if (!part_name || !compatible_robots || !condition || !price || !seller_location || !seller_email) {
    return NextResponse.json(
      { error: "All required fields must be provided" },
      { status: 400 }
    );
  }

  if (price <= 0) {
    return NextResponse.json(
      { error: "Price must be greater than zero" },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(seller_email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("parts_listings")
    .insert({
      part_name,
      part_number: part_number || null,
      compatible_models: compatible_robots.split(",").map((s) => s.trim()),
      condition,
      price,
      city: seller_location,
      seller_name: seller_email.split("@")[0],
      seller_email,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Parts listing insert error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id: data.id });
}
