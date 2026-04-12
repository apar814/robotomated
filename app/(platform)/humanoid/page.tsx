import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "The Humanoid Revolution -- Robotomated Intelligence Hub",
  description:
    "Comprehensive humanoid market intelligence: 137+ Chinese manufacturers, cost curves collapsing 90%, deployment timelines, US vs China analysis, and the definitive humanoid robot directory.",
  openGraph: {
    title: "The Humanoid Revolution -- Robotomated Intelligence Hub",
    description:
      "Comprehensive humanoid market intelligence. Cost curves, deployment timelines, US vs China comparison, and the definitive humanoid robot directory.",
    url: "https://robotomated.com/humanoid",
    type: "website",
  },
  alternates: {
    canonical: "https://robotomated.com/humanoid",
  },
};

/* ── Static Data ── */

const HERO_STATS = [
  { value: "137", label: "Chinese manufacturers" },
  { value: "0", label: "US commercially available" },
  { value: "$24T", label: "Projected market 2040" },
  { value: "90%", label: "Cost reduction" },
  { value: "67+", label: "Hours autonomous" },
  { value: "$16K", label: "Cheapest available" },
];

const CONVERGENCE_FORCES = [
  {
    title: "Multimodal AI",
    description:
      "Language, vision, and spatial reasoning merged into single foundation models that can interpret and act on the physical world.",
  },
  {
    title: "High-Torque Actuators",
    description:
      "Quasi-direct-drive motors deliver human-level strength at a fraction of the weight and cost of legacy hydraulics.",
  },
  {
    title: "Advanced Compute",
    description:
      "Edge AI chips run transformer-scale models onboard, enabling real-time decision-making without cloud dependency.",
  },
  {
    title: "Battery Technology",
    description:
      "Energy density doubled since 2020. Solid-state cells entering production enable 8+ hour continuous operation.",
  },
  {
    title: "Internet-Scale Training",
    description:
      "Billions of hours of video, simulation, and teleoperation data give humanoids a shared understanding of human environments.",
  },
];

const COST_CURVE = [
  { year: "2022", price: 250000, label: "$250K" },
  { year: "2024", price: 150000, label: "$150K" },
  { year: "2025", price: 30000, label: "$30K-$150K", isRange: true },
  { year: "G1", price: 16000, label: "$16K", highlight: true, sublabel: "Unitree G1" },
  { year: "R1", price: 6000, label: "$6K", highlight: true, sublabel: "Unitree R1 (announced)" },
  { year: "2027E", price: 15000, label: "$13-17K", projected: true, sublabel: "BofA estimate" },
  { year: "2030E", price: 15000, label: "$10-20K", projected: true },
];

const LABOR_COST_ANNUAL = 95000;
const LABOR_COST_HOURLY = 46;

const DEPLOYMENT_TIMELINE = [
  {
    year: "2025",
    title: "Factory Pilots Begin",
    description: "1,000 Optimus units deployed in Tesla factories. Figure 02 enters BMW assembly lines.",
    status: "active" as const,
  },
  {
    year: "2026",
    title: "First Home Humanoids",
    description: "1X NEO Gamma targets residential deployment. Unitree scales G1 production past 10K units.",
    status: "upcoming" as const,
  },
  {
    year: "2027",
    title: "Safety Standards Ratified",
    description: "ISO/IEC humanoid safety standards finalized. Insurance frameworks established for commercial deployment.",
    status: "upcoming" as const,
  },
  {
    year: "2028",
    title: "Mass Commercial Deployment",
    description: "Enterprise humanoid leasing models mature. Warehouses and logistics centers adopt at scale.",
    status: "future" as const,
  },
  {
    year: "2030",
    title: "Hundreds of Thousands Deployed",
    description: "Goldman Sachs projects 250K-1M humanoids in commercial operation. Unit costs approach $10-20K.",
    status: "future" as const,
  },
  {
    year: "2035",
    title: "Millions Deployed",
    description: "ARK Invest projects humanoid market exceeding $24T. Robots outnumber human workers in select verticals.",
    status: "future" as const,
  },
];

