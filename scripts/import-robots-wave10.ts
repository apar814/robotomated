/**
 * Robotomated — Wave 10 Robot Import: 50 New Robots
 * Focused on HUMANOID and ELDERCARE categories.
 *
 * Run: npx tsx scripts/import-robots-wave10.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// RoboScore weights: performance 25%, reliability 20%, ease_of_use 15%,
// intelligence 15%, value 10%, ecosystem 8%, safety 5%, design 2%
function cs(b: Record<string, number>): number {
  return Math.round(
    (b.performance * 0.25 + b.reliability * 0.20 + b.ease_of_use * 0.15 +
     b.intelligence * 0.15 + b.value * 0.10 + b.ecosystem * 0.08 +
     b.safety * 0.05 + b.design * 0.02) * 10
  ) / 10;
}

// Placeholder images by category
const catImgs: Record<string, string[]> = {
  humanoid: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=600&h=400&fit=crop"],
  eldercare: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop"],
};
const imgC: Record<string, number> = {};
function gi(cat: string): { url: string; alt: string }[] {
  const s = catImgs[cat] || catImgs.humanoid;
  const i = imgC[cat] || 0; imgC[cat] = i + 1;
  return [{ url: s[i % s.length], alt: `${cat} robot` }];
}

interface R {
  slug: string; name: string; mfr: string; cat: string;
  price: number | null; year: number; status: string;
  desc: string; specs: Record<string, unknown>;
  score: number; breakdown: Record<string, number>;
}

// ── New manufacturers ──
const newMfrs = [
  // Humanoid
  { slug: "1x-technologies", name: "1X Technologies", country: "NO", founded_year: 2014, website: "https://1x.tech" },
  { slug: "apptronik", name: "Apptronik", country: "US", founded_year: 2016, website: "https://apptronik.com" },
  { slug: "clone-robotics", name: "Clone Robotics", country: "PL", founded_year: 2019, website: "https://clonerobotics.com" },
  { slug: "kepler-robot", name: "Kepler Robot", country: "CN", founded_year: 2023, website: "https://kepler-robot.com" },
  { slug: "fourier-intelligence", name: "Fourier Intelligence", country: "CN", founded_year: 2015, website: "https://fourierintelligence.com" },
  { slug: "sanctuary-ai", name: "Sanctuary AI", country: "CA", founded_year: 2018, website: "https://sanctuary.ai" },
  { slug: "tesla", name: "Tesla", country: "US", founded_year: 2003, website: "https://tesla.com" },
  { slug: "xiaomi", name: "Xiaomi", country: "CN", founded_year: 2010, website: "https://mi.com" },
  { slug: "ubtech", name: "UBTECH", country: "CN", founded_year: 2012, website: "https://ubtrobot.com" },
  // Eldercare
  { slug: "awakening-health", name: "Awakening Health", country: "NZ", founded_year: 2021, website: "https://awakeninghealth.ai" },
  { slug: "intuition-robotics", name: "Intuition Robotics", country: "IL", founded_year: 2015, website: "https://intuitionrobotics.com" },
  { slug: "paro-robots", name: "PARO Robots", country: "JP", founded_year: 2003, website: "https://parorobots.com" },
  // Additional manufacturers referenced in robots (may already exist in DB — will be skipped if so)
  { slug: "figure-ai", name: "Figure AI", country: "US", founded_year: 2022, website: "https://figure.ai" },
  { slug: "agility-robotics", name: "Agility Robotics", country: "US", founded_year: 2015, website: "https://agilityrobotics.com" },
  { slug: "boston-dynamics", name: "Boston Dynamics", country: "US", founded_year: 1992, website: "https://bostondynamics.com" },
  { slug: "unitree", name: "Unitree Robotics", country: "CN", founded_year: 2016, website: "https://unitree.com" },
  { slug: "hanson-robotics", name: "Hanson Robotics", country: "HK", founded_year: 2013, website: "https://hansonrobotics.com" },
  { slug: "engineered-arts", name: "Engineered Arts", country: "GB", founded_year: 2004, website: "https://engineeredarts.co.uk" },
  { slug: "pal-robotics", name: "PAL Robotics", country: "ES", founded_year: 2004, website: "https://pal-robotics.com" },
  { slug: "softbank-robotics", name: "SoftBank Robotics", country: "JP", founded_year: 2014, website: "https://softbankrobotics.com" },
  { slug: "menteebot", name: "Menteebot", country: "IL", founded_year: 2022, website: "https://menteebot.com" },
  { slug: "agibot", name: "AgiBot", country: "CN", founded_year: 2023, website: "https://agibot.com" },
  { slug: "limx-dynamics", name: "LimX Dynamics", country: "CN", founded_year: 2022, website: "https://limxdynamics.com" },
  { slug: "kawada-industries", name: "Kawada Industries", country: "JP", founded_year: 1947, website: "https://kawada.co.jp" },
  { slug: "rethink-robotics", name: "Rethink Robotics", country: "DE", founded_year: 2008, website: "https://rethinkrobotics.com" },
  { slug: "sony", name: "Sony", country: "JP", founded_year: 1946, website: "https://sony.com" },
  { slug: "asus", name: "ASUS", country: "TW", founded_year: 1989, website: "https://asus.com" },
  { slug: "luvozo", name: "Luvozo", country: "US", founded_year: 2015, website: "https://luvozo.com" },
  { slug: "catalia-health", name: "Catalia Health", country: "US", founded_year: 2014, website: "https://cataliahealth.com" },
  { slug: "zora-bots", name: "Zora Bots", country: "BE", founded_year: 2013, website: "https://zorabots.be" },
  { slug: "dreamface-technologies", name: "DreamFace Technologies", country: "US", founded_year: 2014, website: "https://dreamfacetech.com" },
  { slug: "medisana", name: "Medisana", country: "DE", founded_year: 1981, website: "https://medisana.com" },
  { slug: "furhat-robotics", name: "Furhat Robotics", country: "SE", founded_year: 2014, website: "https://furhatrobotics.com" },
];

// ═══════════════════════════════════════════════════════════════
// ALL ROBOTS — 50 new entries
// ═══════════════════════════════════════════════════════════════
const robots: R[] = [

  // ═══ HUMANOID (35) ═══
  {slug:"1x-neo",name:"1X NEO",mfr:"1x-technologies",cat:"humanoid",price:50000,year:2025,status:"coming_soon",desc:"General purpose humanoid robot from Norwegian startup 1X Technologies. Designed for versatile tasks in homes and workplaces. Combines advanced AI with safe, compliant actuators for human environments.",specs:{height_cm:170,weight_kg:30,dof:32,actuators:"Compliant electric",battery_hrs:4,ai:"Embodied neural network",locomotion:"Bipedal"},score:cs({performance:78,reliability:72,ease_of_use:74,intelligence:82,value:72,ecosystem:60,safety:80,design:82}),breakdown:{performance:78,reliability:72,ease_of_use:74,intelligence:82,value:72,ecosystem:60,safety:80,design:82}},
  {slug:"1x-neo-beta",name:"1X NEO Beta",mfr:"1x-technologies",cat:"humanoid",price:35000,year:2025,status:"coming_soon",desc:"Household-focused humanoid from 1X Technologies. Lighter and more affordable variant of NEO optimized for domestic tasks like tidying, fetching, and basic household chores.",specs:{height_cm:165,weight_kg:25,dof:28,actuators:"Compliant electric",battery_hrs:3,ai:"Home task learning",locomotion:"Bipedal"},score:cs({performance:72,reliability:68,ease_of_use:78,intelligence:76,value:78,ecosystem:55,safety:82,design:80}),breakdown:{performance:72,reliability:68,ease_of_use:78,intelligence:76,value:78,ecosystem:55,safety:82,design:80}},
  {slug:"1x-eve",name:"1X EVE",mfr:"1x-technologies",cat:"humanoid",price:45000,year:2024,status:"active",desc:"Wheeled humanoid worker from 1X Technologies. Upper-body humanoid form on a mobile wheeled base. Designed for security patrols, warehouse tasks, and facility management. Already deployed commercially.",specs:{height_cm:180,weight_kg:85,upper_body_dof:22,base:"Wheeled mobile",speed_kmh:6,battery_hrs:6,payload_kg:15,ai:"Vision-language model"},score:cs({performance:76,reliability:75,ease_of_use:76,intelligence:80,value:74,ecosystem:62,safety:82,design:76}),breakdown:{performance:76,reliability:75,ease_of_use:76,intelligence:80,value:74,ecosystem:62,safety:82,design:76}},
  {slug:"apptronik-apollo",name:"Apptronik Apollo",mfr:"apptronik",cat:"humanoid",price:60000,year:2025,status:"coming_soon",desc:"Full-size warehouse humanoid from Austin-based Apptronik. 5'8\" tall with 55 lbs carrying capacity. Designed for logistics, manufacturing, and supply chain tasks. Mercedes-Benz partnership.",specs:{height_cm:173,weight_kg:73,payload_kg:25,battery_hrs:4,dof:36,partners:"Mercedes-Benz, NASA",locomotion:"Bipedal",hot_swap_battery:true},score:cs({performance:80,reliability:72,ease_of_use:72,intelligence:82,value:68,ecosystem:65,safety:78,design:84}),breakdown:{performance:80,reliability:72,ease_of_use:72,intelligence:82,value:68,ecosystem:65,safety:78,design:84}},
  {slug:"apptronik-apollo-gen2",name:"Apptronik Apollo Gen 2",mfr:"apptronik",cat:"humanoid",price:55000,year:2026,status:"coming_soon",desc:"Next-generation Apollo with improved dexterity, longer battery life, and enhanced AI capabilities. Targets broader logistics and manufacturing deployment at reduced cost.",specs:{height_cm:173,weight_kg:68,payload_kg:30,battery_hrs:6,dof:42,ai:"Foundation model integration",locomotion:"Bipedal",hot_swap_battery:true},score:cs({performance:82,reliability:74,ease_of_use:76,intelligence:85,value:72,ecosystem:68,safety:80,design:85}),breakdown:{performance:82,reliability:74,ease_of_use:76,intelligence:85,value:72,ecosystem:68,safety:80,design:85}},
  {slug:"clone-torso",name:"Clone Robotics Torso",mfr:"clone-robotics",cat:"humanoid",price:80000,year:2025,status:"coming_soon",desc:"Muscle-based humanoid torso from Polish startup Clone Robotics. Uses artificial muscles that mimic human musculoskeletal system. Over 1,000 artificial muscles for human-like dexterity.",specs:{muscles:1000,actuator_type:"Artificial muscle (hydraulic)",upper_body_dof:50,hands:"Dexterous 5-finger",skin:"Synthetic tactile",weight_kg:40},score:cs({performance:82,reliability:62,ease_of_use:60,intelligence:75,value:58,ecosystem:50,safety:72,design:90}),breakdown:{performance:82,reliability:62,ease_of_use:60,intelligence:75,value:58,ecosystem:50,safety:72,design:90}},
  {slug:"clone-full-body",name:"Clone Robotics Full Body",mfr:"clone-robotics",cat:"humanoid",price:120000,year:2026,status:"coming_soon",desc:"Full biomimetic humanoid from Clone Robotics. Extends the torso platform to a complete bipedal system with artificial muscles throughout. Aims for the most human-like movement in robotics.",specs:{muscles:4000,actuator_type:"Artificial muscle (hydraulic)",dof:120,hands:"Dexterous 5-finger",skin:"Full-body synthetic tactile",height_cm:175,weight_kg:70},score:cs({performance:78,reliability:55,ease_of_use:55,intelligence:72,value:52,ecosystem:45,safety:68,design:90}),breakdown:{performance:78,reliability:55,ease_of_use:55,intelligence:72,value:52,ecosystem:45,safety:68,design:90}},
  {slug:"kepler-forerunner",name:"Kepler Forerunner",mfr:"kepler-robot",cat:"humanoid",price:30000,year:2024,status:"active",desc:"Industrial humanoid from Chinese startup Kepler Robot. Aggressively priced at $30K targeting factory floor tasks. 40 DOF with dexterous hands. Already in pilot deployments across China.",specs:{height_cm:178,weight_kg:85,dof:40,payload_kg:15,battery_hrs:4,hands:"Dexterous multi-finger",speed_kmh:5.5,ai:"Task learning"},score:cs({performance:74,reliability:70,ease_of_use:72,intelligence:74,value:85,ecosystem:58,safety:76,design:74}),breakdown:{performance:74,reliability:70,ease_of_use:72,intelligence:74,value:85,ecosystem:58,safety:76,design:74}},
  {slug:"kepler-forerunner-k2",name:"Kepler Forerunner K2",mfr:"kepler-robot",cat:"humanoid",price:35000,year:2025,status:"coming_soon",desc:"Second-generation Forerunner with improved manipulation, faster walking speed, and enhanced AI for warehouse logistics. Targets mass production at competitive price point.",specs:{height_cm:178,weight_kg:80,dof:44,payload_kg:20,battery_hrs:6,hands:"Improved dexterous",speed_kmh:7,ai:"Warehouse task optimization"},score:cs({performance:78,reliability:72,ease_of_use:74,intelligence:78,value:82,ecosystem:62,safety:78,design:76}),breakdown:{performance:78,reliability:72,ease_of_use:74,intelligence:78,value:82,ecosystem:62,safety:78,design:76}},
  {slug:"fourier-gr1",name:"Fourier GR-1",mfr:"fourier-intelligence",cat:"humanoid",price:40000,year:2024,status:"active",desc:"Rehabilitation-focused humanoid from Fourier Intelligence. Originally a rehabilitation robotics company, GR-1 is their general-purpose humanoid. 55 kg with 50 kg payload capacity.",specs:{height_cm:165,weight_kg:55,dof:44,payload_kg:50,speed_kmh:5,actuators:"FSA high-performance",battery_hrs:2,locomotion:"Bipedal dynamic walking"},score:cs({performance:76,reliability:72,ease_of_use:70,intelligence:76,value:76,ecosystem:60,safety:78,design:76}),breakdown:{performance:76,reliability:72,ease_of_use:70,intelligence:76,value:76,ecosystem:60,safety:78,design:76}},
  {slug:"fourier-gr2",name:"Fourier GR-2",mfr:"fourier-intelligence",cat:"humanoid",price:45000,year:2025,status:"coming_soon",desc:"Next-gen general purpose humanoid from Fourier Intelligence. Improved dexterity, longer battery life, and enhanced AI for both rehabilitation assistance and general industrial tasks.",specs:{height_cm:170,weight_kg:58,dof:53,payload_kg:50,speed_kmh:7,actuators:"FSA v2 high-torque",battery_hrs:4,ai:"Multi-task foundation model"},score:cs({performance:80,reliability:74,ease_of_use:74,intelligence:80,value:74,ecosystem:64,safety:80,design:78}),breakdown:{performance:80,reliability:74,ease_of_use:74,intelligence:80,value:74,ecosystem:64,safety:80,design:78}},
  {slug:"sanctuary-phoenix",name:"Sanctuary AI Phoenix",mfr:"sanctuary-ai",cat:"humanoid",price:65000,year:2025,status:"coming_soon",desc:"General purpose humanoid from Canadian AI company Sanctuary AI. Features Carbon AI control system described as the world's first human-like intelligence in a robot. Focus on general-purpose work.",specs:{height_cm:170,weight_kg:70,dof:40,hands:"20-DOF dexterous",ai:"Carbon general AI system",battery_hrs:4,payload_kg:25,locomotion:"Bipedal"},score:cs({performance:80,reliability:70,ease_of_use:72,intelligence:86,value:68,ecosystem:60,safety:78,design:80}),breakdown:{performance:80,reliability:70,ease_of_use:72,intelligence:86,value:68,ecosystem:60,safety:78,design:80}},
  {slug:"sanctuary-phoenix-gen7",name:"Sanctuary AI Phoenix Gen 7",mfr:"sanctuary-ai",cat:"humanoid",price:70000,year:2026,status:"coming_soon",desc:"Seventh-generation Phoenix humanoid with advanced Carbon AI. Improved manipulation capabilities with new hand design. Targets autonomous performance of hundreds of real-world tasks.",specs:{height_cm:170,weight_kg:65,dof:48,hands:"24-DOF next-gen dexterous",ai:"Carbon v7 general AI",battery_hrs:6,payload_kg:30,tasks_capable:"Hundreds of real-world tasks"},score:cs({performance:82,reliability:72,ease_of_use:74,intelligence:88,value:66,ecosystem:62,safety:80,design:82}),breakdown:{performance:82,reliability:72,ease_of_use:74,intelligence:88,value:66,ecosystem:62,safety:80,design:82}},
  {slug:"tesla-optimus",name:"Tesla Optimus",mfr:"tesla",cat:"humanoid",price:25000,year:2026,status:"coming_soon",desc:"Tesla's general purpose humanoid robot targeting factory automation initially, then household tasks. Leverages Tesla's AI infrastructure including Dojo supercomputer. Aims for sub-$25K price at scale.",specs:{height_cm:173,weight_kg:57,dof:28,payload_kg:20,speed_kmh:8,battery_kwh:2.3,actuators:"Tesla-designed rotary + linear",ai:"Tesla FSD neural network adapted"},score:cs({performance:76,reliability:68,ease_of_use:70,intelligence:80,value:88,ecosystem:72,safety:76,design:78}),breakdown:{performance:76,reliability:68,ease_of_use:70,intelligence:80,value:88,ecosystem:72,safety:76,design:78}},
  {slug:"tesla-optimus-gen2",name:"Tesla Optimus Gen 2",mfr:"tesla",cat:"humanoid",price:20000,year:2026,status:"coming_soon",desc:"Second-generation Optimus with 30% faster walking, 10 kg lighter, and new 11-DOF hands. Improved balance and dexterity demonstrated handling eggs and doing squats. Tesla Dojo-trained AI.",specs:{height_cm:173,weight_kg:47,dof:32,hands:"11-DOF per hand",speed_kmh:10,payload_kg:22,actuators:"Next-gen Tesla rotary + linear",ai:"Dojo-trained end-to-end"},score:cs({performance:80,reliability:70,ease_of_use:74,intelligence:84,value:90,ecosystem:75,safety:78,design:82}),breakdown:{performance:80,reliability:70,ease_of_use:74,intelligence:84,value:90,ecosystem:75,safety:78,design:82}},
  {slug:"xiaomi-cyberone",name:"Xiaomi CyberOne",mfr:"xiaomi",cat:"humanoid",price:100000,year:2023,status:"active",desc:"Xiaomi's full-size humanoid robot demonstration platform. 177 cm tall with emotion recognition and 3D space perception. Can recognize 85 environmental sounds and 45 human emotions.",specs:{height_cm:177,weight_kg:52,dof:21,speed_kmh:3.6,emotions_detected:45,sounds_detected:85,ai:"MiAI perception",battery_hrs:1.5},score:cs({performance:65,reliability:62,ease_of_use:60,intelligence:72,value:50,ecosystem:65,safety:74,design:82}),breakdown:{performance:65,reliability:62,ease_of_use:60,intelligence:72,value:50,ecosystem:65,safety:74,design:82}},
  {slug:"ubtech-walker-x",name:"UBTECH Walker X",mfr:"ubtech",cat:"humanoid",price:85000,year:2023,status:"active",desc:"Bipedal humanoid from Chinese robotics leader UBTECH. 36 high-performance servo joints. Open SDK for third-party development. Used in retail, exhibition, and research applications.",specs:{height_cm:145,weight_kg:63,dof:36,speed_kmh:3,hands:"Dexterous gripping",ai:"UBTECH ROSA AI",battery_hrs:2,sdk:"Open development SDK"},score:cs({performance:72,reliability:70,ease_of_use:68,intelligence:74,value:60,ecosystem:68,safety:76,design:78}),breakdown:{performance:72,reliability:70,ease_of_use:68,intelligence:74,value:60,ecosystem:68,safety:76,design:78}},
  {slug:"ubtech-walker-s",name:"UBTECH Walker S",mfr:"ubtech",cat:"humanoid",price:60000,year:2024,status:"active",desc:"Service-oriented humanoid from UBTECH. Enhanced AI for customer interaction, navigation in complex environments, and task execution. Deployed in Smart City and hospitality scenarios.",specs:{height_cm:150,weight_kg:55,dof:42,speed_kmh:4,ai:"UBTECH ROSA v2 + LLM integration",battery_hrs:3,nav:"Visual SLAM + LiDAR",hands:"Multi-finger dexterous"},score:cs({performance:74,reliability:72,ease_of_use:72,intelligence:78,value:66,ecosystem:70,safety:78,design:78}),breakdown:{performance:74,reliability:72,ease_of_use:72,intelligence:78,value:66,ecosystem:70,safety:78,design:78}},
  {slug:"figure-01",name:"Figure 01",mfr:"figure-ai",cat:"humanoid",price:80000,year:2024,status:"active",desc:"Prototype general-purpose humanoid from Figure AI. Demonstrated making coffee, sorting objects, and learning tasks from language instructions. OpenAI partnership for advanced AI capabilities.",specs:{height_cm:170,weight_kg:60,dof:40,payload_kg:20,speed_kmh:4.5,battery_hrs:5,ai:"OpenAI integration, speech-to-action",hands:"16-DOF dexterous"},score:cs({performance:78,reliability:68,ease_of_use:74,intelligence:86,value:64,ecosystem:65,safety:78,design:82}),breakdown:{performance:78,reliability:68,ease_of_use:74,intelligence:86,value:64,ecosystem:65,safety:78,design:82}},
  {slug:"figure-02-warehouse",name:"Figure 02 Warehouse",mfr:"figure-ai",cat:"humanoid",price:70000,year:2025,status:"coming_soon",desc:"Second-generation Figure humanoid optimized for warehouse logistics. 4th-gen hands with 16 DOF. Improved walking stability and manipulation. BMW partnership for factory deployment.",specs:{height_cm:170,weight_kg:58,dof:44,payload_kg:25,speed_kmh:6,battery_hrs:6,ai:"Figure AI + speech interaction",partners:"BMW, OpenAI"},score:cs({performance:82,reliability:72,ease_of_use:76,intelligence:88,value:70,ecosystem:70,safety:80,design:84}),breakdown:{performance:82,reliability:72,ease_of_use:76,intelligence:88,value:70,ecosystem:70,safety:80,design:84}},
  {slug:"agility-digit-logistics",name:"Digit for Logistics",mfr:"agility-robotics",cat:"humanoid",price:75000,year:2025,status:"active",desc:"Purpose-built warehouse humanoid from Agility Robotics. Designed to work in human spaces handling boxes and totes. Amazon partnership. First humanoid in mass production at RoboFab facility.",specs:{height_cm:175,weight_kg:65,payload_kg:16,speed_kmh:5.5,battery_hrs:4,hands:"Gripper end-effectors",partners:"Amazon, GXO",production:"RoboFab mass production"},score:cs({performance:80,reliability:76,ease_of_use:78,intelligence:80,value:72,ecosystem:74,safety:82,design:78}),breakdown:{performance:80,reliability:76,ease_of_use:78,intelligence:80,value:72,ecosystem:74,safety:82,design:78}},
  {slug:"unitree-g1-pro",name:"Unitree G1 Pro",mfr:"unitree",cat:"humanoid",price:20000,year:2025,status:"active",desc:"Advanced compact humanoid from Unitree at an aggressive price point. 127 cm tall, 35 kg. Simulated-trained locomotion. Dexterous hands capable of tool use. Disrupting humanoid pricing.",specs:{height_cm:127,weight_kg:35,dof:43,speed_kmh:7.5,hands:"Dex3-1 dexterous",battery_hrs:2,ai:"Sim-to-real reinforcement learning",jump_capable:true},score:cs({performance:78,reliability:72,ease_of_use:76,intelligence:78,value:90,ecosystem:65,safety:76,design:80}),breakdown:{performance:78,reliability:72,ease_of_use:76,intelligence:78,value:90,ecosystem:65,safety:76,design:80}},
  {slug:"unitree-h1-industrial",name:"Unitree H1 Industrial",mfr:"unitree",cat:"humanoid",price:90000,year:2025,status:"active",desc:"Full-size industrial humanoid from Unitree. 180 cm tall with powerful actuators for factory environments. Running capability demonstrated at 3.7 m/s. Designed for heavy-duty manipulation tasks.",specs:{height_cm:180,weight_kg:47,dof:26,speed_ms:3.7,payload_kg:30,actuators:"M107 high-torque",battery_hrs:3,locomotion:"Dynamic bipedal + running"},score:cs({performance:84,reliability:74,ease_of_use:68,intelligence:78,value:72,ecosystem:65,safety:74,design:80}),breakdown:{performance:84,reliability:74,ease_of_use:68,intelligence:78,value:72,ecosystem:65,safety:74,design:80}},
  {slug:"boston-dynamics-atlas-warehouse",name:"Atlas Warehouse Edition",mfr:"boston-dynamics",cat:"humanoid",price:150000,year:2026,status:"coming_soon",desc:"All-electric Atlas configured for warehouse logistics. Successor to hydraulic Atlas. Features unprecedented mobility including rotating joints beyond human range. Hyundai factory deployment planned.",specs:{height_cm:150,weight_kg:89,dof:28,speed_kmh:5,payload_kg:25,actuators:"All-electric",mobility:"360-degree joint rotation",partner:"Hyundai"},score:cs({performance:90,reliability:78,ease_of_use:72,intelligence:86,value:58,ecosystem:80,safety:82,design:88}),breakdown:{performance:90,reliability:78,ease_of_use:72,intelligence:86,value:58,ecosystem:80,safety:82,design:88}},
  {slug:"menteebot-mbot",name:"Menteebot MBot",mfr:"menteebot",cat:"humanoid",price:45000,year:2025,status:"coming_soon",desc:"NLP-driven humanoid from Israeli startup Menteebot. Controlled primarily through natural language commands. Learns tasks from verbal instruction and demonstration. Full-size bipedal design.",specs:{height_cm:170,weight_kg:60,dof:30,ai:"NLP task learning",control:"Natural language commands",battery_hrs:3,speed_kmh:4,hands:"Multi-finger grippers"},score:cs({performance:72,reliability:66,ease_of_use:82,intelligence:84,value:72,ecosystem:52,safety:76,design:76}),breakdown:{performance:72,reliability:66,ease_of_use:82,intelligence:84,value:72,ecosystem:52,safety:76,design:76}},
  {slug:"digit-2-0",name:"Agility Digit 2.0",mfr:"agility-robotics",cat:"humanoid",price:65000,year:2026,status:"coming_soon",desc:"Next-generation Digit with improved hands, longer battery life, and enhanced manipulation capabilities. Designed for broader warehouse and logistics deployment at scale.",specs:{height_cm:175,weight_kg:62,payload_kg:20,speed_kmh:6.5,battery_hrs:6,hands:"Next-gen dexterous grippers",ai:"Improved task generalization",production:"RoboFab Gen 2"},score:cs({performance:84,reliability:78,ease_of_use:80,intelligence:84,value:74,ecosystem:76,safety:82,design:80}),breakdown:{performance:84,reliability:78,ease_of_use:80,intelligence:84,value:74,ecosystem:76,safety:82,design:80}},
  {slug:"hanson-sophia-2",name:"Hanson Sophia 2.0",mfr:"hanson-robotics",cat:"humanoid",price:70000,year:2024,status:"active",desc:"Updated version of the famous Sophia social humanoid. Improved facial expressions, conversational AI, and walking ability. Used for social interaction, events, education, and research.",specs:{height_cm:167,weight_kg:20,facial_expressions:62,ai:"GPT-based conversational AI",skin:"Frubber patented material",cameras:"Face tracking + emotion detection",walking:"Basic bipedal"},score:cs({performance:65,reliability:68,ease_of_use:72,intelligence:78,value:58,ecosystem:62,safety:80,design:88}),breakdown:{performance:65,reliability:68,ease_of_use:72,intelligence:78,value:58,ecosystem:62,safety:80,design:88}},
  {slug:"engineered-arts-ameca",name:"Engineered Arts Ameca",mfr:"engineered-arts",cat:"humanoid",price:120000,year:2024,status:"active",desc:"Most expressive humanoid robot in the world from UK's Engineered Arts. 51 facial actuators create lifelike expressions. Modular Tritium operating system. GPT integration for conversation.",specs:{height_cm:180,weight_kg:49,facial_actuators:51,dof:32,ai:"Tritium OS + GPT integration",expressions:"Lifelike micro-expressions",modular:true,sdk:"Tritium developer platform"},score:cs({performance:72,reliability:74,ease_of_use:76,intelligence:80,value:56,ecosystem:64,safety:82,design:90}),breakdown:{performance:72,reliability:74,ease_of_use:76,intelligence:80,value:56,ecosystem:64,safety:82,design:90}},
  {slug:"kawada-nextage",name:"Kawada NEXTAGE",mfr:"kawada-industries",cat:"humanoid",price:95000,year:2023,status:"active",desc:"Dual-arm industrial humanoid from Japan's Kawada Industries. Head-mounted stereo cameras and 15-DOF dual arms. Proven in assembly and inspection tasks at electronics manufacturers.",specs:{height_cm:144,weight_kg:29,arms:"Dual 6-DOF + torso 3-DOF",payload_per_arm_kg:1.5,vision:"Stereo head cameras",repeatability_mm:0.03,application:"Electronics assembly, inspection"},score:cs({performance:78,reliability:82,ease_of_use:72,intelligence:74,value:68,ecosystem:66,safety:84,design:72}),breakdown:{performance:78,reliability:82,ease_of_use:72,intelligence:74,value:68,ecosystem:66,safety:84,design:72}},
  {slug:"rethink-baxter",name:"Rethink Robotics Baxter",mfr:"rethink-robotics",cat:"humanoid",price:28000,year:2023,status:"active",desc:"Pioneering collaborative humanoid-form robot with dual arms and expressive face display. Drag-and-drop programming. Originally discontinued but revived under Hahn Group. Used in education and light manufacturing.",specs:{height_cm:190,weight_kg:140,arms:"Dual 7-DOF",payload_per_arm_kg:2.2,programming:"Drag-and-drop teach",face:"LCD expression display",reach_mm:1210},score:cs({performance:68,reliability:72,ease_of_use:86,intelligence:70,value:82,ecosystem:62,safety:84,design:72}),breakdown:{performance:68,reliability:72,ease_of_use:86,intelligence:70,value:82,ecosystem:62,safety:84,design:72}},
  {slug:"pal-talos",name:"PAL Robotics TALOS",mfr:"pal-robotics",cat:"humanoid",price:350000,year:2023,status:"active",desc:"Full-size research humanoid from Barcelona's PAL Robotics. 175 cm, 32 DOF. Designed for advanced locomotion and manipulation research. Torque-controlled joints for compliant interaction.",specs:{height_cm:175,weight_kg:95,dof:32,payload_per_arm_kg:6,actuators:"Torque-controlled",speed_kmh:3,ros:"ROS 2 native",application:"Research, locomotion studies"},score:cs({performance:82,reliability:78,ease_of_use:65,intelligence:76,value:52,ecosystem:72,safety:80,design:76}),breakdown:{performance:82,reliability:78,ease_of_use:65,intelligence:76,value:52,ecosystem:72,safety:80,design:76}},
  {slug:"pal-kangaroo",name:"PAL Kangaroo",mfr:"pal-robotics",cat:"humanoid",price:180000,year:2024,status:"active",desc:"Lightweight bipedal robot from PAL Robotics. Compact and agile design for dynamic walking research and service applications. Next-generation platform building on TALOS experience.",specs:{height_cm:130,weight_kg:45,dof:24,speed_kmh:5,actuators:"High-torque compact",battery_hrs:3,ros:"ROS 2 native",locomotion:"Dynamic bipedal"},score:cs({performance:78,reliability:76,ease_of_use:68,intelligence:74,value:58,ecosystem:70,safety:78,design:80}),breakdown:{performance:78,reliability:76,ease_of_use:68,intelligence:74,value:58,ecosystem:70,safety:78,design:80}},
  {slug:"agibot-genie-1",name:"AgiBot Genie-1",mfr:"agibot",cat:"humanoid",price:55000,year:2025,status:"coming_soon",desc:"Industrial humanoid from AgiBot, a startup spun out of Shanghai AI Lab. Designed for factory floor tasks with strong manipulation. Multi-modal AI trained on large-scale robotics data.",specs:{height_cm:175,weight_kg:68,dof:38,payload_kg:20,speed_kmh:6,ai:"Multi-modal robotics foundation model",battery_hrs:4,hands:"Dexterous multi-finger"},score:cs({performance:80,reliability:70,ease_of_use:72,intelligence:84,value:72,ecosystem:58,safety:78,design:80}),breakdown:{performance:80,reliability:70,ease_of_use:72,intelligence:84,value:72,ecosystem:58,safety:78,design:80}},
  {slug:"halodi-eve",name:"Halodi EVE (1X EVE rebrand)",mfr:"1x-technologies",cat:"humanoid",price:48000,year:2024,status:"active",desc:"Security-focused wheeled humanoid, the original EVE platform from Halodi Robotics (now 1X Technologies). Deployed for autonomous security patrols in commercial buildings and facilities.",specs:{height_cm:185,weight_kg:90,upper_body_dof:22,base:"Wheeled omnidirectional",speed_kmh:5,battery_hrs:8,application:"Security patrol, monitoring",sensors:"360-degree cameras + thermal"},score:cs({performance:74,reliability:76,ease_of_use:78,intelligence:78,value:72,ecosystem:60,safety:84,design:74}),breakdown:{performance:74,reliability:76,ease_of_use:78,intelligence:78,value:72,ecosystem:60,safety:84,design:74}},
  {slug:"limx-cl1",name:"LimX CL-1",mfr:"limx-dynamics",cat:"humanoid",price:35000,year:2025,status:"coming_soon",desc:"Dynamic bipedal humanoid from Chinese startup LimX Dynamics. Demonstrated stair climbing, uneven terrain walking, and push recovery. Reinforcement learning-based locomotion control.",specs:{height_cm:130,weight_kg:45,dof:24,speed_kmh:5,locomotion:"RL-based dynamic bipedal",terrain:"Stairs, slopes, uneven ground",battery_hrs:2.5,ai:"Sim-to-real reinforcement learning"},score:cs({performance:78,reliability:70,ease_of_use:70,intelligence:80,value:78,ecosystem:55,safety:76,design:78}),breakdown:{performance:78,reliability:70,ease_of_use:70,intelligence:80,value:78,ecosystem:55,safety:76,design:78}},

  // ═══ ELDERCARE (15) ═══
  {slug:"awakening-grace",name:"Awakening Health Grace",mfr:"awakening-health",cat:"eldercare",price:35000,year:2024,status:"active",desc:"Social companion robot for elderly care from New Zealand's Awakening Health. Based on Hanson Robotics technology. Expressive face for emotional connection. Conversation, reminders, and cognitive games.",specs:{height_cm:48,weight_kg:5,face:"Expressive animated",ai:"Conversational AI + emotion detection",functions:"Companionship, reminders, cognitive games",connectivity:"WiFi + 4G",battery_hrs:8},score:cs({performance:72,reliability:74,ease_of_use:82,intelligence:78,value:68,ecosystem:58,safety:86,design:80}),breakdown:{performance:72,reliability:74,ease_of_use:82,intelligence:78,value:68,ecosystem:58,safety:86,design:80}},
  {slug:"awakening-ari",name:"Awakening Health ARI",mfr:"awakening-health",cat:"eldercare",price:40000,year:2024,status:"active",desc:"Elder care assistant robot with more advanced capabilities than Grace. Medication reminders, fall detection, video calling with family, and health monitoring integration.",specs:{height_cm:55,weight_kg:7,face:"Expressive animated",ai:"Health-focused conversational AI",functions:"Medication reminders, fall detection, video calls, health monitoring",sensors:"Camera + depth + microphone array",battery_hrs:10},score:cs({performance:76,reliability:76,ease_of_use:80,intelligence:80,value:66,ecosystem:60,safety:88,design:78}),breakdown:{performance:76,reliability:76,ease_of_use:80,intelligence:80,value:66,ecosystem:60,safety:88,design:78}},
  {slug:"intuition-elliq",name:"Intuition Robotics ElliQ",mfr:"intuition-robotics",cat:"eldercare",price:250,year:2023,status:"active",desc:"Proactive AI companion for older adults from Israeli company Intuition Robotics. Initiates conversation, suggests activities, and helps with loneliness. Used by NY State Office for the Aging.",specs:{form:"Tabletop with animated head",ai:"Proactive conversational AI",functions:"Companionship, activity suggestions, health tips, video calls",display:"Integrated tablet",partner:"NY State Office for the Aging"},score:cs({performance:74,reliability:78,ease_of_use:90,intelligence:82,value:90,ecosystem:65,safety:88,design:82}),breakdown:{performance:74,reliability:78,ease_of_use:90,intelligence:82,value:90,ecosystem:65,safety:88,design:82}},
  {slug:"intuition-elliq-2",name:"Intuition Robotics ElliQ 2.0",mfr:"intuition-robotics",cat:"eldercare",price:350,year:2024,status:"active",desc:"Updated ElliQ with health monitoring, medication adherence tracking, and expanded proactive engagement. Improved AI for more natural conversation and personalized wellness programs.",specs:{form:"Tabletop with animated head",ai:"Advanced proactive health AI",functions:"Health monitoring, medication adherence, wellness programs, video calls",display:"Upgraded tablet",sensors:"Ambient light + sound + presence"},score:cs({performance:78,reliability:80,ease_of_use:90,intelligence:86,value:88,ecosystem:68,safety:88,design:84}),breakdown:{performance:78,reliability:80,ease_of_use:90,intelligence:86,value:88,ecosystem:68,safety:88,design:84}},
  {slug:"paro-therapeutic",name:"PARO Therapeutic Robot",mfr:"paro-robots",cat:"eldercare",price:6000,year:2023,status:"active",desc:"Therapeutic baby harp seal robot for dementia care. FDA-cleared Class II medical device. Reduces agitation, anxiety, and medication use in dementia patients. Responds to touch, light, and sound.",specs:{form:"Baby harp seal",weight_kg:2.5,sensors:"Tactile, light, auditory, temperature, posture",fda:"Class II medical device",battery_hrs:1.5,effects:"Reduces agitation, anxiety, medication use"},score:cs({performance:72,reliability:82,ease_of_use:90,intelligence:62,value:72,ecosystem:55,safety:90,design:86}),breakdown:{performance:72,reliability:82,ease_of_use:90,intelligence:62,value:72,ecosystem:55,safety:90,design:86}},
  {slug:"paro-paro-iii",name:"PARO III",mfr:"paro-robots",cat:"eldercare",price:6500,year:2024,status:"active",desc:"Third generation therapeutic seal robot with improved sensors, longer battery life, and enhanced behavioral AI. Updated fur material for better hygiene in clinical settings.",specs:{form:"Baby harp seal",weight_kg:2.3,sensors:"Enhanced tactile array, light, auditory, temperature",battery_hrs:3,fur:"Antimicrobial updated material",ai:"Improved behavioral adaptation"},score:cs({performance:74,reliability:84,ease_of_use:90,intelligence:66,value:70,ecosystem:56,safety:90,design:88}),breakdown:{performance:74,reliability:84,ease_of_use:90,intelligence:66,value:70,ecosystem:56,safety:90,design:88}},
  {slug:"luvozo-sam",name:"Luvozo SAM",mfr:"luvozo",cat:"eldercare",price:15000,year:2023,status:"active",desc:"Senior Activity Monitor robot that autonomously navigates senior living facilities. Checks on residents, detects falls, and alerts caregivers. Telepresence capability for remote family visits.",specs:{height_cm:120,weight_kg:25,nav:"Autonomous facility navigation",functions:"Resident check-ins, fall detection, telepresence",battery_hrs:12,alerts:"Caregiver notification system",camera:"HD video calling"},score:cs({performance:74,reliability:76,ease_of_use:78,intelligence:74,value:72,ecosystem:58,safety:84,design:72}),breakdown:{performance:74,reliability:76,ease_of_use:78,intelligence:74,value:72,ecosystem:58,safety:84,design:72}},
  {slug:"catalia-health-mabu",name:"Catalia Health Mabu",mfr:"catalia-health",cat:"eldercare",price:8000,year:2023,status:"active",desc:"Medication adherence companion robot. Engages patients in daily conversations about their health, reminds about medications, and reports adherence data to healthcare providers.",specs:{height_cm:35,weight_kg:3,ai:"Health conversation AI",functions:"Medication reminders, health conversations, adherence tracking",display:"Facial expression screen",connectivity:"WiFi + cellular",reporting:"Healthcare provider dashboard"},score:cs({performance:70,reliability:76,ease_of_use:84,intelligence:76,value:74,ecosystem:62,safety:86,design:74}),breakdown:{performance:70,reliability:76,ease_of_use:84,intelligence:76,value:74,ecosystem:62,safety:86,design:74}},
  {slug:"zora-bots-zora",name:"Zora Bots ZORA",mfr:"zora-bots",cat:"eldercare",price:18000,year:2023,status:"active",desc:"Elder exercise and engagement robot based on SoftBank NAO platform. Pre-programmed care activities including group exercise, music therapy, and cognitive games. Used in 200+ care facilities.",specs:{height_cm:58,weight_kg:5.4,platform:"SoftBank NAO",functions:"Group exercise, music therapy, cognitive games, storytelling",deployments:"200+ care facilities",programming:"Zora visual composer",battery_hrs:1.5},score:cs({performance:72,reliability:74,ease_of_use:82,intelligence:72,value:68,ecosystem:64,safety:84,design:76}),breakdown:{performance:72,reliability:74,ease_of_use:82,intelligence:72,value:68,ecosystem:64,safety:84,design:76}},
  {slug:"softbank-pepper-care",name:"SoftBank Pepper for Care",mfr:"softbank-robotics",cat:"eldercare",price:22000,year:2023,status:"active",desc:"Pepper robot configured for elder care settings. Social interaction, exercise coaching, trivia games, and daily activity facilitation. Emotion recognition for personalized engagement.",specs:{height_cm:121,weight_kg:28,ai:"Emotion recognition + conversational",functions:"Social interaction, exercise coaching, trivia, activity facilitation",sensors:"3D cameras + touch sensors",battery_hrs:3,emotion:"Multi-modal emotion detection"},score:cs({performance:72,reliability:72,ease_of_use:80,intelligence:76,value:64,ecosystem:70,safety:84,design:78}),breakdown:{performance:72,reliability:72,ease_of_use:80,intelligence:76,value:64,ecosystem:70,safety:84,design:78}},
  {slug:"asus-zenbo",name:"ASUS Zenbo",mfr:"asus",cat:"eldercare",price:600,year:2023,status:"active",desc:"Affordable home companion robot from ASUS. Designed for elder monitoring with fall detection, medication reminders, and video calling. Entertainment and smart home control capabilities.",specs:{height_cm:62,weight_kg:10,display:"10-inch touch screen",functions:"Fall detection, medication reminders, video calls, entertainment",nav:"Autonomous home navigation",smart_home:"IoT hub integration",battery_hrs:8},score:cs({performance:68,reliability:72,ease_of_use:84,intelligence:70,value:88,ecosystem:66,safety:80,design:78}),breakdown:{performance:68,reliability:72,ease_of_use:84,intelligence:70,value:88,ecosystem:66,safety:80,design:78}},
  {slug:"aibo-elder",name:"Sony Aibo Elder Edition",mfr:"sony",cat:"eldercare",price:2900,year:2024,status:"active",desc:"Sony's robot dog companion configured for elderly companionship. Learns owner routines and preferences. Patrol mode for home monitoring. Provides emotional comfort without pet care burden.",specs:{form:"Robot dog",weight_kg:2.2,ai:"Personality learning AI",sensors:"Camera, touch, cliff detect",functions:"Companionship, routine learning, home patrol, photo capture",battery_hrs:2,connectivity:"WiFi + LTE optional"},score:cs({performance:72,reliability:78,ease_of_use:86,intelligence:78,value:72,ecosystem:70,safety:86,design:90}),breakdown:{performance:72,reliability:78,ease_of_use:86,intelligence:78,value:72,ecosystem:70,safety:86,design:90}},
  {slug:"dreamface-ryan",name:"DreamFace Ryan",mfr:"dreamface-technologies",cat:"eldercare",price:12000,year:2023,status:"active",desc:"Social interaction robot with realistic facial expressions for elder engagement. Designed for group activities in senior living. Recognizes residents and personalizes interactions.",specs:{height_cm:45,weight_kg:8,face:"Realistic animated expressions",ai:"Facial recognition + conversational",functions:"Group activities, personalized greetings, storytelling, trivia",recognition:"Individual resident identification",connectivity:"WiFi"},score:cs({performance:70,reliability:72,ease_of_use:78,intelligence:74,value:68,ecosystem:55,safety:84,design:76}),breakdown:{performance:70,reliability:72,ease_of_use:78,intelligence:74,value:68,ecosystem:55,safety:84,design:76}},
  {slug:"medisana-home-robot",name:"Medisana Home Robot",mfr:"medisana",cat:"eldercare",price:5000,year:2024,status:"active",desc:"Health assistant robot from German health technology company Medisana. Integrates with Medisana health devices (blood pressure, oximeter, thermometer). Tracks vitals and alerts caregivers.",specs:{height_cm:40,weight_kg:5,display:"7-inch touch screen",functions:"Vital tracking, health device integration, medication reminders, video calls",devices:"Blood pressure, oximeter, thermometer, scale",alerts:"Caregiver notification",battery_hrs:10},score:cs({performance:72,reliability:76,ease_of_use:82,intelligence:72,value:78,ecosystem:68,safety:86,design:74}),breakdown:{performance:72,reliability:76,ease_of_use:82,intelligence:72,value:78,ecosystem:68,safety:86,design:74}},
  {slug:"furhat-eldercare",name:"Furhat Elder Care",mfr:"furhat-robotics",cat:"eldercare",price:28000,year:2024,status:"active",desc:"Social robot with projected face for lifelike interaction in elder care. Furhat's unique back-projected face technology enables natural conversation. Multi-language support for diverse populations.",specs:{form:"Tabletop with projected face",face:"Back-projected animated",ai:"Conversational AI + NLP",languages:"30+ supported",functions:"Social interaction, cognitive exercises, reminiscence therapy",sdk:"Furhat developer platform"},score:cs({performance:76,reliability:76,ease_of_use:78,intelligence:80,value:62,ecosystem:66,safety:86,design:84}),breakdown:{performance:76,reliability:76,ease_of_use:78,intelligence:80,value:62,ecosystem:66,safety:86,design:84}},
];

// ═══════════════════════════════════════════════════════════════
// MAIN IMPORT
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Robotomated — Wave 10 Import: 50 New Robots");
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Load categories — create humanoid + eldercare if missing
  const { data: cats } = await supabase.from("robot_categories").select("id, slug");
  const catMap = new Map<string, string>();
  for (const c of cats || []) catMap.set(c.slug, c.id);

  const newCategories = [
    { slug: "humanoid", name: "Humanoid Robots", description: "Bipedal and human-form robots for general purpose tasks" },
    { slug: "eldercare", name: "Eldercare & Companion", description: "Robots for senior care, therapy, and companionship" },
  ];
  for (const nc of newCategories) {
    if (catMap.has(nc.slug)) continue;
    const { data, error } = await supabase.from("robot_categories").insert({
      slug: nc.slug, name: nc.name, description: nc.description,
    }).select("id").single();
    if (error) { console.error(`  [ERR] Category ${nc.slug}: ${error.message}`); continue; }
    catMap.set(nc.slug, data!.id);
    console.log(`  [CAT] Created category: ${nc.name}`);
  }
  console.log(`[DIR] Categories: ${catMap.size}\n`);

  // 2. Load + create manufacturers
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

  // 3. Insert robots
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

  // Get final count
  const { count } = await supabase.from("robots").select("*", { count: "exact", head: true });

  console.log(`\n${"═".repeat(50)}`);
  console.log(`[STATS] Wave 10 Import Summary`);
  console.log(`${"═".repeat(50)}`);
  console.log(`  Manufacturers: ${mfrsCreated} new`);
  console.log(`  Robots:        ${inserted} inserted, ${skipped} skipped, ${errored} errors`);
  console.log(`  Total in DB:   ${count}`);
  console.log(`${"═".repeat(50)}`);
}

main().catch(console.error);
