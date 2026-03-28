/**
 * Robotics market sizing data by category.
 * Sources: IFR World Robotics 2025, Mordor Intelligence, MarketsandMarkets, Grand View Research.
 * All figures in USD billions unless noted.
 */

export interface MarketCategory {
  slug: string;
  name: string;
  tam2026: number; // Total Addressable Market 2026 ($B)
  tam2030: number; // Projected TAM 2030 ($B)
  cagr: number; // CAGR percentage 2024-2030
  keyDrivers: string[];
  topCompanies: string[];
  adoptionStage: "early" | "growth" | "mature";
}

export const MARKET_DATA: MarketCategory[] = [
  {
    slug: "warehouse",
    name: "Warehouse & Logistics Robotics",
    tam2026: 18.5,
    tam2030: 35.2,
    cagr: 17.4,
    keyDrivers: ["E-commerce growth", "Labor shortages", "RaaS pricing models", "Same-day delivery pressure"],
    topCompanies: ["Amazon Robotics", "Locus Robotics", "AutoStore", "Symbotic", "Geek+", "6 River Systems"],
    adoptionStage: "growth",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Industrial Robotics",
    tam2026: 22.8,
    tam2030: 38.5,
    cagr: 14.2,
    keyDrivers: ["Reshoring manufacturing", "Cobot democratization", "AI-powered quality inspection", "SMB adoption"],
    topCompanies: ["FANUC", "ABB", "KUKA", "Yaskawa", "Universal Robots", "Doosan"],
    adoptionStage: "mature",
  },
  {
    slug: "consumer",
    name: "Consumer & Home Robotics",
    tam2026: 12.4,
    tam2030: 25.8,
    cagr: 20.1,
    keyDrivers: ["AI companion demand", "Robot vacuum maturation", "Home automation integration", "Aging population"],
    topCompanies: ["iRobot", "Roborock", "Ecovacs", "Dreame", "SoftBank Robotics", "Unitree"],
    adoptionStage: "growth",
  },
  {
    slug: "medical",
    name: "Medical & Surgical Robotics",
    tam2026: 16.8,
    tam2030: 32.4,
    cagr: 17.8,
    keyDrivers: ["Minimally invasive surgery demand", "Orthopedic joint replacement volume", "Rehabilitation tech", "Hospital labor costs"],
    topCompanies: ["Intuitive Surgical", "Stryker", "Medtronic", "Johnson & Johnson", "CMR Surgical"],
    adoptionStage: "growth",
  },
  {
    slug: "construction",
    name: "Construction Robotics",
    tam2026: 3.2,
    tam2030: 8.5,
    cagr: 22.8,
    keyDrivers: ["Construction labor shortage", "Safety regulations", "BIM integration", "Modular construction"],
    topCompanies: ["Boston Dynamics", "Built Robotics", "Dusty Robotics", "Hilti", "Trimble"],
    adoptionStage: "early",
  },
  {
    slug: "agricultural",
    name: "Agricultural Robotics",
    tam2026: 8.2,
    tam2030: 20.6,
    cagr: 25.5,
    keyDrivers: ["Farm labor crisis", "Organic demand", "Precision agriculture", "Climate adaptation"],
    topCompanies: ["John Deere", "FarmWise", "Verdant Robotics", "Naïo Technologies", "Carbon Robotics"],
    adoptionStage: "early",
  },
  {
    slug: "delivery",
    name: "Delivery & Last-Mile Robotics",
    tam2026: 1.3,
    tam2030: 3.3,
    cagr: 19.7,
    keyDrivers: ["Last-mile cost pressure", "Campus delivery demand", "Regulatory progress", "Autonomous vehicle tech"],
    topCompanies: ["Starship", "Nuro", "Serve Robotics", "Kiwibot", "Zipline"],
    adoptionStage: "early",
  },
  {
    slug: "drone",
    name: "Commercial Drones & Aerial",
    tam2026: 14.6,
    tam2030: 28.4,
    cagr: 18.2,
    keyDrivers: ["Infrastructure inspection", "Agricultural spraying", "BVLOS regulations", "Drone-in-a-box autonomy"],
    topCompanies: ["DJI", "Skydio", "Autel", "Parrot", "Wingtra", "AgEagle"],
    adoptionStage: "growth",
  },
  {
    slug: "software",
    name: "Robotics Software & Platforms",
    tam2026: 5.8,
    tam2030: 14.2,
    cagr: 24.8,
    keyDrivers: ["Fleet management demand", "ROS2 ecosystem", "AI/ML integration", "Multi-vendor orchestration"],
    topCompanies: ["NVIDIA", "Viam", "Intrinsic", "Formant", "InOrbit", "Ready Robotics"],
    adoptionStage: "early",
  },
];

export function getTotalMarketSize(year: "2026" | "2030"): number {
  return MARKET_DATA.reduce((sum, m) => sum + (year === "2026" ? m.tam2026 : m.tam2030), 0);
}

export function getTopGrowthCategories(n = 3): MarketCategory[] {
  return [...MARKET_DATA].sort((a, b) => b.cagr - a.cagr).slice(0, n);
}
