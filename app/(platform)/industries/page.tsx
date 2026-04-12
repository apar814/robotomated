import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllIndustries } from "@/lib/data/industry-types";
import { createServerClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

export const metadata: Metadata = {
  title: "Industries — Robotics Solutions by Sector | Robotomated",
  description:
    "Explore robotics solutions across 9 industries: warehouse, medical, manufacturing, agriculture, construction, delivery, security, hospitality, and eldercare. Compare robots, ROI data, and deployment guides.",
  openGraph: {
    title: "Industries — Robotics Solutions by Sector | Robotomated",
    description:
      "Explore robotics solutions across 9 industries. Compare robots, ROI data, and deployment guides for every sector.",
    url: "https://robotomated.com/industries",
    type: "website",
    images: [{ url: "/og-industries.png", width: 1200, height: 630, alt: "Robotomated — Robotics by Industry" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-industries.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://robotomated.com/industries",
  },
};

export default async function IndustriesHubPage() {
  const industries = getAllIndustries();
  const supabase = createServerClient();

  // Query real robot counts per category
  const { data: categories } = await supabase
    .from("robot_categories")
    .select("slug, id");

  const catMap = new Map<string, string>();
  categories?.forEach((c: { slug: string; id: string }) => catMap.set(c.slug, c.id));

  // Get counts per category
  const robotCounts = new Map<string, number>();
  for (const industry of industries) {
    const catId = catMap.get(industry.categorySlug);
    if (catId) {
      const { count } = await supabase
        .from("robots")
        .select("id", { count: "exact", head: true })
        .eq("category_id", catId)
        .eq("status", "active");
      robotCounts.set(industry.slug, count || 0);
    } else {
      robotCounts.set(industry.slug, 0);
    }
  }

  const totalRobots = Array.from(robotCounts.values()).reduce((a, b) => a + b, 0);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Robotics by Industry",
          description: "Explore robotics solutions across 9 industries.",
          url: "https://robotomated.com/industries",
          publisher: { "@type": "Organization", name: "Robotomated" },
          hasPart: industries.map((ind) => ({
            "@type": "WebPage",
            name: ind.name,
            url: `https://robotomated.com/industries/${ind.slug}`,
          })),
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0A0F1E] px-4 pb-24 pt-14">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1E]" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Industries", href: "/industries" },
            ]}
          />
          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Robotics by Industry
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/50">
            Every industry has unique automation challenges. Deep guides with
            robot comparisons, ROI calculators, compliance requirements, and real
            deployment case studies.
          </p>

          {/* Big stat cards */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-6 backdrop-blur-sm">
              <p className="font-mono text-4xl font-extrabold text-[#00C2FF]">
                9
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
                Industries
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-6 backdrop-blur-sm">
              <p className="font-mono text-4xl font-extrabold text-[#7B2FFF]">
                $140B+
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
                Combined Market
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-6 backdrop-blur-sm">
              <p className="font-mono text-4xl font-extrabold text-[#00E5A0]">
                {totalRobots}+
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
                Robots Tracked
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY CARDS GRID ── */}
      <section className="bg-[#0A0F1E] px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => {
              const count = robotCounts.get(industry.slug) || 0;
              return (
                <RevealOnScroll
                  key={industry.slug}
                  delay={Math.min(i % 3, 2) as 0 | 1 | 2}
                >
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] transition-all hover:-translate-y-1 hover:border-[#00C2FF]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                  >
                    {/* Background image */}
                    <Image
                      src={industry.heroImage}
                      alt={industry.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/80 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      {/* Robot count badge */}
                      {count > 0 && (
                        <span className="mb-3 inline-block rounded-full bg-[#00C2FF]/15 px-3 py-1 font-mono text-[11px] font-bold text-[#00C2FF] backdrop-blur-sm">
                          {count} robots
                        </span>
                      )}

                      <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-white transition-colors group-hover:text-[#00C2FF]">
                        {industry.name}
                      </h2>

                      {/* Market stats inline */}
                      <div className="mt-2 flex items-center gap-3">
                        {industry.marketStats.slice(0, 2).map((stat) => (
                          <span
                            key={stat.label}
                            className="text-xs text-white/50"
                          >
                            <span className="font-mono font-bold text-white/70">
                              {stat.value}
                            </span>{" "}
                            {stat.label}
                          </span>
                        ))}
                      </div>

                      {/* Use case tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {industry.types.slice(0, 3).map((type) => (
                          <span
                            key={type.id}
                            className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] text-white/50 backdrop-blur-sm"
                          >
                            {type.label}
                          </span>
                        ))}
                        {industry.types.length > 3 && (
                          <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] text-white/50">
                            +{industry.types.length - 3}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#00C2FF] opacity-0 transition-opacity group-hover:opacity-100">
                        Explore {industry.name.split(" ")[0]}
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#00C2FF]/[0.05] to-[#7B2FFF]/[0.05] p-8 text-center sm:p-12">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">
                Not sure which industry to start with?
              </h2>
              <p className="mt-3 text-base text-white/60">
                Robotimus can recommend robots based on your specific use
                case, budget, and requirements.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/advisor"
                  className="rounded-lg bg-[#00C2FF] px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Ask Robotimus
                </Link>
                <Link
                  href="/explore"
                  className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-8 py-3 text-sm font-semibold text-white/80 hover:border-white/20"
                >
                  Browse All Robots
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
