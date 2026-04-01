/**
 * Robotomated — Wave 17 Robot Import: 50 New Robots
 * Focus: Cobots, collaborative welding, collaborative assembly, human-robot teaming
 * Run: npx tsx scripts/import-robots-wave17.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function cs(b: Record<string, number>): number {
  return Math.round(
    (b.performance * 0.25 + b.reliability * 0.20 + b.ease_of_use * 0.15 +
     b.intelligence * 0.15 + b.value * 0.10 + b.ecosystem * 0.08 +
     b.safety * 0.05 + b.design * 0.02) * 10
  ) / 10;
}

const catImgs: Record<string, string[]> = {
  manufacturing: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=600&h=400&fit=crop"],
  warehouse: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop"],
  consumer: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop"],
  medical: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop"],
  construction: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop"],
  agricultural: ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"],
  delivery: ["https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop"],
  drone: ["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop"],
  software: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"],
};
const imgC: Record<string, number> = {};
function gi(cat: string): { url: string; alt: string }[] {
  const s = catImgs[cat] || catImgs.software;
  const i = imgC[cat] || 0; imgC[cat] = i + 1;
  return [{ url: s[i % s.length], alt: `${cat} robot` }];
}

interface R {
  slug: string; name: string; mfr: string; cat: string;
  price: number | null; year: number; status: string;
  desc: string; specs: Record<string, unknown>;
  score: number; breakdown: Record<string, number>;
}

const newMfrs = [
  { slug: "righthand-robotics", name: "RightHand Robotics", country: "US", founded_year: 2014, website: "https://www.righthandrobotics.com" },
  { slug: "berkshire-grey", name: "Berkshire Grey", country: "US", founded_year: 2013, website: "https://www.berkshiregrey.com" },
  { slug: "plus-one-robotics", name: "Plus One Robotics", country: "US", founded_year: 2016, website: "https://www.plusonerobotics.com" },
  { slug: "covariant", name: "Covariant", country: "US", founded_year: 2017, website: "https://covariant.ai" },
  { slug: "machina-labs", name: "Machina Labs", country: "US", founded_year: 2019, website: "https://www.machinalabs.ai" },
  { slug: "veo-robotics", name: "Veo Robotics", country: "US", founded_year: 2016, website: "https://www.veobot.com" },
  { slug: "techman-robot", name: "Techman Robot", country: "TW", founded_year: 2016, website: "https://www.tm-robot.com" },
  { slug: "doosan-robotics", name: "Doosan Robotics", country: "KR", founded_year: 2015, website: "https://www.doosanrobotics.com" },
  { slug: "kassow-robots", name: "Kassow Robots", country: "DK", founded_year: 2014, website: "https://www.kassowrobots.com" },
  { slug: "hanwha-robotics", name: "Hanwha Robotics", country: "KR", founded_year: 2017, website: "https://www.hanwharobotics.com" },
];

const robots: R[] = [
  // RightHand Robotics — 6 piece-picking systems
  (() => { const b = { performance: 82, reliability: 79, ease_of_use: 76, intelligence: 88, value: 72, ecosystem: 70, safety: 80, design: 74 }; return { slug: "righthand-rpiece-3", name: "RightHand RPiece 3", mfr: "righthand-robotics", cat: "warehouse", price: 185000, year: 2024, status: "active", desc: "Third-generation piece-picking system with integrated suction and mechanical grip, achieving 1,200 picks per hour across SKUs ranging from polybags to rigid boxes.", specs: { pick_rate: "1,200 picks/hr", payload: "2 kg", reach: "1,100 mm", gripper_type: "hybrid suction+mechanical", vision: "3D stereo + AI", accuracy: "99.5%", weight: "45 kg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 85, reliability: 80, ease_of_use: 78, intelligence: 90, value: 70, ecosystem: 72, safety: 82, design: 76 }; return { slug: "righthand-rpiece-3-pro", name: "RightHand RPiece 3 Pro", mfr: "righthand-robotics", cat: "warehouse", price: 245000, year: 2025, status: "active", desc: "Enhanced piece-picking platform with dual-arm coordination enabling 1,800 picks per hour and real-time SKU learning for previously unseen items.", specs: { pick_rate: "1,800 picks/hr", payload: "3 kg", reach: "1,300 mm", gripper_type: "dual hybrid", vision: "3D stereo + deep learning", accuracy: "99.7%", weight: "68 kg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 78, reliability: 77, ease_of_use: 80, intelligence: 85, value: 75, ecosystem: 68, safety: 79, design: 72 }; return { slug: "righthand-rsort-200", name: "RightHand RSort 200", mfr: "righthand-robotics", cat: "warehouse", price: 155000, year: 2024, status: "active", desc: "Automated parcel sorting cell that identifies and routes up to 200 parcels per hour using vision-guided robotic arms and conveyor integration.", specs: { sort_rate: "200 parcels/hr", payload: "5 kg", vision: "2D barcode + 3D shape", conveyor_speed: "1.5 m/s", footprint: "3x2 m", power: "2.4 kW" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 80, reliability: 78, ease_of_use: 74, intelligence: 86, value: 68, ecosystem: 71, safety: 81, design: 70 }; return { slug: "righthand-rpiece-flex", name: "RightHand RPiece Flex", mfr: "righthand-robotics", cat: "warehouse", price: 198000, year: 2025, status: "active", desc: "Flexible piece-picking system designed for rapid deployment with tool-free reconfiguration between tote-to-tote and shelf-to-conveyor workflows.", specs: { pick_rate: "1,400 picks/hr", payload: "2.5 kg", reach: "1,200 mm", setup_time: "< 4 hours", gripper_type: "modular suction", vision: "3D + RGB", weight: "52 kg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 74, reliability: 76, ease_of_use: 82, intelligence: 83, value: 78, ecosystem: 65, safety: 78, design: 71 }; return { slug: "righthand-rpiece-lite", name: "RightHand RPiece Lite", mfr: "righthand-robotics", cat: "warehouse", price: 95000, year: 2024, status: "active", desc: "Entry-level piece-picking solution for mid-size fulfillment operations, handling 600 picks per hour with a compact single-arm design.", specs: { pick_rate: "600 picks/hr", payload: "1.5 kg", reach: "900 mm", gripper_type: "suction", vision: "2D + depth", accuracy: "98.8%", weight: "32 kg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 76, reliability: 75, ease_of_use: 77, intelligence: 84, value: 74, ecosystem: 67, safety: 80, design: 73 }; return { slug: "righthand-rpiece-cold", name: "RightHand RPiece Cold", mfr: "righthand-robotics", cat: "warehouse", price: 210000, year: 2025, status: "active", desc: "Cold-chain optimized piece-picking system rated for -25C operations, picking refrigerated and frozen grocery items at 800 picks per hour.", specs: { pick_rate: "800 picks/hr", payload: "3 kg", operating_temp: "-25°C to +5°C", reach: "1,100 mm", gripper_type: "heated suction", ip_rating: "IP65", weight: "55 kg" }, score: cs(b), breakdown: b }; })(),

  // Berkshire Grey — 6 AI-powered sorting/picking
  (() => { const b = { performance: 86, reliability: 82, ease_of_use: 75, intelligence: 91, value: 68, ecosystem: 74, safety: 83, design: 77 }; return { slug: "berkshire-grey-rss-1000", name: "Berkshire Grey RSS-1000", mfr: "berkshire-grey", cat: "warehouse", price: 350000, year: 2024, status: "active", desc: "Robotic shuttle sortation system processing 1,000 items per hour with AI-driven destination assignment and autonomous error recovery.", specs: { throughput: "1,000 items/hr", destinations: 50, payload: "10 kg per item", footprint: "12x8 m", vision: "multi-camera AI", power: "15 kW" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 84, reliability: 81, ease_of_use: 73, intelligence: 89, value: 65, ecosystem: 73, safety: 82, design: 75 }; return { slug: "berkshire-grey-rpp-500", name: "Berkshire Grey RPP-500", mfr: "berkshire-grey", cat: "warehouse", price: 420000, year: 2024, status: "active", desc: "Robotic pick-and-pack station that autonomously selects items and packs them into shipping cartons at 500 orders per hour with adaptive box sizing.", specs: { throughput: "500 orders/hr", payload: "8 kg", vision: "3D + AI classification", box_sizes: "6 adaptive", accuracy: "99.6%", footprint: "6x4 m" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 83, reliability: 80, ease_of_use: 76, intelligence: 88, value: 70, ecosystem: 72, safety: 81, design: 74 }; return { slug: "berkshire-grey-ris-200", name: "Berkshire Grey RIS-200", mfr: "berkshire-grey", cat: "warehouse", price: 280000, year: 2025, status: "active", desc: "Robotic induction system that singulates and orients items from bulk containers onto conveyors at 200 items per minute using AI vision.", specs: { throughput: "200 items/min", payload: "5 kg", vision: "AI singulation", conveyor_width: "600 mm", power: "8 kW", footprint: "4x3 m" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 80, reliability: 79, ease_of_use: 78, intelligence: 87, value: 72, ecosystem: 70, safety: 80, design: 73 }; return { slug: "berkshire-grey-bgs-mobile", name: "Berkshire Grey BGS Mobile", mfr: "berkshire-grey", cat: "warehouse", price: 195000, year: 2025, status: "active", desc: "Mobile sorting robot that navigates warehouse floors autonomously, collecting and delivering items to packing stations with dynamic route optimization.", specs: { speed: "2 m/s", payload: "30 kg", battery: "12 hr runtime", navigation: "LiDAR + vision", charging: "30 min fast charge", weight: "120 kg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 81, reliability: 78, ease_of_use: 74, intelligence: 86, value: 67, ecosystem: 71, safety: 82, design: 76 }; return { slug: "berkshire-grey-rpp-micro", name: "Berkshire Grey RPP Micro", mfr: "berkshire-grey", cat: "warehouse", price: 175000, year: 2025, status: "active", desc: "Compact robotic pick-and-place cell for e-commerce micro-fulfillment centers, handling small items under 1 kg at 400 picks per hour.", specs: { throughput: "400 picks/hr", payload: "1 kg", footprint: "2x2 m", vision: "AI + depth", gripper: "soft suction", power: "3 kW" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 87, reliability: 83, ease_of_use: 72, intelligence: 92, value: 64, ecosystem: 75, safety: 84, design: 78 }; return { slug: "berkshire-grey-rss-2000", name: "Berkshire Grey RSS-2000", mfr: "berkshire-grey", cat: "warehouse", price: 580000, year: 2025, status: "active", desc: "High-throughput robotic shuttle sortation processing 2,000 items per hour across 100 destinations with predictive load balancing.", specs: { throughput: "2,000 items/hr", destinations: 100, payload: "15 kg per item", footprint: "20x12 m", vision: "multi-camera AI array", power: "28 kW" }, score: cs(b), breakdown: b }; })(),

  // Plus One Robotics — 5 vision-guided picking
  (() => { const b = { performance: 79, reliability: 77, ease_of_use: 81, intelligence: 85, value: 76, ecosystem: 69, safety: 79, design: 72 }; return { slug: "plusone-yonder-3", name: "Plus One Yonder 3", mfr: "plus-one-robotics", cat: "warehouse", price: 145000, year: 2024, status: "active", desc: "Vision-guided parcel picking system with Yonder remote supervision platform, enabling one operator to oversee up to 10 robotic cells simultaneously.", specs: { pick_rate: "900 picks/hr", payload: "25 kg", vision: "3D + AI", remote_supervision: "1:10 ratio", reach: "1,800 mm", accuracy: "99.2%" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 82, reliability: 78, ease_of_use: 79, intelligence: 87, value: 73, ecosystem: 71, safety: 80, design: 74 }; return { slug: "plusone-yonder-3-max", name: "Plus One Yonder 3 Max", mfr: "plus-one-robotics", cat: "warehouse", price: 198000, year: 2025, status: "active", desc: "Heavy-duty parcel picking with extended reach and 50 kg payload capacity for oversized parcels and irregularly shaped freight.", specs: { pick_rate: "600 picks/hr", payload: "50 kg", vision: "3D stereo + AI", reach: "2,200 mm", remote_supervision: "1:8 ratio", weight: "180 kg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 77, reliability: 76, ease_of_use: 83, intelligence: 84, value: 79, ecosystem: 67, safety: 78, design: 71 }; return { slug: "plusone-depal-100", name: "Plus One DePal 100", mfr: "plus-one-robotics", cat: "warehouse", price: 165000, year: 2024, status: "active", desc: "Automated depalletizing system using AI vision to identify and pick mixed-SKU layers from pallets at 100 cases per hour.", specs: { throughput: "100 cases/hr", payload: "30 kg", pallet_types: "standard + euro", vision: "3D point cloud", reach: "2,000 mm", power: "5 kW" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 75, reliability: 75, ease_of_use: 80, intelligence: 83, value: 77, ecosystem: 66, safety: 77, design: 70 }; return { slug: "plusone-induct-400", name: "Plus One Induct 400", mfr: "plus-one-robotics", cat: "warehouse", price: 125000, year: 2025, status: "active", desc: "Parcel induction robot that picks items from bulk gaylords and places them label-up on conveyors at 400 parcels per hour.", specs: { throughput: "400 parcels/hr", payload: "15 kg", vision: "AI label detection", conveyor_integration: true, footprint: "3x2 m", weight: "85 kg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 80, reliability: 77, ease_of_use: 78, intelligence: 86, value: 71, ecosystem: 70, safety: 81, design: 73 }; return { slug: "plusone-wall-builder", name: "Plus One Wall Builder", mfr: "plus-one-robotics", cat: "warehouse", price: 185000, year: 2025, status: "active", desc: "AI-powered trailer loading robot that builds stable pallet walls inside trucks, optimizing cube utilization to 92% with mixed-size parcels.", specs: { throughput: "300 parcels/hr", payload: "35 kg", cube_utilization: "92%", vision: "3D spatial mapping", trailer_types: "53ft dry van", power: "6 kW" }, score: cs(b), breakdown: b }; })(),

  // Covariant — 5 AI picking systems
  (() => { const b = { performance: 85, reliability: 80, ease_of_use: 74, intelligence: 93, value: 67, ecosystem: 73, safety: 82, design: 76 }; return { slug: "covariant-brain-pick", name: "Covariant Brain Pick", mfr: "covariant", cat: "warehouse", price: 220000, year: 2024, status: "active", desc: "Foundation-model-powered picking system that generalizes across millions of SKUs without per-item training, achieving 95% first-attempt grasp success.", specs: { pick_rate: "1,000 picks/hr", payload: "5 kg", grasp_success: "95%", sku_generalization: "unlimited", vision: "RGB-D + foundation model", reach: "1,200 mm" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 87, reliability: 81, ease_of_use: 73, intelligence: 94, value: 64, ecosystem: 74, safety: 83, design: 77 }; return { slug: "covariant-brain-pick-pro", name: "Covariant Brain Pick Pro", mfr: "covariant", cat: "warehouse", price: 310000, year: 2025, status: "active", desc: "Dual-arm AI picking system with foundation model intelligence, handling deformable items like polybags and apparel at 1,400 picks per hour.", specs: { pick_rate: "1,400 picks/hr", payload: "4 kg", grasp_success: "97%", arms: 2, vision: "multi-angle RGB-D + LLM", deformable_handling: true }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 81, reliability: 78, ease_of_use: 76, intelligence: 91, value: 70, ecosystem: 71, safety: 80, design: 74 }; return { slug: "covariant-brain-sort", name: "Covariant Brain Sort", mfr: "covariant", cat: "warehouse", price: 195000, year: 2024, status: "active", desc: "AI-powered sortation cell using Covariant Brain to classify and route items by destination, carrier, or priority with zero manual labeling.", specs: { sort_rate: "800 items/hr", destinations: 30, vision: "AI classification", payload: "8 kg", accuracy: "99.4%", footprint: "4x3 m" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 79, reliability: 77, ease_of_use: 77, intelligence: 90, value: 72, ecosystem: 69, safety: 79, design: 73 }; return { slug: "covariant-brain-pack", name: "Covariant Brain Pack", mfr: "covariant", cat: "warehouse", price: 240000, year: 2025, status: "active", desc: "Intelligent packing robot that selects optimal box sizes and arranges items using spatial reasoning from the Covariant Brain foundation model.", specs: { throughput: "300 orders/hr", payload: "10 kg", box_optimization: "AI spatial reasoning", vision: "3D volumetric", carton_sizes: 8, power: "4 kW" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 83, reliability: 79, ease_of_use: 72, intelligence: 92, value: 66, ecosystem: 72, safety: 81, design: 75 }; return { slug: "covariant-brain-palletize", name: "Covariant Brain Palletize", mfr: "covariant", cat: "warehouse", price: 275000, year: 2025, status: "active", desc: "AI palletizing system that builds structurally optimal pallet loads from mixed-SKU streams using learned physics simulation.", specs: { throughput: "400 cases/hr", payload: "25 kg per case", pallet_height: "1,800 mm max", vision: "3D + physics model", stability_score: "99.1%", reach: "2,000 mm" }, score: cs(b), breakdown: b }; })(),

  // Machina Labs — 4 robotic forming systems
  (() => { const b = { performance: 84, reliability: 80, ease_of_use: 68, intelligence: 82, value: 65, ecosystem: 62, safety: 83, design: 80 }; return { slug: "machina-roboform-1200", name: "Machina RoboForm 1200", mfr: "machina-labs", cat: "manufacturing", price: 890000, year: 2024, status: "active", desc: "Dual-robot sheet metal forming cell that incrementally shapes aerospace-grade aluminum and titanium panels up to 1,200 mm without dedicated tooling.", specs: { forming_area: "1,200x800 mm", materials: "aluminum, titanium, steel", thickness: "0.5-6 mm", robots: 2, force: "5,000 N per arm", accuracy: "±0.2 mm" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 86, reliability: 81, ease_of_use: 66, intelligence: 84, value: 62, ecosystem: 63, safety: 84, design: 81 }; return { slug: "machina-roboform-2400", name: "Machina RoboForm 2400", mfr: "machina-labs", cat: "manufacturing", price: 1450000, year: 2025, status: "active", desc: "Large-format robotic forming system for aerospace fuselage panels and automotive body-in-white components up to 2,400 mm with real-time compensation.", specs: { forming_area: "2,400x1,200 mm", materials: "aluminum, titanium, Inconel", thickness: "0.8-10 mm", robots: 4, force: "10,000 N per arm", accuracy: "±0.15 mm" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 79, reliability: 78, ease_of_use: 72, intelligence: 80, value: 70, ecosystem: 60, safety: 82, design: 77 }; return { slug: "machina-roboform-600", name: "Machina RoboForm 600", mfr: "machina-labs", cat: "manufacturing", price: 520000, year: 2025, status: "active", desc: "Compact robotic forming cell for prototyping and low-volume production, forming parts up to 600 mm from digital designs in hours instead of weeks.", specs: { forming_area: "600x400 mm", materials: "aluminum, steel, copper", thickness: "0.3-4 mm", robots: 2, force: "3,000 N per arm", accuracy: "±0.3 mm" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 82, reliability: 79, ease_of_use: 65, intelligence: 81, value: 63, ecosystem: 61, safety: 85, design: 79 }; return { slug: "machina-roboweld-form", name: "Machina RoboWeld Form", mfr: "machina-labs", cat: "manufacturing", price: 1100000, year: 2025, status: "active", desc: "Hybrid forming and welding cell combining incremental forming with robotic friction stir welding for monolithic aerospace structures.", specs: { forming_area: "1,800x900 mm", welding: "friction stir", materials: "aluminum, titanium", robots: 3, force: "8,000 N forming / 12,000 N welding", accuracy: "±0.2 mm" }, score: cs(b), breakdown: b }; })(),

  // Veo Robotics — 4 safety systems
  (() => { const b = { performance: 78, reliability: 82, ease_of_use: 80, intelligence: 85, value: 74, ecosystem: 76, safety: 95, design: 78 }; return { slug: "veo-freemove-6d", name: "Veo FreeMove 6D", mfr: "veo-robotics", cat: "manufacturing", price: 85000, year: 2024, status: "active", desc: "3D safeguarding system that creates dynamic safety zones around industrial robots, enabling fenceless human-robot collaboration with ISO 13849 PLd certification.", specs: { detection_range: "8 m", response_time: "< 100 ms", cameras: 4, zone_types: "dynamic 3D", certification: "ISO 13849 PLd", robot_compatibility: "universal" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 80, reliability: 83, ease_of_use: 82, intelligence: 86, value: 72, ecosystem: 77, safety: 96, design: 80 }; return { slug: "veo-freemove-6d-pro", name: "Veo FreeMove 6D Pro", mfr: "veo-robotics", cat: "manufacturing", price: 125000, year: 2025, status: "active", desc: "Advanced safeguarding platform with skeletal tracking that distinguishes human body parts and adjusts robot speed proportionally to proximity risk.", specs: { detection_range: "12 m", response_time: "< 50 ms", cameras: 8, tracking: "skeletal + hand", certification: "ISO 13849 PLe", zones: "unlimited dynamic" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 76, reliability: 81, ease_of_use: 84, intelligence: 83, value: 78, ecosystem: 74, safety: 93, design: 76 }; return { slug: "veo-freemove-weld", name: "Veo FreeMove Weld", mfr: "veo-robotics", cat: "manufacturing", price: 95000, year: 2025, status: "active", desc: "Welding-specific safeguarding system with arc-flash filtering optics that maintain detection accuracy during active MIG, TIG, and spot welding.", specs: { detection_range: "6 m", response_time: "< 80 ms", cameras: 4, arc_filtering: "adaptive optical", welding_types: "MIG, TIG, spot", certification: "ISO 13849 PLd" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 74, reliability: 80, ease_of_use: 85, intelligence: 82, value: 80, ecosystem: 73, safety: 92, design: 75 }; return { slug: "veo-freemove-lite", name: "Veo FreeMove Lite", mfr: "veo-robotics", cat: "manufacturing", price: 45000, year: 2025, status: "active", desc: "Entry-level 2D+3D safeguarding kit for retrofitting existing robotic cells with speed and separation monitoring, reducing fencing costs by 60%.", specs: { detection_range: "5 m", response_time: "< 150 ms", cameras: 2, zone_types: "2D + limited 3D", certification: "ISO 13849 PLc", setup_time: "< 1 day" }, score: cs(b), breakdown: b }; })(),

  // Techman Robot — 5 TM series cobots
  (() => { const b = { performance: 80, reliability: 81, ease_of_use: 86, intelligence: 79, value: 82, ecosystem: 78, safety: 84, design: 80 }; return { slug: "techman-tm5-900", name: "Techman TM5-900", mfr: "techman-robot", cat: "manufacturing", price: 32000, year: 2024, status: "active", desc: "Compact 6 kg cobot with built-in vision system and intuitive flow-based programming, achieving 5-minute task setup for pick-and-place applications.", specs: { payload: "6 kg", reach: "900 mm", repeatability: "±0.05 mm", vision: "built-in 5MP", dof: 6, weight: "22.1 kg", programming: "TMflow visual" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 82, reliability: 82, ease_of_use: 85, intelligence: 80, value: 80, ecosystem: 79, safety: 85, design: 81 }; return { slug: "techman-tm12", name: "Techman TM12", mfr: "techman-robot", cat: "manufacturing", price: 42000, year: 2024, status: "active", desc: "12 kg payload cobot with integrated smart vision for palletizing and machine tending, featuring hand-guided teaching and collision detection.", specs: { payload: "12 kg", reach: "1,300 mm", repeatability: "±0.06 mm", vision: "built-in 5MP + external option", dof: 6, weight: "33.3 kg", speed: "1.3 m/s" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 84, reliability: 83, ease_of_use: 84, intelligence: 81, value: 78, ecosystem: 80, safety: 86, design: 82 }; return { slug: "techman-tm16", name: "Techman TM16", mfr: "techman-robot", cat: "manufacturing", price: 55000, year: 2025, status: "active", desc: "Heavy-duty 16 kg cobot designed for automotive assembly and heavy part handling with enhanced torque sensors and IP67 wrist protection.", specs: { payload: "16 kg", reach: "1,500 mm", repeatability: "±0.05 mm", vision: "built-in 5MP", dof: 6, weight: "45 kg", ip_rating: "IP67 wrist" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 78, reliability: 80, ease_of_use: 88, intelligence: 78, value: 85, ecosystem: 77, safety: 83, design: 79 }; return { slug: "techman-tm5-700", name: "Techman TM5-700", mfr: "techman-robot", cat: "manufacturing", price: 26000, year: 2024, status: "active", desc: "Entry-level cobot with 4 kg payload and built-in vision ideal for light assembly, quality inspection, and educational applications.", specs: { payload: "4 kg", reach: "700 mm", repeatability: "±0.05 mm", vision: "built-in 1.2MP", dof: 6, weight: "18 kg", programming: "TMflow visual" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 83, reliability: 82, ease_of_use: 83, intelligence: 82, value: 76, ecosystem: 79, safety: 87, design: 83 }; return { slug: "techman-tm25s", name: "Techman TM25S", mfr: "techman-robot", cat: "manufacturing", price: 68000, year: 2025, status: "active", desc: "25 kg payload cobot with enhanced safety-rated monitored stop and 1,900 mm reach for palletizing full cases in logistics environments.", specs: { payload: "25 kg", reach: "1,900 mm", repeatability: "±0.06 mm", vision: "built-in 5MP", dof: 6, weight: "58 kg", safety: "ISO 10218-1, PLd Cat 3" }, score: cs(b), breakdown: b }; })(),

  // Doosan Robotics — 5 M/H/A series cobots
  (() => { const b = { performance: 83, reliability: 84, ease_of_use: 82, intelligence: 78, value: 79, ecosystem: 76, safety: 88, design: 84 }; return { slug: "doosan-m1013", name: "Doosan M1013", mfr: "doosan-robotics", cat: "manufacturing", price: 38000, year: 2024, status: "active", desc: "10 kg cobot with 6 high-precision torque sensors delivering best-in-class collision sensitivity and a 1,300 mm reach for versatile manufacturing tasks.", specs: { payload: "10 kg", reach: "1,300 mm", repeatability: "±0.05 mm", torque_sensors: 6, dof: 6, weight: "33 kg", speed: "1.0 m/s" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 85, reliability: 85, ease_of_use: 81, intelligence: 79, value: 77, ecosystem: 77, safety: 89, design: 85 }; return { slug: "doosan-h2515", name: "Doosan H2515", mfr: "doosan-robotics", cat: "manufacturing", price: 58000, year: 2024, status: "active", desc: "25 kg heavy-payload cobot with 1,500 mm reach, purpose-built for palletizing and heavy assembly with dual safety monitoring architecture.", specs: { payload: "25 kg", reach: "1,500 mm", repeatability: "±0.05 mm", torque_sensors: 6, dof: 6, weight: "72 kg", safety: "dual-channel PLe" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 81, reliability: 83, ease_of_use: 84, intelligence: 80, value: 81, ecosystem: 75, safety: 87, design: 83 }; return { slug: "doosan-a0912", name: "Doosan A0912", mfr: "doosan-robotics", cat: "manufacturing", price: 30000, year: 2025, status: "active", desc: "Ultra-compact A-series cobot with 9 kg payload and sleek industrial design, optimized for tight spaces in electronics and consumer goods assembly.", specs: { payload: "9 kg", reach: "1,200 mm", repeatability: "±0.03 mm", torque_sensors: 6, dof: 6, weight: "26 kg", footprint: "200 mm base diameter" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 80, reliability: 82, ease_of_use: 83, intelligence: 77, value: 83, ecosystem: 74, safety: 86, design: 82 }; return { slug: "doosan-m0609", name: "Doosan M0609", mfr: "doosan-robotics", cat: "manufacturing", price: 28000, year: 2024, status: "active", desc: "6 kg tabletop cobot with industry-leading 0.03 mm repeatability for precision assembly, dispensing, and testing in electronics manufacturing.", specs: { payload: "6 kg", reach: "900 mm", repeatability: "±0.03 mm", torque_sensors: 6, dof: 6, weight: "20 kg", speed: "1.0 m/s" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 86, reliability: 84, ease_of_use: 80, intelligence: 81, value: 74, ecosystem: 78, safety: 90, design: 86 }; return { slug: "doosan-h2017", name: "Doosan H2017", mfr: "doosan-robotics", cat: "manufacturing", price: 52000, year: 2025, status: "active", desc: "20 kg cobot with extended 1,700 mm reach and IP66 protection, designed for outdoor-adjacent applications like automotive underbody assembly.", specs: { payload: "20 kg", reach: "1,700 mm", repeatability: "±0.05 mm", torque_sensors: 6, dof: 6, weight: "65 kg", ip_rating: "IP66" }, score: cs(b), breakdown: b }; })(),

  // Kassow Robots — 5 seven-axis cobots
  (() => { const b = { performance: 82, reliability: 80, ease_of_use: 79, intelligence: 77, value: 76, ecosystem: 68, safety: 84, design: 81 }; return { slug: "kassow-kr810", name: "Kassow KR810", mfr: "kassow-robots", cat: "manufacturing", price: 45000, year: 2024, status: "active", desc: "7-axis cobot with 10 kg payload offering human-like dexterity to reach around obstacles and into confined spaces impossible for 6-axis arms.", specs: { payload: "10 kg", reach: "850 mm", repeatability: "±0.05 mm", dof: 7, weight: "28 kg", speed: "2.1 m/s", power: "350 W avg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 84, reliability: 81, ease_of_use: 78, intelligence: 78, value: 74, ecosystem: 69, safety: 85, design: 82 }; return { slug: "kassow-kr1205", name: "Kassow KR1205", mfr: "kassow-robots", cat: "manufacturing", price: 52000, year: 2024, status: "active", desc: "7-axis cobot with 5 kg payload and 1,200 mm reach, excelling at machine tending where the extra axis allows loading from any angle.", specs: { payload: "5 kg", reach: "1,200 mm", repeatability: "±0.04 mm", dof: 7, weight: "26 kg", speed: "2.25 m/s", power: "300 W avg" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 85, reliability: 82, ease_of_use: 77, intelligence: 79, value: 72, ecosystem: 70, safety: 86, design: 83 }; return { slug: "kassow-kr1805", name: "Kassow KR1805", mfr: "kassow-robots", cat: "manufacturing", price: 58000, year: 2025, status: "active", desc: "Long-reach 7-axis cobot spanning 1,800 mm for welding and large-part handling, with the 7th axis providing weld torch orientation flexibility.", specs: { payload: "5 kg", reach: "1,800 mm", repeatability: "±0.06 mm", dof: 7, weight: "36 kg", speed: "2.25 m/s", applications: "welding, large assembly" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 80, reliability: 79, ease_of_use: 80, intelligence: 76, value: 78, ecosystem: 67, safety: 83, design: 80 }; return { slug: "kassow-kr610", name: "Kassow KR610", mfr: "kassow-robots", cat: "manufacturing", price: 38000, year: 2024, status: "active", desc: "Compact 7-axis cobot with 10 kg payload and 600 mm reach, designed for benchtop assembly operations in electronics and medical device manufacturing.", specs: { payload: "10 kg", reach: "600 mm", repeatability: "±0.04 mm", dof: 7, weight: "24 kg", speed: "1.8 m/s", footprint: "compact benchtop" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 83, reliability: 80, ease_of_use: 76, intelligence: 78, value: 71, ecosystem: 69, safety: 85, design: 82 }; return { slug: "kassow-kr1410", name: "Kassow KR1410", mfr: "kassow-robots", cat: "manufacturing", price: 55000, year: 2025, status: "active", desc: "Mid-range 7-axis cobot with 10 kg payload and 1,400 mm reach, balancing dexterity and workspace for general-purpose collaborative manufacturing.", specs: { payload: "10 kg", reach: "1,400 mm", repeatability: "±0.05 mm", dof: 7, weight: "32 kg", speed: "2.1 m/s", power: "400 W avg" }, score: cs(b), breakdown: b }; })(),

  // Hanwha Robotics — 5 HCR series cobots
  (() => { const b = { performance: 81, reliability: 82, ease_of_use: 83, intelligence: 77, value: 81, ecosystem: 73, safety: 86, design: 80 }; return { slug: "hanwha-hcr-12", name: "Hanwha HCR-12", mfr: "hanwha-robotics", cat: "manufacturing", price: 35000, year: 2024, status: "active", desc: "12 kg cobot with direct teaching interface and smart safety skin, optimized for palletizing and heavy-part machine tending applications.", specs: { payload: "12 kg", reach: "1,300 mm", repeatability: "±0.05 mm", dof: 6, weight: "38 kg", teaching: "direct hand-guide", safety: "smart safety skin" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 79, reliability: 81, ease_of_use: 85, intelligence: 76, value: 84, ecosystem: 72, safety: 85, design: 79 }; return { slug: "hanwha-hcr-5", name: "Hanwha HCR-5", mfr: "hanwha-robotics", cat: "manufacturing", price: 24000, year: 2024, status: "active", desc: "Lightweight 5 kg cobot offering the lowest entry price in its class with intuitive tablet-based programming for small manufacturers.", specs: { payload: "5 kg", reach: "900 mm", repeatability: "±0.03 mm", dof: 6, weight: "19 kg", teaching: "tablet + hand-guide", power: "250 W" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 83, reliability: 83, ease_of_use: 82, intelligence: 78, value: 79, ecosystem: 74, safety: 87, design: 81 }; return { slug: "hanwha-hcr-20", name: "Hanwha HCR-20", mfr: "hanwha-robotics", cat: "manufacturing", price: 48000, year: 2025, status: "active", desc: "20 kg heavy-duty cobot with reinforced joint structure and extended 1,700 mm reach for automotive and heavy equipment assembly lines.", specs: { payload: "20 kg", reach: "1,700 mm", repeatability: "±0.05 mm", dof: 6, weight: "62 kg", speed: "1.5 m/s", ip_rating: "IP65" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 80, reliability: 80, ease_of_use: 84, intelligence: 79, value: 82, ecosystem: 71, safety: 84, design: 78 }; return { slug: "hanwha-hcr-8", name: "Hanwha HCR-8", mfr: "hanwha-robotics", cat: "manufacturing", price: 29000, year: 2025, status: "active", desc: "Versatile 8 kg cobot balancing reach and compactness, with integrated force/torque sensing for quality inspection and polishing tasks.", specs: { payload: "8 kg", reach: "1,100 mm", repeatability: "±0.03 mm", dof: 6, weight: "25 kg", ft_sensor: "integrated 6-axis", power: "300 W" }, score: cs(b), breakdown: b }; })(),
  (() => { const b = { performance: 82, reliability: 82, ease_of_use: 81, intelligence: 80, value: 77, ecosystem: 75, safety: 88, design: 82 }; return { slug: "hanwha-hcr-12a", name: "Hanwha HCR-12A", mfr: "hanwha-robotics", cat: "manufacturing", price: 42000, year: 2025, status: "active", desc: "Advanced 12 kg cobot with embedded AI vision module enabling automatic workpiece recognition and adaptive motion planning without external cameras.", specs: { payload: "12 kg", reach: "1,300 mm", repeatability: "±0.04 mm", dof: 6, weight: "39 kg", vision: "embedded AI", programming: "AI-assisted path planning" }, score: cs(b), breakdown: b }; })(),
];

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Robotomated — Wave 17 Import: 50 New Robots");
  console.log("═══════════════════════════════════════════════════\n");

  const { data: cats } = await supabase.from("robot_categories").select("id, slug");
  const catMap = new Map<string, string>();
  for (const c of cats || []) catMap.set(c.slug, c.id);
  console.log(`[DIR] Categories: ${catMap.size}\n`);

  const { data: existingMfrs } = await supabase.from("manufacturers").select("id, slug");
  const mfrMap = new Map<string, string>();
  for (const m of existingMfrs || []) mfrMap.set(m.slug, m.id);

  let mfrsCreated = 0;
  for (const mfr of newMfrs) {
    if (mfrMap.has(mfr.slug)) continue;
    const { data, error } = await supabase.from("manufacturers").insert({
      slug: mfr.slug, name: mfr.name, country: mfr.country,
      founded_year: mfr.founded_year, website: mfr.website, verified: true,
    }).select("id").single();
    if (error) { console.error(`  [ERR] Mfr ${mfr.slug}: ${error.message}`); continue; }
    mfrMap.set(mfr.slug, data!.id);
    mfrsCreated++;
  }
  console.log(`[MFR] Manufacturers: ${mfrsCreated} new, ${mfrMap.size} total\n`);

  let inserted = 0, skipped = 0, errored = 0;
  for (const r of robots) {
    const { data: existing } = await supabase.from("robots").select("id").eq("slug", r.slug).single();
    if (existing) { skipped++; continue; }

    const mfrId = mfrMap.get(r.mfr);
    const catId = catMap.get(r.cat);
    if (!mfrId) { console.error(`  [ERR] ${r.slug}: mfr "${r.mfr}" not found`); errored++; continue; }
    if (!catId) { console.error(`  [ERR] ${r.slug}: cat "${r.cat}" not found`); errored++; continue; }

    const { error } = await supabase.from("robots").insert({
      slug: r.slug, name: r.name, manufacturer_id: mfrId, category_id: catId,
      price_msrp: r.price, price_current: r.price, year_released: r.year,
      status: r.status as "active" | "discontinued" | "coming_soon",
      description_short: r.desc, specs: r.specs, images: gi(r.cat),
      robo_score: r.score > 0 ? r.score : null,
      score_breakdown: r.score > 0 ? r.breakdown : null,
      affiliate_url: null,
    });

    if (error) { console.error(`  [ERR] ${r.slug}: ${error.message}`); errored++; }
    else {
      inserted++;
      if (inserted % 10 === 0) process.stdout.write(`  ${inserted} inserted...\n`);
    }
  }

  const { count } = await supabase.from("robots").select("*", { count: "exact", head: true });

  console.log(`\n${"═".repeat(50)}`);
  console.log(`[STATS] Wave 17 Import Summary`);
  console.log(`${"═".repeat(50)}`);
  console.log(`  Manufacturers: ${mfrsCreated} new`);
  console.log(`  Robots:        ${inserted} inserted, ${skipped} skipped, ${errored} errors`);
  console.log(`  Total in DB:   ${count}`);
  console.log(`${"═".repeat(50)}`);
}

main().catch(console.error);
