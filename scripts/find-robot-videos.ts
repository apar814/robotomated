/**
 * Find and verify YouTube videos for robots in the Supabase database.
 *
 * For each robot that has a youtube_url set, this script:
 *   1. Extracts the video ID from the URL
 *   2. Verifies the video exists via YouTube oEmbed
 *   3. Scores the video based on title relevance
 *   4. Checks thumbnail availability
 *   5. Logs all results to scripts/video-finder-log.json
 *
 * Usage:
 *   npx tsx scripts/find-robot-videos.ts
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

interface RobotRecord {
  id: string;
  name: string;
  slug: string;
  youtube_url: string | null;
  manufacturer: { name: string } | null;
}

interface VideoResult {
  robot_id: string;
  robot_name: string;
  robot_slug: string;
  manufacturer_name: string;
  youtube_url: string | null;
  video_id: string | null;
  verified: boolean;
  youtube_title: string | null;
  quality_score: number;
  thumbnail_url: string | null;
  status: "verified" | "invalid" | "no_url" | "private_or_removed" | "error";
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VIDEO_ID_REGEX = /(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function extractVideoId(url: string): string | null {
  const match = url.match(VIDEO_ID_REGEX);
  return match ? match[1] : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeQualityScore(
  title: string,
  robotName: string,
  manufacturerName: string
): number {
  let score = 0;
  const lowerTitle = title.toLowerCase();
  const lowerRobot = robotName.toLowerCase();
  const lowerMfr = manufacturerName.toLowerCase();

  if (lowerTitle.includes(lowerRobot)) score += 10;
  if (lowerTitle.includes(lowerMfr)) score += 8;
  if (lowerTitle.includes("official") || lowerTitle.includes("demo"))
    score += 3;
  // Penalize pure review content (but not if it also matches robot/mfr)
  if (lowerTitle.includes("review") && score === 0) score -= 5;

  return score;
}

async function verifyVideoOEmbed(
  videoId: string
): Promise<{ ok: boolean; title: string | null }> {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = (await res.json()) as { title?: string };
      return { ok: true, title: data.title ?? null };
    }
    return { ok: false, title: null };
  } catch {
    return { ok: false, title: null };
  }
}

async function findBestThumbnail(
  videoId: string
): Promise<string | null> {
  const sizes = ["maxresdefault", "hqdefault", "mqdefault"];
  for (const size of sizes) {
    const url = `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        const contentLength = res.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > 10000) {
          return url;
        }
      }
    } catch {
      // continue to next size
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Robot Video Finder ===\n");

  // Fetch robots with manufacturer name, limit 200
  const { data: robots, error } = await supabase
    .from("robots")
    .select("id, name, slug, youtube_url, manufacturer:manufacturers(name)")
    .limit(200);

  if (error) {
    console.error("Failed to fetch robots:", error.message);
    process.exit(1);
  }

  if (!robots || robots.length === 0) {
    console.log("No robots found in database.");
    process.exit(0);
  }

  console.log(`Found ${robots.length} robots to process.\n`);

  const results: VideoResult[] = [];
  let videosFound = 0;
  let videosVerified = 0;
  let videosMissing = 0;

  for (let i = 0; i < robots.length; i++) {
    const robot = robots[i] as unknown as RobotRecord;
    const mfrName =
      robot.manufacturer && typeof robot.manufacturer === "object"
        ? (robot.manufacturer as { name: string }).name
        : "Unknown";

    // Progress update every 20 robots
    if (i > 0 && i % 20 === 0) {
      console.log(
        `Progress: ${i}/${robots.length} processed | ` +
          `Found: ${videosFound} | Verified: ${videosVerified} | Missing: ${videosMissing}`
      );
    }

    // No youtube_url -- nothing to verify
    if (!robot.youtube_url) {
      videosMissing++;
      results.push({
        robot_id: robot.id,
        robot_name: robot.name,
        robot_slug: robot.slug,
        manufacturer_name: mfrName,
        youtube_url: null,
        video_id: null,
        verified: false,
        youtube_title: null,
        quality_score: 0,
        thumbnail_url: null,
        status: "no_url",
      });
      continue;
    }

    // Extract video ID
    const videoId = extractVideoId(robot.youtube_url);
    if (!videoId) {
      videosMissing++;
      results.push({
        robot_id: robot.id,
        robot_name: robot.name,
        robot_slug: robot.slug,
        manufacturer_name: mfrName,
        youtube_url: robot.youtube_url,
        video_id: null,
        verified: false,
        youtube_title: null,
        quality_score: 0,
        thumbnail_url: null,
        status: "invalid",
        error: "Could not extract video ID from URL",
      });
      continue;
    }

    videosFound++;

    // Rate limit: 500ms between oEmbed requests
    await sleep(500);

    // Verify via oEmbed
    const { ok, title } = await verifyVideoOEmbed(videoId);

    if (!ok) {
      results.push({
        robot_id: robot.id,
        robot_name: robot.name,
        robot_slug: robot.slug,
        manufacturer_name: mfrName,
        youtube_url: robot.youtube_url,
        video_id: videoId,
        verified: false,
        youtube_title: null,
        quality_score: 0,
        thumbnail_url: null,
        status: "private_or_removed",
      });
      continue;
    }

    const qualityScore = computeQualityScore(
      title ?? "",
      robot.name,
      mfrName
    );

    // Check thumbnail availability
    const thumbnailUrl = await findBestThumbnail(videoId);

    const passed = qualityScore > 5;

    if (passed) {
      videosVerified++;
      console.log(
        `  [OK] ${robot.name} (${mfrName}) -- "${title}" (score: ${qualityScore})`
      );
    } else {
      console.log(
        `  [LOW] ${robot.name} (${mfrName}) -- "${title}" (score: ${qualityScore})`
      );
    }

    results.push({
      robot_id: robot.id,
      robot_name: robot.name,
      robot_slug: robot.slug,
      manufacturer_name: mfrName,
      youtube_url: robot.youtube_url,
      video_id: videoId,
      verified: passed,
      youtube_title: title,
      quality_score: qualityScore,
      thumbnail_url: thumbnailUrl,
      status: passed ? "verified" : "verified",
    });
  }

  // Write log file
  const logPath = path.resolve(process.cwd(), "scripts/video-finder-log.json");
  const logData = {
    run_at: new Date().toISOString(),
    total_robots: robots.length,
    videos_found: videosFound,
    videos_verified: videosVerified,
    videos_missing: videosMissing,
    results,
  };

  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2), "utf-8");

  // Final summary
  console.log("\n=== Final Summary ===");
  console.log(`Total robots processed: ${robots.length}`);
  console.log(`Videos found (URL present): ${videosFound}`);
  console.log(`Videos verified (score > 5): ${videosVerified}`);
  console.log(`Videos missing (no URL): ${videosMissing}`);
  console.log(`Log saved to: ${logPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
