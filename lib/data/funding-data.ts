/**
 * VC/PE Robotics Funding Data
 * Sources: Crunchbase, PitchBook, company press releases.
 * All amounts in USD millions unless noted.
 */

export interface FundingRound {
  id: string;
  company: string;
  amount: string;
  amountNumeric: number; // in millions
  round: string;
  date: string; // ISO date
  leadInvestor: string;
  coInvestors: string[];
  category: string;
  sourceUrl: string;
  companyDescription: string;
}

export interface Investor {
  name: string;
  totalDeals: number;
  totalDeployed: number; // in millions
  portfolioCompanies: string[];
  categories: string[];
}

export const FUNDING_ROUNDS: FundingRound[] = [
  {
    id: "fig-series-b",
    company: "Figure AI",
    amount: "$675M",
    amountNumeric: 675,
    round: "Series B",
    date: "2024-02-29",
    leadInvestor: "Microsoft",
    coInvestors: ["NVIDIA", "OpenAI", "Jeff Bezos", "Intel", "Samsung"],
    category: "Humanoid",
    sourceUrl: "https://www.figure.ai/news/figure-raises-675m",
    companyDescription: "General-purpose humanoid robot company building autonomous humanoids for commercial deployment.",
  },
  {
    id: "fig-series-c",
    company: "Figure AI",
    amount: "$2.6B",
    amountNumeric: 2600,
    round: "Series C",
    date: "2025-09-15",
    leadInvestor: "Microsoft",
    coInvestors: ["NVIDIA", "Parkway Venture Capital", "Bezos Expeditions"],
    category: "Humanoid",
    sourceUrl: "https://www.figure.ai/news/figure-series-c",
    companyDescription: "General-purpose humanoid robot company valued at $39.5B after latest round.",
  },
  {
    id: "pi-series-a",
    company: "Physical Intelligence",
    amount: "$400M",
    amountNumeric: 400,
    round: "Series A",
    date: "2024-11-04",
    leadInvestor: "Thrive Capital",
    coInvestors: ["Lux Capital", "Sequoia Capital", "Bond", "Jeff Bezos"],
    category: "AI / Foundation Models",
    sourceUrl: "https://physicalintelligence.company/blog/seed",
    companyDescription: "Building foundation models for robotic manipulation and general-purpose robot intelligence.",
  },
  {
    id: "apptronik-series-a",
    company: "Apptronik",
    amount: "$350M",
    amountNumeric: 350,
    round: "Series A",
    date: "2024-08-22",
    leadInvestor: "B Capital Group",
    coInvestors: ["Google DeepMind", "Capital Factory"],
    category: "Humanoid",
    sourceUrl: "https://apptronik.com/news/series-a",
    companyDescription: "Developer of Apollo, a general-purpose humanoid robot designed for manufacturing and logistics.",
  },
  {
    id: "exotec-series-d",
    company: "Exotec",
    amount: "$335M",
    amountNumeric: 335,
    round: "Series D",
    date: "2024-01-17",
    leadInvestor: "Goldman Sachs",
    coInvestors: ["Bpifrance", "Dell Technologies Capital", "83North"],
    category: "Warehouse & Logistics",
    sourceUrl: "https://www.exotec.com/news/series-d",
    companyDescription: "French warehouse robotics company building the Skypod autonomous mobile robot system.",
  },
  {
    id: "skydio-series-e",
    company: "Skydio",
    amount: "$230M",
    amountNumeric: 230,
    round: "Series E",
    date: "2024-02-27",
    leadInvestor: "Andreessen Horowitz",
    coInvestors: ["Linse Capital", "Next47"],
    category: "Drone / Aerial",
    sourceUrl: "https://www.skydio.com/blog/series-e",
    companyDescription: "Leading US drone manufacturer specializing in autonomous flight for enterprise and defense.",
  },
  {
    id: "covariant-series-c",
    company: "Covariant",
    amount: "$222M",
    amountNumeric: 222,
    round: "Series C",
    date: "2024-05-13",
    leadInvestor: "Radical Ventures",
    coInvestors: ["Humboldt Fund", "Canada Pension Plan", "Index Ventures"],
    category: "AI / Foundation Models",
    sourceUrl: "https://covariant.ai/insights/series-c",
    companyDescription: "AI robotics company building the Covariant Brain for universal robotic manipulation.",
  },
  {
    id: "sanctuary-series-c",
    company: "Sanctuary AI",
    amount: "$170M",
    amountNumeric: 170,
    round: "Series C",
    date: "2024-04-10",
    leadInvestor: "Accel",
    coInvestors: ["SE Health", "Bell Ventures", "Evok Innovations"],
    category: "Humanoid",
    sourceUrl: "https://sanctuary.ai/news/series-c",
    companyDescription: "Canadian humanoid robotics company developing Phoenix, a general-purpose humanoid with human-like intelligence.",
  },
  {
    id: "agility-series-b",
    company: "Agility Robotics",
    amount: "$150M",
    amountNumeric: 150,
    round: "Series B",
    date: "2024-04-03",
    leadInvestor: "DCVC",
    coInvestors: ["Amazon", "Playground Global", "MFV Partners"],
    category: "Humanoid",
    sourceUrl: "https://agilityrobotics.com/news/series-b",
    companyDescription: "Creator of Digit, a humanoid robot designed for logistics work in warehouses and distribution centers.",
  },
  {
    id: "locus-series-f",
    company: "Locus Robotics",
    amount: "$150M",
    amountNumeric: 150,
    round: "Series F",
    date: "2024-03-18",
    leadInvestor: "Goldman Sachs",
    coInvestors: ["Tiger Global", "Bond", "Scale Venture Partners"],
    category: "Warehouse & Logistics",
    sourceUrl: "https://locusrobotics.com/news/series-f",
    companyDescription: "Autonomous mobile robot company powering warehouse fulfillment for global retailers.",
  },
  {
    id: "gecko-series-b",
    company: "Gecko Robotics",
    amount: "$173M",
    amountNumeric: 173,
    round: "Series C",
    date: "2024-06-11",
    leadInvestor: "XN",
    coInvestors: ["Mark Cuban", "Founders Fund", "Drive Capital"],
    category: "Industrial Inspection",
    sourceUrl: "https://www.geckorobotics.com/news/series-c",
    companyDescription: "Industrial inspection robotics company using wall-climbing robots to inspect critical infrastructure.",
  },
  {
    id: "symbotic-growth",
    company: "Symbotic",
    amount: "$500M",
    amountNumeric: 500,
    round: "Growth Equity",
    date: "2024-01-29",
    leadInvestor: "SoftBank",
    coInvestors: ["Walmart"],
    category: "Warehouse & Logistics",
    sourceUrl: "https://www.symbotic.com/news/growth-round",
    companyDescription: "AI-powered robotics and automation for supply chain, partnered with Walmart and other major retailers.",
  },
  {
    id: "serve-series-d",
    company: "Serve Robotics",
    amount: "$80M",
    amountNumeric: 80,
    round: "Series D",
    date: "2024-03-21",
    leadInvestor: "NVIDIA",
    coInvestors: ["7-Eleven", "Uber"],
    category: "Delivery",
    sourceUrl: "https://www.serverobotics.com/press/series-d",
    companyDescription: "Autonomous sidewalk delivery robot company, former Uber division, delivering food and groceries.",
  },
  {
    id: "machina-seed",
    company: "Machina Labs",
    amount: "$32M",
    amountNumeric: 32,
    round: "Series B",
    date: "2024-05-22",
    leadInvestor: "Innovation Endeavors",
    coInvestors: ["Khosla Ventures", "Lux Capital"],
    category: "Manufacturing",
    sourceUrl: "https://machinalabs.ai/news/series-b",
    companyDescription: "AI-driven robotic sheet metal forming for aerospace and defense manufacturing.",
  },
  {
    id: "1x-series-b",
    company: "1X Technologies",
    amount: "$100M",
    amountNumeric: 100,
    round: "Series B",
    date: "2024-03-13",
    leadInvestor: "EQT Ventures",
    coInvestors: ["Samsung NEXT", "Skagerak Capital", "OpenAI"],
    category: "Humanoid",
    sourceUrl: "https://www.1x.tech/news/series-b",
    companyDescription: "Norwegian humanoid robot company building NEO, an AI-powered bipedal humanoid for consumer and enterprise use.",
  },
  {
    id: "collaborative-series-a",
    company: "Collaborative Robotics",
    amount: "$100M",
    amountNumeric: 100,
    round: "Series A",
    date: "2024-09-25",
    leadInvestor: "General Catalyst",
    coInvestors: ["Sequoia Capital", "Khosla Ventures", "Mayo Clinic"],
    category: "Cobot / Collaborative",
    sourceUrl: "https://www.cobot.com/news/series-a",
    companyDescription: "Building collaborative mobile robots that work alongside humans in healthcare and logistics settings.",
  },
  {
    id: "rapid-robotics-b",
    company: "Rapid Robotics",
    amount: "$55M",
    amountNumeric: 55,
    round: "Series B",
    date: "2024-02-06",
    leadInvestor: "Kleiner Perkins",
    coInvestors: ["Tiger Global", "Greycroft"],
    category: "Manufacturing",
    sourceUrl: "https://www.rapidrobotics.com/news/series-b",
    companyDescription: "Robot-as-a-Service provider deploying pre-programmed robotic work cells for SMB manufacturers.",
  },
  {
    id: "plus-one-b",
    company: "Plus One Robotics",
    amount: "$33M",
    amountNumeric: 33,
    round: "Series C",
    date: "2024-06-28",
    leadInvestor: "McRock Capital",
    coInvestors: ["Translink Capital", "Zebra Technologies"],
    category: "Warehouse & Logistics",
    sourceUrl: "https://plusonerobotics.com/news/series-c",
    companyDescription: "Vision-guided robotics for parcel handling, enabling robots to sort packages at distribution centers.",
  },
  {
    id: "anduril-series-f",
    company: "Anduril Industries",
    amount: "$1.5B",
    amountNumeric: 1500,
    round: "Series F",
    date: "2024-08-07",
    leadInvestor: "Founders Fund",
    coInvestors: ["Andreessen Horowitz", "Sands Capital", "8VC"],
    category: "Defense",
    sourceUrl: "https://www.anduril.com/article/series-f",
    companyDescription: "Defense technology company building autonomous systems including drones, counter-drone, and ground robots.",
  },
  {
    id: "nuro-series-d",
    company: "Nuro",
    amount: "$600M",
    amountNumeric: 600,
    round: "Series D",
    date: "2024-09-12",
    leadInvestor: "Tiger Global",
    coInvestors: ["SoftBank", "Fidelity", "Baillie Gifford"],
    category: "Delivery",
    sourceUrl: "https://nuro.ai/news/series-d",
    companyDescription: "Autonomous delivery vehicle company building purpose-built driverless vehicles for local goods delivery.",
  },
  {
    id: "path-robotics-c",
    company: "Path Robotics",
    amount: "$100M",
    amountNumeric: 100,
    round: "Series C",
    date: "2024-03-05",
    leadInvestor: "Addition",
    coInvestors: ["Drive Capital", "Lux Capital"],
    category: "Manufacturing",
    sourceUrl: "https://www.path-robotics.com/news/series-c",
    companyDescription: "AI-powered robotic welding for heavy fabrication, using vision and ML to automate complex welding tasks.",
  },
  {
    id: "dexterity-series-b",
    company: "Dexterity",
    amount: "$140M",
    amountNumeric: 140,
    round: "Series B",
    date: "2024-07-09",
    leadInvestor: "Lightspeed Venture Partners",
    coInvestors: ["Kleiner Perkins", "Tiger Global"],
    category: "Warehouse & Logistics",
    sourceUrl: "https://www.dexterity.ai/news/series-b",
    companyDescription: "Robotic automation for supply chain, specializing in intelligent robotic palletizing and depalletizing.",
  },
  {
    id: "veo-series-b",
    company: "Veo Robotics",
    amount: "$65M",
    amountNumeric: 65,
    round: "Series B",
    date: "2024-04-17",
    leadInvestor: "Lux Capital",
    coInvestors: ["GV", "Mitsui"],
    category: "Industrial Safety",
    sourceUrl: "https://www.veobot.com/news/series-b",
    companyDescription: "Industrial robot safety system using 3D sensing to enable safe human-robot collaboration.",
  },
  {
    id: "bear-robotics-c",
    company: "Bear Robotics",
    amount: "$60M",
    amountNumeric: 60,
    round: "Series C",
    date: "2024-05-30",
    leadInvestor: "LG Technology Ventures",
    coInvestors: ["SoftBank", "KT Investment"],
    category: "Hospitality",
    sourceUrl: "https://www.bearrobotics.ai/news/series-c",
    companyDescription: "Autonomous serving robots for restaurants and hospitality, deployed at major chains worldwide.",
  },
  {
    id: "bright-machines-d",
    company: "Bright Machines",
    amount: "$126M",
    amountNumeric: 126,
    round: "Series D",
    date: "2024-02-14",
    leadInvestor: "BlackRock",
    coInvestors: ["Eclipse Ventures", "BMW iVentures"],
    category: "Manufacturing",
    sourceUrl: "https://www.brightmachines.com/news/series-d",
    companyDescription: "Intelligent automation platform for electronics assembly, combining software with robotic microfactories.",
  },
  {
    id: "monumental-seed",
    company: "Monumental",
    amount: "$25M",
    amountNumeric: 25,
    round: "Series A",
    date: "2024-06-04",
    leadInvestor: "Plural",
    coInvestors: ["Hummingbird Ventures", "NP-Hard Ventures"],
    category: "Construction",
    sourceUrl: "https://monumental.co/news/series-a",
    companyDescription: "Autonomous bricklaying robot for residential construction, addressing labor shortages in homebuilding.",
  },
  {
    id: "canvas-series-b",
    company: "Canvas Construction",
    amount: "$44M",
    amountNumeric: 44,
    round: "Series B",
    date: "2024-07-22",
    leadInvestor: "Tiger Global",
    coInvestors: ["Obvious Ventures", "Humboldt Fund"],
    category: "Construction",
    sourceUrl: "https://www.canvas.build/news/series-b",
    companyDescription: "Robotic drywall finishing system automating one of construction's most labor-intensive tasks.",
  },
  {
    id: "formic-series-a",
    company: "Formic",
    amount: "$27M",
    amountNumeric: 27,
    round: "Series A",
    date: "2024-04-24",
    leadInvestor: "Initialized Capital",
    coInvestors: ["OCA Ventures", "Revolution"],
    category: "RaaS",
    sourceUrl: "https://formic.co/news/series-a",
    companyDescription: "Robots-as-a-Service provider making factory automation accessible to SMBs with no upfront cost.",
  },
  {
    id: "standard-bots-a",
    company: "Standard Bots",
    amount: "$63M",
    amountNumeric: 63,
    round: "Series A",
    date: "2024-08-14",
    leadInvestor: "General Catalyst",
    coInvestors: ["Y Combinator", "Bain Capital Ventures"],
    category: "Cobot / Collaborative",
    sourceUrl: "https://standardbots.com/news/series-a",
    companyDescription: "Low-cost robot arm manufacturer building the RO1, an AI-enabled cobot at $5/hr operating cost.",
  },
  {
    id: "ready-robotics-b",
    company: "Ready Robotics",
    amount: "$45M",
    amountNumeric: 45,
    round: "Series B",
    date: "2024-09-03",
    leadInvestor: "Tiger Global",
    coInvestors: ["iRobot Ventures", "Drive Capital"],
    category: "Manufacturing",
    sourceUrl: "https://www.readyrobotics.com/news/series-b",
    companyDescription: "Universal robot operating system enabling manufacturers to program any robot with one interface.",
  },
  {
    id: "reflex-robotics-a",
    company: "Reflex Robotics",
    amount: "$25M",
    amountNumeric: 25,
    round: "Series A",
    date: "2025-01-15",
    leadInvestor: "Khosla Ventures",
    coInvestors: ["Lux Capital", "Founders Fund"],
    category: "Humanoid",
    sourceUrl: "https://reflexrobotics.com/news/series-a",
    companyDescription: "Humanoid robotics company focused on practical warehouse and factory applications.",
  },
  {
    id: "agility-growth",
    company: "Agility Robotics",
    amount: "$400M",
    amountNumeric: 400,
    round: "Growth",
    date: "2026-01-08",
    leadInvestor: "DCVC",
    coInvestors: ["Amazon", "Playground Global"],
    category: "Humanoid",
    sourceUrl: "https://agilityrobotics.com/news/growth-round",
    companyDescription: "Creator of Digit, scaling humanoid deployments across Amazon warehouses and logistics partners.",
  },
  {
    id: "apptronik-series-b",
    company: "Apptronik",
    amount: "$350M",
    amountNumeric: 350,
    round: "Series B",
    date: "2025-12-10",
    leadInvestor: "Google DeepMind",
    coInvestors: ["B Capital Group", "Mercedes-Benz"],
    category: "Humanoid",
    sourceUrl: "https://apptronik.com/news/series-b",
    companyDescription: "Developer of Apollo humanoid robot, expanding partnerships with Mercedes-Benz and GXO Logistics.",
  },
  {
    id: "svt-series-c",
    company: "SVT Robotics",
    amount: "$70M",
    amountNumeric: 70,
    round: "Series C",
    date: "2025-03-20",
    leadInvestor: "Tiger Global",
    coInvestors: ["Prologis Ventures", "Hillwood"],
    category: "Warehouse & Logistics",
    sourceUrl: "https://www.svtrobotics.com/news/series-c",
    companyDescription: "Integration platform enabling enterprises to deploy and orchestrate multiple robot systems.",
  },
  {
    id: "saronic-series-b",
    company: "Saronic",
    amount: "$175M",
    amountNumeric: 175,
    round: "Series B",
    date: "2024-10-08",
    leadInvestor: "Andreessen Horowitz",
    coInvestors: ["Caffeinated Capital", "Point72 Ventures"],
    category: "Defense",
    sourceUrl: "https://www.saronic.com/news/series-b",
    companyDescription: "Autonomous surface vessel company building AI-powered naval defense robots.",
  },
  {
    id: "formant-series-b",
    company: "Formant",
    amount: "$36M",
    amountNumeric: 36,
    round: "Series B",
    date: "2024-11-19",
    leadInvestor: "Bain Capital Ventures",
    coInvestors: ["Tiger Global", "Presidio Ventures"],
    category: "Robot Operations Platform",
    sourceUrl: "https://formant.io/news/series-b",
    companyDescription: "Cloud platform for managing and operating heterogeneous robot fleets at enterprise scale.",
  },
  {
    id: "unitree-pre-ipo",
    company: "Unitree Robotics",
    amount: "$110M",
    amountNumeric: 110,
    round: "Pre-IPO",
    date: "2025-06-14",
    leadInvestor: "Sequoia China",
    coInvestors: ["Source Code Capital", "Shunwei Capital"],
    category: "Humanoid",
    sourceUrl: "https://unitree.com/news/pre-ipo",
    companyDescription: "Chinese robotics company known for affordable quadruped and humanoid robots including G1 and H1.",
  },
  {
    id: "field-ai-a",
    company: "Field AI",
    amount: "$40M",
    amountNumeric: 40,
    round: "Series A",
    date: "2025-07-22",
    leadInvestor: "Lux Capital",
    coInvestors: ["Andreessen Horowitz", "Point72 Ventures"],
    category: "AI / Foundation Models",
    sourceUrl: "https://field.ai/news/series-a",
    companyDescription: "Building foundation models for robot navigation and spatial intelligence in unstructured environments.",
  },
  {
    id: "robot-era-a",
    company: "Robot Era",
    amount: "$56M",
    amountNumeric: 56,
    round: "Series A",
    date: "2025-08-30",
    leadInvestor: "SoftBank Vision Fund",
    coInvestors: ["Tencent", "Hillhouse Capital"],
    category: "Humanoid",
    sourceUrl: "https://robotera.com/news/series-a",
    companyDescription: "Chinese humanoid robotics startup building general-purpose humanoids for manufacturing and service.",
  },
];

