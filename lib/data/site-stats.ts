import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";

export interface SiteStats {
  robotCount: number;
  manufacturerCount: number;
  categoryCount: number;
}

export async function getSiteStats(): Promise<SiteStats> {
  return cached<SiteStats>("site:stats:v1", 3600, async () => {
    const supabase = createServerClient();

    const [robotRes, mfrRes, catRes] = await Promise.all([
      supabase.from("robots").select("id", { count: "exact", head: true }),
      supabase.from("manufacturers").select("id", { count: "exact", head: true }),
      supabase.from("robot_categories").select("id", { count: "exact", head: true }),
    ]);

    return {
      robotCount: robotRes.count || 0,
      manufacturerCount: mfrRes.count || 0,
      categoryCount: catRes.count || 0,
    };
  });
}
