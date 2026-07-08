/** Item as fetched from a source, before enrichment */
export interface RawNewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string | null; // ISO string when the source provides it
}

/** Item after summarize + classify, ready for insert */
export interface EnrichedNewsItem extends RawNewsItem {
  urlHash: string;
  summary: string;
  category: NewsCategory;
}

export const NEWS_CATEGORIES = ["humanoid", "amr", "arm", "policy", "funding", "other"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/** Per-source fetch caps — total ≤ 95/day, under the 100/day budget */
export const SOURCE_CAPS = {
  "The Robot Report": 25,
  "IEEE Spectrum": 25,
  "TechCrunch": 20,
  "Reddit r/robotics": 25,
} as const;
