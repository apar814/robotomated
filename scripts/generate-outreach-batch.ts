/**
 * generate-outreach-batch.ts
 *
 * Generates two CSVs for outreach:
 * 1. employer-outreach: top 50 robotics manufacturers/integrators from our DB
 * 2. student-outreach: 50 LinkedIn DM templates for displaced manufacturing workers
 *
 * Usage: npx tsx scripts/generate-outreach-batch.ts
 * Output: scripts/output/outreach-batch-employers.csv
 *         scripts/output/outreach-batch-students.csv
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { join } from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DECISION_MAKER_TITLES = [
  "VP of Operations",
  "Director of Automation",
  "Head of Manufacturing",
  "VP of Engineering",
  "Chief Technology Officer",
  "Director of Logistics",
  "VP of Supply Chain",
  "Plant Manager",
  "Director of Innovation",
  "Head of Robotics",
];

interface ManufacturerWithCount {
  id: string;
  name: string;
  slug: string;
  robot_count: number;
  categories: string[];
}

function escapeCSV(s: string): string {
  return `"${s.replace(/"/g, '""')}"`;
}

async function generateEmployerOutreach() {
  console.log("Generating employer outreach...");

  // Get manufacturers with robot counts
  const { data: robots } = await supabase
    .from("robots")
    .select("manufacturer_id, category")
    .not("manufacturer_id", "is", null);

  const { data: manufacturers } = await supabase
    .from("manufacturers")
    .select("id, name, slug");

  if (!robots || !manufacturers) {
    console.error("Failed to fetch robot/manufacturer data");
    return 0;
  }

  // Build manufacturer map with robot counts and categories
  const mfgMap = new Map<string, ManufacturerWithCount>();
  for (const mfg of manufacturers) {
    mfgMap.set(mfg.id, {
      id: mfg.id,
      name: mfg.name,
      slug: mfg.slug,
      robot_count: 0,
      categories: [],
    });
  }

  for (const robot of robots) {
    const mfg = mfgMap.get(robot.manufacturer_id);
    if (mfg) {
      mfg.robot_count++;
      if (robot.category && !mfg.categories.includes(robot.category)) {
        mfg.categories.push(robot.category);
      }
    }
  }

  // Sort by robot count, take top 50
  const sorted = Array.from(mfgMap.values())
    .filter((m) => m.robot_count > 0)
    .sort((a, b) => b.robot_count - a.robot_count)
    .slice(0, 50);

  // Generate CSV rows
  const rows = sorted.map((mfg, i) => {
    const titleGuess = DECISION_MAKER_TITLES[i % DECISION_MAKER_TITLES.length];
    const cats = mfg.categories.slice(0, 3).join(", ") || "robotics";

    const hook = `We track ${mfg.robot_count} of your robots across ${cats} in our database. Your customers deploying these need trained operators who know your specific platforms.`;

    const subjectLine = `Certified operators for ${mfg.name} platforms`;

    const body = [
      `I run Robotomated, the robotics intelligence platform. We track 975+ robots from 200+ manufacturers.`,
      ``,
      `We're launching a certified operator training program aligned to specific robot platforms. ${mfg.name} has ${mfg.robot_count} robot${mfg.robot_count > 1 ? "s" : ""} in our database across ${cats}.`,
      ``,
      `Your customers and integrators need trained operators who know your systems. We want to explore a training partnership.`,
      ``,
      `Would 15 minutes this week work?`,
    ].join("\n");

    return [
      escapeCSV(mfg.name),
      escapeCSV(titleGuess),
      escapeCSV(hook),
      escapeCSV(subjectLine),
      escapeCSV(body),
      escapeCSV("not_sent"),
    ].join(",");
  });

  const header =
    "company,contact_title_guess,hook,subject_line,body,send_status";
  const csv = header + "\n" + rows.join("\n");

  const outPath = join(process.cwd(), "scripts", "output", "outreach-batch-employers.csv");
  writeFileSync(outPath, csv);
  console.log(`  Wrote ${sorted.length} employer leads to ${outPath}`);
  return sorted.length;
}

async function generateStudentOutreach() {
  console.log("Generating student outreach...");

  const targets = [
    {
      role: "Warehouse Associate",
      search_hint: "warehouse associate seeking opportunities",
      location: "Atlanta, GA",
      hook: "AMR fleets are replacing manual picking. Certified AMR operators earn $50-65K and are in high demand right now.",
      subject: "The warehouse is adding robots. Here's how to be the one running them.",
      body: "The warehouse you work in is probably adding autonomous mobile robots within 2 years. The people who know how to manage those fleets are earning $50-65K.\n\nWe built a 4-week certification to get you there. No experience needed. Placement assistance after you pass.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Manufacturing Operator",
      search_hint: "manufacturing operator automation",
      location: "Detroit, MI",
      hook: "Cobots are being installed at 40% of manufacturing facilities. Operators who can program them earn 30-50% more.",
      subject: "Your manufacturing experience + cobot skills = $55-75K roles",
      body: "Your manufacturing experience is exactly what robotics companies need. Add cobot certification and you're looking at $55-75K roles that are impossible to fill right now.\n\nWe train you on the exact robots companies are deploying. 4 weeks, $399 early bird.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Forklift Operator",
      search_hint: "forklift operator career change",
      location: "Memphis, TN",
      hook: "Autonomous forklifts are coming. The transition role is AMR fleet operator, and it pays $15-25K more.",
      subject: "From forklift to fleet management: $45-65K certified role",
      body: "Autonomous forklifts are changing warehouse work. Fleet operators who manage those robots are in high demand now.\n\nOur 4-week program certifies you for AMR fleet management. No engineering degree needed. $45-65K starting.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Maintenance Technician",
      search_hint: "maintenance technician robotics opportunity",
      location: "Houston, TX",
      hook: "Robot technicians are the highest-demand role in automation. Your mechanical skills + certification = $60-80K.",
      subject: "Your maintenance background + robot cert = $60-80K roles",
      body: "Your maintenance background is exactly what robotics companies need. We add the robot-specific training. 4 weeks to certification, placement assistance included.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Military Veteran",
      search_hint: "veteran technical MOS career transition",
      location: "Dallas, TX",
      hook: "Veterans with technical MOS codes transition well to robot operations. Our cert accelerates that.",
      subject: "Your military technical training translates directly to robotics",
      body: "Your military technical training translates directly to robot operations. Our 4-week certification bridges the gap. Built for career transitions.\n\n$399 early bird. Placement assistance included.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Auto Plant Worker",
      search_hint: "former auto plant worker seeking",
      location: "Louisville, KY",
      hook: "Auto plants are automating fast. The people who service those robots earn more than assembly line wages.",
      subject: "Auto plants are adding robots. Be the person who runs them.",
      body: "You've seen automation change the floor. The people who service and operate those robots are earning $50-70K. Our 4-week certification gets you there.\n\nNo robotics experience needed. We start from fundamentals.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Career Changer",
      search_hint: "career change technology no experience",
      location: "Phoenix, AZ",
      hook: "Robotics is hiring faster than any automation field. No engineering degree needed.",
      subject: "4 weeks to a certified robotics career. No experience required.",
      body: "Robotics is hiring faster than any other automation field. You don't need an engineering degree.\n\nOur 4-week Operator Level 1 certification teaches you to operate, program, and troubleshoot the robots companies are actually deploying.\n\n$45-75K starting salary. $399 early bird.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Logistics Coordinator",
      search_hint: "logistics coordinator warehouse management",
      location: "Indianapolis, IN",
      hook: "Logistics is going autonomous. Fleet management skills are the upgrade path.",
      subject: "From logistics to robotics fleet management: a natural move",
      body: "You already understand warehouse operations. AMR fleet management is the next step. Our 4-week certification teaches you the robot-specific skills.\n\n$50-70K roles. Companies are hiring now.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Electrician",
      search_hint: "electrician automation industrial",
      location: "Columbus, OH",
      hook: "Industrial robot installation and maintenance needs electricians who understand automation.",
      subject: "Electricians who can work with robots earn $60-80K",
      body: "Your electrical skills are the foundation. Robot installation and maintenance is the growth path. Our 4-week certification adds the robotics-specific knowledge employers need.\n\n$60-80K roles. Placement assistance included.\n\nrobotomated.com/certification/operator-level-1",
    },
    {
      role: "Quality Inspector",
      search_hint: "quality inspector manufacturing",
      location: "Chicago, IL",
      hook: "Robot safety inspection is a growing certification path. Quality experience translates directly.",
      subject: "Quality inspection meets robotics: $55-75K safety inspector roles",
      body: "Your quality inspection background is exactly what robot safety inspection needs. Our certification adds the robotics-specific safety standards (ISO 10218, TS 15066).\n\n4 weeks. $399 early bird. Safety inspector roles are hard to fill.\n\nrobotomated.com/certification/operator-level-1",
    },
  ];

  // Generate 50 rows by cycling through targets with location variations
  const locations = [
    "Atlanta, GA", "Dallas, TX", "Chicago, IL", "Detroit, MI",
    "Houston, TX", "Phoenix, AZ", "Memphis, TN", "Louisville, KY",
    "Indianapolis, IN", "Columbus, OH", "Charlotte, NC", "Nashville, TN",
    "Kansas City, MO", "Milwaukee, WI", "Cincinnati, OH", "Pittsburgh, PA",
    "Cleveland, OH", "St. Louis, MO", "Minneapolis, MN", "Denver, CO",
  ];

  const rows: string[] = [];
  for (let i = 0; i < 50; i++) {
    const target = targets[i % targets.length];
    const location = locations[i % locations.length];

    rows.push(
      [
        escapeCSV(target.role),
        escapeCSV(target.search_hint),
        escapeCSV(location),
        escapeCSV(target.hook),
        escapeCSV(target.subject),
        escapeCSV(target.body),
        escapeCSV("not_sent"),
      ].join(",")
    );
  }

  const header =
    "target_role,linkedin_search_hint,target_location,hook,subject_line,body,send_status";
  const csv = header + "\n" + rows.join("\n");

  const outPath = join(process.cwd(), "scripts", "output", "outreach-batch-students.csv");
  writeFileSync(outPath, csv);
  console.log(`  Wrote ${rows.length} student leads to ${outPath}`);
  return rows.length;
}

async function main() {
  console.log("=== Robotomated Outreach Batch Generator ===\n");

  const employerCount = await generateEmployerOutreach();
  const studentCount = await generateStudentOutreach();

  console.log(
    `\nDone. Generated ${employerCount} employer + ${studentCount} student outreach templates.`
  );
  console.log("Files saved to scripts/output/");
}

main().catch(console.error);
