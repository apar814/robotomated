import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { createServerClient } from "@/lib/supabase/server";
import { SEED_ITEMS } from "@/lib/intelligence/seed-data";

export const metadata: Metadata = {
  title: "Robotics Intelligence Feed | Robotomated",
  description:
    "Funding moves. Product launches. Market signals. The data that drives automation decisions. Updated every 2 hours.",
};

export const revalidate = 1800; // revalidate every 30 minutes

interface IntelItem {
  id?: string;
  title: string;
  url: string;
  source_name?: string;
  source?: string; // DB column name
  summary: string;
  what_it_means: string | null;
  published_at: string;
  category: string;
  sentiment: string;
  relevance_score: number;
  manufacturers_mentioned: string[];
  tags: string[];
  is_featured: boolean;
}

interface FundingRound {
  id?: string;
  company: string;
  company_slug: string | null;
  amount_usd: number | null;
  round_type: string | null;
  investors_list: string[];
  summary: string | null;
  what_it_means: string | null;
  announced_at: string;
}

async function getIntelligenceData() {
  try {
    const supabase = createServerClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const [itemsResult, fundingResult] = await Promise.all([
      sb
        .from("news_items")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(30),
      sb
        .from("funding_rounds")
        .select("*")
        .order("announced_at", { ascending: false })
        .limit(10),
    ]);

    const items = (itemsResult.data || []) as IntelItem[];
    const funding = (fundingResult.data || []) as FundingRound[];

    // If DB has items, use them
    if (items.length > 0) {
      return { items, funding, fromDb: true };
    }

    // Fallback to seed data
    return {
      items: SEED_ITEMS as unknown as IntelItem[],
      funding: [] as FundingRound[],
      fromDb: false,
    };
  } catch {
    // DB unavailable — use seed data
    return {
      items: SEED_ITEMS as unknown as IntelItem[],
      funding: [] as FundingRound[],
      fromDb: false,
    };
  }
}

function formatAmount(usd: number | null): string {
  if (!usd) return "Undisclosed";
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(0)}M`;
  return `$${usd.toLocaleString()}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

const CATEGORY_LABELS: Record<string, string> = {
  funding: "Funding",
  product: "Product",
  research: "Research",
  regulation: "Policy",
  market: "Market",
  partnership: "Partnership",
  brief: "Weekly Brief",
};

const CATEGORY_COLORS: Record<string, string> = {
  funding: "text-[#00E5A0] bg-[#00E5A0]/10 border-[#00E5A0]/20",
  product: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20",
  research: "text-[#7B2FFF] bg-[#7B2FFF]/10 border-[#7B2FFF]/20",
  regulation: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  market: "text-white/70 bg-white/5 border-white/10",
  partnership: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20",
  brief: "text-white bg-white/10 border-white/20",
};

export default async function IntelligencePage() {
  const { items, funding } = await getIntelligenceData();

  const featured = items.filter((i) => i.is_featured);
  const standard = items.filter((i) => !i.is_featured);
  const totalFunding = funding.reduce((sum, r) => sum + (r.amount_usd || 0), 0);

  // Tag frequency for trending
  const tagCounts: Record<string, number> = {};
  items.forEach((i) => (i.tags || []).forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const trendingTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div style={{ background: "#080808" }}>
      {/* Hero */}
      <section className="border-b border-white/[0.06] px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Intelligence", href: "/intelligence" },
            ]}
          />
          <h1
            className="mt-6 font-display font-bold tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
          >
            Robotics Intelligence
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/40">
            Funding moves. Product launches. Market signals. Updated every 2 hours.
          </p>
          <p className="mt-2 font-mono text-[13px] text-white/45">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </section>

      {/* Subscribe */}
      <section className="border-b border-white/[0.06] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-[#2563EB]/15 bg-[#2563EB]/[0.03] p-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Get the weekly brief in your inbox</p>
              <p className="mt-0.5 text-xs text-white/50">Every Monday. 500 words. The only robotics email worth reading.</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:w-80">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Left column — feed */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Featured items */}
            {featured.length > 0 && (
              <div className="space-y-4">
                <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
                  [ FEATURED ]
                </p>
                {featured.slice(0, 5).map((item) => (
                  <article
                    key={item.url}
                    className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[13px] font-semibold ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.market}`}>
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="text-[13px] text-white/45">{item.source_name || item.source}</span>
                      <span className="text-[13px] text-white/30">{timeAgo(item.published_at)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">{item.summary}</p>
                    {item.what_it_means && (
                      <div className="mt-3 rounded-lg border border-[#2563EB]/10 bg-[#2563EB]/[0.03] px-4 py-3">
                        <p className="text-[13px] font-semibold uppercase tracking-wider text-[#2563EB]">What this means</p>
                        <p className="mt-1 text-sm text-white/60">{item.what_it_means}</p>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(item.tags || []).map((tag) => (
                        <span key={tag} className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[13px] text-white/45">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Standard items */}
            {standard.length > 0 && (
              <div className="space-y-3">
                <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-white/50">
                  [ ALL SIGNALS ]
                </p>
                {standard.map((item) => (
                  <article
                    key={item.url}
                    className="rounded-lg border border-white/[0.04] bg-[#0A0A0A] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[13px] font-semibold ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.market}`}>
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-xs text-white/35 line-clamp-2">{item.summary}</p>
                        <p className="mt-1.5 text-[13px] text-white/30">
                          {item.source_name || item.source} &middot; {timeAgo(item.published_at)}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[13px] text-white/28">
                        {item.relevance_score}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-full space-y-6 lg:w-72">
            {/* Funding summary */}
            {funding.length > 0 && (
              <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-5">
                <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-[#00E5A0]">
                  This Week in Funding
                </p>
                <p className="mt-2 font-[family-name:var(--font-brand)] text-2xl font-bold text-[#00E5A0]">
                  {formatAmount(totalFunding)}
                </p>
                <p className="text-[13px] text-white/45">raised across {funding.length} rounds</p>
                <div className="mt-4 space-y-3">
                  {funding.slice(0, 5).map((r) => (
                    <div key={r.announced_at + r.company} className="border-t border-white/[0.04] pt-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-white">{r.company}</p>
                        <p className="font-mono text-xs font-bold text-[#2563EB]">{formatAmount(r.amount_usd)}</p>
                      </div>
                      {r.round_type && (
                        <p className="text-[13px] text-white/45">{r.round_type}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending topics */}
            {trendingTags.length > 0 && (
              <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-5">
                <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-white/50">
                  Trending Topics
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trendingTags.map(([tag, count]) => (
                    <span key={tag} className="flex items-center gap-1 rounded-full border border-white/[0.06] px-2.5 py-1 text-[13px] text-white/40">
                      {tag}
                      <span className="font-mono text-[#2563EB]">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Robotimus CTA */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-5">
              <p className="text-sm font-semibold text-white">Questions about this week?</p>
              <p className="mt-1 text-xs text-white/50">Robotimus can analyze any item in this feed.</p>
              <Link
                href="/advisor"
                className="mt-3 block rounded-lg bg-[#2563EB] px-4 py-2.5 text-center text-xs font-semibold text-black transition-opacity hover:opacity-90"
              >
                Ask Robotimus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
