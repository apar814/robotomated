import Stripe from "stripe";

// Guard: a live-mode key outside production means local dev can charge real
// cards. Fail loudly at startup instead.
if (
  process.env.NODE_ENV !== "production" &&
  process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")
) {
  throw new Error(
    "Refusing to start: STRIPE_SECRET_KEY is a live-mode key (sk_live) outside production. Use your sk_test key in .env.local."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
