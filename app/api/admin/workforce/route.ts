import { NextRequest, NextResponse } from "next/server";
import { createUntypedServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

const ADMIN_EMAIL = "apar814@gmail.com";

export async function GET(request: NextRequest) {
  // Verify auth
  const supabaseAuth = createSSRClient(
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

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = createUntypedServerClient();

  const [employers, enrollments, cohorts] = await Promise.all([
    supabase
      .from("employer_intent")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("certification_enrollments")
      .select("*, cohorts(name, start_date)")
      .order("enrolled_at", { ascending: false }),
    supabase
      .from("cohorts")
      .select("*")
      .order("start_date", { ascending: true }),
  ]);

  // Get user emails for enrollments
  const userIds = (enrollments.data || []).map(
    (e: { user_id: string }) => e.user_id
  );
  let userEmails: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds);
    userEmails = Object.fromEntries(
      (users || []).map((u: { id: string; email: string }) => [u.id, u.email])
    );
  }

  const paidEnrollments = (enrollments.data || []).filter(
    (e: { payment_status: string }) => e.payment_status === "paid"
  );

  return NextResponse.json({
    employers: employers.data || [],
    enrollments: (enrollments.data || []).map(
      (e: { user_id: string; [key: string]: unknown }) => ({
        ...e,
        user_email: userEmails[e.user_id] || "unknown",
      })
    ),
    cohorts: cohorts.data || [],
    summary: {
      total_employers: (employers.data || []).length,
      new_employers: (employers.data || []).filter(
        (e: { status: string }) => e.status === "new"
      ).length,
      total_students: paidEnrollments.length,
      total_revenue: paidEnrollments.reduce(
        (sum: number, e: { amount_paid_cents: number | null }) =>
          sum + (e.amount_paid_cents || 0),
        0
      ),
      placements: (enrollments.data || []).filter(
        (e: { placement_status: string }) => e.placement_status === "placed"
      ).length,
    },
  });
}
