/**
 * News articles seed data — real robotics news, March 2026.
 * Sources: Engadget, TechCrunch, The Robot Report, Crunchbase, StartUs Insights
 */

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  tag: string;
  tagColor: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  importance: "breaking" | "major" | "standard";
  excerpt: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "amazon-acquires-rivr-2026",
    title: "Amazon acquires autonomous robotics startup Rivr",
    summary: "Amazon has acquired Rivr, a Zurich-based startup valued at $110M that builds four-legged stair-climbing delivery robots for doorstep logistics.",
    category: "Acquisitions & M&A",
    tag: "Acquisition",
    tagColor: "#f59e0b",
    source: "Engadget",
    sourceUrl: "https://www.engadget.com/big-tech/amazon-acquires-autonomous-robotics-startup-rivr-212839750.html",
    publishedAt: "2026-03-19",
    importance: "breaking",
    excerpt: "Amazon's march toward automation continues with four-legged delivery robots that climb stairs.",
  },
  {
    id: "mind-robotics-500m-series-a",
    title: "Mind Robotics raises $500M Series A for industrial AI robots",
    summary: "Founded by Rivian CEO RJ Scaringe, Mind Robotics raised a $500M Series A co-led by Accel and a16z at ~$2B valuation for robots with human-level dexterity.",
    category: "Funding",
    tag: "Series A · $500M",
    tagColor: "#22d3ee",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com/2026/03/11/rivian-mind-robotics-series-a-500m-fund-raise-industrial-ai-powered-robots/",
    publishedAt: "2026-03-11",
    importance: "breaking",
    excerpt: "Training robots on factory data to achieve human-level manipulation at industrial scale.",
  },
  {
    id: "fanuc-90m-us-manufacturing",
    title: "FANUC invests $90M in new 840,000 sq ft US manufacturing facility",
    summary: "FANUC America will build a new facility in Pontiac, Michigan, plus the largest robotics skills-development center in the US.",
    category: "Manufacturing",
    tag: "Expansion",
    tagColor: "#16a34a",
    source: "The Robot Report",
    sourceUrl: "https://www.therobotreport.com/fanuc-america-invests-90m-u-s-robot-manufacturing/",
    publishedAt: "2026-03-24",
    importance: "major",
    excerpt: "FANUC's $90M investment is the clearest signal yet of US robot manufacturing expansion.",
  },
  {
    id: "rhoda-ai-450m-stealth",
    title: "Rhoda AI raises $450M from stealth to train robots on video data",
    summary: "Rhoda AI emerged with $450M led by Premji Invest at $1.7B valuation, training robots using internet videos instead of expensive simulation.",
    category: "Funding",
    tag: "Series A · $450M",
    tagColor: "#22d3ee",
    source: "Crunchbase",
    sourceUrl: "https://news.crunchbase.com/venture/biggest-funding-rounds-ai-robotics-ecommerce-quince/",
    publishedAt: "2026-03-13",
    importance: "major",
    excerpt: "Training robots on video could dramatically reduce deployment costs across industrial categories.",
  },
  {
    id: "abb-robotics-softbank-5b",
    title: "ABB sells robotics division to SoftBank for $5.37 billion",
    summary: "ABB divests its robotics division ($2.3B in 2024 sales) to SoftBank for $5.37B, replacing the earlier planned spinoff.",
    category: "Acquisitions & M&A",
    tag: "Acquisition · $5.37B",
    tagColor: "#f59e0b",
    source: "StartUs Insights",
    sourceUrl: "https://www.startus-insights.com/innovators-guide/robotics-report/",
    publishedAt: "2026-02-01",
    importance: "major",
    excerpt: "Robotics platforms attracting control premium bids tied to AI and autonomy strategies.",
  },
  {
    id: "sunday-165m-home-humanoid",
    title: "Sunday raises $165M at $1.15B for home humanoid robot 'Memo'",
    summary: "Sunday reached unicorn status with a $165M Series B for Memo, a home humanoid that learns tasks through demonstration.",
    category: "Funding",
    tag: "Series B · $165M",
    tagColor: "#22d3ee",
    source: "Crunchbase",
    sourceUrl: "https://news.crunchbase.com/venture/biggest-funding-rounds-ai-robotics-ecommerce-quince/",
    publishedAt: "2026-03-13",
    importance: "major",
    excerpt: "Consumer robotics has graduated from science project to institutional investment thesis.",
  },
  {
    id: "roboforce-52m-titan",
    title: "RoboForce raises $52M for Titan outdoor industrial robot",
    summary: "Titan is a dual-armed mobile manipulator with 40kg payload for utility-scale solar, data centers, mining, and logistics.",
    category: "Funding",
    tag: "Seed · $52M",
    tagColor: "#22d3ee",
    source: "The Robot Report",
    sourceUrl: "https://www.therobotreport.com/roboforce-raises-52m-to-commercialize-its-titan-robot/",
    publishedAt: "2026-03-20",
    importance: "standard",
    excerpt: "Titan targets the most dangerous industrial jobs — outdoors in rain, snow, and dirt.",
  },
  {
    id: "kewazo-35m-liftbot",
    title: "KEWAZO raises to $35M for LIFTBOT vertical material handling",
    summary: "LIFTBOT automates vertical material movement at refineries, chemical plants, and power facilities — replacing cranes.",
    category: "Funding",
    tag: "Round · $35M",
    tagColor: "#22d3ee",
    source: "The Robot Report",
    sourceUrl: "https://www.therobotreport.com/kewazo-raises-funding-accelerate-liftbot-deployment-heavy-industry/",
    publishedAt: "2026-03-19",
    importance: "standard",
    excerpt: "Automating vertical material movement in heavy industrial environments.",
  },
];

export const NEWS_CATEGORIES = [
  "Funding",
  "Acquisitions & M&A",
  "New Products",
  "Deployments",
  "Manufacturing",
  "Policy & Regulation",
  "Research",
];
