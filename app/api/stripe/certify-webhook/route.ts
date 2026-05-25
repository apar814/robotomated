import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { sendCertEnrollmentEmail } from "@/lib/email/templates/certify";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET_CERT;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[certify-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const meta = session.metadata || {};

  if (meta.product_type !== "cert_enrollment") {
    return NextResponse.json({ received: true });
  }

  const userId = meta.supabase_user_id;
  const certificationId = meta.certification_id;
  const certSlug = meta.certification_slug;

  if (!userId || !certificationId || !certSlug) {
    console.error("[certify-webhook] missing metadata", { userId, certificationId, certSlug });
    return NextResponse.json({ error: "Missing required metadata" }, { status: 400 });
  }

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  if (!paymentIntentId) {
    console.warn("[certify-webhook] no payment_intent on session, acking", session.id);
    return NextResponse.json({ received: true, skipped: "no_payment_intent" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient() as any;

  const { data: existing } = await supabase
    .from("rco_payments")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  const customer = session.customer_details;
  const amountDollars = session.amount_total ? session.amount_total / 100 : 0;

  const { error: insertError } = await supabase.from("rco_payments").insert({
    user_id: userId,
    certification_id: certificationId,
    payer_name: customer?.name || "Unknown",
    payer_email: customer?.email || "",
    paid_by: "self",
    stripe_payment_intent_id: paymentIntentId,
    amount: amountDollars,
    currency: session.currency || "usd",
    status: "completed",
  });

  if (insertError) {
    console.error("[certify-webhook] payment insert failed:", insertError);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }

  if (customer?.email) {
    sendCertEnrollmentEmail({
      to: customer.email,
      payerName: customer.name || "there",
      certSlug,
      certificationId,
    }).catch((err) =>
      console.error("[certify-webhook] enrollment email failed:", err)
    );
  }

  return NextResponse.json({ received: true });
}
