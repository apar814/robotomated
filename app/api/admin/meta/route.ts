import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const supabase = createServerClient();

  if (type === "categories") {
    const { data } = await supabase.from("robot_categories").select("id, name").order("display_order");
    return NextResponse.json({ data: data || [] });
  }

  if (type === "manufacturers") {
    const { data } = await supabase.from("manufacturers").select("id, name").order("name");
    return NextResponse.json({ data: data || [] });
  }

  return NextResponse.json({ data: [] });
}
