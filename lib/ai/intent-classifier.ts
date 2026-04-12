/**
 * Intent classifier for Robotimus conversations.
 * Detects the user's intent and returns the appropriate response mode
 * with specialized system prompt additions.
 */

export type RobotimusIntent =
  | "DISCOVERY"
  | "COMPARISON"
  | "BUSINESS_CASE"
  | "DEPLOYMENT"
  | "CERTIFICATION"
  | "MARKET_INTEL"
  | "TROUBLESHOOTING"
  | "VENDOR";

interface ClassifiedIntent {
  intent: RobotimusIntent;
  confidence: number;
  promptAddition: string;
}

const INTENT_PATTERNS: { intent: RobotimusIntent; patterns: RegExp[]; keywords: string[] }[] = [
  {
    intent: "COMPARISON",
    patterns: [/compare|versus|vs\.?|better|difference between|which.*or/i],
    keywords: ["compare", "versus", "vs", "better", "which one", "difference", "alternative"],
  },
  {
    intent: "BUSINESS_CASE",
    patterns: [/cfo|business case|roi|justify|budget|investment|payback|cost.*benefit/i],
    keywords: ["cfo", "business case", "roi", "justify", "payback", "investment", "budget approval", "convince"],
  },
  {
    intent: "DEPLOYMENT",
    patterns: [/deploy|install|setup|implement|integrate|commission|go.?live/i],
    keywords: ["deploy", "install", "setup", "implement", "integrate", "commissioning", "infrastructure"],
  },
  {
    intent: "CERTIFICATION",
    patterns: [/certif|rco|training|career|operator.*course|learn.*robot|get.*certified/i],
    keywords: ["certification", "rco", "career", "training", "operator", "certified", "course", "learn"],
  },
  {
    intent: "MARKET_INTEL",
    patterns: [/market|trend|funding|investment.*round|what.*happening|news|latest|industry/i],
    keywords: ["market", "trend", "funding", "news", "latest", "industry", "happening", "landscape"],
  },
  {
    intent: "TROUBLESHOOTING",
    patterns: [/error|fault|broken|not.*working|issue|problem|diagnostic|fix|stuck|stopped/i],
    keywords: ["error", "fault", "broken", "issue", "problem", "fix", "stopped", "diagnostic", "troubleshoot"],
  },
  {
    intent: "VENDOR",
    patterns: [/manufacturer|vendor|company.*behind|who.*makes|trust|reliable.*company/i],
    keywords: ["manufacturer", "vendor", "company", "who makes", "trust", "reliable"],
  },
  {
    intent: "DISCOVERY",
    patterns: [/need|looking|recommend|suggest|help.*find|what.*robot|best.*for/i],
    keywords: ["need", "looking for", "recommend", "suggest", "find", "best for", "which robot"],
  },
];

const INTENT_PROMPTS: Record<RobotimusIntent, string> = {
  DISCOVERY: `MODE: DISCOVERY — The user doesn't know which robot they need.
Ask 1-2 focused clarifying questions about: use case, facility size, budget range, timeline.
Then give exactly 3 robot recommendations formatted as :::robot{...}::: cards.
Lead with the business outcome, not the robot specs.`,

  COMPARISON: `MODE: COMPARISON — The user is comparing specific robots.
Create a structured comparison:
1. Summary verdict in 1 sentence: "For [use case], [Robot A] wins because [reason]"
2. Comparison table across key dimensions relevant to their use case
3. Clear recommendation with tradeoff explanation
Never be wishy-washy. Make a decision and defend it.`,

  BUSINESS_CASE: `MODE: BUSINESS CASE — The user needs to justify automation to leadership.
Structure your response as a mini business case:
1. Executive Summary (3 sentences max)
2. Problem: current state, cost, pain points
3. Solution: specific robot recommendation
4. 3-Year TCO: purchase + maintenance + training + integration
5. ROI: payback period in months, annual savings
6. Risk: top 2 risks with mitigation
7. Timeline: deployment phases
8. Recommendation: clear "buy/lease/hire" with reasoning
Use specific dollar amounts. Compare robot cost to fully-burdened labor cost.`,

  DEPLOYMENT: `MODE: DEPLOYMENT — The user has chosen a robot and needs deployment guidance.
Provide a step-by-step deployment plan:
1. Pre-deployment: site assessment, infrastructure requirements, safety review
2. Procurement: buy vs lease vs RaaS recommendation
3. Installation: timeline, vendor coordination, network setup
4. Configuration: programming, safety zone validation, WMS integration
5. Training: operator certification level required, training hours
6. Go-live: phased rollout, success metrics, support plan
Be specific about timelines, costs, and prerequisites.`,

  CERTIFICATION: `MODE: CERTIFICATION — The user wants career or certification guidance.
Assess their current position and recommend a personalized RCO pathway:
1. Which level to start at based on their experience
2. Study time estimate for their background
3. Cost and ROI (salary increase data)
4. Job titles that unlock at each level
5. Specific next step: "Start with [Level X] — here's what to study first"
Link to /certify/[level] for the recommended level.`,

  MARKET_INTEL: `MODE: MARKET INTELLIGENCE — The user wants to know what's happening.
Lead with the most important development, not a summary.
For each item mentioned:
1. What happened (specific facts, amounts, dates)
2. What it means for the market (1 sentence implication)
3. How it connects to robots in our database (if applicable)
Be dense, factual, Bloomberg-voice. No adjectives that don't carry information.`,

  TROUBLESHOOTING: `MODE: TROUBLESHOOTING — The user has a deployed robot with issues.
Follow a diagnostic tree:
1. Ask about: robot model, error code/symptoms, when it started, what changed
2. Classify: Is this a Level 1 (operator-resolvable) or Level 2 (technician-required) issue?
3. Provide step-by-step diagnostic procedure
4. If Level 2: recommend escalation path and what data to capture for support
Never guess at solutions without enough diagnostic information.`,

  VENDOR: `MODE: VENDOR ANALYSIS — The user is evaluating a manufacturer.
Provide a structured vendor assessment:
1. Company overview: founding, HQ, funding, headcount
2. Product portfolio: robots in our database with scores
3. Market position: strengths, weaknesses, competitive threats
4. Support quality: response times, parts availability, training programs
5. Financial health: recent funding, growth trajectory, risk factors
6. Recommendation: "Safe to buy from" / "Proceed with caution" / "Consider alternatives"`,
};

/**
 * Classify the user's intent from their message.
 * Returns the detected intent with confidence score and specialized prompt addition.
 */
export function classifyIntent(message: string): ClassifiedIntent {
  const scores: { intent: RobotimusIntent; score: number }[] = [];

  for (const { intent, patterns, keywords } of INTENT_PATTERNS) {
    let score = 0;

    // Check regex patterns (higher weight)
    for (const pattern of patterns) {
      if (pattern.test(message)) score += 3;
    }

    // Check keywords
    const msgLower = message.toLowerCase();
    for (const kw of keywords) {
      if (msgLower.includes(kw)) score += 1;
    }

    scores.push({ intent, score });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];
  const maxPossible = Math.max(...scores.map((s) => s.score), 1);
  const confidence = Math.min(best.score / maxPossible, 1);

  // Default to DISCOVERY if no strong signal
  const finalIntent = best.score >= 2 ? best.intent : "DISCOVERY";

  return {
    intent: finalIntent,
    confidence,
    promptAddition: INTENT_PROMPTS[finalIntent],
  };
}
