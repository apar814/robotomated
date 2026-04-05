import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";

interface SearchResult {
  robots: {
    id: string;
    slug: string;
    name: string;
    robo_score: number | null;
    price_current: number | null;
    category_slug: string | null;
    category_name: string | null;
    manufacturer_name: string | null;
    manufacturer_slug: string | null;
    image_url: string | null;
  }[];
  manufacturers: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
  query: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "8", 10) || 8, 1),
    50
  );

  if (!query) {
    return NextResponse.json({
      robots: [],
      manufacturers: [],
      categories: [],
      query: "",
    });
  }

  const cacheKey = `search:${query.toLowerCase()}:${limit}`;

  const results = await cached<SearchResult>(cacheKey, 60, async () => {
    const supabase = createServerClient();
    const pattern = `%${query}%`;

    const [robotsRes, manufacturersRes, categoriesRes] = await Promise.all([
      supabase
        .from("robots")
        .select(
          "id, slug, name, robo_score, price_current, images, manufacturers(name, slug), robot_categories(name, slug)"
        )
        .ilike("name", pattern)
        .eq("status", "active")
        .order("robo_score", { ascending: false, nullsFirst: false })
        .limit(limit),

      supabase
        .from("manufacturers")
        .select("id, name, slug")
        .ilike("name", pattern)
        .limit(3),

      supabase
        .from("robot_categories")
        .select("id, name, slug")
        .ilike("name", pattern)
        .limit(3),
    ]);

    const robots = (robotsRes.data ?? []).map((row: Record<string, unknown>) => {
      const manufacturer = row.manufacturers as { name: string; slug: string } | null;
      const category = row.robot_categories as { name: string; slug: string } | null;
      const images = row.images as { url: string; alt: string }[] | null;

      return {
        id: row.id as string,
        slug: row.slug as string,
        name: row.name as string,
        robo_score: row.robo_score as number | null,
        price_current: row.price_current as number | null,
        category_slug: category?.slug ?? null,
        category_name: category?.name ?? null,
        manufacturer_name: manufacturer?.name ?? null,
        manufacturer_slug: manufacturer?.slug ?? null,
        image_url: images?.[0]?.url ?? null,
      };
    });

    return {
      robots,
      manufacturers: manufacturersRes.data ?? [],
      categories: categoriesRes.data ?? [],
      query,
    };
  });

  return NextResponse.json(results);
}
