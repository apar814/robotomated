/**
 * Fix images for the top-scoring (trending) robots visible on the homepage.
 * Run: npx tsx scripts/fix-trending-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verified working product image URLs (all confirmed 200)
const fixes: Record<string, { url: string; alt: string }> = {
  "da-vinci-5": {
    url: "https://www.intuitive.com/-/media/intuitive/us/images/products/davinci-5/davinci-5-hero.webp",
    alt: "da Vinci 5 surgical robot system"
  },
  "roborock-s8-maxv": {
    url: "https://us.roborock.com/cdn/shop/files/S8_MaxV_Ultra.png",
    alt: "Roborock S8 MaxV Ultra robot vacuum"
  },
  "davinci-sp-v2": {
    url: "https://www.intuitive.com/-/media/intuitive/us/images/products/davinci-sp/davinci-sp-hero.webp",
    alt: "da Vinci SP surgical robot system"
  },
  "da-vinci-sp": {
    url: "https://www.intuitive.com/-/media/intuitive/us/images/products/sp/sp-hero.webp",
    alt: "da Vinci SP surgical robot system"
  },
  "roborock-s8-pro": {
    url: "https://us.roborock.com/cdn/shop/files/S8_Pro_Ultra.png",
    alt: "Roborock S8 Pro Ultra robot vacuum"
  },
};

async function main() {
  console.log("=== Fix Trending Robot Images ===\n");
  let updated = 0;

  for (const [slug, img] of Object.entries(fixes)) {
    const { data: robot } = await supabase.from("robots").select("id, name, images").eq("slug", slug).single();
    if (!robot) { console.log(`SKIP ${slug}: not found`); continue; }

    const current = (robot.images || []) as { url: string }[];
    if (current[0]?.url && !current[0].url.includes("unsplash")) {
      console.log(`SKIP ${slug}: already has real image`);
      continue;
    }

    const { error } = await supabase.from("robots").update({
      images: [{ url: img.url, alt: img.alt }]
    }).eq("id", robot.id);

    if (error) {
      console.log(`ERR  ${slug}: ${error.message}`);
    } else {
      console.log(`OK   ${slug} (${robot.name})`);
      updated++;
    }
  }

  console.log(`\nUpdated: ${updated} robots`);

  // Check remaining trending robots still with Unsplash
  const { data } = await supabase
    .from("robots")
    .select("slug, name, images, robo_score")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(8);

  const stillUnsplash = (data || []).filter(r => {
    const imgs = (r.images || []) as { url: string }[];
    return imgs[0]?.url?.includes("unsplash");
  });

  if (stillUnsplash.length > 0) {
    console.log(`\nStill have Unsplash in top 8:`);
    stillUnsplash.forEach(r => console.log(`  - ${r.slug} (${r.name})`));
  } else {
    console.log("\nAll top 8 trending robots now have real images!");
  }
}

main().catch(console.error);
