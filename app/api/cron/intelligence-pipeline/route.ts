import { NextRequest, NextResponse } from "next/server";
import { fetchNewItems } from "@/lib/intelligence/rss-parser";
import { ingestItems } from "@/lib/intelligence/ai-processor";

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Automated intelligence pipeline.
 * Fetches RSS feeds, processes new items through AI, stores in database.
 * Designed to run every 2 hours via Vercel Cron.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 1: Fetch new items from all RSS feeds
    const newItems = await fetchNewItems();

    if (newItems.length === 0) {
      return NextResponse.json({
        status: "ok",
        message: "No new items found",
        fetched: 0,
        processed: 0,
        errors: 0,
      });
    }

    // Step 2: Limit to 10 items per run to control API costs
    const itemsToProcess = newItems.slice(0, 10);

    // Step 3: Process through AI pipeline
    const result = await ingestItems(itemsToProcess);

    return NextResponse.json({
      status: "ok",
      fetched: newItems.length,
      processed: result.processed,
      errors: result.errors,
      skipped: Math.max(0, newItems.length - 10),
    });
  } catch (err) {
    console.error("Intelligence pipeline error:", err);
    return NextResponse.json(
      { status: "error", error: String(err) },
      { status: 500 }
    );
  }
}
