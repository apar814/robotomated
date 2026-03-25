import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getFirecrawl } from "@/lib/firecrawl";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  summary: string;
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
  const cacheKey = `news_${slug}`;

  // Check cache (24hr TTL)
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
      `${robot.name} ${mfrName} 2025 2026`,
      { limit: 10 }
    );

    const webResults = (results.web || []) as { url: string; title?: string; description?: string }[];
    const news: NewsItem[] = webResults
      .filter((r) => r.url && r.title)
      .slice(0, 6)
      .map((r) => ({
        title: r.title || "",
        url: r.url,
        source: new URL(r.url).hostname.replace("www.", ""),
        summary: r.description || "",
      }));

    const data = { news };
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("robot_content_cache").upsert(
      { robot_slug: slug, cache_key: cacheKey, data, expires_at: expiresAt },
      { onConflict: "cache_key" }
    ).catch(() => {});

    return NextResponse.json(data);
  } catch (err) {
    console.error("News fetch error:", err);
    return NextResponse.json({ news: [] });
  }
}
