import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { isPro, getPriceAlertCount, PRO_LIMITS } from "@/lib/stripe/pro";

export async function POST(request: NextRequest) {
  const { robot_id, email, target_price } = await request.json();

  if (!robot_id || !email || !target_price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (typeof target_price !== "number" || target_price <= 0) {
    return NextResponse.json({ error: "Invalid target price" }, { status: 400 });
  }

  // Check alert limit for free users
  const authSupabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await authSupabase.auth.getUser();
  const userIsPro = user ? await isPro(user.id) : false;

  if (!userIsPro) {
    const alertCount = await getPriceAlertCount(email.toLowerCase().trim());
    if (alertCount >= PRO_LIMITS.free.priceAlerts) {
      return NextResponse.json(
        { error: "Free tier limited to 3 price alerts. Upgrade to Pro for unlimited.", upgrade: true },
        { status: 429 }
      );
    }
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("price_alerts").insert({
    robot_id,
    email: email.toLowerCase().trim(),
    target_price,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Alert already set for this robot" });
    }
    console.error("Price alert error:", error);
    return NextResponse.json({ error: "Failed to set alert" }, { status: 500 });
  }

  return NextResponse.json({ message: "Price alert created" });
}
