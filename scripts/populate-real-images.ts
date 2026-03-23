/**
 * Populate real product images for robots that still have placeholders.
 * Run: npx tsx scripts/populate-real-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as https from "https";
import * as http from "http";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const directImageUrls: Record<string, string> = {
  "unitree-g1-basic": "https://oss-global.unitree.com/static/g1/g1_01.webp",
  "unitree-g1-edu": "https://oss-global.unitree.com/static/g1/g1_01.webp",
  "unitree-h1": "https://oss-global.unitree.com/static/h1/h1_01.webp",
  "unitree-r1": "https://oss-global.unitree.com/static/r1/r1_01.webp",
  "unitree-go2": "https://oss-global.unitree.com/static/go2/go2_01.webp",
  "unitree-go2-edu": "https://oss-global.unitree.com/static/go2/go2_01.webp",
  "unitree-b2": "https://oss-global.unitree.com/static/b2/b2_01.webp",
  "ur5e": "https://www.universal-robots.com/media/1810565/ur5e.png",
  "ur10e": "https://www.universal-robots.com/media/1810568/ur10e.png",
  "ur20": "https://www.universal-robots.com/media/1823662/ur20.png",
  "ur30": "https://www.universal-robots.com/media/1823665/ur30.png",
  "roomba-j9-plus": "https://media.irobot.com/image/upload/f_auto,q_auto/v1/assets/images/j9-plus-702x520.png",
  "roomba-combo-j9": "https://media.irobot.com/image/upload/f_auto,q_auto/v1/assets/images/combo-j9-702x520.png",
  "dreame-x40-ultra": "https://cdn.dreame.com/upload/product/x40ultra/x40-ultra-hero.webp",
  "ecovacs-t30-omni": "https://cdn.ecovacs.com/media/catalog/product/t30-omni-hero.webp",
  "fanuc-crx-10ia": "https://www.fanucamerica.com/images/default-source/robots/crx-collaborative-robots/crx-10ia.png",
  "abb-gofa": "https://new.abb.com/images/default-source/robotics/collaborative-robots/gofa-crb-15000.webp",
  "abb-yumi": "https://new.abb.com/images/default-source/robotics/collaborative-robots/yumi.webp",
  "kuka-lbr-iiwa": "https://www.kuka.com/-/media/kuka/products/robots/lbr-iiwa/lbr-iiwa.webp",
  "agility-digit": "https://agilityrobotics.com/hs-fs/hubfs/digit-hero.webp",
  "apptronik-apollo": "https://apptronik.com/images/apollo-hero.webp",
  "1x-neo": "https://www.1x.tech/images/neo-hero.webp",
  "sanctuary-phoenix": "https://sanctuary.ai/wp-content/uploads/phoenix-gen-7.webp",
  "figure-03": "https://www.figure.ai/assets/images/figure-03-hero.webp",
  "davinci-5": "https://www.intuitive.com/-/media/intuitive/us/images/products/davinci-5/davinci-5-hero.webp",
  "stryker-mako": "https://www.stryker.com/content/dam/stryker/mako/images/mako-robot-hero.webp",
  "medtronic-hugo": "https://www.medtronic.com/content/dam/medtronic-wide/hugo/hugo-ras-system-hero.webp",
  "amazon-astro": "https://m.media-amazon.com/images/I/61Vc3s3eIhL._AC_SL1500_.jpg",
  "nuro-r3": "https://www.nuro.ai/images/r3-hero.webp",
  "john-deere-see-spray": "https://www.deere.com/assets/images/region-4/products/sprayers/see-spray/see-spray-ultimate-hero.webp",
  "knightscope-k5": "https://www.knightscope.com/hs-fs/hubfs/K5-hero.webp",
  "skydio-x10": "https://www.skydio.com/cdn/shop/files/x10-hero.webp",
  "zipline-p2": "https://flyzipline.com/wp-content/uploads/p2-zip-hero.webp",
};

// Known product page URLs for og:image fallback
const productPages: Record<string, string> = {
  "unitree-g1-basic": "https://www.unitree.com/g1",
  "unitree-h1": "https://www.unitree.com/h1",
  "ur5e": "https://www.universal-robots.com/products/ur5-robot/",
  "ur10e": "https://www.universal-robots.com/products/ur10-robot/",
  "ur20": "https://www.universal-robots.com/products/ur20-robot/",
  "ur30": "https://www.universal-robots.com/products/ur30-robot/",
  "fanuc-crx-10ia": "https://www.fanucamerica.com/products/robots/series/collaborative-robot-series/crx-10ia",
  "roomba-j9-plus": "https://www.irobot.com/roomba/j-series/j9-plus",
  "roomba-combo-j9": "https://www.irobot.com/roomba/combo-j-series/combo-j9-plus",
  "dreame-x40-ultra": "https://www.dreame.com/products/dreame-x40-ultra",
  "ecovacs-t30-omni": "https://www.ecovacs.com/us/deebot-t30-omni",
  "abb-gofa": "https://new.abb.com/products/robotics/collaborative-robots/crb-15000",
  "kuka-lbr-iiwa": "https://www.kuka.com/en-us/products/robotics-systems/industrial-robots/lbr-iiwa",
  "agility-digit": "https://agilityrobotics.com/digit",
  "apptronik-apollo": "https://apptronik.com/apollo",
  "davinci-5": "https://www.intuitive.com/en-us/products-and-services/da-vinci/5",
  "amazon-astro": "https://www.amazon.com/Introducing-Amazon-Astro/dp/B078NSDFSB",
  "skydio-x10": "https://www.skydio.com/skydio-x10",
  "nuro-r3": "https://www.nuro.ai/",
  "knightscope-k5": "https://www.knightscope.com/k5",
};

function checkUrl(url: string, depth = 0): Promise<boolean> {
  if (depth > 5) return Promise.resolve(false);
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "image/webp,image/png,image/jpeg,image/svg+xml,*/*",
      "Range": "bytes=0-0",
    };
    const req = client.get(url, { headers, timeout: 10000 }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redir = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href;
        res.resume();
        checkUrl(redir, depth + 1).then(resolve);
        return;
      }
      res.resume();
      // 200 or 206 (partial content) both mean the resource exists
      resolve(res.statusCode === 200 || res.statusCode === 206);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

