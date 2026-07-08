import type { RawNewsItem } from "@/lib/news/types";
import { SOURCE_CAPS } from "@/lib/news/types";

/**
 * Reddit official API (OAuth2 client-credentials): r/robotics top posts of
 * the day. ~2 requests/day, far inside the free 100 QPM tier.
 *
 * Degrades to [] with a warn when credentials are absent (they are added to
 * Vercel env by hand — see REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET /
 * REDDIT_USER_AGENT). Throws on HTTP errors so Inngest step retries apply.
 */

interface RedditPost {
  data: {
    title: string;
    url: string;
    permalink: string;
    is_self: boolean;
    stickied: boolean;
    created_utc: number;
  };
}

export async function fetchRedditTopDaily(): Promise<RawNewsItem[]> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT ?? "robotomated-news/1.0";
  if (!clientId || !clientSecret) {
    console.warn("[news] REDDIT_CLIENT_ID/SECRET not set — skipping Reddit");
    return [];
  }

  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(15_000),
  });
  if (!tokenRes.ok) throw new Error(`Reddit token request failed: ${tokenRes.status}`);
  const { access_token: token } = (await tokenRes.json()) as { access_token?: string };
  if (!token) throw new Error("Reddit token response had no access_token");

  const cap = SOURCE_CAPS["Reddit r/robotics"];
  const listRes = await fetch(`https://oauth.reddit.com/r/robotics/top?t=day&limit=${cap}`, {
    headers: { Authorization: `Bearer ${token}`, "User-Agent": userAgent },
    signal: AbortSignal.timeout(15_000),
  });
  if (!listRes.ok) throw new Error(`Reddit listing failed: ${listRes.status}`);

  const body = (await listRes.json()) as { data?: { children?: RedditPost[] } };
  return (body.data?.children ?? [])
    .filter((p) => !p.data.stickied)
    .slice(0, cap)
    .map((p) => ({
      title: p.data.title.trim(),
      // Link posts point at the external article; self posts at the thread.
      url: p.data.is_self ? `https://www.reddit.com${p.data.permalink}` : p.data.url,
      source: "Reddit r/robotics",
      publishedAt: new Date(p.data.created_utc * 1000).toISOString(),
    }));
}
