/**
 * Fix remaining manufacturer logos using Google's favicon service.
 * Run: npx tsx scripts/fix-remaining-logos.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const remaining: Record<string, string> = {
  "intuitive-surgical": "https://www.google.com/s2/favicons?domain=intuitive.com&sz=128",
  "john-deere": "https://www.google.com/s2/favicons?domain=deere.com&sz=128",
  "roborock": "https://www.google.com/s2/favicons?domain=roborock.com&sz=128",
  "rapid-robotics": "https://www.google.com/s2/favicons?domain=rapidrobotics.com&sz=128",
};

async function main() {
  for (const [slug, url] of Object.entries(remaining)) {
    const { data: mfr } = await supabase.from("manufacturers").select("id, logo_url").eq("slug", slug).single();
    if (!mfr) { console.log(`SKIP ${slug}: not in DB`); continue; }
    if (mfr.logo_url) { console.log(`SKIP ${slug}: already has logo`); continue; }

    const { error } = await supabase.from("manufacturers").update({ logo_url: url }).eq("id", mfr.id);
    console.log(error ? `ERR  ${slug}: ${error.message}` : `OK   ${slug}`);
  }
}

main().catch(console.error);
