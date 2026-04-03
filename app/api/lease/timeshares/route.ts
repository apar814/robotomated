import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("robot_time_shares")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch timeshares:", error);
      return NextResponse.json(
        { error: "Failed to fetch timeshares" },
        { status: 500 }
      );
    }

    return NextResponse.json({ timeshares: data || [] });
  } catch (error) {
    console.error("Timeshares GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      contact_name,
      business_email,
      robot_model,
      location,
      available_hours,
      monthly_cost,
      description,
    } = body;

    if (!contact_name || !business_email || !robot_model) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: contact_name, business_email, robot_model",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(business_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Parse location into city/state if provided as "City, State"
    let city: string | null = null;
    let state: string | null = null;
    if (location) {
      const parts = location.split(",").map((s: string) => s.trim());
      city = parts[0] || null;
      state = parts[1] || null;
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("robot_time_shares")
      .insert({
        robot_name: robot_model,
        owner_name: contact_name,
        owner_email: business_email,
        city,
        state,
        available_hours: available_hours
          ? { schedule: available_hours }
          : {},
        daily_rate: monthly_cost
          ? parseFloat(String(monthly_cost).replace(/[^0-9.]/g, "")) || null
          : null,
        description: description || null,
        status: "pending_review",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert timeshare:", error);
      return NextResponse.json(
        { error: "Failed to create timeshare listing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Timeshares POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
