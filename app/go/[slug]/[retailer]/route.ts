import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { appendAffiliateTag } from "@/lib/commerce/affiliate";

interface RobotRow {
  id: string;
  affiliate_url: string | null;
  manufacturers: { website: string | null } | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; retailer: string }> }
) {
  const { slug, retailer } = await params;
  const supabase = createServerClient();

  // Fetch robot
  const { data: robot } = await supabase
    .from("robots")
    .select("id, affiliate_url, manufacturers(website)")
    .eq("slug", slug)
    .single()
    .returns<RobotRow>();

  if (!robot) {
    return NextResponse.redirect(new URL("/explore", request.url));
  }

  // Determine destination URL
  let destinationUrl = robot.affiliate_url || "";
  if (!destinationUrl && retailer === "manufacturer") {
    destinationUrl = (robot.manufacturers as { website: string | null } | null)?.website || "";
  }

  if (!destinationUrl) {
    return NextResponse.redirect(new URL(`/explore/all/${slug}`, request.url));
  }

  // Append affiliate tag
  const taggedUrl = appendAffiliateTag(destinationUrl, retailer);

  // Log the click
  const sessionId = request.cookies.get("session_id")?.value || request.headers.get("x-forwarded-for") || "anonymous";

  await supabase.from("affiliate_clicks").insert({
    robot_id: robot.id,
    retailer,
    session_id: sessionId,
    referrer: request.headers.get("referer") || null,
  });

  return NextResponse.redirect(taggedUrl, { status: 301 });
}
