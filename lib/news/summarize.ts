import { anthropic, ADVISOR_MODEL } from "@/lib/ai/claude";
import { urlHash } from "@/lib/news/normalize";
import { NEWS_CATEGORIES, type EnrichedNewsItem, type NewsCategory, type RawNewsItem } from "@/lib/news/types";

/**
 * Batch summarize + classify. One Claude call per batch of ≤20 items.
 * Malformed or missing classifications degrade to a title-derived summary
 * and category "other" — enrichment problems never fail the run.
 */

const BATCH_SIZE = 20;

interface ClassifiedItem {
  index: number;
  summary: string;
  category: string;
}

function fallbackEnrich(item: RawNewsItem): EnrichedNewsItem {
  return { ...item, urlHash: urlHash(item.url), summary: item.title, category: "other" };
}

function asCategory(value: string): NewsCategory {
  return (NEWS_CATEGORIES as readonly string[]).includes(value) ? (value as NewsCategory) : "other";
}

async function summarizeBatch(items: RawNewsItem[]): Promise<EnrichedNewsItem[]> {
  const listing = items
    .map((item, i) => `${i}. [${item.source}] ${item.title} (${item.url})`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: ADVISOR_MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are tagging robotics news for an industry intelligence platform.

For EACH numbered item below, produce:
- "summary": 1-2 factual sentences based on the headline (no hype, no speculation beyond the title)
- "category": exactly one of ${JSON.stringify(NEWS_CATEGORIES)}
  (humanoid = humanoid robots; amr = autonomous mobile robots / warehouse; arm = industrial or collaborative arms; policy = regulation, standards, safety rules; funding = raises, M&A, IPOs; other = everything else)

Items:
${listing}

Reply with ONLY a JSON array: [{"index": 0, "summary": "...", "category": "..."}, ...]`,
      },
    ],
  });

  const text = response.content[0]?.type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("no JSON array in classification response");
  const classified = JSON.parse(jsonMatch[0]) as ClassifiedItem[];
  const byIndex = new Map(classified.map((c) => [c.index, c]));

  return items.map((item, i) => {
    const c = byIndex.get(i);
    if (!c?.summary) return fallbackEnrich(item);
    return {
      ...item,
      urlHash: urlHash(item.url),
      summary: c.summary.trim(),
      category: asCategory(c.category),
    };
  });
}

export async function summarizeAndTag(items: RawNewsItem[]): Promise<EnrichedNewsItem[]> {
  const enriched: EnrichedNewsItem[] = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    try {
      enriched.push(...(await summarizeBatch(batch)));
    } catch (err) {
      console.warn(`[news] summarize batch ${i / BATCH_SIZE} degraded to fallback: ${err}`);
      enriched.push(...batch.map(fallbackEnrich));
    }
  }
  return enriched;
}
