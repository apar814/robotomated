import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { count: videoCount } = await sb
    .from("robots")
    .select("*", { count: "exact", head: true })
    .not("youtube_url", "is", null);
  console.log("Robots with video:", videoCount);

  const { count: totalCount } = await sb
    .from("robots")
    .select("*", { count: "exact", head: true });
  console.log("Total robots:", totalCount);

  // Find actual slugs for skipped entries
  const skipped = [
    "spot", "atlas-electric", "crx-10ia", "yumi", "digit",
    "h1", "g1", "da-vinci", "starship-delivery-robot",
    "zipline-platform-2", "s8-maxv-ultra", "agras-t50",
    "lbr-iiwa", "m1013", "ur3e", "atlas"
  ];

  for (const s of skipped) {
    const kw = s.split("-")[0];
    const { data } = await sb
      .from("robots")
      .select("slug, name")
      .ilike("slug", `%${kw}%`)
      .limit(5);
    if (data && data.length > 0) {
      console.log(`${s} -> ${data.map((r) => `${r.slug} (${r.name})`).join(", ")}`);
    } else {
      console.log(`${s} -> NO MATCH`);
    }
  }
}

main().catch(console.error);
