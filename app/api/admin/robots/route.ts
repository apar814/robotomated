import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const supabase = createServerClient();

  // Generate slug from name if not provided
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const { data: robot, error } = await supabase
    .from("robots")
    .insert(data)
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ robot });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase.from("robots").update(data).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// Bulk import
export async function PATCH(request: NextRequest) {
  const { robots } = await request.json();
  if (!Array.isArray(robots) || robots.length === 0) {
    return NextResponse.json({ error: "No robots to import" }, { status: 400 });
  }
  if (robots.length > 100) {
    return NextResponse.json({ error: "Maximum 100 robots per import" }, { status: 400 });
  }

  const supabase = createServerClient();
  const results: { success: number; errors: string[] } = { success: 0, errors: [] };

  for (let i = 0; i < robots.length; i++) {
    const r = robots[i];
    if (!r.slug) {
      r.slug = (r.name || `robot-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const { error } = await supabase.from("robots").insert(r);
    if (error) {
      results.errors.push(`Row ${i + 1} (${r.name || "unnamed"}): ${error.message}`);
    } else {
      results.success++;
    }
  }

  return NextResponse.json(results);
}
