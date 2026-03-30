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
  // Boston Dynamics — corrected slugs
  "spot-warehouse": "https://www.youtube.com/watch?v=wlkCQXHEgjA",
  "spot-healthcare": "https://www.youtube.com/watch?v=wlkCQXHEgjA",
  "spot-delivery": "https://www.youtube.com/watch?v=wlkCQXHEgjA",
  "spot-construction-ai": "https://www.youtube.com/watch?v=wlkCQXHEgjA",
  "boston-dynamics-spot-arm": "https://www.youtube.com/watch?v=wlkCQXHEgjA",
  "boston-dynamics-atlas-electric": "https://www.youtube.com/watch?v=29ECwExc-_M",
  "boston-dynamics-atlas-electric-humanoid": "https://www.youtube.com/watch?v=29ECwExc-_M",
  "stretch": "https://www.youtube.com/watch?v=yYUuWWnfRsk",

  // Universal Robots
  "ur5e": "https://www.youtube.com/watch?v=J3dOJaUVfFI",
  "ur10e": "https://www.youtube.com/watch?v=J3dOJaUVfFI",
  "ur20": "https://www.youtube.com/watch?v=DoeS0ShIXBY",
  "ur30": "https://www.youtube.com/watch?v=b0j0bCgU5Sw",

  // FANUC — corrected slugs
  "fanuc-crx-10": "https://www.youtube.com/watch?v=T-R-KTtUPfg",
  "fanuc-crx-10ia": "https://www.youtube.com/watch?v=T-R-KTtUPfg",
  "fanuc-crx-25ia": "https://www.youtube.com/watch?v=T-R-KTtUPfg",

  // ABB — corrected slugs
  "abb-yumi": "https://www.youtube.com/watch?v=gRGMzuDTPDs",
  "abb-yumi-irb14050": "https://www.youtube.com/watch?v=gRGMzuDTPDs",

  // Agility Robotics — corrected slugs
  "agility-digit": "https://www.youtube.com/watch?v=_JsPPd9gSqo",
  "agility-digit-5": "https://www.youtube.com/watch?v=_JsPPd9gSqo",
  "agility-digit-field": "https://www.youtube.com/watch?v=_JsPPd9gSqo",

  // Figure
  "figure-02": "https://www.youtube.com/watch?v=0SRVJaOg9Co",

  // Unitree — corrected slugs
  "unitree-h1": "https://www.youtube.com/watch?v=qGlsGPQUuCc",
  "unitree-h1-humanoid": "https://www.youtube.com/watch?v=qGlsGPQUuCc",
  "unitree-g1-humanoid": "https://www.youtube.com/watch?v=mCKf_WGIUFE",
  "unitree-g1-basic": "https://www.youtube.com/watch?v=mCKf_WGIUFE",
  "unitree-g1-edu": "https://www.youtube.com/watch?v=mCKf_WGIUFE",

  // Locus Robotics
  "locus-origin": "https://www.youtube.com/watch?v=Fg8EW-8WjpA",

  // Intuitive Surgical — corrected slugs
  "da-vinci-5": "https://www.youtube.com/watch?v=JtpW8GgH-VA",
  "da-vinci-sp": "https://www.youtube.com/watch?v=JtpW8GgH-VA",
  "davinci-sp-v2": "https://www.youtube.com/watch?v=JtpW8GgH-VA",

  // Starship Technologies — corrected slugs
  "starship-delivery": "https://www.youtube.com/watch?v=Tl3WMzP7QSE",
  "starship-s2": "https://www.youtube.com/watch?v=Tl3WMzP7QSE",
  "starship-s3": "https://www.youtube.com/watch?v=Tl3WMzP7QSE",
  "starship-gen4": "https://www.youtube.com/watch?v=Tl3WMzP7QSE",

  // Nuro
  "nuro-r3": "https://www.youtube.com/watch?v=CVGaMo_wIYg",

  // Zipline — corrected slugs
  "zipline-p2": "https://www.youtube.com/watch?v=DOWDNBu9DkU",
  "zipline-p2-zip": "https://www.youtube.com/watch?v=DOWDNBu9DkU",

  // iRobot
  "roomba-j9-plus": "https://www.youtube.com/watch?v=M-tIW_pSNbI",

  // Roborock — corrected slugs
  "roborock-s8-maxv": "https://www.youtube.com/watch?v=TJL2sVFHcpk",
  "roborock-s8-maxv-ultra": "https://www.youtube.com/watch?v=TJL2sVFHcpk",
  "roborock-s8-maxv-ultra-v2": "https://www.youtube.com/watch?v=TJL2sVFHcpk",
  "roborock-s8-pro": "https://www.youtube.com/watch?v=TJL2sVFHcpk",

  // DJI — corrected slug
  "dji-agras-t50": "https://www.youtube.com/watch?v=hXvCPRbQAlQ",

  // KUKA — corrected slugs
  "kuka-lbr-iiwa": "https://www.youtube.com/watch?v=F6RHFYQG7CM",
  "kuka-lbr-iisy": "https://www.youtube.com/watch?v=F6RHFYQG7CM",
  "kuka-lbr-iisy-11": "https://www.youtube.com/watch?v=F6RHFYQG7CM",

  // Doosan — corrected slug
  "doosan-m1013": "https://www.youtube.com/watch?v=4oGC1cOjRj4",
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
