/**
 * Seed robot YouTube video URLs
 *
 * Usage:
 *   npx tsx scripts/seed-robot-videos.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// slug → YouTube URL
// All URLs are official manufacturer demos unless marked [unverified]
const VIDEO_MAP: Record<string, string> = {
  // Boston Dynamics
  "spot": "https://www.youtube.com/watch?v=wlkCQXHEgjA",
  "atlas-electric": "https://www.youtube.com/watch?v=29ECwExc-_M",
  "stretch": "https://www.youtube.com/watch?v=yYUuWWnfRsk",

  // Universal Robots
  "ur5e": "https://www.youtube.com/watch?v=J3dOJaUVfFI",
  "ur20": "https://www.youtube.com/watch?v=DoeS0ShIXBY",
  "ur30": "https://www.youtube.com/watch?v=b0j0bCgU5Sw",

  // FANUC
  "crx-10ia": "https://www.youtube.com/watch?v=T-R-KTtUPfg",

  // ABB
  "yumi": "https://www.youtube.com/watch?v=gRGMzuDTPDs",

  // Agility Robotics
  "digit": "https://www.youtube.com/watch?v=_JsPPd9gSqo",

  // Figure
  "figure-02": "https://www.youtube.com/watch?v=0SRVJaOg9Co",

  // Unitree
  "h1": "https://www.youtube.com/watch?v=qGlsGPQUuCc",
  "g1": "https://www.youtube.com/watch?v=mCKf_WGIUFE",

  // Locus Robotics
  "locus-origin": "https://www.youtube.com/watch?v=Fg8EW-8WjpA",

  // Intuitive Surgical
  "da-vinci": "https://www.youtube.com/watch?v=JtpW8GgH-VA",

  // Starship Technologies
  "starship-delivery-robot": "https://www.youtube.com/watch?v=Tl3WMzP7QSE",

  // Nuro
  "nuro-r3": "https://www.youtube.com/watch?v=CVGaMo_wIYg",

  // Zipline
  "zipline-platform-2": "https://www.youtube.com/watch?v=DOWDNBu9DkU",

  // iRobot
  "roomba-j9-plus": "https://www.youtube.com/watch?v=M-tIW_pSNbI",

  // Roborock
  "s8-maxv-ultra": "https://www.youtube.com/watch?v=TJL2sVFHcpk",

  // DJI
  "agras-t50": "https://www.youtube.com/watch?v=hXvCPRbQAlQ",

  // KUKA
  "lbr-iiwa": "https://www.youtube.com/watch?v=F6RHFYQG7CM",

  // Doosan
  "m1013": "https://www.youtube.com/watch?v=4oGC1cOjRj4",

  // [unverified] — best-guess slugs and URLs from manufacturer channels
  "ur10e": "https://www.youtube.com/watch?v=J3dOJaUVfFI", // [unverified] UR general demo
  "ur3e": "https://www.youtube.com/watch?v=J3dOJaUVfFI", // [unverified] UR general demo
  "atlas": "https://www.youtube.com/watch?v=29ECwExc-_M", // [unverified] Atlas general
};

async function main() {
  let updated = 0;
  let skipped = 0;

  for (const [slug, youtubeUrl] of Object.entries(VIDEO_MAP)) {
    const { data, error } = await sb
      .from("robots")
      .update({ youtube_url: youtubeUrl })
      .eq("slug", slug)
      .select("slug");

    if (error) {
      console.error(`Error updating ${slug}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`Updated: ${slug}`);
      updated++;
    } else {
      console.log(`Skipped (not found): ${slug}`);
      skipped++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch(console.error);
