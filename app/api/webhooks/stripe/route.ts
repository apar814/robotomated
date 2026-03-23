import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const customerId = session.customer as string;

      if (userId) {
        // Get subscription details
        const subscriptionId = session.subscription as string;
        let endsAt: string | null = null;

        if (subscriptionId) {
          const subResponse = await stripe.subscriptions.retrieve(subscriptionId);
          const sub = subResponse as unknown as { current_period_end: number };
          endsAt = new Date(sub.current_period_end * 1000).toISOString();
        }

        await supabase
          .from("users")
          .update({
            subscription_tier: "pro" as const,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_ends_at: endsAt,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription & { current_period_end: number };
      const customerId = sub.customer as string;

      const tier = sub.status === "active" || sub.status === "trialing" ? "pro" : "free";
      const endsAt = new Date(sub.current_period_end * 1000).toISOString();

      await supabase
        .from("users")
        .update({
          subscription_tier: tier as "pro" | "free",
          subscription_ends_at: endsAt,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      await supabase
        .from("users")
        .update({
          subscription_tier: "free" as const,
          stripe_subscription_id: null,
          subscription_ends_at: null,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
