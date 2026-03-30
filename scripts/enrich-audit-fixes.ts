/**
 * Targeted fixes using corrected Firecrawl API.
 * Run after data-audit.ts to fix descriptions, specs, and images.
 * Run: npx tsx scripts/enrich-audit-fixes.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

const changes: string[] = [];
let issuesFixed = 0;

// Spec extraction patterns (same as scrape-robot-specs.ts)
function extractSpecs(md: string): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  const lower = md.toLowerCase();

  const payload = lower.match(/payload[:\s]*(\d+(?:\.\d+)?)\s*kg/);
  if (payload) specs.payload_kg = parseFloat(payload[1]);
  const reach = lower.match(/reach[:\s]*(\d+(?:\.\d+)?)\s*mm/);
  if (reach) specs.reach_mm = parseFloat(reach[1]);
  const weight = lower.match(/(?:weight|mass)[:\s]*(\d+(?:\.\d+)?)\s*kg/);
  if (weight) specs.weight_kg = parseFloat(weight[1]);
  const dof = lower.match(/(\d)\s*(?:dof|degrees?\s*of\s*freedom|axes|axis)/);
  if (dof) specs.dof = parseInt(dof[1]);
  const repeat = lower.match(/repeatability[:\s]*[±]?\s*(\d+(?:\.\d+)?)\s*mm/);
  if (repeat) specs.repeatability = `±${repeat[1]}mm`;
  const ip = lower.match(/ip\s*([\d]{2,3})/);
  if (ip) specs.ip_rating = `IP${ip[1]}`;
  const battery = lower.match(/battery[:\s]*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/);
  if (battery) specs.battery_hrs = parseFloat(battery[1]);
  const suction = lower.match(/(\d{3,6})\s*pa\s*(?:suction)?/);
  if (suction) specs.suction_pa = parseInt(suction[1]);
  const speed = lower.match(/(?:max(?:imum)?\s*)?speed[:\s]*([\d.]+\s*(?:m\/s|km\/h|mph|°\/s))/);
  if (speed) specs.max_speed = speed[1];
  const temp = lower.match(/(?:operating|temperature)[:\s]*(-?\d+)\s*(?:°|to|–|-)\s*(-?\d+)\s*°?\s*c/);
  if (temp) specs.operating_temp = `${temp[1]}°C to ${temp[2]}°C`;

  // Additional patterns
  const nav = lower.match(/(?:navigation|nav)[:\s]*(lidar|slam|visual|gps|rtk|inertial)[^\n]*/);
  if (nav) specs.navigation = nav[1].toUpperCase();
  const charge = lower.match(/charg(?:e|ing)\s*(?:time)?[:\s]*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)/);
  if (charge) specs.charge_time_hrs = parseFloat(charge[1]);

  return specs;
}

