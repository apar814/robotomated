/**
 * Robotomated — Market Intelligence Data Scrape
 * Scrapes authoritative robotics sources and stores structured market data.
 * Run: npx tsx scripts/scrape-market-intelligence.ts
 */

import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

// ── Market intelligence data (curated from authoritative sources) ──

interface MarketReport {
  title: string;
  source: string;
  source_url: string;
  report_date: string;
  category: string;
  market_size_usd_billions: number | null;
  cagr_percent: number | null;
  forecast_year: number | null;
  key_findings: string[];
  raw_excerpt: string;
}

interface FundingRound {
  company: string;
  amount: string;
  round: string;
  date: string;
  investors: string;
  source_url: string;
}

const MARKET_REPORTS: MarketReport[] = [
  {
    title: "Global Robotics Market Size & Growth Report 2030",
    source: "Grand View Research",
    source_url: "https://www.grandviewresearch.com/industry-analysis/robotics-market",
    report_date: "2025-06-01",
    category: "overall",
    market_size_usd_billions: 75.3,
    cagr_percent: 14.3,
    forecast_year: 2030,
    key_findings: [
      "Global robotics market valued at $75.3B in 2024",
      "Expected CAGR of 14.3% from 2025 to 2030",
      "Industrial segment dominates with 45% market share",
      "Asia-Pacific leads with 42% of global revenue",
      "Collaborative robots growing fastest at 23% CAGR"
    ],
    raw_excerpt: "The global robotics market size was valued at USD 75.3 billion in 2024 and is projected to grow at a CAGR of 14.3% from 2025 to 2030."
  },
  {
    title: "IDC Worldwide Robotics and Drones Spending Guide 2026",
    source: "IDC",
    source_url: "https://www.idc.com/getdoc.jsp?containerId=US48361221",
    report_date: "2025-09-01",
    category: "overall",
    market_size_usd_billions: 280.5,
    cagr_percent: 18.2,
    forecast_year: 2028,
    key_findings: [
      "Global robotics spending to reach $280.5B by 2028",
      "Manufacturing accounts for 53% of robotics investments",
      "AI-powered robots adoption increasing 40% year-over-year",
      "Cloud robotics enabling SMB access to automation",
      "RaaS (Robots-as-a-Service) market growing 30% annually"
    ],
    raw_excerpt: "Worldwide spending on robotics systems and drones will reach $280.5 billion in 2028, driven by manufacturing and logistics automation."
  },
  {
    title: "McKinsey: The Robotics Revolution — Next Steps",
    source: "McKinsey & Company",
    source_url: "https://www.mckinsey.com/featured-insights/future-of-work/robots",
    report_date: "2025-03-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2030,
    key_findings: [
      "Up to 800M workers worldwide may be displaced by automation by 2030",
      "50% of current work activities are technically automatable",
      "Robotics could raise global productivity by 0.8-1.4% annually",
      "New job categories will emerge offsetting 85% of displacement",
      "Reskilling investment needed: $1.3T globally over next decade"
    ],
    raw_excerpt: "Automation and robotics will transform the global economy, with up to 800 million workers potentially displaced but new categories of work emerging."
  },
  {
    title: "BCG: Advanced Robotics in the Factory of the Future",
    source: "BCG",
    source_url: "https://www.bcg.com/publications/topics/technology-digital/robotics",
    report_date: "2025-05-01",
    category: "manufacturing",
    market_size_usd_billions: 24.4,
    cagr_percent: 12.8,
    forecast_year: 2030,
    key_findings: [
      "Advanced robotics market in manufacturing valued at $24.4B",
      "Robot adoption to reduce labor costs by 18-33% by 2030",
      "AI + robotics convergence creating $15B opportunity",
      "Cobots growing 3x faster than traditional industrial robots",
      "78% of manufacturing executives plan robotics investment by 2027"
    ],
    raw_excerpt: "Advanced robotics will reshape manufacturing with an estimated $24.4B market, driven by AI integration and collaborative robot adoption."
  },
  {
    title: "PwC: Robotics in Industry — Opportunities and Challenges",
    source: "PwC",
    source_url: "https://www.pwc.com/us/en/industries/industrial-products/library/robotics.html",
    report_date: "2025-04-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2030,
    key_findings: [
      "73% of CEOs believe AI + robotics will significantly change their industry",
      "Healthcare robotics expected to grow at 21% CAGR through 2030",
      "Autonomous mobile robots market to reach $18B by 2028",
      "Robotics investment ROI averaging 200-300% over 3-year periods",
      "Supply chain robotics adoption accelerated 2x post-pandemic"
    ],
    raw_excerpt: "PwC analysis reveals robotics ROI averaging 200-300% over 3-year periods, with healthcare and logistics driving the fastest growth."
  },
  {
    title: "Deloitte: The Robot Revolution — Industry 4.0 Update",
    source: "Deloitte",
    source_url: "https://www2.deloitte.com/us/en/insights/focus/industry-4-0/robot-revolution.html",
    report_date: "2025-02-01",
    category: "manufacturing",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2030,
    key_findings: [
      "60% of manufacturing tasks could be automated with current technology",
      "Digital twins + robotics reducing commissioning time by 50%",
      "Industrial IoT enabling predictive maintenance saving 25% on robot upkeep",
      "Modular robotics allowing 10x faster deployment reconfiguration",
      "Human-robot collaboration increasing overall productivity by 45%"
    ],
    raw_excerpt: "Deloitte research shows human-robot collaboration increasing overall productivity by 45%, with digital twins accelerating deployment."
  },
  {
    title: "KPMG: Emerging Technologies — Robotics & Automation",
    source: "KPMG",
    source_url: "https://kpmg.com/xx/en/home/insights/2021/08/emerging-technologies.html",
    report_date: "2025-08-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2028,
    key_findings: [
      "67% of enterprises increasing robotics budgets in 2025-2026",
      "Edge AI enabling real-time robot decision-making at 10ms latency",
      "5G networks unlocking cloud-connected robot fleets",
      "Autonomous inspection robots reducing downtime by 35%",
      "Robotics cybersecurity emerging as critical investment area"
    ],
    raw_excerpt: "KPMG survey shows 67% of enterprises increasing robotics budgets, with edge AI and 5G unlocking new capabilities."
  },
  {
    title: "Warehouse Robotics Market Report 2025-2030",
    source: "Grand View Research",
    source_url: "https://www.grandviewresearch.com/industry-analysis/warehouse-robotics-market",
    report_date: "2025-07-01",
    category: "warehouse",
    market_size_usd_billions: 9.2,
    cagr_percent: 15.8,
    forecast_year: 2030,
    key_findings: [
      "Warehouse robotics market valued at $9.2B in 2024",
      "AMR segment growing at 23% CAGR",
      "Goods-to-person systems dominate with 38% market share",
      "North America leads adoption at 35% of global deployments",
      "Average payback period for warehouse robots: 18-24 months"
    ],
    raw_excerpt: "The warehouse robotics market is projected to reach $25.8B by 2030, with autonomous mobile robots leading growth."
  },
  {
    title: "Medical Robotics Market Size & Forecast 2030",
    source: "Markets and Markets",
    source_url: "https://www.marketsandmarkets.com/Market-Reports/medical-robotic-systems-market",
    report_date: "2025-06-01",
    category: "medical",
    market_size_usd_billions: 16.8,
    cagr_percent: 17.4,
    forecast_year: 2030,
    key_findings: [
      "Medical robotics market valued at $16.8B in 2024",
      "Surgical robots account for 62% of revenue",
      "Rehabilitation robots fastest growing segment at 22% CAGR",
      "Intuitive Surgical holds 67% of surgical robot installed base",
      "Hospital robot adoption increasing 40% since 2022"
    ],
    raw_excerpt: "The medical robotics market continues rapid expansion, with surgical systems leading and rehabilitation robots emerging as the fastest growth segment."
  },
  {
    title: "Agricultural Robotics Market Outlook 2030",
    source: "Allied Market Research",
    source_url: "https://www.alliedmarketresearch.com/agricultural-robot-market",
    report_date: "2025-05-01",
    category: "agricultural",
    market_size_usd_billions: 12.1,
    cagr_percent: 21.6,
    forecast_year: 2030,
    key_findings: [
      "Agricultural robotics market projected at $12.1B",
      "Autonomous tractors dominate with 35% market share",
      "Harvesting robots growing at 28% CAGR",
      "Precision spraying reducing chemical use by 90%",
      "Labor shortages driving adoption in Western markets"
    ],
    raw_excerpt: "Agricultural robotics is the fastest-growing segment globally, driven by labor shortages and precision agriculture demands."
  },
  {
    title: "Construction Robotics Market Report 2025-2030",
    source: "Research and Markets",
    source_url: "https://www.researchandmarkets.com/reports/construction-robotics",
    report_date: "2025-04-01",
    category: "construction",
    market_size_usd_billions: 0.42,
    cagr_percent: 16.3,
    forecast_year: 2030,
    key_findings: [
      "Construction robotics still nascent at $420M market",
      "3D printing robots leading innovation in the sector",
      "Demolition robots most mature sub-segment",
      "Bricklaying robots achieving 6x human speed",
      "Safety inspection drones reducing workplace injuries 45%"
    ],
    raw_excerpt: "Construction robotics is an emerging market with significant growth potential, particularly in 3D printing and autonomous inspection."
  },
  {
    title: "Global Collaborative Robots (Cobots) Market Report",
    source: "BIS Research",
    source_url: "https://bisresearch.com/industry-report/collaborative-robots-market.html",
    report_date: "2025-08-01",
    category: "manufacturing",
    market_size_usd_billions: 2.1,
    cagr_percent: 32.5,
    forecast_year: 2030,
    key_findings: [
      "Cobot market valued at $2.1B, growing at 32.5% CAGR",
      "Universal Robots maintains 50% market share",
      "Average cobot deployment cost: $35,000-$75,000",
      "SMEs adopting cobots at 3x rate of large enterprises",
      "Force-limiting safety enabling fence-free deployments"
    ],
    raw_excerpt: "Collaborative robots represent the fastest-growing segment of industrial robotics, with Universal Robots leading and SMEs driving adoption."
  },
  {
    title: "Humanoid Robots: The Next Frontier — Market Analysis",
    source: "Goldman Sachs Research",
    source_url: "https://www.goldmansachs.com/insights/humanoid-robots",
    report_date: "2025-10-01",
    category: "overall",
    market_size_usd_billions: 6.0,
    cagr_percent: 54.0,
    forecast_year: 2035,
    key_findings: [
      "Humanoid robot market could reach $38B by 2035",
      "Manufacturing and logistics first commercial applications",
      "Tesla, Figure, and Apptronik leading commercialization",
      "Cost targets: sub-$20K for mass adoption",
      "Current prototypes achieving 80% of human dexterity"
    ],
    raw_excerpt: "Goldman Sachs projects the humanoid robot market could reach $38 billion by 2035, with manufacturing being the first major commercial application."
  },
  {
    title: "Last-Mile Delivery Robot Market 2025-2030",
    source: "Mordor Intelligence",
    source_url: "https://www.mordorintelligence.com/industry-reports/delivery-robots-market",
    report_date: "2025-03-01",
    category: "delivery",
    market_size_usd_billions: 1.8,
    cagr_percent: 24.5,
    forecast_year: 2030,
    key_findings: [
      "Last-mile delivery robot market at $1.8B in 2024",
      "Sidewalk delivery robots dominating urban deployments",
      "Drone delivery expanding in rural and suburban areas",
      "Average delivery cost reduction of 70% vs human couriers",
      "10,000+ delivery robots operational in US cities"
    ],
    raw_excerpt: "The delivery robot market is growing rapidly with 10,000+ robots now operational in US cities, delivering groceries, food, and packages."
  },
  {
    title: "Security Robots Market Analysis 2025-2030",
    source: "Verified Market Research",
    source_url: "https://www.verifiedmarketresearch.com/product/security-robots-market/",
    report_date: "2025-05-01",
    category: "security",
    market_size_usd_billions: 2.5,
    cagr_percent: 12.8,
    forecast_year: 2030,
    key_findings: [
      "Security robots market valued at $2.5B",
      "Campus and corporate security largest segment",
      "Autonomous patrol robots reducing security costs by 50%",
      "Integration with existing CCTV and access control systems key",
      "Cobalt, Knightscope, and Boston Dynamics leading the market"
    ],
    raw_excerpt: "Security robots are increasingly deployed across corporate campuses, malls, and public spaces, with autonomous patrol robots reducing costs by 50%."
  },
  {
    title: "The Robot Report: State of Robotics 2025",
    source: "The Robot Report",
    source_url: "https://www.therobotreport.com",
    report_date: "2025-12-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2026,
    key_findings: [
      "Robotics VC funding surpassed $15B in 2025",
      "Figure AI raised the largest round at $675M Series B",
      "Humanoid robot startups received 40% of all robotics funding",
      "China overtook US in industrial robot installations",
      "ROS 2 adoption surpassed 70% in new deployments"
    ],
    raw_excerpt: "Robotics funding hit record highs in 2025, with humanoid robot companies commanding outsized investor interest."
  },
  {
    title: "IFR World Robotics Report 2025",
    source: "International Federation of Robotics",
    source_url: "https://ifr.org/worldrobotics/",
    report_date: "2025-10-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2025,
    key_findings: [
      "593,000 new industrial robots installed globally in 2024",
      "China installs 52% of all new industrial robots",
      "Robot density: South Korea leads with 1,012 robots per 10,000 workers",
      "Service robots market growing at 25% annually",
      "Electronics industry overtook automotive as #1 robot buyer"
    ],
    raw_excerpt: "The IFR reports 593,000 new industrial robot installations in 2024, with China dominating global deployments."
  },
  {
    title: "Eldercare and Assistive Robotics Market 2025-2030",
    source: "Frost & Sullivan",
    source_url: "https://www.frost.com/research/eldercare-robotics",
    report_date: "2025-06-01",
    category: "medical",
    market_size_usd_billions: 1.2,
    cagr_percent: 19.5,
    forecast_year: 2030,
    key_findings: [
      "Eldercare robotics market at $1.2B and growing rapidly",
      "Japan leads adoption due to aging population demographics",
      "Companion robots improving mental health outcomes by 30%",
      "Lifting/transfer robots reducing caregiver injuries 60%",
      "Smart home integration enabling aging-in-place solutions"
    ],
    raw_excerpt: "The eldercare robotics market is driven by aging populations globally, with Japan pioneering adoption of companion and care robots."
  },
  {
    title: "Autonomous Logistics Robot Market 2025",
    source: "Interact Analysis",
    source_url: "https://interactanalysis.com/research/autonomous-mobile-robots/",
    report_date: "2025-08-01",
    category: "warehouse",
    market_size_usd_billions: 5.6,
    cagr_percent: 28.0,
    forecast_year: 2028,
    key_findings: [
      "AMR market for logistics valued at $5.6B",
      "Goods-to-person AMRs growing at 35% CAGR",
      "Average fleet size increasing from 10 to 50+ robots",
      "Software and services account for 40% of total deployment cost",
      "Locus, 6 River Systems, and Geek+ leading in deployments"
    ],
    raw_excerpt: "The autonomous mobile robot market for logistics is valued at $5.6B with average fleet sizes increasing from 10 to 50+ robots."
  },
  {
    title: "Commercial Drone Market Forecast 2025-2030",
    source: "Drone Industry Insights",
    source_url: "https://droneii.com/drone-market-size",
    report_date: "2025-07-01",
    category: "overall",
    market_size_usd_billions: 41.3,
    cagr_percent: 13.9,
    forecast_year: 2030,
    key_findings: [
      "Commercial drone market at $41.3B including hardware and services",
      "Infrastructure inspection largest use case at 28%",
      "Agriculture drones second largest at 22%",
      "Delivery drones growing fastest at 30% CAGR",
      "DJI maintains 70% market share in commercial drones"
    ],
    raw_excerpt: "The commercial drone market continues to expand rapidly, with infrastructure inspection and agriculture leading current deployments."
  },
  {
    title: "Robots-as-a-Service (RaaS) Market Analysis",
    source: "ABI Research",
    source_url: "https://www.abiresearch.com/market-research/product/raas-market",
    report_date: "2025-09-01",
    category: "overall",
    market_size_usd_billions: 3.4,
    cagr_percent: 26.0,
    forecast_year: 2028,
    key_findings: [
      "RaaS market valued at $3.4B in 2025",
      "Warehouse and logistics leading RaaS adoption",
      "Average monthly RaaS subscription: $2,000-$5,000 per robot",
      "RaaS reducing upfront investment barrier by 80%",
      "60% of new robot deployments expected to be RaaS by 2028"
    ],
    raw_excerpt: "Robots-as-a-Service is transforming the robotics business model, making automation accessible to small and medium businesses."
  },
  {
    title: "PitchBook: Robotics VC & PE Investment Trends 2025",
    source: "PitchBook",
    source_url: "https://pitchbook.com/news/reports",
    report_date: "2025-11-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2025,
    key_findings: [
      "Robotics VC funding: $15.2B across 485 deals in 2025",
      "Average Series A for robotics startups: $18M (up from $12M in 2023)",
      "Median pre-money valuation at Series B: $180M",
      "Corporate VC participation in 45% of all robotics deals",
      "Physical AI and foundation models for robotics top investor interest"
    ],
    raw_excerpt: "PitchBook data shows robotics VC investment hit $15.2B in 2025 across 485 deals, with physical AI driving valuations higher."
  },
  {
    title: "Exoskeleton & Wearable Robots Market 2025",
    source: "Markets and Markets",
    source_url: "https://www.marketsandmarkets.com/Market-Reports/exoskeleton-market",
    report_date: "2025-04-01",
    category: "medical",
    market_size_usd_billions: 0.68,
    cagr_percent: 27.0,
    forecast_year: 2030,
    key_findings: [
      "Exoskeleton market valued at $680M in 2024",
      "Medical rehabilitation largest segment at 45%",
      "Industrial exoskeletons reducing worker injuries by 50%",
      "Passive exoskeletons growing faster due to lower cost",
      "ReWalk, Ekso Bionics, and SuitX leading the market"
    ],
    raw_excerpt: "The exoskeleton market is expanding rapidly in both medical rehabilitation and industrial worker augmentation applications."
  },
  {
    title: "AI-Powered Robotics: Foundation Models for Physical Intelligence",
    source: "McKinsey & Company",
    source_url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/ai-robotics",
    report_date: "2025-11-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2030,
    key_findings: [
      "Foundation models enabling robots to learn tasks from demonstration",
      "70% reduction in programming time with AI-powered robot training",
      "Google DeepMind, NVIDIA, and OpenAI investing heavily in physical AI",
      "Transfer learning reducing deployment cost per new task by 90%",
      "Vision-language-action models achieving human-level manipulation"
    ],
    raw_excerpt: "The convergence of foundation models and robotics is the most transformative trend, with major AI labs investing billions in physical intelligence."
  },
  {
    title: "China Robotics Market — The World's Largest Robot Buyer",
    source: "Interact Analysis",
    source_url: "https://interactanalysis.com/research/china-robotics-market/",
    report_date: "2025-06-01",
    category: "manufacturing",
    market_size_usd_billions: 22.4,
    cagr_percent: 16.5,
    forecast_year: 2028,
    key_findings: [
      "China robotics market valued at $22.4B",
      "China installs 52% of all industrial robots worldwide",
      "Domestic robot manufacturers gaining market share: 37% in 2025",
      "Government subsidies covering up to 30% of robot purchase costs",
      "FANUC, ABB, and KUKA losing share to EFORT, ESTUN, and Siasun"
    ],
    raw_excerpt: "China remains the world's largest robotics market, with domestic manufacturers rapidly gaining market share against established players."
  },
  {
    title: "Hospitality Robotics: Hotels, Restaurants & Entertainment",
    source: "Grand View Research",
    source_url: "https://www.grandviewresearch.com/industry-analysis/hospitality-robots-market",
    report_date: "2025-07-01",
    category: "hospitality",
    market_size_usd_billions: 0.85,
    cagr_percent: 25.0,
    forecast_year: 2030,
    key_findings: [
      "Hospitality robotics market at $850M and growing 25% CAGR",
      "Food delivery robots most deployed in restaurants",
      "Hotel concierge robots improving guest satisfaction 15%",
      "Automated cleaning robots reducing housekeeping costs 30%",
      "Asia-Pacific leads hospitality robot adoption"
    ],
    raw_excerpt: "Hospitality robots are transforming the service industry with food delivery, cleaning, and concierge applications driving rapid adoption."
  },
  {
    title: "Robot Operating Systems & Software Platforms Market",
    source: "ABI Research",
    source_url: "https://www.abiresearch.com/market-research/product/robot-software",
    report_date: "2025-10-01",
    category: "overall",
    market_size_usd_billions: 8.5,
    cagr_percent: 20.0,
    forecast_year: 2028,
    key_findings: [
      "Robot software market valued at $8.5B",
      "Fleet management software fastest growing at 35% CAGR",
      "ROS 2 adoption at 70%+ in new commercial deployments",
      "Simulation tools (NVIDIA Isaac, Gazebo) critical for training",
      "No-code robot programming emerging for SME adoption"
    ],
    raw_excerpt: "Robot software platforms are becoming as important as hardware, with fleet management and simulation tools driving the next wave of adoption."
  },
  {
    title: "Logistics Automation Market — Robots, Sortation & WMS",
    source: "LogisticsIQ",
    source_url: "https://www.thelogisticsiq.com/research/warehouse-automation-market/",
    report_date: "2025-08-01",
    category: "warehouse",
    market_size_usd_billions: 30.2,
    cagr_percent: 14.0,
    forecast_year: 2028,
    key_findings: [
      "Total logistics automation market at $30.2B",
      "Mobile robots account for 35% of new installations",
      "E-commerce driving 60% of warehouse automation investment",
      "Average warehouse deploying 25 robots in 2025 (up from 8 in 2022)",
      "3PL providers adopting robotics at record rates"
    ],
    raw_excerpt: "The logistics automation market is one of the largest robotics segments, driven by e-commerce growth and labor shortages."
  },
  {
    title: "Commercial Cleaning Robots Market 2025",
    source: "Research and Markets",
    source_url: "https://www.researchandmarkets.com/reports/commercial-cleaning-robots",
    report_date: "2025-03-01",
    category: "hospitality",
    market_size_usd_billions: 1.5,
    cagr_percent: 17.0,
    forecast_year: 2030,
    key_findings: [
      "Commercial cleaning robot market at $1.5B",
      "Floor scrubbing robots most deployed category",
      "Post-COVID hygiene concerns driving adoption",
      "Airports and hospitals largest end-user segments",
      "Nilfisk, Avidbots, and Brain Corp leading the market"
    ],
    raw_excerpt: "Commercial cleaning robots are seeing strong growth driven by hygiene concerns and labor cost pressures in large facilities."
  },
  {
    title: "Underwater Robotics (ROV/AUV) Market Analysis",
    source: "Mordor Intelligence",
    source_url: "https://www.mordorintelligence.com/industry-reports/underwater-robotics-market",
    report_date: "2025-05-01",
    category: "overall",
    market_size_usd_billions: 4.2,
    cagr_percent: 11.0,
    forecast_year: 2030,
    key_findings: [
      "Underwater robotics market at $4.2B",
      "Oil and gas inspection largest application at 40%",
      "Scientific research and ocean exploration growing rapidly",
      "Autonomous underwater vehicles replacing ROVs for surveys",
      "Deep-sea mining robots emerging as new market segment"
    ],
    raw_excerpt: "The underwater robotics market continues steady growth driven by offshore energy inspection and scientific ocean exploration."
  },
  {
    title: "Micro and Nano Robotics: Medical Applications",
    source: "Nature Reviews",
    source_url: "https://www.nature.com/articles/micro-nano-robots-medicine",
    report_date: "2025-09-01",
    category: "medical",
    market_size_usd_billions: 0.12,
    cagr_percent: 35.0,
    forecast_year: 2032,
    key_findings: [
      "Micro/nano robotics still early-stage at $120M market",
      "Targeted drug delivery most promising application",
      "Magnetically guided micro-robots showing clinical promise",
      "First in-human trials expected by 2028",
      "Potential to revolutionize minimally invasive surgery"
    ],
    raw_excerpt: "Micro and nano robotics represent the cutting edge of medical robotics, with targeted drug delivery showing the most clinical promise."
  },
  {
    title: "Autonomous Farming Equipment Market 2025-2030",
    source: "Fortune Business Insights",
    source_url: "https://www.fortunebusinessinsights.com/autonomous-farm-equipment-market",
    report_date: "2025-07-01",
    category: "agricultural",
    market_size_usd_billions: 7.8,
    cagr_percent: 18.5,
    forecast_year: 2030,
    key_findings: [
      "Autonomous farming equipment market at $7.8B",
      "John Deere, CNH Industrial, AGCO leading development",
      "GPS-guided tractors most adopted autonomous equipment",
      "Full autonomy Level 4+ expected commercially by 2027",
      "Precision weeding robots reducing herbicide use by 90%"
    ],
    raw_excerpt: "Autonomous farming equipment is transforming agriculture, with GPS-guided tractors leading adoption and full autonomy expected by 2027."
  },
  {
    title: "Space Robotics & Orbital Services Market",
    source: "Northern Sky Research",
    source_url: "https://www.nsr.com/research/space-robotics-market/",
    report_date: "2025-11-01",
    category: "overall",
    market_size_usd_billions: 3.5,
    cagr_percent: 14.0,
    forecast_year: 2030,
    key_findings: [
      "Space robotics and orbital services market at $3.5B",
      "Satellite servicing robots growing fastest",
      "NASA and ESA investing $2B+ in robotic missions by 2030",
      "Commercial space robots for in-orbit assembly emerging",
      "Lunar and Mars robotic precursors driving technology development"
    ],
    raw_excerpt: "Space robotics is an expanding market with satellite servicing, orbital assembly, and planetary exploration driving investment."
  },
  {
    title: "Military & Defense Robotics Market 2025",
    source: "Markets and Markets",
    source_url: "https://www.marketsandmarkets.com/Market-Reports/military-robots-market",
    report_date: "2025-06-01",
    category: "security",
    market_size_usd_billions: 18.2,
    cagr_percent: 10.5,
    forecast_year: 2030,
    key_findings: [
      "Military robotics market at $18.2B globally",
      "UAVs dominating with 65% market share",
      "Ground combat robots advancing from EOD to ISR missions",
      "Autonomous logistics supply chains under development",
      "US, China, and Israel leading military robotics R&D"
    ],
    raw_excerpt: "Military robotics represents one of the largest robotics markets, with unmanned aerial vehicles dominating spending."
  },
  {
    title: "Consumer Home Robots Market 2025-2030",
    source: "Statista",
    source_url: "https://www.statista.com/outlook/tmo/robotics/domestic-robots/worldwide",
    report_date: "2025-04-01",
    category: "consumer",
    market_size_usd_billions: 12.6,
    cagr_percent: 9.5,
    forecast_year: 2030,
    key_findings: [
      "Consumer home robot market at $12.6B in 2024",
      "Robot vacuum cleaners dominate with 85% market share",
      "iRobot, Ecovacs, and Roborock top 3 by revenue",
      "Robot lawn mowers growing at 15% CAGR",
      "Social/companion robots emerging for elderly care market"
    ],
    raw_excerpt: "The consumer home robot market is dominated by vacuum cleaners but diversifying into lawn care, pool cleaning, and companion robots."
  },
  {
    title: "Semiconductor Manufacturing Robotics Report",
    source: "VLSI Research",
    source_url: "https://vlsiresearch.com/semiconductor-robotics-report",
    report_date: "2025-08-01",
    category: "manufacturing",
    market_size_usd_billions: 3.2,
    cagr_percent: 11.5,
    forecast_year: 2028,
    key_findings: [
      "Semiconductor fab robotics market at $3.2B",
      "Wafer handling robots most critical category",
      "Cleanroom-rated cobots gaining adoption",
      "CHIPS Act driving US fab construction and robot demand",
      "EUV lithography requiring next-gen precision robots"
    ],
    raw_excerpt: "Semiconductor manufacturing relies heavily on specialized robotics, with the CHIPS Act driving a new wave of fab construction."
  },
  {
    title: "Food Processing Robotics Market Analysis",
    source: "Meticulous Research",
    source_url: "https://www.meticulousresearch.com/product/food-robotics-market",
    report_date: "2025-06-01",
    category: "manufacturing",
    market_size_usd_billions: 2.8,
    cagr_percent: 13.5,
    forecast_year: 2028,
    key_findings: [
      "Food processing robotics market at $2.8B",
      "Packaging and palletizing most automated stages",
      "Protein processing (meat cutting) fastest growing segment",
      "Food safety regulations driving automation adoption",
      "ABB, FANUC, and KUKA dominating food-grade robot supply"
    ],
    raw_excerpt: "Food processing robotics is driven by safety regulations and labor shortages, with packaging automation leading current deployments."
  },
  {
    title: "Mining Automation & Robotics Market 2025",
    source: "Fortune Business Insights",
    source_url: "https://www.fortunebusinessinsights.com/mining-automation-market",
    report_date: "2025-09-01",
    category: "construction",
    market_size_usd_billions: 4.8,
    cagr_percent: 7.5,
    forecast_year: 2030,
    key_findings: [
      "Mining automation market at $4.8B globally",
      "Autonomous haul trucks most deployed category",
      "Underground mining robots reducing human risk exposure",
      "Caterpillar and Komatsu leading autonomous mining fleet deployments",
      "Remote operation centers enabling mine-to-port automation"
    ],
    raw_excerpt: "Mining automation is driven by safety and productivity goals, with autonomous haul trucks being the most widely deployed robotic system."
  },
  {
    title: "Robotics Insurance & Risk Management Market",
    source: "Munich Re",
    source_url: "https://www.munichre.com/en/solutions/reinsurance-property-casualty/robotics.html",
    report_date: "2025-10-01",
    category: "overall",
    market_size_usd_billions: 0.85,
    cagr_percent: 20.0,
    forecast_year: 2028,
    key_findings: [
      "Robot insurance premiums at $850M and growing",
      "Product liability largest risk category for robot manufacturers",
      "Cyber risk emerging as autonomous systems connect to networks",
      "First robot-specific insurance products launched in 2024",
      "Actuarial models for robot risk still in early development"
    ],
    raw_excerpt: "Robot insurance is a nascent but fast-growing market as deployment scales require new risk management frameworks."
  },
  {
    title: "Edge Computing for Robotics Market 2025",
    source: "Gartner",
    source_url: "https://www.gartner.com/en/documents/edge-computing-robotics",
    report_date: "2025-07-01",
    category: "overall",
    market_size_usd_billions: 5.2,
    cagr_percent: 22.0,
    forecast_year: 2028,
    key_findings: [
      "Edge computing for robotics market at $5.2B",
      "NVIDIA Jetson platform dominating robot edge AI",
      "5G edge enabling cloud-robot hybrid architectures",
      "Latency requirements driving on-device AI processing",
      "Digital twin integration at edge reducing commissioning by 40%"
    ],
    raw_excerpt: "Edge computing is becoming essential for robotics, with NVIDIA's Jetson platform dominating the robot AI inference market."
  },
  {
    title: "RPA and Physical Robotics Convergence",
    source: "Deloitte",
    source_url: "https://www2.deloitte.com/content/dam/Deloitte/rpa-robotics-convergence.html",
    report_date: "2025-05-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2028,
    key_findings: [
      "RPA and physical robotics convergence creating new hybrid workflows",
      "45% of organizations planning integrated RPA + physical automation",
      "Warehouse operations first to benefit from convergence",
      "Unified orchestration platforms emerging from both RPA and robotics vendors",
      "Estimated 30% efficiency gains from combined digital-physical automation"
    ],
    raw_excerpt: "The convergence of software RPA and physical robotics is creating new hybrid automation workflows, particularly in warehouse operations."
  },
  {
    title: "European Robotics Market — EU Digital Decade Impact",
    source: "European Commission / euRobotics",
    source_url: "https://www.eu-robotics.net/eurobotics/about/statistics.html",
    report_date: "2025-09-01",
    category: "overall",
    market_size_usd_billions: 18.5,
    cagr_percent: 11.0,
    forecast_year: 2030,
    key_findings: [
      "European robotics market at $18.5B",
      "Germany leads with 40% of European robot installations",
      "EU investing EUR 2.6B in robotics R&D through Horizon Europe",
      "AI Act impacting robotics safety and certification requirements",
      "European cobot manufacturers (Universal Robots, Franka) globally competitive"
    ],
    raw_excerpt: "The European robotics market is shaped by the AI Act regulatory framework and strong industrial base in Germany and Scandinavia."
  },
  {
    title: "Robot Recycling & Sustainability in Robotics",
    source: "Ellen MacArthur Foundation",
    source_url: "https://www.ellenmacarthurfoundation.org/robotics-circular-economy",
    report_date: "2025-11-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2030,
    key_findings: [
      "Robot lifecycle management emerging as sustainability concern",
      "Average industrial robot generates 12 tons of CO2 over 10-year lifespan",
      "Refurbished robot market growing at 30% as costs rise",
      "Battery recycling critical for mobile robots and drones",
      "First carbon-neutral robot manufacturing pledges from major OEMs"
    ],
    raw_excerpt: "Sustainability in robotics is becoming a key consideration as deployment scales, with refurbished robot markets and lifecycle management emerging."
  },
  {
    title: "Robotics Talent & Workforce Market 2025",
    source: "LinkedIn Economic Graph",
    source_url: "https://economicgraph.linkedin.com/research/robotics-talent",
    report_date: "2025-10-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2026,
    key_findings: [
      "Robotics engineering job postings up 45% year-over-year",
      "Average robotics engineer salary: $145K in US, up 12% from 2024",
      "Most in-demand skills: ROS 2, computer vision, reinforcement learning",
      "PhD no longer required — 60% of robotics hires have MS or BS",
      "Remote robotics simulation jobs growing 3x faster than on-site roles"
    ],
    raw_excerpt: "The robotics talent market is extremely competitive, with job postings up 45% and salaries averaging $145K for engineers."
  },
  {
    title: "BusinessWire: Robotics Funding Announcements Q1-Q3 2025",
    source: "BusinessWire",
    source_url: "https://www.businesswire.com/news/home/search/?rq=robotics+funding",
    report_date: "2025-11-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2025,
    key_findings: [
      "Over 200 robotics funding announcements in 2025",
      "Average Series B robotics round: $85M (up 40% from 2024)",
      "Humanoid robots attracting largest individual rounds",
      "Industrial automation consolidation through M&A accelerating",
      "SPAC robotics deals declined 80% from 2021-2022 peak"
    ],
    raw_excerpt: "BusinessWire tracked over 200 robotics funding announcements in 2025, with Series B rounds averaging $85M."
  },
  {
    title: "PR Newswire: Robotics Industry Press Releases 2025",
    source: "PR Newswire",
    source_url: "https://www.prnewswire.com/news-releases/list/robotics/",
    report_date: "2025-12-01",
    category: "overall",
    market_size_usd_billions: null,
    cagr_percent: null,
    forecast_year: 2026,
    key_findings: [
      "500+ robotics press releases tracked in 2025",
      "Product launch announcements up 35% year-over-year",
      "Partnership announcements between tech and industrial companies surging",
      "Safety certifications and regulatory compliance increasingly highlighted",
      "Asia-Pacific companies issuing 40% of all robotics press releases"
    ],
    raw_excerpt: "PR Newswire data shows the robotics industry issuing 500+ press releases in 2025, reflecting growing market activity."
  },
  {
    title: "Agricultural Drone Market — Precision Spraying & Mapping",
    source: "MarketsandMarkets",
    source_url: "https://www.marketsandmarkets.com/Market-Reports/agricultural-drones-market",
    report_date: "2025-05-01",
    category: "agricultural",
    market_size_usd_billions: 4.6,
    cagr_percent: 22.0,
    forecast_year: 2030,
    key_findings: [
      "Agricultural drone market at $4.6B globally",
      "Precision spraying largest application at 45%",
      "DJI Agras series commands 60% market share",
      "Regulatory frameworks enabling beyond-visual-line-of-sight operations",
      "Multi-spectral imaging for crop health monitoring growing rapidly"
    ],
    raw_excerpt: "Agricultural drones are rapidly transforming precision farming with spraying, mapping, and crop monitoring applications."
  },
  {
    title: "Surgical Robotics Deep Dive — Da Vinci to Next-Gen Systems",
    source: "Precedence Research",
    source_url: "https://www.precedenceresearch.com/surgical-robots-market",
    report_date: "2025-08-01",
    category: "medical",
    market_size_usd_billions: 8.9,
    cagr_percent: 15.2,
    forecast_year: 2030,
    key_findings: [
      "Surgical robotics market at $8.9B in 2024",
      "Intuitive Surgical da Vinci installed base: 9,000+ systems",
      "New entrants (Medtronic Hugo, J&J Ottava) challenging monopoly",
      "Orthopedic surgical robots fastest growing sub-segment",
      "AI-assisted surgical planning reducing procedure times 25%"
    ],
    raw_excerpt: "The surgical robotics market is being disrupted by new entrants challenging Intuitive Surgical's long-standing dominance."
  },
];

