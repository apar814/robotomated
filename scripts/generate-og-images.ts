/**
 * Generate OG images as PNG from SVG templates using sharp
 * Run: npx tsx scripts/generate-og-images.ts
 */
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const PUBLIC = path.resolve(process.cwd(), "public");

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildOgSvg(opts: {
  subtitle?: string;
  stat1?: string;
  stat1Label?: string;
  stat2?: string;
  stat2Label?: string;
  stat3?: string;
  stat3Label?: string;
}): string {
  const {
    subtitle = "Independent Robotics Intelligence",
    stat1 = "602", stat1Label = "Robots Tracked",
    stat2 = "167", stat2Label = "Manufacturers",
    stat3 = "$103B", stat3Label = "Market Monitored",
  } = opts;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#080808"/>
      <stop offset="100%" stop-color="#0A0F1E"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <line x1="0" y1="157" x2="1200" y2="157"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="473" x2="1200" y2="473"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
  </g>
  <rect x="80" y="160" width="60" height="3" fill="#D4D4D4"/>
  <text x="80" y="210" font-family="Arial,Helvetica,sans-serif" font-size="14" fill="#D4D4D4" letter-spacing="4">ROBOTICS INTELLIGENCE PLATFORM</text>
  <text x="80" y="300" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="700" fill="#E8E8E8" letter-spacing="-2">ROBOTOMATED</text>
  <text x="80" y="355" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="#D4D4D4">${esc(subtitle)}</text>
  <rect x="80" y="390" width="1040" height="1" fill="#ffffff" fill-opacity="0.08"/>
  <text x="80" y="445" font-family="monospace" font-size="22" font-weight="700" fill="#D4D4D4">${esc(stat1)}</text>
  <text x="${80 + stat1.length * 15}" y="445" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#888888"> ${esc(stat1Label)}</text>
  <text x="380" y="445" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#333333">|</text>
  <text x="420" y="445" font-family="monospace" font-size="22" font-weight="700" fill="#D4D4D4">${esc(stat2)}</text>
  <text x="${420 + stat2.length * 15}" y="445" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#888888"> ${esc(stat2Label)}</text>
  <text x="690" y="445" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#333333">|</text>
  <text x="730" y="445" font-family="monospace" font-size="22" font-weight="700" fill="#D4D4D4">${esc(stat3)}</text>
  <text x="${730 + stat3.length * 15}" y="445" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#888888"> ${esc(stat3Label)}</text>
  <text x="80" y="540" font-family="monospace" font-size="16" fill="#555555">robotomated.com</text>
  <g fill="none" stroke="#D4D4D4" stroke-opacity="0.08" stroke-width="0.5">
    <circle cx="950" cy="200" r="80"/>
    <circle cx="1020" cy="280" r="50"/>
    <circle cx="880" cy="300" r="35"/>
    <line x1="950" y1="200" x2="1020" y2="280"/>
    <line x1="950" y1="200" x2="880" y2="300"/>
    <line x1="1020" y1="280" x2="880" y2="300"/>
  </g>
  <g fill="#D4D4D4" fill-opacity="0.15">
    <circle cx="950" cy="200" r="4"/>
    <circle cx="1020" cy="280" r="3"/>
    <circle cx="880" cy="300" r="3"/>
    <circle cx="1080" cy="180" r="2"/>
    <circle cx="1100" cy="350" r="2"/>
  </g>
</svg>`;
}

async function main() {
  console.log("Generating OG images...\n");

  // 1. Main OG image
  const mainSvg = buildOgSvg({});
  await sharp(Buffer.from(mainSvg)).png().toFile(path.join(PUBLIC, "og-image.png"));
  console.log("  Created: public/og-image.png (1200x630)");

  // 2. Industries OG image
  const industriesSvg = buildOgSvg({
    subtitle: "Robotics Solutions by Industry",
    stat1: "9", stat1Label: "Industries",
    stat2: "$140B+", stat2Label: "Combined Market",
    stat3: "27", stat3Label: "Case Studies",
  });
  await sharp(Buffer.from(industriesSvg)).png().toFile(path.join(PUBLIC, "og-industries.png"));
  console.log("  Created: public/og-industries.png (1200x630)");

  // 3. Explore OG image
  const exploreSvg = buildOgSvg({
    subtitle: "Browse & Compare Robots",
    stat1: "602", stat1Label: "Robots",
    stat2: "12", stat2Label: "Categories",
    stat3: "100", stat3Label: "RoboScore Dimensions",
  });
  await sharp(Buffer.from(exploreSvg)).png().toFile(path.join(PUBLIC, "og-explore.png"));
  console.log("  Created: public/og-explore.png (1200x630)");

  // 4. Market/Funding OG image
  const fundingSvg = buildOgSvg({
    subtitle: "Robotics Investment Tracker",
    stat1: "38+", stat1Label: "Funding Rounds",
    stat2: "$15B+", stat2Label: "Capital Tracked",
    stat3: "48", stat3Label: "Market Reports",
  });
  await sharp(Buffer.from(fundingSvg)).png().toFile(path.join(PUBLIC, "og-funding.png"));
  console.log("  Created: public/og-funding.png (1200x630)");

  // Verify sizes
  for (const f of ["og-image.png", "og-industries.png", "og-explore.png", "og-funding.png"]) {
    const stat = fs.statSync(path.join(PUBLIC, f));
    console.log(`  ${f}: ${Math.round(stat.size / 1024)}KB`);
  }

  console.log("\nDone.");
}

main().catch(console.error);
