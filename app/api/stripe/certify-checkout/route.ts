import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { CERT_STRIPE_PRICES } from "@/lib/certifications";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug, seats } = body as { slug: string; seats?: number };

  const cert = CERT_STRIPE_PRICES[slug];
  if (!cert) {
    return NextResponse.json({ error: "Invalid certification level" }, { status: 400 });
  }

  // Get user from auth
  const supabaseResponse = NextResponse.json({});
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const adminSupabase = createServerClient();

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

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Calculate quantity and discount for team purchases
  const qty = Math.max(1, Math.min(seats || 1, 100));
  let unitAmount = cert.price;
  if (qty >= 25) unitAmount = Math.round(cert.price * 0.7); // 30% off
  else if (qty >= 10) unitAmount = Math.round(cert.price * 0.8); // 20% off
  else if (qty >= 5) unitAmount = Math.round(cert.price * 0.9); // 10% off

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: cert.name,
            description: `${qty > 1 ? `${qty} seats — ` : ""}Access to exam, study materials, and digital credential upon passing.`,
          },
          unit_amount: unitAmount,
        },
        quantity: qty,
      },
    ],
    success_url: `${origin}/certify/${slug}?enrolled=true`,
    cancel_url: `${origin}/certify/${slug}?canceled=true`,
    metadata: {
      supabase_user_id: user.id,
      certification_slug: slug,
      seats: String(qty),
    },
  });

  return NextResponse.json({ url: session.url });
}
