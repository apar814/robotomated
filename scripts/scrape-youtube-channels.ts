/**
 * YouTube Channel Video Scraper for Robotomated
 *
 * Finds official demo videos for robots by scraping manufacturer YouTube channels.
 *
 * Steps:
 *   1. Scrape manufacturer YouTube channel /videos pages via Firecrawl
 *   2. Match discovered videos to robots using relevance scoring
 *   3. Verify each candidate via YouTube oEmbed
 *   4. Check thumbnail availability (maxresdefault -> hqdefault fallback)
 *   5. Update Supabase robots table with verified video data
 *
 * Usage:
 *   npx tsx scripts/scrape-youtube-channels.ts
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
// Manufacturer Channel Map
// ---------------------------------------------------------------------------

const CHANNELS: Record<string, { handle: string; robots: string[] }> = {
  "Boston Dynamics": {
    handle: "BostonDynamics",
    robots: ["Spot", "Stretch", "Atlas", "Handle"],
  },
  "Universal Robots": {
    handle: "UniversalRobots",
    robots: ["UR3e", "UR5e", "UR10e", "UR16e", "UR20", "UR30"],
  },
  FANUC: {
    handle: "FANUCAmerica",
    robots: ["CRX-10iA", "CRX-25iA", "LR Mate", "M-1iA"],
  },
  DJI: {
    handle: "DJIGlobal",
    robots: ["Mavic 3", "Agras", "Matrice 350", "Mini 4"],
  },
  iRobot: {
    handle: "iRobot",
    robots: ["Roomba j9+", "Roomba Combo", "Braava jet"],
  },
  "Locus Robotics": {
    handle: "LocusRobotics",
    robots: ["Origin", "Vector", "Locus"],
  },
  "Agility Robotics": {
    handle: "AgilityRobotics",
    robots: ["Digit"],
  },
  "ABB Robotics": {
    handle: "ABBRobotics",
    robots: ["YuMi", "GoFa", "SWIFTI", "CRB 15000"],
  },
  KUKA: {
    handle: "KUKARobotics",
    robots: ["LBR iiwa", "KR AGILUS", "KR QUANTEC"],
  },
  Roborock: {
    handle: "Roborock",
    robots: ["S8 MaxV", "S8 Pro", "Q Revo", "Q5"],
  },
  "Intuitive Surgical": {
    handle: "IntuitiveSurgical",
    robots: ["da Vinci", "Ion"],
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DiscoveredVideo {
  videoId: string;
  title: string;
}

interface RobotMatch {
  robotId: string;
  robotName: string;
  robotSlug: string;
  manufacturer: string;
  videoId: string;
  videoTitle: string;
  score: number;
}

interface LogEntry {
  robot_id: string;
  robot_name: string;
  robot_slug: string;
  manufacturer: string;
  video_id: string | null;
  video_title: string | null;
  score: number;
  verified: boolean;
  thumbnail_url: string | null;
  updated: boolean;
  status: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract video IDs and titles from YouTube channel markdown.
 * Looks for /watch?v=XXXXXXXXXXX patterns (11-char video IDs).
 */
function extractVideosFromMarkdown(markdown: string): DiscoveredVideo[] {
  const videos: DiscoveredVideo[] = [];
  const seen = new Set<string>();

  // Match lines containing watch?v= links
  // Typical markdown: [Video Title](https://www.youtube.com/watch?v=XXXXXXXXXXX)
  const linkRegex = /\[([^\]]*)\]\([^)]*watch\?v=([A-Za-z0-9_-]{11})[^)]*\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const title = match[1].trim();
    const videoId = match[2];
    if (!seen.has(videoId) && title.length > 0) {
      seen.add(videoId);
      videos.push({ videoId, title });
    }
  }

  // Also catch bare watch URLs not in markdown link syntax
  const bareRegex = /watch\?v=([A-Za-z0-9_-]{11})/g;
  while ((match = bareRegex.exec(markdown)) !== null) {
    const videoId = match[1];
    if (!seen.has(videoId)) {
      seen.add(videoId);
      // Try to find a nearby title -- use surrounding text as fallback
      const idx = match.index;
      const surrounding = markdown.substring(
        Math.max(0, idx - 200),
        Math.min(markdown.length, idx + 200)
      );
      // Look for a title-like string nearby (text in brackets or before the URL)
      const titleMatch = surrounding.match(/\[([^\]]+)\]/);
      videos.push({
        videoId,
        title: titleMatch ? titleMatch[1].trim() : `Untitled (${videoId})`,
      });
    }
  }

  return videos;
}

