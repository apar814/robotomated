/**
 * Template-based verdict generation for robot detail pages.
 * No external API calls — uses robot data to build editorial verdicts.
 */

interface VerdictInput {
  name: string;
  robo_score: number | null;
  price_current: number | null;
  category_name: string;
  manufacturer_name: string;
  specs: Record<string, unknown> | null;
}

interface VerdictOutput {
  verdict: string;
  whoNeedsThis: string;
  whoDoesnt: string;
}

// ---------------------------------------------------------------------------
// Score tier labels
// ---------------------------------------------------------------------------
function scoreTier(score: number): {
  label: string;
  adjective: string;
  recommendation: string;
} {
  if (score >= 90)
    return {
      label: 'exceptional',
      adjective: 'best-in-class',
      recommendation: 'a top pick',
    };
  if (score >= 80)
    return {
      label: 'strong',
      adjective: 'highly capable',
      recommendation: 'worth serious consideration',
    };
  if (score >= 70)
    return {
      label: 'solid',
      adjective: 'competent',
      recommendation: 'a reasonable choice',
    };
  if (score >= 60)
    return {
      label: 'adequate',
      adjective: 'functional',
      recommendation: 'suitable for specific use cases',
    };
  return {
    label: 'below average',
    adjective: 'limited',
    recommendation: 'worth comparing against alternatives before committing',
  };
}

// ---------------------------------------------------------------------------
// Price range labels
// ---------------------------------------------------------------------------
function priceRange(price: number): {
  label: string;
  audience: string;
  avoidAudience: string;
} {
  if (price < 5000)
    return {
      label: 'entry-level',
      audience:
        'small teams and individual operators testing automation for the first time',
      avoidAudience:
        'enterprise operations needing industrial-grade durability and uptime guarantees',
    };
  if (price < 15000)
    return {
      label: 'mid-range',
      audience:
        'growing operations that have validated their automation use case and need reliable throughput',
      avoidAudience:
        'budget-constrained teams where manual processes remain viable, or enterprises needing fleet-scale deployment',
    };
  if (price < 50000)
    return {
      label: 'professional',
      audience:
        'mid-market operations teams with proven ROI models and dedicated automation budgets',
      avoidAudience:
        'first-time buyers still evaluating whether automation makes sense for their workflow',
    };
  if (price < 200000)
    return {
      label: 'enterprise',
      audience:
        'large-scale operations with integration teams, fleet management capabilities, and multi-year deployment plans',
      avoidAudience:
        'small operations without dedicated integration resources or where payback period exceeds 3 years',
    };
  return {
    label: 'premium enterprise',
    audience:
      'organizations with strategic automation mandates, dedicated robotics teams, and capital budgets above $500K',
    avoidAudience:
      'any operation without a clear, validated ROI model showing payback within 24 months',
  };
}

// ---------------------------------------------------------------------------
// Category context
// ---------------------------------------------------------------------------
const CATEGORY_CONTEXT: Record<
  string,
  { domain: string; keyMetric: string; deploymentNote: string }
> = {
  warehouse: {
    domain: 'warehouse and logistics',
    keyMetric: 'throughput and pick accuracy',
    deploymentNote:
      'Integration with existing WMS is critical for ROI realization.',
  },
  manufacturing: {
    domain: 'manufacturing and production',
    keyMetric: 'cycle time and repeatability',
    deploymentNote:
      'Safety certification and operator training are non-negotiable for floor deployment.',
  },
  consumer: {
    domain: 'consumer and household',
    keyMetric: 'ease of use and reliability',
    deploymentNote: 'Setup should be achievable without technical expertise.',
  },
  medical: {
    domain: 'healthcare and clinical',
    keyMetric: 'precision and regulatory compliance',
    deploymentNote:
      'FDA clearance status and clinical validation data should be verified before procurement.',
  },
  construction: {
    domain: 'construction and site operations',
    keyMetric: 'durability and environmental tolerance',
    deploymentNote:
      'Ruggedization for outdoor conditions and dust resistance are essential.',
  },
  agricultural: {
    domain: 'agricultural and farming',
    keyMetric: 'coverage area and weather resilience',
    deploymentNote:
      'Seasonal deployment patterns and field conditions must factor into ROI calculations.',
  },
  delivery: {
    domain: 'delivery and last-mile logistics',
    keyMetric: 'range and payload capacity',
    deploymentNote:
      'Local regulations on autonomous delivery vary significantly by jurisdiction.',
  },
  drone: {
    domain: 'aerial inspection and surveying',
    keyMetric: 'flight time and sensor resolution',
    deploymentNote:
      'FAA Part 107 certification (or equivalent) is required for commercial operations.',
  },
  security: {
    domain: 'facility security and surveillance',
    keyMetric: 'patrol range and detection accuracy',
    deploymentNote:
      'Integration with existing security infrastructure determines deployment speed.',
  },
  hospitality: {
    domain: 'hospitality and guest services',
    keyMetric: 'interaction quality and navigation',
    deploymentNote:
      'Guest-facing deployment requires careful change management and staff training.',
  },
};

