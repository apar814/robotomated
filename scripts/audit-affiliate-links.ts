/**
 * Affiliate Link Audit — find and populate missing affiliate_url fields
 * Uses manufacturer websites to locate product/buy pages.
 * Run: npx tsx scripts/audit-affiliate-links.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

interface RobotRow {
  id: string;
  slug: string;
  name: string;
  affiliate_url: string | null;
  manufacturers: { name: string; website: string | null } | null;
}

async function findProductUrl(robotName: string, mfrName: string, mfrWebsite: string | null): Promise<string | null> {
  // Strategy 1: Search Firecrawl for official product page
  try {
    const query = `${robotName} ${mfrName} buy product page site:${mfrWebsite?.replace(/^https?:\/\//, "").replace(/\/$/, "") || mfrName.toLowerCase().replace(/\s+/g, "") + ".com"}`;
    const result = await firecrawl.search(query, { limit: 3 });
    if (result.success && result.data?.length) {
      // Prefer URLs from the manufacturer's own domain
      const domain = mfrWebsite?.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase() || "";
      for (const item of result.data) {
        const url = (item as { url?: string }).url;
        if (url && domain && url.toLowerCase().includes(domain)) {
          return url;
        }
      }
      // Fall back to first result if it looks like a product page
      const firstUrl = (result.data[0] as { url?: string }).url;
      if (firstUrl && !firstUrl.includes("wikipedia") && !firstUrl.includes("youtube")) {
        return firstUrl;
      }
    }
  } catch (e) {
    // Firecrawl search failed
  }

  // Strategy 2: Use manufacturer website directly
  if (mfrWebsite) {
    return mfrWebsite;
  }

  return null;
}

async function main() {
  console.log("═══ Affiliate Link Audit ═══\n");

  // Fetch all robots
  const { data: robots, error } = await supabase
    .from("robots")
    .select("id, slug, name, affiliate_url, manufacturers(name, website)")
    .eq("status", "active")
    .order("name")
    .returns<RobotRow[]>();

  if (error || !robots) {
    console.error("Failed to fetch robots:", error?.message);
    return;
  }

  const total = robots.length;
  const missing = robots.filter(r => !r.affiliate_url);
  const existing = total - missing.length;

  console.log(`Total active robots: ${total}`);
  console.log(`Already have affiliate_url: ${existing}`);
  console.log(`Missing affiliate_url: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log("[OK] All robots have affiliate URLs!");
    return;
  }

  let filled = 0;
  let failed = 0;

  for (let i = 0; i < missing.length; i++) {
    const r = missing[i];
    const mfr = r.manufacturers as { name: string; website: string | null } | null;
    const mfrName = mfr?.name || "Unknown";
    const mfrWebsite = mfr?.website || null;

    process.stdout.write(`[${i + 1}/${missing.length}] ${r.name} (${mfrName})... `);

    const url = await findProductUrl(r.name, mfrName, mfrWebsite);

    if (url) {
      const { error: updateErr } = await supabase
        .from("robots")
        .update({ affiliate_url: url })
        .eq("id", r.id);

      if (updateErr) {
        console.log(`[ERR] DB error: ${updateErr.message}`);
        failed++;
      } else {
        console.log(`[OK] ${url.slice(0, 80)}`);
        filled++;
      }
    } else {
      console.log("[ERR] No URL found");
      failed++;
    }

    // Rate limit
    if (i < missing.length - 1) await delay(1000);
  }

  console.log(`\n${"═".repeat(50)}`);
  console.log(`[STATS] Affiliate Link Audit Results`);
  console.log(`${"═".repeat(50)}`);
  console.log(`  Total robots:     ${total}`);
  console.log(`  Already had URL:  ${existing}`);
  console.log(`  Newly filled:     ${filled}`);
  console.log(`  Still missing:    ${failed}`);
  console.log(`  Coverage:         ${Math.round((existing + filled) / total * 100)}%`);
  console.log(`${"═".repeat(50)}`);
}

main().catch(console.error);
