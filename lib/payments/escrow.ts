import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreateEscrowResult {
  paymentId: string;
  transactionId: string;
}

interface ReleaseEscrowResult {
  success: boolean;
  amount: number;
}

interface DisputeEscrowResult {
  disputeId: string;
}

interface RefundEscrowResult {
  success: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateTransactionId(): string {
  const hex = crypto.randomBytes(4).toString("hex");
  return `TXN-${Date.now()}-${hex}`;
}

/**
 * Untyped Supabase client for tables not yet in generated types
 * (payments, disputes from migration 027). Uses service role key
 * to bypass RLS for server-side operations.
 */
function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// Create escrow (hold funds for a RoboWork job)
// ---------------------------------------------------------------------------

export async function createEscrow(
  jobId: string,
  amount: number,
  buyerId: string,
  sellerId: string
): Promise<CreateEscrowResult> {
  const supabase = getClient();
  const transactionId = generateTransactionId();

  try {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        transaction_id: transactionId,
        type: "job_payment",
        amount,
        currency: "usd",
        status: "held",
        buyer_id: buyerId,
        seller_id: sellerId,
        metadata: { jobId },
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Failed to create escrow: ${error.message}`);
    }

    return {
      paymentId: data.id as string,
      transactionId,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create escrow");
  }
}

// ---------------------------------------------------------------------------
// Release escrow (mark payment as completed)
// ---------------------------------------------------------------------------

export async function releaseEscrow(
  paymentId: string
): Promise<ReleaseEscrowResult> {
  const supabase = getClient();

  try {
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("amount, status")
      .eq("id", paymentId)
      .single();

    if (fetchError) {
      throw new Error(`Payment not found: ${fetchError.message}`);
    }

    if (payment.status !== "held") {
      throw new Error(
        `Cannot release escrow: payment status is "${payment.status}", expected "held"`
      );
    }

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        settled_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (updateError) {
      throw new Error(`Failed to release escrow: ${updateError.message}`);
    }

    return {
      success: true,
      amount: payment.amount as number,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to release escrow");
  }
}

// ---------------------------------------------------------------------------
// Dispute escrow
// ---------------------------------------------------------------------------

export async function disputeEscrow(
  paymentId: string,
  reason: string,
  raisedBy: string
): Promise<DisputeEscrowResult> {
  const supabase = getClient();

  try {
    // Update payment status to disputed
    const { error: updateError } = await supabase
      .from("payments")
      .update({ status: "disputed" })
      .eq("id", paymentId);

    if (updateError) {
      throw new Error(
        `Failed to update payment status: ${updateError.message}`
      );
    }

    // Create dispute record
    const { data: dispute, error: disputeError } = await supabase
      .from("disputes")
      .insert({
        payment_id: paymentId,
        raised_by: raisedBy,
        reason,
        status: "open",
      })
      .select("id")
      .single();

    if (disputeError) {
      throw new Error(`Failed to create dispute: ${disputeError.message}`);
    }

    return {
      disputeId: dispute.id as string,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to dispute escrow");
  }
}

// ---------------------------------------------------------------------------
// Refund escrow
// ---------------------------------------------------------------------------

export async function refundEscrow(
  paymentId: string
): Promise<RefundEscrowResult> {
  const supabase = getClient();

  try {
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("status")
      .eq("id", paymentId)
      .single();

    if (fetchError) {
      throw new Error(`Payment not found: ${fetchError.message}`);
    }

    if (payment.status === "completed") {
      throw new Error(
        "Cannot refund a completed payment through escrow. Use Stripe refund instead."
      );
    }

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "refunded",
        settled_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (updateError) {
      throw new Error(`Failed to refund escrow: ${updateError.message}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to refund escrow");
  }
}
