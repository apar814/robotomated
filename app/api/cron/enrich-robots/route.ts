import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

function verifyCron(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

/**
 * Weekly robot enrichment cron.
 * Finds robots with low data quality and enriches via Firecrawl.
 * Schedule: Sundays via Vercel Cron.
 */
export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY;

  if (!FIRECRAWL_KEY) {
    return NextResponse.json({ error: "FIRECRAWL_API_KEY not set" }, { status: 500 });
  }

  // Find robots missing key data
  const { data: robots } = await supabase
    .from("robots")
    .select("id, name, slug, affiliate_url, description_short, description_long, images, price_msrp, specs")
    .is("description_long", null)
    .limit(10);

  if (!robots || robots.length === 0) {
    return NextResponse.json({ ok: true, message: "No robots need enrichment", enriched: 0 });
  }

  let enriched = 0;
  const errors: string[] = [];

  for (const robot of robots) {
    if (!robot.affiliate_url) continue;

    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FIRECRAWL_KEY}`,
        },
        body: JSON.stringify({
          url: robot.affiliate_url,
          formats: ["markdown"],
        }),
      });

      if (!res.ok) {
        errors.push(`${robot.name}: Firecrawl returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      const markdown = data.data?.markdown || "";

      if (markdown.length < 100) continue;

      const updates: Record<string, unknown> = {};

      if (!robot.description_long || robot.description_long.length < 50) {
        const cleaned = markdown
          .replace(/^#.*$/gm, "")
          .replace(/\[.*?\]\(.*?\)/g, "")
          .replace(/\n{2,}/g, "\n")
          .trim()
          .slice(0, 500);
        if (cleaned.length > 50) {
          updates.description_long = cleaned;
        }
      }

      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString();
        await supabase.from("robots").update(updates).eq("id", robot.id);
        enriched++;
      }
    } catch (err) {
      errors.push(`${robot.name}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    ok: true,
    checked: robots.length,
    enriched,
    errors: errors.length > 0 ? errors : undefined,
  });
}
