import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("email, source, confirmed, created_at")
    .order("created_at", { ascending: false });

  const rows = (data || []) as { email: string; source: string | null; confirmed: boolean; created_at: string }[];
  const csv = [
    "email,source,confirmed,subscribed_at",
    ...rows.map((r) => `${r.email},${r.source || ""},${r.confirmed},${r.created_at}`),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="robotomated-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