function fetchHtml(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,*/*",
    };
    const req = client.get(url, { headers, timeout: 10000 }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redir = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href;
        fetchHtml(redir).then(resolve);
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

function extractOgImage(html: string, baseUrl: string): string | null {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (!match?.[1]) return null;
  const url = match[1];
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return "https:" + url;
  try { return new URL(url, baseUrl).href; } catch { return null; }
}

async function main() {
  console.log("=== Robotomated: Populate Real Product Images ===\n");

  let updated = 0;
  let failed = 0;
  const stillNeedImages: string[] = [];

  for (const [slug, imageUrl] of Object.entries(directImageUrls)) {
    // Look up robot - try exact slug first, then common variants
    let robot: { id: string; name: string; images: unknown } | null = null;
    const slugVariants = [slug];
    // Some slugs in DB may have -v2 suffix or slight differences
    if (!slug.includes("-v2")) slugVariants.push(slug + "-v2");

    for (const s of slugVariants) {
      const { data } = await supabase.from("robots").select("id, name, images").eq("slug", s).single();
      if (data) { robot = data; break; }
    }

    if (!robot) {
      console.log(`  SKIP ${slug}: not found in DB`);
      continue;
    }

    // Check if already has a non-placeholder image
    const currentImages = (robot.images || []) as { url: string }[];
    if (currentImages.length > 0 && !currentImages[0].url.includes("unsplash.com") && !currentImages[0].url.includes("placeholder")) {
      console.log(`  SKIP ${slug}: already has real image`);
      continue;
    }

    // Step 1: Try the direct URL
    const directOk = await checkUrl(imageUrl);
    if (directOk) {
      await supabase.from("robots").update({
        images: [{ url: imageUrl, alt: robot.name }]
      }).eq("id", robot.id);
      console.log(`  OK   ${slug}: ${imageUrl.substring(0, 70)}...`);
      updated++;
      continue;
    }

    // Step 2: Try og:image from product page
    console.log(`  WARN ${slug}: direct URL failed, trying og:image...`);
    const pageUrl = productPages[slug];
    if (pageUrl) {
      const html = await fetchHtml(pageUrl);
      if (html) {
        const ogImage = extractOgImage(html, pageUrl);
        if (ogImage) {
          await supabase.from("robots").update({
            images: [{ url: ogImage, alt: robot.name }]
          }).eq("id", robot.id);
          console.log(`  OK   ${slug}: og:image ${ogImage.substring(0, 70)}...`);
          updated++;
          continue;
        }
      }
    }

    // Step 3: Both failed
    console.log(`  FAIL ${slug}: no working image URL found`);
    stillNeedImages.push(slug);
    failed++;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Summary: ${updated} updated, ${failed} failed`);
  if (stillNeedImages.length > 0) {
    console.log(`\nStill need manual images:`);
    stillNeedImages.forEach(s => console.log(`  - ${s}`));
  }
  console.log();
}

main().catch(console.error);
