/**
 * Send Newsletter Issue #001 — The Robotomated Brief
 * Design: BOLT mascot, manufacturer logos, robot images, light/dark contrast rhythm
 * Run: npx tsx scripts/send-newsletter-001.ts
 */
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.RESEND_API_KEY) {
  console.error("ERROR: RESEND_API_KEY is not set in .env.local");
  process.exit(1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT = "The Robotomated Brief #001 — BOLT Scanned 975 Robots So You Don't Have To";
const FROM = "Robotomated <onboarding@resend.dev>";

// ── Why each robot ranks high ──
const ROBOT_WHYS: Record<string, string> = {
  "Intuitive da Vinci 5": "First surgical robot with force feedback. 9,000+ systems installed globally, 2.4M procedures per year.",
  "da Vinci 5": "Gold standard in robotic surgery. New gen adds haptics and a 10K+ instrument ecosystem.",
  "S8 MaxV Ultra": "10,000Pa suction, ReactiveAI 2.0 obstacle avoidance, and 8-in-1 dock. Best consumer robot vacuum on the market.",
  "Roborock S8 MaxV Ultra": "10,000Pa suction, ReactiveAI 2.0 obstacle avoidance, and 8-in-1 dock. Best consumer robot vacuum on the market.",
  "Boston Dynamics Atlas (Electric)": "All-electric redesign with range of motion exceeding human flexibility. The benchmark for humanoid agility.",
  "Boston Dynamics Spot": "1,500+ units deployed. The most versatile commercial quadruped for inspection, patrol, and data collection.",
  "Dusty Robotics FieldPrinter 2.0": "Prints BIM layouts directly onto concrete at 15x manual speed with 1mm accuracy. Multi-color trade differentiation.",
};

function getWhyText(name: string): string {
  return ROBOT_WHYS[name] || "Top-ranked across our 8-dimension RoboScore methodology.";
}

function formatUsd(n: number | null): string {
  if (n == null) return "Request quote";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

function getInitials(name: string): string {
  return name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ── BOLT mascot SVG (inline, retro 80s boxy robot) ──
const BOLT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" width="140" height="175">
  <!-- Antenna -->
  <line x1="80" y1="8" x2="80" y2="28" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
  <circle cx="80" cy="6" r="5" fill="#0EA5E9"/>
  <!-- Head -->
  <rect x="38" y="28" width="84" height="60" rx="8" fill="#334155"/>
  <rect x="42" y="32" width="76" height="52" rx="5" fill="#475569"/>
  <!-- Eyes -->
  <rect x="52" y="44" width="20" height="14" rx="3" fill="#0F172A"/>
  <rect x="54" y="46" width="16" height="10" rx="2" fill="#0EA5E9"/>
  <rect x="88" y="44" width="20" height="14" rx="3" fill="#0F172A"/>
  <rect x="90" y="46" width="16" height="10" rx="2" fill="#0EA5E9"/>
  <!-- Grin -->
  <rect x="56" y="68" width="48" height="8" rx="4" fill="#0F172A"/>
  <rect x="60" y="69" width="8" height="5" rx="1" fill="#FFFFFF"/>
  <rect x="72" y="69" width="8" height="5" rx="1" fill="#FFFFFF"/>
  <rect x="84" y="69" width="8" height="5" rx="1" fill="#FFFFFF"/>
  <!-- Neck -->
  <rect x="68" y="88" width="24" height="10" rx="2" fill="#475569"/>
  <!-- Body -->
  <rect x="28" y="98" width="104" height="70" rx="8" fill="#334155"/>
  <rect x="32" y="102" width="96" height="62" rx="5" fill="#475569"/>
  <!-- Lightning bolt -->
  <polygon points="72,110 84,110 78,128 90,128 68,152 74,136 62,136" fill="#0EA5E9"/>
  <!-- Arms -->
  <rect x="10" y="102" width="18" height="44" rx="6" fill="#334155"/>
  <rect x="132" y="102" width="18" height="44" rx="6" fill="#334155"/>
  <circle cx="19" cy="150" r="7" fill="#475569"/>
  <circle cx="141" cy="150" r="7" fill="#475569"/>
  <!-- Legs -->
  <rect x="44" y="168" width="22" height="24" rx="4" fill="#334155"/>
  <rect x="94" y="168" width="22" height="24" rx="4" fill="#334155"/>
  <rect x="40" y="188" width="30" height="10" rx="3" fill="#475569"/>
  <rect x="90" y="188" width="30" height="10" rx="3" fill="#475569"/>
</svg>`;

// Small BOLT head for "BOLT SAYS" section
const BOLT_HEAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="38 0 84 90" width="48" height="52">
  <line x1="80" y1="8" x2="80" y2="28" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
  <circle cx="80" cy="6" r="5" fill="#0EA5E9"/>
  <rect x="38" y="28" width="84" height="60" rx="8" fill="#334155"/>
  <rect x="42" y="32" width="76" height="52" rx="5" fill="#475569"/>
  <rect x="52" y="44" width="20" height="14" rx="3" fill="#0F172A"/>
  <rect x="54" y="46" width="16" height="10" rx="2" fill="#0EA5E9"/>
  <rect x="88" y="44" width="20" height="14" rx="3" fill="#0F172A"/>
  <rect x="90" y="46" width="16" height="10" rx="2" fill="#0EA5E9"/>
  <rect x="56" y="68" width="48" height="8" rx="4" fill="#0F172A"/>
  <rect x="60" y="69" width="8" height="5" rx="1" fill="#FFFFFF"/>
  <rect x="72" y="69" width="8" height="5" rx="1" fill="#FFFFFF"/>
  <rect x="84" y="69" width="8" height="5" rx="1" fill="#FFFFFF"/>
</svg>`;

// ── Robot card builder ──
interface RobotCard {
  name: string;
  mfr: string;
  mfrSlug: string;
  mfrLogoUrl: string | null;
  score: number;
  price: number | null;
  category: string;
  imageUrl: string | null;
}

function buildRobotCard(r: RobotCard, rank: number): string {
  const F = "Arial, Helvetica, sans-serif";
  const borderColor = rank === 1 ? "#0EA5E9" : rank === 2 ? "#94A3B8" : "#E2E4EA";
  const initials = getInitials(r.mfr);
  const catLabel = r.category.toUpperCase().replace(/&/g, "&amp;");

  const logoCell = r.mfrLogoUrl
    ? `<img src="${r.mfrLogoUrl}" alt="${r.mfr}" width="48" height="48" style="width:48px;height:48px;object-fit:contain;border:1px solid #E2E4EA;background:#FFFFFF;display:block;" onerror="this.style.display='none'">`
    : `<div style="width:48px;height:48px;background:#1E293B;color:#FFFFFF;font-family:${F};font-size:16px;font-weight:700;line-height:48px;text-align:center;">${initials}</div>`;

  const imageCell = r.imageUrl
    ? `<img src="${r.imageUrl}" alt="${r.name}" width="120" height="80" style="width:120px;height:80px;object-fit:cover;display:block;border:1px solid #E2E4EA;" onerror="this.style.display='none'">`
    : `<div style="width:120px;height:80px;background:#1E293B;color:#94A3B8;font-family:${F};font-size:10px;text-align:center;line-height:80px;">${catLabel}</div>`;

  return `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-left:4px solid ${borderColor};margin-bottom:16px;background:#FFFFFF;border:1px solid #E2E4EA;border-left:4px solid ${borderColor};">
    <tr>
      <td style="padding:20px 16px 12px;vertical-align:top;width:68px;">
        ${logoCell}
      </td>
      <td style="padding:20px 0 12px;vertical-align:top;font-family:${F};">
        <div style="color:#94A3B8;font-size:10px;letter-spacing:1px;font-weight:700;">#0${rank} &middot; ${catLabel}</div>
        <div style="color:#0F1117;font-size:15px;font-weight:700;margin-top:4px;line-height:1.3;">${r.name}</div>
        <div style="color:#94A3B8;font-size:12px;margin-top:2px;">${r.mfr}</div>
      </td>
      <td style="padding:20px 16px 12px;vertical-align:top;width:120px;">
        ${imageCell}
      </td>
    </tr>
    <tr>
      <td colspan="3" style="padding:0 16px 16px;font-family:${F};border-top:1px solid #F0F0F0;">
        <div style="color:#64748B;font-size:12px;font-style:italic;line-height:1.6;padding-top:12px;">${getWhyText(r.name)}</div>
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:12px;width:100%;">
          <tr>
            <td style="font-family:${F};">
              <a href="https://robotomated.com/explore" style="color:#0EA5E9;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.5px;font-family:${F};">VIEW ANALYSIS &rarr;</a>
            </td>
            <td style="text-align:right;font-family:${F};">
              <span style="display:inline-block;background:#0F1117;color:#FFFFFF;font-size:13px;font-weight:700;padding:4px 10px;font-family:${F};">${r.score.toFixed(1)}</span>
              <span style="color:#94A3B8;font-size:11px;margin-left:4px;font-family:${F};">/ 100</span>
              <span style="color:#94A3B8;font-size:11px;margin-left:8px;font-family:${F};">${formatUsd(r.price)}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

// ── Section label with horizontal rules ──
function sectionLabel(text: string): string {
  return `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;">
    <tr>
      <td style="border-bottom:1px solid #E2E4EA;width:32px;"><div style="height:1px;"></div></td>
      <td style="padding:0 12px;white-space:nowrap;">
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#94A3B8;text-transform:uppercase;font-weight:700;">${text}</span>
      </td>
      <td style="border-bottom:1px solid #E2E4EA;"><div style="height:1px;"></div></td>
    </tr>
  </table>`;
}

// ── Build full email HTML ──
function buildEmailHtml(opts: {
  topRobots: RobotCard[];
  totalRobots: number;
  marketInsight: string;
  fundingHighlight: string;
  unsubParam: string;
}): string {
  const { topRobots, totalRobots, marketInsight, fundingHighlight, unsubParam } = opts;
  const F = "Arial, Helvetica, sans-serif";
  const issueDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const robotCards = topRobots.map((r, i) => buildRobotCard(r, i + 1)).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>The Robotomated Brief #001</title>
</head>
<body style="margin:0;padding:0;background:#F2F2F2;font-family:${F};-webkit-font-smoothing:antialiased;">

<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#F2F2F2;">
<tr><td align="center" style="padding:24px 16px;">

<table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

  <!-- 1. HEADER -->
  <tr>
    <td style="background:#0F1117;padding:32px 32px 24px;text-align:center;">
      <div style="color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:4px;font-family:${F};">ROBOTOMATED</div>
      <div style="color:#64748B;font-size:11px;letter-spacing:3px;margin-top:6px;font-family:${F};">THE BRIEF</div>
      <div style="color:#475569;font-size:11px;margin-top:12px;font-family:${F};">Issue #001 &middot; ${issueDate} &middot; Weekly Robotics Intelligence</div>
    </td>
  </tr>

  <!-- 2. BOLT HERO -->
  <tr>
    <td style="background:#FFFFFF;padding:32px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="160" style="vertical-align:top;padding-right:20px;">
            ${BOLT_SVG}
          </td>
          <td style="vertical-align:top;font-family:${F};">
            <div style="color:#0F1117;font-size:20px;font-weight:700;line-height:1.35;margin-bottom:12px;">Hey &mdash; BOLT here.</div>
            <div style="color:#475569;font-size:14px;line-height:1.7;">Every week I scan ${totalRobots} robots across the $103B robotics market and surface what operations teams actually need to know. Independent scores. Verified specs. No manufacturer influence. Ever.</div>
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:16px;background:#F0F9FF;border:1px solid #BAE6FD;width:100%;">
              <tr>
                <td style="padding:12px 16px;font-family:${F};">
                  <div style="color:#0369A1;font-size:11px;letter-spacing:1px;font-weight:700;">THIS WEEK</div>
                  <div style="color:#0C4A6E;font-size:13px;margin-top:4px;line-height:1.5;">The state of robotics buying intelligence &mdash; what the data actually shows in 2026.</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 3. STATS BAR -->
  <tr>
    <td style="background:#0F1117;padding:0;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="33%" style="text-align:center;padding:24px 8px;border-right:1px solid #1E293B;">
            <div style="color:#FFFFFF;font-size:26px;font-weight:800;font-family:${F};line-height:1;">${totalRobots}</div>
            <div style="color:#64748B;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-top:6px;font-family:${F};">ROBOTS TRACKED</div>
          </td>
          <td width="33%" style="text-align:center;padding:24px 8px;border-right:1px solid #1E293B;">
            <div style="color:#FFFFFF;font-size:26px;font-weight:800;font-family:${F};line-height:1;">$103B</div>
            <div style="color:#64748B;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-top:6px;font-family:${F};">MARKET SIZE</div>
          </td>
          <td width="34%" style="text-align:center;padding:24px 8px;">
            <div style="color:#FFFFFF;font-size:26px;font-weight:800;font-family:${F};line-height:1;">+847%</div>
            <div style="color:#64748B;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-top:6px;font-family:${F};">HUMANOID GROWTH</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 4. WHY THIS MATTERS -->
  <tr>
    <td style="background:#F4F5F8;padding:32px;">
      ${sectionLabel("WHY THIS MATTERS")}
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="50%" style="padding:0 6px 12px 0;vertical-align:top;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border-top:3px solid #0EA5E9;">
              <tr><td style="padding:20px;font-family:${F};">
                <div style="color:#0F1117;font-size:22px;font-weight:800;">40-65%</div>
                <div style="color:#64748B;font-size:12px;margin-top:4px;line-height:1.5;">Labor cost reduction in automated facilities</div>
              </td></tr>
            </table>
          </td>
          <td width="50%" style="padding:0 0 12px 6px;vertical-align:top;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border-top:3px solid #0EA5E9;">
              <tr><td style="padding:20px;font-family:${F};">
                <div style="color:#0F1117;font-size:22px;font-weight:800;">18 mo</div>
                <div style="color:#64748B;font-size:12px;margin-top:4px;line-height:1.5;">Average ROI payback at standard utilization</div>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding:0 6px 0 0;vertical-align:top;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border-top:3px solid #0EA5E9;">
              <tr><td style="padding:20px;font-family:${F};">
                <div style="color:#0F1117;font-size:22px;font-weight:800;">$2.3M</div>
                <div style="color:#64748B;font-size:12px;margin-top:4px;line-height:1.5;">Average annual savings per automated facility</div>
              </td></tr>
            </table>
          </td>
          <td width="50%" style="padding:0 0 0 6px;vertical-align:top;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border-top:3px solid #0EA5E9;">
              <tr><td style="padding:20px;font-family:${F};">
                <div style="color:#0F1117;font-size:22px;font-weight:800;">99.5%</div>
                <div style="color:#64748B;font-size:12px;margin-top:4px;line-height:1.5;">Order accuracy in fully automated warehouses</div>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 5. TOP ROBOTS -->
  <tr>
    <td style="background:#FFFFFF;padding:32px;">
      ${sectionLabel("BOLT'S TOP PICKS THIS WEEK")}
      ${robotCards}
    </td>
  </tr>

  <!-- 6. RESKILLING CALLOUT -->
  <tr>
    <td style="background:#EFF6FF;padding:24px 32px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-left:3px solid #3B82F6;">
        <tr>
          <td style="padding:0 0 0 16px;font-family:${F};">
            <div style="color:#1E40AF;font-size:13px;font-weight:700;letter-spacing:0.5px;">RESKILLING INSIGHT</div>
            <div style="color:#1E3A5F;font-size:14px;line-height:1.7;margin-top:6px;">Facilities deploying cobots report 35% fewer workplace injuries and 22% lower employee turnover. Workers transition from repetitive tasks to robot supervision, maintenance, and quality oversight &mdash; higher-value roles with better retention.</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 7. MARKET PULSE -->
  <tr>
    <td style="background:#F4F5F8;padding:32px;">
      ${sectionLabel("MARKET PULSE")}
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border:1px solid #E2E4EA;">
        <tr>
          <td style="padding:24px;font-family:${F};">
            <div style="color:#334155;font-size:14px;line-height:1.7;">${marketInsight}</div>
            <div style="color:#94A3B8;font-size:11px;margin-top:14px;">Source: IFR World Robotics Report, Robotomated Market Intelligence</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FUNDING WATCH -->
  <tr>
    <td style="background:#F4F5F8;padding:0 32px 32px;">
      ${sectionLabel("FUNDING WATCH")}
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border:1px solid #E2E4EA;">
        <tr>
          <td style="padding:24px;font-family:${F};">
            <div style="color:#334155;font-size:14px;line-height:1.7;">${fundingHighlight}</div>
            <div style="margin-top:14px;">
              <a href="https://robotomated.com/market/funding" style="color:#0EA5E9;text-decoration:none;font-size:12px;font-weight:700;font-family:${F};">SEE ALL FUNDING ROUNDS &rarr;</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 8. BOLT SAYS -->
  <tr>
    <td style="background:#0F1117;padding:32px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="60" style="vertical-align:top;padding-right:16px;">
            ${BOLT_HEAD_SVG}
          </td>
          <td style="vertical-align:top;font-family:${F};">
            <div style="color:#64748B;font-size:10px;letter-spacing:2px;font-weight:700;margin-bottom:10px;">BOLT SAYS</div>
            <div style="color:#E2E8F0;font-size:14px;line-height:1.7;">Here is the thing about the $103B robotics market in 2026: almost every review you find online is funded by the company being reviewed. Manufacturer claims say 7-month cobot payback. Our data says the median is 11 months. Still excellent &mdash; but the gap between claim and reality is where bad purchases happen. That gap is exactly what we exist to close.</div>
            <div style="color:#64748B;font-size:12px;font-style:italic;margin-top:14px;">&mdash; Robotomated Research</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 9. CTA -->
  <tr>
    <td style="background:#0F1117;padding:0 32px 40px;text-align:center;border-top:1px solid #1E293B;">
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="margin-top:32px;">
        <tr>
          <td style="background:#0EA5E9;padding:14px 32px;">
            <a href="https://robotomated.com/explore" style="color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;font-family:${F};display:block;">EXPLORE THIS WEEK'S TOP ROBOTS &rarr;</a>
          </td>
        </tr>
      </table>
      <div style="color:#64748B;font-size:11px;margin-top:20px;letter-spacing:1px;font-family:${F};">BOLT WILL SEE YOU NEXT THURSDAY</div>
    </td>
  </tr>

  <!-- 10. FOOTER -->
  <tr>
    <td style="background:#0A0C10;padding:28px 32px;text-align:center;">
      <div style="color:#475569;font-size:11px;font-family:${F};">&copy; 2026 Robotomated &middot; <a href="https://robotomated.com" style="color:#475569;text-decoration:underline;">robotomated.com</a></div>
      <div style="color:#475569;font-size:11px;margin-top:8px;font-family:${F};">
        <a href="https://robotomated.com/unsubscribe?${unsubParam}" style="color:#475569;text-decoration:underline;">Unsubscribe</a>
        &nbsp;&middot;&nbsp;
        <a href="https://robotomated.com" style="color:#475569;text-decoration:underline;">View in browser</a>
        &nbsp;&middot;&nbsp;
        <a href="https://robotomated.com/privacy" style="color:#475569;text-decoration:underline;">Privacy Policy</a>
      </div>
    </td>
  </tr>

</table>

</td></tr>
</table>

</body>
</html>`;
}

// ── Main ──
async function main() {
  console.log("=== The Robotomated Brief #001 ===\n");

  // 1. Top 3 robots by RoboScore — with manufacturer logo and robot image
  const { data: topRobots, error: robotsErr } = await sb
    .from("robots")
    .select("slug, name, robo_score, price_current, images, manufacturers(slug, name, logo_url), robot_categories(slug, name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(3);

  if (robotsErr) { console.error("Error fetching robots:", robotsErr.message); process.exit(1); }

  const top3: RobotCard[] = (topRobots || []).map((r: Record<string, unknown>) => {
    const mfr = r.manufacturers as { slug: string; name: string; logo_url?: string | null } | null;
    const cat = r.robot_categories as { slug: string; name: string } | null;
    const images = (Array.isArray(r.images) ? r.images : []) as { url: string; alt: string }[];
    const firstImage = images[0]?.url || null;
    const validImage = firstImage && !firstImage.includes("unsplash") && !firstImage.includes("placeholder") ? firstImage : null;

    return {
      name: r.name as string,
      mfr: mfr?.name || "Unknown",
      mfrSlug: mfr?.slug || "",
      mfrLogoUrl: mfr?.logo_url || null,
      score: r.robo_score as number,
      price: r.price_current as number | null,
      category: cat?.name || "General",
      imageUrl: validImage,
    };
  });

  console.log("Top 3 robots:");
  top3.forEach((r, i) => console.log(`  ${i + 1}. ${r.name} (${r.mfr}) — ${r.score}/100 — ${formatUsd(r.price)} — logo: ${r.mfrLogoUrl ? "yes" : "no"} — img: ${r.imageUrl ? "yes" : "no"}`));

  // 2. Total robot count
  const { count: totalRobots } = await sb
    .from("robots")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  console.log(`\nTotal active robots: ${totalRobots}`);

  // 3. Market insight
  let marketInsight = "<strong style=\"color:#0F1117;\">Global robotics market:</strong> Projected to reach $75.3B by 2030 at 14.3% CAGR. Collaborative robots growing fastest at 32.5% CAGR. Asia-Pacific leads with 42% of global revenue.";

  const { data: reports } = await sb
    .from("market_reports")
    .select("title, market_size_usd_billions, cagr_percent, key_findings")
    .not("market_size_usd_billions", "is", null)
    .order("market_size_usd_billions", { ascending: false })
    .limit(1);

  if (reports && reports.length > 0) {
    const r = reports[0] as Record<string, unknown>;
    const findings = (r.key_findings as string[]) || [];
    const topFinding = findings[0] || "";
    marketInsight = `<strong style="color:#0F1117;">${r.title}:</strong> Market valued at <strong style="color:#0F1117;">$${r.market_size_usd_billions}B</strong> with a projected CAGR of ${r.cagr_percent}%. ${topFinding}`;
  }

  console.log("Market insight loaded from DB");

  // 4. Funding highlight
  let fundingHighlight = "<strong style=\"color:#0F1117;\">Figure AI</strong> raised <strong style=\"color:#0EA5E9;\">$675M Series B</strong> led by Jeff Bezos, Microsoft, and NVIDIA &mdash; the largest humanoid robotics round ever. The round values Figure at $2.6B pre-money.";

  const { data: rounds } = await sb
    .from("funding_rounds")
    .select("company, amount, round, investors")
    .order("date", { ascending: false })
    .limit(1);

  if (rounds && rounds.length > 0) {
    const f = rounds[0] as Record<string, unknown>;
    fundingHighlight = `<strong style="color:#0F1117;">${f.company}</strong> raised <strong style="color:#0EA5E9;">${f.amount} ${f.round || ""}</strong>${f.investors ? ` led by ${f.investors}` : ""}. Track all robotics funding rounds on our investment tracker.`;
  }

  console.log("Funding highlight loaded from DB");

  // 5. Get subscribers
  let subscribers: { email: string; unsubscribe_token?: string }[] = [];

  const { data: subs, error: subsErr } = await sb
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token");

  if (subsErr) {
    const { data: subs2, error: subsErr2 } = await sb
      .from("newsletter_subscribers")
      .select("email");
    if (subsErr2) { console.error("Error fetching subscribers:", subsErr2.message); process.exit(1); }
    subscribers = subs2 || [];
  } else {
    subscribers = subs || [];
  }

  if (subscribers.length === 0) {
    console.log("\nNo subscribers found. Nothing to send.");
    process.exit(0);
  }

  console.log(`\nSubscribers found: ${subscribers.length}`);

  // 6. Send
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const unsubParam = sub.unsubscribe_token
      ? `token=${sub.unsubscribe_token}`
      : `email=${encodeURIComponent(sub.email)}`;

    const html = buildEmailHtml({
      topRobots: top3,
      totalRobots: totalRobots || 975,
      marketInsight,
      fundingHighlight,
      unsubParam,
    });

    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: sub.email,
        subject: SUBJECT,
        html,
      });

      if (error) {
        console.error(`  FAIL: ${sub.email} — ${error.message}`);
        failed++;
      } else {
        console.log(`  SENT: ${sub.email}`);
        sent++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  FAIL: ${sub.email} — ${msg}`);
      failed++;
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`Sent: ${sent} | Failed: ${failed} | Total subscribers: ${subscribers.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
