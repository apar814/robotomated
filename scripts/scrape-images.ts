/**
 * Scrape real logos and product images from manufacturer websites.
 * Run: npx tsx scripts/scrape-images.ts
 *
 * Strategy:
 * 1. Logos: fetch manufacturer website, extract from og:image / apple-touch-icon / favicon
 * 2. Product images: fetch robot product pages, extract from og:image / JSON-LD / hero images
 * 3. Upload to Supabase Storage, update DB
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Product page URLs for robots ──
const robotProductPages: Record<string, string> = {
  "unitree-g1-basic": "https://www.unitree.com/g1",
  "unitree-g1-edu": "https://www.unitree.com/g1",
  "unitree-h1": "https://www.unitree.com/h1",
  "unitree-r1": "https://www.unitree.com/r1",
  "unitree-go2": "https://www.unitree.com/go2",
  "unitree-go2-edu": "https://www.unitree.com/go2",
  "unitree-b2": "https://www.unitree.com/b2",
  "boston-dynamics-spot": "https://bostondynamics.com/products/spot/",
  "boston-dynamics-spot-arm": "https://bostondynamics.com/products/spot/",
  "boston-dynamics-stretch-v2": "https://bostondynamics.com/products/stretch/",
  "boston-dynamics-atlas-electric": "https://bostondynamics.com/atlas/",
  "ur5e-v2": "https://www.universal-robots.com/products/ur5-robot/",
  "ur10e-v2": "https://www.universal-robots.com/products/ur10-robot/",
  "ur20-v2": "https://www.universal-robots.com/products/ur20-robot/",
  "ur30": "https://www.universal-robots.com/products/ur30-robot/",
  "fanuc-crx-10ia": "https://www.fanucamerica.com/products/robots/series/collaborative-robot-series/crx-10ia",
  "dji-mavic-3-pro": "https://www.dji.com/mavic-3-pro",
  "dji-matrice-350": "https://www.dji.com/matrice-350-rtk",
  "dji-agras-t50": "https://ag.dji.com/t50",
  "roborock-s8-maxv-ultra-v2": "https://www.roborock.com/pages/roborock-s8-maxv-ultra",
  "roomba-j9-plus": "https://www.irobot.com/roomba/j-series/j9-plus",
  "roomba-combo-j9": "https://www.irobot.com/roomba/combo-j-series/combo-j9-plus",
  "ecovacs-t30-omni": "https://www.ecovacs.com/us/deebot-t30-omni",
  "dreame-x40-ultra": "https://www.dreame.com/products/dreame-x40-ultra",
  "figure-02": "https://www.figure.ai/",
  "agility-digit": "https://agilityrobotics.com/digit",
  "apptronik-apollo": "https://apptronik.com/apollo",
  "davinci-5": "https://www.intuitive.com/en-us/products-and-services/da-vinci/5",
  "stryker-mako": "https://www.stryker.com/us/en/joint-replacement/systems/mako-robotic-arm-assisted-surgery.html",
  "skydio-x10": "https://www.skydio.com/skydio-x10",
  "standard-bots-ro1": "https://standardbots.com/",
  "locus-vector-v2": "https://locusrobotics.com/",
  "john-deere-see-spray": "https://www.deere.com/en/sprayers/see-spray/",
  "carbon-laserweeder": "https://carbonrobotics.com/laserweeder",
  "nuro-r3": "https://www.nuro.ai/",
  "starship-delivery": "https://www.starship.xyz/",
  "knightscope-k5": "https://www.knightscope.com/k5",
  "amazon-astro": "https://www.amazon.com/Introducing-Amazon-Astro/dp/B078NSDFSB",
  "hilti-jaibot": "https://www.hilti.com/content/hilti/W1/US/en/business/business/services/jaibot.html",
  "kuka-lbr-iiwa": "https://www.kuka.com/en-us/products/robotics-systems/industrial-robots/lbr-iiwa",
  "abb-gofa": "https://new.abb.com/products/robotics/collaborative-robots/crb-15000",
};

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchHtml(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "Robotomated/1.0 (robotomated.com)" }, timeout: 10000 }, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href;
        fetchHtml(redirectUrl).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { resolve(null); return; }
      let data = "";
      res.on("data", (chunk: Buffer) => { data += chunk.toString(); });
      res.on("end", () => resolve(data));
      res.on("error", () => resolve(null));
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

function extractImageUrl(html: string, baseUrl: string): string | null {
  // Priority 1: og:image
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch?.[1]) return resolveUrl(ogMatch[1], baseUrl);

  // Priority 2: twitter:image
  const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (twMatch?.[1]) return resolveUrl(twMatch[1], baseUrl);

  // Priority 3: JSON-LD image
  const ldMatch = html.match(/"image"\s*:\s*"([^"]+)"/);
  if (ldMatch?.[1] && (ldMatch[1].endsWith(".jpg") || ldMatch[1].endsWith(".png") || ldMatch[1].endsWith(".webp"))) {
    return resolveUrl(ldMatch[1], baseUrl);
  }

  return null;
}

function extractLogoUrl(html: string, baseUrl: string): string | null {
  // Priority 1: og:image (often the logo for homepages)
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch?.[1]) return resolveUrl(ogMatch[1], baseUrl);

  // Priority 2: apple-touch-icon
  const appleMatch = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i);
  if (appleMatch?.[1]) return resolveUrl(appleMatch[1], baseUrl);

  // Priority 3: favicon with sizes > 32
  const iconMatch = html.match(/<link[^>]+rel=["']icon["'][^>]+sizes=["'](\d+)x\d+["'][^>]+href=["']([^"']+)["']/i);
  if (iconMatch && parseInt(iconMatch[1]) >= 64) return resolveUrl(iconMatch[2], baseUrl);

  // Priority 4: Any favicon
  const favMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i);
  if (favMatch?.[1]) return resolveUrl(favMatch[1], baseUrl);

  return null;
}

function resolveUrl(url: string, base: string): string {
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return "https:" + url;
  try { return new URL(url, base).href; } catch { return url; }
}

async function main() {
  console.log("[BOT] Robotomated Image Scraper\n");

  // Create storage buckets
  await supabase.storage.createBucket("logos", { public: true }).catch(() => {});
  await supabase.storage.createBucket("robot-images", { public: true }).catch(() => {});

  // ── LOGOS ──
  console.log("[MFR] Scraping manufacturer logos...");
  const { data: mfrs } = await supabase.from("manufacturers").select("id, slug, name, website, logo_url").order("name");
  let logoSuccess = 0, logoFail = 0;

  for (const mfr of (mfrs || []).filter(m => m.website && !m.logo_url)) {
    await delay(1000);
    const html = await fetchHtml(mfr.website);
    if (!html) { console.log(`  [ERR] ${mfr.name}: fetch failed`); logoFail++; continue; }

    const logoUrl = extractLogoUrl(html, mfr.website);
    if (!logoUrl) { console.log(`  [ERR] ${mfr.name}: no logo found in HTML`); logoFail++; continue; }

    // Update logo_url directly (hotlink from manufacturer site)
    await supabase.from("manufacturers").update({ logo_url: logoUrl }).eq("id", mfr.id);
    console.log(`  [OK] ${mfr.name}: ${logoUrl.substring(0, 80)}...`);
    logoSuccess++;
  }
  console.log(`  Logos: ${logoSuccess} found, ${logoFail} failed, ${(mfrs || []).filter(m => m.logo_url).length} already set\n`);

  // ── PRODUCT IMAGES ──
  console.log("[IMG] Scraping robot product images...");
  let imgSuccess = 0, imgFail = 0;

  for (const [slug, pageUrl] of Object.entries(robotProductPages)) {
    await delay(1000);

    // Check if robot already has a non-Unsplash image
    const { data: robot } = await supabase.from("robots").select("id, images").eq("slug", slug).single();
    if (!robot) { console.log(`  [SKIP] ${slug}: not in DB`); continue; }

    const currentImages = (robot.images || []) as { url: string }[];
    if (currentImages.length > 0 && !currentImages[0].url.includes("unsplash.com")) {
      console.log(`  [SKIP] ${slug}: already has non-Unsplash image`);
      continue;
    }

    const html = await fetchHtml(pageUrl);
    if (!html) { console.log(`  [ERR] ${slug}: fetch failed (${pageUrl})`); imgFail++; continue; }

    const imageUrl = extractImageUrl(html, pageUrl);
    if (!imageUrl) { console.log(`  [ERR] ${slug}: no product image found`); imgFail++; continue; }

    // Update robot images
    await supabase.from("robots").update({
      images: [{ url: imageUrl, alt: `${slug} product photo` }]
    }).eq("id", robot.id);
    console.log(`  [OK] ${slug}: ${imageUrl.substring(0, 80)}...`);
    imgSuccess++;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`[STATS] Scraping Summary`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  Logos:  ${logoSuccess} scraped, ${logoFail} failed`);
  console.log(`  Images: ${imgSuccess} scraped, ${imgFail} failed`);
  console.log(`\nFailed items can be set manually via:`);
  console.log(`  Logos:  /admin/manufacturers`);
  console.log(`  Images: /admin/robots/[id]/images`);
}

main().catch(console.error);