function downloadImage(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const location = res.headers.location;
        if (location) { res.resume(); downloadImage(location).then(resolve); return; }
      }
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const ct = res.headers["content-type"] || "";
      if (!ct.startsWith("image/")) { res.resume(); resolve(null); return; }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", () => resolve(null));
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  console.log("═══ Enrichment Fixes (Firecrawl) ═══\n");

  const { data: robots } = await supabase
    .from("robots")
    .select("*, manufacturers(name, slug, website, logo_url), robot_categories(name, slug)")
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false });

  const allRobots = robots || [];
  console.log(`Loaded ${allRobots.length} active robots\n`);

  // ─── FIX B: Missing descriptions ───
  console.log("── Fix B: Missing Descriptions ──");
  const needDesc = allRobots.filter((r: any) =>
    (!r.description_short || r.description_short.length < 50) ||
    (!r.description_long || r.description_long.length < 200)
  );
  console.log(`${needDesc.length} robots need descriptions`);

  const descLimit = Math.min(needDesc.length, 15);
  for (let i = 0; i < descLimit; i++) {
    const r = needDesc[i] as any;
    const mfr = r.manufacturers?.name || "";
    console.log(`[${i + 1}/${descLimit}] ${r.name}...`);

    try {
      const searchResult = await firecrawl.search(
        `${r.name} ${mfr} robot specifications features`,
        { limit: 3 }
      );

      const webResults = (searchResult as any).web || [];
      if (!webResults.length) {
        console.log(`  SKIP: no search results`);
        await delay(2000);
        continue;
      }

      const topUrl = webResults[0].url;
      console.log(`  Scraping: ${topUrl.substring(0, 60)}...`);

      const scrapeResult = await firecrawl.scrape(topUrl, { formats: ["markdown"] });
      const markdown = (scrapeResult as any).markdown || "";

      if (!markdown || markdown.length < 100) {
        console.log(`  SKIP: no usable content`);
        await delay(2000);
        continue;
      }

      // Extract description from paragraphs
      const paragraphs = markdown
        .split("\n\n")
        .map((p: string) => p.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`#]/g, "").trim())
        .filter((p: string) => p.length > 40 && !p.startsWith("|") && !p.startsWith("-") && !p.match(/^[\d.]+$/));

      const updates: Record<string, string> = {};

      if (!r.description_short || r.description_short.length < 50) {
        if (paragraphs.length > 0) {
          let short = paragraphs[0].substring(0, 120);
          // Trim to last period if possible
          const lastDot = short.lastIndexOf(".");
          if (lastDot > 40) short = short.substring(0, lastDot + 1);
          else if (!short.endsWith(".")) short += ".";
          updates.description_short = short;
        }
      }

      if (!r.description_long || r.description_long.length < 200) {
        if (paragraphs.length >= 2) {
          let long = paragraphs.slice(0, 4).join(" ").substring(0, 400);
          const lastDot = long.lastIndexOf(".");
          if (lastDot > 150) long = long.substring(0, lastDot + 1);
          updates.description_long = long;
        }
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from("robots").update(updates).eq("id", r.id);
        issuesFixed++;
        changes.push(`Added description for ${r.name}: ${Object.keys(updates).join(", ")}`);
        console.log(`  [OK] Updated: ${Object.keys(updates).join(", ")}`);
      } else {
        console.log(`  SKIP: couldn't extract good descriptions`);
      }
    } catch (err) {
      console.log(`  ERR: ${err instanceof Error ? err.message : String(err)}`);
    }

    await delay(2000);
  }

  // ─── FIX C: Missing specs ───
  console.log("\n── Fix C: Missing Specs ──");
  const needSpecs = allRobots.filter((r: any) => {
    const specs = r.specs || {};
    return Object.keys(specs).length < 5;
  });
  console.log(`${needSpecs.length} robots need more specs`);

  const specLimit = Math.min(needSpecs.length, 15);
  for (let i = 0; i < specLimit; i++) {
    const r = needSpecs[i] as any;
    const mfr = r.manufacturers?.name || "";
    const existingSpecs = (r.specs || {}) as Record<string, unknown>;
    console.log(`[${i + 1}/${specLimit}] ${r.name} (${Object.keys(existingSpecs).length} specs)...`);

    try {
      const searchResult = await firecrawl.search(
        `${r.name} ${mfr} technical specifications`,
        { limit: 3 }
      );

      const webResults = (searchResult as any).web || [];
      if (!webResults.length) {
        console.log(`  SKIP: no results`);
        await delay(2000);
        continue;
      }

      const topUrl = webResults[0].url;
      console.log(`  Scraping: ${topUrl.substring(0, 60)}...`);

      const scrapeResult = await firecrawl.scrape(topUrl, { formats: ["markdown"] });
      const markdown = (scrapeResult as any).markdown || "";

      if (!markdown) {
        console.log(`  SKIP: no markdown`);
        await delay(2000);
        continue;
      }

      const newSpecs = extractSpecs(markdown);
      const merged = { ...existingSpecs };
      let addedCount = 0;

      for (const [key, value] of Object.entries(newSpecs)) {
        if (value != null && !(key in merged)) {
          merged[key] = value;
          addedCount++;
        }
      }

      if (addedCount > 0) {
        await supabase.from("robots").update({ specs: merged as Record<string, unknown> }).eq("id", r.id);
        issuesFixed++;
        changes.push(`Added ${addedCount} specs for ${r.name}: ${Object.keys(newSpecs).join(", ")}`);
        console.log(`  [OK] Added ${addedCount} fields: ${Object.keys(newSpecs).join(", ")}`);
      } else {
        console.log(`  SKIP: no new specs extracted`);
      }
    } catch (err) {
      console.log(`  ERR: ${err instanceof Error ? err.message : String(err)}`);
    }

    await delay(2000);
  }

  // ─── FIX A: Broken/missing images ───
  console.log("\n── Fix A: Missing Images ──");
  await supabase.storage.createBucket("robot-images", { public: true }).catch(() => {});

  const needImages = allRobots.filter((r: any) => {
    const imgs = (r.images || []) as { url: string }[];
    return imgs.length === 0 || imgs.every((i: { url: string }) => !i.url || i.url.includes("unsplash"));
  });
  console.log(`${needImages.length} robots need images`);

  const imgLimit = Math.min(needImages.length, 10);
  for (let i = 0; i < imgLimit; i++) {
    const r = needImages[i] as any;
    const mfr = r.manufacturers?.name || "";
    console.log(`[${i + 1}/${imgLimit}] ${r.name}...`);

    try {
      const searchResult = await firecrawl.search(
        `${r.name} ${mfr} official product image`,
        { limit: 5 }
      );

      const webResults = (searchResult as any).web || [];
      if (!webResults.length) {
        console.log(`  SKIP: no results`);
        await delay(2000);
        continue;
      }

      let foundUrl: string | null = null;

      for (const result of webResults.slice(0, 3)) {
        if (!result.url) continue;
        try {
          const scrapeResult = await firecrawl.scrape(result.url, { formats: ["links"] });
          const links = (scrapeResult as any).links || [];
          const imageLinks = links.filter((l: string) =>
            /\.(png|jpg|jpeg|webp)(\?|$)/i.test(l) &&
            !l.includes("logo") && !l.includes("icon") && !l.includes("favicon")
          );

          // Prefer manufacturer domain images
          const mfrDomain = result.url.split("/")[2];
          const mfrImages = imageLinks.filter((l: string) => l.includes(mfrDomain));
          foundUrl = mfrImages[0] || imageLinks[0] || null;

          if (foundUrl) break;
        } catch { /* skip */ }
        await delay(1000);
      }

      if (!foundUrl) {
        console.log(`  SKIP: no image found in scraped pages`);
        await delay(2000);
        continue;
      }

      console.log(`  Found: ${foundUrl.substring(0, 60)}...`);

      const imageBuffer = await downloadImage(foundUrl);
      if (!imageBuffer || imageBuffer.length < 5000) {
        console.log(`  SKIP: image too small or download failed`);
        await delay(2000);
        continue;
      }

      const ext = foundUrl.match(/\.(png|jpg|jpeg|webp)/i)?.[1] || "jpg";
      const storagePath = `robots/${r.slug}/hero.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("robot-images")
        .upload(storagePath, imageBuffer, {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          upsert: true,
        });

      if (uploadError) {
        console.log(`  ERR upload: ${uploadError.message}`);
        await delay(2000);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("robot-images")
        .getPublicUrl(storagePath);

      await supabase.from("robots").update({
        images: [{ url: publicUrl.publicUrl, alt: r.name }],
      }).eq("id", r.id);

      issuesFixed++;
      changes.push(`Fixed image for ${r.name}`);
      console.log(`  [OK] Uploaded to Supabase Storage`);
    } catch (err) {
      console.log(`  ERR: ${err instanceof Error ? err.message : String(err)}`);
    }

    await delay(2000);
  }

  // ─── Summary ───
  console.log(`\n═══ ENRICHMENT COMPLETE ═══`);
  console.log(`Issues fixed: ${issuesFixed}`);
  console.log(`\nChanges:`);
  for (const c of changes) console.log(`  - ${c}`);

  // Append to audit report
  const reportPath = path.join(process.cwd(), "docs", "data-audit-2026-03-24.md");
  if (fs.existsSync(reportPath)) {
    let report = fs.readFileSync(reportPath, "utf-8");

    // Update the changes section
    if (changes.length > 0) {
      const changeMd = changes.map(c => `- ${c}`).join("\n");
      report = report.replace(
        /## Changes Made\n\n[\s\S]*?(?=\n## |$)/,
        `## Changes Made\n\n${changeMd}\n\n`
      );
    }

    // Update executive summary
    report = report.replace(
      /\*\*Issues auto-fixed:\*\* \d+/,
      `**Issues auto-fixed:** ${23 + issuesFixed}`
    );

    fs.writeFileSync(reportPath, report, "utf-8");
    console.log(`\nReport updated: ${reportPath}`);
  }
}

main().catch(console.error);
