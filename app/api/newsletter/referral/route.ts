import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/newsletter/referral?code=XXXXXXXX
 * Redirects to newsletter signup page with referral tracking.
 *
 * POST /api/newsletter/referral
 * Body: { email, referral_code? }
 * Subscribes a new user via the referral flow.
 *
 * Note: referral_code, referral_count, and referred_by columns
 * must be added via migration (scripts/add-referral-codes.ts).
 * Until then, referrals are tracked via source="referral".
 */

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/newsletter", request.url));
  }
  return NextResponse.redirect(new URL(`/newsletter?ref=${code}`, request.url));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body.email;
  const referralCode = body.referral_code || null;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const cleanEmail = email.toLowerCase().trim();

  // Subscribe with source tracking
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: cleanEmail,
      source: referralCode ? "referral" : "newsletter",
    });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Already subscribed!" });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  // If referral columns exist, try to credit the referrer
  if (referralCode) {
    try {
      // This will silently fail if referral columns don't exist yet
      const { data: referrer } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("referral_code" as string, referralCode)
        .single();

      if (referrer) {
        // Log referral for manual processing until migration adds referral_count
        console.log(`[REFERRAL] ${cleanEmail} referred by code ${referralCode} (referrer: ${referrer.id})`);
      }
    } catch {
      // Referral columns not yet migrated — subscription still succeeded
    }
  }

  return NextResponse.json({ message: "Subscribed! Check your inbox Monday." });
}
