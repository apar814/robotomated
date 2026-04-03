import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("lease_transfers")
      .select("*")
      .eq("status", "listed")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch lease transfers:", error);
      return NextResponse.json(
        { error: "Failed to fetch transfers" },
        { status: 500 }
      );
    }

    return NextResponse.json({ transfers: data || [] });
  } catch (error) {
    console.error("Lease transfers GET error:", error);
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
      monthly_payment,
      months_remaining,
      leasing_company,
      reason,
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

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("lease_transfers")
      .insert({
        robot_name: robot_model,
        seller_name: contact_name,
        seller_email: business_email,
        monthly_payment: monthly_payment
          ? parseFloat(String(monthly_payment).replace(/[^0-9.]/g, "")) || null
          : null,
        remaining_months: months_remaining
          ? parseInt(String(months_remaining), 10)
          : null,
        lease_company: leasing_company || null,
        condition_notes: reason || null,
        status: "pending_review",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert lease transfer:", error);
      return NextResponse.json(
        { error: "Failed to create transfer listing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Lease transfers POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
