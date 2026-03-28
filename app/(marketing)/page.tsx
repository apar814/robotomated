import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { TrustBar } from "@/components/ui/trust-bar";
import { SocialProofStrip } from "@/components/ui/social-proof-strip";
import { AdvisorCtaStrip } from "@/components/ui/advisor-cta-strip";
import { DataTicker } from "@/components/layout/data-ticker";
import { SectorCode, SECTOR_CODES } from "@/components/ui/sector-code";
import { HeroCounter } from "@/components/home/hero-counter";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { NEWS_ARTICLES } from "@/lib/data/news";
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

  return { categories, trending, totalRobots };
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}`;
}

/* ── Floating particle positions ── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5.3 + 2.7) % 100}%`,
  delay: `${(i * 1.3) % 8}s`,
  duration: `${16 + (i % 11)}s`,
}));

export default async function HomePage() {
  const { categories, trending, totalRobots } = await getData();

  const topNews = NEWS_ARTICLES.slice(0, 3);

  return (
    <div className="flex flex-col" style={{ background: "#080808" }}>

      {/* ══════════════════════════════════════════
          1. HERO
          ══════════════════════════════════════════ */}
      <section className="relative max-h-[60vh] overflow-hidden px-6 py-12 sm:py-16 lg:py-20">
        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.025), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,255,0,0.012), transparent 70%)" }}
        />

        {/* Floating data particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="pointer-events-none absolute h-[2px] w-[2px] rounded-full"
            style={{
              background: "#0EA5E9",
              opacity: 0.15,
              left: p.left,
              bottom: "-4px",
              animation: `float-up ${p.duration} linear ${p.delay} infinite`,
            }}
          />
        ))}

        {/* Content */}
        <div className="mx-auto max-w-7xl">
          {/* Tagline */}
          <div className="flex items-center gap-3">
            <div className="h-px w-3 bg-electric-blue" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-electric-blue">
              Robotics Intelligence Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-5 font-display text-[40px] font-bold leading-[1.05] sm:text-[56px] lg:text-[72px]"
            style={{ letterSpacing: "-0.05em", color: "#E8E8E8" }}
          >
            The Intelligence Layer<br />
            for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #0EA5E9, #C8FF00)" }}
            >
              Robotics
            </span>
          </h1>

          {/* System status line */}
          <p className="mt-5 font-mono text-[12px] text-tertiary">
            MONITORING{" "}
            <span className="font-semibold text-data">[<HeroCounter target={totalRobots} />]</span>
            {" "}ROBOTS{" "}
            <span className="text-ghost">//</span>{" "}
            <span className="font-semibold text-data">167</span> MANUFACTURERS{" "}
            <span className="text-ghost">//</span>{" "}
            <span className="font-semibold text-data">$103B</span> MARKET{" "}
            <span className="text-ghost">//</span>{" "}
            UPDATED TODAY
          </p>

          {/* CTAs */}
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/explore"
              className="rounded-[4px] bg-electric-blue px-6 py-2.5 font-mono text-[10px] font-bold tracking-widest text-black transition-shadow hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              EXPLORE ROBOTS
            </Link>
            <Link
              href="/advisor"
              className="rounded-[4px] border border-border px-6 py-2.5 font-mono text-[10px] font-bold tracking-widest text-secondary transition-colors hover:border-electric-blue hover:text-electric-blue"
            >
              ASK THE ADVISOR
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. TRUST BAR
          ══════════════════════════════════════════ */}
      <TrustBar />

      {/* ══════════════════════════════════════════
          3. SOCIAL PROOF
          ══════════════════════════════════════════ */}
      <SocialProofStrip />

      {/* ══════════════════════════════════════════
          4. DATA TICKER
          ══════════════════════════════════════════ */}
      <DataTicker />

      {/* ══════════════════════════════════════════
          5. FEATURED ROBOTS
          ══════════════════════════════════════════ */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Section label */}
          <div className="mb-5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">
              Trending This Week
            </span>
          </div>

          {/* Search bar */}
          <Link
            href="/explore"
            className="flex items-center gap-3 rounded-[4px] border border-border bg-transparent px-4 py-3 transition-colors hover:border-border-active"
          >
            <svg className="h-4 w-4 shrink-0 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span className="flex-1 font-mono text-xs text-tertiary">
              Search {totalRobots} robots by name, manufacturer, use case, or spec...
            </span>
            <kbd className="hidden rounded-[2px] border border-border bg-obsidian-surface px-2 py-0.5 font-mono text-[10px] text-ghost sm:inline">
              &#8984;K
            </kbd>
          </Link>

          {/* Category filter pills */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
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
          <div className="mt-6 overflow-hidden rounded-lg bg-border-subtle">
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
              {trending.slice(0, 6).map((robot) => {
                const mfr = (robot.manufacturers as { name: string } | null)?.name || "";
                const cat = robot.robot_categories as { slug: string; name: string } | null;
                const sectorCode = SECTOR_CODES[cat?.slug || ""] || (cat?.slug || "").slice(0, 3).toUpperCase();
                return (
                  <Link
                    key={robot.id}
                    href={`/explore/${cat?.slug || "all"}/${robot.slug}`}
                    className="group block bg-obsidian-surface p-4 transition-colors hover:bg-obsidian-hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-primary">{robot.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] text-tertiary">{mfr}</span>
                          <SectorCode code={sectorCode} />
                        </div>
                      </div>
                      {robot.robo_score != null && robot.robo_score > 0 && (
                        <RoboScoreBadge score={robot.robo_score} />
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      {robot.price_current != null ? (
                        <span className="font-mono text-sm font-bold text-lime">
                          {formatPrice(robot.price_current)}
                        </span>
                      ) : (
                        <span className="font-mono text-sm text-tertiary">RFQ</span>
                      )}
                      <span className="text-[11px] text-electric-blue opacity-0 transition-opacity group-hover:opacity-100">
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
      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">
              Market Intelligence
            </span>
          </div>

          <div className="overflow-hidden rounded-lg bg-border-subtle">
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-obsidian-surface p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Total Market Size</p>
                <p className="mt-2 font-mono text-2xl font-bold text-data">$103B</p>
                <p className="mt-1 text-xs text-tertiary">Global robotics 2026</p>
              </div>
              <div className="bg-obsidian-surface p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Fastest Growing</p>
                <p className="mt-2 font-mono text-2xl font-bold text-lime">Humanoid +847%</p>
                <p className="mt-1 text-xs text-tertiary">YoY segment growth</p>
              </div>
              <div className="bg-obsidian-surface p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Most Evaluated</p>
                <p className="mt-2 font-mono text-2xl font-bold text-data">Warehouse AMRs</p>
                <p className="mt-1 text-xs text-tertiary">By enterprise buyers</p>
              </div>
              <div className="bg-obsidian-surface p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Avg RoboScore</p>
                <p className="mt-2 font-mono text-2xl font-bold text-lime">74.2</p>
                <p className="mt-1 text-xs text-tertiary">+1.3 vs Q4 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. SECTOR BROWSE
          ══════════════════════════════════════════ */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">
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
                    className="group block bg-obsidian-surface p-4 transition-colors hover:bg-obsidian-hover"
                  >
                    <SectorCode code={code} />
                    <p className="mt-2 text-sm font-medium text-primary">{cat.name}</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-mono text-lg font-bold text-data">{cat.robot_count}</span>
                      <span className="text-[10px] text-ghost">robots</span>
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
      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">
              Latest Intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Column 1: Latest News */}
            <div>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-secondary">
                Latest News
              </p>
              <div className="space-y-3">
                {topNews.map((article) => (
                  <div key={article.id} className="border-b border-border-subtle pb-3">
                    <p className="text-sm text-secondary">{article.title}</p>
                    <p className="mt-1 font-mono text-[10px] text-ghost">{article.publishedAt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Learn */}
            <div>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-secondary">
                Learn
              </p>
              <div className="space-y-3">
                <Link href="/learn" className="block border-b border-border-subtle pb-3 transition-colors hover:text-electric-blue">
                  <p className="text-sm text-secondary">How to evaluate warehouse AMRs</p>
                  <p className="mt-1 font-mono text-[10px] text-ghost">Guide</p>
                </Link>
                <Link href="/learn" className="block border-b border-border-subtle pb-3 transition-colors hover:text-electric-blue">
                  <p className="text-sm text-secondary">ROI calculator methodology explained</p>
                  <p className="mt-1 font-mono text-[10px] text-ghost">Methodology</p>
                </Link>
                <Link href="/learn" className="block border-b border-border-subtle pb-3 transition-colors hover:text-electric-blue">
                  <p className="text-sm text-secondary">Cobot vs industrial robot: decision guide</p>
                  <p className="mt-1 font-mono text-[10px] text-ghost">Comparison</p>
                </Link>
              </div>
            </div>

            {/* Column 3: Price Movements */}
            <div>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-secondary">
                Price Movements
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-sm text-secondary">Boston Dynamics Spot</span>
                  <span className="font-mono text-[11px] font-semibold text-lime">&darr;12%</span>
                </div>
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-sm text-secondary">Universal Robots UR20</span>
                  <span className="font-mono text-[11px] font-semibold text-lime">&darr;5%</span>
                </div>
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-sm text-secondary">Agility Robotics Digit</span>
                  <span className="font-mono text-[11px] font-semibold text-magenta">&uarr;8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. NEWSLETTER
          ══════════════════════════════════════════ */}
      <section className="px-6 py-10" style={{ borderTop: "1px solid #1A1A1A" }}>
        <div className="mx-auto max-w-xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">
              The Robotomated Brief
            </span>
          </div>
          <p className="mb-4 text-sm text-tertiary">
            Weekly robotics intelligence for operators and buyers
          </p>
          <NewsletterForm />
          <div className="mt-4 flex items-center gap-6 text-[10px] text-ghost">
            <span className="flex items-center gap-1.5">
              <span className="text-lime">&#10003;</span> No spam
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-lime">&#10003;</span> Unsubscribe anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
