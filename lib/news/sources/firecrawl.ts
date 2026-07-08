import type { RawNewsItem } from "@/lib/news/types";
import { SOURCE_CAPS } from "@/lib/news/types";

/**
 * Firecrawl-based listing scrapers. One /v1/scrape call per source per day
 * with an LLM-extract schema — Firecrawl handles JS rendering and layout
 * drift, we get back a clean article list.
 *
 * Failure contract: throws on HTTP/parse errors so the Inngest step's
 * bounded exponential-backoff retries apply. Callers catch after final
 * retry and continue with the remaining sources.
 */

const FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v1/scrape";

const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    articles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          published_at: { type: "string", description: "ISO 8601 date if visible, else empty" },
        },
        required: ["title", "url"],
      },
    },
  },
  required: ["articles"],
};

interface FirecrawlSource {
  source: keyof typeof SOURCE_CAPS;
  listingUrl: string;
}

export const FIRECRAWL_SOURCES: FirecrawlSource[] = [
  { source: "The Robot Report", listingUrl: "https://www.therobotreport.com/category/news/" },
  { source: "IEEE Spectrum", listingUrl: "https://spectrum.ieee.org/topic/robotics/" },
  { source: "TechCrunch", listingUrl: "https://techcrunch.com/tag/robotics/" },
];

interface ExtractedArticle {
  title?: string;
  url?: string;
  published_at?: string;
}

export async function fetchFirecrawlSource({ source, listingUrl }: FirecrawlSource): Promise<RawNewsItem[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.warn(`[news] FIRECRAWL_API_KEY not set — skipping ${source}`);
    return [];
  }

  const res = await fetch(FIRECRAWL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: listingUrl,
      formats: ["extract"],
      onlyMainContent: true,
      timeout: 30000,
      extract: {
        schema: EXTRACT_SCHEMA,
        prompt:
          "Extract the news articles listed on this page. For each: the headline, the absolute article URL, and the publication date as ISO 8601 if shown. Skip navigation, ads, and category links.",
      },
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    throw new Error(`Firecrawl ${source} responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const body = (await res.json()) as { success?: boolean; data?: { extract?: { articles?: ExtractedArticle[] } } };
  const articles = body.data?.extract?.articles ?? [];

  return articles
    .filter((a): a is Required<Pick<ExtractedArticle, "title" | "url">> & ExtractedArticle =>
      Boolean(a.title && a.url?.startsWith("http")))
    .slice(0, SOURCE_CAPS[source])
    .map((a) => ({
      title: a.title.trim(),
      url: a.url,
      source,
      publishedAt: a.published_at && !Number.isNaN(Date.parse(a.published_at))
        ? new Date(a.published_at).toISOString()
        : null,
    }));
}
