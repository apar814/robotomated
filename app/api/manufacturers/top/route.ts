import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  // Get manufacturers that have robots, ordered by robot count
  const { data: robots } = await supabase
    .from("robots")
    .select("manufacturer_id")
    .eq("status", "active");

  const counts: Record<string, number> = {};
  (robots || []).forEach((r) => {
    counts[r.manufacturer_id] = (counts[r.manufacturer_id] || 0) + 1;
  });

  const topIds = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([id]) => id);

  if (topIds.length === 0) {
    return NextResponse.json({ manufacturers: [] });
  }

  const { data: manufacturers } = await supabase
    .from("manufacturers")
    .select("name, logo_url, website")
    .in("id", topIds);

  return NextResponse.json({ manufacturers: manufacturers || [] });
}
