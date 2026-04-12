import { createServerClient } from "@/lib/supabase/server";

interface RobotContext {
  name: string;
  manufacturer: string;
  category: string;
  categorySlug: string;
  slug: string;
  roboScore: number | null;
  price: number | null;
  descriptionShort: string | null;
  specs: Record<string, unknown> | null;
  deploymentWeeksMin: number | null;
  deploymentWeeksMax: number | null;
  maintenanceCostLow: number | null;
  maintenanceCostHigh: number | null;
  operatorTrainingHours: number | null;
}

interface IntelContext {
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
}

/**
 * Build rich context for Robotimus by querying the live database.
 * Returns a formatted context block injected into the system prompt.
 */
export async function buildRobotimusContext(userMessage: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient() as any;

  // Extract search terms from user message
  const searchTerms = extractSearchTerms(userMessage);

  // Query 1: Semantic search for relevant robots
  const robots = await searchRobots(supabase, searchTerms, userMessage);

  // Query 2: Recent intelligence items
  const intel = await getRecentIntel(supabase, searchTerms);

  // Query 3: Previous conversation context (if user is authenticated)
  // This is handled separately in the advisor route

  // Format context block
  return formatContext(robots, intel);
}

function extractSearchTerms(message: string): string[] {
  const stopWords = new Set([
    "i", "me", "my", "we", "our", "a", "an", "the", "is", "are", "was", "were",
    "be", "been", "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "can", "may", "might", "shall", "to", "of",
    "in", "for", "on", "with", "at", "by", "from", "as", "into", "about",
    "between", "through", "during", "before", "after", "above", "below",
    "and", "but", "or", "not", "no", "nor", "so", "yet", "both", "each",
    "few", "more", "most", "other", "some", "such", "than", "too", "very",
    "just", "also", "how", "what", "which", "who", "when", "where", "why",
    "need", "want", "looking", "help", "tell", "know", "think", "get",
    "robot", "robots", "best", "good", "right", "like",
  ]);

  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s$]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .slice(0, 8);
}

async function searchRobots(
  supabase: ReturnType<typeof createServerClient>,
  terms: string[],
  fullMessage: string
): Promise<RobotContext[]> {
  // Build search query — try full-text search first
  const searchQuery = terms.join(" | ");

  // Primary: text search on name and description
  let { data: robots } = await supabase
    .from("robots")
    .select(
      "name, slug, robo_score, price_current, description_short, specs, " +
      "deployment_weeks_min, deployment_weeks_max, " +
      "maintenance_annual_cost_low, maintenance_annual_cost_high, " +
      "operator_training_hours, " +
      "manufacturers(name), robot_categories(name, slug)"
    )
    .eq("status", "active")
    .or(`name.ilike.%${terms[0] || ""}%,description_short.ilike.%${terms[0] || ""}%`)
    .order("robo_score", { ascending: false, nullsFirst: false })
    .limit(10);

  // If too few results, broaden search
  if (!robots || robots.length < 5) {
    // Detect category intent
    const categoryMap: Record<string, string> = {
      warehouse: "warehouse", pallet: "warehouse", logistics: "warehouse", amr: "warehouse",
      medical: "medical", hospital: "medical", surgical: "medical", healthcare: "medical",
      manufacturing: "manufacturing", assembly: "manufacturing", welding: "manufacturing", cobot: "manufacturing",
      drone: "drone", aerial: "drone", inspection: "drone", survey: "drone",
      security: "security", patrol: "security", guard: "security",
      agricultural: "agricultural", farm: "agricultural", harvest: "agricultural",
      cleaning: "consumer", clean: "consumer", floor: "consumer", vacuum: "consumer",
      humanoid: "humanoid",
    };

    let detectedCategory: string | null = null;
    const msgLower = fullMessage.toLowerCase();
    for (const [keyword, cat] of Object.entries(categoryMap)) {
      if (msgLower.includes(keyword)) {
        detectedCategory = cat;
        break;
      }
    }

    if (detectedCategory) {
      const { data: catRobots } = await supabase
        .from("robots")
        .select(
          "name, slug, robo_score, price_current, description_short, specs, " +
          "deployment_weeks_min, deployment_weeks_max, " +
          "maintenance_annual_cost_low, maintenance_annual_cost_high, " +
          "operator_training_hours, " +
          "manufacturers(name), robot_categories(name, slug)"
        )
        .eq("status", "active")
        .order("robo_score", { ascending: false, nullsFirst: false })
        .limit(10);

      // Filter by category slug in application code
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = ((catRobots || []) as any[]).filter((r: any) => {
        const cat = r.robot_categories as { slug: string } | null;
        return cat?.slug === detectedCategory;
      });

      if (filtered.length > 0) robots = filtered.slice(0, 10);
    }

    // Still not enough? Get top robots by score
    if (!robots || robots.length < 3) {
      const { data: topRobots } = await supabase
        .from("robots")
        .select(
          "name, slug, robo_score, price_current, description_short, specs, " +
          "deployment_weeks_min, deployment_weeks_max, " +
          "maintenance_annual_cost_low, maintenance_annual_cost_high, " +
          "operator_training_hours, " +
          "manufacturers(name), robot_categories(name, slug)"
        )
        .eq("status", "active")
        .not("robo_score", "is", null)
        .order("robo_score", { ascending: false })
        .limit(10);

      robots = topRobots || [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((robots || []) as any[]).map((r: any) => {
    const mfr = r.manufacturers as { name: string } | null;
    const cat = r.robot_categories as { name: string; slug: string } | null;
    return {
      name: r.name as string,
      manufacturer: mfr?.name || "Unknown",
      category: cat?.name || "General",
      categorySlug: cat?.slug || "all",
      slug: r.slug as string,
      roboScore: r.robo_score as number | null,
      price: r.price_current as number | null,
      descriptionShort: r.description_short as string | null,
      specs: r.specs as Record<string, unknown> | null,
      deploymentWeeksMin: r.deployment_weeks_min as number | null,
      deploymentWeeksMax: r.deployment_weeks_max as number | null,
      maintenanceCostLow: r.maintenance_annual_cost_low as number | null,
      maintenanceCostHigh: r.maintenance_annual_cost_high as number | null,
      operatorTrainingHours: r.operator_training_hours as number | null,
    };
  });
}

async function getRecentIntel(
  supabase: ReturnType<typeof createServerClient>,
  terms: string[]
): Promise<IntelContext[]> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data } = await supabase
      .from("news_items")
      .select("title, summary, category, published_at")
      .gte("published_at", thirtyDaysAgo.toISOString())
      .order("relevance_score", { ascending: false })
      .limit(5);

    if (!data || data.length === 0) return [];

    // Filter by relevance to query terms
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (data as any[]).map((d: any) => ({
      title: d.title as string,
      summary: (d.summary || "") as string,
      category: (d.category || "market") as string,
      publishedAt: (d.published_at || new Date().toISOString()) as string,
    }));

    const relevant = items.filter((item) => {
      const text = `${item.title} ${item.summary}`.toLowerCase();
      return terms.some((t) => text.includes(t));
    });

    return (relevant.length > 0 ? relevant : items).slice(0, 3);
  } catch {
    return [];
  }
}

