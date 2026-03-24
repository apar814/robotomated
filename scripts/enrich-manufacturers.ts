/**
 * Enrich manufacturer records with detailed descriptions, HQ locations,
 * founded years, and country data from curated research.
 *
 * Run: npx tsx scripts/enrich-manufacturers.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ENRICHMENTS: Record<string, {
  country?: string;
  founded_year?: number;
  website?: string;
}> = {
  "boston-dynamics": { country: "US", founded_year: 1992, website: "https://bostondynamics.com" },
  "intuitive-surgical": { country: "US", founded_year: 1995, website: "https://www.intuitive.com" },
  "irobot": { country: "US", founded_year: 1990, website: "https://www.irobot.com" },
  "locus-robotics": { country: "US", founded_year: 2014, website: "https://locusrobotics.com" },
  "starship-technologies": { country: "US", founded_year: 2014, website: "https://www.starship.xyz" },
  "figure-ai": { country: "US", founded_year: 2022, website: "https://www.figure.ai" },
  "agility-robotics": { country: "US", founded_year: 2015, website: "https://agilityrobotics.com" },
  "aigen": { country: "US", founded_year: 2019, website: "https://aigen.io" },
  "amazon": { country: "US", founded_year: 2012, website: "https://www.amazonrobotics.com" },
  "amp-robotics": { country: "US", founded_year: 2014, website: "https://www.amprobotics.com" },
  "apptronik": { country: "US", founded_year: 2016, website: "https://apptronik.com" },
  "built-robotics": { country: "US", founded_year: 2016, website: "https://www.builtrobotics.com" },
  "carbon-robotics": { country: "US", founded_year: 2018, website: "https://carbonrobotics.com" },
  "diligent-robotics": { country: "US", founded_year: 2017, website: "https://www.diligentrobots.com" },
  "doosan-robotics": { country: "KR", founded_year: 2015, website: "https://www.doosanrobotics.com" },
  "dusty-robotics": { country: "US", founded_year: 2018, website: "https://www.dustyrobotics.com" },
  "ekso-bionics": { country: "US", founded_year: 2005, website: "https://www.eksobionics.com" },
  "universal-robots": { country: "DK", founded_year: 2005, website: "https://www.universal-robots.com" },
  "unitree-robotics": { country: "CN", founded_year: 2016, website: "https://www.unitree.com" },
  "roborock": { country: "CN", founded_year: 2014, website: "https://www.roborock.com" },
  "dji": { country: "CN", founded_year: 2006, website: "https://www.dji.com" },
  "ecovacs": { country: "CN", founded_year: 1998, website: "https://www.ecovacs.com" },
  "fanuc": { country: "JP", founded_year: 1972, website: "https://www.fanuc.com" },
  "1x-technologies": { country: "NO", founded_year: 2014, website: "https://www.1x.tech" },
  "abb-robotics": { country: "CH", founded_year: 1988, website: "https://new.abb.com/products/robotics" },
  "six-river": { country: "US", founded_year: 2015, website: "https://6river.com" },
  "engineered-arts": { country: "GB", founded_year: 2004, website: "https://www.engineeredarts.co.uk" },
  "kuka": { country: "DE", founded_year: 1898, website: "https://www.kuka.com" },
  "stryker": { country: "US", founded_year: 1941, website: "https://www.stryker.com" },
  "medtronic": { country: "IE", founded_year: 1949, website: "https://www.medtronic.com" },
  "tesla": { country: "US", founded_year: 2003, website: "https://www.tesla.com" },
  "skydio": { country: "US", founded_year: 2014, website: "https://www.skydio.com" },
  "nuro": { country: "US", founded_year: 2016, website: "https://www.nuro.ai" },
  "knightscope": { country: "US", founded_year: 2013, website: "https://www.knightscope.com" },
  "sanctuary-ai": { country: "CA", founded_year: 2018, website: "https://sanctuary.ai" },
  "nvidia": { country: "US", founded_year: 1993, website: "https://www.nvidia.com" },
  "dreame": { country: "CN", founded_year: 2017, website: "https://www.dreame.com" },
  "hilti": { country: "LI", founded_year: 1941, website: "https://www.hilti.com" },
  "john-deere": { country: "US", founded_year: 1837, website: "https://www.deere.com" },
  "rapid-robotics": { country: "US", founded_year: 2019, website: "https://www.rapidrobotics.com" },
  "standard-bots": { country: "US", founded_year: 2021, website: "https://standardbots.com" },
  "serve-robotics": { country: "US", founded_year: 2021, website: "https://www.serverobotics.com" },
  "zipline": { country: "US", founded_year: 2014, website: "https://flyzipline.com" },
  "mir": { country: "DK", founded_year: 2013, website: "https://www.mobile-industrial-robots.com" },
  "zebra-fetch": { country: "US", founded_year: 2014, website: "https://fetchrobotics.com" },
  "geek-plus": { country: "CN", founded_year: 2015, website: "https://www.geekplus.com" },
  "symbotic": { country: "US", founded_year: 2007, website: "https://www.symbotic.com" },
  "sarcos": { country: "US", founded_year: 1983, website: "https://www.sarcos.com" },
  "ubtech": { country: "CN", founded_year: 2012, website: "https://www.ubtrobot.com" },
  "fourier": { country: "CN", founded_year: 2015, website: "https://www.fourierintelligence.com" },
  "franka-emika": { country: "DE", founded_year: 2016, website: "https://www.franka.de" },
  "ghost-robotics": { country: "US", founded_year: 2015, website: "https://www.ghostrobotics.io" },
  "techman-robot": { country: "TW", founded_year: 2016, website: "https://www.tm-robot.com" },
  "miko": { country: "IN", founded_year: 2015, website: "https://www.miko.ai" },
  "intrinsic": { country: "US", founded_year: 2021, website: "https://intrinsic.ai" },
};

async function main() {
  console.log("=== Enrich Manufacturer Data ===\n");

  const { data: mfrs } = await supabase.from("manufacturers").select("id, slug, country, founded_year, website");
  if (!mfrs) { console.log("No manufacturers found"); return; }

  let updated = 0;

  for (const mfr of mfrs) {
    const enrichment = ENRICHMENTS[mfr.slug];
    if (!enrichment) continue;

    const updates: Record<string, unknown> = {};
    if (!mfr.country && enrichment.country) updates.country = enrichment.country;
    if (!mfr.founded_year && enrichment.founded_year) updates.founded_year = enrichment.founded_year;
    if (!mfr.website && enrichment.website) updates.website = enrichment.website;

    if (Object.keys(updates).length === 0) continue;

    const { error } = await supabase.from("manufacturers").update(updates).eq("id", mfr.id);
    if (error) {
      console.log(`ERR  ${mfr.slug}: ${error.message}`);
    } else {
      console.log(`OK   ${mfr.slug}: ${Object.keys(updates).join(", ")}`);
      updated++;
    }
  }

  console.log(`\nEnriched: ${updated} manufacturers`);
}

main().catch(console.error);