/**
 * Score how well a video matches a given robot model.
 */
function scoreVideo(
  video: DiscoveredVideo,
  robotModel: string,
  manufacturer: string
): number {
  const titleLower = video.title.toLowerCase();
  const modelLower = robotModel.toLowerCase();
  const mfrLower = manufacturer.toLowerCase();
  let score = 0;

  // +20 if title contains exact robot model name (case-insensitive)
  if (titleLower.includes(modelLower)) {
    score += 20;
  }

  // +10 if title contains manufacturer name
  if (titleLower.includes(mfrLower)) {
    score += 10;
  }

  // +5 if title contains demo-related keywords
  const positiveKeywords = ["demo", "in action", "how it works", "official"];
  for (const kw of positiveKeywords) {
    if (titleLower.includes(kw)) {
      score += 5;
      break; // only count once
    }
  }

  // -10 if title contains non-demo keywords
  const negativeKeywords = ["interview", "webinar", "behind the scenes"];
  for (const kw of negativeKeywords) {
    if (titleLower.includes(kw)) {
      score -= 10;
      break;
    }
  }

  return score;
}

/**
 * Verify a video exists via YouTube oEmbed endpoint.
 * Returns the video title if valid, null otherwise.
 */
async function verifyVideo(
  videoId: string
): Promise<{ valid: boolean; title: string | null }> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (res.status === 200) {
      const data = (await res.json()) as { title?: string };
      return { valid: true, title: data.title ?? null };
    }
    return { valid: false, title: null };
  } catch {
    return { valid: false, title: null };
  }
}

/**
 * Check thumbnail availability. Prefer maxresdefault, fallback to hqdefault.
 */
