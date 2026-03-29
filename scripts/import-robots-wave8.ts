/**
 * Robotomated — Wave 8 Robot Import: 45 Robots
 * 15 Consumer/Home + 15 Delivery + 15 Mixed (Drones, Field Robots)
 *
 * Run: npx tsx scripts/import-robots-wave8.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
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
  consumer: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=400&fit=crop",
  ],
  delivery: [
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&h=400&fit=crop",
  ],
  drone: [
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=400&fit=crop",
  ],
};
const imgC: Record<string, number> = {};
function gi(cat: string): { url: string; alt: string }[] {
  const s = catImgs[cat] || catImgs.consumer;
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
  // Consumer
  { slug: "dyson", name: "Dyson", country: "GB", founded_year: 1991, website: "https://dyson.com" },
  { slug: "labrador-systems", name: "Labrador Systems", country: "US", founded_year: 2017, website: "https://labradorsystems.com" },
  { slug: "samsung-bot", name: "Samsung (Robotics)", country: "KR", founded_year: 1938, website: "https://samsung.com" },
  { slug: "miko", name: "Miko", country: "IN", founded_year: 2015, website: "https://miko.ai" },
  { slug: "digital-dream-labs", name: "Digital Dream Labs", country: "US", founded_year: 2017, website: "https://digitaldreamlabs.com" },
  { slug: "husqvarna-consumer", name: "Husqvarna (Consumer)", country: "SE", founded_year: 1689, website: "https://husqvarna.com" },
  // Delivery
  { slug: "serve-robotics", name: "Serve Robotics", country: "US", founded_year: 2021, website: "https://serverobotics.com" },
  { slug: "starship-technologies", name: "Starship Technologies", country: "US", founded_year: 2014, website: "https://starship.xyz" },
  { slug: "nuro", name: "Nuro", country: "US", founded_year: 2016, website: "https://nuro.ai" },
  { slug: "ottonomy", name: "Ottonomy", country: "US", founded_year: 2020, website: "https://ottonomy.io" },
  { slug: "cartken", name: "Cartken", country: "US", founded_year: 2019, website: "https://cartken.com" },
  { slug: "kiwibot", name: "Kiwibot", country: "US", founded_year: 2017, website: "https://kiwibot.com" },
  { slug: "coco-delivery", name: "Coco", country: "US", founded_year: 2020, website: "https://cocodelivery.com" },
  { slug: "tinymile", name: "TinyMile", country: "CA", founded_year: 2020, website: "https://tinymile.ai" },
  { slug: "udelv", name: "Udelv", country: "US", founded_year: 2016, website: "https://udelv.com" },
  { slug: "gatik", name: "Gatik", country: "US", founded_year: 2017, website: "https://gatik.ai" },
  { slug: "neolix", name: "Neolix", country: "CN", founded_year: 2018, website: "https://neolix.ai" },
  { slug: "waymo", name: "Waymo", country: "US", founded_year: 2009, website: "https://waymo.com" },
];

const robots: R[] = [

  // ═══ CONSUMER/HOME (15) ═══
  {slug:"dyson-360-vis-nav",name:"Dyson 360 Vis Nav",mfr:"dyson",cat:"consumer",price:1200,year:2024,status:"active",desc:"Dyson's flagship robot vacuum with 360-degree vision navigation system. 65 AW suction power, the most powerful robot vacuum. Full-width brush bar and D-shaped design for edge cleaning. Piezo sensor detects microscopic dust.",specs:{suction_aw:65,nav:"360-degree vision SLAM",brush:"Full-width bar",shape:"D-shaped edge cleaning",sensor:"Piezo dust detection"},score:cs({performance:90,reliability:82,ease_of_use:80,intelligence:82,value:70,ecosystem:65,safety:80,design:88}),breakdown:{performance:90,reliability:82,ease_of_use:80,intelligence:82,value:70,ecosystem:65,safety:80,design:88}},
  {slug:"dreame-x30-ultra-consumer",name:"Dreame X30 Ultra",mfr:"dreame",cat:"consumer",price:1600,year:2024,status:"active",desc:"Flagship robot vacuum with extending side mop, 12,000Pa suction, and OmniDirt detection. Hot water mop washing at 70C. ProLeap stair-avoidance. Self-empty, self-wash, self-dry base station.",specs:{suction_pa:12000,mop:"Extending side mop, hot wash 70C",nav:"3D structured light + LiDAR",station:"Self-empty, wash, dry",obstacle:"AI RGB + 3D ToF"},score:cs({performance:90,reliability:82,ease_of_use:86,intelligence:88,value:78,ecosystem:74,safety:80,design:84}),breakdown:{performance:90,reliability:82,ease_of_use:86,intelligence:88,value:78,ecosystem:74,safety:80,design:84}},
  {slug:"narwal-freo-x-ultra-consumer",name:"Narwal Freo X Ultra",mfr:"narwal",cat:"consumer",price:1400,year:2024,status:"active",desc:"Premium robot vacuum and mop with zero-tangling DirtSense brush. Auto mop washing, drying, and detergent dispensing. Side-extending mop for edge-to-edge coverage. 8200Pa suction.",specs:{suction_pa:8200,mop:"Auto-wash, dry, detergent, side-extending",nav:"LiDAR + 3D structured light",dustbin:"Self-empty 4L",brush:"Zero-tangling DirtSense"},score:cs({performance:86,reliability:82,ease_of_use:88,intelligence:84,value:80,ecosystem:72,safety:80,design:82}),breakdown:{performance:86,reliability:82,ease_of_use:88,intelligence:84,value:80,ecosystem:72,safety:80,design:82}},
  {slug:"roborock-s8-maxv-ultra",name:"Roborock S8 MaxV Ultra",mfr:"roborock",cat:"consumer",price:1800,year:2024,status:"active",desc:"Roborock's flagship with dual spinning mop pads and 10,000Pa suction. ReactiveAI 2.0 obstacle avoidance with RGB camera. RockDock Ultra self-empty, self-wash, self-refill, self-dry dock. Hot water mop washing.",specs:{suction_pa:10000,mop:"Dual spinning VibraRise",nav:"LiDAR + ReactiveAI 2.0 camera",dock:"Self-empty, wash, refill, dry",hot_water:true},score:cs({performance:90,reliability:84,ease_of_use:86,intelligence:88,value:76,ecosystem:80,safety:80,design:84}),breakdown:{performance:90,reliability:84,ease_of_use:86,intelligence:88,value:76,ecosystem:80,safety:80,design:84}},
  {slug:"ecovacs-deebot-x5-omni",name:"Ecovacs DEEBOT X5 Omni",mfr:"ecovacs",cat:"consumer",price:1500,year:2025,status:"active",desc:"First D-shaped robot vacuum from Ecovacs for improved edge cleaning. 12,800Pa suction. YIKO 3.0 natural language voice assistant. TruEdge 2.0 adaptive edge mopping. Hot water wash with OZMO Turbo 3.0.",specs:{suction_pa:12800,shape:"D-shaped",mop:"TruEdge 2.0 + OZMO Turbo 3.0",voice:"YIKO 3.0 NLP",nav:"TrueMapping 3.0 LiDAR + AI"},score:cs({performance:90,reliability:82,ease_of_use:88,intelligence:86,value:78,ecosystem:76,safety:80,design:84}),breakdown:{performance:90,reliability:82,ease_of_use:88,intelligence:86,value:78,ecosystem:76,safety:80,design:84}},
  {slug:"samsung-bespoke-jet-bot-ai",name:"Samsung Bespoke Jet Bot AI",mfr:"samsung",cat:"consumer",price:1300,year:2024,status:"active",desc:"Samsung's flagship robot vacuum with AI-powered object recognition using Intel AI chip. LiDAR + 3D sensor navigation. Clean Station self-empty base. SmartThings ecosystem integration.",specs:{suction_pa:7000,nav:"LiDAR + 3D sensor + Intel AI",ai:"Object recognition",dock:"Clean Station self-empty",ecosystem:"SmartThings"},score:cs({performance:82,reliability:82,ease_of_use:84,intelligence:84,value:74,ecosystem:82,safety:80,design:84}),breakdown:{performance:82,reliability:82,ease_of_use:84,intelligence:84,value:74,ecosystem:82,safety:80,design:84}},
  {slug:"lg-cordzero-r5",name:"LG CordZero R5",mfr:"lg-electronics",cat:"consumer",price:800,year:2024,status:"active",desc:"LG's mid-range robot vacuum with dual spin mop. 5000Pa suction. LiDAR navigation. All-in-one tower with auto-empty and mop washing. ThinQ app and voice assistant integration.",specs:{suction_pa:5000,mop:"Dual spin + auto-wash",nav:"LiDAR SLAM",dock:"All-in-one tower",ecosystem:"LG ThinQ"},score:cs({performance:78,reliability:80,ease_of_use:84,intelligence:78,value:82,ecosystem:76,safety:80,design:78}),breakdown:{performance:78,reliability:80,ease_of_use:84,intelligence:78,value:82,ecosystem:76,safety:80,design:78}},
  {slug:"labrador-retriever",name:"Labrador Retriever",mfr:"labrador-systems",cat:"consumer",price:1500,year:2024,status:"active",desc:"Home assistant robot designed for elderly and mobility-impaired users. Autonomous shelf that navigates to carry items between rooms. Fetches and delivers medications, meals, and household items. Voice-controlled.",specs:{type:"Home assistant shelf robot",payload_kg:12,height_cm:90,nav:"LiDAR home mapping",voice:true,users:"Elderly, mobility-impaired"},score:cs({performance:72,reliability:74,ease_of_use:86,intelligence:76,value:70,ecosystem:55,safety:84,design:78}),breakdown:{performance:72,reliability:74,ease_of_use:86,intelligence:76,value:70,ecosystem:55,safety:84,design:78}},
  {slug:"samsung-bot-care",name:"Samsung Bot Care",mfr:"samsung-bot",cat:"consumer",price:null,year:2025,status:"coming_soon",desc:"Personal care companion robot from Samsung. Monitors health indicators, reminds medications, and provides video calling. Falls detection and emergency alerts. Companion for aging-in-place seniors.",specs:{type:"Personal care companion",functions:"Health monitoring, medication reminders, video calls",safety:"Fall detection, emergency alerts",ai:"On-device health AI",target:"Aging-in-place seniors"},score:cs({performance:68,reliability:70,ease_of_use:82,intelligence:78,value:65,ecosystem:75,safety:82,design:80}),breakdown:{performance:68,reliability:70,ease_of_use:82,intelligence:78,value:65,ecosystem:75,safety:82,design:80}},
  {slug:"miko-3",name:"Miko 3 Kids Robot",mfr:"miko",cat:"consumer",price:250,year:2023,status:"active",desc:"AI-powered educational companion robot for children ages 5-12. Adaptive learning curriculum with STEM, storytelling, and emotional intelligence. GPT-powered conversations. 300+ activities and games.",specs:{type:"Educational companion",age_range:"5-12 years",ai:"GPT-powered conversation",activities:"300+ games and lessons",curriculum:"STEM, storytelling, emotional intelligence"},score:cs({performance:72,reliability:74,ease_of_use:88,intelligence:78,value:85,ecosystem:62,safety:82,design:82}),breakdown:{performance:72,reliability:74,ease_of_use:88,intelligence:78,value:85,ecosystem:62,safety:82,design:82}},
  {slug:"anki-vector-2",name:"Anki Vector 2.0",mfr:"digital-dream-labs",cat:"consumer",price:350,year:2024,status:"active",desc:"Revived desktop companion robot with upgraded AI from Digital Dream Labs. Voice-activated assistant with personality. Facial recognition, navigation, and object detection. SDK for developers. Beloved by robotics hobbyists.",specs:{type:"Desktop companion",ai:"Voice AI + personality engine",sensors:"Face recognition, ToF, cliff detect",sdk:true,size:"Compact desktop"},score:cs({performance:62,reliability:65,ease_of_use:82,intelligence:72,value:72,ecosystem:62,safety:78,design:85}),breakdown:{performance:62,reliability:65,ease_of_use:82,intelligence:72,value:72,ecosystem:62,safety:78,design:85}},
  {slug:"skydio-x10",name:"Skydio X10",mfr:"skydio",cat:"consumer",price:null,year:2024,status:"active",desc:"Enterprise autonomy drone with 65-minute flight time. Dual visual and thermal cameras. AI-powered autonomous flight and obstacle avoidance. Designed for inspection, mapping, and public safety. US-manufactured.",specs:{flight_time_min:65,cameras:"Visual + thermal",ai:"Skydio Autonomy Engine",applications:"Inspection, mapping, public safety",manufacturing:"US-made"},score:cs({performance:88,reliability:84,ease_of_use:84,intelligence:90,value:72,ecosystem:72,safety:84,design:82}),breakdown:{performance:88,reliability:84,ease_of_use:84,intelligence:90,value:72,ecosystem:72,safety:84,design:82}},
  {slug:"husqvarna-ceora",name:"Husqvarna CEORA",mfr:"husqvarna-consumer",cat:"consumer",price:null,year:2024,status:"active",desc:"Professional autonomous mowing system for sports fields and large commercial areas. EPOS satellite navigation for precise mowing patterns. Covers up to 50,000 sqm. Stripe-pattern mowing for professional finish.",specs:{type:"Professional autonomous mower",coverage_sqm:50000,nav:"EPOS satellite RTK",patterns:"Stripe professional finish",target:"Sports fields, commercial"},score:cs({performance:86,reliability:84,ease_of_use:78,intelligence:80,value:72,ecosystem:74,safety:82,design:78}),breakdown:{performance:86,reliability:84,ease_of_use:78,intelligence:80,value:72,ecosystem:74,safety:82,design:78}},
  {slug:"husqvarna-450x-nera",name:"Husqvarna 450X NERA",mfr:"husqvarna-consumer",cat:"consumer",price:3500,year:2024,status:"active",desc:"Premium residential robotic mower with satellite navigation. No boundary wire needed. EPOS for virtual boundaries. Handles slopes up to 45%. Smart home integration. 5000 sqm coverage.",specs:{coverage_sqm:5000,nav:"EPOS satellite + RTK",slope:"45% grade",wire_free:true,smart_home:true},score:cs({performance:84,reliability:82,ease_of_use:84,intelligence:82,value:74,ecosystem:76,safety:82,design:80}),breakdown:{performance:84,reliability:82,ease_of_use:84,intelligence:82,value:74,ecosystem:76,safety:82,design:80}},
  {slug:"switchbot-k10-plus-pro",name:"SwitchBot K10+ Pro",mfr:"switchbot",cat:"consumer",price:400,year:2024,status:"active",desc:"World's smallest robot vacuum at 24.8cm diameter. Fits under furniture other robots cannot reach. 3000Pa suction. Self-empty base station. SwitchBot smart home ecosystem integration. Ideal for small apartments.",specs:{diameter_cm:24.8,suction_pa:3000,nav:"LiDAR SLAM",dock:"Self-empty mini station",size:"Smallest robot vacuum",ecosystem:"SwitchBot smart home"},score:cs({performance:72,reliability:76,ease_of_use:86,intelligence:74,value:86,ecosystem:72,safety:80,design:84}),breakdown:{performance:72,reliability:76,ease_of_use:86,intelligence:74,value:86,ecosystem:72,safety:80,design:84}},

  // ═══ DELIVERY (15) ═══
  {slug:"serve-robotics-gen3",name:"Serve Robotics Gen3",mfr:"serve-robotics",cat:"delivery",price:null,year:2025,status:"active",desc:"Third-generation sidewalk delivery robot from Uber spinoff. Level 4 autonomous navigation. 50 lbs cargo capacity. Active thermal compartments for hot and cold items. Deployed with Uber Eats in Los Angeles. Nvidia-backed.",specs:{autonomy:"Level 4",payload_lbs:50,compartments:"Hot + cold thermal",partner:"Uber Eats",city:"Los Angeles",backer:"Nvidia"},score:cs({performance:82,reliability:78,ease_of_use:84,intelligence:84,value:76,ecosystem:72,safety:82,design:80}),breakdown:{performance:82,reliability:78,ease_of_use:84,intelligence:84,value:76,ecosystem:72,safety:82,design:80}},
  {slug:"starship-gen4",name:"Starship Gen4",mfr:"starship-technologies",cat:"delivery",price:null,year:2024,status:"active",desc:"Fourth-generation last-mile delivery robot. 6 million+ commercial deliveries completed. Operates on college campuses and suburbs across US and Europe. 20 lbs payload. 4 mph sidewalk speed. Most deployed delivery robot.",specs:{deliveries:"6M+ completed",payload_lbs:20,speed_mph:4,terrain:"Sidewalks",deployments:"US + Europe campuses"},score:cs({performance:80,reliability:82,ease_of_use:86,intelligence:80,value:82,ecosystem:78,safety:84,design:76}),breakdown:{performance:80,reliability:82,ease_of_use:86,intelligence:80,value:82,ecosystem:78,safety:84,design:76}},
  {slug:"nuro-r3",name:"Nuro R3",mfr:"nuro",cat:"delivery",price:null,year:2025,status:"coming_soon",desc:"Third-generation autonomous delivery vehicle designed from scratch for goods delivery. No passenger cabin. FMVSS exemption from NHTSA. 500 lbs cargo capacity. 45 mph max speed. Partnership with FedEx, Kroger, Dominos.",specs:{payload_lbs:500,speed_mph:45,autonomy:"Full autonomous L4",cabin:"No passenger cabin",partners:"FedEx, Kroger, Dominos",fmvss:"NHTSA exemption"},score:cs({performance:86,reliability:78,ease_of_use:82,intelligence:88,value:72,ecosystem:75,safety:86,design:82}),breakdown:{performance:86,reliability:78,ease_of_use:82,intelligence:88,value:72,ecosystem:75,safety:86,design:82}},
  {slug:"ottonomy-ottobot-2",name:"Ottonomy Ottobot 2.0",mfr:"ottonomy",cat:"delivery",price:null,year:2024,status:"active",desc:"Indoor/outdoor delivery robot for airports, hospitals, and campuses. UV-C sanitized compartments. Deployed at Rome airport, Cincinnati airport, and university campuses. Elevator integration for multi-floor delivery.",specs:{type:"Indoor/outdoor delivery",compartments:"UV-C sanitized",deployments:"Airports, hospitals, campuses",elevator:true,nav:"Multi-environment SLAM"},score:cs({performance:76,reliability:76,ease_of_use:82,intelligence:78,value:76,ecosystem:65,safety:82,design:76}),breakdown:{performance:76,reliability:76,ease_of_use:82,intelligence:78,value:76,ecosystem:65,safety:82,design:76}},
  {slug:"cartken-model-c",name:"Cartken Model C",mfr:"cartken",cat:"delivery",price:null,year:2024,status:"active",desc:"Compact sidewalk delivery robot with AI-first design. Used by Grubhub and REEF Technology. Operates on college campuses and urban sidewalks. Modular cargo bay for food, groceries, and packages.",specs:{type:"Sidewalk delivery",partners:"Grubhub, REEF",cargo:"Modular bay",nav:"AI vision SLAM",terrain:"Sidewalks, campuses"},score:cs({performance:76,reliability:76,ease_of_use:82,intelligence:80,value:78,ecosystem:68,safety:82,design:76}),breakdown:{performance:76,reliability:76,ease_of_use:82,intelligence:80,value:78,ecosystem:68,safety:82,design:76}},
  {slug:"kiwibot-s3",name:"Kiwibot S3",mfr:"kiwibot",cat:"delivery",price:null,year:2024,status:"active",desc:"Third-generation campus delivery robot with expressive LED face. Used on 20+ college campuses through Sodexo partnership. Hot and cold compartments. Semi-autonomous with remote supervision. Affordable unit economics.",specs:{type:"Campus delivery",campuses:"20+",partner:"Sodexo",compartments:"Hot + cold",face:"Expressive LED",supervision:"Semi-autonomous remote"},score:cs({performance:74,reliability:74,ease_of_use:84,intelligence:74,value:82,ecosystem:65,safety:80,design:80}),breakdown:{performance:74,reliability:74,ease_of_use:84,intelligence:74,value:82,ecosystem:65,safety:80,design:80}},
  {slug:"coco-2",name:"Coco 2",mfr:"coco-delivery",cat:"delivery",price:null,year:2024,status:"active",desc:"Remote-operated delivery robot for restaurant last-mile in Los Angeles. Human teleoperators assist AI navigation. 500,000+ deliveries. Partners with DoorDash, Uber Eats, and local restaurants. 30 lbs payload.",specs:{payload_lbs:30,operation:"Remote-operated + AI",deliveries:"500K+",partners:"DoorDash, Uber Eats",city:"Los Angeles"},score:cs({performance:76,reliability:78,ease_of_use:82,intelligence:74,value:80,ecosystem:68,safety:82,design:76}),breakdown:{performance:76,reliability:78,ease_of_use:82,intelligence:74,value:80,ecosystem:68,safety:82,design:76}},
  {slug:"tinymile-tm3",name:"TinyMile TM3",mfr:"tinymile",cat:"delivery",price:null,year:2024,status:"active",desc:"Canadian sidewalk delivery robot with cute face display. Operates in Toronto and expanding. Restaurant food delivery with insulated compartments. AI navigation with remote operator backup.",specs:{type:"Sidewalk delivery",city:"Toronto",compartments:"Insulated food",face:"Cute display",nav:"AI + remote backup"},score:cs({performance:72,reliability:72,ease_of_use:82,intelligence:74,value:78,ecosystem:58,safety:80,design:78}),breakdown:{performance:72,reliability:72,ease_of_use:82,intelligence:74,value:78,ecosystem:58,safety:80,design:78}},
  {slug:"udelv-transporter",name:"Udelv Transporter",mfr:"udelv",cat:"delivery",price:null,year:2025,status:"coming_soon",desc:"Multi-stop autonomous delivery vehicle with 32 separate compartments. Each compartment individually accessible by recipients. Level 4 Mobileye Drive autonomous platform. Designed for multi-stop grocery and package routes.",specs:{compartments:32,autonomy:"Level 4 Mobileye Drive",type:"Multi-stop autonomous van",applications:"Grocery, package delivery",access:"Individual compartment unlock"},score:cs({performance:82,reliability:74,ease_of_use:80,intelligence:84,value:72,ecosystem:68,safety:84,design:78}),breakdown:{performance:82,reliability:74,ease_of_use:80,intelligence:84,value:72,ecosystem:68,safety:84,design:78}},
  {slug:"gatik-b1",name:"Gatik B1",mfr:"gatik",cat:"delivery",price:null,year:2024,status:"active",desc:"Autonomous middle-mile delivery truck. Class 3-6 box trucks operating fixed routes between stores and warehouses. Fully driverless (no safety driver) operations for Walmart and Loblaw. 10+ markets.",specs:{type:"Middle-mile autonomous truck",class:"Class 3-6",driverless:true,clients:"Walmart, Loblaw",markets:"10+",route:"Fixed B2B routes"},score:cs({performance:84,reliability:80,ease_of_use:78,intelligence:86,value:78,ecosystem:72,safety:86,design:72}),breakdown:{performance:84,reliability:80,ease_of_use:78,intelligence:86,value:78,ecosystem:72,safety:86,design:72}},
  {slug:"neolix-x3",name:"Neolix X3",mfr:"neolix",cat:"delivery",price:null,year:2024,status:"active",desc:"Chinese autonomous delivery vehicle for urban and campus environments. 100kg cargo capacity. Temperature-controlled compartments. 3000+ units deployed across China. Used for food, package, and retail delivery.",specs:{payload_kg:100,units_deployed:"3000+",compartments:"Temperature-controlled",speed_kmh:25,applications:"Food, package, retail"},score:cs({performance:78,reliability:76,ease_of_use:78,intelligence:78,value:80,ecosystem:68,safety:80,design:74}),breakdown:{performance:78,reliability:76,ease_of_use:78,intelligence:78,value:80,ecosystem:68,safety:80,design:74}},
  {slug:"refraction-ai-rev1",name:"Refraction AI REV-1",mfr:"refraction-ai",cat:"delivery",price:null,year:2024,status:"active",desc:"Lightweight delivery robot that travels in bike lanes instead of sidewalks. Three-wheeled design at bicycle speed. 50 lbs cargo. University of Michigan spinout. Lower regulatory burden by using bike infrastructure.",specs:{type:"Bike lane delivery",wheels:3,payload_lbs:50,lane:"Bike lanes",speed_mph:15,origin:"University of Michigan"},score:cs({performance:74,reliability:72,ease_of_use:78,intelligence:76,value:80,ecosystem:55,safety:78,design:76}),breakdown:{performance:74,reliability:72,ease_of_use:78,intelligence:76,value:80,ecosystem:55,safety:78,design:76}},
  {slug:"amazon-scout-v2",name:"Amazon Scout V2",mfr:"amazon-scout",cat:"delivery",price:null,year:2024,status:"discontinued",desc:"Amazon's sidewalk delivery robot program. Six-wheeled cooler-sized robot for last-mile package delivery. Tested in multiple US neighborhoods. Program paused in 2022, technology integrated into other Amazon robotics.",specs:{type:"Sidewalk package delivery",wheels:6,size:"Cooler-sized",status:"Program paused 2022",tech:"Integrated into Amazon robotics"},score:cs({performance:72,reliability:68,ease_of_use:78,intelligence:76,value:65,ecosystem:75,safety:80,design:72}),breakdown:{performance:72,reliability:68,ease_of_use:78,intelligence:76,value:65,ecosystem:75,safety:80,design:72}},
  {slug:"fedex-roxo-2",name:"FedEx Roxo 2",mfr:"fedex-robotics",cat:"delivery",price:null,year:2024,status:"active",desc:"FedEx autonomous delivery robot for same-day local deliveries. Navigates sidewalks and roads. Partnerships with AutoZone, Pizza Hut, and Walmart. Updated second generation with improved autonomy and payload.",specs:{type:"Same-day local delivery",partners:"AutoZone, Pizza Hut, Walmart",terrain:"Sidewalks and roads",autonomy:"Enhanced L4",generation:"Second gen"},score:cs({performance:78,reliability:76,ease_of_use:80,intelligence:80,value:74,ecosystem:72,safety:82,design:74}),breakdown:{performance:78,reliability:76,ease_of_use:80,intelligence:80,value:74,ecosystem:72,safety:82,design:74}},
  {slug:"waymo-driver-delivery",name:"Waymo Driver Delivery",mfr:"waymo",cat:"delivery",price:null,year:2025,status:"active",desc:"Waymo's autonomous driving technology applied to goods delivery. Jaguar I-PACE and Freightliner platforms for local and long-haul delivery. Partnership with UPS, AutoNation, and Uber Freight. Most experienced autonomous miles.",specs:{type:"Autonomous vehicle delivery",platforms:"Jaguar I-PACE, Freightliner",partners:"UPS, AutoNation, Uber Freight",miles:"Millions of autonomous miles",modes:"Local and long-haul"},score:cs({performance:90,reliability:84,ease_of_use:76,intelligence:92,value:68,ecosystem:80,safety:88,design:78}),breakdown:{performance:90,reliability:84,ease_of_use:76,intelligence:92,value:68,ecosystem:80,safety:88,design:78}},

  // ═══ MIXED: DRONES + FIELD ROBOTS (15) ═══
  {slug:"dji-agras-t50",name:"DJI Agras T50",mfr:"dji",cat:"drone",price:18000,year:2024,status:"active",desc:"Professional agricultural drone for spraying and spreading. 40kg payload for liquid or granule. 50L spray tank. Dual atomized spraying system. AI terrain following and obstacle avoidance. RTK precision.",specs:{payload_kg:40,tank_l:50,spray:"Dual atomized",nav:"RTK + AI terrain follow",obstacle_avoidance:true,type:"Agricultural spray drone"},score:cs({performance:88,reliability:84,ease_of_use:80,intelligence:84,value:80,ecosystem:82,safety:82,design:80}),breakdown:{performance:88,reliability:84,ease_of_use:80,intelligence:84,value:80,ecosystem:82,safety:82,design:80}},
  {slug:"dji-matrice-350-rtk",name:"DJI Matrice 350 RTK",mfr:"dji",cat:"drone",price:13000,year:2023,status:"active",desc:"Enterprise flagship drone for mapping, inspection, and search-and-rescue. 55-minute flight time. IP55 all-weather. Modular payload system supports thermal, LiDAR, and multispectral cameras. O3 Enterprise transmission.",specs:{flight_time_min:55,ip_rating:"IP55",payload_kg:2.7,cameras:"Thermal, LiDAR, multispectral",transmission:"O3 Enterprise",max_wind_ms:15},score:cs({performance:90,reliability:88,ease_of_use:82,intelligence:82,value:80,ecosystem:88,safety:84,design:82}),breakdown:{performance:90,reliability:88,ease_of_use:82,intelligence:82,value:80,ecosystem:88,safety:84,design:82}},
  {slug:"dji-dock-2",name:"DJI Dock 2",mfr:"dji",cat:"drone",price:null,year:2024,status:"active",desc:"Automated drone-in-a-box solution for remote operations. Launches, flies, and recovers Matrice 3D drones autonomously. Weather-resistant dock with active temperature control. Cloud-managed via FlightHub 2.",specs:{type:"Drone-in-a-box",drone:"Matrice 3D",autonomy:"Full launch/fly/recover",cloud:"FlightHub 2",weather:"Active temp control"},score:cs({performance:86,reliability:82,ease_of_use:84,intelligence:84,value:76,ecosystem:85,safety:82,design:80}),breakdown:{performance:86,reliability:82,ease_of_use:84,intelligence:84,value:76,ecosystem:85,safety:82,design:80}},
  {slug:"autel-evo-max-4t",name:"Autel EVO Max 4T",mfr:"autel-robotics",cat:"drone",price:9000,year:2024,status:"active",desc:"Multi-sensor enterprise drone with 4 camera payloads. Wide, zoom, thermal, and laser rangefinder. 42-minute flight time. IP43 weather resistance. 3D obstacle avoidance on all sides. US-assembled alternative to DJI.",specs:{flight_time_min:42,cameras:"Wide + zoom + thermal + laser",ip_rating:"IP43",obstacle:"3D omnidirectional",origin:"US-assembled"},score:cs({performance:84,reliability:82,ease_of_use:80,intelligence:82,value:82,ecosystem:72,safety:82,design:80}),breakdown:{performance:84,reliability:82,ease_of_use:80,intelligence:82,value:82,ecosystem:72,safety:82,design:80}},
  {slug:"freefly-astro",name:"FreeFly Astro",mfr:"freefly-systems",cat:"drone",price:14000,year:2024,status:"active",desc:"US-made mapping and inspection drone. 47-minute flight time. Designed for LiDAR and photogrammetry missions. IP44 weather rating. Open ecosystem supports third-party payloads. Popular with survey professionals.",specs:{flight_time_min:47,payload_kg:1.6,ip_rating:"IP44",applications:"LiDAR, photogrammetry",origin:"US-made",open_ecosystem:true},score:cs({performance:82,reliability:82,ease_of_use:78,intelligence:78,value:76,ecosystem:70,safety:82,design:78}),breakdown:{performance:82,reliability:82,ease_of_use:78,intelligence:78,value:76,ecosystem:70,safety:82,design:78}},
  {slug:"wing-delivery-drone",name:"Wing Delivery Drone",mfr:"wing-alphabet",cat:"drone",price:null,year:2024,status:"active",desc:"Alphabet's drone delivery service operating in Dallas-Fort Worth, Australia, and Finland. 350,000+ commercial deliveries. Hovers and lowers packages on a tether. FAA Part 135 air carrier certificate. 10-minute average delivery.",specs:{type:"Delivery drone",deliveries:"350K+ commercial",method:"Hover and tether lower",delivery_time_min:10,faa:"Part 135 air carrier",markets:"US, Australia, Finland"},score:cs({performance:84,reliability:80,ease_of_use:84,intelligence:84,value:78,ecosystem:72,safety:84,design:78}),breakdown:{performance:84,reliability:80,ease_of_use:84,intelligence:84,value:78,ecosystem:72,safety:84,design:78}},
  {slug:"zipline-p2-zip",name:"Zipline P2 Zip",mfr:"zipline",cat:"drone",price:null,year:2024,status:"active",desc:"Platform 2 delivery drone with precision hover-and-lower delivery system. Delivers to areas as small as a parking space. Used for medical supplies, food, and retail. Operating in 8 countries with 1M+ deliveries.",specs:{type:"Precision delivery drone",deliveries:"1M+",countries:8,precision:"Parking space landing zone",payload_lbs:8,speed_mph:70},score:cs({performance:86,reliability:82,ease_of_use:82,intelligence:86,value:80,ecosystem:72,safety:84,design:80}),breakdown:{performance:86,reliability:82,ease_of_use:82,intelligence:86,value:80,ecosystem:72,safety:84,design:80}},
  {slug:"flyability-elios-3",name:"Flyability ELIOS 3",mfr:"flyability",cat:"drone",price:null,year:2024,status:"active",desc:"Indoor inspection drone with protective cage for confined space operations. LiDAR SLAM for GPS-denied environments. Inspects boilers, tanks, sewers, and mines. 3D mapping in real-time. IP43 rated.",specs:{type:"Indoor caged inspection drone",cage:"Protective collision cage",lidar:"SLAM GPS-denied",applications:"Boilers, tanks, mines, sewers",mapping:"Real-time 3D"},score:cs({performance:82,reliability:80,ease_of_use:82,intelligence:82,value:74,ecosystem:68,safety:88,design:80}),breakdown:{performance:82,reliability:80,ease_of_use:82,intelligence:82,value:74,ecosystem:68,safety:88,design:80}},
  {slug:"clearpath-husky-a300",name:"Clearpath Husky A300",mfr:"clearpath-robotics",cat:"drone",price:30000,year:2024,status:"active",desc:"Rugged outdoor UGV platform for research, inspection, and agriculture. All-terrain 4WD with 75kg payload. ROS2 native. Modular sensor mounting. Used by 500+ universities and research labs worldwide.",specs:{type:"Outdoor UGV platform",payload_kg:75,drive:"All-terrain 4WD",ros2:true,users:"500+ universities",battery_hrs:3},score:cs({performance:80,reliability:82,ease_of_use:76,intelligence:74,value:72,ecosystem:80,safety:82,design:74}),breakdown:{performance:80,reliability:82,ease_of_use:76,intelligence:74,value:72,ecosystem:80,safety:82,design:74}},
  {slug:"clearpath-jackal",name:"Clearpath Jackal",mfr:"clearpath-robotics",cat:"drone",price:20000,year:2023,status:"active",desc:"Compact outdoor research UGV. 20kg payload on 4WD weatherproof platform. ROS native with pre-integrated sensors. Popular platform for autonomous navigation research. Quick deployment for field robotics.",specs:{type:"Compact outdoor UGV",payload_kg:20,drive:"4WD weatherproof",ros:true,weight_kg:17,battery_hrs:4},score:cs({performance:76,reliability:80,ease_of_use:80,intelligence:72,value:76,ecosystem:80,safety:80,design:74}),breakdown:{performance:76,reliability:80,ease_of_use:80,intelligence:72,value:76,ecosystem:80,safety:80,design:74}},
  {slug:"boston-dynamics-spot-ag",name:"Boston Dynamics Spot (Agriculture)",mfr:"boston-dynamics",cat:"drone",price:74500,year:2024,status:"active",desc:"Spot quadruped adapted for agricultural inspection and monitoring. Traverses uneven terrain, orchards, and vineyards. Equipped with multispectral cameras for crop health assessment. Autonomous waypoint navigation.",specs:{height_cm:84,weight_kg:32,payload_kg:14,terrain:"Orchards, vineyards, fields",cameras:"Multispectral crop health",nav:"Autonomous waypoints",ip_rating:"IP54"},score:cs({performance:86,reliability:86,ease_of_use:78,intelligence:84,value:65,ecosystem:82,safety:88,design:88}),breakdown:{performance:86,reliability:86,ease_of_use:78,intelligence:84,value:65,ecosystem:82,safety:88,design:88}},
  {slug:"ghost-robotics-vision-60",name:"Ghost Robotics Vision 60",mfr:"ghost-robotics",cat:"drone",price:null,year:2024,status:"active",desc:"Military-grade quadruped for perimeter security and reconnaissance. Operates in extreme environments. Modular payload system for sensors and communications. US military and border patrol deployments.",specs:{type:"Military quadruped",weight_kg:51,payload_kg:10,battery_hrs:3,terrain:"All-terrain extreme",applications:"Security, recon, patrol",military:true},score:cs({performance:82,reliability:80,ease_of_use:68,intelligence:76,value:62,ecosystem:62,safety:82,design:74}),breakdown:{performance:82,reliability:80,ease_of_use:68,intelligence:76,value:62,ecosystem:62,safety:82,design:74}},
  {slug:"anybotics-anymal-d",name:"ANYbotics ANYmal D",mfr:"anybotics",cat:"drone",price:null,year:2024,status:"active",desc:"Industrial inspection quadruped robot for hazardous environments. ATEX/IECEx certified for explosive atmospheres. Autonomous patrol routes through oil rigs, power plants, and chemical facilities. Thermal and acoustic anomaly detection.",specs:{type:"Industrial quadruped",certifications:"ATEX/IECEx",applications:"Oil rigs, power plants, chemical",sensors:"Thermal + acoustic anomaly",autonomy:"Scheduled patrol routes",ip_rating:"IP67"},score:cs({performance:86,reliability:84,ease_of_use:78,intelligence:84,value:68,ecosystem:70,safety:90,design:80}),breakdown:{performance:86,reliability:84,ease_of_use:78,intelligence:84,value:68,ecosystem:70,safety:90,design:80}},
  {slug:"agility-digit-field",name:"Agility Digit (Field)",mfr:"agility-robotics",cat:"drone",price:null,year:2024,status:"active",desc:"Bipedal robot adapted for outdoor field operations including construction site inspection, agricultural monitoring, and utility maintenance. Walks on unstructured terrain. Camera and sensor payload for data collection.",specs:{type:"Bipedal field robot",terrain:"Unstructured outdoor",applications:"Construction, ag, utility",payload_kg:16,nav:"Vision + LiDAR SLAM",locomotion:"Bipedal walking"},score:cs({performance:78,reliability:74,ease_of_use:72,intelligence:78,value:65,ecosystem:68,safety:78,design:80}),breakdown:{performance:78,reliability:74,ease_of_use:72,intelligence:78,value:65,ecosystem:68,safety:78,design:80}},
  {slug:"terra-drone-terra-lidar",name:"Terra Drone Terra LiDAR",mfr:"terra-drone",cat:"drone",price:null,year:2024,status:"active",desc:"Professional LiDAR mapping drone system for surveying and construction. High-density point cloud capture. Multi-platform compatible. Used in mining, construction, and environmental monitoring. Global operations in 25+ countries.",specs:{type:"LiDAR mapping drone",point_density:"High-density",applications:"Mining, construction, environmental",countries:"25+",output:"Point cloud + ortho + DEM"},score:cs({performance:84,reliability:82,ease_of_use:76,intelligence:80,value:76,ecosystem:72,safety:82,design:76}),breakdown:{performance:84,reliability:82,ease_of_use:76,intelligence:80,value:76,ecosystem:72,safety:82,design:76}},
];

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Robotomated — Wave 8 Import: 45 New Robots");
  console.log("  15 Consumer + 15 Delivery + 15 Mixed");
  console.log("═══════════════════════════════════════════════════\n");

  const { data: cats } = await sb.from("robot_categories").select("id, slug");
  const catMap = new Map<string, string>();
  for (const c of cats || []) catMap.set(c.slug, c.id);
  console.log(`Categories: ${catMap.size}\n`);

  const { data: existingMfrs } = await sb.from("manufacturers").select("id, slug");
  const mfrMap = new Map<string, string>();
  for (const m of existingMfrs || []) mfrMap.set(m.slug, m.id);

  let mfrsCreated = 0;
  for (const mfr of newMfrs) {
    if (mfrMap.has(mfr.slug)) continue;
    const { data, error } = await sb.from("manufacturers").insert({
      slug: mfr.slug, name: mfr.name, country: mfr.country,
      founded_year: mfr.founded_year, website: mfr.website, verified: true,
    }).select("id").single();
    if (error) { console.error(`  Mfr ${mfr.slug}: ${error.message}`); continue; }
    mfrMap.set(mfr.slug, data!.id);
    mfrsCreated++;
  }
  console.log(`Manufacturers: ${mfrsCreated} new, ${mfrMap.size} total\n`);

  let inserted = 0, skipped = 0, errored = 0;
  for (const r of robots) {
    const { data: existing } = await sb.from("robots").select("id").eq("slug", r.slug).single();
    if (existing) { skipped++; continue; }

    const mfrId = mfrMap.get(r.mfr);
    const catId = catMap.get(r.cat);
    if (!mfrId) { console.error(`  ${r.slug}: mfr "${r.mfr}" not found`); errored++; continue; }
    if (!catId) { console.error(`  ${r.slug}: cat "${r.cat}" not found`); errored++; continue; }

    const { error } = await sb.from("robots").insert({
      slug: r.slug, name: r.name, manufacturer_id: mfrId, category_id: catId,
      price_msrp: r.price, price_current: r.price, year_released: r.year,
      status: r.status as "active" | "discontinued" | "coming_soon",
      description_short: r.desc, specs: r.specs, images: gi(r.cat),
      robo_score: r.score > 0 ? r.score : null,
      score_breakdown: r.score > 0 ? r.breakdown : null,
      affiliate_url: null,
    });

    if (error) { console.error(`  ${r.slug}: ${error.message}`); errored++; }
    else {
      inserted++;
      if (inserted % 10 === 0) process.stdout.write(`  ${inserted} inserted...\n`);
    }
  }

  const { count } = await sb.from("robots").select("*", { count: "exact", head: true });

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Wave 8 Import Summary`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  Manufacturers: ${mfrsCreated} new`);
  console.log(`  Robots:        ${inserted} inserted, ${skipped} skipped, ${errored} errors`);
  console.log(`  Total in DB:   ${count}`);
  console.log(`${"=".repeat(50)}`);
}

main().catch(console.error);
