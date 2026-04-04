import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, accountType } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Missing required field: email" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const validAccountTypes = ["individual", "business"];
    const resolvedType = validAccountTypes.includes(accountType)
      ? accountType
      : "individual";

    const supabase = createServerClient();
    const sellerId = randomUUID();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("seller_accounts").insert({
      id: sellerId,
      user_id: sellerId,
      account_type: resolvedType,
      stripe_account_status: "onboarding",
    });

    if (error) {
      // Handle duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A seller account with this email already exists" },
          { status: 409 }
        );
      }
      console.error("Failed to create seller account:", error);
      return NextResponse.json(
        { error: "Failed to create seller account" },
        { status: 500 }
      );
    }

    // Actual Stripe Connect onboarding deferred
    return NextResponse.json({
      sellerId,
      onboardingUrl: "/seller/setup",
    });
  } catch (error) {
    console.error("Seller onboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
