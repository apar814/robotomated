import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getFirecrawl } from "@/lib/firecrawl";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const log: string[] = [];

  try {
    const firecrawl = getFirecrawl();

    // 1. Enrich specs for robots with < 5 spec fields
    const { data: sparseRobots } = await supabase
      .from("robots").select("id, slug, name, specs, manufacturers(name)")
      .eq("status", "active").order("robo_score", { ascending: false, nullsFirst: false }).limit(50);

    const needSpecs = (sparseRobots || []).filter(r => {
      const specs = r.specs as Record<string, unknown> | null;
      return !specs || Object.keys(specs).length < 5;
    }).slice(0, 5);

    for (const robot of needSpecs) {
      const mfr = (robot.manufacturers as { name: string } | null)?.name || "";
      try {
        const results = await firecrawl.search(`${robot.name} ${mfr} specifications`, { limit: 2 });
        const topResult = (results.web || [])[0] as { url?: string } | undefined;

        if (topResult?.url) {
          const scrape = await firecrawl.scrape(topResult.url, {
            formats: [{ type: "json" as const, schema: {
              payload_kg: { type: "number" }, weight_kg: { type: "number" },
              battery_hrs: { type: "number" }, max_speed: { type: "string" },
            }}],
          });

          const extracted = scrape.json as Record<string, unknown> | undefined;
          if (extracted) {
            const existing = (robot.specs || {}) as Record<string, unknown>;
            const merged = { ...existing };
            let added = 0;
            for (const [k, v] of Object.entries(extracted)) {
              if (v != null && v !== "" && !(k in merged)) { merged[k] = v; added++; }
            }
            if (added > 0) {
              await supabase.from("robots").update({ specs: JSON.parse(JSON.stringify(merged)) }).eq("id", robot.id);
              log.push(`Specs: ${robot.name} +${added} fields`);
            }
          }
        }
      } catch (err) {
        log.push(`Specs error: ${robot.name} — ${err instanceof Error ? err.message : "unknown"}`);
      }
    }

    // 2. Refresh expert review cache for top robots
    let refreshed = 0;
    const { data: topRobots } = await supabase
      .from("robots").select("slug").eq("status", "active")
      .not("robo_score", "is", null).order("robo_score", { ascending: false }).limit(5);

    for (const r of topRobots || []) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://robotomated.vercel.app";
        await fetch(`${appUrl}/api/robots/${r.slug}/expert-reviews`);
        refreshed++;
      } catch { /* ignore */ }
    }
    if (refreshed > 0) log.push(`Reviews: refreshed ${refreshed} robots`);

    // 3. Log price monitoring eligibility
    const { count } = await supabase
      .from("robots").select("id", { count: "exact", head: true })
      .not("price_current", "is", null).eq("status", "active");
    log.push(`Prices: ${count || 0} robots eligible for monitoring`);

    // 4. Image health check — flag external images that have broken
    const isSupabaseUrl = (url: string) => url.includes("supabase.co/storage");
    const { data: imgRobots } = await supabase
      .from("robots").select("id, slug, name, images, manufacturers(name)")
      .eq("status", "active").not("images", "is", null).limit(100);

    let brokenImages = 0;
    for (const robot of (imgRobots || []).slice(0, 30)) {
      const imgs = (Array.isArray(robot.images) ? robot.images : []) as { url: string }[];
      const url = imgs[0]?.url;
      if (!url || isSupabaseUrl(url) || url.includes("unsplash")) continue;

      try {
        const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(8000) });
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.startsWith("image/")) {
          brokenImages++;
          log.push(`Broken image: ${robot.name} (${res.status} ${ct.substring(0, 20)})`);
        }
      } catch {
        brokenImages++;
        log.push(`Broken image: ${robot.name} (timeout/error)`);
      }
    }
    if (brokenImages > 0) {
      log.push(`Images: ${brokenImages} broken external images detected — run fix-all-images.ts`);
    } else {
      log.push(`Images: all checked images healthy`);
    }

  } catch (err) {
    log.push(`Fatal: ${err instanceof Error ? err.message : "unknown"}`);
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString(), log });
}
