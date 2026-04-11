import { NextRequest, NextResponse } from "next/server";
import { ingestItems } from "@/lib/intelligence/ai-processor";
import type { RawFeedItem } from "@/lib/intelligence/rss-feeds";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  // Verify internal access
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items } = (await request.json()) as { items: RawFeedItem[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Process in batches of 5 to avoid rate limits
    const batchSize = 5;
    let totalProcessed = 0;
    let totalErrors = 0;

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const result = await ingestItems(batch);
      totalProcessed += result.processed;
      totalErrors += result.errors;
    }

    return NextResponse.json({
      processed: totalProcessed,
      errors: totalErrors,
      total: items.length,
    });
  } catch (err) {
    console.error("Ingest error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
