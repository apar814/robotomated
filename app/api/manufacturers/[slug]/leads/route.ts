import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface LeadRow {
  click_type: string;
  created_at: string;
}

interface Lead {
  click_types: string[];
  first_click: string;
  last_click: string;
  total_clicks: number;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServerClient();

    // Look up manufacturer by slug
    const { data: manufacturer, error: lookupError } = await supabase
      .from("manufacturers")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (lookupError || !manufacturer) {
      return NextResponse.json(
        { error: "Manufacturer not found" },
        { status: 404 }
      );
    }

    // Fetch all contact clicks for this manufacturer
    const { data: clicks, error: clicksError } = await supabase
      .from("manufacturer_contact_clicks")
      .select("click_type, created_at")
      .eq("manufacturer_id", manufacturer.id)
      .order("created_at", { ascending: false })
      .returns<LeadRow[]>();

    if (clicksError) {
      console.error("Failed to fetch leads:", clicksError);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    const allClicks = clicks || [];

    // Group clicks into leads by day-bucketed sessions
    // Since we don't have user_id, each click is treated as an individual lead entry
    // We aggregate by date (day granularity) to show daily lead activity
    const leadsByDate = new Map<string, Lead>();

    for (const click of allClicks) {
      const dayKey = click.created_at.slice(0, 10); // YYYY-MM-DD
      const existing = leadsByDate.get(dayKey);

      if (existing) {
        if (!existing.click_types.includes(click.click_type)) {
          existing.click_types.push(click.click_type);
        }
        existing.total_clicks += 1;
        // first_click is the earliest
        if (click.created_at < existing.first_click) {
          existing.first_click = click.created_at;
        }
        // last_click is the latest
        if (click.created_at > existing.last_click) {
          existing.last_click = click.created_at;
        }
      } else {
        leadsByDate.set(dayKey, {
          click_types: [click.click_type],
          first_click: click.created_at,
          last_click: click.created_at,
          total_clicks: 1,
        });
      }
    }

    // Convert to array sorted by last_click desc
    const leads = Array.from(leadsByDate.values()).sort(
      (a, b) => new Date(b.last_click).getTime() - new Date(a.last_click).getTime()
    );

    // Compute summary stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = allClicks.filter(
      (c) => new Date(c.created_at) >= oneWeekAgo
    ).length;
    const thisMonth = allClicks.filter(
      (c) => new Date(c.created_at) >= oneMonthAgo
    ).length;
    const demoRequests = allClicks.filter(
      (c) => c.click_type === "demo"
    ).length;

    return NextResponse.json({
      leads,
      total: leads.length,
      total_clicks: allClicks.length,
      this_week: thisWeek,
      this_month: thisMonth,
      demo_requests: demoRequests,
      manufacturer_name: manufacturer.name,
    });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
