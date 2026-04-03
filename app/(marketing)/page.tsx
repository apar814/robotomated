import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";
import { RoboScoreBadge } from "@/components/ui/robo-score";
// SocialProofStrip removed — stats now inline
import { HeroNetworkSvg } from "@/components/ui/hero-network-svg";
import { SectorCode, SECTOR_CODES } from "@/components/ui/sector-code";
import { HeroCounter } from "@/components/home/hero-counter";
import { NewsletterForm } from "@/components/home/newsletter-form";
import ChannelShowcase from "@/components/home/channel-showcase";
import { RobotimusSection } from "@/components/home/robotimus-section";
import { CertificationSection } from "@/components/home/certification-section";
import { RoboWorkSection } from "@/components/home/robowork-section";
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

  return (
    <div className="flex flex-col" style={{ background: "var(--theme-bg)" }}>

      {/* ══════════════════════════════════════════
          1. HERO
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-20 sm:py-24 lg:py-32">
        <HeroNetworkSvg className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="h-px w-5 bg-[#0EA5E9]" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#0EA5E9]">
              The Operating System for Robotics
            </span>
          </div>
          <h1
            className="mt-8 font-display font-extrabold leading-[1.05]"
            style={{ fontSize: "clamp(48px, 6vw, 96px)", letterSpacing: "-0.03em", color: "var(--theme-text-primary)", textShadow: "0 0 80px rgba(200,255,0,0.15)" }}
          >
            One platform.<br />
            The entire robot<br />
            <span style={{ color: "#C8FF00" }}>lifecycle.</span>
          </h1>
          <p className="mt-8 max-w-[560px] font-sans leading-[1.6]" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--theme-text-secondary)" }}>
            Buy, lease, or hire robots. Deploy with certified operators. Manage your fleet. Sell when you{"'"}re ready.
            {" "}{totalRobots} robots. {manufacturerCount} manufacturers. 5 channels.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/explore" className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-bold tracking-[0.02em] text-black transition-all hover:-translate-y-0.5" style={{ background: "var(--theme-accent-blue)" }}>
              Explore Robots
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/advisor" className="inline-flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-primary)" }}>
              Ask Robotimus
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS BAR
          ══════════════════════════════════════════ */}
      <section className="border-y px-6 py-5" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { value: <><HeroCounter target={totalRobots} />+</>, label: "Robots" },
            { value: `${manufacturerCount}+`, label: "Manufacturers" },
            { value: "$103B", label: "Market" },
            { value: "5", label: "Channels" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && <span className="mr-6 text-[#0EA5E9]">//</span>}
              <span className="font-mono font-bold text-[#0EA5E9]" style={{ fontSize: "clamp(14px, 1.5vw, 16px)" }}>{s.value}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--theme-text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="border-b px-6 py-3" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--theme-text-muted)" }}>Independent</span>
          <span className="h-1 w-1 rounded-full bg-[#0EA5E9]" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--theme-text-muted)" }}>No manufacturer pays for scores</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          3. THE 5 CHANNELS — Most important section
          ══════════════════════════════════════════ */}
      <ChannelShowcase />

      {/* ══════════════════════════════════════════
          4. ASK ROBOTIMUS
          ══════════════════════════════════════════ */}
      <RobotimusSection />

      {/* ══════════════════════════════════════════
          5. FEATURED ROBOTS
          ══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
          5. TRENDING ROBOTS
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
          6. CERTIFICATION & TRAINING
          ══════════════════════════════════════════ */}
      <CertificationSection />

      {/* ══════════════════════════════════════════
          7. ROBOWORK PREVIEW
          ══════════════════════════════════════════ */}
      <RoboWorkSection />

      {/* ══════════════════════════════════════════
          8. SOCIAL PROOF STATS
          ══════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: totalRobots.toString(), label: "Robots" },
              { value: manufacturerCount.toString(), label: "Manufacturers" },
              { value: "$103B", label: "Market Covered" },
              { value: "500+", label: "Deployments Tracked" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-mono font-extrabold" style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "var(--theme-accent-blue)" }}>{s.value}</p>
                <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--theme-text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. RECENTLY FUNDED
          ══════════════════════════════════════════ */}
      <RecentlyFunded />

      {/* ══════════════════════════════════════════
          10. NEWSLETTER
          ══════════════════════════════════════════ */}
      <section className="px-6 py-20" style={{ borderTop: `1px solid var(--theme-border)` }}>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
            The Automation Intelligence Brief
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-[1.7]" style={{ color: "var(--theme-text-secondary)" }}>
            Weekly robotics intelligence for operations leaders.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
          <p className="mt-4 text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
            Join 2,500+ operations leaders. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
