import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreRing, ScoreBar } from "@/components/ui/robo-score";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import { FaqSchema } from "@/components/seo/json-ld";
import { RelatedRobots } from "@/components/robots/related-robots";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

const YEAR = new Date().getFullYear();

interface CompareRobot {
  id: string;
  slug: string;
  name: string;
  price_current: number | null;
  price_msrp: number | null;
  robo_score: number | null;
  score_breakdown: RoboScoreBreakdown | null;
  description_short: string | null;
  specs: Record<string, unknown>;
  status: string;
  category_id: string;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string; name: string } | null;
  // Buyer intelligence fields
  vendor_health_score: number | null;
  maintenance_annual_pct: number | null;
  maintenance_annual_cost_low: number | null;
  maintenance_annual_cost_high: number | null;
  support_model: string | null;
  support_response_hours: number | null;
  safety_certifications: string[] | null;
}

interface Props { params: Promise<{ slugs: string }> }

function parseSlugs(slugs: string): [string, string] | null {
  const parts = slugs.split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

// ISR: regenerate every hour, render on-demand for uncached comparisons
export const revalidate = 3600;
export const dynamicParams = true;

// Pre-built comparison pages for the most searched robot pairs
const FEATURED_COMPARISONS = [
  // Original featured pairs
  "boston-dynamics-spot-arm-vs-unitree-go2",
  "universal-robots-ur10e-vs-fanuc-crx-10ia",
  "locus-origin-vs-6rs-chuck",
  "da-vinci-5-vs-cmr-versius",
  "autostore-b1-vs-ocado-hive",
  "agility-digit-vs-figure-02",
  "stretch-vs-righthand-robotics-piece-picker",
  "abb-yumi-vs-ur3e",
  "dji-agras-t50-vs-xag-p100",
  "knightscope-k5-vs-cobalt-r2",
  // Warehouse AMR/AGV comparisons
  "locus-origin-vs-locus-vector",
  "mir250-vs-mir600",
  "fetch-freight-vs-mir250",
  // Cobot comparisons
  "universal-robots-ur5e-vs-fanuc-crx-10ia",
  "universal-robots-ur10e-vs-kuka-lbr-iiwa",
  "fanuc-crx-10ia-vs-abb-yumi",
  // Industrial robot comparisons
  "fanuc-m-20ia-vs-kuka-kr-10",
  "abb-irb-6700-vs-fanuc-r-2000ic",
  // Surgical robot comparisons
  "da-vinci-5-vs-stryker-mako",
  // Construction comparisons
  "built-excavator-vs-built-dozer",
  "dusty-fieldprinter-vs-hilti-jaibot-w12",
  "icon-vulcan-vs-apis-cor-3d",
  // Agricultural comparisons
  "monarch-mk-v-vs-naio-dino",
  "carbon-robotics-laserweeder-vs-farmwise-titan",
  // Consumer robot comparisons
  "irobot-roomba-j9-vs-roborock-s8-maxv",
  // Delivery robot comparisons
  "starship-enterprise-vs-kiwibot-4",
  "serve-gen3-vs-coco-1",
  // Drone comparisons
  "dji-matrice-350-vs-skydio-x10",
  // Cross-category leaders
  "boston-dynamics-atlas-electric-vs-figure-02",
  "autostore-b1-vs-locus-origin",
  // AS/RS comparisons
  "autostore-b1-vs-exotec-skypod",
  // Humanoid comparisons
  "unitree-h1-vs-agility-digit",
  "figure-02-vs-tesla-optimus-gen2",
  // Vision inspection comparisons
  "cognex-insight-3d-vs-keyence-xg-x",
  // Security comparisons
  "knightscope-k5-vs-cobalt-r2",
  // Mixed warehouse
  "stretch-vs-locus-origin",
  "mir600-vs-fetch-freight",
  // Premium cobots
  "universal-robots-ur16e-vs-fanuc-crx-25ia",
  "doosan-m1013-vs-techman-tm12",
  // Lawn/consumer
  "husqvarna-automower-450x-vs-worx-landroid-l",
];

export async function generateStaticParams() {
  // Pre-render featured comparisons + top robot combos by category
  const supabase = createServerClient();
  const { data } = await supabase
    .from("robots")
    .select("slug, robo_score, robot_categories(slug)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false, nullsFirst: false })
    .limit(30)
    .returns<{ slug: string; robo_score: number; robot_categories: { slug: string } | null }[]>();

  const robots = data || [];
  const seen = new Set<string>();
  const params: { slugs: string }[] = [];

  // Add all featured comparisons
  for (const s of FEATURED_COMPARISONS) {
    if (!seen.has(s)) { seen.add(s); params.push({ slugs: s }); }
  }

  // Add top 3 per category, paired within category
  const byCat = new Map<string, string[]>();
  for (const r of robots) {
    const cat = r.robot_categories?.slug || "other";
    if (!byCat.has(cat)) byCat.set(cat, []);
    if (byCat.get(cat)!.length < 3) byCat.get(cat)!.push(r.slug);
  }
  for (const [, slugs] of byCat) {
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        const pair = slugs[i] < slugs[j] ? `${slugs[i]}-vs-${slugs[j]}` : `${slugs[j]}-vs-${slugs[i]}`;
        if (!seen.has(pair)) { seen.add(pair); params.push({ slugs: pair }); }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) return { title: "Comparison Not Found" };

  const supabase = createServerClient();
  const [{ data: a }, { data: b }] = await Promise.all([
    supabase.from("robots").select("name").eq("slug", parsed[0]).single().returns<{ name: string }>(),
    supabase.from("robots").select("name").eq("slug", parsed[1]).single().returns<{ name: string }>(),
  ]);

  if (!a || !b) return { title: "Comparison Not Found" };

  return {
    title: `${a.name} vs ${b.name} — Comparison ${YEAR}`,
    description: `Head-to-head comparison of ${a.name} and ${b.name}. Compare RoboScores, specs, pricing, and features.`,
    alternates: { canonical: `/compare/${slugs}` },
  };
}

const DIMS: { key: keyof RoboScoreBreakdown; label: string }[] = [
  { key: "performance", label: "Performance" },
  { key: "reliability", label: "Reliability" },
  { key: "ease_of_use", label: "Ease of Use" },
  { key: "intelligence", label: "Intelligence" },
  { key: "value", label: "Value" },
  { key: "ecosystem", label: "Ecosystem" },
  { key: "safety", label: "Safety" },
  { key: "design", label: "Design" },
];

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) notFound();

  const supabase = createServerClient();
  const [{ data: robotA }, { data: robotB }] = await Promise.all([
    supabase.from("robots")
      .select("id, slug, name, price_current, price_msrp, robo_score, score_breakdown, description_short, specs, status, category_id, vendor_health_score, maintenance_annual_pct, maintenance_annual_cost_low, maintenance_annual_cost_high, support_model, support_response_hours, safety_certifications, manufacturers(name), robot_categories(slug, name)")
      .eq("slug", parsed[0]).single().returns<CompareRobot>(),
    supabase.from("robots")
      .select("id, slug, name, price_current, price_msrp, robo_score, score_breakdown, description_short, specs, status, category_id, vendor_health_score, maintenance_annual_pct, maintenance_annual_cost_low, maintenance_annual_cost_high, support_model, support_response_hours, safety_certifications, manufacturers(name), robot_categories(slug, name)")
      .eq("slug", parsed[1]).single().returns<CompareRobot>(),
  ]);

  if (!robotA || !robotB) notFound();

  const mfrA = (robotA.manufacturers as { name: string } | null)?.name || "";
  const mfrB = (robotB.manufacturers as { name: string } | null)?.name || "";
  const catA = (robotA.robot_categories as { slug: string; name: string } | null);
  const catB = (robotB.robot_categories as { slug: string; name: string } | null);
  const breakdownA = robotA.score_breakdown as RoboScoreBreakdown | null;
  const breakdownB = robotB.score_breakdown as RoboScoreBreakdown | null;
  const specsA = robotA.specs as Record<string, unknown>;
  const specsB = robotB.specs as Record<string, unknown>;
  const allSpecKeys = Array.from(new Set([...Object.keys(specsA), ...Object.keys(specsB)]));

  const winner = (robotA.robo_score ?? 0) >= (robotB.robo_score ?? 0) ? robotA : robotB;

  const faqs = [
    { question: `Which is better, ${robotA.name} or ${robotB.name}?`, answer: `Based on our RoboScore system, ${winner.name} scores ${winner.robo_score?.toFixed(1)} out of 100, making it the higher-rated option. However, the best choice depends on your specific use case and budget.` },
    { question: `How do ${robotA.name} and ${robotB.name} compare on price?`, answer: `${robotA.name} is ${robotA.price_current != null ? `$${robotA.price_current.toLocaleString()}` : "contact for pricing"}, while ${robotB.name} is ${robotB.price_current != null ? `$${robotB.price_current.toLocaleString()}` : "contact for pricing"}.` },
    { question: "How is RoboScore calculated?", answer: "RoboScore rates robots on 8 weighted dimensions: Performance (25%), Reliability (20%), Ease of Use (15%), Intelligence (15%), Value (10%), Ecosystem (8%), Safety (5%), and Design (2%)." },
  ];

  return (
    <div>
      <FaqSchema items={faqs} />

      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Compare", href: "/explore" },
            { name: `${robotA.name} vs ${robotB.name}`, href: `/compare/${slugs}` },
          ]} />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            {robotA.name} vs {robotB.name}
          </h1>
          <p className="mt-3 text-muted">
            Head-to-head comparison of {mfrA} {robotA.name} and {mfrB} {robotB.name}. Updated {YEAR}.
          </p>
          <p className="mt-2 text-xs text-muted">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </section>

      {/* Score comparison */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold">Overall Score</h2>
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <RoboScoreRing score={robotA.robo_score ?? 0} size={100} />
              <h3 className="mt-3 font-semibold">{robotA.name}</h3>
              <p className="text-xs text-muted">{mfrA}</p>
            </div>
            <div>
              <RoboScoreRing score={robotB.robo_score ?? 0} size={100} />
              <h3 className="mt-3 font-semibold">{robotB.name}</h3>
              <p className="text-xs text-muted">{mfrB}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dimension-by-dimension */}
      {breakdownA && breakdownB && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">Score Breakdown</h2>
            <div className="space-y-4">
              {DIMS.map(({ key, label }) => {
                const a = breakdownA[key];
                const b = breakdownB[key];
                const aWins = a > b;
                const bWins = b > a;
                return (
                  <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="flex items-center justify-end gap-2">
                      <span className={cn("font-mono text-sm font-semibold", aWins && "text-green")}>{a}</span>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-navy-lighter sm:w-32">
                        <div className="ml-auto h-full rounded-full bg-blue" style={{ width: `${a}%`, opacity: 0.7 }} />
                      </div>
                    </div>
                    <span className="w-20 text-center text-xs text-muted">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-navy-lighter sm:w-32">
                        <div className="h-full rounded-full bg-violet" style={{ width: `${b}%`, opacity: 0.7 }} />
                      </div>
                      <span className={cn("font-mono text-sm font-semibold", bWins && "text-green")}>{b}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Specs comparison */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold">Specs Comparison</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-lighter">
                  <th className="px-4 py-3 text-left font-medium text-muted">Spec</th>
                  <th className="px-4 py-3 text-left font-medium text-blue">{robotA.name}</th>
                  <th className="px-4 py-3 text-left font-medium text-violet">{robotB.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-navy-light">
                  <td className="px-4 py-3 font-medium text-muted">Price</td>
                  <td className="px-4 py-3 font-mono">{robotA.price_current != null ? `$${robotA.price_current.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3 font-mono">{robotB.price_current != null ? `$${robotB.price_current.toLocaleString()}` : "—"}</td>
                </tr>
                {allSpecKeys.map((key, i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-navy-lighter" : "bg-navy-light"}>
                    <td className="px-4 py-3 font-medium text-muted">{formatKey(key)}</td>
                    <td className="px-4 py-3 font-mono">{formatVal(specsA[key])}</td>
                    <td className="px-4 py-3 font-mono">{formatVal(specsB[key])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Buyer Intelligence Comparison */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold">Buyer Intelligence</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-lighter">
                  <th className="px-4 py-3 text-left font-medium text-muted">Metric</th>
                  <th className="px-4 py-3 text-left font-medium text-blue">{robotA.name}</th>
                  <th className="px-4 py-3 text-left font-medium text-violet">{robotB.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-navy-light">
                  <td className="px-4 py-3 font-medium text-muted">Vendor Health Score</td>
                  <td className="px-4 py-3 font-mono">
                    {robotA.vendor_health_score != null ? (
                      <span className={cn(robotA.vendor_health_score >= 70 ? "text-green" : robotA.vendor_health_score >= 50 ? "text-orange" : "text-muted")}>
                        {robotA.vendor_health_score}/100
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {robotB.vendor_health_score != null ? (
                      <span className={cn(robotB.vendor_health_score >= 70 ? "text-green" : robotB.vendor_health_score >= 50 ? "text-orange" : "text-muted")}>
                        {robotB.vendor_health_score}/100
                      </span>
                    ) : "—"}
                  </td>
                </tr>
                <tr className="bg-navy-lighter">
                  <td className="px-4 py-3 font-medium text-muted">5-Year TCO Estimate</td>
                  <td className="px-4 py-3 font-mono">
                    {robotA.price_current != null ? (
                      `$${(robotA.price_current + (robotA.maintenance_annual_cost_low != null ? robotA.maintenance_annual_cost_low * 5 : robotA.price_current * (robotA.maintenance_annual_pct ?? 0.08) * 5)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {robotB.price_current != null ? (
                      `$${(robotB.price_current + (robotB.maintenance_annual_cost_low != null ? robotB.maintenance_annual_cost_low * 5 : robotB.price_current * (robotB.maintenance_annual_pct ?? 0.08) * 5)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    ) : "—"}
                  </td>
                </tr>
                <tr className="bg-navy-light">
                  <td className="px-4 py-3 font-medium text-muted">Annual Maintenance</td>
                  <td className="px-4 py-3 font-mono">
                    {robotA.maintenance_annual_cost_low != null && robotA.maintenance_annual_cost_high != null
                      ? `$${robotA.maintenance_annual_cost_low.toLocaleString()} – $${robotA.maintenance_annual_cost_high.toLocaleString()}`
                      : robotA.maintenance_annual_pct != null && robotA.price_current != null
                        ? `~$${Math.round(robotA.price_current * robotA.maintenance_annual_pct).toLocaleString()}/yr`
                        : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {robotB.maintenance_annual_cost_low != null && robotB.maintenance_annual_cost_high != null
                      ? `$${robotB.maintenance_annual_cost_low.toLocaleString()} – $${robotB.maintenance_annual_cost_high.toLocaleString()}`
                      : robotB.maintenance_annual_pct != null && robotB.price_current != null
                        ? `~$${Math.round(robotB.price_current * robotB.maintenance_annual_pct).toLocaleString()}/yr`
                        : "—"}
                  </td>
                </tr>
                <tr className="bg-navy-lighter">
                  <td className="px-4 py-3 font-medium text-muted">Support Model</td>
                  <td className="px-4 py-3">
                    {robotA.support_model ? (
                      <span className="inline-block rounded border border-blue/20 bg-blue/5 px-2 py-0.5 font-mono text-xs text-blue">
                        {robotA.support_model}
                      </span>
                    ) : "—"}
                    {robotA.support_response_hours != null && (
                      <span className="ml-2 text-xs text-muted">{robotA.support_response_hours}hr SLA</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {robotB.support_model ? (
                      <span className="inline-block rounded border border-violet/20 bg-violet/5 px-2 py-0.5 font-mono text-xs text-violet">
                        {robotB.support_model}
                      </span>
                    ) : "—"}
                    {robotB.support_response_hours != null && (
                      <span className="ml-2 text-xs text-muted">{robotB.support_response_hours}hr SLA</span>
                    )}
                  </td>
                </tr>
                <tr className="bg-navy-light">
                  <td className="px-4 py-3 font-medium text-muted">Safety Certifications</td>
                  <td className="px-4 py-3">
                    {robotA.safety_certifications && robotA.safety_certifications.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {robotA.safety_certifications.map((cert) => (
                          <span key={cert} className="inline-block rounded border border-green/20 bg-green/5 px-1.5 py-0.5 font-mono text-[13px] text-green">
                            {cert}
                          </span>
                        ))}
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {robotB.safety_certifications && robotB.safety_certifications.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {robotB.safety_certifications.map((cert) => (
                          <span key={cert} className="inline-block rounded border border-green/20 bg-green/5 px-1.5 py-0.5 font-mono text-[13px] text-green">
                            {cert}
                          </span>
                        ))}
                      </div>
                    ) : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl flex flex-wrap gap-2">
          <Link href={`/explore/${catA?.slug || "all"}/${robotA.slug}`} className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-blue/30 hover:text-foreground">
            {robotA.name} Full Review
          </Link>
          <Link href={`/explore/${catB?.slug || "all"}/${robotB.slug}`} className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-blue/30 hover:text-foreground">
            {robotB.name} Full Review
          </Link>
          {catA && (
            <Link href={`/best/${catA.slug}`} className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-blue/30 hover:text-foreground">
              Best {catA.name} Robots
            </Link>
          )}
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <FaqSection items={faqs} />
        </div>
      </section>
    </div>
  );
}

function formatKey(key: string): string {
  return key.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatVal(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
