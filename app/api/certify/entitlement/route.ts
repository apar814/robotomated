import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

/**
 * GET /api/certify/entitlement?slug=foundation
 * Polled by the post-checkout banner while the Stripe webhook lands.
 * Returns { authenticated, enrolled } — never an error status for the
 * not-yet-enrolled case, so the client can poll without special-casing.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const supabaseResponse = NextResponse.json({});
  const userSupabase = createSSRClient(
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

  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, enrolled: false });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient() as any;

  const { data: cert } = await supabase
    .from("rco_certifications")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!cert) {
    return NextResponse.json({ authenticated: true, enrolled: false });
  }

  const { data: payment } = await supabase
    .from("rco_payments")
    .select("id")
    .eq("user_id", user.id)
    .eq("certification_id", cert.id)
    .eq("status", "completed")
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ authenticated: true, enrolled: !!payment });
}
