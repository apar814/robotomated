import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { SEED_ITEMS } from "@/lib/intelligence/seed-data";

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * One-time seed route for intelligence feed.
 * POST /api/intelligence/seed with CRON_SECRET header.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  let inserted = 0;
  let skipped = 0;

  for (const item of SEED_ITEMS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("news_items") as any).insert({
      title: item.title,
      url: item.url,
      source: item.source_name,
      summary: item.summary,
      what_it_means: item.what_it_means,
      published_at: item.published_at,
      category: item.category,
      sentiment: item.sentiment,
      relevance_score: item.relevance_score,
      robots_mentioned: item.robots_mentioned,
      manufacturers_mentioned: item.manufacturers_mentioned,
      tags: item.tags,
      is_featured: item.is_featured,
      processed_at: new Date().toISOString(),
    });

    if (error) {
      skipped++; // likely duplicate URL
    } else {
      inserted++;
    }
  }

  return NextResponse.json({ inserted, skipped, total: SEED_ITEMS.length });
}
