/**
 * Final batch update for verified working image & logo URLs.
 * Run: npx tsx scripts/final-image-update.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// All verified-working robot image URLs (confirmed via curl 200)
const verifiedRobotImages: Record<string, { url: string; alt: string }> = {
  "knightscope-k5": { url: "https://knightscope.com/hubfs/KS_FeatureImage.png", alt: "Knightscope K5 autonomous security robot" },
  "skydio-x10": { url: "https://cdn.sanity.io/images/mgxz50fq/production-v3-red/1aba86a818bf78bb4939b4de3b1d4f8d10784455-1200x650.png", alt: "Skydio X10 enterprise drone" },
  "ecovacs-t30-omni": { url: "https://www.ecovacs.com/media/catalog/product/t30_omni.webp", alt: "ECOVACS DEEBOT T30 OMNI robot vacuum" },
  "figure-02": { url: "https://images.ctfassets.net/qx5k8y1u9drj/56I3mHKEdLZdrsONwOm3sc/63b1569bb855cc334c2dda67ce40ba4a/generic-page-image.jpeg", alt: "Figure AI humanoid robot" },
};

// Verified-working manufacturer logo URLs
const verifiedLogos: Record<string, string> = {
  "mir": "https://mobile-industrial-robots.com/favicon.ico",
  "tesla": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/200px-Tesla_Motors.svg.png",
  "zebra-fetch": "https://fetchrobotics.com/apple-touch-icon.png",
};

async function main() {
  console.log("=== Final Image & Logo Update (verified URLs only) ===\n");

  // Update robot images
  let robotUpdated = 0;
  for (const [slug, img] of Object.entries(verifiedRobotImages)) {
    // Try slug and slug-v2
    for (const s of [slug, slug + "-v2"]) {
      const { data: robot } = await supabase.from("robots").select("id, name, images").eq("slug", s).single();
      if (!robot) continue;

      const current = (robot.images || []) as { url: string }[];
      if (current.length > 0 && !current[0].url.includes("unsplash.com")) {
        console.log(`  SKIP ${s}: already has real image`);
        break;
      }

      const { error } = await supabase.from("robots").update({
        images: [{ url: img.url, alt: img.alt }]
      }).eq("id", robot.id);

      if (error) {
        console.log(`  ERR  ${s}: ${error.message}`);
      } else {
        console.log(`  OK   ${s}: updated`);
        robotUpdated++;
      }
      break;
    }
  }

  // Update logos
  let logoUpdated = 0;
  for (const [slug, logoUrl] of Object.entries(verifiedLogos)) {
    const { data: mfr } = await supabase.from("manufacturers").select("id, name, logo_url").eq("slug", slug).single();
    if (!mfr) { console.log(`  SKIP ${slug}: not in DB`); continue; }
    if (mfr.logo_url) { console.log(`  SKIP ${slug}: already has logo`); continue; }

    const { error } = await supabase.from("manufacturers").update({ logo_url: logoUrl }).eq("id", mfr.id);
    if (error) {
      console.log(`  ERR  ${slug}: ${error.message}`);
    } else {
      console.log(`  OK   ${slug} logo: updated`);
      logoUpdated++;
    }
  }

  // Print summary of what still needs manual work
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Updated: ${robotUpdated} robot images, ${logoUpdated} logos`);

  // Check what's still missing
  const { data: robotsMissing } = await supabase
    .from("robots")
    .select("slug, name, images")
    .order("name");

  const needImages = (robotsMissing || []).filter(r => {
    const imgs = (r.images || []) as { url: string }[];
    return imgs.length === 0 || imgs[0].url.includes("unsplash.com");
  });

  if (needImages.length > 0) {
    console.log(`\n${needImages.length} robots still need real images:`);
    needImages.forEach(r => console.log(`  - ${r.slug} (${r.name})`));
  }

  const { data: mfrsMissing } = await supabase
    .from("manufacturers")
    .select("slug, name, logo_url")
    .is("logo_url", null)
    .order("name");

  if (mfrsMissing && mfrsMissing.length > 0) {
    console.log(`\n${mfrsMissing.length} manufacturers still need logos:`);
    mfrsMissing.forEach(m => console.log(`  - ${m.slug} (${m.name})`));
  }

  console.log();
}

main().catch(console.error);
