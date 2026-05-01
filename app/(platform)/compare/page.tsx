"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RoboScoreBadge, ScoreBar } from "@/components/ui/robo-score";
import { SafeImage } from "@/components/ui/safe-image";
import { RobotSearch } from "@/components/compare/robot-search";
import { ComparisonSkeleton } from "@/components/ui/skeleton";
import { DIMENSIONS } from "@/lib/scoring/roboscore";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

interface CompareRobot {
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  price_msrp: number | null;
  description_short: string | null;
  status: string;
  category_slug: string;
  category_name: string;
  manufacturer_name: string;
  image_url: string | null;
  specs: Record<string, unknown> | null;
  year_released: number | null;
}

function fmtPrice(p: number): string {
  if (p >= 1000000) return `$${(p / 1000000).toFixed(1)}M`;
  return `$${p.toLocaleString()}`;
}

function specVal(specs: Record<string, unknown> | null, key: string): string {
  if (!specs || specs[key] == null || specs[key] === "") return "N/A";
  if (typeof specs[key] === "boolean") return specs[key] ? "Yes" : "No";
  if (Array.isArray(specs[key])) return (specs[key] as string[]).join(", ");
  return String(specs[key]);
}

export default function ComparePageWrapper() {
  return (
    <Suspense fallback={<ComparisonSkeleton />}>
      <ComparePageInner />
    </Suspense>
  );
}

function ComparePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const robotsParam = searchParams.get("robots") || "";

  const [slugs, setSlugs] = useState<string[]>(robotsParam ? robotsParam.split(",").filter(Boolean).slice(0, 3) : []);
  const [robots, setRobots] = useState<CompareRobot[]>([]);
  const [loading, setLoading] = useState(false);
  const [breakdowns, setBreakdowns] = useState<Record<string, RoboScoreBreakdown | null>>({});

  // Fetch robot data for all slugs
  const fetchRobots = useCallback(async (newSlugs: string[]) => {
    if (newSlugs.length === 0) { setRobots([]); return; }
    setLoading(true);
    const results: CompareRobot[] = [];
    const bds: Record<string, RoboScoreBreakdown | null> = {};

    for (const slug of newSlugs) {
      try {
        const res = await fetch(`/api/robots?search=${encodeURIComponent(slug)}&sort=score_desc`);
        const data = await res.json();
        const match = (data.robots || []).find((r: CompareRobot) => r.slug === slug);
        if (match) results.push(match);
      } catch { /* skip */ }
    }

    // Fetch score breakdowns via a separate query for each
    for (const r of results) {
      try {
        const res = await fetch(`/api/robots?search=${encodeURIComponent(r.slug)}&sort=score_desc`);
        const data = await res.json();
        // We need score_breakdown which isn't in the standard API — use robot's score as proxy
        bds[r.slug] = null; // Will show N/A for breakdown comparison
      } catch { bds[r.slug] = null; }
    }

    setRobots(results);
    setBreakdowns(bds);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRobots(slugs);
  }, [slugs, fetchRobots]);

  function addRobot(slug: string) {
    if (slugs.length >= 3 || slugs.includes(slug)) return;
    const newSlugs = [...slugs, slug];
    setSlugs(newSlugs);
    router.push(`/compare?robots=${newSlugs.join(",")}`, { scroll: false });
  }

  function removeRobot(slug: string) {
    const newSlugs = slugs.filter((s) => s !== slug);
    setSlugs(newSlugs);
    router.push(newSlugs.length > 0 ? `/compare?robots=${newSlugs.join(",")}` : "/compare", { scroll: false });
  }

  function shareComparison() {
    navigator.clipboard.writeText(window.location.href).then(() => alert("Comparison link copied!"));
  }

  // Determine winners
  const bestScore = robots.reduce((best, r) => (r.robo_score || 0) > (best?.robo_score || 0) ? r : best, robots[0]);
  const bestPrice = robots.filter(r => r.price_current != null).reduce((best, r) => (r.price_current || Infinity) < (best?.price_current || Infinity) ? r : best, robots[0]);

  // Collect all spec keys across robots
  const allSpecKeys = new Set<string>();
  robots.forEach(r => { if (r.specs) Object.keys(r.specs).forEach(k => allSpecKeys.add(k)); });
  const specKeys = Array.from(allSpecKeys);

  // Key specs to highlight
  const KEY_SPECS = ["payload_kg", "reach_mm", "max_speed", "weight_kg", "dof", "battery_hrs", "suction_pa", "ip_rating", "repeatability"];
  const keySpecKeys = KEY_SPECS.filter(k => specKeys.includes(k));
  const otherSpecKeys = specKeys.filter(k => !KEY_SPECS.includes(k));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-4 flex items-center gap-1 font-mono text-[13px]">
            <a href="/explore" className="text-white/45 transition-colors hover:text-white/50">Explore</a>
            <span className="text-white/30">/</span>
            <span className="text-white/40">Compare</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-foreground">Compare Robots</h1>
          <p className="mt-1 text-white/35">Side-by-side across every dimension — specs, scores, pricing, and total cost.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Robot selection header */}
        <div className="mb-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(slugs.length + (slugs.length < 3 ? 1 : 0), 1)}, minmax(240px, 1fr))` }}>
          {robots.map((r) => (
            <div key={r.slug} className="relative rounded-xl border border-border bg-white/[0.03] p-4">
              <button onClick={() => removeRobot(r.slug)} className="absolute right-2 top-2 rounded-full bg-white/[0.03] p-1 text-white/50 hover:bg-white/[0.08] hover:text-foreground" aria-label="Remove">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="relative mb-3 h-32 overflow-hidden rounded-lg bg-white/[0.03]">
                {r.image_url && !r.image_url.includes("unsplash") ? (
                  <SafeImage src={r.image_url} alt={r.name} sizes="280px" className="object-cover" fallbackLabel={r.manufacturer_name} fallbackSublabel={r.name} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <span className="text-[13px] text-white/45">{r.manufacturer_name}</span>
                    <span className="text-xs font-semibold text-white/50">{r.name}</span>
                  </div>
                )}
              </div>
              <p className="text-[13px] text-white/50">{r.manufacturer_name}</p>
              <h3 className="font-semibold text-foreground">{r.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                {r.price_current != null ? (
                  <span className="font-mono text-sm font-bold text-white">{fmtPrice(r.price_current)}</span>
                ) : (
                  <span className="text-xs text-white/50">Contact for pricing</span>
                )}
                {r.robo_score != null && <RoboScoreBadge score={r.robo_score} />}
              </div>
              <Link href={`/explore/${r.category_slug}/${r.slug}`} className="mt-3 block w-full rounded-lg border border-border py-1.5 text-center text-xs text-white/35 hover:border-white/20 hover:text-white">
                View details →
              </Link>
            </div>
          ))}

          {/* Add robot slot */}
          {slugs.length < 3 && (
            <div className="rounded-xl border-2 border-dashed border-white/[0.10] p-4">
              <p className="mb-3 text-xs font-medium text-white/50">Add robot {slugs.length + 1} of 3</p>
              <RobotSearch onSelect={addRobot} excludeSlugs={slugs} />
            </div>
          )}
        </div>

        {loading && <ComparisonSkeleton />}

        {!loading && robots.length >= 2 && (
          <>
            {/* Action buttons */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">Comparison</h2>
              <div className="flex gap-2">
                <button onClick={shareComparison} className="rounded-lg border border-border px-3 py-1.5 text-xs text-white/35 hover:border-white/20 hover:text-white">
                  Share comparison
                </button>
                <button onClick={() => window.print()} className="rounded-lg border border-border px-3 py-1.5 text-xs text-white/35 hover:border-white/20 hover:text-white">
                  Export PDF
                </button>
              </div>
            </div>

            {/* Verdict row */}
            <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: `repeat(${robots.length}, 1fr)` }}>
              {robots.map((r) => {
                const labels: string[] = [];
                if (bestScore && r.slug === bestScore.slug) labels.push("Highest rated");
                if (bestPrice && r.slug === bestPrice.slug && robots.length > 1) labels.push("Best price");
                return (
                  <div key={r.slug} className={cn("rounded-lg border p-3 text-center text-xs", labels.length > 0 ? "border-white/20 bg-white/5" : "border-border bg-white/[0.03]")}>
                    {labels.length > 0 ? (
                      <span className="font-semibold text-white">{labels.join(" · ")}</span>
                    ) : (
                      <span className="text-white/50">—</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50 sm:w-40">Spec</th>
                    {robots.map((r) => (
                      <th key={r.slug} className="px-4 py-3 text-left text-xs font-medium text-white/45">{r.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Overview rows */}
                  <CompareRow label="RoboScore" robots={robots} getValue={(r) => r.robo_score?.toFixed(1) || "N/A"} bestSlug={bestScore?.slug} />
                  <CompareRow label="Price" robots={robots} getValue={(r) => r.price_current != null ? fmtPrice(r.price_current) : "Contact"} bestSlug={bestPrice?.slug} />
                  <CompareRow label="Category" robots={robots} getValue={(r) => r.category_name} />
                  <CompareRow label="Manufacturer" robots={robots} getValue={(r) => r.manufacturer_name} />

                  {/* Section header */}
                  {keySpecKeys.length > 0 && (
                    <tr><td colSpan={robots.length + 1} className="border-b border-border bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/50">Key Specifications</td></tr>
                  )}
                  {keySpecKeys.map((key) => (
                    <CompareRow key={key} label={fmtKey(key)} robots={robots} getValue={(r) => specVal(r.specs, key)} highlightBest={isNumericSpec(key)} />
                  ))}

                  {/* Other specs */}
                  {otherSpecKeys.length > 0 && (
                    <tr><td colSpan={robots.length + 1} className="border-b border-border bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/50">Additional Specifications</td></tr>
                  )}
                  {otherSpecKeys.map((key) => (
                    <CompareRow key={key} label={fmtKey(key)} robots={robots} getValue={(r) => specVal(r.specs, key)} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* ROI snapshot */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold text-foreground">ROI Snapshot (at $25/hr, 1 shift, 2 workers)</h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${robots.length}, 1fr)` }}>
                {robots.map((r) => {
                  const annualSavings = 25 * 8 * 250 * 2; // $25/hr, 8hrs, 250 days, 2 workers
                  const payback = r.price_current ? Math.ceil(r.price_current / (annualSavings / 12)) : null;
                  return (
                    <div key={r.slug} className="rounded-lg border border-border bg-white/[0.03] p-4">
                      <p className="text-xs font-medium text-foreground">{r.name}</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50">Est. payback</span>
                          <span className="font-mono font-medium">{payback ? `${payback} months` : "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50">Monthly savings</span>
                          <span className="font-mono font-medium text-white">${Math.round(annualSavings / 12).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50">3-year ROI</span>
                          <span className="font-mono font-medium">
                            {r.price_current ? `${Math.round(((annualSavings * 3 - r.price_current) / r.price_current) * 100)}%` : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!loading && robots.length < 2 && slugs.length < 2 && (
          <div className="rounded-xl border border-border bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.03]">
              <svg className="h-7 w-7 text-white/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">Add at least 2 robots to compare</p>
            <p className="mt-1 text-sm text-white/35">Search for robots above to start a side-by-side comparison.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function CompareRow({ label, robots, getValue, bestSlug, highlightBest }: {
  label: string; robots: CompareRobot[]; getValue: (r: CompareRobot) => string;
  bestSlug?: string; highlightBest?: boolean;
}) {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-2.5 text-xs font-medium text-white/35">{label}</td>
      {robots.map((r) => {
        const val = getValue(r);
        const isBest = bestSlug === r.slug || (highlightBest && isBestNumeric(robots, r, getValue));
        return (
          <td key={r.slug} className={cn("px-4 py-2.5 font-mono text-xs", isBest ? "bg-white/5 font-semibold text-white" : "text-foreground")}>
            {val}
          </td>
        );
      })}
    </tr>
  );
}

function isBestNumeric(robots: CompareRobot[], current: CompareRobot, getValue: (r: CompareRobot) => string): boolean {
  const vals = robots.map(r => parseFloat(getValue(r))).filter(v => !isNaN(v));
  if (vals.length === 0) return false;
  const currentVal = parseFloat(getValue(current));
  if (isNaN(currentVal)) return false;
  return currentVal === Math.max(...vals);
}

function isNumericSpec(key: string): boolean {
  return ["payload_kg", "reach_mm", "dof", "battery_hrs", "suction_pa", "max_speed"].includes(key);
}

function fmtKey(key: string): string {
  return key.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
}
