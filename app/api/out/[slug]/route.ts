import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { appendAffiliateTag } from "@/lib/commerce/affiliate";

interface RobotRow {
  id: string;
  slug: string;
  affiliate_url: string | null;
  manufacturers: { website: string | null } | null;
  robot_categories: { slug: string } | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: robot } = await supabase
    .from("robots")
    .select("id, slug, affiliate_url, manufacturers(website), robot_categories(slug)")
    .eq("slug", slug)
    .single()
    .returns<RobotRow>();

  if (!robot) {
    return NextResponse.redirect(new URL("/explore", request.url), 302);
  }

  const mfrWebsite = (robot.manufacturers as { website: string | null } | null)?.website;
  const destinationUrl = robot.affiliate_url || mfrWebsite || null;

  // Determine retailer for affiliate tagging
  const pos = request.nextUrl.searchParams.get("pos") || "direct";
  let retailer = "manufacturer";
  if (destinationUrl) {
    const lower = destinationUrl.toLowerCase();
    if (lower.includes("amazon")) retailer = "amazon";
    else if (lower.includes("bestbuy")) retailer = "bestbuy";
    else if (lower.includes("bhphoto")) retailer = "bh";
  }

  // Log click (fire-and-forget)
  const sessionId =
    request.cookies.get("session_id")?.value ||
    request.headers.get("x-forwarded-for") ||
    "anonymous";

  supabase
    .from("affiliate_clicks")
    .insert({
      robot_id: robot.id,
      retailer: `${retailer}:${pos}`,
      session_id: sessionId,
      referrer: request.headers.get("referer") || null,
    })
    .then(() => {});

  if (destinationUrl) {
    const taggedUrl = appendAffiliateTag(destinationUrl, retailer);
    return NextResponse.redirect(taggedUrl, 302);
  }

  // Fallback: redirect to product page
  const catSlug = (robot.robot_categories as { slug: string } | null)?.slug || "all";
  return NextResponse.redirect(
    new URL(`/explore/${catSlug}/${robot.slug}`, request.url),
    302
  );
}
