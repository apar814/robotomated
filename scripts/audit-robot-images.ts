/**
 * Robot Image Quality Audit
 * Checks every active robot's image URL for availability, size, and type.
 * Run: npx tsx scripts/audit-robot-images.ts
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ImageIssue = "good" | "broken" | "missing" | "too_small" | "wrong_type" | "is_logo";

interface ImageEntry {
  url: string;
  alt?: string;
}

interface RobotRecord {
  id: string;
  name: string;
  slug: string;
  images: ImageEntry[] | null;
  manufacturers: { name: string; website: string | null } | null;
  robot_categories: { name: string; slug: string } | null;
}

interface AuditResult {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  manufacturerWebsite: string | null;
  category: string;
  categorySlug: string;
  imageUrl: string | null;
  issue: ImageIssue;
  contentLength: number | null;
  contentType: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LOGO_PATTERNS = /logo|icon|badge|avatar/i;
const MIN_IMAGE_BYTES = 50_000; // 50 KB
const FETCH_TIMEOUT_MS = 5_000;
const DELAY_BETWEEN_REQUESTS_MS = 300;
const MAX_CONCURRENT = 3;
const BATCH_SIZE = 20;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkImageUrl(url: string): Promise<{
  issue: ImageIssue;
  contentLength: number | null;
  contentType: string | null;
}> {
  // Check for logo-like URLs first
  if (LOGO_PATTERNS.test(url)) {
    return { issue: "is_logo", contentLength: null, contentType: null };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (res.status !== 200) {
      return { issue: "broken", contentLength: null, contentType: null };
    }

    const contentType = res.headers.get("content-type") || "";
    const contentLengthHeader = res.headers.get("content-length");
    const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : null;

    if (!contentType.startsWith("image/")) {
      return { issue: "wrong_type", contentLength, contentType };
    }

    if (contentLength !== null && contentLength < MIN_IMAGE_BYTES) {
      return { issue: "too_small", contentLength, contentType };
    }

    return { issue: "good", contentLength, contentType };
  } catch {
    return { issue: "broken", contentLength: null, contentType: null };
  }
}

/**
 * Process an array of items with bounded concurrency.
 */
