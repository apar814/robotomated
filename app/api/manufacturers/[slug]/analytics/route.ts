import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServerClient();

    // Look up manufacturer by slug
    const { data: manufacturer, error: lookupError } = await supabase
      .from("manufacturers")
      .select("id")
      .eq("slug", slug)
      .single();

    if (lookupError || !manufacturer) {
      return NextResponse.json(
        { error: "Manufacturer not found" },
        { status: 404 }
      );
    }

    // Calculate 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Query contact clicks for the last 30 days
    const { data: clicks, error: clicksError } = await supabase
      .from("manufacturer_contact_clicks")
      .select("click_type")
      .eq("manufacturer_id", manufacturer.id)
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (clicksError) {
      console.error("Failed to fetch analytics:", clicksError);
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: 500 }
      );
    }

    // Aggregate counts by click type
    const byType: Record<string, number> = {
      sales: 0,
      demo: 0,
      website: 0,
      claim: 0,
    };

    for (const click of clicks || []) {
      if (click.click_type in byType) {
        byType[click.click_type]++;
      }
    }

    const totalClicks = (clicks || []).length;

    return NextResponse.json({
      totalClicks,
      byType,
      period: "30d",
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
