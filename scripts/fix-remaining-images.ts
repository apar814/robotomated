/**
 * Fix remaining robot images (batch 2).
 * Run: npx tsx scripts/fix-remaining-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
import * as https from "https";
import * as http from "http";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function downloadImage(url: string, maxRedirects = 3): Promise<Buffer | null> {
  return new Promise((resolve) => {
    if (!url.startsWith("http")) { resolve(null); return; }
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      timeout: 15000,
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location && maxRedirects > 0) {
        res.resume();
        const loc = res.headers.location;
        if (loc.startsWith("http")) downloadImage(loc, maxRedirects - 1).then(resolve);
        else resolve(null);
        return;
      }
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const ct = res.headers["content-type"] || "";
      if (!ct.startsWith("image/")) { res.resume(); resolve(null); return; }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 100) { resolve(null); return; }
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

function isImageUrl(url: string): boolean {
  return /\.(png|jpg|jpeg|webp)(\?|$)/i.test(url);
}

function isStockPhoto(url: string): boolean {
  const blocked = ["shutterstock", "getty", "unsplash", "istock", "depositphotos", "123rf", "alamy"];
  return blocked.some(d => url.toLowerCase().includes(d));
}

interface Robot {
  id: string; slug: string; name: string;
  images: { url: string; alt: string }[] | null;
  manufacturers: { name: string } | null;
}

async function tryUpload(robot: Robot, imageUrl: string): Promise<boolean> {
  try {
    const buf = await downloadImage(imageUrl);
    if (!buf || buf.length < 3000) return false;
    let ext = "jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50) ext = "png";
    else if (buf[0] === 0x52 && buf[1] === 0x49) ext = "webp";
    const storagePath = `robots/${robot.slug}/hero.${ext}`;
    const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    const { error } = await supabase.storage.from("robot-images").upload(storagePath, buf, { contentType, upsert: true });
    if (error) { console.log(`    Upload error: ${error.message}`); return false; }
    const { data: publicUrl } = supabase.storage.from("robot-images").getPublicUrl(storagePath);
    await supabase.from("robots").update({ images: [{ url: publicUrl.publicUrl, alt: robot.name }] }).eq("id", robot.id);
    console.log(`    [OK] Uploaded (${(buf.length / 1024).toFixed(0)}KB)`);
    return true;
  } catch { return false; }
}

async function fixRobot(robot: Robot): Promise<boolean> {
  const mfr = robot.manufacturers?.name || "";

  // Strategy 1 — Firecrawl search
  console.log(`  S1: Firecrawl search...`);
  try {
    const sr = await firecrawl.search(`${robot.name} ${mfr} product photo robot`, { limit: 5 });
    const results = (sr as { web?: { url: string }[] }).web || [];
    for (const r of results.slice(0, 3)) {
      if (!r.url) continue;
      try {
        await delay(1000);
        const scrape = await firecrawl.scrape(r.url, { formats: ["links"] });
        const links = ((scrape as { links?: string[] }).links || []).filter((l: string) =>
          isImageUrl(l) && !isStockPhoto(l) && !l.includes("logo") && !l.includes("icon") && !l.includes("favicon") && l.length > 30
        );
        const domain = r.url.split("/")[2] || "";
        const domainImgs = links.filter((l: string) => l.includes(domain));
        const candidates = domainImgs.length > 0 ? domainImgs : links;
        for (const c of candidates.slice(0, 3)) {
          if (await tryUpload(robot, c)) return true;
        }
      } catch { /* skip */ }
    }
  } catch (e) { console.log(`    Search failed: ${e instanceof Error ? e.message : String(e)}`); }

  await delay(2000);

  // Strategy 2 — YouTube thumbnail
  console.log(`  S2: YouTube thumbnail...`);
  try {
    const yt = await firecrawl.search(`site:youtube.com ${robot.name} ${mfr} robot`, { limit: 3 });
    const ytResults = (yt as { web?: { url: string }[] }).web || [];
    for (const r of ytResults) {
      const m = r.url?.match(/(?:watch\?v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
      if (!m) continue;
      const thumb = `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg`;
      if (await tryUpload(robot, thumb)) return true;
    }
  } catch { console.log(`    YT search failed`); }

  await delay(2000);

  // Strategy 3 — Wikipedia
  console.log(`  S3: Wikipedia...`);
  try {
    const wiki = await firecrawl.search(`${robot.name} wikipedia`, { limit: 2 });
    const wikiResults = (wiki as { web?: { url: string }[] }).web || [];
    for (const r of wikiResults) {
      if (!r.url?.includes("wikipedia")) continue;
      try {
        const scrape = await firecrawl.scrape(r.url, { formats: ["links"] });
        const wikiImgs = ((scrape as { links?: string[] }).links || []).filter((l: string) =>
          isImageUrl(l) && (l.includes("upload.wikimedia") || l.includes("commons.wikimedia")) && !l.includes("logo") && !l.includes("icon")
        );
        for (const img of wikiImgs.slice(0, 2)) {
          if (await tryUpload(robot, img)) return true;
        }
      } catch { /* skip */ }
    }
  } catch { console.log(`    Wiki search failed`); }

  return false;
}

async function main() {
  console.log("═══ Fixing remaining robot images (batch 2) ═══\n");
  await supabase.storage.createBucket("robot-images", { public: true }).catch(() => {});

  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, images, manufacturers(name)")
    .order("robo_score", { ascending: false, nullsFirst: false });

  const needsFix = (robots || []).filter((r: Robot) => {
    const imgs = (Array.isArray(r.images) ? r.images : []) as { url: string }[];
    const url = imgs[0]?.url || "";
    return !url || url.includes("unsplash");
  }) as Robot[];

  console.log(`${needsFix.length} robots need images\n`);

  let fixed = 0, failed = 0;
  for (let i = 0; i < needsFix.length; i++) {
    const robot = needsFix[i];
    console.log(`[${i + 1}/${needsFix.length}] ${robot.name}...`);
    const ok = await fixRobot(robot);
    if (ok) fixed++; else { failed++; console.log(`    [ERR] No image found`); }
    await delay(3000);
  }

  console.log(`\n═══ RESULTS ═══`);
  console.log(`Fixed:  ${fixed}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
