import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { sendStudentWelcomeEmail, STUDENT_WELCOME_EMAILS } from "@/lib/email/templates/workforce";

/**
 * Cron-triggered workforce welcome email drip.
 * Run daily via Vercel Cron.
 *
 * Sends:
 * - Day 1 email: 1 day after enrollment
 * - Day 7-before email: 7 days before cohort start date
 *
 * Day 0 email is sent immediately by the Stripe webhook — not by this cron.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const now = new Date();
  let sent = 0;
  let errors = 0;

  // ─── Day 1 email: enrolled exactly 1 day ago ──────────────────
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const dayStart = new Date(oneDayAgo);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(oneDayAgo);
  dayEnd.setHours(23, 59, 59, 999);

  const { data: dayOneEnrollments } = await supabase
    .from("certification_enrollments")
    .select("user_id")
    .eq("payment_status", "paid")
    .gte("enrolled_at", dayStart.toISOString())
    .lte("enrolled_at", dayEnd.toISOString());

  if (dayOneEnrollments && dayOneEnrollments.length > 0) {
    const userIds = dayOneEnrollments.map((e) => e.user_id);
    const { data: users } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds);

    for (const user of users || []) {
      try {
        await sendStudentWelcomeEmail(user.email, 1); // Day 1 template
        sent++;
      } catch (err) {
        console.error(`Failed to send Day 1 email to ${user.email}:`, err);
        errors++;
      }
    }
  }

  // ─── 7 days before cohort start ────────────────────────────────
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const targetDate = sevenDaysFromNow.toISOString().slice(0, 10);

  // Find cohorts starting in exactly 7 days
  const { data: upcomingCohorts } = await supabase
    .from("cohorts")
    .select("id")
    .eq("start_date", targetDate);

  if (upcomingCohorts && upcomingCohorts.length > 0) {
    const cohortIds = upcomingCohorts.map((c) => c.id);

    const { data: enrollments } = await supabase
      .from("certification_enrollments")
      .select("user_id")
      .eq("payment_status", "paid")
      .in("cohort_id", cohortIds);

    if (enrollments && enrollments.length > 0) {
      const userIds = enrollments.map((e) => e.user_id);
      const { data: users } = await supabase
        .from("users")
        .select("id, email")
        .in("id", userIds);

      for (const user of users || []) {
        try {
          await sendStudentWelcomeEmail(user.email, 2); // 7-days-before template
          sent++;
        } catch (err) {
          console.error(
            `Failed to send 7-day email to ${user.email}:`,
            err
          );
          errors++;
        }
      }
    }
  }

  return NextResponse.json({
    sent,
    errors,
    timestamp: now.toISOString(),
  });
}
