import { NextRequest, NextResponse } from "next/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { INDUSTRIES } from "@/lib/data/industry-types";

function createMcpServer() {
  const server = new McpServer({
    name: "Robotomated",
    version: "1.0.0",
  });

  // ── search_robots ──
  server.tool(
    "search_robots",
    "Search the Robotomated database of 600+ commercial robots. Filter by keyword, category, and budget range. Returns name, slug, manufacturer, category, RoboScore, price, and description.",
    {
      query: z.string().optional().describe("Search keyword (matches name, description, manufacturer)"),
      category: z.string().optional().describe("Category slug: warehouse, medical, manufacturing, agricultural, construction, delivery, security, hospitality, eldercare, humanoid, underwater, space, home, inspection, drone, cobot"),
      budget_min: z.number().optional().describe("Minimum price in USD"),
      budget_max: z.number().optional().describe("Maximum price in USD"),
    },
    async ({ query, category, budget_min, budget_max }) => {
      const sb = createServerClient();
      let q = sb
        .from("robots")
        .select("slug, name, description_short, price_current, robo_score, status, manufacturers(name), robot_categories(slug, name)")
        .eq("status", "active")
        .order("robo_score", { ascending: false, nullsFirst: false })
        .limit(20);

      if (query) {
        q = q.or(`name.ilike.%${query}%,description_short.ilike.%${query}%`);
      }
      if (category) {
        const { data: cat } = await sb.from("robot_categories").select("id").ilike("slug", `%${category}%`).limit(1);
        if (cat && cat.length > 0) q = q.eq("category_id", cat[0].id);
      }
      if (budget_min != null) q = q.gte("price_current", budget_min);
      if (budget_max != null) q = q.lte("price_current", budget_max);

      const { data, error } = await q;
      if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };

      const robots = (data || []).map((r: Record<string, unknown>) => {
        const mfr = r.manufacturers as { name: string } | null;
        const cat = r.robot_categories as { slug: string; name: string } | null;
        return {
          slug: r.slug,
          name: r.name,
          manufacturer: mfr?.name || "Unknown",
          category: cat?.name || "Uncategorized",
          robo_score: r.robo_score,
          price_usd: r.price_current,
          description: r.description_short,
          url: `https://robotomated.com/robots/${r.slug}`,
        };
      });

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ count: robots.length, robots }, null, 2),
        }],
      };
    }
  );

  // ── get_robot_details ──
  server.tool(
    "get_robot_details",
    "Get full details for a specific robot by slug. Returns complete specs, RoboScore breakdown (8 dimensions), pricing, manufacturer info, buyer intelligence, and safety certifications.",
    {
      slug: z.string().describe("Robot slug (e.g., 'ur5e', 'spot-warehouse', 'locus-origin')"),
    },
    async ({ slug }) => {
      const sb = createServerClient();
      const { data, error } = await sb
        .from("robots")
        .select("*, manufacturers(name, slug, country, website, description), robot_categories(slug, name)")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        return { content: [{ type: "text" as const, text: `Robot "${slug}" not found.` }] };
      }

      const d = data as Record<string, unknown>;
      const mfr = d.manufacturers as Record<string, unknown> | null;
      const cat = d.robot_categories as { slug: string; name: string } | null;
      const specs = d.specs as Record<string, unknown> || {};
      const breakdown = d.score_breakdown as Record<string, number> || {};

      const robot = {
        name: d.name,
        slug: d.slug,
        manufacturer: {
          name: mfr?.name,
          country: mfr?.country,
          website: mfr?.website,
          description: mfr?.description,
        },
        category: cat?.name,
        robo_score: d.robo_score,
        score_breakdown: {
          performance: breakdown.performance,
          reliability: breakdown.reliability,
          ease_of_use: breakdown.ease_of_use,
          intelligence: breakdown.intelligence,
          value: breakdown.value,
          ecosystem: breakdown.ecosystem,
          safety: breakdown.safety,
          design: breakdown.design,
        },
        pricing: {
          current_price_usd: d.price_current,
          msrp_usd: d.price_msrp,
        },
        specs: {
          weight_kg: specs.weight_kg,
          height_m: specs.height_m,
          max_speed_ms: specs.max_speed_ms,
          battery_life_hours: specs.battery_life_hours,
          payload_kg: specs.payload_kg,
          reach_m: specs.reach_m,
          ip_rating: specs.ip_rating,
          operating_temp: specs.operating_temp,
          connectivity: specs.connectivity,
          sensors: specs.sensors,
        },
        buyer_intelligence: {
          vendor_health_score: d.vendor_health_score,
          maintenance_annual_pct: d.maintenance_annual_pct,
          maintenance_cost_low: d.maintenance_annual_cost_low,
          maintenance_cost_high: d.maintenance_annual_cost_high,
          support_model: d.support_model,
          support_response_hours: d.support_response_hours,
          safety_certifications: d.safety_certifications,
          industry_certifications: d.industry_certifications,
        },
        description: d.description_short,
        youtube_url: d.youtube_url,
        url: `https://robotomated.com/robots/${d.slug}`,
        compare_url: `https://robotomated.com/compare/`,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(robot, null, 2) }],
      };
    }
  );

  // ── compare_robots ──
  server.tool(
    "compare_robots",
    "Side-by-side comparison of two robots. Returns specs, RoboScore breakdown, pricing, and a verdict on which is better for different use cases.",
    {
      slug_a: z.string().describe("First robot slug"),
      slug_b: z.string().describe("Second robot slug"),
    },
    async ({ slug_a, slug_b }) => {
      const sb = createServerClient();
      const select = "slug, name, price_current, price_msrp, robo_score, score_breakdown, description_short, specs, manufacturers(name), robot_categories(slug, name), vendor_health_score, safety_certifications";

      const [resA, resB] = await Promise.all([
        sb.from("robots").select(select).eq("slug", slug_a).single(),
        sb.from("robots").select(select).eq("slug", slug_b).single(),
      ]);

      if (resA.error || !resA.data) return { content: [{ type: "text" as const, text: `Robot "${slug_a}" not found.` }] };
      if (resB.error || !resB.data) return { content: [{ type: "text" as const, text: `Robot "${slug_b}" not found.` }] };

      function fmt(r: Record<string, unknown>) {
        const mfr = r.manufacturers as { name: string } | null;
        const cat = r.robot_categories as { slug: string; name: string } | null;
        const specs = r.specs as Record<string, unknown> || {};
        const bd = r.score_breakdown as Record<string, number> || {};
        return {
          slug: r.slug, name: r.name,
          manufacturer: mfr?.name,
          category: cat?.name,
          price_usd: r.price_current,
          robo_score: r.robo_score,
          breakdown: bd,
          specs,
          vendor_health_score: r.vendor_health_score,
          safety_certifications: r.safety_certifications,
        };
      }

      const a = fmt(resA.data as Record<string, unknown>);
      const b = fmt(resB.data as Record<string, unknown>);

      const scoreA = (a.robo_score as number) || 0;
      const scoreB = (b.robo_score as number) || 0;
      const winner = scoreA > scoreB ? a.name : scoreB > scoreA ? b.name : "Tie";

      const comparison = {
        robot_a: a,
        robot_b: b,
        robo_score_winner: winner,
        compare_url: `https://robotomated.com/compare/${slug_a}-vs-${slug_b}`,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(comparison, null, 2) }],
      };
    }
  );

  // ── get_industry_robots ──
  server.tool(
    "get_industry_robots",
    "Get robots for a specific industry vertical. Industries: warehouse, medical, manufacturing, agricultural, construction, delivery, security, hospitality, eldercare. Returns robots plus industry insights (market stats, compliance, FAQs).",
    {
      industry: z.string().describe("Industry slug: warehouse, medical, manufacturing, agricultural, construction, delivery, security, hospitality, eldercare"),
    },
    async ({ industry }) => {
      // Find matching industry config
      const industryKey = Object.keys(INDUSTRIES).find(
        (k) => INDUSTRIES[k].slug === industry || INDUSTRIES[k].categorySlug === industry || k.includes(industry)
      );
      const config = industryKey ? INDUSTRIES[industryKey] : null;

      const sb = createServerClient();
      const { data: cats } = await sb.from("robot_categories").select("id, slug, name").ilike("slug", `%${industry}%`);
      if (!cats || cats.length === 0) {
        return { content: [{ type: "text" as const, text: `Industry "${industry}" not found. Available: warehouse, medical, manufacturing, agricultural, construction, delivery, security, hospitality, eldercare.` }] };
      }

      const catIds = cats.map(c => c.id);
      const { data: robots } = await sb
        .from("robots")
        .select("slug, name, price_current, robo_score, description_short, manufacturers(name)")
        .in("category_id", catIds)
        .eq("status", "active")
        .order("robo_score", { ascending: false, nullsFirst: false })
        .limit(20);

      const result = {
        industry: config?.name || cats[0].name,
        robot_count: (robots || []).length,
        robots: (robots || []).map((r: Record<string, unknown>) => {
          const mfr = r.manufacturers as { name: string } | null;
          return {
            slug: r.slug, name: r.name,
            manufacturer: mfr?.name,
            robo_score: r.robo_score,
            price_usd: r.price_current,
            description: r.description_short,
            url: `https://robotomated.com/robots/${r.slug}`,
          };
        }),
        ...(config ? {
          market_stats: config.marketStats,
          compliance_requirements: config.compliance.filter(c => c.required).map(c => c.name),
          explore_url: `https://robotomated.com/industries/${industryKey}`,
        } : {}),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── get_top_robots ──
  server.tool(
    "get_top_robots",
    "Get top-rated robots by RoboScore, optionally filtered by category. RoboScore is Robotomated's independent 0-100 rating across 8 dimensions: Performance (25%), Reliability (20%), Ease of Use (15%), Intelligence (15%), Value (10%), Ecosystem (8%), Safety (5%), Design (2%).",
    {
      category: z.string().optional().describe("Category slug to filter by (e.g., 'warehouse', 'cobot', 'humanoid')"),
      limit: z.number().optional().default(10).describe("Number of results (default 10, max 50)"),
    },
    async ({ category, limit }) => {
      const sb = createServerClient();
      const count = Math.min(limit || 10, 50);

      let q = sb
        .from("robots")
        .select("slug, name, price_current, robo_score, score_breakdown, description_short, manufacturers(name), robot_categories(slug, name)")
        .eq("status", "active")
        .not("robo_score", "is", null)
        .order("robo_score", { ascending: false })
        .limit(count);

      if (category) {
        const { data: cat } = await sb.from("robot_categories").select("id").ilike("slug", `%${category}%`).limit(1);
        if (cat && cat.length > 0) q = q.eq("category_id", cat[0].id);
      }

      const { data, error } = await q;
      if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };

      const robots = (data || []).map((r: Record<string, unknown>, i: number) => {
        const mfr = r.manufacturers as { name: string } | null;
        const cat = r.robot_categories as { slug: string; name: string } | null;
        return {
          rank: i + 1,
          slug: r.slug, name: r.name,
          manufacturer: mfr?.name,
          category: cat?.name,
          robo_score: r.robo_score,
          price_usd: r.price_current,
          url: `https://robotomated.com/robots/${r.slug}`,
        };
      });

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            category: category || "all",
            count: robots.length,
            scoring_methodology: "RoboScore 0-100: Performance 25%, Reliability 20%, Ease of Use 15%, Intelligence 15%, Value 10%, Ecosystem 8%, Safety 5%, Design 2%",
            robots,
          }, null, 2),
        }],
      };
    }
  );

  return server;
}

