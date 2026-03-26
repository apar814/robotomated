/**
 * Populate manufacturer descriptions for top manufacturers.
 * Uses Firecrawl to scrape their about page, then Claude to summarize.
 *
 * Run: npx tsx scripts/populate-manufacturer-descriptions.ts
 */

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Hardcoded descriptions for top manufacturers (saves API calls and ensures quality)
const descriptions: Record<string, string> = {
  "boston-dynamics": "Boston Dynamics is an American robotics company founded in 1992, known for creating some of the world's most dynamic and agile robots. Their portfolio includes Spot (quadruped inspection robot), Stretch (warehouse logistics), and Atlas (humanoid research platform). Acquired by Hyundai in 2021 for $1.1B, they pioneered legged locomotion and continue to push the boundaries of mobile robotics for commercial and industrial applications.",
  "universal-robots": "Universal Robots (UR) is a Danish manufacturer that pioneered the commercial collaborative robot (cobot) market. Founded in 2005 and acquired by Teradyne in 2015, UR has deployed over 75,000 cobots worldwide. Their e-Series lineup (UR3e through UR30) covers 3-30 kg payloads, with the UR+ ecosystem offering 500+ certified peripherals. UR cobots are the industry standard for accessible industrial automation.",
  "dji": "DJI (Da-Jiang Innovations) is the world's largest commercial drone manufacturer, headquartered in Shenzhen, China. Founded in 2006, DJI commands over 70% global market share in consumer and commercial drones. Their product lines span consumer (Mavic, Mini), professional (Inspire, Matrice), enterprise (M350 RTK, Dock 2), and agricultural (Agras) categories. Known for vertically integrating cameras, gimbals, flight controllers, and software.",
  "irobot": "iRobot is an American consumer robotics company founded in 1990 by MIT roboticists. Best known for the Roomba robot vacuum (45+ million sold), iRobot pioneered the home robotics market. Their current lineup includes Roomba vacuum robots, Braava mopping robots, and the combination Roomba Combo series. Acquired by Amazon in 2022 (later cancelled), iRobot continues to innovate in AI-powered home cleaning and navigation.",
  "intuitive-surgical": "Intuitive Surgical is the global leader in robotic-assisted minimally invasive surgery. Founded in 1995, their da Vinci surgical system has been used in over 12 million procedures worldwide. The company's installed base of 9,000+ systems across 69 countries makes it the dominant platform in surgical robotics. The da Vinci 5 (2024) introduced force feedback, and the Ion platform expanded into robotic bronchoscopy for lung cancer diagnosis.",
  "fanuc": "FANUC Corporation is a Japanese multinational and one of the world's largest industrial robot manufacturers. Founded in 1956, FANUC has installed over 900,000 robots globally. Their product range spans industrial robots (1-2,300 kg payload), collaborative robots (CRX series), CNC systems, and factory automation. Known for exceptional reliability (100,000+ hour MTBF) and their distinctive yellow robots found in automotive, electronics, and general manufacturing worldwide.",
  "stryker": "Stryker Corporation is a Fortune 500 medical technology company founded in 1941. In surgical robotics, their Mako SmartRobotics platform dominates robotic-assisted orthopedic surgery with 85%+ market share in robotic joint replacement. The Mako system uses CT-derived 3D bone models and haptic boundaries to guide surgeons during knee and hip procedures. Over 1 million Mako procedures have been performed globally.",
  "locus-robotics": "Locus Robotics is an American warehouse automation company founded in 2014, headquartered in Wilmington, Massachusetts. Their autonomous mobile robots (AMRs) work alongside human workers in fulfillment centers, directing pickers to items and transporting goods. With over 2 billion units picked across 300+ customer sites, Locus offers a Robot-as-a-Service (RaaS) model that eliminates upfront capital investment. Major customers include DHL, GEODIS, and Boots.",
  "unitree": "Unitree Robotics is a Chinese robotics company founded in 2016, known for making advanced quadruped and humanoid robots at dramatically lower price points than Western competitors. Their products include the Go2 (consumer quadruped), B2 (industrial quadruped), and H1/G1 (humanoid robots). Unitree has disrupted the legged robotics market by offering hardware that approaches Boston Dynamics quality at 3-5x lower cost.",
  "skydio": "Skydio is an American drone company founded in 2014, known for AI-powered autonomous flight. Their Skydio X10 features a custom NVIDIA Orin processor and 6-camera obstacle avoidance system that enables true autonomous operation. Focused on enterprise and government markets, Skydio is NDAA-compliant (US-made) and serves defense, energy, infrastructure, and public safety customers. Their Autonomy Engine represents the most advanced obstacle avoidance in commercial drones.",
};

async function main() {
  console.log("═══ Populating Manufacturer Descriptions ═══\n");

  let updated = 0;

  for (const [slug, desc] of Object.entries(descriptions)) {
    const { error } = await supabase
      .from("manufacturers")
      .update({ description: desc })
      .eq("slug", slug);

    if (error) {
      console.error(`  ❌ ${slug}: ${error.message}`);
    } else {
      updated++;
      console.log(`  ✅ ${slug}`);
    }
  }

  console.log(`\nUpdated ${updated}/${Object.keys(descriptions).length} manufacturers`);
}

main().catch(console.error);
