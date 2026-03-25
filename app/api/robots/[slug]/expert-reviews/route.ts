import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getFirecrawl } from "@/lib/firecrawl";

interface ExpertReview {
  source: string;
  url: string;
  title: string;
  insight: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: robot } = await supabase
    .from("robots").select("name, manufacturers(name)")
    .eq("slug", slug).single();

  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const mfrName = (robot.manufacturers as { name: string } | null)?.name || "";
  const cacheKey = `expert_reviews_${slug}`;

  // Check cache (table may not exist yet)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cached } = await (supabase as any)
      .from("robot_content_cache").select("data, expires_at")
      .eq("cache_key", cacheKey).single() as { data: { data: unknown; expires_at: string } | null };

    if (cached && new Date(cached.expires_at) > new Date()) {
      return NextResponse.json(cached.data);
    }
  } catch { /* cache table doesn't exist yet */ }

  try {
    const firecrawl = getFirecrawl();
    const results = await firecrawl.search(
      `"${robot.name}" ${mfrName} review expert analysis`,
      { limit: 8 }
    );

    const credibleDomains = [
      "ieee.org", "spectrum.ieee.org", "therobotreport.com",
      "techcrunch.com", "wired.com", "engadget.com",
      "technologyreview.com", "standardbots.com", "qviro.com",
    ];

    const webResults = (results.web || []) as { url: string; title?: string; description?: string }[];
    const reviews: ExpertReview[] = webResults
      .filter((r) => r.url && credibleDomains.some(d => r.url.includes(d)))
      .slice(0, 5)
      .map((r) => ({
        source: new URL(r.url).hostname.replace("www.", ""),
        url: r.url,
        title: r.title || "",
        insight: r.description || "",
      }));

    const data = { reviews };
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("robot_content_cache").upsert(
      { robot_slug: slug, cache_key: cacheKey, data, expires_at: expiresAt },
      { onConflict: "cache_key" }
    ).catch(() => {});

    return NextResponse.json(data);
  } catch (err) {
    console.error("Expert review fetch error:", err);
    return NextResponse.json({ reviews: [] });
  }
}
