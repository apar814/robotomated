import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function makeSupabase(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "RSP-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request: NextRequest) {
  const supabase = makeSupabase(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the RSP profile
  const { data: rsp, error: rspError } = await (supabase as any)
    .from("robot_service_providers")
    .select("id, referral_code, referral_count")
    .eq("user_id", user.id)
    .single();

  if (rspError || !rsp) {
    return NextResponse.json({ error: "RSP profile not found" }, { status: 404 });
  }

  // Get referrals list
  const { data: referrals, error: refError } = await (supabase as any)
    .from("rsp_referrals")
    .select(`
      id,
      status,
      reward_amount,
      created_at,
      qualified_at,
      paid_at,
      referred_id
    `)
    .eq("referrer_id", rsp.id)
    .order("created_at", { ascending: false });

  if (refError) {
    console.error("[rsp-referrals] Fetch error:", refError);
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
  }

  // Enrich referrals with company names
  const enriched = [];
  for (const ref of referrals || []) {
    const { data: referred } = await (supabase as any)
      .from("robot_service_providers")
      .select("company_name")
      .eq("id", ref.referred_id)
      .single();

    enriched.push({
      ...ref,
      company_name: referred?.company_name || "Unknown",
    });
  }

  const qualified = (referrals || []).filter((r: any) => r.status === "qualified").length;
  const paid = (referrals || []).filter((r: any) => r.status === "paid").length;

  return NextResponse.json({
    referral_code: rsp.referral_code,
    referral_count: rsp.referral_count || 0,
    qualified_count: qualified,
    paid_count: paid,
    total_earned: paid * 500,
    referrals: enriched,
  });
}

export async function POST(request: NextRequest) {
  const supabase = makeSupabase(request);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { action } = body;

  if (action !== "generate-code") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the RSP profile
  const { data: rsp, error: rspError } = await (supabase as any)
    .from("robot_service_providers")
    .select("id, referral_code")
    .eq("user_id", user.id)
    .single();

  if (rspError || !rsp) {
    return NextResponse.json({ error: "RSP profile not found" }, { status: 404 });
  }

  if (rsp.referral_code) {
    return NextResponse.json({ referral_code: rsp.referral_code });
  }

  // Generate a unique code with retry
  let code = generateReferralCode();
  let attempts = 0;

  while (attempts < 5) {
    const { error: updateError } = await (supabase as any)
      .from("robot_service_providers")
      .update({ referral_code: code })
      .eq("id", rsp.id);

    if (!updateError) {
      return NextResponse.json({ referral_code: code }, { status: 201 });
    }

    // Unique constraint violation — regenerate
    code = generateReferralCode();
    attempts++;
  }

  return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 });
}