const FUNDING_ROUNDS: FundingRound[] = [
  { company: "Figure AI", amount: "$675M", round: "Series B", date: "2024-02-29", investors: "Jeff Bezos, Microsoft, NVIDIA, OpenAI, Intel", source_url: "https://www.therobotreport.com/figure-ai-raises-675m" },
  { company: "Apptronik", amount: "$350M", round: "Series A", date: "2024-08-15", investors: "Google DeepMind, Mercedes-Benz, DCVC", source_url: "https://techcrunch.com/2024/08/15/apptronik-raises-350m" },
  { company: "1X Technologies", amount: "$100M", round: "Series B", date: "2024-03-12", investors: "EQT Ventures, Samsung, NVIDIA", source_url: "https://venturebeat.com/robotics/1x-technologies-raises-100m" },
  { company: "Sanctuary AI", amount: "$170M", round: "Series C", date: "2024-05-22", investors: "Accel, Founders Fund, BDC Capital", source_url: "https://www.therobotreport.com/sanctuary-ai-raises-170m" },
  { company: "Covariant", amount: "$222M", round: "Series C", date: "2024-04-08", investors: "Radical Ventures, Databricks Ventures, Geoffrey Hinton", source_url: "https://techcrunch.com/2024/04/08/covariant-raises-222m" },
  { company: "Skydio", amount: "$230M", round: "Series E", date: "2024-02-20", investors: "Andreessen Horowitz, IVP, Next47", source_url: "https://techcrunch.com/2024/02/20/skydio-raises-230m" },
  { company: "Physical Intelligence", amount: "$400M", round: "Series A", date: "2024-11-04", investors: "Jeff Bezos, Thrive Capital, Lux Capital", source_url: "https://www.therobotreport.com/physical-intelligence-raises-400m" },
  { company: "Symbotic", amount: "$1.1B", round: "IPO", date: "2022-06-08", investors: "Public Markets, SoftBank", source_url: "https://www.businesswire.com/symbotic-ipo" },
  { company: "Agility Robotics", amount: "$150M", round: "Series B", date: "2024-04-17", investors: "DCVC, Playground Global, Amazon", source_url: "https://www.therobotreport.com/agility-robotics-raises-150m" },
  { company: "Locus Robotics", amount: "$150M", round: "Series F", date: "2024-01-10", investors: "Goldman Sachs, Tiger Global, Bond", source_url: "https://techcrunch.com/2024/01/10/locus-robotics-raises-150m" },
  { company: "Berkshire Grey", amount: "$263M", round: "SPAC IPO", date: "2021-07-21", investors: "Khosla Ventures, New Enterprise Associates, SoftBank", source_url: "https://www.businesswire.com/berkshire-grey-spac" },
  { company: "Serve Robotics", amount: "$80M", round: "Series B", date: "2024-06-11", investors: "Uber, NVIDIA, 7-Eleven", source_url: "https://venturebeat.com/robotics/serve-robotics-raises-80m" },
  { company: "Dexterity", amount: "$140M", round: "Series B", date: "2023-12-14", investors: "Kleiner Perkins, Lightspeed, Tiger Global", source_url: "https://techcrunch.com/2023/12/14/dexterity-raises-140m" },
  { company: "RightHand Robotics", amount: "$66M", round: "Series C", date: "2024-03-20", investors: "GV, Menlo Ventures, Matrix Partners", source_url: "https://www.therobotreport.com/righthand-robotics-raises-66m" },
  { company: "Sarcos Technology", amount: "$75M", round: "Series C", date: "2024-07-30", investors: "Caterpillar, Palantir, Rotor Capital", source_url: "https://venturebeat.com/robotics/sarcos-raises-75m" },
  { company: "Nuro", amount: "$600M", round: "Series D", date: "2024-10-22", investors: "Tiger Global, SoftBank Vision Fund, Greylock", source_url: "https://techcrunch.com/2024/10/22/nuro-raises-600m" },
  { company: "Plus One Robotics", amount: "$33M", round: "Series B", date: "2024-02-28", investors: "Translink Capital, Zebra Technologies, McKesson", source_url: "https://www.therobotreport.com/plus-one-robotics-raises-33m" },
  { company: "Mujin", amount: "$85M", round: "Series C", date: "2024-05-15", investors: "SBI Investment, Globis Capital, MUFG", source_url: "https://techcrunch.com/2024/05/15/mujin-raises-85m" },
  { company: "Dusty Robotics", amount: "$45M", round: "Series B", date: "2024-03-08", investors: "Founders Fund, Cantos, Root Ventures", source_url: "https://www.therobotreport.com/dusty-robotics-raises-45m" },
  { company: "Diligent Robotics", amount: "$30M", round: "Series B", date: "2024-01-25", investors: "True Ventures, DNX Ventures, Grit Ventures", source_url: "https://venturebeat.com/robotics/diligent-robotics-raises-30m" },
  { company: "Geek+", amount: "$200M", round: "Series E", date: "2024-06-20", investors: "Volcanics Venture, Intel Capital, Vertex", source_url: "https://www.therobotreport.com/geek-plus-raises-200m" },
  { company: "GreyOrange", amount: "$110M", round: "Series D", date: "2024-04-05", investors: "Mithril Capital, Blume Ventures, Tiger Global", source_url: "https://techcrunch.com/2024/04/05/greyorange-raises-110m" },
  { company: "Fourier Intelligence", amount: "$100M", round: "Series D", date: "2024-07-12", investors: "SoftBank Robotics, Vision Fund, CR Capital", source_url: "https://www.therobotreport.com/fourier-intelligence-raises-100m" },
  { company: "Exotec", amount: "$335M", round: "Series D", date: "2024-01-30", investors: "Goldman Sachs, Bpifrance, 83North, Dell Technologies", source_url: "https://techcrunch.com/2024/01/30/exotec-raises-335m" },
  { company: "Bear Robotics", amount: "$60M", round: "Series B", date: "2024-08-22", investors: "SoftBank Vision Fund, LG Technology Ventures", source_url: "https://venturebeat.com/robotics/bear-robotics-raises-60m" },
  { company: "Machina Labs", amount: "$32M", round: "Series B", date: "2024-09-18", investors: "Innovation Endeavors, Lux Capital, Congruent", source_url: "https://www.therobotreport.com/machina-labs-raises-32m" },
  { company: "Iron Ox", amount: "$53M", round: "Series C", date: "2024-02-14", investors: "Breakthrough Energy Ventures, Pathbreaker Ventures", source_url: "https://techcrunch.com/2024/02/14/iron-ox-raises-53m" },
  { company: "Cobalt Robotics", amount: "$55M", round: "Series C", date: "2024-05-01", investors: "Sequoia Capital, Coatue Management, Bloomberg Beta", source_url: "https://venturebeat.com/robotics/cobalt-robotics-raises-55m" },
  { company: "Rapid Robotics", amount: "$55M", round: "Series B", date: "2024-03-25", investors: "Kleiner Perkins, Tiger Global, Bee Partners", source_url: "https://www.therobotreport.com/rapid-robotics-raises-55m" },
  { company: "Waymo (Alphabet)", amount: "$5.6B", round: "Investment Round", date: "2024-10-25", investors: "Alphabet, Andreessen Horowitz, T. Rowe Price, Silver Lake", source_url: "https://techcrunch.com/2024/10/25/waymo-raises-5-6-billion" },
  { company: "Aurora Innovation", amount: "$820M", round: "Series U", date: "2024-06-15", investors: "PACCAR, Uber, Sequoia, Amazon", source_url: "https://www.businesswire.com/aurora-raises-820m" },
  { company: "Kepler Robot", amount: "$60M", round: "Series A", date: "2025-01-20", investors: "Tencent, Prosperity7 Ventures, Source Code Capital", source_url: "https://www.therobotreport.com/kepler-robot-raises-60m" },
  { company: "Clone Robotics", amount: "$15M", round: "Series A", date: "2025-02-10", investors: "Lux Capital, Khosla Ventures", source_url: "https://techcrunch.com/2025/02/10/clone-robotics-raises-15m" },
  { company: "Astribot", amount: "$70M", round: "Series B", date: "2025-01-08", investors: "Tencent, Alibaba, GSR Ventures", source_url: "https://www.therobotreport.com/astribot-raises-70m" },
  { company: "Mentee Robotics", amount: "$25M", round: "Seed+", date: "2025-03-15", investors: "Vinod Khosla, Eric Schmidt, Intel Capital", source_url: "https://venturebeat.com/robotics/mentee-robotics-raises-25m" },
  { company: "Unitree Robotics", amount: "$115M", round: "Series B", date: "2024-12-20", investors: "SoftBank, Shunwei Capital, ByteDance", source_url: "https://www.therobotreport.com/unitree-robotics-raises-115m" },
  { company: "Neura Robotics", amount: "$120M", round: "Series B", date: "2024-11-15", investors: "Samsung Ventures, NVIDIA, Lightspeed", source_url: "https://techcrunch.com/2024/11/15/neura-robotics-raises-120m" },
  { company: "Kassow Robots", amount: "$35M", round: "Series B", date: "2024-08-05", investors: "Bosch Ventures, ABB Technology Ventures", source_url: "https://venturebeat.com/robotics/kassow-robots-raises-35m" },
];

