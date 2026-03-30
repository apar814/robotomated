import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { appendAffiliateTag } from "@/lib/commerce/affiliate";

export async function POST(request: NextRequest) {
  let body: { robot_id?: string; robot_slug?: string; affiliate_url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { robot_id, robot_slug, affiliate_url } = body;

  if (!robot_id || !affiliate_url) {
    return NextResponse.json(
      { error: "robot_id and affiliate_url are required" },
      { status: 400 }
    );
  }

  // Validate affiliate_url is a real URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(affiliate_url);
  } catch {
    return NextResponse.json({ error: "Invalid affiliate_url" }, { status: 400 });
  }

  // Determine retailer from URL
  const host = parsedUrl.hostname.toLowerCase();
  let retailer = "manufacturer";
  if (host.includes("amazon")) retailer = "amazon";
  else if (host.includes("bestbuy")) retailer = "bestbuy";
  else if (host.includes("bhphoto")) retailer = "bh";

  const supabase = createServerClient();

  const sessionId =
    request.cookies.get("session_id")?.value ||
    request.headers.get("x-forwarded-for") ||
    "anonymous";

  // Record the click
  const { error } = await supabase.from("affiliate_clicks").insert({
    robot_id,
    retailer: `${retailer}:${robot_slug || "unknown"}`,
    session_id: sessionId,
    referrer: request.headers.get("referer") || null,
  });

  if (error) {
    console.error("Affiliate click tracking error:", error.message);
    // Still return the redirect URL even if tracking fails
  }

  const redirectUrl = appendAffiliateTag(affiliate_url, retailer);

  return NextResponse.json({ redirect_url: redirectUrl });
}