// Stateless MCP handler — creates fresh server + transport per request
async function handleMcpRequest(request: Request): Promise<Response> {
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
    enableJsonResponse: true,
  });
  await server.connect(transport);
  return transport.handleRequest(request);
}

// MCP Streamable HTTP transport handler
export async function POST(request: NextRequest) {
  try {
    return await handleMcpRequest(request);
  } catch (err) {
    console.error("MCP error:", err);
    return NextResponse.json({ error: "MCP server error" }, { status: 500 });
  }
}

// MCP discovery endpoint
export async function GET() {
  return NextResponse.json({
    name: "Robotomated",
    version: "1.0.0",
    description: "Robotomated MCP Server — search, compare, and get details on 600+ commercial robots across 16 categories. Independent RoboScore ratings, buyer intelligence, and industry insights.",
    transport: "streamable-http",
    url: "https://robotomated.com/mcp",
    tools: [
      { name: "search_robots", description: "Search robots by keyword, category, and budget" },
      { name: "get_robot_details", description: "Get full details for a robot by slug" },
      { name: "compare_robots", description: "Side-by-side comparison of two robots" },
      { name: "get_industry_robots", description: "Get robots for a specific industry vertical" },
      { name: "get_top_robots", description: "Get top-rated robots by RoboScore" },
    ],
  });
}
