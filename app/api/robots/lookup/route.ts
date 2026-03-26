import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/robots/lookup?slugs=slug1,slug2,slug3
 * Returns robot data for the given slugs (max 5).
 */
export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get("slugs");
  if (!slugsParam) {
    return NextResponse.json({ robots: [] });
  }

  const slugs = slugsParam.split(",").slice(0, 5).map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) {
    return NextResponse.json({ robots: [] });
  }

  const supabase = createServerClient();
  const { data } = await supabase
    .from("robots")
    .select("slug, name, robo_score, price_current, images, robot_categories(slug)")
    .in("slug", slugs)
    .eq("status", "active")
    .returns<{
      slug: string;
      name: string;
      robo_score: number | null;
      price_current: number | null;
      images: unknown;
      robot_categories: { slug: string } | null;
    }[]>();

  const robots = (data || []).map((r) => {
    const imgs = r.images as { url: string; alt?: string }[] | null;
    const imageUrl = imgs?.[0]?.url || null;
    const catSlug = (r.robot_categories as { slug: string } | null)?.slug || "all";
    return {
      slug: r.slug,
      name: r.name,
      score: r.robo_score,
      price: r.price_current,
      category: catSlug,
      image_url: imageUrl,
    };
  });

  return NextResponse.json({ robots }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
