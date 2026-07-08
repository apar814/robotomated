import { inngest } from "@/inngest/client";
import { createUntypedServerClient } from "@/lib/supabase/server";
import { FIRECRAWL_SOURCES, fetchFirecrawlSource } from "@/lib/news/sources/firecrawl";
import { fetchRedditTopDaily } from "@/lib/news/sources/reddit";
import { summarizeAndTag } from "@/lib/news/summarize";
import { urlHash } from "@/lib/news/normalize";
import type { RawNewsItem } from "@/lib/news/types";

const DAILY_ITEM_BUDGET = 100;

/**
 * Daily robotics news ingestion.
 *
 * Failure posture: each fetch step gets Inngest's bounded exponential-backoff
 * retries (function retries: 2 — no unbounded loops); a source that still
 * fails is dropped with a warn and the run continues. Summarization degrades
 * per-batch to title+"other". Storage upserts ignore duplicates.
 */
export const ingestNews = inngest.createFunction(
  {
    id: "ingest-news",
    retries: 2,
    triggers: [{ cron: "0 6 * * *" }], // daily 06:00 UTC — same slot the rss-v1 cron used
  },
  async ({ step }) => {
    // 1. FETCH — one step per source; a failed source never kills the run
    const perSource = await Promise.all([
      ...FIRECRAWL_SOURCES.map((src) =>
        step
          .run(`fetch-${src.source.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, () => fetchFirecrawlSource(src))
          .catch((err): RawNewsItem[] => {
            console.warn(`[news] ${src.source} failed after retries — skipped: ${err}`);
            return [];
          })
      ),
      step.run("fetch-reddit-r-robotics", () => fetchRedditTopDaily()).catch((err): RawNewsItem[] => {
        console.warn(`[news] Reddit failed after retries — skipped: ${err}`);
        return [];
      }),
    ]);
    const fetched = perSource.flat().slice(0, DAILY_ITEM_BUDGET);

    // 2. DEDUPE — drop items whose normalized-URL hash (or raw URL) is already stored
    const fresh = await step.run("dedupe", async () => {
      if (fetched.length === 0) return [];
      const hashes = fetched.map((item) => urlHash(item.url));
      const supabase = createUntypedServerClient();
      const { data, error } = await supabase
        .from("news_items")
        .select("url, url_hash")
        .or(`url_hash.in.(${hashes.join(",")}),url.in.(${fetched.map((i) => `"${i.url}"`).join(",")})`);
      if (error) throw new Error(`dedupe query failed: ${error.message}`);

      const known = new Set<string>();
      for (const row of data ?? []) {
        if (row.url_hash) known.add(row.url_hash);
        if (row.url) known.add(urlHash(row.url));
      }
      const seenThisRun = new Set<string>();
      return fetched.filter((item) => {
        const h = urlHash(item.url);
        if (known.has(h) || seenThisRun.has(h)) return false;
        seenThisRun.add(h);
        return true;
      });
    });

    // 3. SUMMARIZE + TAG — batched Claude calls, per-batch fallback
    const enriched = await step.run("summarize-and-tag", () => summarizeAndTag(fresh));

    // 4. STORE — upsert on url_hash, duplicates ignored
    const stored = await step.run("store", async () => {
      if (enriched.length === 0) return 0;
      const supabase = createUntypedServerClient();
      const { error, count } = await supabase.from("news_items").upsert(
        enriched.map((item) => ({
          title: item.title,
          url: item.url,
          url_hash: item.urlHash,
          source: item.source,
          summary: item.summary,
          category: item.category,
          published_at: item.publishedAt,
          ingested_by: "inngest-v2",
        })),
        { onConflict: "url_hash", ignoreDuplicates: true, count: "exact" }
      );
      if (error) throw new Error(`store failed: ${error.message}`);
      return count ?? enriched.length;
    });

    return {
      fetched: fetched.length,
      afterDedupe: fresh.length,
      stored,
      bySource: Object.fromEntries(perSource.map((items, i) => [items[0]?.source ?? `source-${i}`, items.length])),
    };
  }
);
