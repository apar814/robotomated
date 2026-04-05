import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface LeadRow {
  click_type: string;
  created_at: string;
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

    // Fetch all contact clicks
    const { data: clicks, error: clicksError } = await supabase
      .from("manufacturer_contact_clicks")
      .select("click_type, created_at")
      .eq("manufacturer_id", manufacturer.id)
      .order("created_at", { ascending: false })
      .returns<LeadRow[]>();

    if (clicksError) {
      console.error("Failed to fetch leads for export:", clicksError);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    const allClicks = clicks || [];

    // Group by date
    const leadsByDate = new Map<
      string,
      { click_types: Set<string>; first_click: string; last_click: string; total_clicks: number }
    >();

    for (const click of allClicks) {
      const dayKey = click.created_at.slice(0, 10);
      const existing = leadsByDate.get(dayKey);

      if (existing) {
        existing.click_types.add(click.click_type);
        existing.total_clicks += 1;
        if (click.created_at < existing.first_click) {
          existing.first_click = click.created_at;
        }
        if (click.created_at > existing.last_click) {
          existing.last_click = click.created_at;
        }
      } else {
        leadsByDate.set(dayKey, {
          click_types: new Set([click.click_type]),
          first_click: click.created_at,
          last_click: click.created_at,
          total_clicks: 1,
        });
      }
    }

    // Build CSV
    const rows = Array.from(leadsByDate.entries())
      .sort(([, a], [, b]) => new Date(b.last_click).getTime() - new Date(a.last_click).getTime())
      .map(([date, lead]) => {
        const types = Array.from(lead.click_types).join(";");
        return `${date},${types},${lead.first_click},${lead.last_click},${lead.total_clicks}`;
      });

    const csv = ["date,click_types,first_click,last_click,total_clicks", ...rows].join("\n");

    const filename = `${slug}-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Leads export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