async function processConcurrent<T, R>(
  items: T[],
  concurrency: number,
  delayMs: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
      if (delayMs > 0) await sleep(delayMs);
    }
  }

  const workers: Promise<void>[] = [];
  for (let w = 0; w < Math.min(concurrency, items.length); w++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("Robot Image Audit");
  console.log("=".repeat(60));

  // Fetch all active robots with manufacturer and category joins
  const allRobots: RobotRecord[] = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("robots")
      .select("id, name, slug, images, manufacturers(name, website), robot_categories(name, slug)")
      .eq("status", "active")
      .range(offset, offset + pageSize - 1)
      .order("name");

    if (error) {
      console.error("Supabase query error:", error.message);
      process.exit(1);
    }

    if (!data || data.length === 0) break;
    allRobots.push(...(data as unknown as RobotRecord[]));
    if (data.length < pageSize) break;
    offset += pageSize;
  }

  console.log(`Found ${allRobots.length} active robots\n`);

  // Process in batches of BATCH_SIZE
  const results: AuditResult[] = [];
  let checked = 0;

  for (let batchStart = 0; batchStart < allRobots.length; batchStart += BATCH_SIZE) {
    const batch = allRobots.slice(batchStart, batchStart + BATCH_SIZE);

    const batchResults = await processConcurrent(
      batch,
      MAX_CONCURRENT,
      DELAY_BETWEEN_REQUESTS_MS,
      async (robot): Promise<AuditResult> => {
        checked++;
        if (checked % 50 === 0 || checked === 1) {
          console.log(`Checking [${checked}/${allRobots.length}]: ${robot.name}...`);
        }

        const mfr = robot.manufacturers;
        const cat = robot.robot_categories;

        const images = Array.isArray(robot.images) ? (robot.images as ImageEntry[]) : null;
        const firstUrl =
          images && images.length > 0 && images[0]?.url ? images[0].url : null;

        if (!firstUrl) {
          return {
            id: robot.id,
            name: robot.name,
            slug: robot.slug,
            manufacturer: mfr?.name ?? "Unknown",
            manufacturerWebsite: mfr?.website ?? null,
            category: cat?.name ?? "Unknown",
            categorySlug: cat?.slug ?? "",
            imageUrl: null,
            issue: "missing",
            contentLength: null,
            contentType: null,
          };
        }

        const check = await checkImageUrl(firstUrl);

        return {
          id: robot.id,
          name: robot.name,
          slug: robot.slug,
          manufacturer: mfr?.name ?? "Unknown",
          manufacturerWebsite: mfr?.website ?? null,
          category: cat?.name ?? "Unknown",
          categorySlug: cat?.slug ?? "",
          imageUrl: firstUrl,
          issue: check.issue,
          contentLength: check.contentLength,
          contentType: check.contentType,
        };
      }
    );

    results.push(...batchResults);
  }

  // ---------------------------------------------------------------------------
  // Tally
  // ---------------------------------------------------------------------------

  const counts: Record<ImageIssue, number> = {
    good: 0,
    broken: 0,
    missing: 0,
    too_small: 0,
    wrong_type: 0,
    is_logo: 0,
  };

  for (const r of results) {
    counts[r.issue]++;
  }

  const total = results.length;
  const pct = (n: number) => ((n / total) * 100).toFixed(1);
  const lowQuality = counts.too_small + counts.wrong_type + counts.is_logo;

  // ---------------------------------------------------------------------------
  // Console summary
  // ---------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total robots:     ${total}`);
  console.log(`Good images:      ${counts.good} (${pct(counts.good)}%)`);
  console.log(`Broken images:    ${counts.broken} (${pct(counts.broken)}%)`);
  console.log(`Missing images:   ${counts.missing} (${pct(counts.missing)}%)`);
  console.log(`Too small:        ${counts.too_small} (${pct(counts.too_small)}%)`);
  console.log(`Wrong type:       ${counts.wrong_type} (${pct(counts.wrong_type)}%)`);
  console.log(`Is logo/icon:     ${counts.is_logo} (${pct(counts.is_logo)}%)`);
  console.log(`Low quality total: ${lowQuality} (${pct(lowQuality)}%)`);

  // ---------------------------------------------------------------------------
  // Robots needing attention (everything except "good")
  // ---------------------------------------------------------------------------

  const needsAttention = results.filter((r) => r.issue !== "good");

  // Sort: missing first, then broken, then rest
  const issuePriority: Record<ImageIssue, number> = {
    missing: 0,
    broken: 1,
    is_logo: 2,
    too_small: 3,
    wrong_type: 4,
    good: 5,
  };
  needsAttention.sort((a, b) => issuePriority[a.issue] - issuePriority[b.issue]);

  // ---------------------------------------------------------------------------
  // Write markdown report
  // ---------------------------------------------------------------------------

  const now = new Date().toISOString();

  let md = `# Robot Image Audit Report\nGenerated: ${now}\n\n`;
  md += `## Summary\n`;
  md += `Total robots: ${total}\n`;
  md += `Good images: ${counts.good} (${pct(counts.good)}%)\n`;
  md += `Broken images: ${counts.broken} (${pct(counts.broken)}%)\n`;
  md += `Missing images: ${counts.missing} (${pct(counts.missing)}%)\n`;
  md += `Low quality: ${lowQuality} (${pct(lowQuality)}%)\n\n`;

  if (needsAttention.length > 0) {
    md += `## Robots Needing Images\n\n`;
    md += `| Robot | Manufacturer | Category | Issue |\n`;
    md += `|-------|-------------|----------|-------|\n`;
    for (const r of needsAttention) {
      const robotName = r.name.replace(/\|/g, "\\|");
      const mfrName = r.manufacturer.replace(/\|/g, "\\|");
      const catName = r.category.replace(/\|/g, "\\|");
      md += `| ${robotName} | ${mfrName} | ${catName} | ${r.issue} |\n`;
    }
  } else {
    md += `## Robots Needing Images\n\nAll robots have good images.\n`;
  }

  const docsDir = path.resolve(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  const reportPath = path.join(docsDir, "image-audit-report.md");
  fs.writeFileSync(reportPath, md, "utf-8");
  console.log(`\nReport written to ${reportPath}`);

  // ---------------------------------------------------------------------------
  // Write JSON of robots needing images
  // ---------------------------------------------------------------------------

  const jsonOutput = needsAttention.map((r) => ({
    id: r.id,
    name: r.name,
    manufacturer: r.manufacturer,
    manufacturerWebsite: r.manufacturerWebsite,
    category: r.category,
    slug: r.slug,
    issue: r.issue,
  }));

  const jsonPath = path.resolve(process.cwd(), "scripts", "robots-needing-images.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), "utf-8");
  console.log(`JSON written to ${jsonPath}`);
  console.log(`\nDone. ${needsAttention.length} robots need attention.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
