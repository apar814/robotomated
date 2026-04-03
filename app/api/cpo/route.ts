import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const manufacturer = searchParams.get("manufacturer");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  const supabase = createServerClient();

  let query = supabase
    .from("cpo_listings")
    .select("*", { count: "exact" })
    .eq("status", "listed")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (manufacturer) {
    query = query.ilike("robot_manufacturer", `%${manufacturer}%`);
  }

  if (category) {
    query = query.eq("condition_report", category);
  }

  if (minPrice) {
    query = query.gte("asking_price", Number(minPrice));
  }

  if (maxPrice) {
    query = query.lte("asking_price", Number(maxPrice));
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("CPO listing query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }

  return NextResponse.json({ listings: data || [], total: count || 0 });
}

export async function POST(request: NextRequest) {
  let body: {
    robot_name: string;
    manufacturer: string;
    year: number;
    operating_hours: number;
    price: number;
    location: string;
    description: string;
    contact_email: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    robot_name,
    manufacturer,
    year,
    operating_hours,
    price,
    location,
    description,
    contact_email,
  } = body;

  if (!robot_name || !manufacturer || !year || !price || !location || !description || !contact_email) {
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
  if (!emailRegex.test(contact_email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("cpo_listings")
    .insert({
      robot_name,
      robot_manufacturer: manufacturer,
      year,
      operating_hours: operating_hours || 0,
      asking_price: price,
      city: location,
      condition_report: description,
      seller_email: contact_email,
      condition: 3,
      robotomated_certified: false,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("CPO listing insert error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id: data.id });
}