async function checkThumbnail(
  videoId: string
): Promise<string | null> {
  const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  try {
    const res = await fetch(maxres, { method: "HEAD" });
    const contentLength = parseInt(res.headers.get("content-length") || "0", 10);
    if (res.status === 200 && contentLength > 10000) {
      return maxres;
    }
  } catch {
    // fall through
  }

  const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  try {
    const res = await fetch(hq, { method: "HEAD" });
    if (res.status === 200) {
      return hq;
    }
  } catch {
    // fall through
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== YouTube Channel Video Scraper ===\n");

  const logEntries: LogEntry[] = [];
  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalVerified = 0;
  let totalSkipped = 0;

  const hasFirecrawl = !!process.env.FIRECRAWL_API_KEY;

  // -----------------------------------------------------------------------
  // STEP 1: Scrape channel pages via Firecrawl
  // -----------------------------------------------------------------------

  const channelVideos: Record<string, DiscoveredVideo[]> = {};

  if (hasFirecrawl) {
    const FirecrawlApp = (await import("@mendable/firecrawl-js")).default;
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY!,
    });

    console.log("Scraping manufacturer YouTube channels via Firecrawl...\n");

    for (const [mfr, { handle }] of Object.entries(CHANNELS)) {
      const url = `https://www.youtube.com/@${handle}/videos`;
      console.log(`  Scraping: ${url}`);

      try {
        const result = await firecrawl.scrapeUrl(url, {
          formats: ["markdown"],
        });

        if (result.success && result.markdown) {
          const videos = extractVideosFromMarkdown(result.markdown);
          channelVideos[mfr] = videos;
          console.log(`    Found ${videos.length} videos for ${mfr}`);
        } else {
          console.log(`    No markdown returned for ${mfr}`);
          channelVideos[mfr] = [];
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`    Error scraping ${mfr}: ${msg}`);
        channelVideos[mfr] = [];
      }

      await sleep(2000); // Rate limit between Firecrawl scrapes
    }

    console.log("");
  } else {
    console.log(
      "FIRECRAWL_API_KEY not set -- skipping channel scraping.\n" +
        "Will only process robots that already have youtube_url in the DB.\n"
    );
  }

  // -----------------------------------------------------------------------
  // STEP 2: Load robots from DB and match videos
  // -----------------------------------------------------------------------

  console.log("Loading robots from database...\n");

  const { data: robots, error: robotsError } = await supabase
    .from("robots")
    .select("id, name, slug, youtube_url, image, manufacturer:manufacturers(name)")
    .order("name");

  if (robotsError) {
    console.error("Failed to load robots:", robotsError.message);
    process.exit(1);
  }

  if (!robots || robots.length === 0) {
    console.log("No robots found in database.");
    process.exit(0);
  }

  console.log(`Loaded ${robots.length} robots.\n`);

  // Build matches from scraped channel videos
  const robotMatches: Map<string, RobotMatch> = new Map();

  for (const [mfr, { robots: modelNames }] of Object.entries(CHANNELS)) {
    const videos = channelVideos[mfr] || [];
    if (videos.length === 0) continue;

    // Find DB robots that belong to this manufacturer
    for (const robot of robots) {
      const robotMfr =
        robot.manufacturer &&
        !Array.isArray(robot.manufacturer) &&
        typeof robot.manufacturer === "object"
          ? (robot.manufacturer as { name: string }).name
          : null;

      if (!robotMfr) continue;

      // Check if this robot's manufacturer matches and if the robot name
      // matches any of the model names we are looking for
      const mfrMatch =
        robotMfr.toLowerCase().includes(mfr.toLowerCase()) ||
        mfr.toLowerCase().includes(robotMfr.toLowerCase());
      if (!mfrMatch) continue;

      const matchesModel = modelNames.some(
        (model) =>
          robot.name.toLowerCase().includes(model.toLowerCase()) ||
          model.toLowerCase().includes(robot.name.toLowerCase().split(" ")[0])
      );
      if (!matchesModel) continue;

      // Score all videos for this robot
      let bestVideo: DiscoveredVideo | null = null;
      let bestScore = -Infinity;

      for (const video of videos) {
        const s = scoreVideo(video, robot.name, mfr);
        if (s > bestScore) {
          bestScore = s;
          bestVideo = video;
        }
      }

      if (bestVideo && bestScore >= 10) {
        const existing = robotMatches.get(robot.id);
        if (!existing || existing.score < bestScore) {
          robotMatches.set(robot.id, {
            robotId: robot.id,
            robotName: robot.name,
            robotSlug: robot.slug,
            manufacturer: mfr,
            videoId: bestVideo.videoId,
            videoTitle: bestVideo.title,
            score: bestScore,
          });
        }
      }
    }
  }

  console.log(
    `Matched ${robotMatches.size} robots to scraped videos.\n`
  );

  // Also include robots that already have a youtube_url but no youtube_video_id
  for (const robot of robots) {
    if (robot.youtube_url && !robotMatches.has(robot.id)) {
      const urlMatch = robot.youtube_url.match(
        /(?:watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
      );
      if (urlMatch) {
        const robotMfr =
          robot.manufacturer &&
          !Array.isArray(robot.manufacturer) &&
          typeof robot.manufacturer === "object"
            ? (robot.manufacturer as { name: string }).name
            : "Unknown";

        robotMatches.set(robot.id, {
          robotId: robot.id,
          robotName: robot.name,
          robotSlug: robot.slug,
          manufacturer: robotMfr,
          videoId: urlMatch[1],
          videoTitle: "",
          score: 0,
        });
      }
    }
  }

  console.log(
    `Total candidates (scraped + existing URLs): ${robotMatches.size}\n`
  );

  // -----------------------------------------------------------------------
  // STEP 3 + 4 + 5: Verify, check thumbnails, update DB
  // -----------------------------------------------------------------------

  console.log("Verifying and updating videos...\n");

  const allMatches = Array.from(robotMatches.values());

  for (let i = 0; i < allMatches.length; i++) {
    const rm = allMatches[i];
    totalProcessed++;

    // Print progress every 10 robots
    if (totalProcessed % 10 === 0) {
      console.log(`  Progress: ${totalProcessed}/${allMatches.length} processed`);
    }

    // STEP 3: Verify via oEmbed
    const verification = await verifyVideo(rm.videoId);
    await sleep(500); // Rate limit between oEmbed requests

    if (!verification.valid) {
      console.log(
        `  SKIP ${rm.robotName}: video ${rm.videoId} not accessible`
      );
      logEntries.push({
        robot_id: rm.robotId,
        robot_name: rm.robotName,
        robot_slug: rm.robotSlug,
        manufacturer: rm.manufacturer,
        video_id: rm.videoId,
        video_title: rm.videoTitle || null,
        score: rm.score,
        verified: false,
        thumbnail_url: null,
        updated: false,
        status: "invalid_or_private",
      });
      totalSkipped++;
      continue;
    }

    const verifiedTitle = verification.title || rm.videoTitle;
    totalVerified++;

    // STEP 4: Check thumbnail
    const thumbnailUrl = await checkThumbnail(rm.videoId);

    // STEP 5: Update DB
    const updateData: Record<string, unknown> = {
      youtube_video_id: rm.videoId,
      youtube_title: verifiedTitle,
      youtube_verified: true,
      youtube_thumbnail_url: thumbnailUrl,
      youtube_channel: rm.manufacturer,
      media_updated_at: new Date().toISOString(),
    };

    // Find the original robot record to check if it has an image
    const originalRobot = robots.find((r) => r.id === rm.robotId);
    if (originalRobot && !originalRobot.image && thumbnailUrl) {
      updateData.image = thumbnailUrl;
    }

    const { error: updateError } = await supabase
      .from("robots")
      .update(updateData)
      .eq("id", rm.robotId);

    if (updateError) {
      console.log(
        `  ERROR updating ${rm.robotName}: ${updateError.message}`
      );
      logEntries.push({
        robot_id: rm.robotId,
        robot_name: rm.robotName,
        robot_slug: rm.robotSlug,
        manufacturer: rm.manufacturer,
        video_id: rm.videoId,
        video_title: verifiedTitle,
        score: rm.score,
        verified: true,
        thumbnail_url: thumbnailUrl,
        updated: false,
        status: "db_error",
        error: updateError.message,
      });
      continue;
    }

    totalUpdated++;
    console.log(
      `  OK ${rm.robotName} -> ${rm.videoId} "${verifiedTitle}"`
    );

    logEntries.push({
      robot_id: rm.robotId,
      robot_name: rm.robotName,
      robot_slug: rm.robotSlug,
      manufacturer: rm.manufacturer,
      video_id: rm.videoId,
      video_title: verifiedTitle,
      score: rm.score,
      verified: true,
      thumbnail_url: thumbnailUrl,
      updated: true,
      status: "updated",
    });
  }

  // -----------------------------------------------------------------------
  // Write log file
  // -----------------------------------------------------------------------

  const logPath = path.resolve(process.cwd(), "scripts/youtube-channel-log.json");
  fs.writeFileSync(logPath, JSON.stringify(logEntries, null, 2), "utf-8");
  console.log(`\nLog written to ${logPath}`);

  // -----------------------------------------------------------------------
  // Final summary
  // -----------------------------------------------------------------------

  console.log("\n=== Summary ===");
  console.log(`  Total candidates:  ${allMatches.length}`);
  console.log(`  Processed:         ${totalProcessed}`);
  console.log(`  Verified:          ${totalVerified}`);
  console.log(`  Updated in DB:     ${totalUpdated}`);
  console.log(`  Skipped/invalid:   ${totalSkipped}`);
  console.log("=== Done ===\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
