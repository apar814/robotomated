import { RSS_FEEDS, type RawFeedItem } from "./rss-feeds";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Minimal RSS/Atom XML parser using regex — no external dependencies.
 * Handles common RSS 2.0 and Atom feed formats.
 */
function parseXml(xml: string, sourceName: string, filter?: string): RawFeedItem[] {
  const items: RawFeedItem[] = [];

  // Match <item>...</item> (RSS) or <entry>...</entry> (Atom)
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = extractTag(block, "title");
    const link = extractLink(block);
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "published") || extractTag(block, "updated") || "";
    const description = extractTag(block, "description") || extractTag(block, "summary") || "";
    const content = extractTag(block, "content:encoded") || extractTag(block, "content") || description;

    if (!title || !link) continue;

    // Apply keyword filter if specified
    if (filter) {
      const text = `${title} ${description} ${content}`.toLowerCase();
      if (!text.includes(filter.toLowerCase())) continue;
    }

    items.push({ title: cleanHtml(title), link, pubDate, description: cleanHtml(description), content: cleanHtml(content), sourceName });
  }

  return items;
}

function extractTag(block: string, tag: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = block.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(regex);
  return m ? m[1].trim() : "";
}

function extractLink(block: string): string {
  // RSS: <link>URL</link>
  const linkTag = extractTag(block, "link");
  if (linkTag && linkTag.startsWith("http")) return linkTag;

  // Atom: <link href="URL" />
  const atomLink = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (atomLink) return atomLink[1];

  return linkTag;
}

function cleanHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch all RSS feeds and return new items not yet in the database.
 */
export async function fetchNewItems(): Promise<RawFeedItem[]> {
  const supabase = createServerClient();

  // Get existing URLs to deduplicate
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase.from("news_items") as any)
    .select("url");

  const existingUrls = new Set(((existing as { url: string }[] | null) || []).map((r: { url: string }) => r.url));

  const allItems: RawFeedItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { "User-Agent": "Robotomated/1.0 (robotics intelligence)" },
      });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const xml = await res.text();
      const items = parseXml(xml, feed.name, feed.filter);

      for (const item of items) {
        if (!existingUrls.has(item.link)) {
          allItems.push(item);
          existingUrls.add(item.link); // prevent cross-feed dupes
        }
      }
    } catch {
      // Feed unavailable — skip silently
      console.warn(`Feed fetch failed: ${feed.name}`);
    }
  }

  return allItems;
}
