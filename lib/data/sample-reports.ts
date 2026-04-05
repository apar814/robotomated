/**
 * Sample Market Intelligence Reports
 * Used as fallback when the market_reports table is empty.
 * Sources: IFR, MarketsandMarkets, Grand View Research, Allied Market Research
 */

export interface MarketReport {
  id: string;
  title: string;
  source: string;
  source_url: string | null;
  report_date: string; // ISO date
  category: string;
  market_size_usd_billions: number;
  cagr_percent: number;
  forecast_year: number;
  key_findings: string[];
}

export const SAMPLE_REPORTS: MarketReport[] = [
  {
    id: "sample-warehouse-robotics-2026",
    title: "Global Warehouse Robotics Market 2026",
    source: "IFR",
    source_url: null,
    report_date: "2026-01-15",
    category: "warehouse",
    market_size_usd_billions: 18.3,
    cagr_percent: 14.2,
    forecast_year: 2030,
    key_findings: [
      "Autonomous mobile robots (AMRs) account for 42% of warehouse deployments globally",
      "Labor shortages in logistics drive 3x adoption increase since 2023",
      "Top 5 vendors control 58% of the market — consolidation accelerating",
      "North America leads deployment density; Asia-Pacific leads unit volume",
    ],
  },
  {
    id: "sample-medical-robotics-2026",
    title: "Medical Robotics Market Analysis",
    source: "MarketsandMarkets",
    source_url: null,
    report_date: "2026-02-08",
    category: "medical",
    market_size_usd_billions: 12.7,
    cagr_percent: 17.4,
    forecast_year: 2030,
    key_findings: [
      "Surgical robotics dominates with 62% market share — da Vinci ecosystem still leads",
      "Rehabilitation robotics growing fastest at 24% CAGR, driven by aging populations",
      "FDA clearances for robotic-assisted procedures up 38% year-over-year",
      "Hospital ROI on surgical robots averages 14 months in high-volume centers",
    ],
  },
  {
    id: "sample-cobots-2026",
    title: "Collaborative Robots (Cobots) Market",
    source: "Grand View Research",
    source_url: null,
    report_date: "2025-11-20",
    category: "manufacturing",
    market_size_usd_billions: 8.5,
    cagr_percent: 32.5,
    forecast_year: 2030,
    key_findings: [
      "SMEs (under 250 employees) now represent 47% of new cobot deployments",
      "Average deployment cost dropped 35% since 2023, with sub-$25K entry points",
      "Machine tending and pick-and-place remain top applications at 54% combined",
      "Universal Robots holds 37% market share; Chinese OEMs gaining rapidly",
    ],
  },
  {
    id: "sample-agricultural-robotics-2026",
    title: "Agricultural Robotics Market",
    source: "Allied Market Research",
    source_url: null,
    report_date: "2025-12-05",
    category: "agriculture",
    market_size_usd_billions: 5.2,
    cagr_percent: 19.8,
    forecast_year: 2030,
    key_findings: [
      "Autonomous tractors and harvesters lead with 39% revenue share",
      "Weeding and crop monitoring drones growing at 28% CAGR",
      "Farm labor shortages in US, EU, and Japan are the primary demand driver",
      "Precision spraying robots reduce herbicide use by up to 90%",
    ],
  },
  {
    id: "sample-humanoid-robots-2026",
    title: "Humanoid Robots Market Outlook",
    source: "IFR",
    source_url: null,
    report_date: "2026-03-12",
    category: "humanoid",
    market_size_usd_billions: 2.8,
    cagr_percent: 41.2,
    forecast_year: 2035,
    key_findings: [
      "Projected to reach $94B by 2035 — the fastest-growing robotics segment",
      "China leads with 137 humanoid manufacturers; US remains pre-commercial",
      "Warehouse logistics and manufacturing are the first viable deployment verticals",
      "Fleet neural learning enables exponential capability improvement across deployments",
    ],
  },
];
