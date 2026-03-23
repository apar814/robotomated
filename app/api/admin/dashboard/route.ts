import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { count: totalRobots },
    { count: activeRobots },
    { count: discontinuedRobots },
    { count: totalUsers },
    { count: totalReviews },
    { count: pendingReviews },
    { count: pendingSubmissions },
    { count: totalSubscribers },
    { count: todayClicks },
    { count: yesterdayClicks },
    { data: clicksByRobot },
    { data: recentRevenue },
    { data: pendingReviewsList },
    { data: pendingSubmissionsList },
    { data: subscribersByDay },
    { data: advisorByDay },
  ] = await Promise.all([
    supabase.from("robots").select("id", { count: "exact", head: true }),
    supabase.from("robots").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("robots").select("id", { count: "exact", head: true }).eq("status", "discontinued"),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }).not("published_at", "is", null),
    supabase.from("reviews").select("id", { count: "exact", head: true }).is("published_at", null),
    supabase.from("manufacturer_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }).gte("created_at", yesterday.toISOString()).lt("created_at", today.toISOString()),
    supabase.from("affiliate_clicks").select("robot_id, robots(name)").order("created_at", { ascending: false }).limit(200),
    supabase.from("revenue_entries").select("*").order("month", { ascending: false }).limit(12),
    supabase.from("reviews").select("id, title, robo_score, review_type, created_at, robots(name)").is("published_at", null).order("created_at", { ascending: false }).limit(10),
    supabase.from("manufacturer_submissions").select("id, company_name, robot_name, created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(10),
    supabase.from("newsletter_subscribers").select("created_at").gte("created_at", thirtyDaysAgo.toISOString()).order("created_at", { ascending: true }),
    supabase.from("advisor_conversations").select("created_at").gte("created_at", thirtyDaysAgo.toISOString()).order("created_at", { ascending: true }),
  ]);

  // Aggregate clicks by robot
  const robotClickMap = new Map<string, { name: string; count: number }>();
  for (const c of (clicksByRobot || []) as { robot_id: string; robots: { name: string } | null }[]) {
    const name = (c.robots as { name: string } | null)?.name || "Unknown";
    const existing = robotClickMap.get(name);
    if (existing) existing.count++;
    else robotClickMap.set(name, { name, count: 1 });
  }
  const topRobotClicks = Array.from(robotClickMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  // Aggregate subscribers by day
  const subsByDay = new Map<string, number>();
  for (const s of (subscribersByDay || []) as { created_at: string }[]) {
    const day = new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    subsByDay.set(day, (subsByDay.get(day) || 0) + 1);
  }

  // Aggregate advisor convos by day
  const advisorDays = new Map<string, number>();
  for (const a of (advisorByDay || []) as { created_at: string }[]) {
    const day = new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    advisorDays.set(day, (advisorDays.get(day) || 0) + 1);
  }

  // Calculate MRR from revenue entries
  const revenue = (recentRevenue || []) as { month: string; amount: number }[];
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const currentMRR = revenue.filter((r) => r.month === currentMonth).reduce((sum, r) => sum + r.amount, 0);

  return NextResponse.json({
    overview: {
      totalRobots: totalRobots || 0,
      activeRobots: activeRobots || 0,
      discontinuedRobots: discontinuedRobots || 0,
      comingSoon: (totalRobots || 0) - (activeRobots || 0) - (discontinuedRobots || 0),
      totalUsers: totalUsers || 0,
      totalReviews: totalReviews || 0,
      totalSubscribers: totalSubscribers || 0,
      todayClicks: todayClicks || 0,
      yesterdayClicks: yesterdayClicks || 0,
      estimatedMRR: currentMRR,
    },
    charts: {
      topRobotClicks,
      subscribersByDay: Array.from(subsByDay.entries()).map(([day, count]) => ({ day, count })),
      advisorByDay: Array.from(advisorDays.entries()).map(([day, count]) => ({ day, count })),
    },
    moderation: {
      pendingReviews: pendingReviews || 0,
      pendingSubmissions: pendingSubmissions || 0,
      reviewsList: pendingReviewsList || [],
      submissionsList: pendingSubmissionsList || [],
    },
    revenue: revenue,
  });
}
