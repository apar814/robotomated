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

export const revalidate = 1800;

interface IntelItem {
  id?: string;
  title: string;
  url: string;
  source_name?: string;
  source?: string;
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
      sb.from("news_items").select("*").order("published_at", { ascending: false }).limit(30),
      sb.from("funding_rounds").select("*").order("announced_at", { ascending: false }).limit(10),
    ]);
    const items = (itemsResult.data || []) as IntelItem[];
    const funding = (fundingResult.data || []) as FundingRound[];
    if (items.length > 0) return { items, funding, fromDb: true };
    return { items: SEED_ITEMS as unknown as IntelItem[], funding: [] as FundingRound[], fromDb: false };
  } catch {
    return { items: SEED_ITEMS as unknown as IntelItem[], funding: [] as FundingRound[], fromDb: false };
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

/* Category badge inline styles for proper rendering */
function getCategoryStyle(cat: string): React.CSSProperties {
  switch (cat) {
    case "funding":
      return { background: "rgba(37,99,235,0.2)", color: "#60A5FA", border: "1px solid rgba(37,99,235,0.35)" };
    case "product":
      return { background: "rgba(34,197,94,0.15)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.3)" };
    case "market":
      return { background: "rgba(245,158,11,0.15)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.3)" };
    case "research":
      return { background: "rgba(168,85,247,0.15)", color: "#C084FC", border: "1px solid rgba(168,85,247,0.3)" };
    case "regulation":
      return { background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(239,68,68,0.3)" };
    case "partnership":
      return { background: "rgba(34,197,94,0.15)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.3)" };
    case "brief":
      return { background: "rgba(255,255,255,0.1)", color: "#F0F4FF", border: "1px solid rgba(255,255,255,0.2)" };
    default:
      return { background: "rgba(255,255,255,0.05)", color: "rgba(240,244,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" };
  }
}

/* ── Section header with extending line ── */
function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
      <span
        style={{
          fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
          fontWeight: 700,
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#60A5FA",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(37,99,235,0.4), transparent)" }} />
    </div>
  );
}

export default async function IntelligencePage() {
  const { items, funding } = await getIntelligenceData();

  const featured = items.filter((i) => i.is_featured);
  const standard = items.filter((i) => !i.is_featured);
  const totalFunding = funding.reduce((sum, r) => sum + (r.amount_usd || 0), 0);

  // Tag frequency for trending
  const tagCounts: Record<string, number> = {};
  items.forEach((i) => (i.tags || []).forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const trendingTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Manufacturer mentions
  const mfrCounts: Record<string, number> = {};
  items.forEach((i) => (i.manufacturers_mentioned || []).forEach((m) => { mfrCounts[m] = (mfrCounts[m] || 0) + 1; }));
  const trendingMfrs = Object.entries(mfrCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ background: "linear-gradient(180deg, #030310 0%, #02020A 100%)" }}>

      {/* ═══ HERO ═══ */}
      <section
        className="border-b border-white/[0.06] px-4 py-16 sm:py-20"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 60%), #02020A",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Intelligence", href: "/intelligence" },
            ]}
          />

          <h1
            className="mt-6 font-display"
            style={{ fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#F0F4FF", letterSpacing: "-0.03em" }}
          >
            Robotics Intelligence
          </h1>
          <p
            className="mt-3 max-w-xl"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1.05rem", color: "rgba(240,244,255,0.65)", lineHeight: 1.6 }}
          >
            Funding moves. Product launches. Market signals. Updated every 2 hours.
          </p>
          <p
            className="mt-2"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.78rem", color: "rgba(240,244,255,0.4)" }}
          >
            Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>

          {/* Stat pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              `${items.length} signals this week`,
              `${funding.length} funding rounds`,
              `Updated ${timeAgo(items[0]?.published_at || new Date().toISOString())}`,
            ].map((pill) => (
              <span
                key={pill}
                className="rounded-full px-3.5 py-1.5"
                style={{
                  border: "1px solid rgba(37,99,235,0.25)",
                  background: "rgba(37,99,235,0.08)",
                  color: "#60A5FA",
                  fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER SIGNUP ═══ */}
      <section className="border-b border-white/[0.06] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div
            className="rounded-xl sm:flex sm:items-center sm:justify-between"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 100%)",
              border: "1px solid rgba(37,99,235,0.25)",
              borderLeft: "3px solid #2563EB",
              padding: "1.75rem 2rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#60A5FA",
                }}
              >
                The Automation Intelligence Brief
              </p>
              <p
                className="mt-1.5"
                style={{ fontWeight: 500, fontSize: "0.95rem", color: "rgba(240,244,255,0.75)" }}
              >
                Every Monday. 500 words. The only robotics email worth reading.
              </p>
              <p
                className="mt-0.5"
                style={{ fontWeight: 500, fontSize: "0.82rem", color: "rgba(240,244,255,0.45)" }}
              >
                Join 2,400+ operations leaders and robotics professionals.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:w-80">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">

          {/* LEFT — Feed (2/3) */}
          <div className="min-w-0 flex-1 lg:flex-[2]">

            {/* Featured items */}
            {featured.length > 0 && (
              <div className="mb-10">
                <SectionHeader label="Featured" />
                <div className="space-y-4">
                  {featured.slice(0, 5).map((item) => (
                    <article
                      key={item.url}
                      className="rounded-[10px] transition-all duration-200 hover:border-[rgba(37,99,235,0.25)]"
                      style={{
                        background: "linear-gradient(160deg, rgba(10,12,26,0.9) 0%, rgba(6,8,18,0.95) 100%)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10,
                        padding: "1.5rem",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                      }}
                    >
                      {/* Row 1: Category + source */}
                      <div className="flex items-center justify-between">
                        <span
                          className="rounded-full px-2.5 py-0.5"
                          style={{ ...getCategoryStyle(item.category), fontSize: "0.72rem", fontWeight: 700 }}
                        >
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "rgba(240,244,255,0.35)" }}>
                          {item.source_name || item.source} &middot; {timeAgo(item.published_at)}
                        </span>
                      </div>

                      {/* Row 2: Headline */}
                      <h3
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#F0F4FF",
                          lineHeight: 1.35,
                          marginTop: "0.6rem",
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Row 3: Summary */}
                      <p
                        className="line-clamp-3"
                        style={{
                          fontWeight: 500,
                          fontSize: "0.88rem",
                          color: "rgba(240,244,255,0.6)",
                          lineHeight: 1.65,
                          marginTop: "0.4rem",
                        }}
                      >
                        {item.summary}
                      </p>

                      {/* Row 4: What this means */}
                      {item.what_it_means && (
                        <div
                          style={{
                            background: "rgba(37,99,235,0.06)",
                            borderLeft: "2px solid #2563EB",
                            padding: "0.6rem 0.85rem",
                            marginTop: "0.75rem",
                            borderRadius: "0 6px 6px 0",
                          }}
                        >
                          <p style={{ fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#2563EB" }}>
                            Signal
                          </p>
                          <p style={{ fontWeight: 500, fontSize: "0.82rem", color: "rgba(240,244,255,0.7)", lineHeight: 1.6, marginTop: "0.15rem" }}>
                            {item.what_it_means}
                          </p>
                        </div>
                      )}

                      {/* Row 5: Tags + read more */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {(item.tags || []).slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full px-2 py-0.5"
                              style={{ border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.72rem", color: "rgba(240,244,255,0.35)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-[#60A5FA]"
                          style={{ fontWeight: 600, fontSize: "0.75rem", color: "rgba(240,244,255,0.3)" }}
                        >
                          Read more &rarr;
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Standard items */}
            {standard.length > 0 && (
              <div>
                <SectionHeader label="All Signals" />
                <div className="space-y-3">
                  {standard.map((item) => (
                    <article
                      key={item.url}
                      className="transition-all duration-200 hover:border-[rgba(37,99,235,0.25)]"
                      style={{
                        background: "linear-gradient(160deg, rgba(10,12,26,0.9) 0%, rgba(6,8,18,0.95) 100%)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10,
                        padding: "1.5rem",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                      }}
                    >
                      {/* Row 1: Category + source */}
                      <div className="flex items-center justify-between">
                        <span
                          className="rounded-full px-2.5 py-0.5"
                          style={{ ...getCategoryStyle(item.category), fontSize: "0.72rem", fontWeight: 700 }}
                        >
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "rgba(240,244,255,0.3)" }}>
                          {item.source_name || item.source} &middot; {timeAgo(item.published_at)}
                        </span>
                      </div>

                      {/* Headline */}
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#F0F4FF",
                          lineHeight: 1.35,
                          marginTop: "0.6rem",
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p
                        className="line-clamp-3"
                        style={{
                          fontWeight: 500,
                          fontSize: "0.88rem",
                          color: "rgba(240,244,255,0.6)",
                          lineHeight: 1.65,
                          marginTop: "0.4rem",
                        }}
                      >
                        {item.summary}
                      </p>

                      {/* What this means */}
                      {item.what_it_means && (
                        <div
                          style={{
                            background: "rgba(37,99,235,0.06)",
                            borderLeft: "2px solid #2563EB",
                            padding: "0.6rem 0.85rem",
                            marginTop: "0.75rem",
                            borderRadius: "0 6px 6px 0",
                          }}
                        >
                          <p style={{ fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#2563EB" }}>
                            Signal
                          </p>
                          <p style={{ fontWeight: 500, fontSize: "0.82rem", color: "rgba(240,244,255,0.7)", lineHeight: 1.6, marginTop: "0.15rem" }}>
                            {item.what_it_means}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-2.5 flex justify-end">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-[#60A5FA]"
                          style={{ fontWeight: 600, fontSize: "0.75rem", color: "rgba(240,244,255,0.3)" }}
                        >
                          Read more &rarr;
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Sidebar (1/3) */}
          <div className="w-full space-y-6 lg:w-80 lg:flex-[1]">

            {/* Ask Robotimus */}
            <div
              className="rounded-[10px]"
              style={{
                background: "linear-gradient(145deg, rgba(14,18,38,0.95) 0%, rgba(8,10,20,0.98) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "1.5rem",
              }}
            >
              <p style={{ fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#60A5FA" }}>
                Ask About This Feed
              </p>
              <p className="mt-2" style={{ fontSize: "0.85rem", color: "rgba(240,244,255,0.6)", lineHeight: 1.6 }}>
                Robotimus can analyze any story, explain its market implications, or connect it to robots in our database.
              </p>
              <Link
                href="/advisor"
                className="mt-4 block rounded-lg py-2.5 text-center transition-opacity hover:opacity-90"
                style={{ background: "#2563EB", fontWeight: 700, fontSize: "0.82rem", color: "#F0F4FF" }}
              >
                Ask Robotimus
              </Link>
            </div>

            {/* This Week in Funding */}
            {funding.length > 0 && (
              <div
                className="rounded-[10px]"
                style={{
                  background: "linear-gradient(145deg, rgba(14,18,38,0.95) 0%, rgba(8,10,20,0.98) 100%)",
                  border: "1px solid rgba(37,99,235,0.2)",
                  borderLeft: "3px solid #2563EB",
                  padding: "1.5rem",
                  boxShadow: "inset 0 1px 0 rgba(37,99,235,0.06)",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#60A5FA" }}>
                  This Week in Funding
                </p>
                <p
                  className="mt-2"
                  style={{ fontFamily: "var(--font-brand)", fontWeight: 700, fontSize: "1.4rem", color: "#2563EB", textShadow: "0 0 30px rgba(37,99,235,0.3)" }}
                >
                  {formatAmount(totalFunding)}
                </p>
                <p style={{ fontSize: "0.78rem", color: "rgba(240,244,255,0.45)" }}>
                  raised across {funding.length} rounds this week
                </p>
                <div className="mt-4 space-y-3">
                  {funding.slice(0, 5).map((r) => (
                    <div key={r.announced_at + r.company} className="border-t border-white/[0.06] pt-2.5">
                      <div className="flex items-center justify-between">
                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F0F4FF" }}>{r.company}</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 700, color: "#2563EB" }}>
                          {formatAmount(r.amount_usd)}
                        </p>
                      </div>
                      {r.round_type && (
                        <span
                          className="mt-1 inline-block rounded-full px-2 py-0.5"
                          style={{ fontSize: "0.65rem", fontWeight: 600, background: "rgba(37,99,235,0.12)", color: "#60A5FA", border: "1px solid rgba(37,99,235,0.25)" }}
                        >
                          {r.round_type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Manufacturers */}
            {trendingMfrs.length > 0 && (
              <div
                className="rounded-[10px]"
                style={{
                  background: "linear-gradient(145deg, rgba(10,12,26,0.9) 0%, rgba(6,8,18,0.95) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "1.5rem",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#60A5FA" }}>
                  Trending Manufacturers
                </p>
                <div className="mt-3 space-y-2">
                  {trendingMfrs.map(([mfr, count]) => (
                    <div key={mfr} className="flex items-center justify-between">
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(240,244,255,0.8)" }}>{mfr}</span>
                      <span className="flex items-center gap-2">
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(240,244,255,0.35)" }}>
                          {count} mentions
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Topics */}
            {trendingTags.length > 0 && (
              <div
                className="rounded-[10px]"
                style={{
                  background: "linear-gradient(145deg, rgba(10,12,26,0.9) 0%, rgba(6,8,18,0.95) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "1.5rem",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#60A5FA" }}>
                  Trending Topics
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trendingTags.map(([tag, count]) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                      style={{ border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "rgba(240,244,255,0.4)" }}
                    >
                      {tag}
                      <span style={{ fontFamily: "var(--font-mono)", color: "#2563EB", fontSize: "0.72rem" }}>{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
