import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
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

  const [activeJobs, verifiedProviders, availableRobots, completedJobs] =
    await Promise.all([
      supabase
        .from("robowork_jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("robot_service_providers")
        .select("id", { count: "exact", head: true })
        .eq("verified", true),
      supabase
        .from("rsp_robots")
        .select("id", { count: "exact", head: true })
        .eq("available", true),
      supabase
        .from("robowork_jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed"),
    ]);

  return NextResponse.json({
    active_jobs: activeJobs.count || 0,
    verified_providers: verifiedProviders.count || 0,
    available_robots: availableRobots.count || 0,
    completed_jobs: completedJobs.count || 0,
  });
}
