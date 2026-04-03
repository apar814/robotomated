import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { SocialProofStrip } from "@/components/ui/social-proof-strip";
import { HeroNetworkSvg } from "@/components/ui/hero-network-svg";
import { AdvisorCtaStrip } from "@/components/ui/advisor-cta-strip";
import { SectorCode, SECTOR_CODES } from "@/components/ui/sector-code";
import { HeroCounter } from "@/components/home/hero-counter";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { GuidedEntry } from "@/components/home/guided-entry";
import { RobotFinderCtaStrip } from "@/components/ui/robot-finder-cta";
import { CapabilityMap } from "@/components/home/capability-map";
import { NEWS_ARTICLES } from "@/lib/data/news";
import { RecentlyFunded } from "@/components/home/recently-funded";
import type { RobotCategory } from "@/lib/supabase/types";

interface FeaturedRobot {
  id: string; slug: string; name: string;
  robo_score: number | null; price_current: number | null; price_msrp: number | null;
  description_short: string | null; images: unknown; year_released: number | null;
  manufacturer_id: string; category_id: string;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string; name: string } | null;
}

async function getData() {
  const supabase = createServerClient();

  const categories = await cached<(RobotCategory & { robot_count: number })[]>("home:cats:v2", 3600, async () => {
    const { data: cats } = await supabase.from("robot_categories").select("*").order("display_order").returns<RobotCategory[]>();
    const { data: robots } = await supabase.from("robots").select("category_id").returns<{ category_id: string }[]>();
    const counts: Record<string, number> = {};
    robots?.forEach((r) => { counts[r.category_id] = (counts[r.category_id] || 0) + 1; });
    return (cats || []).map((c) => ({ ...c, robot_count: counts[c.id] || 0 }));
  });

  const { count: manufacturerCount } = await supabase
    .from("manufacturers")
    .select("id", { count: "exact", head: true });

  const trending = await cached<FeaturedRobot[]>("home:trending:v2", 1800, async () => {
    const { data } = await supabase
      .from("robots").select("id,slug,name,robo_score,price_current,price_msrp,description_short,images,year_released,manufacturer_id,category_id,manufacturers(name),robot_categories(slug,name)")
      .eq("status", "active").not("robo_score", "is", null)
      .order("robo_score", { ascending: false }).limit(30).returns<FeaturedRobot[]>();

    const pool = data || [];
    const picked: FeaturedRobot[] = [];
    const usedMfrs = new Set<string>();
    const usedCats = new Set<string>();

    for (const r of pool) {
      if (picked.length >= 8) break;
      if (usedMfrs.has(r.manufacturer_id)) continue;
      if (usedCats.has(r.category_id)) continue;
      picked.push(r);
      usedMfrs.add(r.manufacturer_id);
      usedCats.add(r.category_id);
    }

    for (const r of pool) {
      if (picked.length >= 8) break;
      if (usedMfrs.has(r.manufacturer_id)) continue;
      if (picked.some(p => p.id === r.id)) continue;
      picked.push(r);
      usedMfrs.add(r.manufacturer_id);
    }

    return picked;
  });

  const totalRobots = categories.reduce((s, c) => s + c.robot_count, 0);

  return { categories, trending, totalRobots, manufacturerCount: manufacturerCount || 0 };
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}`;
}

export default async function HomePage() {
  const { categories, trending, totalRobots, manufacturerCount } = await getData();

  const topNews = NEWS_ARTICLES.slice(0, 3);

  return (
    <div className="flex flex-col" style={{ background: "#080808" }}>

      {/* ══════════════════════════════════════════
          1. HERO — Clear value proposition
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-20 sm:py-24 lg:py-32">
        {/* Network background illustration */}
        <HeroNetworkSvg className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />

        {/* Content */}
        <div className="mx-auto max-w-7xl">
          {/* Section label */}
          <div className="flex items-center gap-3">
            <div className="h-px w-5 bg-[#0EA5E9]" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#0EA5E9]">
              The Operating System for Robotics
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-8 font-display font-extrabold leading-[1.05]"
            style={{
              fontSize: "clamp(48px, 6vw, 96px)",
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              textShadow: "0 0 80px rgba(200,255,0,0.15)",
            }}
          >
            The Operating System<br />
            for{" "}
            <span style={{ color: "#C8FF00" }}>
              Robotics
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="mt-8 max-w-[560px] font-sans leading-[1.6]"
            style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.7)" }}
          >
            Buy, lease, or hire robots. Deploy with certified operators.
            Manage your fleet. Sell when you{"'"}re ready. One platform.
            The entire robot lifecycle.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-bold tracking-[0.02em] text-black transition-all hover:-translate-y-0.5"
              style={{ background: "#0EA5E9" }}
            >
              Explore Robots
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/advisor"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Ask Robotimus
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS BAR
          ══════════════════════════════════════════ */}
      <section className="border-y border-white/[0.08] px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#0EA5E9]" style={{ fontSize: "clamp(14px, 1.5vw, 16px)" }}>
              <HeroCounter target={totalRobots} />+
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">Robots</span>
          </div>
          <span className="text-[#0EA5E9]">//</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#0EA5E9]" style={{ fontSize: "clamp(14px, 1.5vw, 16px)" }}>
              {manufacturerCount}+
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">Manufacturers</span>
          </div>
          <span className="text-[#0EA5E9]">//</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#0EA5E9]" style={{ fontSize: "clamp(14px, 1.5vw, 16px)" }}>
              $103B
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">Market</span>
          </div>
          <span className="text-[#0EA5E9]">//</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#0EA5E9]" style={{ fontSize: "clamp(14px, 1.5vw, 16px)" }}>
              5
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">Channels</span>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-b border-white/[0.06] px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50">
            Independent
          </span>
          <span className="h-1 w-1 rounded-full bg-[#0EA5E9]" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50">
            No manufacturer pays for scores
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          2.5. ROBOT FINDER CTA
          ══════════════════════════════════════════ */}
      <RobotFinderCtaStrip />

      {/* ══════════════════════════════════════════
          2.6. GUIDED ENTRY — 3-question intake
          ══════════════════════════════════════════ */}
      <GuidedEntry />

      {/* ══════════════════════════════════════════
          3. HOW IT WORKS — 3-step strip
          ══════════════════════════════════════════ */}
      <section className="bg-obsidian-2 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-blue/10 font-mono text-lg font-bold text-electric-blue">
                1
              </div>
              <div>
                <p className="text-base font-bold text-primary">Search</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-tertiary">
                  Browse {totalRobots}+ robots by industry, use case, and budget. Filter by specs that matter.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-blue/10 font-mono text-lg font-bold text-electric-blue">
                2
              </div>
              <div>
                <p className="text-base font-bold text-primary">Compare</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-tertiary">
                  Side-by-side specs, RoboScores, and 5-year TCO analysis. No black boxes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-blue/10 font-mono text-lg font-bold text-electric-blue">
                3
              </div>
              <div>
                <p className="text-base font-bold text-primary">Decide</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-tertiary">
                  Download the buyer{"'"}s checklist and get personalized guidance from Robotimus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3.5. PROVEN OUTCOMES
          ══════════════════════════════════════════ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-lime" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">
              Proven Outcomes
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "40-65%", label: "Labor Cost Reduction", source: "IFR 2025 industry data" },
              { value: "18 mo", label: "Average ROI Payback", source: "Standard utilization baseline" },
              { value: "$2.3M", label: "Average Annual Savings", source: "Per automated facility" },
              { value: "99.5%", label: "Order Accuracy", source: "Fully automated warehouses" },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-border bg-obsidian-surface p-6"
              >
                <p className="font-mono text-3xl font-bold text-lime">{card.value}</p>
                <p className="mt-2 text-sm font-semibold text-electric-blue">{card.label}</p>
                <p className="mt-1 text-xs text-ghost">{card.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3.6. ROBOTICS CAPABILITY MAP
          ══════════════════════════════════════════ */}
      <CapabilityMap />

      {/* ══════════════════════════════════════════
          4. SOCIAL PROOF
          ══════════════════════════════════════════ */}
      <SocialProofStrip />

      {/* ══════════════════════════════════════════
          5. FEATURED ROBOTS
          ══════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section label */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">
              Trending This Week
            </span>
          </div>

          {/* Search bar */}
          <Link
            href="/explore"
            className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-5 py-4 transition-colors hover:border-border-active"
          >
            <svg className="h-5 w-5 shrink-0 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span className="flex-1 text-[15px] text-tertiary">
              Search {totalRobots} robots by name, manufacturer, use case, or spec...
            </span>
            <kbd className="hidden rounded border border-border bg-obsidian-surface px-2 py-0.5 font-mono text-[13px] text-ghost sm:inline">
              &#8984;K
            </kbd>
          </Link>

          {/* Category filter pills */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.filter(c => c.robot_count > 0).map((cat) => (
              <Link
                key={cat.id}
                href={`/explore/${cat.slug}`}
                className="shrink-0"
              >
                <SectorCode code={SECTOR_CODES[cat.slug] || cat.slug.slice(0, 3).toUpperCase()} />
              </Link>
            ))}
          </div>

          {/* Robot grid */}
          <div className="mt-8 overflow-hidden rounded-lg bg-border-subtle">
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
              {trending.slice(0, 6).map((robot) => {
                const mfr = (robot.manufacturers as { name: string } | null)?.name || "";
                const cat = robot.robot_categories as { slug: string; name: string } | null;
                const sectorCode = SECTOR_CODES[cat?.slug || ""] || (cat?.slug || "").slice(0, 3).toUpperCase();
                return (
                  <Link
                    key={robot.id}
                    href={`/explore/${cat?.slug || "all"}/${robot.slug}`}
                    className="group block bg-obsidian-surface p-5 transition-colors hover:bg-obsidian-hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold text-primary">{robot.name}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[13px] text-tertiary">{mfr}</span>
                          <SectorCode code={sectorCode} />
                        </div>
                      </div>
                      {robot.robo_score != null && robot.robo_score > 0 && (
                        <RoboScoreBadge score={robot.robo_score} />
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      {robot.price_current != null ? (
                        <span className="font-mono text-base font-bold text-lime">
                          {formatPrice(robot.price_current)}
                        </span>
                      ) : (
                        <span className="font-mono text-base text-tertiary">RFQ</span>
                      )}
                      <span className="text-[13px] text-electric-blue opacity-0 transition-opacity group-hover:opacity-100">
                        View Analysis &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. AI ADVISOR CTA
          ══════════════════════════════════════════ */}
      <AdvisorCtaStrip />

      {/* ══════════════════════════════════════════
          7. MARKET INTELLIGENCE
          ══════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">
              Market Intelligence
            </span>
          </div>

          <div className="overflow-hidden rounded-lg bg-border-subtle">
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-obsidian-surface p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">Total Market Size</p>
                <p className="mt-2 font-mono text-2xl font-bold text-data">$103B</p>
                <p className="mt-1 text-[14px] text-tertiary">Global robotics 2026</p>
              </div>
              <div className="bg-obsidian-surface p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">Fastest Growing</p>
                <p className="mt-2 font-mono text-2xl font-bold text-lime">Humanoid +847%</p>
                <p className="mt-1 text-[14px] text-tertiary">YoY segment growth</p>
              </div>
              <div className="bg-obsidian-surface p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">Most Evaluated</p>
                <p className="mt-2 font-mono text-2xl font-bold text-data">Warehouse AMRs</p>
                <p className="mt-1 text-[14px] text-tertiary">By enterprise buyers</p>
              </div>
              <div className="bg-obsidian-surface p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">Avg RoboScore</p>
                <p className="mt-2 font-mono text-2xl font-bold text-lime">74.2</p>
                <p className="mt-1 text-[14px] text-tertiary">+1.3 vs Q4 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7.5 RECENTLY FUNDED
          ══════════════════════════════════════════ */}
      <RecentlyFunded />

      {/* ══════════════════════════════════════════
          8. SECTOR BROWSE
          ══════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">
              Browse by Sector
            </span>
          </div>

          <div className="overflow-hidden rounded-lg bg-border-subtle">
            <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4">
              {categories.filter(c => c.robot_count > 0).map((cat) => {
                const code = SECTOR_CODES[cat.slug] || cat.slug.slice(0, 3).toUpperCase();
                return (
                  <Link
                    key={cat.id}
                    href={`/explore/${cat.slug}`}
                    className="group block bg-obsidian-surface p-5 transition-colors hover:bg-obsidian-hover"
                  >
                    <SectorCode code={code} />
                    <p className="mt-2 text-base font-semibold text-primary">{cat.name}</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-mono text-xl font-bold text-data">{cat.robot_count}</span>
                      <span className="text-[13px] text-ghost">robots</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. LATEST INTELLIGENCE
          ══════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">
              Latest Intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Column 1: Latest News */}
            <div>
              <p className="mb-4 font-mono text-[13px] font-bold uppercase tracking-widest text-secondary">
                Latest News
              </p>
              <div className="space-y-4">
                {topNews.map((article) => (
                  <div key={article.id} className="border-b border-border-subtle pb-4">
                    <p className="text-[15px] leading-[1.7] text-secondary">{article.title}</p>
                    <p className="mt-1 font-mono text-[13px] text-ghost">{article.publishedAt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Learn */}
            <div>
              <p className="mb-4 font-mono text-[13px] font-bold uppercase tracking-widest text-secondary">
                Learn
              </p>
              <div className="space-y-4">
                <Link href="/learn" className="block border-b border-border-subtle pb-4 transition-colors hover:text-electric-blue">
                  <p className="text-[15px] leading-[1.7] text-secondary">How to evaluate warehouse AMRs</p>
                  <p className="mt-1 font-mono text-[13px] text-ghost">Guide</p>
                </Link>
                <Link href="/learn" className="block border-b border-border-subtle pb-4 transition-colors hover:text-electric-blue">
                  <p className="text-[15px] leading-[1.7] text-secondary">ROI calculator methodology explained</p>
                  <p className="mt-1 font-mono text-[13px] text-ghost">Methodology</p>
                </Link>
                <Link href="/learn" className="block border-b border-border-subtle pb-4 transition-colors hover:text-electric-blue">
                  <p className="text-[15px] leading-[1.7] text-secondary">Cobot vs industrial robot: decision guide</p>
                  <p className="mt-1 font-mono text-[13px] text-ghost">Comparison</p>
                </Link>
              </div>
            </div>

            {/* Column 3: Price Movements */}
            <div>
              <p className="mb-4 font-mono text-[13px] font-bold uppercase tracking-widest text-secondary">
                Price Movements
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <span className="text-[15px] text-secondary">Boston Dynamics Spot</span>
                  <span className="font-mono text-[14px] font-semibold text-lime">&darr;12%</span>
                </div>
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <span className="text-[15px] text-secondary">Universal Robots UR20</span>
                  <span className="font-mono text-[14px] font-semibold text-lime">&darr;5%</span>
                </div>
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <span className="text-[15px] text-secondary">Agility Robotics Digit</span>
                  <span className="font-mono text-[14px] font-semibold text-magenta">&uarr;8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. NEWSLETTER
          ══════════════════════════════════════════ */}
      <section className="px-6 py-20" style={{ borderTop: "1px solid #1A1A1A" }}>
        <div className="mx-auto max-w-xl">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">
              The Robotomated Brief
            </span>
          </div>
          <p className="mb-5 text-base leading-[1.7] text-tertiary">
            Weekly robotics intelligence for operators and buyers.
          </p>
          <NewsletterForm />
          <div className="mt-5 flex items-center gap-6 text-[13px] text-ghost">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-electric-blue inline-block" /> No spam
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-electric-blue inline-block" /> Unsubscribe anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
