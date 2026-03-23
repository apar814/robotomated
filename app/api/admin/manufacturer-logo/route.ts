import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  const supabase = createServerClient();
  const { data } = await supabase.from("manufacturers").select("id, name, logo_url").eq("slug", slug).single();
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const { id, logo_url } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const supabase = createServerClient();
  const { error } = await supabase.from("manufacturers").update({ logo_url }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
