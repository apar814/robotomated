import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { getAllIndustrySlugs } from "@/lib/data/industry-types";
import { getAllCaseStudySlugs } from "@/lib/data/case-studies";
import { GLOSSARY_TERMS } from "@/lib/learn/glossary-index";
import { EXPLAINERS } from "@/lib/learn/explainers";
import { PUBLISHED_MDX } from "@/lib/learn/published-mdx";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://robotomated.com";

interface CatRow { slug: string; created_at: string }
interface MfrRow { slug: string; created_at: string }
interface RobotWithCat { slug: string; updated_at: string; robot_categories: { slug: string } | null }


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages always included regardless of DB state
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/methodology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/tools/tco-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/manufacturers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/advisor`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/newsletter/leaderboard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE_URL}/case-studies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/robowork`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/robowork/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/robowork/providers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/robowork/post`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/manufacturers/claim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/manufacturers/partner`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/find-my-robot`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/developers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/market`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/market/funding`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/market/investors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/market/reports`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/industries`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/robot-finder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/tools/maintenance-estimator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/pro`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/lease`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/lease/quote`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/lease/transfer`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/lease/timeshare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/certify`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/certify/foundation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/certify/specialist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/certify/master`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/certify/fleet-commander`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/service`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/parts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/trade-in`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/cpo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/insure`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/status`, lastModified: new Date(), changeFrequency: "daily", priority: 0.3 },
    { url: `${BASE_URL}/robowork/founding-rsp`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/robowork/referrals`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/enterprise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/explore/humanoid`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/tools/humanoid-comparison`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/robot-economics`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/humanoid`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/intelligence`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/careers/path`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/eldercare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/standards`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/enterprise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/finance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/employers/hire-certified-operators`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/certification/operator-level-1`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  // Industry pages (static data, no DB needed)
  const industryPages: MetadataRoute.Sitemap = getAllIndustrySlugs().map((slug) => ({
    url: `${BASE_URL}/industries/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic pages from Supabase — wrapped in try/catch so sitemap never 500s
  let robots: RobotWithCat[] = [];
  let categories: CatRow[] = [];
  let manufacturers: MfrRow[] = [];

  try {
    const supabase = createServerClient();

    const [robotsRes, categoriesRes, manufacturersRes] = await Promise.all([
      supabase
        .from("robots")
        .select("slug, updated_at, robot_categories(slug)")
        .eq("status", "active")
        .returns<RobotWithCat[]>(),
      supabase.from("robot_categories").select("slug, created_at").returns<CatRow[]>(),
      supabase.from("manufacturers").select("slug, created_at").returns<MfrRow[]>(),
    ]);

    robots = robotsRes.data || [];
    categories = categoriesRes.data || [];
    manufacturers = manufacturersRes.data || [];
  } catch (err) {
    // Log but don't crash — return static pages at minimum
    console.error("[sitemap] Supabase fetch failed:", err);
  }

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/explore/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const robotPages: MetadataRoute.Sitemap = robots.map((r) => {
    const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "all";
    return {
      url: `${BASE_URL}/explore/${catSlug}/${r.slug}`,
      lastModified: new Date(r.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const bestPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/best/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const manufacturerPages: MetadataRoute.Sitemap = manufacturers.map((m) => ({
    url: `${BASE_URL}/manufacturers/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Comparison pairs — top robots within each category + cross-category leaders
  const compareSet = new Set<string>();
  // Group robots by category for intra-category comparisons
  const byCat = new Map<string, typeof robots>();
  for (const r of robots) {
    const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "other";
    if (!byCat.has(catSlug)) byCat.set(catSlug, []);
    byCat.get(catSlug)!.push(r);
  }
  // Top 6 per category — all pairs within each category
  for (const [, catRobots] of byCat) {
    const top = catRobots.slice(0, 6);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const [a, b] = [top[i].slug, top[j].slug].sort();
        compareSet.add(`${a}-vs-${b}`);
      }
    }
  }
  // Cross-category: top 2 per category vs each other
  const crossLeaders = [...byCat.values()].flatMap(r => r.slice(0, 2));
  for (let i = 0; i < crossLeaders.length; i++) {
    for (let j = i + 1; j < Math.min(crossLeaders.length, i + 4); j++) {
      const [a, b] = [crossLeaders[i].slug, crossLeaders[j].slug].sort();
      compareSet.add(`${a}-vs-${b}`);
    }
  }
  const comparePages: MetadataRoute.Sitemap = [...compareSet].map(pair => ({
    url: `${BASE_URL}/compare/${pair}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Learn MDX content — containment 2026-08-11: only allowlisted articles
  // are published (lib/learn/published-mdx.ts); everything else is
  // unpublished and returns 410, so it must not appear here.
  const learnPages: MetadataRoute.Sitemap = [...PUBLISHED_MDX].map(key => ({
    url: `${BASE_URL}/learn/${key}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Learn layer: glossary + field-guide explainers
  const glossaryPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/learn/glossary`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    ...GLOSSARY_TERMS.map(t => ({
      url: `${BASE_URL}/learn/glossary/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
  const explainerPages: MetadataRoute.Sitemap = EXPLAINERS.map(e => ({
    url: `${BASE_URL}/learn/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Case study slugs — from the canonical data module, not MDX. The old
  // fallback to content/guides emitted guide slugs as broken case-study URLs.
  const caseStudySlugs = getAllCaseStudySlugs();
  const caseStudyPages: MetadataRoute.Sitemap = caseStudySlugs.map(slug => ({
    url: `${BASE_URL}/case-studies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...robotPages,
    ...bestPages,
    ...manufacturerPages,
    ...industryPages,
    ...comparePages,
    ...learnPages,
    ...glossaryPages,
    ...explainerPages,
    ...caseStudyPages,
  ];
}
