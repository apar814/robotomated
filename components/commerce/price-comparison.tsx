import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { RETAILER_META } from "@/lib/commerce/affiliate";

interface PriceEntry {
  retailer: string;
  price: number;
  currency: string;
}

interface PriceComparisonProps {
  robotSlug: string;
  prices: PriceEntry[];
  affiliateUrl: string | null;
  manufacturerWebsite: string | null;
}

export function PriceComparison({ robotSlug, prices, affiliateUrl, manufacturerWebsite }: PriceComparisonProps) {
  // Deduplicate by retailer, keep lowest price
  const byRetailer = new Map<string, PriceEntry>();
  for (const p of prices) {
    const existing = byRetailer.get(p.retailer);
    if (!existing || p.price < existing.price) {
      byRetailer.set(p.retailer, p);
    }
  }

  // If no price history entries, build from affiliate_url
  if (byRetailer.size === 0 && affiliateUrl) {
    // Guess retailer from URL
    const url = affiliateUrl.toLowerCase();
    if (url.includes("amazon")) byRetailer.set("amazon", { retailer: "amazon", price: 0, currency: "USD" });
    else if (url.includes("bestbuy")) byRetailer.set("bestbuy", { retailer: "bestbuy", price: 0, currency: "USD" });
    else byRetailer.set("manufacturer", { retailer: "manufacturer", price: 0, currency: "USD" });
  }

  if (manufacturerWebsite && !byRetailer.has("manufacturer")) {
    byRetailer.set("manufacturer", { retailer: "manufacturer", price: 0, currency: "USD" });
  }

  const entries = Array.from(byRetailer.values()).sort((a, b) => {
    if (a.price === 0 && b.price === 0) return 0;
    if (a.price === 0) return 1;
    if (b.price === 0) return -1;
    return a.price - b.price;
  });

  const lowestPrice = entries.find((e) => e.price > 0)?.price;

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-navy-light">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold">Where to Buy</h3>
      </div>
      <div className="divide-y divide-border">
        {entries.map((entry) => {
          const meta = RETAILER_META[entry.retailer] || { name: entry.retailer, domain: "" };
          const isBest = entry.price > 0 && entry.price === lowestPrice && entries.filter((e) => e.price > 0).length > 1;

          return (
            <div key={entry.retailer} className="flex items-center gap-4 px-5 py-3">
              {/* Retailer icon placeholder */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-lighter text-[13px] font-bold uppercase text-muted">
                {meta.name.slice(0, 2)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{meta.name}</span>
                  {isBest && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[13px] font-semibold text-white">
                      Best Price
                    </span>
                  )}
                </div>
                {meta.domain && <p className="text-[13px] text-muted">{meta.domain}</p>}
              </div>

              {entry.price > 0 && (
                <span className="font-mono text-sm font-semibold">
                  ${entry.price.toLocaleString()}
                </span>
              )}

              <Link
                href={`/api/out/${robotSlug}?ref=price-comparison&pos=${entry.retailer}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90",
                  isBest ? "bg-white text-navy" : "bg-white/5 text-white"
                )}
              >
                Buy at {meta.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
