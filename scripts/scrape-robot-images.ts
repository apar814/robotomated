/**
 * Pipeline 4: Scrape real product images for robots with missing images.
 * Uses Firecrawl to search + scrape manufacturer pages.
 * Uploads to Supabase Storage for permanent URLs.
 * Run: npx tsx scripts/scrape-robot-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
import * as https from "https";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function isImageUrl(url: string): boolean {
  return /\.(png|jpg|jpeg|webp)(\?|$)/i.test(url);
}

async function downloadImage(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const contentType = res.headers["content-type"] || "";
      if (!contentType.startsWith("image/")) { res.resume(); resolve(null); return; }
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
  console.log("=== Pipeline 4: Scrape Robot Images ===\n");

  // Ensure storage bucket exists
  await supabase.storage.createBucket("robot-images", { public: true }).catch(() => {});

  // Get robots missing images
  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, images, manufacturers(name)")
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false });

  const needImages = (robots || []).filter(r => {
    const imgs = (r.images || []) as { url: string }[];
    return imgs.length === 0 || imgs.every(i => !i.url || i.url.includes("unsplash"));
  });

  console.log(`Found ${needImages.length} robots needing images\n`);

  const limit = Math.min(needImages.length, 10); // Rate limit
  let updated = 0;

  for (let i = 0; i < limit; i++) {
    const robot = needImages[i];
    const mfr = (robot.manufacturers as { name: string } | null)?.name || "";

    console.log(`[${i + 1}/${limit}] ${robot.name} (${mfr})...`);

    try {
      // Search for official product images
      const searchResult = await firecrawl.search(
        `${robot.name} ${mfr} official product image`,
        { limit: 5 }
      );

      const webResults = searchResult.web || [];
      if (!webResults.length) {
        console.log(`  SKIP: no search results`);
        await delay(3000);
        continue;
      }

      // Try to find an image from the search results
      let foundImageUrl: string | null = null;

      for (const result of webResults) {
        if (!result.url) continue;

        try {
          const scrapeResult = await firecrawl.scrape(result.url, {
            formats: ["links"],
          });

          const links = scrapeResult.links || [];
          const imageLinks = links.filter((l: string) =>
            isImageUrl(l) &&
            !l.includes("logo") &&
            !l.includes("icon") &&
            !l.includes("favicon")
          );

          // Prefer manufacturer domain images
          const mfrDomain = result.url.split("/")[2];
          const mfrImages = imageLinks.filter((l: string) => l.includes(mfrDomain));
          foundImageUrl = mfrImages[0] || imageLinks[0] || null;

          if (foundImageUrl) break;
        } catch {
          continue;
        }

        await delay(1000);
      }

      if (!foundImageUrl) {
        console.log(`  SKIP: no image found`);
        await delay(3000);
        continue;
      }

      // Download and upload to Supabase Storage
      const imageBuffer = await downloadImage(foundImageUrl);
      if (!imageBuffer || imageBuffer.length < 5000) {
        // Too small, probably an icon
        console.log(`  SKIP: image too small or failed to download`);
        await delay(3000);
        continue;
      }

      const ext = foundImageUrl.match(/\.(png|jpg|jpeg|webp)/i)?.[1] || "jpg";
      const storagePath = `robots/${robot.slug}/product.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("robot-images")
        .upload(storagePath, imageBuffer, {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          upsert: true,
        });

      if (uploadError) {
        console.log(`  ERR upload: ${uploadError.message}`);
        await delay(3000);
        continue;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("robot-images")
        .getPublicUrl(storagePath);

      // Update robot images
      await supabase.from("robots").update({
        images: [{ url: publicUrl.publicUrl, alt: robot.name }],
      }).eq("id", robot.id);

      console.log(`  OK: uploaded to Supabase Storage`);
      updated++;
    } catch (err) {
      console.log(`  ERR: ${err instanceof Error ? err.message : String(err)}`);
    }

    await delay(3000);
  }

  console.log(`\nDone: ${updated} robots got new images`);
}

main().catch(console.error);
