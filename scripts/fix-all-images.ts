/**
 * Comprehensive image fix script.
 * 1. Audit all robot image URLs
 * 2. Fix broken/blocked/missing images via Firecrawl + Supabase Storage
 * Run: npx tsx scripts/fix-all-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
import * as https from "https";
import * as http from "http";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── HTTP Utilities ───
function headCheck(url: string): Promise<{ status: number; contentType: string }> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.request(url, {
      method: "HEAD",
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    }, (res) => {
      // Follow one redirect (only if absolute URL)
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        res.resume();
        const loc = res.headers.location;
        if (loc.startsWith("http")) {
          headCheck(loc).then(resolve);
        } else {
          resolve({ status: res.statusCode, contentType: "" });
        }
        return;
      }
      resolve({ status: res.statusCode || 0, contentType: res.headers["content-type"] || "" });
      res.resume();
    });
    req.on("error", () => resolve({ status: 0, contentType: "" }));
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, contentType: "" }); });
    req.end();
  });
}

function downloadImage(url: string, maxRedirects = 3): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      timeout: 20000,
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location && maxRedirects > 0) {
        res.resume();
        const loc = res.headers.location;
        if (loc.startsWith("http")) {
          downloadImage(loc, maxRedirects - 1).then(resolve);
        } else {
          resolve(null);
        }
        return;
      }
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const ct = res.headers["content-type"] || "";
      if (!ct.startsWith("image/")) { res.resume(); resolve(null); return; }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        // Verify it's actually an image by checking magic bytes
        if (buf.length < 100) { resolve(null); return; }
        // JPEG: FF D8 FF, PNG: 89 50 4E 47, WebP: 52 49 46 46
        const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8;
        const isPng = buf[0] === 0x89 && buf[1] === 0x50;
        const isWebp = buf[0] === 0x52 && buf[1] === 0x49;
        if (isJpeg || isPng || isWebp) resolve(buf);
        else resolve(null);
      });
      res.on("error", () => resolve(null));
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

function isStockPhoto(url: string): boolean {
  const blocked = ["shutterstock", "getty", "unsplash", "istock", "depositphotos", "123rf", "alamy", "dreamstime"];
  const lower = url.toLowerCase();
  return blocked.some(d => lower.includes(d));
}

function isSupabaseUrl(url: string): boolean {
  return url.includes("supabase.co/storage");
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpg|jpeg|webp)(\?|$)/i.test(url);
}

// ─── Types ───
interface AuditRobot {
  id: string;
  slug: string;
  name: string;
  images: { url: string; alt: string }[] | null;
  robo_score: number | null;
  manufacturers: { name: string } | null;
}

type ImageStatus = "working" | "broken" | "blocked" | "no_image" | "unsplash";

interface AuditResult {
  robot: AuditRobot;
  status: ImageStatus;
  url: string | null;
  detail: string;
}

// ═══════════════════════════════════════
// STEP 1 — AUDIT
// ═══════════════════════════════════════
async function auditAllImages(): Promise<AuditResult[]> {
  console.log("═══════════════════════════════════════");
  console.log("  STEP 1 — AUDIT ALL IMAGE URLS");
  console.log("═══════════════════════════════════════\n");

  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, images, robo_score, manufacturers(name)")
    .order("robo_score", { ascending: false, nullsFirst: false });

  const allRobots = (robots || []) as AuditRobot[];
  console.log(`Checking ${allRobots.length} robots...\n`);

  const results: AuditResult[] = [];

  for (const robot of allRobots) {
    const imgs = (Array.isArray(robot.images) ? robot.images : []) as { url: string; alt: string }[];

    if (imgs.length === 0 || !imgs[0]?.url) {
      results.push({ robot, status: "no_image", url: null, detail: "no image URL" });
      continue;
    }

    const url = imgs[0].url;

    if (url.includes("unsplash")) {
      results.push({ robot, status: "unsplash", url, detail: "placeholder unsplash image" });
      continue;
    }

    if (isSupabaseUrl(url)) {
      results.push({ robot, status: "working", url, detail: "Supabase Storage (permanent)" });
      continue;
    }

    try {
      const { status, contentType } = await headCheck(url);

      if (status === 200 && contentType.startsWith("image/")) {
        results.push({ robot, status: "working", url, detail: `200 OK (${contentType})` });
      } else if (status === 200 && contentType.includes("text/html")) {
        results.push({ robot, status: "blocked", url, detail: `200 but text/html (bot protection)` });
      } else if (status === 404) {
        results.push({ robot, status: "broken", url, detail: `404 Not Found` });
      } else if (status === 0) {
        results.push({ robot, status: "broken", url, detail: `timeout/connection error` });
      } else {
        results.push({ robot, status: "broken", url, detail: `${status} ${contentType}` });
      }
    } catch {
      results.push({ robot, status: "broken", url, detail: "URL check error" });
    }
  }

  // Print report
  const working = results.filter(r => r.status === "working");
  const blocked = results.filter(r => r.status === "blocked");
  const broken = results.filter(r => r.status === "broken");
  const noImage = results.filter(r => r.status === "no_image");
  const unsplash = results.filter(r => r.status === "unsplash");

  console.log("═══ AUDIT REPORT ═══");
  console.log(`WORKING:                ${working.length} robots`);
  console.log(`BLOCKED (html response): ${blocked.length} robots`);
  if (blocked.length > 0) {
    for (const r of blocked) console.log(`  - ${r.robot.name} (${r.detail})`);
  }
  console.log(`BROKEN (404/timeout):    ${broken.length} robots`);
  if (broken.length > 0) {
    for (const r of broken) console.log(`  - ${r.robot.name} (${r.detail})`);
  }
  console.log(`NO IMAGE:                ${noImage.length} robots`);
  if (noImage.length > 0) {
    for (const r of noImage) console.log(`  - ${r.robot.name}`);
  }
  console.log(`UNSPLASH PLACEHOLDER:    ${unsplash.length} robots`);
  if (unsplash.length > 0) {
    for (const r of unsplash) console.log(`  - ${r.robot.name}`);
  }
  console.log("");

  return results;
}

// ═══════════════════════════════════════
// STEP 2 — FIX IMAGES
// ═══════════════════════════════════════
async function fixImage(robot: AuditRobot): Promise<boolean> {
  const mfr = robot.manufacturers?.name || "";

  // Strategy 1 — Firecrawl search for official image
  console.log(`  Strategy 1: Firecrawl search...`);
  try {
    const searchResult = await firecrawl.search(
      `${robot.name} ${mfr} official product photo`,
      { limit: 5 }
    );
    const webResults = (searchResult as { web?: { url: string }[] }).web || [];

    for (const result of webResults.slice(0, 3)) {
      if (!result.url) continue;
      try {
        await delay(1000);
        const scrapeResult = await firecrawl.scrape(result.url, { formats: ["links"] });
        const links = (scrapeResult as { links?: string[] }).links || [];

        const imageLinks = links.filter((l: string) =>
          isImageUrl(l) &&
          !isStockPhoto(l) &&
          !l.includes("logo") &&
          !l.includes("icon") &&
          !l.includes("favicon") &&
          !l.includes("avatar") &&
          !l.includes("thumbnail") &&
          (l.length > 30) // Filter out tiny icon paths
        );

        // Prefer manufacturer domain images
        const domain = result.url.split("/")[2] || "";
        const domainImgs = imageLinks.filter((l: string) => l.includes(domain));
        const candidates = domainImgs.length > 0 ? domainImgs : imageLinks;

        for (const candidate of candidates.slice(0, 3)) {
          const uploaded = await tryUpload(robot, candidate);
          if (uploaded) return true;
        }
      } catch { /* skip this result */ }
    }
  } catch (err) {
    console.log(`    Search error: ${err instanceof Error ? err.message : String(err)}`);
  }

  await delay(2000);

  // Strategy 2 — YouTube thumbnail
  console.log(`  Strategy 2: YouTube thumbnail...`);
  try {
    const ytSearch = await firecrawl.search(
      `site:youtube.com ${robot.name} ${mfr} official`,
      { limit: 3 }
    );
    const ytResults = (ytSearch as { web?: { url: string }[] }).web || [];

    for (const yt of ytResults) {
      if (!yt.url) continue;
      // Extract video ID
      const vidMatch = yt.url.match(/(?:watch\?v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
      if (!vidMatch) continue;

      const videoId = vidMatch[1];
      const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      const uploaded = await tryUpload(robot, thumbUrl);
      if (uploaded) return true;
    }
  } catch {
    console.log(`    YouTube search failed`);
  }

  await delay(2000);

  // Strategy 3 — Wikipedia
  console.log(`  Strategy 3: Wikipedia...`);
  try {
    const wikiSearch = await firecrawl.search(
      `${robot.name} ${mfr} wikipedia`,
      { limit: 2 }
    );
    const wikiResults = (wikiSearch as { web?: { url: string }[] }).web || [];

    for (const wiki of wikiResults) {
      if (!wiki.url || !wiki.url.includes("wikipedia")) continue;
      try {
        const scrapeResult = await firecrawl.scrape(wiki.url, { formats: ["links"] });
        const links = (scrapeResult as { links?: string[] }).links || [];

        const wikiImages = links.filter((l: string) =>
          isImageUrl(l) &&
          (l.includes("upload.wikimedia") || l.includes("commons.wikimedia")) &&
          !l.includes("logo") &&
          !l.includes("icon")
        );

        for (const img of wikiImages.slice(0, 3)) {
          const uploaded = await tryUpload(robot, img);
          if (uploaded) return true;
        }
      } catch { /* skip */ }
    }
  } catch {
    console.log(`    Wikipedia search failed`);
  }

  return false;
}

async function tryUpload(robot: AuditRobot, imageUrl: string): Promise<boolean> {
  try {
    const buf = await downloadImage(imageUrl);
    if (!buf || buf.length < 5000) return false; // Too small, likely icon

    // Determine extension from magic bytes
    let ext = "jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) ext = "png";
    else if (buf[0] === 0x52 && buf[1] === 0x49) ext = "webp";

    const storagePath = `robots/${robot.slug}/hero.${ext}`;
    const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    const { error: uploadError } = await supabase.storage
      .from("robot-images")
      .upload(storagePath, buf, { contentType, upsert: true });

    if (uploadError) {
      console.log(`    Upload error: ${uploadError.message}`);
      return false;
    }

    const { data: publicUrl } = supabase.storage
      .from("robot-images")
      .getPublicUrl(storagePath);

    await supabase.from("robots").update({
      images: [{ url: publicUrl.publicUrl, alt: robot.name }],
    }).eq("id", robot.id);

    console.log(`    ✓ Uploaded to Supabase Storage (${(buf.length / 1024).toFixed(0)}KB)`);
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
async function main() {
  console.log("════════════════════════════════════════");
  console.log("  ROBOT IMAGE FIX — PERMANENT SOLUTION");
  console.log("════════════════════════════════════════\n");

  // Ensure storage bucket exists
  await supabase.storage.createBucket("robot-images", { public: true }).catch(() => {});

  // Step 1: Audit
  const results = await auditAllImages();

  // Collect robots that need fixing
  const needsFix = results.filter(r =>
    r.status === "broken" || r.status === "blocked" || r.status === "no_image" || r.status === "unsplash"
  );

  if (needsFix.length === 0) {
    console.log("All images are working! Nothing to fix.");
    return;
  }

  // Step 2+3: Fix — priority robots first, then rest
  const prioritySlugs = [
    "intuitive-da-vinci-5", "da-vinci-5",
    "intuitive-da-vinci-sp", "da-vinci-sp",
    "stryker-mako", "ur5e", "universal-robots-ur5e",
    "john-deere-see-spray-ultimate",
    "symbotic-automated-system",
    "boston-dynamics-atlas-electric",
    "figure-02", "agility-digit",
  ];

  // Sort: priority first, then by score descending
  needsFix.sort((a, b) => {
    const aIdx = prioritySlugs.indexOf(a.robot.slug);
    const bIdx = prioritySlugs.indexOf(b.robot.slug);
    const aPri = aIdx >= 0 ? aIdx : 999;
    const bPri = bIdx >= 0 ? bIdx : 999;
    if (aPri !== bPri) return aPri - bPri;
    return (b.robot.robo_score || 0) - (a.robot.robo_score || 0);
  });

  console.log("═══════════════════════════════════════");
  console.log(`  STEP 2 — FIX ${needsFix.length} IMAGES`);
  console.log("═══════════════════════════════════════\n");

  let fixed = 0;
  let failed = 0;

  for (let i = 0; i < needsFix.length; i++) {
    const { robot, status } = needsFix[i];
    console.log(`[${i + 1}/${needsFix.length}] ${robot.name} (${status})...`);

    const success = await fixImage(robot);
    if (success) {
      fixed++;
    } else {
      failed++;
      console.log(`    ✗ No image found after all strategies`);
    }

    await delay(3000);
  }

  console.log("\n═══════════════════════════════════════");
  console.log("  RESULTS");
  console.log("═══════════════════════════════════════");
  console.log(`Fixed:  ${fixed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${needsFix.length}`);
  console.log("═══════════════════════════════════════\n");
}

main().catch(console.error);
