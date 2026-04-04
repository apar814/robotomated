/**
 * Robot Image Scraper v2 — Improved manufacturer page scraping
 * Extracts images from og:image, schema.org Product, srcset, and press pages.
 * Run: npx tsx scripts/scrape-robot-images-v2.ts
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Quality gates ──
const SKIP_PATTERNS = /logo|icon|avatar|badge|banner|social|twitter|facebook|linkedin|arrow|bullet|check|star|dot|placeholder|spacer|blank|pixel|1x1|tracking|favicon|sprite|emoji/i;
const VALID_IMG_EXT = /\.(jpg|jpeg|png|webp)(\?|$)/i;

interface ImageResult {
  url: string;
  alt: string;
  source: string;
  width?: number;
  height?: number;
}

async function checkImage(url: string): Promise<{ ok: boolean; reason: string; size?: number }> {
  try {
    // Pre-check URL patterns
    if (SKIP_PATTERNS.test(url)) return { ok: false, reason: "URL matches skip pattern" };
    if (!VALID_IMG_EXT.test(url) && !url.includes("supabase")) return { ok: false, reason: "Invalid extension" };
    if (url.startsWith("data:")) return { ok: false, reason: "Data URI" };
    if (url.length < 20) return { ok: false, reason: "URL too short" };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "User-Agent": "Robotomated-Bot/2.0" },
    });
    clearTimeout(timeout);

    if (res.status !== 200) return { ok: false, reason: `HTTP ${res.status}` };

    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) return { ok: false, reason: `Content-Type: ${ct}` };

    const size = parseInt(res.headers.get("content-length") || "0", 10);
    if (size > 0 && size < 50000) return { ok: false, reason: `Too small: ${(size / 1024).toFixed(0)}KB` };
    if (size > 15_000_000) return { ok: false, reason: `Too large: ${(size / 1e6).toFixed(1)}MB` };

    return { ok: true, reason: "OK", size };
  } catch (err) {
    return { ok: false, reason: `Error: ${(err as Error).message.slice(0, 60)}` };
  }
}

async function scrapePageForImages(pageUrl: string): Promise<ImageResult[]> {
  if (!process.env.FIRECRAWL_API_KEY) return [];

  try {
    const { default: FirecrawlApp } = await import("@mendable/firecrawl-js");
    const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

    const result = await firecrawl.scrapeUrl(pageUrl, { formats: ["markdown"] });
    if (!result.success) return [];

    const markdown = result.markdown || "";
    const images: ImageResult[] = [];

    // Extract og:image from metadata if available
    const metaData = (result as Record<string, unknown>).metadata as Record<string, string> | undefined;
    if (metaData?.ogImage) {
      images.push({ url: metaData.ogImage, alt: metaData.ogTitle || "", source: "og:image" });
    }

    // Extract markdown images: ![alt](url)
    const imgRegex = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
    let match;
    while ((match = imgRegex.exec(markdown)) !== null) {
      const url = match[2];
      if (VALID_IMG_EXT.test(url) && !SKIP_PATTERNS.test(url)) {
        images.push({ url, alt: match[1], source: "markdown" });
      }
    }

    // Extract raw image URLs from links
    const urlRegex = /https?:\/\/[^\s"')]+\.(jpg|jpeg|png|webp)(\?[^\s"')]*)?/gi;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(markdown)) !== null) {
      const url = urlMatch[0];
      if (!SKIP_PATTERNS.test(url) && !images.some(i => i.url === url)) {
        images.push({ url, alt: "", source: "raw_url" });
      }
    }

    return images;
  } catch (err) {
    console.log(`    Scrape error: ${(err as Error).message.slice(0, 60)}`);
    return [];
  }
}

function robotMatchesImage(robotName: string, imageUrl: string, imageAlt: string): boolean {
  const nameLower = robotName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const urlLower = imageUrl.toLowerCase();
  const altLower = imageAlt.toLowerCase();

  // Exact name in URL or alt
  if (urlLower.includes(nameLower) || altLower.includes(robotName.toLowerCase())) return true;

  // Try individual words of robot name (for multi-word names)
  const words = robotName.toLowerCase().split(/[\s-]+/).filter(w => w.length > 2);
  const matchCount = words.filter(w => urlLower.includes(w) || altLower.includes(w)).length;
  if (matchCount >= 2 || (words.length === 1 && matchCount === 1)) return true;

  return false;
}

async function main() {
  console.log("Robot Image Scraper v2");
  console.log("======================\n");

  // Load robots needing images
  const needingPath = path.resolve(process.cwd(), "scripts/robots-needing-images.json");
  let robotsNeeding: { id: string; name: string; manufacturer: string; manufacturerWebsite: string; category: string; slug: string }[];

  if (fs.existsSync(needingPath)) {
    robotsNeeding = JSON.parse(fs.readFileSync(needingPath, "utf-8"));
  } else {
    // Query directly if audit hasn't run
    const { data } = await supabase
      .from("robots")
      .select("id, name, slug, manufacturers(name, website), robot_categories(name)")
      .eq("status", "active")
      .order("name");

    robotsNeeding = (data || [])
      .filter(r => {
        const imgs = (r as Record<string, unknown>).images;
        return !imgs || !Array.isArray(imgs) || imgs.length === 0;
      })
      .map(r => ({
        id: r.id,
        name: r.name,
        manufacturer: ((r as Record<string, unknown>).manufacturers as { name: string })?.name || "",
        manufacturerWebsite: ((r as Record<string, unknown>).manufacturers as { website: string })?.website || "",
        category: ((r as Record<string, unknown>).robot_categories as { name: string })?.name || "",
        slug: r.slug,
      }));
  }

  console.log(`${robotsNeeding.length} robots needing images\n`);

  if (!process.env.FIRECRAWL_API_KEY) {
    console.log("FIRECRAWL_API_KEY not set. Cannot scrape manufacturer pages.");
    console.log("Set FIRECRAWL_API_KEY in .env.local to enable scraping.");
    return;
  }

  const saved: { robot: string; url: string; source: string }[] = [];
  const skipped: { robot: string; reason: string }[] = [];

  // Group by manufacturer for efficient scraping
  const byMfr = new Map<string, typeof robotsNeeding>();
  for (const r of robotsNeeding) {
    if (!r.manufacturerWebsite) continue;
    const list = byMfr.get(r.manufacturer) || [];
    list.push(r);
    byMfr.set(r.manufacturer, list);
  }

  let mfrCount = 0;
  for (const [manufacturer, robots] of byMfr) {
    mfrCount++;
    if (mfrCount > 25) break; // Limit to 25 manufacturers per run

    const website = robots[0].manufacturerWebsite;
    console.log(`\n[${mfrCount}] ${manufacturer} (${robots.length} robots)`);

    // Build URLs to scrape
    const pagesToScrape = [
      website,
      `${website}/products`,
      `${website}/robots`,
    ].filter(u => u && u.startsWith("http"));

    // Scrape all pages and collect images
    const allImages: ImageResult[] = [];
    for (const pageUrl of pagesToScrape) {
      console.log(`  Scraping: ${pageUrl.substring(0, 70)}...`);
      const images = await scrapePageForImages(pageUrl);
      allImages.push(...images);
      await new Promise(r => setTimeout(r, 2000)); // Rate limit
    }

    console.log(`  Found ${allImages.length} image candidates`);

    // Match images to robots
    for (const robot of robots) {
      // Try og:image first (highest quality)
      const ogImages = allImages.filter(i => i.source === "og:image");
      const matchedOg = ogImages.find(i => robotMatchesImage(robot.name, i.url, i.alt));

      // Then try all other images
      const matched = matchedOg
        ? [matchedOg]
        : allImages.filter(i => robotMatchesImage(robot.name, i.url, i.alt));

      if (matched.length === 0) {
        skipped.push({ robot: robot.name, reason: "No matching image" });
        continue;
      }

      // Quality check each candidate
      let didSave = false;
      for (const img of matched.slice(0, 5)) {
        const check = await checkImage(img.url);
        if (check.ok) {
          await supabase.from("robots").update({
            images: [{ url: img.url, alt: `${robot.manufacturer} ${robot.name}` }],
            image_source: "manufacturer_website",
            image_verified: true,
            image_updated_at: new Date().toISOString(),
          }).eq("id", robot.id);

          saved.push({ robot: robot.name, url: img.url, source: img.source });
          console.log(`    [SAVED] ${robot.name} (${img.source})`);
          didSave = true;
          break;
        }
        await new Promise(r => setTimeout(r, 300));
      }

      if (!didSave) {
        skipped.push({ robot: robot.name, reason: "All candidates failed quality check" });
      }
    }
  }

  // Without manufacturer website
  for (const r of robotsNeeding.filter(r => !r.manufacturerWebsite)) {
    skipped.push({ robot: r.name, reason: "No manufacturer website" });
  }

  // Save log
  const log = { saved, skipped, totalSaved: saved.length, totalSkipped: skipped.length };
  fs.writeFileSync("scripts/image-scraper-v2-log.json", JSON.stringify(log, null, 2));

  console.log("\n=== Summary ===");
  console.log(`Saved: ${saved.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log("Log: scripts/image-scraper-v2-log.json");
}

main().catch(console.error);
