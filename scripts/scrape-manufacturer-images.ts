/**
 * Manufacturer Image Scraper
 * Scrapes manufacturer product pages for robot images via Firecrawl.
 * Run: npx tsx scripts/scrape-manufacturer-images.ts
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

const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY;

// ── Quality gate ──
const LOGO_PATTERNS = /logo|icon|badge|avatar|favicon|sprite/i;
const VALID_EXTENSIONS = /\.(jpg|jpeg|png|webp)(\?|$)/i;

interface ImageCandidate {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

async function checkImageQuality(url: string): Promise<{ passes: boolean; reason: string; contentLength?: number }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "User-Agent": "Robotomated-ImageBot/1.0" },
    });
    clearTimeout(timeout);

    if (res.status !== 200) return { passes: false, reason: `HTTP ${res.status}` };

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return { passes: false, reason: `Content-Type: ${contentType}` };

    const contentLength = parseInt(res.headers.get("content-length") || "0", 10);
    if (contentLength > 0 && contentLength < 50000) return { passes: false, reason: `Too small: ${contentLength} bytes` };
    if (contentLength > 15_000_000) return { passes: false, reason: `Too large: ${contentLength} bytes` };

    // Check filename for logos
    const filename = url.split("/").pop()?.split("?")[0] || "";
    if (LOGO_PATTERNS.test(filename)) return { passes: false, reason: "Filename suggests logo/icon" };

    // Check extension
    if (!VALID_EXTENSIONS.test(url)) return { passes: false, reason: "Invalid extension" };

    return { passes: true, reason: "OK", contentLength };
  } catch (err) {
    return { passes: false, reason: `Fetch error: ${(err as Error).message}` };
  }
}

// ── Robot-image matching ──
const ROBOT_HINTS: Record<string, string[]> = {
  "Spot": ["spot", "spot-robot", "spot-ent", "spot_enterprise"],
  "Stretch": ["stretch", "stretch-robot"],
  "Atlas": ["atlas", "atlas-robot"],
  "UR5e": ["ur5e", "ur5", "ur-5e"],
  "UR10e": ["ur10e", "ur10", "ur-10e"],
  "UR16e": ["ur16e", "ur16"],
  "UR20": ["ur20", "ur-20"],
  "CRX-10iA": ["crx-10", "crx10", "crx"],
  "da Vinci": ["davinci", "da-vinci", "surgical"],
  "Roomba": ["roomba"],
  "Digit": ["digit", "digit-robot"],
  "Optimus": ["optimus", "tesla-bot"],
  "Chuck": ["chuck", "6river"],
  "Relay": ["relay", "savioke"],
};

function matchesRobot(imageUrl: string, imageAlt: string, robotName: string): boolean {
  const lowerUrl = imageUrl.toLowerCase();
  const lowerAlt = (imageAlt || "").toLowerCase();
  const lowerName = robotName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Direct name match in URL or alt
  if (lowerUrl.includes(lowerName) || lowerAlt.includes(robotName.toLowerCase())) return true;

  // Hint-based matching
  const hints = ROBOT_HINTS[robotName];
  if (hints) {
    for (const hint of hints) {
      if (lowerUrl.includes(hint) || lowerAlt.includes(hint)) return true;
    }
  }

  return false;
}

// ── Manufacturer pages ──
const MANUFACTURER_PAGES: Record<string, string[]> = {
  "Boston Dynamics": ["https://bostondynamics.com/products/spot/", "https://bostondynamics.com/products/stretch/"],
  "Universal Robots": ["https://www.universal-robots.com/products/"],
  "FANUC": ["https://www.fanucamerica.com/products/robots/"],
  "iRobot": ["https://www.irobot.com/en_US/roomba.html"],
  "DJI": ["https://store.dji.com/"],
  "Locus Robotics": ["https://locusrobotics.com/products/"],
  "Agility Robotics": ["https://agilityrobotics.com/digit"],
  "ABB Robotics": ["https://new.abb.com/products/robotics/"],
  "KUKA": ["https://www.kuka.com/en-us/products/"],
  "Roborock": ["https://us.roborock.com/pages/robot-vacuum-cleaner"],
  "Nuro": ["https://www.nuro.ai/product"],
};

interface ScrapeResult {
  robot: string;
  manufacturer: string;
  source: string;
  imageUrl: string;
  quality: string;
  timestamp: string;
}

async function scrapePageForImages(pageUrl: string): Promise<ImageCandidate[]> {
  if (!FIRECRAWL_KEY) {
    console.log("  [SKIP] FIRECRAWL_API_KEY not set");
    return [];
  }

  try {
    const { default: FirecrawlApp } = await import("@mendable/firecrawl-js");
    const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_KEY });

    const result = await firecrawl.scrapeUrl(pageUrl, {
      formats: ["markdown", "links"],
    });

    if (!result.success) {
      console.log(`  [FAIL] Firecrawl error for ${pageUrl}`);
      return [];
    }

    // Extract image URLs from markdown content
    const images: ImageCandidate[] = [];
    const markdown = result.markdown || "";

    // Match markdown image syntax: ![alt](url)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = imgRegex.exec(markdown)) !== null) {
      images.push({ url: match[2], alt: match[1] });
    }

    // Also check links array for image URLs
    const links = (result as Record<string, unknown>).links as string[] | undefined;
    if (Array.isArray(links)) {
      for (const link of links) {
        if (VALID_EXTENSIONS.test(link) && !images.some(i => i.url === link)) {
          images.push({ url: link });
        }
      }
    }

    return images;
  } catch (err) {
    console.log(`  [ERROR] ${(err as Error).message}`);
    return [];
  }
}

async function main() {
  console.log("Manufacturer Image Scraper");
  console.log("==========================\n");

  // Load robots needing images
  const needingPath = path.resolve(process.cwd(), "scripts/robots-needing-images.json");
  if (!fs.existsSync(needingPath)) {
    console.log("Run audit-robot-images.ts first to generate robots-needing-images.json");
    process.exit(1);
  }

  const robotsNeeding = JSON.parse(fs.readFileSync(needingPath, "utf-8")) as {
    id: string; name: string; manufacturer: string; manufacturerWebsite: string;
    category: string; slug: string; issue: string;
  }[];

  console.log(`${robotsNeeding.length} robots needing images\n`);

  const results: ScrapeResult[] = [];
  const skipped: { robot: string; reason: string }[] = [];

  // Group by manufacturer
  const byManufacturer = new Map<string, typeof robotsNeeding>();
  for (const robot of robotsNeeding) {
    const list = byManufacturer.get(robot.manufacturer) || [];
    list.push(robot);
    byManufacturer.set(robot.manufacturer, list);
  }

  let processed = 0;

  for (const [manufacturer, robots] of byManufacturer) {
    const pages = MANUFACTURER_PAGES[manufacturer];
    if (!pages || pages.length === 0) {
      for (const r of robots) {
        skipped.push({ robot: r.name, reason: "No manufacturer pages configured" });
      }
      continue;
    }

    console.log(`\n--- ${manufacturer} (${robots.length} robots) ---`);

    // Scrape all pages for this manufacturer
    const allImages: ImageCandidate[] = [];
    for (const pageUrl of pages) {
      console.log(`  Scraping: ${pageUrl}`);
      const images = await scrapePageForImages(pageUrl);
      allImages.push(...images);
      // Rate limit
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`  Found ${allImages.length} image candidates`);

    // Try to match images to robots
    for (const robot of robots) {
      const matched = allImages.filter(img => matchesRobot(img.url, img.alt || "", robot.name));

      if (matched.length === 0) {
        skipped.push({ robot: robot.name, reason: "No matching image found" });
        continue;
      }

      // Quality check each match
      let saved = false;
      for (const img of matched.slice(0, 3)) {
        const quality = await checkImageQuality(img.url);
        if (quality.passes) {
          // Update DB
          await supabase
            .from("robots")
            .update({
              images: [{ url: img.url, alt: `${robot.manufacturer} ${robot.name}` }],
              image_source: "manufacturer_press",
              image_verified: true,
              image_updated_at: new Date().toISOString(),
            })
            .eq("id", robot.id);

          results.push({
            robot: robot.name,
            manufacturer: robot.manufacturer,
            source: "manufacturer_press",
            imageUrl: img.url,
            quality: "pass",
            timestamp: new Date().toISOString(),
          });

          console.log(`  [SAVED] ${robot.name}: ${img.url.substring(0, 80)}...`);
          saved = true;
          break;
        } else {
          console.log(`  [SKIP] ${robot.name}: ${quality.reason}`);
        }
        await new Promise(r => setTimeout(r, 500));
      }

      if (!saved) {
        skipped.push({ robot: robot.name, reason: "All matched images failed quality check" });
      }

      processed++;
      if (processed % 20 === 0) console.log(`  Progress: ${processed}/${robotsNeeding.length}`);
    }
  }

  // Save log
  const log = { processed: results, skipped, failed: [] };
  fs.writeFileSync("scripts/image-scraping-log.json", JSON.stringify(log, null, 2));

  console.log("\n=== Summary ===");
  console.log(`Images saved: ${results.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log("Log saved to scripts/image-scraping-log.json");
}

main().catch(console.error);
