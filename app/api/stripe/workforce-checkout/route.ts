import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createUntypedServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

const EARLY_BIRD_PRICE = 39900; // $399 in cents
const STANDARD_PRICE = 59900; // $599 in cents
const EARLY_BIRD_LIMIT = 10;

export async function POST(request: NextRequest) {
  // Get user from auth
  const supabaseResponse = NextResponse.json({});
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const adminSupabase = createUntypedServerClient();

  // Get the active open cohort
  const { data: cohort } = await adminSupabase
    .from("cohorts")
    .select("id, slug, enrolled_count, capacity")
    .eq("status", "open")
    .order("start_date", { ascending: true })
    .limit(1)
    .single();

  if (!cohort) {
    return NextResponse.json(
      { error: "No cohorts currently accepting enrollments" },
      { status: 400 }
    );
  }

  if (cohort.enrolled_count >= cohort.capacity) {
    return NextResponse.json({ error: "Cohort is full" }, { status: 400 });
  }

  // Check if already enrolled
  const { data: existing } = await adminSupabase
    .from("certification_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("cohort_id", cohort.id)
    .eq("payment_status", "paid")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: "Already enrolled in this cohort" },
      { status: 400 }
    );
  }

  // Determine pricing
  const isEarlyBird = cohort.enrolled_count < EARLY_BIRD_LIMIT;
  const price = isEarlyBird ? EARLY_BIRD_PRICE : STANDARD_PRICE;
  const tier = isEarlyBird ? "early_bird" : "standard";
  const productName = isEarlyBird
    ? "RCO Operator Level 1 — Early Bird"
    : "RCO Operator Level 1";

  // Get or create Stripe customer
  const { data: profile } = await adminSupabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()
    .returns<{ stripe_customer_id: string | null }>();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await adminSupabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            description:
              "4-week hybrid certification program. 10 hrs/week. Includes placement assistance.",
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/certification/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/certification/operator-level-1?canceled=true`,
    metadata: {
      supabase_user_id: user.id,
      cohort_id: cohort.id,
      product: "operator-level-1",
      tier,
    },
  });

  return NextResponse.json({ url: session.url });
}