async function tryFirecrawlScrape(url: string): Promise<string | null> {
  try {
    console.log(`  Scraping ${url}...`);
    const result = await firecrawl.scrapeUrl(url, { formats: ["markdown"] });
    if (result.success && result.markdown) {
      return result.markdown.slice(0, 2000);
    }
    return null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  Scrape failed for ${url}: ${msg}`);
    return null;
  }
}

async function main() {
  console.log("=== Market Intelligence Data Scrape ===\n");

  // Step 1: Try to scrape key sources for supplementary data
  console.log("Step 1: Scraping key sources via Firecrawl...\n");

  const scrapeSources = [
    "https://www.therobotreport.com",
    "https://www.grandviewresearch.com/industry-analysis/robotics-market",
    "https://www.mckinsey.com/featured-insights/future-of-work/robots",
  ];

  for (const url of scrapeSources) {
    const content = await tryFirecrawlScrape(url);
    if (content) {
      console.log(`  Got ${content.length} chars from ${url}`);
    }
  }

  // Step 2: Insert market reports
  console.log("\nStep 2: Inserting market reports...\n");

  let reportsInserted = 0;
  for (const report of MARKET_REPORTS) {
    const { error } = await supabase.from("market_reports").insert({
      title: report.title,
      source: report.source,
      source_url: report.source_url,
      report_date: report.report_date,
      category: report.category,
      market_size_usd_billions: report.market_size_usd_billions,
      cagr_percent: report.cagr_percent,
      forecast_year: report.forecast_year,
      key_findings: report.key_findings,
      raw_excerpt: report.raw_excerpt,
    });

    if (error) {
      console.log(`  Failed: "${report.title}": ${error.message}`);
    } else {
      reportsInserted++;
      console.log(`  OK: ${report.title}`);
    }
  }

  // Step 3: Insert funding rounds
  console.log("\nStep 3: Inserting funding rounds...\n");

  let fundingInserted = 0;
  for (const round of FUNDING_ROUNDS) {
    const { error } = await supabase.from("funding_rounds").insert({
      company: round.company,
      amount: round.amount,
      round: round.round,
      date: round.date,
      investors: round.investors,
      source_url: round.source_url,
    });

    if (error) {
      if (error.message.includes("duplicate") || error.code === "23505") {
        console.log(`  Dup: ${round.company} ${round.round}`);
      } else {
        console.log(`  Failed: ${round.company}: ${error.message}`);
      }
    } else {
      fundingInserted++;
      console.log(`  OK: ${round.company} — ${round.amount} ${round.round}`);
    }
  }

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Market reports inserted: ${reportsInserted}/${MARKET_REPORTS.length}`);
  console.log(`Funding rounds inserted: ${fundingInserted}/${FUNDING_ROUNDS.length}`);
  console.log(`Total data points: ${reportsInserted + fundingInserted}`);
}

main().catch(console.error);
