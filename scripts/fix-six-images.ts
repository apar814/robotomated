/**
 * Fix 6 specific robots with Unsplash placeholder images.
 * Scrapes product images from official manufacturer websites.
 * Run: npx tsx scripts/fix-six-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as https from "https";
import * as http from "http";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// Target robots and their official product pages
const targets = [
  { slug: "ageagle-ebee-x", name: "AgEagle eBee X", searchTerms: "eBee X drone product photo", sites: ["ageagle.com", "sensefly.com"] },
  { slug: "verdant-spraybox", name: "Verdant Robotics Spraybox", searchTerms: "Verdant Robotics Spraybox robot photo", sites: ["verdantrobotics.com"] },
  { slug: "cartken-model-c", name: "Cartken Model C", searchTerms: "Cartken delivery robot photo", sites: ["cartken.com"] },
  { slug: "iron-ox-grover", name: "Iron Ox Grover", searchTerms: "Iron Ox greenhouse robot photo", sites: ["ironox.com"] },
  { slug: "naio-oz", name: "Naïo Oz", searchTerms: "Naio Oz weeding robot photo", sites: ["naio-technologies.com"] },
  { slug: "ghost-vision-60", name: "Ghost Robotics Vision 60", searchTerms: "Ghost Robotics Vision 60 quadruped photo", sites: ["ghostrobotics.io"] },
];

function downloadImage(url: string, maxRedirects = 3): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      timeout: 20000,
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location && maxRedirects > 0) {
        res.resume();
        const loc = res.headers.location.startsWith("http") ? res.headers.location : `https:${res.headers.location}`;
        downloadImage(loc, maxRedirects - 1).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const ct = res.headers["content-type"] || "";
      if (!ct.includes("image")) { res.resume(); resolve(null); return; }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

async function findAndUploadImage(slug: string, name: string, searchTerms: string, sites: string[]): Promise<boolean> {
  // Strategy 1: Firecrawl search for product images
  try {
    for (const site of sites) {
      const result = await firecrawl.search(`${searchTerms} site:${site}`, { limit: 3 });
      if (result.success && result.data?.length) {
        for (const item of result.data as { url?: string; markdown?: string }[]) {
          if (!item.markdown) continue;
          // Extract image URLs from markdown
          const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
          let match;
          while ((match = imgRegex.exec(item.markdown)) !== null) {
            const imgUrl = match[2];
            if (!imgUrl || imgUrl.includes("svg") || imgUrl.includes("logo") || imgUrl.includes("icon") || imgUrl.includes("favicon")) continue;
            if (imgUrl.includes("unsplash")) continue;
            // Try to download
            const buf = await downloadImage(imgUrl);
            if (buf && buf.length > 10000) { // At least 10KB
              return await uploadToStorage(slug, name, buf, imgUrl);
            }
          }
        }
      }
      await delay(1500);
    }
  } catch (e) {
    console.log(`    Firecrawl search error: ${e}`);
  }

  // Strategy 2: Scrape the manufacturer site directly
  try {
    for (const site of sites) {
      const scrapeResult = await firecrawl.scrape(`https://${site}`, { formats: ["markdown"] });
      if (scrapeResult.success && scrapeResult.markdown) {
        const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = imgRegex.exec(scrapeResult.markdown)) !== null) {
          const imgUrl = match[2];
          if (!imgUrl || imgUrl.includes("svg") || imgUrl.includes("logo") || imgUrl.includes("icon")) continue;
          if (imgUrl.includes("unsplash")) continue;
          const fullUrl = imgUrl.startsWith("http") ? imgUrl : `https://${site}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
          const buf = await downloadImage(fullUrl);
          if (buf && buf.length > 10000) {
            return await uploadToStorage(slug, name, buf, fullUrl);
          }
        }
      }
      await delay(1500);
    }
  } catch (e) {
    console.log(`    Scrape error: ${e}`);
  }

  // Strategy 3: YouTube thumbnail
  try {
    const ytResult = await firecrawl.search(`${name} robot official youtube`, { limit: 1 });
    if (ytResult.success && ytResult.data?.length) {
      const ytUrl = (ytResult.data[0] as { url?: string }).url;
      if (ytUrl) {
        const videoId = ytUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
        if (videoId) {
          const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          const buf = await downloadImage(thumbUrl);
          if (buf && buf.length > 5000) {
            return await uploadToStorage(slug, name, buf, thumbUrl);
          }
        }
      }
    }
  } catch {}

  return false;
}

async function uploadToStorage(slug: string, name: string, buf: Buffer, sourceUrl: string): Promise<boolean> {
  const ext = sourceUrl.includes(".png") ? "png" : "jpg";
  const storagePath = `robot-images/${slug}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("images")
    .upload(storagePath, buf, { contentType: `image/${ext === "png" ? "png" : "jpeg"}`, upsert: true });

  if (uploadErr) {
    console.log(`    Upload error: ${uploadErr.message}`);
    return false;
  }

  const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(storagePath);

  const { error: updateErr } = await supabase
    .from("robots")
    .update({ images: [{ url: publicUrl, alt: name }] })
    .eq("slug", slug);

  if (updateErr) {
    console.log(`    DB update error: ${updateErr.message}`);
    return false;
  }

  console.log(`    [OK] Uploaded (${Math.round(buf.length / 1024)}KB) → ${publicUrl.slice(0, 80)}`);
  return true;
}

async function main() {
  console.log("═══ Fix 6 Placeholder Images ═══\n");

  let fixed = 0;
  for (const target of targets) {
    console.log(`[${targets.indexOf(target) + 1}/6] ${target.name}...`);
    const success = await findAndUploadImage(target.slug, target.name, target.searchTerms, target.sites);
    if (success) {
      fixed++;
    } else {
      console.log("    [ERR] Could not find suitable image");
    }
    await delay(2000);
  }

  console.log(`\n═══ Results: ${fixed}/6 images fixed ═══`);
}

main().catch(console.error);
