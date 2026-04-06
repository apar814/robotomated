import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const top20 = [
    "boston-dynamics", "universal-robots", "fanuc", "abb", "kuka",
    "yaskawa", "intuitive-surgical", "locus-robotics", "autostore", "agility-robotics",
    "figure-ai", "unitree", "dji", "irobot", "roborock",
    "fetch-robotics", "6-river-systems", "vecna", "doosan", "kawasaki"
  ];

  for (const slug of top20) {
    const { data } = await sb.from("manufacturers").select("slug, name, description, country, founded_year, website").ilike("slug", `%${slug}%`).limit(1);
    if (data && data.length > 0) {
      const m = data[0];
      const descLen = m.description ? m.description.length : 0;
      console.log(`${m.slug}: desc=${descLen}chars, country=${m.country || "MISSING"}, founded=${m.founded_year || "MISSING"}, website=${m.website ? "YES" : "MISSING"}`);
    } else {
      console.log(`${slug}: NOT FOUND`);
    }
  }
}
main().catch(console.error);
