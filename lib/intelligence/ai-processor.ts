import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase/server";
import type { RawFeedItem } from "./rss-feeds";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a senior robotics industry analyst writing for Bloomberg Terminal. Your job is to process raw news items and extract structured intelligence. Be precise, dense, and factual. Never use: groundbreaking, revolutionary, game-changing, innovative, exciting. Always use: specific dollar amounts, specific dates, specific company names, specific technical claims.`;

interface ProcessedItem {
  title: string;
  summary: string;
  what_it_means: string;
  category: string;
  sentiment: string;
  relevance_score: number;
  robots_mentioned: string[];
  manufacturers_mentioned: string[];
  tags: string[];
  is_funding_round: boolean;
  funding_amount_usd: number | null;
  funding_round_type: string | null;
  funding_investors: string[] | null;
}

/**
 * Process a single raw feed item through Claude to extract structured intelligence.
 */
export async function processItem(item: RawFeedItem): Promise<ProcessedItem | null> {
  const inputText = `Title: ${item.title}\nSource: ${item.sourceName}\nDate: ${item.pubDate}\n\nContent:\n${item.content.slice(0, 3000)}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Process this robotics news item and return ONLY valid JSON (no markdown, no backticks):
{
  "title": "string (cleaned, max 100 chars)",
  "summary": "string (exactly 2 sentences, Bloomberg voice, dense with facts)",
  "what_it_means": "string (exactly 1 sentence, specific market implication)",
  "category": "funding" | "product" | "research" | "regulation" | "market" | "partnership",
  "sentiment": "positive" | "negative" | "neutral",
  "relevance_score": number (0-100, where 100 = critical robotics industry intelligence),
  "robots_mentioned": ["robot model names found in text"],
  "manufacturers_mentioned": ["company names"],
  "tags": ["max 5 tags from: humanoid/warehouse/medical/agricultural/autonomous/manufacturing/funding/regulation/consumer/industrial"],
  "is_funding_round": boolean,
  "funding_amount_usd": number | null,
  "funding_round_type": "seed" | "series-a" | "series-b" | "series-c" | "growth" | "ipo" | null,
  "funding_investors": ["investor names"] | null
}

News item:
${inputText}`,
        },
      ],
    });

    const text = (response.content[0] as { type: string; text: string }).text;

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as ProcessedItem;
  } catch (err) {
    console.error("AI processing failed:", err);
    return null;
  }
}

/**
 * Ingest a batch of raw items: process with AI and store in database.
 */
export async function ingestItems(items: RawFeedItem[]): Promise<{ processed: number; errors: number }> {
  const supabase = createServerClient();
  let processed = 0;
  let errors = 0;

  for (const item of items) {
    try {
      const result = await processItem(item);
      if (!result) {
        errors++;
        continue;
      }

      // Store in news_items (intelligence_items)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase.from("news_items") as any).insert({
        title: result.title,
        url: item.link,
        source: item.sourceName,
        summary: result.summary,
        what_it_means: result.what_it_means,
        full_content: item.content.slice(0, 10000),
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        category: result.category,
        sentiment: result.sentiment,
        relevance_score: result.relevance_score,
        robots_mentioned: result.robots_mentioned,
        manufacturers_mentioned: result.manufacturers_mentioned,
        tags: result.tags,
        is_featured: result.relevance_score >= 80,
        processed_at: new Date().toISOString(),
      });

      if (insertError) {
        // Likely duplicate URL
        errors++;
        continue;
      }

      // If funding round, also insert into funding_rounds
      if (result.is_funding_round && result.funding_amount_usd) {
        // Try to match company to our manufacturer database
        const companyName = result.manufacturers_mentioned[0] || "";
        let companySlug: string | null = null;

        if (companyName) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: mfr } = await (supabase as any)
            .from("manufacturers")
            .select("slug")
            .ilike("name", `%${companyName}%`)
            .limit(1)
            .single();

          if (mfr) companySlug = (mfr as { slug: string }).slug;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("funding_rounds") as any).insert({
          company: companyName,
          company_slug: companySlug,
          amount_usd: result.funding_amount_usd,
          round_type: result.funding_round_type,
          investors_list: result.funding_investors || [],
          announced_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          source_url: item.link,
          summary: result.summary,
          what_it_means: result.what_it_means,
          category: "funding",
        });
      }

      processed++;
    } catch {
      errors++;
    }
  }

  return { processed, errors };
}
