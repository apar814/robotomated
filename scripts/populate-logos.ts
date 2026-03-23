/**
 * Populate remaining manufacturer logos.
 * Run: npx tsx scripts/populate-logos.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as https from "https";
import * as http from "http";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const missingLogos: Record<string, string> = {
  "abb-robotics": "https://new.abb.com/images/default-source/logos/abb-logo.svg",
  "intuitive-surgical": "https://www.intuitive.com/apple-touch-icon.png",
  "john-deere": "https://www.deere.com/apple-touch-icon.png",
  "mir": "https://www.mir-robots.com/apple-touch-icon.png",
  "nuro": "https://www.nuro.ai/apple-touch-icon.png",
  "rapid-robotics": "https://www.rapidrobotics.com/apple-touch-icon.png",
  "roborock": "https://www.roborock.com/apple-touch-icon.png",
  "sanctuary-ai": "https://sanctuary.ai/apple-touch-icon.png",
  "tesla": "https://www.tesla.com/apple-touch-icon.png",
  "zebra-fetch": "https://fetchrobotics.com/apple-touch-icon.png",
};

// Fallback: try favicon.ico from the domain
const domainMap: Record<string, string> = {
  "abb-robotics": "new.abb.com",
  "intuitive-surgical": "www.intuitive.com",
  "john-deere": "www.deere.com",
  "mir": "www.mir-robots.com",
  "nuro": "www.nuro.ai",
  "rapid-robotics": "www.rapidrobotics.com",
  "roborock": "www.roborock.com",
  "sanctuary-ai": "sanctuary.ai",
  "tesla": "www.tesla.com",
  "zebra-fetch": "fetchrobotics.com",
};

function checkUrl(url: string, depth = 0): Promise<boolean> {
  if (depth > 5) return Promise.resolve(false);
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "image/webp,image/png,image/jpeg,image/svg+xml,*/*",
      "Range": "bytes=0-0",
    };
    const req = client.get(url, { headers, timeout: 10000 }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redir = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href;
        res.resume();
        checkUrl(redir, depth + 1).then(resolve);
        return;
      }
      res.resume();
      resolve(res.statusCode === 200 || res.statusCode === 206);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  console.log("=== Robotomated: Populate Missing Manufacturer Logos ===\n");

  let updated = 0;
  let failed = 0;
  const stillNeedLogos: string[] = [];

  for (const [slug, logoUrl] of Object.entries(missingLogos)) {
    // Find manufacturer
    const { data: mfr } = await supabase.from("manufacturers").select("id, name, logo_url").eq("slug", slug).single();
    if (!mfr) {
      console.log(`  SKIP ${slug}: not found in DB`);
      continue;
    }

    if (mfr.logo_url) {
      console.log(`  SKIP ${slug}: already has logo`);
      continue;
    }

    // Try primary URL
    const ok = await checkUrl(logoUrl);
    if (ok) {
      await supabase.from("manufacturers").update({ logo_url: logoUrl }).eq("id", mfr.id);
      console.log(`  OK   ${slug}: ${logoUrl}`);
      updated++;
      continue;
    }

    // Fallback: favicon.ico
    const domain = domainMap[slug];
    if (domain) {
      const faviconUrl = `https://${domain}/favicon.ico`;
      const favOk = await checkUrl(faviconUrl);
      if (favOk) {
        await supabase.from("manufacturers").update({ logo_url: faviconUrl }).eq("id", mfr.id);
        console.log(`  OK   ${slug}: ${faviconUrl} (favicon fallback)`);
        updated++;
        continue;
      }
    }

    console.log(`  FAIL ${slug}: no working logo URL`);
    stillNeedLogos.push(slug);
    failed++;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Summary: ${updated} updated, ${failed} failed`);
  if (stillNeedLogos.length > 0) {
    console.log(`\nStill need manual logos:`);
    stillNeedLogos.forEach(s => console.log(`  - ${s}`));
  }
  console.log();
}

main().catch(console.error);
