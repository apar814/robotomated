import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { anthropic, ADVISOR_MODEL } from "@/lib/ai/claude";

function verifyCron(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
}

const RSS_FEEDS = [
  { url: "https://www.therobotreport.com/feed/", source: "The Robot Report" },
  { url: "https://spectrum.ieee.org/feeds/topic/robotics.rss", source: "IEEE Spectrum" },
  { url: "https://roboticsandautomationnews.com/feed/", source: "Robotics & Automation News" },
];

const CATEGORIES = ["warehouse", "manufacturing", "medical", "agricultural", "construction", "delivery", "drone", "consumer", "funding", "policy", "research"];

async function fetchRss(feedUrl: string): Promise<RssItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "Robotomated News Bot/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    // Simple RSS XML parsing
    const items: RssItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || block.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
      const description = block.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || "";
      if (title && link) {
        items.push({ title: title.trim(), link: link.trim(), pubDate, description: description.slice(0, 500) });
      }
    }
    return items.slice(0, 10); // Max 10 per feed
  } catch {
    return [];
  }
}

async function summarizeAndCategorize(title: string, description: string): Promise<{ summary: string; category: string }> {
  try {
    const res = await anthropic.messages.create({
      model: ADVISOR_MODEL,
      max_tokens: 150,
      messages: [{
        role: "user",
        content: `Summarize this robotics news article in exactly 2 sentences. Then categorize it.

Title: ${title}
Description: ${description}

Respond in this exact JSON format:
{"summary":"Two sentence summary here.","category":"one of: ${CATEGORIES.join(", ")}"}`,
      }],
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "";
    const json = JSON.parse(text);
    return { summary: json.summary || title, category: json.category || "research" };
  } catch {
    return { summary: description.slice(0, 200) || title, category: "research" };
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  let totalNew = 0;

  for (const feed of RSS_FEEDS) {
    const items = await fetchRss(feed.url);

    for (const item of items) {
      // Skip if URL already exists
      const { data: existing } = await supabase
        .from("news_items")
        .select("id")
        .eq("url", item.link)
        .single();
      if (existing) continue;

      const { summary, category } = await summarizeAndCategorize(item.title, item.description || "");

      const { error } = await supabase.from("news_items").insert({
        title: item.title,
        url: item.link,
        source: feed.source,
        summary,
        category,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      });

      if (!error) totalNew++;
    }
  }

  return NextResponse.json({ message: "News aggregated", new_items: totalNew });
}
