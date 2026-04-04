/**
 * Scrape manufacturer product pages for embedded YouTube/Vimeo videos.
 * Matches found videos to robots in the database and updates records.
 *
 * Requires: FIRECRAWL_API_KEY in .env.local
 * Run: npx tsx scripts/scrape-manufacturer-videos.ts
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

interface VideoInfo {
  platform: "youtube" | "vimeo";
  videoId: string;
  title: string;
  sourceUrl: string;
  manufacturerSlug: string;
  matchedRobotId: string | null;
  matchedRobotName: string | null;
}

interface LogEntry {
  found: VideoInfo[];
  skipped: { manufacturer: string; reason: string }[];
  timestamp: string;
  totalManufacturers: number;
  totalVideosFound: number;
  totalRobotsUpdated: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractYouTubeIds(text: string): string[] {
  const ids = new Set<string>();
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/g,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/g,
  ];
  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      ids.add(match[1]);
    }
  }
  return Array.from(ids);
}

function extractVimeoIds(text: string): string[] {
  const ids = new Set<string>();
  const patterns = [
    /player\.vimeo\.com\/video\/(\d+)/g,
    /vimeo\.com\/(\d+)/g,
  ];
  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      ids.add(match[1]);
    }
  }
  return Array.from(ids);
}

async function verifyYouTube(
  videoId: string
): Promise<{ valid: boolean; title: string }> {
  try {
    const resp = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!resp.ok) return { valid: false, title: "" };
    const data = await resp.json();
    return { valid: true, title: data.title || "" };
  } catch {
    return { valid: false, title: "" };
  }
}

async function verifyVimeo(
  videoId: string
): Promise<{ valid: boolean; title: string }> {
  try {
    const resp = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`
    );
    if (!resp.ok) return { valid: false, title: "" };
    const data = await resp.json();
    return { valid: true, title: data.title || "" };
  } catch {
    return { valid: false, title: "" };
  }
}

function matchVideoToRobot(
  title: string,
  pageUrl: string,
  robots: { id: string; name: string; slug: string }[]
): { id: string; name: string } | null {
  const combined = `${title} ${pageUrl}`.toLowerCase();
  for (const robot of robots) {
    const nameWords = robot.name.toLowerCase();
    if (combined.includes(nameWords)) {
      return { id: robot.id, name: robot.name };
    }
    // Also check slug (hyphenated form)
    if (combined.includes(robot.slug)) {
      return { id: robot.id, name: robot.name };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Manufacturer Video Scraper ===\n");

  if (!process.env.FIRECRAWL_API_KEY) {
    console.log(
      "FIRECRAWL_API_KEY is not set in .env.local. Cannot scrape pages."
    );
    console.log("Set the key and re-run this script.");
    process.exit(0);
  }

  const { default: FirecrawlApp } = await import("@mendable/firecrawl-js");
  const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY!,
  });

  // Fetch manufacturers, sorted by robot count (we approximate by fetching all
  // and sorting after counting robots per manufacturer).
  const { data: mfrs, error: mfrErr } = await supabase
    .from("manufacturers")
    .select("id, name, slug, website");

  if (mfrErr || !mfrs) {
    console.error("Failed to fetch manufacturers:", mfrErr?.message);
    process.exit(1);
  }

  // Count robots per manufacturer to sort
  const mfrRobotCounts: Map<string, number> = new Map();
  for (const mfr of mfrs) {
    const { count } = await supabase
      .from("robots")
      .select("id", { count: "exact", head: true })
      .eq("manufacturer_id", mfr.id);
    mfrRobotCounts.set(mfr.id, count ?? 0);
  }

  // Sort by robot count descending, take first 30
  const sortedMfrs = mfrs
    .filter((m) => m.website)
    .sort(
      (a, b) =>
        (mfrRobotCounts.get(b.id) ?? 0) - (mfrRobotCounts.get(a.id) ?? 0)
    )
    .slice(0, 30);

  console.log(
    `Processing ${sortedMfrs.length} manufacturers with websites...\n`
  );

  const log: LogEntry = {
    found: [],
    skipped: [],
    timestamp: new Date().toISOString(),
    totalManufacturers: sortedMfrs.length,
    totalVideosFound: 0,
    totalRobotsUpdated: 0,
  };

  const pageSuffixes = ["", "/products", "/robots", "/solutions"];

  for (const mfr of sortedMfrs) {
    const website = mfr.website!.replace(/\/+$/, ""); // trim trailing slashes
    const robotCount = mfrRobotCounts.get(mfr.id) ?? 0;
    console.log(
      `--- ${mfr.name} (${robotCount} robots) [${website}] ---`
    );

    // Fetch robots for this manufacturer
    const { data: robots } = await supabase
      .from("robots")
      .select("id, name, slug")
      .eq("manufacturer_id", mfr.id);

    if (!robots || robots.length === 0) {
      log.skipped.push({
        manufacturer: mfr.name,
        reason: "No robots in database",
      });
      console.log("  Skipped: no robots in database");
      continue;
    }

    const allYouTubeIds: { id: string; sourceUrl: string }[] = [];
    const allVimeoIds: { id: string; sourceUrl: string }[] = [];

    for (const suffix of pageSuffixes) {
      const url = `${website}${suffix}`;
      console.log(`  Scraping: ${url}`);

      try {
        const result = await firecrawl.scrapeUrl(url, {
          formats: ["markdown"],
        });

        if (!result.success || !result.markdown) {
          console.log(`    No content returned`);
          await sleep(2000);
          continue;
        }

        const content = result.markdown;

        const ytIds = extractYouTubeIds(content);
        for (const id of ytIds) {
          allYouTubeIds.push({ id, sourceUrl: url });
        }

        const vimeoIds = extractVimeoIds(content);
        for (const id of vimeoIds) {
          allVimeoIds.push({ id, sourceUrl: url });
        }

        console.log(
          `    Found: ${ytIds.length} YouTube, ${vimeoIds.length} Vimeo`
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`    Scrape error: ${msg}`);
      }

      await sleep(2000); // Rate limit between Firecrawl requests
    }

    // Deduplicate video IDs
    const seenYt = new Set<string>();
    const uniqueYt = allYouTubeIds.filter((v) => {
      if (seenYt.has(v.id)) return false;
      seenYt.add(v.id);
      return true;
    });

    const seenVimeo = new Set<string>();
    const uniqueVimeo = allVimeoIds.filter((v) => {
      if (seenVimeo.has(v.id)) return false;
      seenVimeo.add(v.id);
      return true;
    });

    // Verify and match YouTube videos
    for (const { id: videoId, sourceUrl } of uniqueYt) {
      const { valid, title } = await verifyYouTube(videoId);
      await sleep(500);

      if (!valid) {
        console.log(`  YouTube ${videoId}: invalid/unavailable`);
        continue;
      }

      console.log(`  YouTube ${videoId}: "${title}"`);
      log.totalVideosFound++;

      const matched = matchVideoToRobot(title, sourceUrl, robots);

      const info: VideoInfo = {
        platform: "youtube",
        videoId,
        title,
        sourceUrl,
        manufacturerSlug: mfr.slug,
        matchedRobotId: matched?.id ?? null,
        matchedRobotName: matched?.name ?? null,
      };
      log.found.push(info);

      if (matched) {
        // Check if robot already has a youtube_video_id
        const { data: existing } = await supabase
          .from("robots")
          .select("youtube_video_id")
          .eq("id", matched.id)
          .single();

        if (existing && !existing.youtube_video_id) {
          const { error: updateErr } = await supabase
            .from("robots")
            .update({
              youtube_video_id: videoId,
              youtube_title: title,
              youtube_verified: true,
              media_updated_at: new Date().toISOString(),
            })
            .eq("id", matched.id);

          if (updateErr) {
            console.log(
              `    DB update error for ${matched.name}: ${updateErr.message}`
            );
          } else {
            console.log(`    Updated robot: ${matched.name}`);
            log.totalRobotsUpdated++;
          }
        } else if (existing?.youtube_video_id) {
          console.log(
            `    Robot ${matched.name} already has a YouTube video`
          );
        }
      }
    }

    // Verify and match Vimeo videos
    for (const { id: videoId, sourceUrl } of uniqueVimeo) {
      const { valid, title } = await verifyVimeo(videoId);
      await sleep(500);

      if (!valid) {
        console.log(`  Vimeo ${videoId}: invalid/unavailable`);
        continue;
      }

      console.log(`  Vimeo ${videoId}: "${title}"`);
      log.totalVideosFound++;

      const matched = matchVideoToRobot(title, sourceUrl, robots);

      const info: VideoInfo = {
        platform: "vimeo",
        videoId,
        title,
        sourceUrl,
        manufacturerSlug: mfr.slug,
        matchedRobotId: matched?.id ?? null,
        matchedRobotName: matched?.name ?? null,
      };
      log.found.push(info);

      if (matched) {
        const { data: existing } = await supabase
          .from("robots")
          .select("vimeo_video_id")
          .eq("id", matched.id)
          .single();

        if (existing && !existing.vimeo_video_id) {
          const { error: updateErr } = await supabase
            .from("robots")
            .update({
              vimeo_video_id: videoId,
              media_updated_at: new Date().toISOString(),
            })
            .eq("id", matched.id);

          if (updateErr) {
            console.log(
              `    DB update error for ${matched.name}: ${updateErr.message}`
            );
          } else {
            console.log(`    Updated robot: ${matched.name} (Vimeo)`);
            log.totalRobotsUpdated++;
          }
        } else if (existing?.vimeo_video_id) {
          console.log(
            `    Robot ${matched.name} already has a Vimeo video`
          );
        }
      }
    }

    if (uniqueYt.length === 0 && uniqueVimeo.length === 0) {
      log.skipped.push({
        manufacturer: mfr.name,
        reason: "No videos found on pages",
      });
    }
  }

  // Write log file
  const logPath = path.resolve(
    process.cwd(),
    "scripts/manufacturer-video-log.json"
  );
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  console.log(`\nLog written to ${logPath}`);

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Manufacturers processed: ${sortedMfrs.length}`);
  console.log(`Videos found: ${log.totalVideosFound}`);
  console.log(`Robots updated: ${log.totalRobotsUpdated}`);
  console.log(`Skipped: ${log.skipped.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
