import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, amazon_asin, price_current")
    .not("amazon_asin", "is", null)
    .eq("status", "active");

  const withASIN = (robots || []).filter((r) => r.amazon_asin);
  let updated = 0;

  for (const robot of withASIN) {
    // TODO: Replace with actual Amazon PA-API call
    // For now, skip — prices will be updated when API access is approved
    const newPrice = null;

    if (newPrice !== null && newPrice !== robot.price_current) {
      await supabase
        .from("price_history")
        .insert({ robot_id: robot.id, retailer: "amazon", price: newPrice, currency: "USD" });

      await supabase
        .from("robots")
        .update({ price_current: newPrice })
        .eq("id", robot.id);

      updated++;
    }
  }

  return NextResponse.json({
    processed: withASIN.length,
    updated,
    timestamp: new Date().toISOString(),
  });
}
