import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface IntelItem {
  title: string;
  summary: string;
  category: string;
  relevance_score: number;
  published_at: string;
}

/**
 * Generate the weekly robotics intelligence brief.
 * Called every Monday 6am EST via Vercel Cron.
 */
export async function generateWeeklyBrief(): Promise<{ title: string; content: string } | null> {
  const supabase = createServerClient();

  // Get top items from past 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const { data: topItems } = await sb
    .from("news_items")
    .select("title, summary, category, relevance_score, published_at")
    .gte("published_at", sevenDaysAgo.toISOString())
    .order("relevance_score", { ascending: false })
    .limit(10);

  // Get this week's funding rounds
  const { data: fundingRounds } = await sb
    .from("funding_rounds")
    .select("company, amount_usd, round_type, summary")
    .gte("announced_at", sevenDaysAgo.toISOString())
    .order("amount_usd", { ascending: false, nullsFirst: false })
    .limit(5);

  if (!topItems || topItems.length === 0) return null;

  const itemSummaries = ((topItems as IntelItem[] | null) || [])
    .map((item: IntelItem, i: number) => `${i + 1}. [${item.category}] ${item.title}: ${item.summary}`)
    .join("\n");

  const fundingSummaries = ((fundingRounds as { company: string; amount_usd: number | null; round_type: string | null }[] | null) || [])
    .map((r) => `- ${r.company}: $${r.amount_usd ? (r.amount_usd / 1_000_000).toFixed(0) + "M" : "undisclosed"} (${r.round_type || "unknown"})`)
    .join("\n");

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekLabel = `Week of ${weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: "You are a senior analyst at a top-tier investment bank covering robotics and deep tech. Write with Bloomberg Terminal density. Every sentence must contain a specific fact, number, or named entity. No fluff. No adjectives that don't carry information.",
      messages: [
        {
          role: "user",
          content: `Write a 500-word weekly robotics intelligence brief for "${weekLabel}".

Top developments this week:
${itemSummaries}

Funding activity:
${fundingSummaries || "No major funding announcements this week."}

Structure:
1. Opening market signal (1 paragraph — lead with the most important development)
2. Top 3 developments (3 paragraphs, one each)
3. One data point that changes how you think about the market
4. One prediction for the coming week

Return as JSON: { "title": "headline for the brief", "content": "the full 500-word brief as markdown" }`,
        },
      ],
    });

    const text = (response.content[0] as { type: string; text: string }).text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]) as { title: string; content: string };

    // Store the brief as a featured intelligence item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("news_items") as any).insert({
      title: `${weekLabel}: ${result.title}`,
      url: `/intelligence/briefs/${new Date().toISOString().split("T")[0]}`,
      source: "Robotomated Editorial",
      summary: result.content.split("\n\n")[0]?.slice(0, 300) || result.title,
      what_it_means: "Weekly analysis from Robotomated's intelligence team.",
      full_content: result.content,
      published_at: new Date().toISOString(),
      category: "brief",
      sentiment: "neutral",
      relevance_score: 95,
      robots_mentioned: [],
      manufacturers_mentioned: [],
      tags: ["weekly-brief"],
      is_featured: true,
      processed_at: new Date().toISOString(),
    });

    return result;
  } catch (err) {
    console.error("Weekly brief generation failed:", err);
    return null;
  }
}