// ---------------------------------------------------------------------------
// Spec highlights
// ---------------------------------------------------------------------------
function specHighlights(specs: Record<string, unknown> | null): string {
  if (!specs || Object.keys(specs).length === 0) return '';

  const highlights: string[] = [];
  if (specs.payload_kg != null)
    highlights.push(`a ${specs.payload_kg}kg payload capacity`);
  if (specs.battery_hrs != null)
    highlights.push(`${specs.battery_hrs} hours of battery life`);
  if (specs.reach_mm != null)
    highlights.push(`${specs.reach_mm}mm reach`);
  if (specs.max_speed != null)
    highlights.push(`a max speed of ${specs.max_speed}`);
  if (specs.dof != null) highlights.push(`${specs.dof}-axis articulation`);
  if (specs.ip_rating != null)
    highlights.push(`an IP${specs.ip_rating} protection rating`);

  if (highlights.length === 0) return '';
  if (highlights.length === 1) return ` It offers ${highlights[0]}.`;
  return ` Key specs include ${highlights.slice(0, -1).join(', ')}, and ${highlights[highlights.length - 1]}.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function generateVerdict(robot: VerdictInput): VerdictOutput {
  const { name, robo_score, price_current, category_name, manufacturer_name, specs } =
    robot;

  // Look up category context by slug-like key
  const catKey = category_name.toLowerCase().replace(/\s+/g, '-');
  const catCtx = CATEGORY_CONTEXT[catKey] || {
    domain: `${category_name} applications`,
    keyMetric: 'overall capability and reliability',
    deploymentNote:
      'Deployment requirements vary by facility — consult the manufacturer.',
  };

  // Handle case where score is missing
  if (robo_score == null && price_current == null) {
    return {
      verdict: `The ${name} by ${manufacturer_name} is a ${catCtx.domain} robot currently under evaluation. We are collecting performance data, pricing information, and deployment feedback to assign a RoboScore. ${catCtx.deploymentNote} Check back for our full assessment, or use Robotimus to compare it against alternatives we have already scored.`,
      whoNeedsThis: `Teams evaluating ${catCtx.domain} automation who want to explore the full range of options, including newer entrants still building their track record.`,
      whoDoesnt: `Buyers who need proven, scored robots with validated ROI data and transparent performance benchmarks available today.`,
    };
  }

  // Build verdict
  const tier = robo_score != null ? scoreTier(robo_score) : null;
  const priceInfo =
    price_current != null ? priceRange(price_current) : null;
  const specStr = specHighlights(specs);

  // Verdict paragraph
  let verdict = '';

  if (tier && priceInfo) {
    verdict = `The ${name} earns a RoboScore of ${robo_score}/100, placing it in the ${tier.label} tier for ${catCtx.domain} robots. At ${formatPrice(price_current!)} it sits in the ${priceInfo.label} segment, making it ${tier.recommendation} for teams where ${catCtx.keyMetric} is the priority.${specStr} ${manufacturer_name} delivers a ${tier.adjective} platform at this price point. ${catCtx.deploymentNote}`;
  } else if (tier) {
    verdict = `The ${name} earns a RoboScore of ${robo_score}/100, a ${tier.label} result that positions it as ${tier.recommendation} in ${catCtx.domain}. ${manufacturer_name} has built a ${tier.adjective} system for teams focused on ${catCtx.keyMetric}.${specStr} Pricing is available on request from ${manufacturer_name} directly. ${catCtx.deploymentNote}`;
  } else if (priceInfo) {
    verdict = `The ${name} by ${manufacturer_name} is a ${priceInfo.label} ${catCtx.domain} robot priced at ${formatPrice(price_current!)}. While we are still finalizing the RoboScore, its positioning targets ${priceInfo.audience}.${specStr} ${catCtx.deploymentNote}`;
  }

  // Who needs this
  const whoNeedsThis = priceInfo
    ? `${capitalize(priceInfo.audience)}. If ${catCtx.keyMetric} is your primary decision criterion, the ${name} deserves a place on your shortlist.`
    : `Teams in ${catCtx.domain} looking for a ${tier?.adjective || 'capable'} solution. The ${name} is designed for organizations where ${catCtx.keyMetric} matters most.`;

  // Who should look elsewhere
  const whoDoesnt = priceInfo
    ? `${capitalize(priceInfo.avoidAudience)}. If your requirements center on a different set of capabilities, compare alternatives in the ${category_name} category before committing.`
    : `Buyers who need transparent pricing upfront to build ROI models. Without published pricing, budget planning requires direct engagement with ${manufacturer_name}, which may slow evaluation timelines.`;

  return { verdict, whoNeedsThis, whoDoesnt };
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
