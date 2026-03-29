import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const mfrs = [
    { slug: "dobot", name: "Dobot", country: "CN", founded_year: 2015, website: "https://dobot.cc", verified: true },
    { slug: "fetch-robotics", name: "Fetch Robotics (Zebra)", country: "US", founded_year: 2014, website: "https://fetchrobotics.com", verified: true },
    { slug: "clearpath-robotics", name: "Clearpath Robotics", country: "CA", founded_year: 2009, website: "https://clearpathrobotics.com", verified: true },
    { slug: "anybotics", name: "ANYbotics", country: "CH", founded_year: 2016, website: "https://anybotics.com", verified: true },
    { slug: "terra-drone", name: "Terra Drone", country: "JP", founded_year: 2016, website: "https://terradrone.co", verified: true },
  ];
  for (const m of mfrs) {
    const { error } = await sb.from("manufacturers").insert(m);
    console.log(error ? `Skip ${m.slug}: ${error.message}` : `Added ${m.name}`);
  }

  // Now re-run the failed robots
  const CATS = {
    manufacturing: "a0000001-0000-0000-0000-000000000002",
    warehouse: "a0000001-0000-0000-0000-000000000001",
    construction: "f37b2526-fa17-4914-90a5-f96807a5fc0f",
    drone: "e6d21a34-1229-4c35-b354-f98b04ac6dbc",
  };

  function cs(b: Record<string, number>): number {
    return Math.round(
      (b.performance * 0.25 + b.reliability * 0.20 + b.ease_of_use * 0.15 +
       b.intelligence * 0.15 + b.value * 0.10 + b.ecosystem * 0.08 +
       b.safety * 0.05 + b.design * 0.02) * 10
    ) / 10;
  }

  const missingRobots = [
    { slug: "dobot-cr10", name: "Dobot CR10", mfr: "dobot", cat: "manufacturing", price: 28000, year: 2023, status: "active", desc: "Dobot's 10kg payload collaborative robot with 1300mm reach. Force-sensing for safe human collaboration. Built-in vision system. Easy programming via drag-and-teach and graphical interface.", specs: { payload_kg: 10, reach_mm: 1300, dof: 6, repeatability_mm: 0.03, weight_kg: 33, ip_rating: "IP54" }, breakdown: { performance: 78, reliability: 76, ease_of_use: 85, intelligence: 74, value: 85, ecosystem: 68, safety: 80, design: 76 } },
    { slug: "fetch-freight-150", name: "Fetch Freight 150", mfr: "fetch-robotics", cat: "warehouse", price: 35000, year: 2022, status: "active", desc: "Autonomous mobile robot for material transport in warehouses. 150kg payload capacity. LiDAR-based SLAM navigation. Fleet management via FetchCore cloud platform. Now part of Zebra Technologies.", specs: { payload_kg: 150, speed_ms: 2.0, battery_hrs: 9, nav: "LiDAR SLAM", fleet_mgmt: "FetchCore" }, breakdown: { performance: 80, reliability: 80, ease_of_use: 82, intelligence: 78, value: 78, ecosystem: 76, safety: 82, design: 74 } },
    { slug: "clearpath-husky-a300", name: "Clearpath Husky A300", mfr: "clearpath-robotics", cat: "construction", price: 30000, year: 2023, status: "active", desc: "Rugged outdoor research and field robot. 75kg payload. All-terrain differential drive. ROS 2 native. Used for autonomous inspection, mapping, and agricultural research.", specs: { payload_kg: 75, speed_ms: 1.0, battery_hrs: 3, nav: "ROS 2 + RTK GPS", terrain: "All-terrain", weight_kg: 50 }, breakdown: { performance: 80, reliability: 82, ease_of_use: 74, intelligence: 76, value: 74, ecosystem: 82, safety: 78, design: 72 } },
    { slug: "clearpath-jackal", name: "Clearpath Jackal", mfr: "clearpath-robotics", cat: "construction", price: 20000, year: 2023, status: "active", desc: "Compact outdoor research robot. 20kg payload. Weatherproof (IP62). Fast — up to 2 m/s. ROS 2 native. Popular for autonomous navigation research and multi-robot coordination.", specs: { payload_kg: 20, speed_ms: 2.0, battery_hrs: 4, nav: "ROS 2 + IMU + GPS", ip_rating: "IP62", weight_kg: 17 }, breakdown: { performance: 78, reliability: 80, ease_of_use: 78, intelligence: 76, value: 80, ecosystem: 82, safety: 76, design: 74 } },
    { slug: "anybotics-anymal-d", name: "ANYbotics ANYmal D", mfr: "anybotics", cat: "construction", price: 150000, year: 2023, status: "active", desc: "Autonomous quadruped inspection robot for industrial sites. IP67 rated. Navigates stairs, ladders, and confined spaces. Integrated thermal, optical, and acoustic sensors. Autonomous mission planning.", specs: { weight_kg: 50, payload_kg: 10, battery_hrs: 2, speed_ms: 1.0, cameras: "Thermal + optical + acoustic", ip_rating: "IP67", nav: "Visual + LiDAR SLAM" }, breakdown: { performance: 88, reliability: 84, ease_of_use: 78, intelligence: 86, value: 65, ecosystem: 72, safety: 88, design: 85 } },
    { slug: "terra-drone-terra-lidar", name: "Terra Drone Terra LiDAR", mfr: "terra-drone", cat: "drone", price: 45000, year: 2024, status: "active", desc: "Professional LiDAR survey drone for infrastructure inspection and topographic mapping. Integrates high-density LiDAR with RTK positioning. Used for power line inspection, construction progress, and disaster response.", specs: { flight_time_min: 25, lidar_points_sec: 240000, range_m: 250, accuracy_mm: 10, nav: "RTK + LiDAR SLAM", weight_kg: 8 }, breakdown: { performance: 86, reliability: 82, ease_of_use: 76, intelligence: 78, value: 72, ecosystem: 70, safety: 80, design: 74 } },
  ];

  for (const r of missingRobots) {
    const { data: existing } = await sb.from("robots").select("id").eq("slug", r.slug).single();
    if (existing) { console.log(`Skip ${r.name}: already exists`); continue; }

    const { data: mfr } = await sb.from("manufacturers").select("id").eq("slug", r.mfr).single();
    if (!mfr) { console.log(`Error ${r.name}: manufacturer ${r.mfr} not found`); continue; }

    const catId = CATS[r.cat as keyof typeof CATS];
    const score = cs(r.breakdown);

    const { error } = await sb.from("robots").insert({
      slug: r.slug, name: r.name, manufacturer_id: mfr.id, category_id: catId,
      year_released: r.year, price_current: r.price, description_short: r.desc.slice(0, 200),
      description_long: r.desc, specs: r.specs,
      images: [{ url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop", alt: r.name }],
      robo_score: score, score_breakdown: r.breakdown, status: r.status,
    });

    console.log(error ? `Error ${r.name}: ${error.message}` : `OK: ${r.name} (${score})`);
  }

  // Final count
  const { count } = await sb.from("robots").select("id", { count: "exact", head: true });
  console.log(`\nTotal robots in DB: ${count}`);
}
main().catch(console.error);
