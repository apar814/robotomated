/**
 * Robotomated — Bulk Robot Import Script
 * Imports 75 real robots with manufacturers and categories.
 * Run: npx tsx scripts/import-robots.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Category images by slug (multiple per category for rotation) ──
const categoryImageSets: Record<string, { url: string; alt: string }[]> = {
  manufacturing: [
    { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop", alt: "Robot arm welding in factory" },
    { url: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=600&h=400&fit=crop", alt: "Robotic arm in manufacturing" },
    { url: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600&h=400&fit=crop", alt: "Industrial automation line" },
    { url: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=400&fit=crop", alt: "Robot manufacturing process" },
  ],
  warehouse: [
    { url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop", alt: "Modern warehouse automation" },
    { url: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop", alt: "Warehouse logistics robot" },
    { url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop", alt: "Automated warehouse shelving" },
  ],
  consumer: [
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop", alt: "Smart home robot" },
    { url: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=400&fit=crop", alt: "Home automation technology" },
    { url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop", alt: "Modern living room tech" },
  ],
  medical: [
    { url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop", alt: "Medical robotics technology" },
    { url: "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=600&h=400&fit=crop", alt: "Surgical technology" },
    { url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=400&fit=crop", alt: "Hospital technology" },
  ],
  construction: [
    { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", alt: "Construction site robotics" },
    { url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop", alt: "Construction technology" },
    { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop", alt: "Building construction" },
  ],
  agricultural: [
    { url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop", alt: "Precision agriculture" },
    { url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop", alt: "Farm technology" },
    { url: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c10?w=600&h=400&fit=crop", alt: "Agricultural drone" },
  ],
  delivery: [
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop", alt: "Delivery technology" },
    { url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop", alt: "Last mile delivery" },
  ],
  drone: [
    { url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop", alt: "Drone flying over landscape" },
    { url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=400&fit=crop", alt: "Drone in sky" },
    { url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&h=400&fit=crop", alt: "Drone aerial view" },
  ],
  software: [
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop", alt: "Circuit board technology" },
    { url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop", alt: "Code and technology" },
  ],
};

// Counter per category for rotating images
const imageCounters: Record<string, number> = {};
function getNextImage(cat: string): { url: string; alt: string }[] {
  const set = categoryImageSets[cat] || categoryImageSets.software;
  const counter = imageCounters[cat] || 0;
  imageCounters[cat] = counter + 1;
  return [set[counter % set.length]];
}

// ── Categories to ensure exist ──
const categories = [
  { slug: "warehouse", name: "Warehouse & Logistics", icon_name: "warehouse", display_order: 1 },
  { slug: "manufacturing", name: "Manufacturing & Industrial", icon_name: "factory", display_order: 2 },
  { slug: "consumer", name: "Consumer & Home", icon_name: "home", display_order: 3 },
  { slug: "medical", name: "Medical & Healthcare", icon_name: "medical", display_order: 4 },
  { slug: "construction", name: "Construction & Infrastructure", icon_name: "truck", display_order: 5 },
  { slug: "agricultural", name: "Agricultural", icon_name: "warehouse", display_order: 6 },
  { slug: "delivery", name: "Delivery & Last-Mile", icon_name: "truck", display_order: 7 },
  { slug: "drone", name: "Drones & Aerial", icon_name: "truck", display_order: 8 },
  { slug: "software", name: "Robotics Software & Infrastructure", icon_name: "factory", display_order: 9 },
];

// ── Manufacturers ──
const manufacturers: { slug: string; name: string; country: string; founded_year: number; website: string }[] = [
  { slug: "unitree-robotics", name: "Unitree Robotics", country: "CN", founded_year: 2016, website: "https://unitree.com" },
  { slug: "tesla", name: "Tesla", country: "US", founded_year: 2003, website: "https://tesla.com" },
  { slug: "figure-ai", name: "Figure AI", country: "US", founded_year: 2022, website: "https://figure.ai" },
  { slug: "agility-robotics", name: "Agility Robotics", country: "US", founded_year: 2015, website: "https://agilityrobotics.com" },
  { slug: "boston-dynamics", name: "Boston Dynamics", country: "US", founded_year: 1992, website: "https://bostondynamics.com" },
  { slug: "ubtech-robotics", name: "UBTECH Robotics", country: "CN", founded_year: 2012, website: "https://ubtrobot.com" },
  { slug: "1x-technologies", name: "1X Technologies", country: "NO", founded_year: 2014, website: "https://1x.tech" },
  { slug: "apptronik", name: "Apptronik", country: "US", founded_year: 2016, website: "https://apptronik.com" },
  { slug: "sanctuary-ai", name: "Sanctuary AI", country: "CA", founded_year: 2018, website: "https://sanctuaryai.com" },
  { slug: "fourier-intelligence", name: "Fourier Intelligence", country: "CN", founded_year: 2015, website: "https://fftai.com" },
  { slug: "engineered-arts", name: "Engineered Arts", country: "GB", founded_year: 2005, website: "https://engineeredarts.co.uk" },
  { slug: "standard-bots", name: "Standard Bots", country: "US", founded_year: 2021, website: "https://standardbots.com" },
  { slug: "universal-robots", name: "Universal Robots", country: "DK", founded_year: 2005, website: "https://universal-robots.com" },
  { slug: "fanuc", name: "FANUC", country: "JP", founded_year: 1972, website: "https://fanucamerica.com" },
  { slug: "abb-robotics", name: "ABB Robotics", country: "CH", founded_year: 1988, website: "https://abb.com" },
  { slug: "kuka", name: "KUKA", country: "DE", founded_year: 1898, website: "https://kuka.com" },
  { slug: "doosan-robotics", name: "Doosan Robotics", country: "KR", founded_year: 2015, website: "https://doosanrobotics.com" },
  { slug: "techman-robot", name: "Techman Robot", country: "TW", founded_year: 2016, website: "https://techmanrobot.com" },
  { slug: "franka-emika", name: "Franka Emika", country: "DE", founded_year: 2016, website: "https://franka.de" },
  { slug: "irobot", name: "iRobot", country: "US", founded_year: 1990, website: "https://irobot.com" },
  { slug: "roborock", name: "Roborock", country: "CN", founded_year: 2014, website: "https://roborock.com" },
  { slug: "ecovacs", name: "Ecovacs", country: "CN", founded_year: 1998, website: "https://ecovacs.com" },
  { slug: "dreame", name: "Dreame", country: "CN", founded_year: 2015, website: "https://dreame.com" },
  { slug: "amazon", name: "Amazon", country: "US", founded_year: 1994, website: "https://amazon.com" },
  { slug: "miko", name: "Miko", country: "IN", founded_year: 2015, website: "https://miko.ai" },
  { slug: "locus-robotics", name: "Locus Robotics", country: "US", founded_year: 2014, website: "https://locusrobotics.com" },
  { slug: "six-river", name: "6 River Systems", country: "US", founded_year: 2015, website: "https://6river.com" },
  { slug: "symbotic", name: "Symbotic", country: "US", founded_year: 2007, website: "https://symbotic.com" },
  { slug: "zebra-fetch", name: "Zebra/Fetch Robotics", country: "US", founded_year: 2014, website: "https://fetchrobotics.com" },
  { slug: "mir", name: "Mobile Industrial Robots", country: "DK", founded_year: 2013, website: "https://mir-robots.com" },
  { slug: "geek-plus", name: "Geek+", country: "CN", founded_year: 2015, website: "https://geekplus.com" },
  { slug: "rapid-robotics", name: "Rapid Robotics", country: "US", founded_year: 2019, website: "https://rapidrobotics.com" },
  { slug: "amp-robotics", name: "AMP Robotics", country: "US", founded_year: 2015, website: "https://amprobotics.com" },
  { slug: "intuitive-surgical", name: "Intuitive Surgical", country: "US", founded_year: 1995, website: "https://intuitive.com" },
  { slug: "stryker", name: "Stryker", country: "US", founded_year: 1941, website: "https://stryker.com" },
  { slug: "medtronic", name: "Medtronic", country: "US", founded_year: 1949, website: "https://medtronic.com" },
  { slug: "diligent-robotics", name: "Diligent Robotics", country: "US", founded_year: 2017, website: "https://diligentrobots.com" },
  { slug: "ekso-bionics", name: "Ekso Bionics", country: "US", founded_year: 2005, website: "https://eksobionics.com" },
  { slug: "sarcos", name: "Sarcos Robotics", country: "US", founded_year: 2015, website: "https://sarcos.com" },
  { slug: "john-deere", name: "John Deere", country: "US", founded_year: 1837, website: "https://deere.com" },
  { slug: "dji", name: "DJI", country: "CN", founded_year: 2006, website: "https://dji.com" },
  { slug: "carbon-robotics", name: "Carbon Robotics", country: "US", founded_year: 2018, website: "https://carbonrobotics.com" },
  { slug: "aigen", name: "Aigen", country: "US", founded_year: 2020, website: "https://aigen.io" },
  { slug: "built-robotics", name: "Built Robotics", country: "US", founded_year: 2016, website: "https://builtrobotics.com" },
  { slug: "dusty-robotics", name: "Dusty Robotics", country: "US", founded_year: 2018, website: "https://dustyrobotics.com" },
  { slug: "hilti", name: "Hilti", country: "LI", founded_year: 1941, website: "https://hilti.com" },
  { slug: "nuro", name: "Nuro", country: "US", founded_year: 2016, website: "https://nuro.ai" },
  { slug: "starship", name: "Starship Technologies", country: "US", founded_year: 2014, website: "https://starship.xyz" },
  { slug: "serve-robotics", name: "Serve Robotics", country: "US", founded_year: 2021, website: "https://serverobotics.com" },
  { slug: "skydio", name: "Skydio", country: "US", founded_year: 2014, website: "https://skydio.com" },
  { slug: "zipline", name: "Zipline", country: "US", founded_year: 2014, website: "https://flyzipline.com" },
  { slug: "ghost-robotics", name: "Ghost Robotics", country: "US", founded_year: 2015, website: "https://ghostrobotics.io" },
  { slug: "knightscope", name: "Knightscope", country: "US", founded_year: 2013, website: "https://knightscope.com" },
  { slug: "intrinsic", name: "Intrinsic (Alphabet)", country: "US", founded_year: 2021, website: "https://intrinsic.ai" },
  { slug: "nvidia", name: "NVIDIA", country: "US", founded_year: 1993, website: "https://nvidia.com" },
];

// ── Robots ──
interface RobotData {
  slug: string; name: string; mfr: string; cat: string;
  price: number | null; year: number; status: string;
  desc: string; specs: Record<string, unknown>;
  score: number; breakdown: Record<string, number>;
}

const robots: RobotData[] = [
  // HUMANOIDS
  { slug:"unitree-g1-basic",name:"Unitree G1 Basic",mfr:"unitree-robotics",cat:"consumer",price:21600,year:2024,status:"active",desc:"Most affordable production humanoid. 23 DOF, force-sensing joints, reinforcement learning. Ships globally.",specs:{height_cm:132,weight_kg:35,payload_kg:3,dof:23,battery_hrs:2,max_speed_ms:2,compute:"NVIDIA Jetson Orin"},score:78,breakdown:{performance:80,reliability:72,ease_of_use:82,intelligence:78,value:95,ecosystem:70,safety:65,design:75}},
  { slug:"unitree-g1-edu",name:"Unitree G1 EDU Standard",mfr:"unitree-robotics",cat:"consumer",price:43500,year:2024,status:"active",desc:"Research-grade humanoid with full SDK, Intel RealSense D435, LIVOX MID-360 3D LiDAR. Most popular research humanoid.",specs:{height_cm:132,weight_kg:35,payload_kg:3,dof:43,battery_hrs:2,max_speed_ms:2,compute:"NVIDIA Jetson Orin 100 TOPS",sensors:"Intel RealSense D435, LIVOX MID-360 LiDAR"},score:82,breakdown:{performance:82,reliability:74,ease_of_use:85,intelligence:82,value:88,ecosystem:78,safety:68,design:78}},
  { slug:"unitree-h1",name:"Unitree H1",mfr:"unitree-robotics",cat:"manufacturing",price:90000,year:2023,status:"active",desc:"Full-size humanoid, world record 3.3 m/s running speed. 360 N.m max joint torque. Enterprise deployment.",specs:{height_cm:180,weight_kg:47,payload_kg:10,dof:26,battery_hrs:2,max_speed_ms:3.3,compute:"NVIDIA Orin"},score:85,breakdown:{performance:90,reliability:78,ease_of_use:80,intelligence:85,value:82,ecosystem:75,safety:72,design:88}},
  { slug:"unitree-r1",name:"Unitree R1",mfr:"unitree-robotics",cat:"consumer",price:5900,year:2025,status:"active",desc:"Smallest affordable humanoid. TIME Best Inventions 2025. Plans 10-20K shipments in 2026.",specs:{height_cm:110,weight_kg:25,dof:20,battery_hrs:1.5,max_speed_ms:4,compute:"Custom"},score:72,breakdown:{performance:75,reliability:68,ease_of_use:78,intelligence:70,value:92,ecosystem:60,safety:60,design:80}},
  { slug:"tesla-optimus-gen2",name:"Tesla Optimus Gen 2",mfr:"tesla",cat:"manufacturing",price:null,year:2024,status:"coming_soon",desc:"Second-gen humanoid deployed in Tesla factories. 11 DOF hands. End-to-end neural network control.",specs:{height_cm:173,weight_kg:57,dof:28,compute:"Tesla FSD chip / Dojo"},score:70,breakdown:{performance:72,reliability:65,ease_of_use:68,intelligence:75,value:70,ecosystem:60,safety:65,design:78}},
  { slug:"figure-02",name:"Figure 02",mfr:"figure-ai",cat:"manufacturing",price:130000,year:2024,status:"discontinued",desc:"Deployed 11 months at BMW Spartanburg. 90K+ parts loaded. Now retired for Figure 03.",specs:{height_cm:168,weight_kg:70,payload_kg:25,dof:40,battery_hrs:5,max_speed_ms:1.2,compute:"Helix VLA onboard"},score:83,breakdown:{performance:85,reliability:78,ease_of_use:80,intelligence:88,value:72,ecosystem:70,safety:80,design:85}},
  { slug:"figure-03",name:"Figure 03",mfr:"figure-ai",cat:"manufacturing",price:null,year:2025,status:"coming_soon",desc:"Third-gen humanoid redesigned for mass production. BotQ facility targets 12K units/yr. $39B valuation.",specs:{compute:"Helix AI v2"},score:0,breakdown:{performance:0,reliability:0,ease_of_use:0,intelligence:0,value:0,ecosystem:0,safety:0,design:0}},
  { slug:"agility-digit",name:"Agility Digit",mfr:"agility-robotics",cat:"warehouse",price:null,year:2023,status:"active",desc:"Bipedal warehouse robot. RoboFab factory in Salem, OR. First commercial humanoid in GXO Spanx warehouse.",specs:{height_cm:175,weight_kg:65,payload_kg:16,compute:"Custom"},score:80,breakdown:{performance:82,reliability:75,ease_of_use:78,intelligence:80,value:70,ecosystem:72,safety:78,design:82}},
  { slug:"boston-dynamics-atlas-electric",name:"Boston Dynamics Atlas (Electric)",mfr:"boston-dynamics",cat:"manufacturing",price:null,year:2024,status:"coming_soon",desc:"All-electric redesign of legendary Atlas. Designed for commercial manufacturing with Hyundai.",specs:{height_cm:150,compute:"Custom"},score:88,breakdown:{performance:95,reliability:82,ease_of_use:75,intelligence:90,value:60,ecosystem:80,safety:85,design:95}},
  { slug:"ubtech-walker-s",name:"UBTECH Walker S",mfr:"ubtech-robotics",cat:"manufacturing",price:null,year:2024,status:"active",desc:"Industrial humanoid from first publicly traded humanoid company. Deployed in NIO EV factories.",specs:{height_cm:145,weight_kg:63,dof:41,compute:"Custom"},score:76,breakdown:{performance:78,reliability:72,ease_of_use:74,intelligence:76,value:68,ecosystem:65,safety:70,design:78}},
  { slug:"1x-neo",name:"1X NEO Beta",mfr:"1x-technologies",cat:"consumer",price:25000,year:2025,status:"coming_soon",desc:"First humanoid designed for home use. OpenAI-backed. In-home trials with selected families.",specs:{height_cm:167,weight_kg:30,compute:"OpenAI models"},score:74,breakdown:{performance:72,reliability:68,ease_of_use:82,intelligence:80,value:78,ecosystem:65,safety:72,design:80}},
  { slug:"1x-eve",name:"1X EVE",mfr:"1x-technologies",cat:"warehouse",price:null,year:2022,status:"active",desc:"Wheeled humanoid for security and logistics. Upper body with arms on mobile base.",specs:{height_cm:180,weight_kg:86,compute:"OpenAI models"},score:72,breakdown:{performance:70,reliability:72,ease_of_use:75,intelligence:76,value:65,ecosystem:62,safety:70,design:72}},
  { slug:"apptronik-apollo",name:"Apptronik Apollo",mfr:"apptronik",cat:"warehouse",price:null,year:2024,status:"active",desc:"NASA-heritage humanoid. Swappable 4-hour battery packs. Partnerships with Amazon, Mercedes-Benz, Walmart.",specs:{height_cm:173,weight_kg:73,payload_kg:25,battery_hrs:4,compute:"Custom"},score:79,breakdown:{performance:80,reliability:74,ease_of_use:78,intelligence:80,value:72,ecosystem:70,safety:76,design:82}},
  { slug:"sanctuary-phoenix",name:"Sanctuary AI Phoenix",mfr:"sanctuary-ai",cat:"manufacturing",price:null,year:2024,status:"active",desc:"Most dexterous hands in industry (20+ DOF per hand). Carbon AI learns new tasks in hours.",specs:{height_cm:170,weight_kg:70,compute:"Carbon AI system"},score:81,breakdown:{performance:82,reliability:74,ease_of_use:80,intelligence:86,value:68,ecosystem:65,safety:75,design:80}},
  { slug:"fourier-gr2",name:"Fourier GR-2",mfr:"fourier-intelligence",cat:"medical",price:80000,year:2024,status:"active",desc:"Rehabilitation humanoid. 53 DOF. Force-controlled joints. Hospital deployments.",specs:{height_cm:165,weight_kg:55,payload_kg:5,dof:53,compute:"Custom"},score:77,breakdown:{performance:78,reliability:75,ease_of_use:76,intelligence:74,value:72,ecosystem:68,safety:80,design:76}},
  { slug:"engineered-arts-ameca",name:"Engineered Arts Ameca",mfr:"engineered-arts",cat:"consumer",price:null,year:2021,status:"active",desc:"Most realistic facial expressions in robotics. GPT-4o integrated. 52 DOF face.",specs:{dof:52,compute:"GPT-4o cloud"},score:73,breakdown:{performance:68,reliability:72,ease_of_use:78,intelligence:80,value:60,ecosystem:55,safety:70,design:92}},
  { slug:"standard-bots-ro1",name:"Standard Bots RO1",mfr:"standard-bots",cat:"manufacturing",price:37000,year:2024,status:"active",desc:"AI-native 6-axis cobot. GPT-4 level programming via natural language. Half the price of comparable cobots.",specs:{payload_kg:18,dof:6,precision_mm:0.025,compute:"GPT-4 level AI",vision:"3D machine vision"},score:84,breakdown:{performance:85,reliability:80,ease_of_use:95,intelligence:88,value:92,ecosystem:72,safety:80,design:78}},
  // QUADRUPEDS
  { slug:"boston-dynamics-spot",name:"Boston Dynamics Spot",mfr:"boston-dynamics",cat:"construction",price:74500,year:2020,status:"active",desc:"Industry standard quadruped. 700+ units deployed. IP54. Construction, oil & gas, mining inspection.",specs:{height_cm:84,weight_kg:32,payload_kg:14,dof:12,battery_hrs:1.5,max_speed_ms:1.6,ip_rating:"IP54"},score:87,breakdown:{performance:88,reliability:90,ease_of_use:82,intelligence:85,value:72,ecosystem:88,safety:90,design:92}},
  { slug:"boston-dynamics-spot-arm",name:"Boston Dynamics Spot + Arm",mfr:"boston-dynamics",cat:"construction",price:99500,year:2021,status:"active",desc:"Spot with 6-DOF manipulation arm. Opens doors, turns valves, grasps objects.",specs:{height_cm:84,weight_kg:32,payload_kg:14,dof:18,battery_hrs:1.5,max_speed_ms:1.6,ip_rating:"IP54"},score:89,breakdown:{performance:90,reliability:88,ease_of_use:80,intelligence:88,value:70,ecosystem:90,safety:88,design:92}},
  { slug:"unitree-go2",name:"Unitree Go2",mfr:"unitree-robotics",cat:"consumer",price:1600,year:2024,status:"active",desc:"Ultra-affordable robot dog. 1/50th the price of Spot. LIDAR mapping. 10K+ sold.",specs:{height_cm:40,weight_kg:15,payload_kg:3,dof:12,battery_hrs:2,max_speed_ms:2.5},score:80,breakdown:{performance:78,reliability:75,ease_of_use:85,intelligence:76,value:98,ecosystem:72,safety:68,design:82}},
  { slug:"unitree-go2-edu",name:"Unitree Go2 EDU+",mfr:"unitree-robotics",cat:"consumer",price:5500,year:2024,status:"active",desc:"Research variant with full SDK, ROS2, advanced sensor suite. Most popular quadruped in university research.",specs:{height_cm:40,weight_kg:15,payload_kg:3,dof:12,battery_hrs:2,max_speed_ms:2.5,compute:"Custom + ROS2"},score:82,breakdown:{performance:78,reliability:75,ease_of_use:88,intelligence:80,value:90,ecosystem:85,safety:68,design:82}},
  { slug:"unitree-b2",name:"Unitree B2",mfr:"unitree-robotics",cat:"construction",price:60000,year:2023,status:"active",desc:"Industrial-grade quadruped. IP67. 40kg payload. 6 m/s speed.",specs:{height_cm:70,weight_kg:60,payload_kg:40,dof:12,battery_hrs:4,max_speed_ms:6,ip_rating:"IP67"},score:83,breakdown:{performance:88,reliability:82,ease_of_use:78,intelligence:80,value:80,ecosystem:72,safety:82,design:80}},
  { slug:"ghost-vision-60",name:"Ghost Robotics Vision 60",mfr:"ghost-robotics",cat:"construction",price:150000,year:2022,status:"active",desc:"Military quadruped. US Air Force and border security. IP67. All-weather operations.",specs:{height_cm:76,weight_kg:51,payload_kg:10,dof:12,battery_hrs:3,max_speed_ms:3,ip_rating:"IP67"},score:78,breakdown:{performance:82,reliability:80,ease_of_use:68,intelligence:76,value:60,ecosystem:62,safety:85,design:78}},
  // COBOTS
  { slug:"ur5e-v2",name:"Universal Robots UR5e",mfr:"universal-robots",cat:"manufacturing",price:35000,year:2018,status:"active",desc:"World's most popular cobot. 5kg payload, 850mm reach. 75K+ total UR units sold.",specs:{payload_kg:5,reach_mm:850,dof:6,repeatability_mm:0.03,ip_rating:"IP54"},score:86,breakdown:{performance:85,reliability:88,ease_of_use:90,intelligence:78,value:85,ecosystem:95,safety:88,design:82}},
  { slug:"ur10e-v2",name:"Universal Robots UR10e",mfr:"universal-robots",cat:"manufacturing",price:45000,year:2018,status:"active",desc:"Medium-payload cobot. 12.5kg capacity, 1300mm reach. Machine tending, palletizing.",specs:{payload_kg:12.5,reach_mm:1300,dof:6,repeatability_mm:0.05,ip_rating:"IP54"},score:85,breakdown:{performance:86,reliability:88,ease_of_use:88,intelligence:78,value:82,ecosystem:95,safety:88,design:80}},
  { slug:"ur20-v2",name:"Universal Robots UR20",mfr:"universal-robots",cat:"manufacturing",price:55000,year:2023,status:"active",desc:"Heavy-payload cobot. 20kg capacity, 1750mm reach. 65% faster than UR10e.",specs:{payload_kg:20,reach_mm:1750,dof:6,ip_rating:"IP54"},score:87,breakdown:{performance:90,reliability:88,ease_of_use:86,intelligence:80,value:84,ecosystem:92,safety:88,design:82}},
  { slug:"ur30",name:"Universal Robots UR30",mfr:"universal-robots",cat:"manufacturing",price:60000,year:2024,status:"active",desc:"Heaviest UR cobot at 30kg. 1300mm reach. CNC loading, heavy-duty palletizing.",specs:{payload_kg:30,reach_mm:1300,dof:6,ip_rating:"IP54"},score:86,breakdown:{performance:88,reliability:88,ease_of_use:84,intelligence:78,value:80,ecosystem:90,safety:88,design:80}},
  { slug:"fanuc-crx-10ia",name:"FANUC CRX-10iA",mfr:"fanuc",cat:"manufacturing",price:30000,year:2020,status:"active",desc:"FANUC flagship cobot. 10kg payload. IP67 rated. Backed by 1M+ robot install base.",specs:{payload_kg:10,dof:6,ip_rating:"IP67"},score:85,breakdown:{performance:86,reliability:95,ease_of_use:78,intelligence:75,value:85,ecosystem:88,safety:90,design:76}},
  { slug:"abb-gofa",name:"ABB GoFa CRB 15000",mfr:"abb-robotics",cat:"manufacturing",price:40000,year:2021,status:"active",desc:"ABB flagship cobot. Wizard Easy Programming. Class-leading speed.",specs:{payload_kg:5,reach_mm:950,dof:6,ip_rating:"IP54"},score:83,breakdown:{performance:84,reliability:86,ease_of_use:85,intelligence:78,value:80,ecosystem:85,safety:86,design:80}},
  { slug:"abb-yumi",name:"ABB YuMi IRB 14050",mfr:"abb-robotics",cat:"manufacturing",price:50000,year:2015,status:"active",desc:"World's first dual-arm collaborative robot. Two 7-DOF arms for electronics assembly.",specs:{payload_kg:0.5,dof:14,arms:2},score:82,breakdown:{performance:80,reliability:85,ease_of_use:80,intelligence:82,value:72,ecosystem:85,safety:88,design:85}},
  { slug:"kuka-lbr-iiwa",name:"KUKA LBR iiwa 14",mfr:"kuka",cat:"manufacturing",price:60000,year:2014,status:"active",desc:"Sensitive cobot with 7 joint torque sensors. 14kg payload. BMW and VW precision assembly.",specs:{payload_kg:14,dof:7},score:84,breakdown:{performance:86,reliability:84,ease_of_use:78,intelligence:82,value:76,ecosystem:82,safety:88,design:80}},
  { slug:"franka-fr3",name:"Franka Emika FR3",mfr:"franka-emika",cat:"manufacturing",price:25000,year:2023,status:"active",desc:"Most popular cobot in academic research. 7-joint torque sensing. Affordable research-grade.",specs:{payload_kg:3,dof:7,repeatability_mm:0.1},score:83,breakdown:{performance:80,reliability:78,ease_of_use:88,intelligence:82,value:90,ecosystem:85,safety:82,design:82}},
  { slug:"doosan-m1013",name:"Doosan M1013",mfr:"doosan-robotics",cat:"manufacturing",price:30000,year:2020,status:"active",desc:"Korean cobot. 10kg payload, 1300mm reach. 6 torque sensors. Intuitive direct teaching.",specs:{payload_kg:10,reach_mm:1300,dof:6,ip_rating:"IP54"},score:79,breakdown:{performance:80,reliability:78,ease_of_use:82,intelligence:76,value:82,ecosystem:72,safety:80,design:78}},
  { slug:"techman-tm12",name:"Techman TM12",mfr:"techman-robot",cat:"manufacturing",price:35000,year:2020,status:"active",desc:"Only major cobot with built-in vision system. 12kg payload. No external camera needed.",specs:{payload_kg:12,dof:6,ip_rating:"IP54",vision:"Built-in"},score:80,breakdown:{performance:80,reliability:78,ease_of_use:85,intelligence:80,value:82,ecosystem:75,safety:80,design:78}},
  // CONSUMER
  { slug:"roomba-j9-plus",name:"iRobot Roomba j9+",mfr:"irobot",cat:"consumer",price:799,year:2023,status:"active",desc:"Premium robot vacuum. PrecisionVision Navigation. Auto dirt disposal.",specs:{height_cm:34,weight_kg:3,battery_hrs:2},score:82,breakdown:{performance:84,reliability:82,ease_of_use:90,intelligence:80,value:78,ecosystem:80,safety:88,design:80}},
  { slug:"roomba-combo-j9",name:"iRobot Roomba Combo j9+",mfr:"irobot",cat:"consumer",price:1399,year:2023,status:"active",desc:"Flagship vacuum + mop combo. Auto-retracting mop pad. Self-empty and auto-fill dock.",specs:{height_cm:34,weight_kg:3,battery_hrs:2},score:84,breakdown:{performance:86,reliability:82,ease_of_use:88,intelligence:82,value:76,ecosystem:82,safety:88,design:82}},
  { slug:"roborock-s8-maxv-ultra-v2",name:"Roborock S8 MaxV Ultra",mfr:"roborock",cat:"consumer",price:1799,year:2024,status:"active",desc:"Most powerful robot vacuum. 10000Pa suction. ReactiveAI 3D obstacle avoidance.",specs:{height_cm:35,weight_kg:4,battery_hrs:3,suction_pa:10000},score:88,breakdown:{performance:92,reliability:86,ease_of_use:88,intelligence:90,value:82,ecosystem:78,safety:88,design:86}},
  { slug:"ecovacs-t30-omni",name:"Ecovacs DEEBOT T30 Omni",mfr:"ecovacs",cat:"consumer",price:999,year:2024,status:"active",desc:"TrueEdge 1mm mopping. ZeroTangle brush. 11000Pa suction. Hot water mop washing.",specs:{height_cm:34,weight_kg:4,battery_hrs:2.5,suction_pa:11000},score:85,breakdown:{performance:88,reliability:82,ease_of_use:86,intelligence:84,value:88,ecosystem:76,safety:86,design:82}},
  { slug:"dreame-x40-ultra",name:"Dreame X40 Ultra",mfr:"dreame",cat:"consumer",price:1699,year:2024,status:"active",desc:"12000Pa suction. Extending side brush for edge cleaning. MopExtend RoboSwing.",specs:{height_cm:35,weight_kg:4,battery_hrs:3,suction_pa:12000},score:86,breakdown:{performance:90,reliability:84,ease_of_use:86,intelligence:86,value:82,ecosystem:76,safety:86,design:84}},
  { slug:"amazon-astro",name:"Amazon Astro",mfr:"amazon",cat:"consumer",price:1600,year:2023,status:"active",desc:"Home robot with Alexa. Autonomous patrol for security. Ring integration.",specs:{height_cm:42,weight_kg:9},score:72,breakdown:{performance:70,reliability:72,ease_of_use:80,intelligence:75,value:68,ecosystem:82,safety:72,design:70}},
  { slug:"miko-3",name:"Miko 3",mfr:"miko",cat:"consumer",price:249,year:2022,status:"active",desc:"AI kids companion. Adaptive conversations, emotional intelligence. Ages 5-12.",specs:{height_cm:26,weight_kg:2,battery_hrs:3},score:75,breakdown:{performance:72,reliability:74,ease_of_use:90,intelligence:78,value:82,ecosystem:70,safety:85,design:78}},
  // WAREHOUSE
  { slug:"boston-dynamics-stretch-v2",name:"Boston Dynamics Stretch",mfr:"boston-dynamics",cat:"warehouse",price:100000,year:2023,status:"active",desc:"Truck unloading robot. 50K lbs/day throughput. 8-hour battery. DHL, Maersk deployments.",specs:{payload_kg:23,battery_hrs:8,ip_rating:"IP54"},score:86,breakdown:{performance:90,reliability:85,ease_of_use:78,intelligence:84,value:72,ecosystem:80,safety:88,design:82}},
  { slug:"locus-vector-v2",name:"Locus Robotics Vector",mfr:"locus-robotics",cat:"warehouse",price:null,year:2023,status:"active",desc:"Market-leading collaborative AMR. $1000/month lease. 10K+ deployed. DHL, Geodis, CEVA.",specs:{payload_kg:27,battery_hrs:10},score:83,breakdown:{performance:84,reliability:82,ease_of_use:86,intelligence:80,value:82,ecosystem:80,safety:84,design:78}},
  { slug:"six-river-chuck",name:"6 River Systems Chuck",mfr:"six-river",cat:"warehouse",price:null,year:2019,status:"active",desc:"Collaborative warehouse AMR. Shopify fulfillment integration. 5K+ deployed.",specs:{},score:80,breakdown:{performance:80,reliability:78,ease_of_use:82,intelligence:78,value:80,ecosystem:78,safety:82,design:76}},
  { slug:"symbotic-system",name:"Symbotic Automated System",mfr:"symbotic",cat:"warehouse",price:null,year:2023,status:"active",desc:"End-to-end warehouse automation. AI-powered routing. Walmart's primary partner. $15B market cap.",specs:{},score:85,breakdown:{performance:90,reliability:84,ease_of_use:72,intelligence:88,value:75,ecosystem:78,safety:86,design:80}},
  { slug:"fetch-freight-500",name:"Fetch Freight 500",mfr:"zebra-fetch",cat:"warehouse",price:35000,year:2022,status:"active",desc:"Transport AMR. 500kg payload. No infrastructure mods needed. 3K+ deployed.",specs:{payload_kg:500,battery_hrs:9,ip_rating:"IP52"},score:79,breakdown:{performance:80,reliability:78,ease_of_use:82,intelligence:76,value:78,ecosystem:76,safety:80,design:74}},
  { slug:"mir250",name:"MiR250",mfr:"mir",cat:"warehouse",price:30000,year:2022,status:"active",desc:"Compact logistics AMR. 250kg payload. IP52. Dynamic navigation. 5K+ deployed.",specs:{payload_kg:250,battery_hrs:13,ip_rating:"IP52"},score:81,breakdown:{performance:82,reliability:80,ease_of_use:84,intelligence:78,value:80,ecosystem:78,safety:82,design:78}},
  { slug:"geek-plus-p800",name:"Geek+ P800",mfr:"geek-plus",cat:"warehouse",price:30000,year:2022,status:"active",desc:"Goods-to-person AMR. Lifts 1000kg shelving pods. 500K+ deployed globally.",specs:{payload_kg:1000,battery_hrs:8},score:82,breakdown:{performance:84,reliability:80,ease_of_use:80,intelligence:78,value:82,ecosystem:76,safety:80,design:76}},
  { slug:"rapid-machine-operator",name:"Rapid Robotics Machine Operator",mfr:"rapid-robotics",cat:"manufacturing",price:null,year:2022,status:"active",desc:"Pre-trained robot cells. $2,100/month RaaS. Zero CapEx. Full support included.",specs:{dof:6},score:76,breakdown:{performance:74,reliability:76,ease_of_use:88,intelligence:72,value:85,ecosystem:68,safety:78,design:72}},
  { slug:"amp-cortex",name:"AMP Robotics Cortex",mfr:"amp-robotics",cat:"warehouse",price:null,year:2020,status:"active",desc:"AI waste sorting. Distinguishes plastic types, metal grades in real time. $6K/month lease.",specs:{},score:78,breakdown:{performance:82,reliability:76,ease_of_use:80,intelligence:85,value:78,ecosystem:65,safety:76,design:70}},
  // MEDICAL
  { slug:"davinci-5",name:"Intuitive da Vinci 5",mfr:"intuitive-surgical",cat:"medical",price:2000000,year:2024,status:"active",desc:"Gold standard surgical robot. First force feedback. 10K+ installed base. 2M+ annual procedures.",specs:{compute:"Custom"},score:95,breakdown:{performance:96,reliability:95,ease_of_use:88,intelligence:92,value:80,ecosystem:98,safety:98,design:90}},
  { slug:"davinci-sp-v2",name:"Intuitive da Vinci SP",mfr:"intuitive-surgical",cat:"medical",price:2500000,year:2020,status:"active",desc:"Single-port surgical system. Narrow-access surgery. Minimally invasive.",specs:{},score:90,breakdown:{performance:92,reliability:92,ease_of_use:85,intelligence:88,value:75,ecosystem:95,safety:96,design:88}},
  { slug:"intuitive-ion",name:"Intuitive Ion",mfr:"intuitive-surgical",cat:"medical",price:null,year:2019,status:"active",desc:"Lung biopsy robot. Shape-sensing navigation technology. 1K+ installed.",specs:{},score:88,breakdown:{performance:90,reliability:88,ease_of_use:82,intelligence:86,value:78,ecosystem:90,safety:94,design:84}},
  { slug:"stryker-mako",name:"Stryker MAKO",mfr:"stryker",cat:"medical",price:1500000,year:2022,status:"active",desc:"Robotic-arm assisted orthopedic surgery. CT-based 3D planning. 3K+ installed.",specs:{},score:90,breakdown:{performance:92,reliability:90,ease_of_use:84,intelligence:88,value:78,ecosystem:86,safety:95,design:85}},
  { slug:"medtronic-hugo",name:"Medtronic Hugo RAS",mfr:"medtronic",cat:"medical",price:1500000,year:2023,status:"active",desc:"Modular surgical system. Designed to expand access to robotic surgery. CE Mark approved.",specs:{},score:82,breakdown:{performance:84,reliability:80,ease_of_use:82,intelligence:80,value:76,ecosystem:78,safety:88,design:80}},
  { slug:"diligent-moxi",name:"Diligent Moxi",mfr:"diligent-robotics",cat:"medical",price:null,year:2023,status:"active",desc:"Hospital logistics robot. Delivers supplies, runs samples. $1,500/month lease.",specs:{},score:77,breakdown:{performance:76,reliability:78,ease_of_use:82,intelligence:76,value:78,ecosystem:70,safety:80,design:76}},
  { slug:"ekso-nr",name:"Ekso EksoNR",mfr:"ekso-bionics",cat:"medical",price:150000,year:2021,status:"active",desc:"FDA-cleared rehab exoskeleton. Variable Assist adapts to each patient. 500+ rehab centers.",specs:{},score:80,breakdown:{performance:82,reliability:80,ease_of_use:78,intelligence:76,value:72,ecosystem:75,safety:88,design:78}},
  { slug:"sarcos-guardian-xo",name:"Sarcos Guardian XO",mfr:"sarcos",cat:"medical",price:100000,year:2022,status:"active",desc:"Full-body powered exoskeleton. 90kg lift capacity. Military and industrial.",specs:{payload_kg:90,battery_hrs:2},score:76,breakdown:{performance:80,reliability:72,ease_of_use:70,intelligence:68,value:68,ecosystem:60,safety:78,design:80}},
  // AGRICULTURAL
  { slug:"john-deere-see-spray",name:"John Deere See & Spray Ultimate",mfr:"john-deere",cat:"agricultural",price:500000,year:2023,status:"active",desc:"AI identifies weeds vs crops, targets herbicide precisely. Reduces chemical use 77%.",specs:{},score:85,breakdown:{performance:88,reliability:84,ease_of_use:80,intelligence:90,value:78,ecosystem:80,safety:82,design:78}},
  { slug:"dji-agras-t50",name:"DJI Agras T50",mfr:"dji",cat:"agricultural",price:15000,year:2024,status:"active",desc:"Professional ag drone. 40kg spray tank, 50kg spread tank. IP67. 50K+ deployed.",specs:{payload_kg:50,battery_hrs:0.3,max_speed_ms:15,ip_rating:"IP67"},score:86,breakdown:{performance:88,reliability:85,ease_of_use:82,intelligence:82,value:88,ecosystem:80,safety:84,design:82}},
  { slug:"carbon-laserweeder",name:"Carbon Robotics LaserWeeder",mfr:"carbon-robotics",cat:"agricultural",price:500000,year:2024,status:"active",desc:"Autonomous laser weeding — no chemicals. 2 acres per hour. 100+ deployed.",specs:{},score:82,breakdown:{performance:85,reliability:78,ease_of_use:80,intelligence:84,value:72,ecosystem:65,safety:80,design:78}},
  { slug:"aigen-element",name:"Aigen Element",mfr:"aigen",cat:"agricultural",price:null,year:2024,status:"active",desc:"Solar-powered autonomous weeding robot. No chemicals, no fuel. Subscription model.",specs:{ip_rating:"IP65"},score:74,breakdown:{performance:72,reliability:70,ease_of_use:78,intelligence:76,value:80,ecosystem:60,safety:72,design:72}},
  // CONSTRUCTION
  { slug:"built-robotics-exo",name:"Built Robotics Exosystem",mfr:"built-robotics",cat:"construction",price:300000,year:2023,status:"active",desc:"Retrofit kit turns excavators/dozers into autonomous machines. GPS-guided. 100+ deployed.",specs:{},score:79,breakdown:{performance:82,reliability:76,ease_of_use:78,intelligence:80,value:72,ecosystem:68,safety:80,design:72}},
  { slug:"dusty-fieldprinter",name:"Dusty Robotics FieldPrinter",mfr:"dusty-robotics",cat:"construction",price:null,year:2023,status:"active",desc:"Prints building plans on concrete floors. 10x faster than manual layout. $3K/month lease.",specs:{battery_hrs:8},score:81,breakdown:{performance:84,reliability:80,ease_of_use:82,intelligence:78,value:80,ecosystem:72,safety:82,design:78}},
  { slug:"hilti-jaibot",name:"Hilti Jaibot",mfr:"hilti",cat:"construction",price:50000,year:2022,status:"active",desc:"Autonomous overhead drilling robot. BIM-guided precision. 500+ deployed.",specs:{battery_hrs:8,ip_rating:"IP54"},score:78,breakdown:{performance:80,reliability:80,ease_of_use:78,intelligence:76,value:74,ecosystem:72,safety:82,design:74}},
  // DELIVERY
  { slug:"nuro-r3",name:"Nuro R3",mfr:"nuro",cat:"delivery",price:null,year:2024,status:"active",desc:"Third-gen autonomous delivery vehicle. Zero-occupant design. Kroger, FedEx, Uber Eats.",specs:{payload_kg:230,height_cm:180},score:80,breakdown:{performance:82,reliability:76,ease_of_use:80,intelligence:84,value:72,ecosystem:76,safety:82,design:80}},
  { slug:"starship-delivery",name:"Starship Delivery Robot",mfr:"starship",cat:"delivery",price:null,year:2018,status:"active",desc:"Sidewalk delivery robot. 2M+ deliveries completed. 20+ countries. Popular on campuses.",specs:{height_cm:56,weight_kg:23,payload_kg:10,dof:6,ip_rating:"IP54"},score:79,breakdown:{performance:78,reliability:80,ease_of_use:84,intelligence:78,value:80,ecosystem:75,safety:82,design:76}},
  { slug:"serve-delivery",name:"Serve Robotics Delivery Bot",mfr:"serve-robotics",cat:"delivery",price:null,year:2023,status:"active",desc:"Uber Eats sidewalk delivery robot. Level 4 autonomy. Public company (SERV).",specs:{payload_kg:11},score:73,breakdown:{performance:72,reliability:72,ease_of_use:78,intelligence:76,value:70,ecosystem:72,safety:76,design:72}},
  // DRONES
  { slug:"dji-mavic-3-pro",name:"DJI Mavic 3 Pro",mfr:"dji",cat:"drone",price:2199,year:2023,status:"active",desc:"Flagship consumer drone. Triple-camera with Hasselblad. 43-min flight time.",specs:{weight_kg:0.9,battery_hrs:0.72},score:90,breakdown:{performance:92,reliability:88,ease_of_use:90,intelligence:85,value:85,ecosystem:90,safety:88,design:94}},
  { slug:"dji-matrice-350",name:"DJI Matrice 350 RTK",mfr:"dji",cat:"drone",price:11000,year:2023,status:"active",desc:"Enterprise inspection drone. RTK positioning. Multi-payload. IP55.",specs:{weight_kg:7,payload_kg:2.7,battery_hrs:0.92,ip_rating:"IP55"},score:88,breakdown:{performance:90,reliability:88,ease_of_use:84,intelligence:84,value:82,ecosystem:88,safety:86,design:84}},
  { slug:"skydio-x10",name:"Skydio X10",mfr:"skydio",cat:"drone",price:11000,year:2023,status:"active",desc:"US-made enterprise drone. Full AI autonomy. 3D scanning. NVIDIA Orin powered.",specs:{weight_kg:2,battery_hrs:0.58,ip_rating:"IP55",compute:"NVIDIA Orin"},score:85,breakdown:{performance:86,reliability:84,ease_of_use:88,intelligence:90,value:80,ecosystem:82,safety:84,design:82}},
  { slug:"zipline-p2",name:"Zipline P2 Zip",mfr:"zipline",cat:"drone",price:null,year:2024,status:"active",desc:"Autonomous medical/commercial delivery. 100K+ deliveries. Rwanda, Ghana, Walmart.",specs:{payload_kg:3.5},score:84,breakdown:{performance:86,reliability:84,ease_of_use:82,intelligence:82,value:78,ecosystem:76,safety:86,design:82}},
  // SERVICE
  { slug:"knightscope-k5",name:"Knightscope K5",mfr:"knightscope",cat:"construction",price:null,year:2015,status:"active",desc:"Security patrol robot. 360° video, thermal, LiDAR. $400/month lease. 400+ deployed.",specs:{height_cm:152,weight_kg:181,battery_hrs:24,ip_rating:"IP55"},score:65,breakdown:{performance:68,reliability:70,ease_of_use:72,intelligence:68,value:70,ecosystem:58,safety:72,design:62}},
  // SOFTWARE
  { slug:"intrinsic-flowstate",name:"Intrinsic Flowstate",mfr:"intrinsic",cat:"software",price:null,year:2021,status:"active",desc:"Alphabet's robotics moonshot. Modular robot software platform. Think Android for robots.",specs:{},score:0,breakdown:{performance:0,reliability:0,ease_of_use:0,intelligence:0,value:0,ecosystem:0,safety:0,design:0}},
  { slug:"nvidia-isaac",name:"NVIDIA Isaac",mfr:"nvidia",cat:"software",price:null,year:2019,status:"active",desc:"Robot simulation and synthetic data platform. Used by virtually every major robotics company.",specs:{},score:0,breakdown:{performance:0,reliability:0,ease_of_use:0,intelligence:0,value:0,ecosystem:0,safety:0,design:0}},
];

// ── Main ──
async function main() {
  console.log("🤖 Robotomated Import Script\n");

  let mfrsCreated = 0, mfrsExisted = 0;
  let catsCreated = 0, catsExisted = 0;
  let robotsInserted = 0, robotsSkipped = 0, robotsErrored = 0;

  // 1. Ensure categories exist
  console.log("📁 Ensuring categories...");
  const catMap = new Map<string, string>();
  for (const cat of categories) {
    const { data: existing } = await supabase.from("robot_categories").select("id").eq("slug", cat.slug).single();
    if (existing) {
      catMap.set(cat.slug, existing.id);
      catsExisted++;
    } else {
      const { data: created, error } = await supabase.from("robot_categories").insert(cat).select("id").single();
      if (error) { console.error(`  ❌ Category ${cat.slug}: ${error.message}`); continue; }
      catMap.set(cat.slug, created!.id);
      catsCreated++;
      console.log(`  ✅ Created category: ${cat.name}`);
    }
  }
  console.log(`  Categories: ${catsCreated} created, ${catsExisted} existed\n`);

  // 2. Ensure manufacturers exist
  console.log("🏭 Ensuring manufacturers...");
  const mfrMap = new Map<string, string>();
  for (const mfr of manufacturers) {
    const { data: existing } = await supabase.from("manufacturers").select("id").eq("slug", mfr.slug).single();
    if (existing) {
      mfrMap.set(mfr.slug, existing.id);
      mfrsExisted++;
    } else {
      const { data: created, error } = await supabase.from("manufacturers").insert({
        slug: mfr.slug, name: mfr.name, country: mfr.country,
        founded_year: mfr.founded_year, website: mfr.website, verified: true,
      }).select("id").single();
      if (error) { console.error(`  ❌ Manufacturer ${mfr.slug}: ${error.message}`); continue; }
      mfrMap.set(mfr.slug, created!.id);
      mfrsCreated++;
      console.log(`  ✅ Created: ${mfr.name}`);
    }
  }
  console.log(`  Manufacturers: ${mfrsCreated} created, ${mfrsExisted} existed\n`);

  // 3. Insert robots
  console.log("🤖 Importing robots...");
  for (const r of robots) {
    // Check exists
    const { data: existing } = await supabase.from("robots").select("id").eq("slug", r.slug).single();
    if (existing) { robotsSkipped++; continue; }

    const mfrId = mfrMap.get(r.mfr);
    const catId = catMap.get(r.cat);
    if (!mfrId) { console.error(`  ❌ ${r.slug}: manufacturer "${r.mfr}" not found`); robotsErrored++; continue; }
    if (!catId) { console.error(`  ❌ ${r.slug}: category "${r.cat}" not found`); robotsErrored++; continue; }

    const images = getNextImage(r.cat);

    const { error } = await supabase.from("robots").insert({
      slug: r.slug,
      name: r.name,
      manufacturer_id: mfrId,
      category_id: catId,
      price_msrp: r.price,
      price_current: r.price,
      year_released: r.year,
      status: r.status as "active" | "discontinued" | "coming_soon",
      description_short: r.desc,
      specs: r.specs,
      images,
      robo_score: r.score > 0 ? r.score : null,
      score_breakdown: r.score > 0 ? r.breakdown : null,
    });

    if (error) {
      console.error(`  ❌ ${r.slug}: ${error.message}`);
      robotsErrored++;
    } else {
      robotsInserted++;
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 Import Summary`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  Categories:    ${catsCreated} created, ${catsExisted} existed`);
  console.log(`  Manufacturers: ${mfrsCreated} created, ${mfrsExisted} existed`);
  console.log(`  Robots:        ${robotsInserted} inserted, ${robotsSkipped} skipped, ${robotsErrored} errors`);
  console.log(`  Total in DB:   ${robotsInserted + robotsSkipped + 20} (includes 20 seed robots)`);
  console.log(`${"=".repeat(50)}`);
}

main().catch(console.error);