function formatPrice(price: number | null): string {
  if (price == null) return "Contact for pricing";
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}`;
}

function formatContext(robots: RobotContext[], intel: IntelContext[]): string {
  let context = "\n\n[ROBOT DATABASE — RELEVANT RESULTS]\n";

  for (const r of robots) {
    const specs = r.specs || {};
    const keySpecs: string[] = [];
    if (specs.payload_kg) keySpecs.push(`Payload: ${specs.payload_kg}kg`);
    if (specs.reach_mm) keySpecs.push(`Reach: ${specs.reach_mm}mm`);
    if (specs.max_speed) keySpecs.push(`Speed: ${specs.max_speed}`);
    if (specs.battery_hrs) keySpecs.push(`Runtime: ${specs.battery_hrs}h`);
    if (specs.dof) keySpecs.push(`DoF: ${specs.dof}`);
    if (specs.repeatability) keySpecs.push(`Repeatability: ${specs.repeatability}`);
    if (specs.ip_rating) keySpecs.push(`IP: ${specs.ip_rating}`);

    const deployment = r.deploymentWeeksMin
      ? `${r.deploymentWeeksMin}${r.deploymentWeeksMax ? `-${r.deploymentWeeksMax}` : ""} weeks`
      : "Contact manufacturer";

    const maintenance = r.maintenanceCostLow
      ? `$${r.maintenanceCostLow.toLocaleString()}${r.maintenanceCostHigh ? `-$${r.maintenanceCostHigh.toLocaleString()}` : ""}/year`
      : "Not specified";

    context += `\nRobot: ${r.name} | Manufacturer: ${r.manufacturer} | Category: ${r.category}`;
    context += `\nSlug: ${r.slug} | CategorySlug: ${r.categorySlug}`;
    context += `\nRoboScore: ${r.roboScore ?? "Pending"}/100 | Price: ${formatPrice(r.price)}`;
    if (keySpecs.length > 0) context += `\nKey Specs: ${keySpecs.join(" | ")}`;
    context += `\nDeployment Time: ${deployment} | Annual Maintenance: ${maintenance}`;
    if (r.operatorTrainingHours) context += ` | Training: ${r.operatorTrainingHours}h`;
    if (r.descriptionShort) context += `\nDescription: ${r.descriptionShort}`;
    context += "\n";
  }

  if (intel.length > 0) {
    context += "\n[MARKET INTELLIGENCE — RECENT]\n";
    for (const item of intel) {
      const date = new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      context += `\n[${item.category.toUpperCase()}] ${item.title} (${date})`;
      context += `\n${item.summary}\n`;
    }
  }

  return context;
}
