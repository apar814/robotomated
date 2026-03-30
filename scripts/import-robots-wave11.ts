/**
 * Robotomated — Wave 11 Robot Import: 50 New Robots
 * Space & Underwater categories.
 * Covers: space exploration, satellite servicing, orbital ops,
 *   ROVs, AUVs, submersibles, ocean operations.
 *
 * Run: npx tsx scripts/import-robots-wave11.ts
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
  space: ["https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&h=400&fit=crop"],
  underwater: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"],
};
const imgC: Record<string, number> = {};
function gi(cat: string): { url: string; alt: string }[] {
  const s = catImgs[cat] || catImgs.space;
  const i = imgC[cat] || 0; imgC[cat] = i + 1;
  return [{ url: s[i % s.length], alt: `${cat} robot` }];
}

interface R {
  slug: string; name: string; mfr: string; cat: string;
  price: number | null; year: number; status: string;
  desc: string; specs: Record<string, unknown>;
  score: number; breakdown: Record<string, number>;
}

// ── New categories ──
const newCategories = [
  { slug: "space", name: "Space Robotics", description: "Robots for space exploration, satellite servicing, and orbital operations" },
  { slug: "underwater", name: "Underwater & Marine", description: "ROVs, AUVs, and submersible robots for ocean operations" },
];

// ── New manufacturers ──
const newMfrs = [
  // Space
  { slug: "nasa-jpl", name: "NASA JPL", country: "US", founded_year: 1936, website: "https://jpl.nasa.gov" },
  { slug: "spacex", name: "SpaceX", country: "US", founded_year: 2002, website: "https://spacex.com" },
  { slug: "gitai", name: "Gitai", country: "JP", founded_year: 2016, website: "https://gitai.tech" },
  { slug: "astrobotic", name: "Astrobotic", country: "US", founded_year: 2007, website: "https://astrobotic.com" },
  { slug: "motiv-space-systems", name: "Motiv Space Systems", country: "US", founded_year: 2014, website: "https://motivss.com" },
  { slug: "maxar-technologies", name: "Maxar Technologies", country: "US", founded_year: 2017, website: "https://maxar.com" },
  // Underwater
  { slug: "oceaneering", name: "Oceaneering", country: "US", founded_year: 1964, website: "https://oceaneering.com" },
  { slug: "saab-seaeye", name: "Saab Seaeye", country: "SE", founded_year: 1986, website: "https://saabseaeye.com" },
  { slug: "eca-group", name: "ECA Group", country: "FR", founded_year: 1936, website: "https://ecagroup.com" },
  { slug: "forum-energy", name: "Forum Energy", country: "GB", founded_year: 2007, website: "https://f-e-t.com" },
  { slug: "videoray", name: "VideoRay", country: "US", founded_year: 1999, website: "https://videoray.com" },
  { slug: "blue-robotics", name: "Blue Robotics", country: "US", founded_year: 2014, website: "https://bluerobotics.com" },
  { slug: "deep-trekker", name: "Deep Trekker", country: "CA", founded_year: 2010, website: "https://deeptrekker.com" },
];

// ═══════════════════════════════════════════════════════════════
// ALL ROBOTS — 50 new entries
// ═══════════════════════════════════════════════════════════════
const robots: R[] = [

  // ═══ SPACE (25) ═══
  {slug:"nasa-perseverance",name:"NASA Perseverance",mfr:"nasa-jpl",cat:"space",price:2700000000,year:2020,status:"active",desc:"Mars rover conducting astrobiology research in Jezero Crater. Equipped with SHERLOC, PIXL, and SuperCam instruments. Collects and caches rock samples for future Earth return. Carries Ingenuity helicopter.",specs:{mass_kg:1025,dimensions:"3m x 2.7m x 2.2m",power:"Multi-Mission RTG 110W",instruments:7,cameras:23,wheels:6,top_speed_cmps:4.2,mission:"Mars Sample Return cache"},score:cs({performance:90,reliability:88,ease_of_use:60,intelligence:88,value:72,ecosystem:85,safety:90,design:85}),breakdown:{performance:90,reliability:88,ease_of_use:60,intelligence:88,value:72,ecosystem:85,safety:90,design:85}},
  {slug:"nasa-ingenuity",name:"NASA Ingenuity",mfr:"nasa-jpl",cat:"space",price:85000000,year:2021,status:"active",desc:"First powered aircraft to fly on another planet. Originally a 5-flight technology demo, completed 72 flights over 3 years on Mars. Proved aerial scouting viable for planetary exploration.",specs:{mass_kg:1.8,rotor_diameter_m:1.2,rotors:2,max_altitude_m:24,max_speed_ms:10,flights_completed:72,power:"Solar + lithium-ion"},score:cs({performance:88,reliability:82,ease_of_use:55,intelligence:80,value:85,ecosystem:70,safety:85,design:82}),breakdown:{performance:88,reliability:82,ease_of_use:55,intelligence:80,value:85,ecosystem:70,safety:85,design:82}},
  {slug:"nasa-viper",name:"NASA VIPER",mfr:"nasa-jpl",cat:"space",price:433000000,year:2024,status:"coming_soon",desc:"Volatiles Investigating Polar Exploration Rover. Will prospect for water ice at the lunar south pole. 100-day mission to map water resources for future Artemis astronaut use.",specs:{mass_kg:430,dimensions:"1.5m x 1.5m x 2.5m",power:"Solar arrays",instruments:4,mission_days:100,target:"Lunar south pole water ice",wheels:4},score:cs({performance:82,reliability:78,ease_of_use:58,intelligence:85,value:75,ecosystem:80,safety:85,design:75}),breakdown:{performance:82,reliability:78,ease_of_use:58,intelligence:85,value:75,ecosystem:80,safety:85,design:75}},
  {slug:"nasa-lemur",name:"NASA LEMUR",mfr:"nasa-jpl",cat:"space",price:null,year:2020,status:"active",desc:"Limbed Excursion Mechanical Utility Robot with climbing capability. Uses hundreds of tiny fishhook grippers to scale rock walls. Technology spinoffs include ice-climbing and asteroid-gripping robots.",specs:{limbs:4,grippers:"Micro-spine arrays",climbing:"Vertical rock faces",mass_kg:5,applications:"Cliff science, spacecraft inspection",ai:"Autonomous route planning"},score:cs({performance:75,reliability:72,ease_of_use:50,intelligence:82,value:70,ecosystem:65,safety:78,design:72}),breakdown:{performance:75,reliability:72,ease_of_use:50,intelligence:82,value:70,ecosystem:65,safety:78,design:72}},
  {slug:"nasa-robonaut-2",name:"NASA Robonaut 2",mfr:"nasa-jpl",cat:"space",price:2500000,year:2011,status:"active",desc:"Humanoid robot designed for ISS operations. Dexterous hands can use same tools as astronauts. First humanoid robot in space. Assists with repetitive and dangerous tasks aboard the station.",specs:{height_cm:100,dof:42,hand_dof:12,force_sensing:true,mass_kg:150,location:"ISS",tasks:"Tool use, maintenance, experiments"},score:cs({performance:72,reliability:70,ease_of_use:55,intelligence:75,value:68,ecosystem:72,safety:80,design:78}),breakdown:{performance:72,reliability:70,ease_of_use:55,intelligence:75,value:68,ecosystem:72,safety:80,design:78}},
  {slug:"nasa-valkyrie",name:"NASA Valkyrie",mfr:"nasa-jpl",cat:"space",price:2000000,year:2013,status:"active",desc:"Full-size humanoid robot designed for disaster response and space exploration. 44 degrees of freedom. Intended for pre-deployment to Mars or lunar habitats before human arrival.",specs:{height_cm:188,mass_kg:125,dof:44,actuators:"Series elastic",power:"Battery 2kWh",sensors:"LiDAR, cameras, IMU, force/torque",application:"Disaster response, space pre-deployment"},score:cs({performance:74,reliability:68,ease_of_use:52,intelligence:78,value:65,ecosystem:70,safety:75,design:80}),breakdown:{performance:74,reliability:68,ease_of_use:52,intelligence:78,value:65,ecosystem:70,safety:75,design:80}},
  {slug:"gitai-s2",name:"GITAI S2",mfr:"gitai",cat:"space",price:500000,year:2025,status:"coming_soon",desc:"Autonomous robotic system for space station maintenance and assembly. Demonstrated in-orbit operations on ISS. Designed to reduce EVA costs by replacing astronaut spacewalks with robotic work.",specs:{arms:2,dof_per_arm:7,force_sensing:true,autonomy:"Semi-autonomous + teleoperation",target:"ISS maintenance",mass_kg:80,demonstrations:"ISS in-orbit 2021"},score:cs({performance:78,reliability:72,ease_of_use:65,intelligence:80,value:75,ecosystem:62,safety:82,design:75}),breakdown:{performance:78,reliability:72,ease_of_use:65,intelligence:80,value:75,ecosystem:62,safety:82,design:75}},
  {slug:"gitai-inchworm",name:"GITAI Inchworm",mfr:"gitai",cat:"space",price:350000,year:2024,status:"coming_soon",desc:"EVA replacement robot that moves along spacecraft exterior using inchworm locomotion. Grasps handrails and structural elements to traverse station exterior for inspection and maintenance.",specs:{locomotion:"Inchworm bimanual",dof:14,grippers:2,application:"Spacecraft exterior EVA replacement",mass_kg:35,autonomy:"Autonomous + teleoperated"},score:cs({performance:75,reliability:70,ease_of_use:60,intelligence:78,value:72,ecosystem:58,safety:80,design:70}),breakdown:{performance:75,reliability:70,ease_of_use:60,intelligence:78,value:72,ecosystem:58,safety:80,design:70}},
  {slug:"astrobotic-peregrine",name:"Astrobotic Peregrine",mfr:"astrobotic",cat:"space",price:108000000,year:2024,status:"active",desc:"Commercial lunar lander delivering payloads to the Moon surface. Carries up to 14 payloads from multiple customers. Part of NASA CLPS program for affordable lunar delivery services.",specs:{payload_capacity_kg:90,payloads:14,landing_site:"Lacus Mortis",propulsion:"Bipropellant",program:"NASA CLPS",mass_kg:1283},score:cs({performance:72,reliability:65,ease_of_use:55,intelligence:72,value:78,ecosystem:75,safety:78,design:70}),breakdown:{performance:72,reliability:65,ease_of_use:55,intelligence:72,value:78,ecosystem:75,safety:78,design:70}},
  {slug:"astrobotic-cuberover",name:"Astrobotic CubeRover",mfr:"astrobotic",cat:"space",price:5000000,year:2025,status:"coming_soon",desc:"Miniature lunar rover based on CubeSat standardization. 2kg micro-rover for affordable lunar surface mobility. Designed for university and commercial payloads needing low-cost exploration.",specs:{mass_kg:2,dimensions:"22cm x 22cm x 22cm",wheels:4,payload_kg:0.5,power:"Solar panels",communication:"Lander relay",target:"Lunar surface mobility"},score:cs({performance:62,reliability:65,ease_of_use:68,intelligence:65,value:85,ecosystem:60,safety:75,design:72}),breakdown:{performance:62,reliability:65,ease_of_use:68,intelligence:65,value:85,ecosystem:60,safety:75,design:72}},
  {slug:"motiv-robotic-arm",name:"Motiv xLink",mfr:"motiv-space-systems",cat:"space",price:2000000,year:2023,status:"active",desc:"Modular robotic arm system for spacecraft servicing and assembly. Flight-heritage manipulator used on Mars 2020. Designed for in-orbit satellite servicing and construction.",specs:{dof:7,reach_m:2.5,payload_kg:50,heritage:"Mars 2020 sample handling",applications:"Satellite servicing, assembly",mass_kg:45,precision_mm:1},score:cs({performance:82,reliability:80,ease_of_use:60,intelligence:78,value:72,ecosystem:70,safety:85,design:72}),breakdown:{performance:82,reliability:80,ease_of_use:60,intelligence:78,value:72,ecosystem:70,safety:85,design:72}},
  {slug:"motiv-coldarm",name:"Motiv COLDArm",mfr:"motiv-space-systems",cat:"space",price:3000000,year:2024,status:"coming_soon",desc:"Cryogenic robotic arm designed to operate in extreme cold without heaters. Uses bulk metallic glass gears that function at -173C. For lunar and outer planet surface operations.",specs:{dof:6,operating_temp_c:"-173 to +50",gears:"Bulk metallic glass",heaters:"None required",target:"Lunar/planetary cold environments",mass_kg:30},score:cs({performance:80,reliability:75,ease_of_use:55,intelligence:72,value:70,ecosystem:62,safety:82,design:70}),breakdown:{performance:80,reliability:75,ease_of_use:55,intelligence:72,value:70,ecosystem:62,safety:82,design:70}},
  {slug:"maxar-ssl-1300",name:"Maxar SSL 1300",mfr:"maxar-technologies",cat:"space",price:150000000,year:2023,status:"active",desc:"Satellite bus platform adapted for robotic servicing missions. Robotic arms for satellite inspection, refueling, and component replacement in geostationary orbit.",specs:{platform:"SSL 1300 bus",arms:2,orbit:"GEO serviceable",applications:"Inspection, refueling, repair",design_life_years:15,mass_kg:3500},score:cs({performance:84,reliability:82,ease_of_use:55,intelligence:80,value:68,ecosystem:78,safety:85,design:72}),breakdown:{performance:84,reliability:82,ease_of_use:55,intelligence:80,value:68,ecosystem:78,safety:85,design:72}},
  {slug:"maxar-rsgs",name:"Maxar RSGS",mfr:"maxar-technologies",cat:"space",price:300000000,year:2025,status:"coming_soon",desc:"Robotic Servicing of Geosynchronous Satellites program. DARPA-funded spacecraft with dual dexterous arms for GEO satellite inspection, relocation, and repair.",specs:{arms:2,dof_per_arm:7,orbit:"GEO",sponsor:"DARPA",capabilities:"Inspect, relocate, repair, upgrade",autonomy:"Supervised autonomy"},score:cs({performance:85,reliability:78,ease_of_use:52,intelligence:85,value:65,ecosystem:75,safety:85,design:72}),breakdown:{performance:85,reliability:78,ease_of_use:52,intelligence:85,value:65,ecosystem:75,safety:85,design:72}},
  {slug:"spacex-canadarm3",name:"Canadarm3 (MDA)",mfr:"spacex",cat:"space",price:2100000000,year:2025,status:"coming_soon",desc:"Next-generation robotic arm for the Lunar Gateway station. Built by MDA Space. AI-driven autonomous operations, can perform tasks without astronaut control. 8.5m reach.",specs:{reach_m:8.5,dof:7,mass_kg:715,autonomy:"AI-driven autonomous",station:"Lunar Gateway",builder:"MDA Space",heritage:"Canadarm heritage"},score:cs({performance:88,reliability:82,ease_of_use:65,intelligence:88,value:60,ecosystem:85,safety:88,design:78}),breakdown:{performance:88,reliability:82,ease_of_use:65,intelligence:88,value:60,ecosystem:85,safety:88,design:78}},
  {slug:"northrop-mev-2",name:"Northrop MEV-2",mfr:"maxar-technologies",cat:"space",price:300000000,year:2021,status:"active",desc:"Mission Extension Vehicle that docks with aging satellites to extend their operational life. MEV-2 successfully docked with Intelsat 10-02 in GEO. Provides station-keeping and attitude control.",specs:{type:"Satellite life extension",orbit:"GEO",docking:"Non-cooperative capture",life_extension_years:5,customer:"Intelsat",mass_kg:2300},score:cs({performance:85,reliability:85,ease_of_use:58,intelligence:82,value:75,ecosystem:72,safety:88,design:70}),breakdown:{performance:85,reliability:85,ease_of_use:58,intelligence:82,value:75,ecosystem:72,safety:88,design:70}},
  {slug:"intuitive-machines-nova",name:"Intuitive Machines Nova-C",mfr:"astrobotic",cat:"space",price:77000000,year:2024,status:"active",desc:"Commercial lunar lander that achieved first US soft landing on the Moon since Apollo. Odysseus lander carried 6 NASA payloads. Part of NASA CLPS program for commercial lunar services.",specs:{payload_capacity_kg:100,lander_mass_kg:675,propulsion:"Liquid methane/LOX",program:"NASA CLPS",landing:"Malapert A crater",payloads:6},score:cs({performance:75,reliability:68,ease_of_use:55,intelligence:75,value:80,ecosystem:72,safety:78,design:72}),breakdown:{performance:75,reliability:68,ease_of_use:55,intelligence:75,value:80,ecosystem:72,safety:78,design:72}},
  {slug:"honeybee-robotics-drill",name:"Honeybee PlanetVac",mfr:"nasa-jpl",cat:"space",price:15000000,year:2023,status:"active",desc:"Pneumatic sample collection system for planetary surfaces. Uses gas jets to loft regolith into a collection container. Flew on Intuitive Machines IM-1 mission. Low-mass, no moving parts.",specs:{method:"Pneumatic lofting",moving_parts:0,mass_kg:2,sample_grams:200,heritage:"IM-1 lunar mission",surfaces:"Regolith, soil, dust"},score:cs({performance:78,reliability:80,ease_of_use:72,intelligence:70,value:82,ecosystem:65,safety:85,design:68}),breakdown:{performance:78,reliability:80,ease_of_use:72,intelligence:70,value:82,ecosystem:65,safety:85,design:68}},
  {slug:"orbit-fab-tanker",name:"Orbit Fab Tanker-002",mfr:"astrobotic",cat:"space",price:12000000,year:2024,status:"active",desc:"In-space refueling depot and tanker. Uses RAFTI fuel port standard. Stores and transfers hydrazine to client satellites in orbit. Enables indefinite satellite life extension.",specs:{fuel:"Hydrazine",interface:"RAFTI standard port",orbit:"LEO/GEO capable",capacity_kg:300,type:"Fuel depot + tanker",autonomy:"Autonomous rendezvous"},score:cs({performance:76,reliability:72,ease_of_use:58,intelligence:78,value:80,ecosystem:68,safety:82,design:65}),breakdown:{performance:76,reliability:72,ease_of_use:58,intelligence:78,value:80,ecosystem:68,safety:82,design:65}},
  {slug:"made-in-space-archinaut",name:"Made In Space Archinaut",mfr:"maxar-technologies",cat:"space",price:75000000,year:2025,status:"coming_soon",desc:"In-space manufacturing and assembly system. 3D prints and assembles large structures in orbit that are too large to launch. Builds solar arrays, antenna reflectors, and trusses in microgravity.",specs:{method:"3D printing + robotic assembly",materials:"Composite polymers",structures:"Solar arrays, trusses, reflectors",environment:"Microgravity",arm_reach_m:5},score:cs({performance:78,reliability:68,ease_of_use:50,intelligence:82,value:70,ecosystem:62,safety:78,design:72}),breakdown:{performance:78,reliability:68,ease_of_use:50,intelligence:82,value:70,ecosystem:62,safety:78,design:72}},
  {slug:"moon-mark-rover",name:"Moon Mark Rover",mfr:"astrobotic",cat:"space",price:2000000,year:2024,status:"coming_soon",desc:"Compact lunar rover for educational and commercial payload delivery on the Moon surface. Designed for student-operated missions and STEM engagement through lunar racing competitions.",specs:{mass_kg:3,dimensions:"30cm x 20cm x 15cm",wheels:4,speed_cmps:5,power:"Solar + battery",control:"Earth teleoperation",purpose:"Education, STEM racing"},score:cs({performance:58,reliability:62,ease_of_use:75,intelligence:55,value:72,ecosystem:55,safety:78,design:70}),breakdown:{performance:58,reliability:62,ease_of_use:75,intelligence:55,value:72,ecosystem:55,safety:78,design:70}},
  {slug:"esa-exomars",name:"ESA ExoMars Rosalind Franklin",mfr:"nasa-jpl",cat:"space",price:1200000000,year:2028,status:"coming_soon",desc:"European Mars rover with a 2m drill to search for signs of past life below the Martian surface. Named after DNA pioneer. Carries 9 instruments including a miniaturized biochemistry lab.",specs:{mass_kg:310,drill_depth_m:2,instruments:9,wheels:6,power:"Solar arrays",mission:"Subsurface biosignatures",lab:"Analytical Drawer biochemistry"},score:cs({performance:85,reliability:75,ease_of_use:55,intelligence:88,value:68,ecosystem:80,safety:85,design:78}),breakdown:{performance:85,reliability:75,ease_of_use:55,intelligence:88,value:68,ecosystem:80,safety:85,design:78}},
  {slug:"jaxa-slim",name:"JAXA SLIM",mfr:"nasa-jpl",cat:"space",price:120000000,year:2024,status:"active",desc:"Smart Lander for Investigating Moon. Japanese precision lunar lander that achieved pinpoint landing within 100m of target. Demonstrated face-down landing and deployed two mini rovers.",specs:{mass_kg:590,landing_accuracy_m:100,mini_rovers:2,power:"Solar",agency:"JAXA",achievement:"Precision pinpoint landing",landing_site:"Shioli crater"},score:cs({performance:82,reliability:75,ease_of_use:55,intelligence:85,value:78,ecosystem:68,safety:82,design:72}),breakdown:{performance:82,reliability:75,ease_of_use:55,intelligence:85,value:78,ecosystem:68,safety:82,design:72}},
  {slug:"isro-pragyan",name:"ISRO Pragyan",mfr:"nasa-jpl",cat:"space",price:75000000,year:2023,status:"active",desc:"Indian lunar rover deployed by Chandrayaan-3. First spacecraft to land near the lunar south pole. Carried APXS and LIBS instruments. Confirmed presence of sulfur on Moon surface.",specs:{mass_kg:26,wheels:6,instruments:2,power:"Solar 50W",speed_cmps:1,mission_days:14,achievement:"First south pole landing",agency:"ISRO"},score:cs({performance:78,reliability:76,ease_of_use:55,intelligence:78,value:88,ecosystem:65,safety:82,design:70}),breakdown:{performance:78,reliability:76,ease_of_use:55,intelligence:78,value:88,ecosystem:65,safety:82,design:70}},
  {slug:"clearspace-1",name:"ClearSpace-1",mfr:"maxar-technologies",cat:"space",price:130000000,year:2026,status:"coming_soon",desc:"ESA-contracted space debris removal mission. Will capture and deorbit a Vespa upper stage from a 2013 Vega launch. First active debris removal mission. Uses four robotic arms for capture.",specs:{arms:4,target:"Vespa upper stage (112kg)",orbit:"LEO 660-800km",method:"Robotic capture + controlled deorbit",contractor:"ClearSpace SA",sponsor:"ESA"},score:cs({performance:78,reliability:70,ease_of_use:50,intelligence:82,value:72,ecosystem:68,safety:85,design:70}),breakdown:{performance:78,reliability:70,ease_of_use:50,intelligence:82,value:72,ecosystem:68,safety:85,design:70}},

  // ═══ UNDERWATER (25) ═══
  {slug:"oceaneering-freedom",name:"Oceaneering Freedom",mfr:"oceaneering",cat:"underwater",price:5000000,year:2024,status:"active",desc:"Resident autonomous underwater vehicle for permanent subsea deployment. Docks at underwater stations for recharging and data upload. Eliminates need for surface vessel support for routine inspections.",specs:{depth_m:3000,endurance_hrs:48,sensors:"Multibeam sonar, cameras, CP probes",docking:"Subsea resident station",autonomy:"Full autonomous + supervised",mass_kg:2800},score:cs({performance:88,reliability:82,ease_of_use:72,intelligence:86,value:75,ecosystem:78,safety:85,design:78}),breakdown:{performance:88,reliability:82,ease_of_use:72,intelligence:86,value:75,ecosystem:78,safety:85,design:78}},
  {slug:"oceaneering-millennium",name:"Oceaneering Millennium Plus",mfr:"oceaneering",cat:"underwater",price:3500000,year:2023,status:"active",desc:"Heavy-duty work-class ROV for deepwater oil & gas operations. Dual 7-function manipulators. 150hp hydraulic power unit. Proven in thousands of deepwater interventions worldwide.",specs:{depth_m:3000,hp:150,manipulators:2,manipulator_function:7,payload_kg:350,thrusters:8,tms:"Tether management system"},score:cs({performance:86,reliability:85,ease_of_use:68,intelligence:72,value:72,ecosystem:85,safety:85,design:72}),breakdown:{performance:86,reliability:85,ease_of_use:68,intelligence:72,value:72,ecosystem:85,safety:85,design:72}},
  {slug:"saab-sabertooth",name:"Saab Sabertooth",mfr:"saab-seaeye",cat:"underwater",price:4000000,year:2023,status:"active",desc:"Hybrid AUV/ROV that operates both tethered and untethered. Double-hull torpedo shape with hovering capability. Resident-ready for subsea docking. Used for pipeline inspection and survey.",specs:{depth_m:3000,modes:"AUV autonomous + ROV tethered",endurance_hrs:24,hovering:true,sensors:"Multibeam, cameras, profiler",mass_kg:1500,resident_capable:true},score:cs({performance:86,reliability:82,ease_of_use:70,intelligence:84,value:74,ecosystem:76,safety:84,design:78}),breakdown:{performance:86,reliability:82,ease_of_use:70,intelligence:84,value:74,ecosystem:76,safety:84,design:78}},
  {slug:"saab-leopard",name:"Saab Seaeye Leopard",mfr:"saab-seaeye",cat:"underwater",price:2000000,year:2024,status:"active",desc:"All-electric work-class ROV with 6 thrusters. iCON intelligent control system. Modular tooling skid. Designed for subsea inspection, light intervention, and survey operations.",specs:{depth_m:1500,thrusters:6,drive:"All-electric",control:"iCON intelligent",payload_kg:200,tooling:"Modular skid",mass_kg:800},score:cs({performance:82,reliability:82,ease_of_use:75,intelligence:78,value:76,ecosystem:78,safety:82,design:76}),breakdown:{performance:82,reliability:82,ease_of_use:75,intelligence:78,value:76,ecosystem:78,safety:82,design:76}},
  {slug:"saab-falcon",name:"Saab Seaeye Falcon",mfr:"saab-seaeye",cat:"underwater",price:400000,year:2023,status:"active",desc:"Compact electric observation-class ROV. World's most popular electric ROV with 1000+ units sold. 5 thrusters for precise maneuvering. Used in offshore, aquaculture, and infrastructure inspection.",specs:{depth_m:1000,thrusters:5,drive:"All-electric",mass_kg:55,units_sold:"1000+",applications:"Inspection, survey, aquaculture",cameras:"HD + auxiliary"},score:cs({performance:76,reliability:84,ease_of_use:82,intelligence:70,value:82,ecosystem:82,safety:82,design:76}),breakdown:{performance:76,reliability:84,ease_of_use:82,intelligence:70,value:82,ecosystem:82,safety:82,design:76}},
  {slug:"eca-a18d",name:"ECA A18-D",mfr:"eca-group",cat:"underwater",price:3000000,year:2023,status:"active",desc:"Military-grade autonomous underwater vehicle for mine countermeasures. Side-scan sonar and synthetic aperture sonar for seabed mapping. Used by French and NATO navies.",specs:{depth_m:300,length_m:5.5,endurance_hrs:24,sonar:"Side-scan + SAS",application:"Mine countermeasures",navies:"French Navy, NATO",mass_kg:700},score:cs({performance:84,reliability:82,ease_of_use:65,intelligence:82,value:70,ecosystem:75,safety:88,design:72}),breakdown:{performance:84,reliability:82,ease_of_use:65,intelligence:82,value:70,ecosystem:75,safety:88,design:72}},
  {slug:"eca-h300",name:"ECA H300",mfr:"eca-group",cat:"underwater",price:800000,year:2024,status:"active",desc:"Electric observation and inspection ROV with integrated manipulator option. Compact design for inspection of offshore structures, pipelines, and port infrastructure.",specs:{depth_m:300,thrusters:5,drive:"Electric",manipulator:"Optional 5-function",mass_kg:120,cameras:"HD + low-light",payload_kg:30},score:cs({performance:74,reliability:78,ease_of_use:78,intelligence:72,value:78,ecosystem:70,safety:80,design:74}),breakdown:{performance:74,reliability:78,ease_of_use:78,intelligence:72,value:78,ecosystem:70,safety:80,design:74}},
  {slug:"forum-perry-xl",name:"Forum Perry XLX",mfr:"forum-energy",cat:"underwater",price:2500000,year:2023,status:"active",desc:"Work-class ROV for deepwater survey and light construction. 100hp hydraulic system. Proven design with global operator base. Dual manipulators for intervention tasks.",specs:{depth_m:3000,hp:100,manipulators:2,thrusters:7,mass_kg:3100,tms:true,cameras:"HD + still"},score:cs({performance:82,reliability:84,ease_of_use:70,intelligence:70,value:74,ecosystem:80,safety:84,design:70}),breakdown:{performance:82,reliability:84,ease_of_use:70,intelligence:70,value:74,ecosystem:80,safety:84,design:70}},
  {slug:"videoray-mission-specialist",name:"VideoRay Mission Specialist",mfr:"videoray",cat:"underwater",price:85000,year:2023,status:"active",desc:"Modular micro-ROV platform for inspection and observation. Thruster modules snap on for custom configurations. Used by military, law enforcement, infrastructure inspectors, and researchers.",specs:{depth_m:305,mass_kg:6,thrusters:"Modular 3-8",cameras:"HD + auxiliary",modular:true,users:"Military, police, inspectors",tether_m:305},score:cs({performance:72,reliability:78,ease_of_use:85,intelligence:68,value:85,ecosystem:78,safety:80,design:78}),breakdown:{performance:72,reliability:78,ease_of_use:85,intelligence:68,value:85,ecosystem:78,safety:80,design:78}},
  {slug:"videoray-defender",name:"VideoRay Defender",mfr:"videoray",cat:"underwater",price:120000,year:2024,status:"active",desc:"Military-grade micro-ROV for port security, hull inspection, and mine countermeasures. Enhanced thrust for current operations. Integrated sonar and navigation suite.",specs:{depth_m:305,mass_kg:8,thrusters:6,sonar:"Integrated navigation",application:"Port security, hull inspection, MCM",current_tolerance_kts:3,cameras:"HD + low-light"},score:cs({performance:76,reliability:80,ease_of_use:82,intelligence:72,value:80,ecosystem:75,safety:85,design:75}),breakdown:{performance:76,reliability:80,ease_of_use:82,intelligence:72,value:80,ecosystem:75,safety:85,design:75}},
  {slug:"bluerobotics-bluerov2",name:"Blue Robotics BlueROV2",mfr:"blue-robotics",cat:"underwater",price:4500,year:2023,status:"active",desc:"Open-source ROV platform used by researchers, educators, and marine professionals worldwide. 6-thruster vectored configuration. ArduSub firmware. Community of 5000+ operators.",specs:{depth_m:100,thrusters:6,firmware:"ArduSub open-source",mass_kg:11,payload_kg:5,community:"5000+ operators",cameras:"1080p low-light"},score:cs({performance:68,reliability:74,ease_of_use:82,intelligence:62,value:90,ecosystem:85,safety:75,design:76}),breakdown:{performance:68,reliability:74,ease_of_use:82,intelligence:62,value:90,ecosystem:85,safety:75,design:76}},
  {slug:"bluerobotics-bluerov2-heavy",name:"Blue Robotics BlueROV2 Heavy",mfr:"blue-robotics",cat:"underwater",price:6500,year:2024,status:"active",desc:"8-thruster heavy configuration of the BlueROV2 platform. Greater payload capacity and improved stability for sensor packages. Popular with research institutions and survey companies.",specs:{depth_m:100,thrusters:8,firmware:"ArduSub open-source",mass_kg:14,payload_kg:10,configuration:"Heavy 8-thruster",cameras:"1080p + accessories"},score:cs({performance:72,reliability:74,ease_of_use:80,intelligence:64,value:88,ecosystem:85,safety:76,design:74}),breakdown:{performance:72,reliability:74,ease_of_use:80,intelligence:64,value:88,ecosystem:85,safety:76,design:74}},
  {slug:"deeptrekker-dtg3",name:"Deep Trekker DTG3",mfr:"deep-trekker",cat:"underwater",price:8500,year:2023,status:"active",desc:"Portable observation ROV with internal battery — no topside power required. Hand-carried deployment. Used for aquaculture, infrastructure inspection, and search & rescue. Built-in LED lighting.",specs:{depth_m:200,mass_kg:8,battery_hrs:8,thrusters:4,portable:true,cameras:"4K + auxiliary",deployment:"Hand-carried, no infrastructure"},score:cs({performance:70,reliability:76,ease_of_use:88,intelligence:65,value:86,ecosystem:72,safety:78,design:80}),breakdown:{performance:70,reliability:76,ease_of_use:88,intelligence:65,value:86,ecosystem:72,safety:78,design:80}},
  {slug:"deeptrekker-revolution",name:"Deep Trekker Revolution",mfr:"deep-trekker",cat:"underwater",price:12000,year:2024,status:"active",desc:"Magnetic crawler ROV for inspection of ship hulls, tanks, and submerged infrastructure. Powerful magnets hold robot to steel surfaces. Thickness measurement and cleaning attachments.",specs:{depth_m:50,mass_kg:12,magnets:"Neodymium hold-force",surface:"Steel hull/tank",tools:"Thickness gauge, cleaning brush",cameras:"HD + inspection"},score:cs({performance:74,reliability:78,ease_of_use:82,intelligence:68,value:82,ecosystem:70,safety:80,design:74}),breakdown:{performance:74,reliability:78,ease_of_use:82,intelligence:68,value:82,ecosystem:70,safety:80,design:74}},
  {slug:"deeptrekker-pivot",name:"Deep Trekker PIVOT",mfr:"deep-trekker",cat:"underwater",price:15000,year:2024,status:"active",desc:"Modular ROV with interchangeable tool heads. Pivoting camera head with 270-degree tilt. Designed for municipal, industrial, and environmental inspection applications.",specs:{depth_m:305,mass_kg:10,thrusters:4,camera_tilt_deg:270,modular_tools:true,battery_hrs:6,applications:"Municipal, industrial, environmental"},score:cs({performance:72,reliability:76,ease_of_use:85,intelligence:68,value:84,ecosystem:72,safety:78,design:78}),breakdown:{performance:72,reliability:76,ease_of_use:85,intelligence:68,value:84,ecosystem:72,safety:78,design:78}},
  {slug:"kongsberg-hugin",name:"Kongsberg HUGIN",mfr:"oceaneering",cat:"underwater",price:8000000,year:2023,status:"active",desc:"Deep-sea AUV for detailed seabed mapping and survey. Used by navies and oil & gas worldwide. HISAS synthetic aperture sonar provides cm-resolution imagery. Depth rated to 6000m.",specs:{depth_m:6000,endurance_hrs:60,sonar:"HISAS synthetic aperture",resolution_cm:2,mass_kg:1900,autonomy:"Full survey mission",applications:"Seabed mapping, naval, O&G"},score:cs({performance:90,reliability:86,ease_of_use:65,intelligence:88,value:70,ecosystem:82,safety:88,design:78}),breakdown:{performance:90,reliability:86,ease_of_use:65,intelligence:88,value:70,ecosystem:82,safety:88,design:78}},
  {slug:"kongsberg-munin",name:"Kongsberg MUNIN",mfr:"oceaneering",cat:"underwater",price:5000000,year:2024,status:"active",desc:"Autonomous survey AUV optimized for long-endurance ocean mapping missions. Part of Kongsberg Ocean Space autonomy family. AI-driven mission planning and real-time data processing.",specs:{depth_m:4000,endurance_hrs:40,sensors:"Multibeam, SBP, cameras",autonomy:"AI mission planning",data_processing:"Real-time onboard",mass_kg:1200},score:cs({performance:86,reliability:82,ease_of_use:70,intelligence:86,value:72,ecosystem:80,safety:85,design:76}),breakdown:{performance:86,reliability:82,ease_of_use:70,intelligence:86,value:72,ecosystem:80,safety:85,design:76}},
  {slug:"general-dynamics-bluefin",name:"Bluefin-21",mfr:"oceaneering",cat:"underwater",price:4000000,year:2023,status:"active",desc:"Military-grade large-displacement AUV for deep-ocean search and mine countermeasures. Used in MH370 search. Modular payload bay for side-scan sonar, cameras, and sensor packages.",specs:{depth_m:4500,endurance_hrs:25,length_m:4.9,mass_kg:750,payload_bay:"Modular",applications:"MCM, search, survey",heritage:"MH370 search operations"},score:cs({performance:84,reliability:82,ease_of_use:62,intelligence:80,value:72,ecosystem:78,safety:86,design:72}),breakdown:{performance:84,reliability:82,ease_of_use:62,intelligence:80,value:72,ecosystem:78,safety:86,design:72}},
  {slug:"hydroid-remus-600",name:"Hydroid REMUS 600",mfr:"oceaneering",cat:"underwater",price:3500000,year:2023,status:"active",desc:"Medium-class naval AUV for mine countermeasures and hydrographic survey. Operated by US Navy and allied forces. Modular design with field-swappable sensor sections.",specs:{depth_m:600,endurance_hrs:70,length_m:3.3,mass_kg:240,sensors:"Side-scan, multibeam, cameras",navy:"US Navy, allied forces",modular:"Field-swappable sections"},score:cs({performance:82,reliability:84,ease_of_use:68,intelligence:78,value:74,ecosystem:80,safety:86,design:72}),breakdown:{performance:82,reliability:84,ease_of_use:68,intelligence:78,value:74,ecosystem:80,safety:86,design:72}},
  {slug:"teledyne-gavia",name:"Teledyne Gavia",mfr:"oceaneering",cat:"underwater",price:1500000,year:2023,status:"active",desc:"Modular AUV platform with hot-swappable sensor modules. Field-reconfigurable for survey, inspection, or military missions. Man-portable at 80kg. Used in 30+ countries.",specs:{depth_m:1000,endurance_hrs:12,mass_kg:80,modules:"Hot-swappable sensor",countries:30,deployment:"Man-portable",length_m:2.7},score:cs({performance:78,reliability:80,ease_of_use:78,intelligence:76,value:80,ecosystem:78,safety:82,design:76}),breakdown:{performance:78,reliability:80,ease_of_use:78,intelligence:76,value:80,ecosystem:78,safety:82,design:76}},
  {slug:"kraken-katfish",name:"Kraken KATFISH",mfr:"forum-energy",cat:"underwater",price:1200000,year:2024,status:"active",desc:"Towed synthetic aperture sonar sensor platform. Flies at constant altitude above seabed for ultra-high-resolution imaging. AquaPix SAS provides 2cm resolution at survey speeds.",specs:{sonar:"AquaPix SAS 2cm resolution",altitude_control:"Automatic terrain-following",speed_kts:4,depth_m:300,towed:true,resolution_cm:2},score:cs({performance:82,reliability:78,ease_of_use:72,intelligence:78,value:76,ecosystem:68,safety:80,design:72}),breakdown:{performance:82,reliability:78,ease_of_use:72,intelligence:78,value:76,ecosystem:68,safety:80,design:72}},
  {slug:"kawasaki-spice",name:"Kawasaki SPICE",mfr:"oceaneering",cat:"underwater",price:6000000,year:2024,status:"active",desc:"Deep-sea autonomous underwater vehicle for offshore energy inspection. Streamlined design for efficient long-range missions. Japanese engineering for reliability in harsh deep-ocean environments.",specs:{depth_m:3000,endurance_hrs:30,mass_kg:1800,propulsion:"Electric thrusters",sensors:"Multibeam, cameras, profiler",application:"Offshore energy inspection"},score:cs({performance:84,reliability:82,ease_of_use:68,intelligence:80,value:72,ecosystem:70,safety:84,design:76}),breakdown:{performance:84,reliability:82,ease_of_use:68,intelligence:80,value:72,ecosystem:70,safety:84,design:76}},
  {slug:"ocean-infinity-armada",name:"Ocean Infinity Armada",mfr:"oceaneering",cat:"underwater",price:10000000,year:2024,status:"active",desc:"Fleet of autonomous underwater and surface vessels for large-scale ocean data collection. AI-coordinated swarm operations. Designed for seabed mapping, pipeline survey, and environmental monitoring.",specs:{fleet_size:"8+ coordinated vehicles",autonomy:"AI swarm coordination",endurance_days:30,applications:"Mapping, survey, environmental",surface_vessels:"Armada USV fleet",depth_m:6000},score:cs({performance:88,reliability:78,ease_of_use:65,intelligence:90,value:72,ecosystem:72,safety:82,design:78}),breakdown:{performance:88,reliability:78,ease_of_use:65,intelligence:90,value:72,ecosystem:72,safety:82,design:78}},
  {slug:"cellula-imotus",name:"Cellula Imotus-S",mfr:"blue-robotics",cat:"underwater",price:500000,year:2024,status:"active",desc:"Solar-powered autonomous surface-to-subsea vehicle. Charges via solar panels on surface, then dives for underwater inspection missions. Months-long endurance without recovery.",specs:{depth_m:100,power:"Solar + battery",endurance:"Months",modes:"Surface charging + subsea diving",mass_kg:60,sensors:"Cameras, sonar, CTD",autonomy:"Persistent autonomous"},score:cs({performance:74,reliability:72,ease_of_use:70,intelligence:80,value:78,ecosystem:60,safety:78,design:78}),breakdown:{performance:74,reliability:72,ease_of_use:70,intelligence:80,value:78,ecosystem:60,safety:78,design:78}},
  {slug:"saildrone-voyager",name:"Saildrone Voyager",mfr:"oceaneering",cat:"underwater",price:1000000,year:2024,status:"active",desc:"Autonomous surface vessel with integrated sonar for ocean floor mapping. Wind and solar powered for months-long missions. Used by NOAA and US Navy for maritime domain awareness and survey.",specs:{length_m:10,power:"Wind + solar",endurance_months:12,sonar:"Multibeam bathymetric",payload_kg:450,users:"NOAA, US Navy",autonomy:"Fully autonomous trans-ocean"},score:cs({performance:82,reliability:78,ease_of_use:72,intelligence:82,value:80,ecosystem:72,safety:80,design:80}),breakdown:{performance:82,reliability:78,ease_of_use:72,intelligence:82,value:80,ecosystem:72,safety:80,design:80}},
];

// ═══════════════════════════════════════════════════════════════
// MAIN IMPORT
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Robotomated — Wave 11 Import: 50 New Robots");
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Create categories if needed
  const { data: cats } = await supabase.from("robot_categories").select("id, slug");
  const catMap = new Map<string, string>();
  for (const c of cats || []) catMap.set(c.slug, c.id);

  let catsCreated = 0;
  for (const cat of newCategories) {
    if (catMap.has(cat.slug)) continue;
    const { data, error } = await supabase.from("robot_categories").insert(cat).select("id").single();
    if (error) { console.error(`  [ERR] Category ${cat.slug}: ${error.message}`); continue; }
    catMap.set(cat.slug, data!.id);
    catsCreated++;
    console.log(`  [OK] Created category: ${cat.name}`);
  }
  console.log(`[DIR] Categories: ${catsCreated} new, ${catMap.size} total\n`);

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
  console.log(`[STATS] Wave 11 Import Summary`);
  console.log(`${"═".repeat(50)}`);
  console.log(`  Categories:    ${catsCreated} new`);
  console.log(`  Manufacturers: ${mfrsCreated} new`);
  console.log(`  Robots:        ${inserted} inserted, ${skipped} skipped, ${errored} errors`);
  console.log(`  Total in DB:   ${count}`);
  console.log(`${"═".repeat(50)}`);
}

main().catch(console.error);
