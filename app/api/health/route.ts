import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = { api: "ok", database: "error" };

  try {
    const supabase = createServerClient();
    const { count, error } = await supabase
      .from("robots")
      .select("id", { count: "exact", head: true });
    if (!error && count != null) {
      checks.database = "ok";
    }
  } catch {
    checks.database = "error";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    { status: allOk ? "healthy" : "degraded", checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  );
}