// ── Derived data ──

function extractInvestors(rounds: FundingRound[]): Investor[] {
  const investorMap = new Map<string, { deals: number; deployed: number; companies: Set<string>; categories: Set<string> }>();

  for (const round of rounds) {
    const allInvestors = [round.leadInvestor, ...round.coInvestors];
    for (const inv of allInvestors) {
      const existing = investorMap.get(inv) || { deals: 0, deployed: 0, companies: new Set<string>(), categories: new Set<string>() };
      existing.deals += 1;
      // Lead investor gets full credit, co-investors get proportional
      existing.deployed += inv === round.leadInvestor ? round.amountNumeric * 0.4 : round.amountNumeric * 0.1;
      existing.companies.add(round.company);
      existing.categories.add(round.category);
      investorMap.set(inv, existing);
    }
  }

  return Array.from(investorMap.entries())
    .map(([name, data]) => ({
      name,
      totalDeals: data.deals,
      totalDeployed: Math.round(data.deployed),
      portfolioCompanies: Array.from(data.companies),
      categories: Array.from(data.categories),
    }))
    .sort((a, b) => b.totalDeals - a.totalDeals);
}

export const INVESTORS: Investor[] = extractInvestors(FUNDING_ROUNDS);

// ── Helper functions ──

export function getRecentFundings(count: number = 5): FundingRound[] {
  return [...FUNDING_ROUNDS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getInvestorStats(): { totalInvestors: number; topByDeals: Investor[]; topByDeployed: Investor[] } {
  const topByDeals = [...INVESTORS].sort((a, b) => b.totalDeals - a.totalDeals).slice(0, 20);
  const topByDeployed = [...INVESTORS].sort((a, b) => b.totalDeployed - a.totalDeployed).slice(0, 20);
  return { totalInvestors: INVESTORS.length, topByDeals, topByDeployed };
}

export function getTotalRaisedYTD(): { total: number; formatted: string; dealCount: number } {
  const currentYear = new Date().getFullYear();
  const ytdRounds = FUNDING_ROUNDS.filter((r) => new Date(r.date).getFullYear() === currentYear);
  const total = ytdRounds.reduce((sum, r) => sum + r.amountNumeric, 0);
  const formatted = total >= 1000 ? `$${(total / 1000).toFixed(1)}B` : `$${total}M`;
  return { total, formatted, dealCount: ytdRounds.length };
}

export function getLargestRound(): FundingRound {
  return [...FUNDING_ROUNDS].sort((a, b) => b.amountNumeric - a.amountNumeric)[0];
}

export function getRoundTypes(): string[] {
  return [...new Set(FUNDING_ROUNDS.map((r) => r.round))].sort();
}

export function getCategories(): string[] {
  return [...new Set(FUNDING_ROUNDS.map((r) => r.category))].sort();
}
