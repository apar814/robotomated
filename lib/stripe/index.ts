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

/**
 * Stripe key mode, detected from the configured secret key prefix
 * (sk_live_/rk_live_ = live; sk_test_/rk_test_ = test). Customer IDs are
 * mode-scoped — a cus_ created in test mode does not exist in live mode —
 * so persisting one across modes breaks the user's first real checkout.
 */
export function stripeKeyMode(): "test" | "live" {
  return /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "")
    ? "live"
    : "test";
}

/** Expected mode for this runtime: production is live, everything else test. */
export function expectedStripeMode(): "test" | "live" {
  return process.env.NODE_ENV === "production" ? "live" : "test";
}

/**
 * Gate for writing stripe_customer_id to a user profile. Refuses (with a
 * warning) when the key mode doesn't match the runtime — e.g. a test-mode
 * key running under NODE_ENV=production, or vice versa. Checkout still
 * works on refusal; the customer id simply isn't persisted.
 */
export function canPersistStripeCustomerId(): boolean {
  const mode = stripeKeyMode();
  const expected = expectedStripeMode();
  if (mode !== expected) {
    console.warn(
      `[stripe] refusing to persist customer id: key mode '${mode}' does not match expected '${expected}' for NODE_ENV=${process.env.NODE_ENV}`
    );
    return false;
  }
  return true;
}

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