const US_VS_CHINA = {
  rows: [
    { metric: "Humanoid Manufacturers", us: "~12", china: "137+" },
    { metric: "Factory Robots Installed 2024", us: "44,303", china: "276,288" },
    { metric: "Government Investment (Robotics)", us: "Limited federal programs", china: "$1.4B+ dedicated humanoid fund" },
    { metric: "Humanoid Production Target 2025", us: "~1,000 (Tesla Optimus)", china: "~40,000 (multiple OEMs)" },
    { metric: "Annual STEM Graduates", us: "~800K", china: "~4.7M" },
  ],
  insight: "China installed more robots in 2024 than the rest of the world combined.",
};

const SECTORS = [
  { name: "Manufacturing", timeline: "NOW", status: "active" as const, description: "Assembly, quality inspection, material handling in structured factory environments." },
  { name: "Logistics", timeline: "NOW", status: "active" as const, description: "Warehouse pick-and-pack, loading docks, last-yard delivery in fulfillment centers." },
  { name: "Security", timeline: "2026", status: "emerging" as const, description: "Patrol, surveillance, perimeter monitoring for commercial and government facilities." },
  { name: "Eldercare", timeline: "2026-28", status: "emerging" as const, description: "Assisted living support, mobility aid, medication reminders, companion presence." },
  { name: "Hospitality", timeline: "2026-27", status: "emerging" as const, description: "Front desk, room service, concierge, and event setup in hotels and venues." },
  { name: "Agriculture", timeline: "2027-28", status: "planned" as const, description: "Harvesting delicate crops, greenhouse management, livestock monitoring." },
  { name: "Construction", timeline: "2027-29", status: "planned" as const, description: "Bricklaying, rebar tying, site inspection, and hazardous environment work." },
  { name: "Medical", timeline: "2028-30", status: "planned" as const, description: "Surgical assistance, patient transport, pharmacy fulfillment, lab automation." },
  { name: "Home", timeline: "2026-30", status: "planned" as const, description: "General household tasks, cleaning, cooking assistance, home maintenance." },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-[#00E5A0]/15", text: "text-[#00E5A0]", label: "Active" },
  emerging: { bg: "bg-[#00C2FF]/15", text: "text-[#00C2FF]", label: "Emerging" },
  planned: { bg: "bg-[#7B2FFF]/15", text: "text-[#7B2FFF]", label: "Planned" },
};

const TIMELINE_STATUS_STYLES: Record<string, { dot: string; line: string }> = {
  active: { dot: "bg-[#00E5A0]", line: "bg-[#00E5A0]/30" },
  upcoming: { dot: "bg-[#00C2FF]", line: "bg-[#00C2FF]/30" },
  future: { dot: "bg-[#7B2FFF]", line: "bg-[#7B2FFF]/20" },
};

/* ── Page Component ── */

export default async function HumanoidHubPage() {
  const supabase = createServerClient();

  // Fetch humanoid robots: by robot_type or by category slug
  const { data: humanoidCategory } = await supabase
    .from("robot_categories")
    .select("id")
    .eq("slug", "humanoid")
    .single();

  let robots: Array<{
    id: string;
    name: string;
    slug: string;
    price_msrp: number | null;
    price_current: number | null;
    description_short: string | null;
    status: string;
    manufacturer: { name: string; country: string | null } | null;
  }> = [];

  // Try robot_type first, then fall back to category
  const { data: byType } = await supabase
    .from("robots")
    .select("id, name, slug, price_msrp, price_current, description_short, status, manufacturer:manufacturers(name, country)")
    .eq("robot_type", "humanoid")
    .eq("status", "active")
    .order("name");

  if (byType && byType.length > 0) {
    robots = byType as typeof robots;
  } else if (humanoidCategory?.id) {
    const { data: byCat } = await supabase
      .from("robots")
      .select("id, name, slug, price_msrp, price_current, description_short, status, manufacturer:manufacturers(name, country)")
      .eq("category_id", humanoidCategory.id)
      .eq("status", "active")
      .order("name");
    if (byCat) robots = byCat as typeof robots;
  }

  const maxPrice = COST_CURVE[0].price;

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumbs ── */}
      <div className="border-b border-border px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Humanoid Intelligence Hub", href: "/humanoid" },
            ]}
          />
        </div>
      </div>

      {/* ── Section 1: Hero ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
            [ HUMANOID INTELLIGENCE ]
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            The Humanoid Revolution
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            The convergence of AI, actuators, compute, and capital is creating a new category of
            machine. This is the definitive intelligence hub for tracking the humanoid robotics
            industry.
          </p>

          {/* Stat counter grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-[var(--theme-surface,#0D1117)] p-4"
              >
                <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-[#00C2FF] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: The Convergence Is Complete ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#7B2FFF]" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
              Why Now
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            The Convergence Is Complete
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Five independent technology curves reached inflection simultaneously. No single
            breakthrough made humanoids viable -- all five did, together.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CONVERGENCE_FORCES.map((force) => (
              <div
                key={force.title}
                className="rounded-lg border border-border bg-[var(--theme-surface,#0D1117)] p-5 transition-colors hover:border-[#7B2FFF]/50"
              >
                <h3 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.06em] text-foreground">
                  {force.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {force.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Cost Curve ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00E5A0]" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
              Economics
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            The Cost Curve Is Collapsing
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Humanoid costs are following a trajectory steeper than smartphones. Unit economics
            cross the labor-cost threshold within 3 years.
          </p>

          {/* Bar chart visualization */}
          <div className="mt-8 space-y-3">
            {/* Human labor reference line */}
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-right font-[family-name:var(--font-mono)] text-xs text-muted sm:w-20">
                Human
              </span>
              <div className="relative flex-1">
                <div
                  className="h-8 rounded bg-[#FF6B6B]/20 border border-dashed border-[#FF6B6B]/40"
                  style={{ width: `${(LABOR_COST_ANNUAL / maxPrice) * 100}%` }}
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-[family-name:var(--font-mono)] text-xs text-[#FF6B6B]">
                  ${LABOR_COST_HOURLY}/hr = ~$95K/yr
                </span>
              </div>
            </div>

            {COST_CURVE.map((point) => {
              const widthPct = Math.max((point.price / maxPrice) * 100, 4);
              const barColor = point.highlight
                ? "bg-[#00E5A0]"
                : point.projected
                  ? "bg-[#7B2FFF]/60"
                  : "bg-[#00C2FF]";

              return (
                <div key={point.year} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-right font-[family-name:var(--font-mono)] text-xs text-muted sm:w-20">
                    {point.year}
                  </span>
                  <div className="relative flex-1">
                    <div
                      className={`h-8 rounded ${barColor} transition-all`}
                      style={{ width: `${widthPct}%` }}
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 font-[family-name:var(--font-mono)] text-xs font-semibold text-foreground">
                      {point.label}
                      {point.sublabel && (
                        <span className="ml-2 font-normal text-muted">
                          {point.sublabel}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-muted">
            E = estimated. Sources: ARK Invest, Bank of America, Goldman Sachs.
          </p>
        </div>
      </section>

      {/* ── Section 4: Deployment Timeline ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00C2FF]" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
              Timeline
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            Deployment Timeline
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            From factory pilots to mass deployment -- the decade-long ramp.
          </p>

          <div className="relative mt-8 ml-4 border-l-2 border-border pl-8 sm:ml-8">
            {DEPLOYMENT_TIMELINE.map((item, i) => {
              const styles = TIMELINE_STATUS_STYLES[item.status];
              return (
                <div key={item.year} className={`relative pb-10 ${i === DEPLOYMENT_TIMELINE.length - 1 ? "pb-0" : ""}`}>
                  {/* Dot on timeline */}
                  <div
                    className={`absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full border-2 border-[var(--theme-bg,#0A0F1E)] ${styles.dot}`}
                  />
                  {/* Year badge */}
                  <span
                    className={`inline-block rounded px-2 py-0.5 font-[family-name:var(--font-brand)] text-xs font-bold ${styles.dot === "bg-[#00E5A0]" ? "bg-[#00E5A0]/15 text-[#00E5A0]" : styles.dot === "bg-[#00C2FF]" ? "bg-[#00C2FF]/15 text-[#00C2FF]" : "bg-[#7B2FFF]/15 text-[#7B2FFF]"}`}
                  >
                    {item.year}
                  </span>
                  <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 5: US vs China Comparison ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#FF6B6B]" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
              Geopolitics
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            US vs China: The Humanoid Race
          </h2>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-muted">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-left font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-[#00C2FF]">
                    United States
                  </th>
                  <th className="px-4 py-3 text-left font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-[#FF6B6B]">
                    China
                  </th>
                </tr>
              </thead>
              <tbody>
                {US_VS_CHINA.rows.map((row) => (
                  <tr key={row.metric} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-sm font-medium text-foreground">
                      {row.metric}
                    </td>
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-muted">{row.us}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-sm font-semibold text-foreground">
                      {row.china}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-lg border border-[#FF6B6B]/30 bg-[#FF6B6B]/5 p-4">
            <p className="text-sm font-medium text-foreground">
              {US_VS_CHINA.insight}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 6: 9 Key Sectors ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00E5A0]" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
              Markets
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            9 Key Sectors for Humanoid Deployment
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((sector) => {
              const statusStyle = STATUS_COLORS[sector.status];
              return (
                <div
                  key={sector.name}
                  className="rounded-lg border border-border bg-[var(--theme-surface,#0D1117)] p-5 transition-colors hover:border-[#00E5A0]/30"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.06em] text-foreground">
                      {sector.name}
                    </h3>
                    <span
                      className={`rounded px-2 py-0.5 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-[0.06em] ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[#00C2FF]">{sector.timeline}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {sector.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 7: Humanoid Robot Directory ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00C2FF]" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
              Directory
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            Humanoid Robot Directory
          </h2>
          <p className="mt-2 text-muted">
            Every humanoid robot in our database, verified with real specifications.
          </p>

          {robots.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {robots.map((robot) => {
                const price = robot.price_current ?? robot.price_msrp;
                const mfr = robot.manufacturer as { name: string; country: string | null } | null;
                return (
                  <Link
                    key={robot.id}
                    href={`/robots/${robot.slug}`}
                    className="group rounded-lg border border-border bg-[var(--theme-surface,#0D1117)] p-5 transition-colors hover:border-[#00C2FF]/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-[#00C2FF] transition-colors">
                          {robot.name}
                        </h3>
                        {mfr && (
                          <p className="mt-0.5 font-[family-name:var(--font-ui)] text-xs text-muted">
                            {mfr.name}
                            {mfr.country && (
                              <span className="ml-1 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.06em] opacity-60">
                                {mfr.country}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      {price != null && (
                        <span className="shrink-0 font-[family-name:var(--font-mono)] text-sm font-bold text-[#00E5A0]">
                          ${price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {robot.description_short && (
                      <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">
                        {robot.description_short}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-[var(--theme-surface,#0D1117)] p-12 text-center">
              <p className="font-[family-name:var(--font-ui)] text-sm text-muted">
                No humanoid robots in the database yet.
              </p>
              <p className="mt-2 text-xs text-muted">
                Our team is actively cataloging humanoid robots with verified specifications.
                Check back soon or{" "}
                <Link href="/newsletter" className="text-[#00C2FF] hover:underline">
                  subscribe to our newsletter
                </Link>{" "}
                for updates.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 8: CTAs ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/find-my-robot"
              className="group rounded-lg border border-[#00C2FF]/30 bg-[#00C2FF]/5 p-6 text-center transition-colors hover:border-[#00C2FF] hover:bg-[#00C2FF]/10"
            >
              <h3 className="font-display text-lg font-bold text-[#00C2FF]">Find My Humanoid</h3>
              <p className="mt-2 text-sm text-muted">
                Answer a few questions and get matched with the right humanoid for your use case.
              </p>
            </Link>
            <Link
              href="/advisor"
              className="group rounded-lg border border-[#7B2FFF]/30 bg-[#7B2FFF]/5 p-6 text-center transition-colors hover:border-[#7B2FFF] hover:bg-[#7B2FFF]/10"
            >
              <h3 className="font-display text-lg font-bold text-[#7B2FFF]">Ask Robotimus</h3>
              <p className="mt-2 text-sm text-muted">
                Our AI advisor can answer your humanoid robotics questions in real time.
              </p>
            </Link>
            <Link
              href="/tools/humanoid-comparison"
              className="group rounded-lg border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-6 text-center transition-colors hover:border-[#00E5A0] hover:bg-[#00E5A0]/10"
            >
              <h3 className="font-display text-lg font-bold text-[#00E5A0]">US vs China Analysis</h3>
              <p className="mt-2 text-sm text-muted">
                Deep-dive comparison of humanoid robotics programs, policy, and production capacity.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sources Attribution ── */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs text-muted">
            Data sourced from ARK Invest, Goldman Sachs, Morgan Stanley, Bank of America, IFR,
            Peter Diamandis Metatrend Report 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
