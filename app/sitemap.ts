import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { getAllIndustrySlugs } from "@/lib/data/industry-types";

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

  // Comparison pairs for top robots
  const topRobots = robots.slice(0, 10);
  const comparePages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < topRobots.length; i++) {
    for (let j = i + 1; j < topRobots.length; j++) {
      const [a, b] = [topRobots[i].slug, topRobots[j].slug].sort();
      comparePages.push({
        url: `${BASE_URL}/compare/${a}-vs-${b}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      });
    }
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...robotPages,
    ...bestPages,
    ...manufacturerPages,
    ...industryPages,
    ...comparePages,
  ];
}
