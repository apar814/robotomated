/** Affiliate tag configuration — reads from env vars */
export const AFFILIATE_TAGS = {
  amazon: process.env.AMAZON_ASSOCIATE_TAG || "robotomated-20",
  bestbuy: process.env.IMPACT_BESTBUY_TAG || "",
  bh: process.env.IMPACT_BH_TAG || "",
  manufacturer: "",
} as const;

export type Retailer = keyof typeof AFFILIATE_TAGS;

export const RETAILER_META: Record<string, { name: string; domain: string }> = {
  amazon: { name: "Amazon", domain: "amazon.com" },
  bestbuy: { name: "Best Buy", domain: "bestbuy.com" },
  bh: { name: "B&H Photo", domain: "bhphotovideo.com" },
  manufacturer: { name: "Manufacturer Direct", domain: "" },
};

/**
 * Append affiliate tag to a URL based on retailer.
 */
export function appendAffiliateTag(url: string, retailer: string): string {
  if (!url) return url;

  try {
    const u = new URL(url);

    switch (retailer) {
      case "amazon":
        u.searchParams.set("tag", AFFILIATE_TAGS.amazon);
        break;
      case "bestbuy":
        if (AFFILIATE_TAGS.bestbuy) {
          u.searchParams.set("irclickid", AFFILIATE_TAGS.bestbuy);
        }
        break;
      case "bh":
        if (AFFILIATE_TAGS.bh) {
          u.searchParams.set("BI", AFFILIATE_TAGS.bh);
        }
        break;
    }

    return u.toString();
  } catch {
    return url;
  }
}
