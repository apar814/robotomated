/**
 * Enrich top manufacturer descriptions in Supabase
 *
 * Usage:
 *   npx tsx scripts/enrich-manufacturers-top20.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MANUFACTURER_DESCRIPTIONS: Record<string, string> = {
  "abb-robotics":
    "ABB Robotics is a Swiss-Swedish multinational that pioneered industrial robots in 1974. Known for the IRB series, YuMi collaborative robots, and FlexPicker delta robots, ABB has installed over 500,000 robots worldwide. The company serves automotive, electronics, and food and beverage industries with a comprehensive automation portfolio spanning robot arms, controllers, and software.",

  "kuka":
    "KUKA is a German industrial robot manufacturer founded in 1898, now owned by Midea Group. Renowned for the KR series industrial arms, LBR iiwa sensitive cobot, and KUKA Connect IoT platform, the company has deployed roughly 400,000 robots globally. KUKA maintains its strongest presence in automotive manufacturing and has expanded into logistics and healthcare automation.",

  "yaskawa":
    "Yaskawa Electric is a Japanese industrial automation leader founded in 1915. Its Motoman robot division has installed over 500,000 servo-equipped robots worldwide across GP, HC (human collaborative), and AR series product lines. The company holds particular strength in arc welding, spot welding, and material handling applications for automotive and general industry.",

  "autostore":
    "AutoStore is a Norwegian warehouse automation company that developed a cubic grid-based storage and retrieval system. With over 1,250 installations across 50-plus countries, the technology delivers goods-to-person fulfillment for brands including Puma, Gucci, and Siemens. Acquired by Thomas H. Lee Partners, AutoStore focuses on maximizing storage density in existing warehouse footprints.",

  "agility-robotics":
    "Agility Robotics is an Oregon-based company building Digit, a bipedal humanoid robot designed for logistics environments. Backed by over $150 million in funding, the company has partnered with Amazon for warehouse testing and opened RoboFab, a dedicated facility for mass-producing humanoid robots. Digit is designed to work in spaces built for people without infrastructure changes.",

  "figure-ai":
    "Figure AI is a California-based humanoid robotics startup founded in 2022. The company developed Figure 02, a general-purpose humanoid robot, and raised a $675 million Series B round with backing from Microsoft, OpenAI, and NVIDIA. Figure has launched a manufacturing pilot with BMW and is targeting warehouse, logistics, and manufacturing applications for commercial deployment.",

  "unitree-robotics":
    "Unitree Robotics is a Chinese robotics company producing quadruped and humanoid robots at accessible price points. Its product line includes the Go2 and B2 quadrupeds alongside the H1 and G1 humanoids. Positioned as an affordable alternative to Boston Dynamics, Unitree offers robots starting from approximately $1,600, making legged robotics accessible to researchers and developers.",

  "roborock":
    "Roborock is a Chinese consumer robotics company that emerged from the Xiaomi ecosystem. Its flagship S8 MaxV Ultra features laser navigation and AI-powered obstacle avoidance. With annual revenue approaching $1.5 billion, Roborock has expanded globally and competes directly with iRobot and Ecovacs in the premium robotic vacuum and mop segment.",

  "fetch-robotics":
    "Fetch Robotics is a California-based warehouse robot company acquired by Zebra Technologies in 2021. The company developed an autonomous mobile robot platform for e-commerce fulfillment, anchored by its Freight series of AMRs. Its cloud-based fleet management software enables warehouses to deploy and orchestrate multiple robots for picking, transport, and inventory tasks.",

  "vecna-robotics":
    "Vecna Robotics is a Massachusetts-based warehouse automation company specializing in autonomous pallet jacks and forklifts. Its Pivotal orchestration platform enables multi-vendor fleet management, allowing warehouses to coordinate robots from different manufacturers. Vecna serves major logistics customers including FedEx and DHL with material handling automation.",

  "doosan-robotics":
    "Doosan Robotics is a South Korean collaborative robot manufacturer offering M and H series cobots. The company emphasizes ease of use through direct teaching and intuitive programming interfaces. Doosan completed its IPO on KOSDAQ in 2023, raising approximately $318 million, and distributes through a global network of industrial automation partners.",

  "kawasaki-robotics":
    "Kawasaki Robotics is a division of Kawasaki Heavy Industries that has manufactured industrial robots since 1969. Its portfolio includes the duAro dual-arm collaborative robot, BX series, and RS series, with over 200,000 units installed worldwide. The company maintains strong positions in semiconductor manufacturing, automotive assembly, and aerospace applications.",
};

async function main() {
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const [slug, description] of Object.entries(MANUFACTURER_DESCRIPTIONS)) {
    const { data, error } = await sb
      .from("manufacturers")
      .update({ description })
      .eq("slug", slug)
      .select("slug");

    if (error) {
      console.error(`Error updating ${slug}:`, error.message);
      errors++;
    } else if (data && data.length > 0) {
      console.log(`Updated: ${slug}`);
      updated++;
    } else {
      console.log(`Skipped (not found): ${slug}`);
      skipped++;
    }
  }

  // Handle optional slug that may not exist
  const optionalSlugs = ["6-river-systems"];
  for (const slug of optionalSlugs) {
    const { data } = await sb
      .from("manufacturers")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) {
      console.log(`Optional slug not found, skipping: ${slug}`);
    }
  }

  console.log(
    `\nDone. Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`
  );
}

main().catch(console.error);
