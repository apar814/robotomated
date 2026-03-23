import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://robotomated.com";

interface SlugRow { slug: string; updated_at?: string; created_at?: string }
interface CatRow { slug: string; created_at: string }
interface MfrRow { slug: string; created_at: string }
interface RobotWithCat { slug: string; updated_at: string; robot_categories: { slug: string } | null }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const robots = robotsRes.data || [];
  const categories = categoriesRes.data || [];
  const manufacturers = manufacturersRes.data || [];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

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
    url: `${BASE_URL}/robots/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Generate comparison pairs for top robots
  const topRobots = robots.slice(0, 10);
  const comparePages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < topRobots.length; i++) {
    for (let j = i + 1; j < topRobots.length; j++) {
      const slugA = topRobots[i].slug;
      const slugB = topRobots[j].slug;
      if (slugA < slugB) {
        comparePages.push({
          url: `${BASE_URL}/compare/${slugA}-vs-${slugB}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        });
      } else {
        comparePages.push({
          url: `${BASE_URL}/compare/${slugB}-vs-${slugA}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        });
      }
    }
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...robotPages,
    ...bestPages,
    ...manufacturerPages,
    ...comparePages,
  ];
}
