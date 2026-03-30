/**
 * Fix 6 placeholder images using verified product image URLs.
 * Run: npx tsx scripts/fix-six-images-direct.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as https from "https";
import * as http from "http";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function downloadImage(url: string, maxRedirects = 5): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/webp,image/avif,image/apng,image/*,*/*;q=0.8",
      },
      timeout: 20000,
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode || 0) && res.headers.location && maxRedirects > 0) {
        res.resume();
        let loc = res.headers.location;
        if (!loc.startsWith("http")) {
          const u = new URL(url);
          loc = loc.startsWith("/") ? `${u.protocol}//${u.host}${loc}` : `${u.protocol}//${u.host}/${loc}`;
        }
        downloadImage(loc, maxRedirects - 1).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => { const buf = Buffer.concat(chunks); resolve(buf.length > 2000 ? buf : null); });
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

const targets: { slug: string; name: string; urls: string[] }[] = [
  {
    slug: "ageagle-ebee-x",
    name: "AgEagle eBee X",
    urls: [
      "https://ageagle.com/wp-content/uploads/2022/08/eBee-X-canada.jpeg",
    ],
  },
  {
    slug: "verdant-spraybox",
    name: "Verdant Robotics Spraybox",
    urls: [
      "https://cdn.prod.website-files.com/6792b4ac8a0083e26da102a8/67a530b6eb018d0e04cf711d_hero-foreground.webp",
      "https://cdn.prod.website-files.com/6792b4ac8a0083e26da102a8/6792d15ded8fd44544ea1a2b_introduction.webp",
      "https://cdn.prod.website-files.com/6792b4ac8a0083e26da102a8/6793fed90177dbe34c294ee1_video.webp",
    ],
  },
  {
    slug: "cartken-model-c",
    name: "Cartken Model C",
    urls: [
      "https://cdn.prod.website-files.com/63d40db7c30a00d05b85d07f/6871740edc5f46f997bc9e88_Media%20mentions%20logos.png",
      // Cartken press page didn't have robot images — try the main product page
      "https://cdn.prod.website-files.com/63cee399b1ef775ba444e177/67f5382924f81eaeb80e216f_cartken-dark.svg",
    ],
  },
  {
    slug: "iron-ox-grover",
    name: "Iron Ox Grover",
    urls: [
      // ironox.com redirects — no direct images available
    ],
  },
  {
    slug: "naio-oz",
    name: "Naïo Oz",
    urls: [
      "https://www.naio-technologies.com/wp-content/uploads/2025/06/oz-temoignages-potager-fleuri_17_11zon.webp",
      "https://www.naio-technologies.com/wp-content/uploads/2025/06/oz-temoignage-maxime_16_11zon.webp",
    ],
  },
  {
    slug: "ghost-vision-60",
    name: "Ghost Robotics Vision 60",
    urls: [
      "https://cdn.prod.website-files.com/67b418349cd29a4f7829b4a5/67cab48b3e99bd5adaf51bf5_specification%20image.avif",
      "https://cdn.prod.website-files.com/67b418349cd29a4f7829b4a5/67d917d1281ea63102b65004_Images.avif",
    ],
  },
];

async function main() {
  console.log("═══ Fix 6 Placeholder Images (Verified URLs) ═══\n");

  let fixed = 0;

  for (const target of targets) {
    console.log(`[${targets.indexOf(target) + 1}/6] ${target.name}...`);

    if (target.urls.length === 0) {
      console.log("    [SKIP]  No URLs to try — skipping");
      continue;
    }

    let success = false;

    for (const url of target.urls) {
      process.stdout.write(`    Trying: ${url.slice(0, 75)}... `);
      const buf = await downloadImage(url);

      if (buf && buf.length > 3000) {
        // Determine extension
        const ext = url.includes(".png") ? "png" : url.includes(".avif") ? "avif" : url.includes(".webp") ? "webp" : "jpg";
        const contentType = ext === "png" ? "image/png" : ext === "avif" ? "image/avif" : ext === "webp" ? "image/webp" : "image/jpeg";
        const storagePath = `robots/${target.slug}/hero.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("robot-images")
          .upload(storagePath, buf, { contentType, upsert: true });

        if (uploadErr) {
          console.log(`Upload error: ${uploadErr.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage.from("robot-images").getPublicUrl(storagePath);

        const { error: updateErr } = await supabase
          .from("robots")
          .update({ images: [{ url: publicUrl, alt: target.name }] })
          .eq("slug", target.slug);

        if (updateErr) {
          console.log(`DB error: ${updateErr.message}`);
          continue;
        }

        console.log(`[OK] (${Math.round(buf.length / 1024)}KB)`);
        success = true;
        fixed++;
        break;
      } else {
        console.log(buf ? `too small (${buf.length}B)` : "download failed");
      }
    }

    if (!success) {
      console.log("    [ERR] Could not fix this image");
    }
  }

  console.log(`\n═══ Results: ${fixed}/6 images fixed ═══`);
}

main().catch(console.error);
