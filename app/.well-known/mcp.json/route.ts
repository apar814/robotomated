import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mcpServers: {
      robotomated: {
        url: "https://robotomated.com/mcp",
        name: "Robotomated",
        description: "Search, compare, and analyze 600+ commercial robots. Independent RoboScore ratings across 8 dimensions, buyer intelligence, and industry-specific insights for warehouse, medical, manufacturing, agricultural, construction, delivery, security, hospitality, eldercare, humanoid, space, and underwater robotics.",
        version: "1.0.0",
        transport: "streamable-http",
        tools: [
          {
            name: "search_robots",
            description: "Search robots by keyword, category, and budget range. Returns up to 20 results with RoboScore, pricing, and manufacturer info.",
          },
          {
            name: "get_robot_details",
            description: "Get complete details for a specific robot: full specs, RoboScore breakdown (8 dimensions), pricing, buyer intelligence, safety certifications, and manufacturer info.",
          },
          {
            name: "compare_robots",
            description: "Side-by-side comparison of two robots with specs, scores, pricing, and a RoboScore winner.",
          },
          {
            name: "get_industry_robots",
            description: "Get top robots for an industry vertical plus market stats and compliance requirements.",
          },
          {
            name: "get_top_robots",
            description: "Get top-rated robots by RoboScore, optionally filtered by category.",
          },
        ],
      },
    },
  });
}
