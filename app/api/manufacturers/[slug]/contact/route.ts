import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const VALID_CLICK_TYPES = ["sales", "demo", "website", "claim"] as const;
type ClickType = (typeof VALID_CLICK_TYPES)[number];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { clickType } = body;

    // Validate clickType
    if (!clickType || !VALID_CLICK_TYPES.includes(clickType as ClickType)) {
      return NextResponse.json(
        {
          error: `Invalid clickType. Must be one of: ${VALID_CLICK_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

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

    // Insert contact click
    const { error: insertError } = await supabase
      .from("manufacturer_contact_clicks")
      .insert({
        manufacturer_id: manufacturer.id,
        click_type: clickType,
      });

    if (insertError) {
      console.error("Failed to record contact click:", insertError);
      return NextResponse.json(
        { error: "Failed to record click" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact click error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
