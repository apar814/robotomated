import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rspId: string }> }
) {
  const { rspId } = await params;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  // Verify the RSP exists
  const { data: rsp, error: rspError } = await supabase
    .from("robot_service_providers")
    .select("id, company_name, verified")
    .eq("id", rspId)
    .single();

  if (rspError || !rsp) {
    return NextResponse.json(
      { error: "Robot Service Provider not found" },
      { status: 404 }
    );
  }

  // Fetch overview stats in parallel
  const [activeJobsResult, revenueResult, pendingBidsResult, fleetResult] =
    await Promise.all([
      // Count active jobs where this RSP has an accepted bid
      supabase
        .from("robowork_bids")
        .select("id", { count: "exact", head: true })
        .eq("rsp_id", rspId)
        .eq("status", "accepted"),

      // Sum revenue from paid invoices
      supabase
        .from("rsp_invoices")
        .select("total")
        .eq("rsp_id", rspId)
        .eq("status", "paid"),

      // Count pending bids
      supabase
        .from("robowork_bids")
        .select("id", { count: "exact", head: true })
        .eq("rsp_id", rspId)
        .eq("status", "pending"),

      // Count fleet robots
      supabase
        .from("rsp_robots")
        .select("id, available", { count: "exact" })
        .eq("rsp_id", rspId),
    ]);

  const activeJobs = activeJobsResult.count || 0;
  const pendingBids = pendingBidsResult.count || 0;
  const fleetSize = fleetResult.count || 0;

  // Calculate total revenue from paid invoices
  const revenue = (revenueResult.data || []).reduce(
    (sum, inv) => sum + (parseFloat(String(inv.total)) || 0),
    0
  );

  // Calculate utilization: deployed or operational robots / total robots
  const deployedCount = (fleetResult.data || []).filter(
    (r) => r.available
  ).length;
  const utilization =
    fleetSize > 0 ? Math.round((deployedCount / fleetSize) * 100) : 0;

  return NextResponse.json({
    activeJobs,
    revenue,
    pendingBids,
    fleetSize,
    utilization,
  });
}
