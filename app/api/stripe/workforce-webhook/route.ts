import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { sendStudentWelcomeEmail } from "@/lib/email/templates/workforce";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata || {};

    // Only handle operator-level-1 payments
    if (meta.product !== "operator-level-1") {
      return NextResponse.json({ received: true });
    }

    const { supabase_user_id, cohort_id, tier } = meta;
    if (!supabase_user_id || !cohort_id) {
      return NextResponse.json({ received: true });
    }

    const supabase = createServerClient();

    // Create enrollment record
    const { error: insertError } = await supabase
      .from("certification_enrollments")
      .insert({
        user_id: supabase_user_id,
        cohort_id,
        tier: tier || "standard",
        amount_paid_cents: session.amount_total,
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        payment_status: "paid",
      });

    if (insertError) {
      console.error("Failed to create enrollment:", insertError);
      return NextResponse.json(
        { error: "Failed to create enrollment" },
        { status: 500 }
      );
    }

    // Update cohort enrolled count
    const { data: cohort } = await supabase
      .from("cohorts")
      .select("enrolled_count, capacity")
      .eq("id", cohort_id)
      .single();

    if (cohort) {
      const newCount = cohort.enrolled_count + 1;
      await supabase
        .from("cohorts")
        .update({
          enrolled_count: newCount,
          status: newCount >= cohort.capacity ? "full" : "open",
        })
        .eq("id", cohort_id);
    }

    // Send Day 0 welcome email
    const { data: userProfile } = await supabase
      .from("users")
      .select("email")
      .eq("id", supabase_user_id)
      .single()
      .returns<{ email: string }>();

    if (userProfile?.email) {
      sendStudentWelcomeEmail(userProfile.email, 0).catch((err) =>
        console.error("Failed to send welcome email:", err)
      );
    }
  }

  return NextResponse.json({ received: true });
}
