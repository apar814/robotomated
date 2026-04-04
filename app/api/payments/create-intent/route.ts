import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

// Platform fee schedule by payment type
const PLATFORM_FEE_SCHEDULE: Record<string, number> = {
  marketplace_purchase: 0.1, // 10% marketplace GMV
  affiliate_commission: 0.08, // 8% affiliate
  service_booking: 0.12, // 12% service bookings
  lease_origination: 0.05, // 5% lease origination
  default: 0.1,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { amount, type, sellerId, description } = body;

    // Validate required fields
    if (!amount || !type) {
      return NextResponse.json(
        { error: "Missing required fields: amount, type" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Look up platform fee from schedule
    const feeRate =
      PLATFORM_FEE_SCHEDULE[type] ?? PLATFORM_FEE_SCHEDULE.default;
    const platformFee = Math.round(amount * feeRate * 100) / 100;
    const transactionId = randomUUID();
    const paymentId = randomUUID();

    const supabase = createServerClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("payments").insert({
      id: paymentId,
      transaction_id: transactionId,
      type,
      amount,
      platform_fee: platformFee,
      platform_fee_percent: feeRate * 100,
      seller_id: sellerId || null,
      description: description || null,
      status: "pending",
    });

    if (error) {
      console.error("Failed to create payment record:", error);
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 }
      );
    }

    // Actual Stripe integration deferred -- return mock clientSecret
    const mockClientSecret = `pi_mock_${transactionId.slice(0, 8)}_secret_${Date.now()}`;

    return NextResponse.json({
      paymentId,
      transactionId,
      platformFee,
      clientSecret: mockClientSecret,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
