import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  sendFoundingRspApproved,
  sendFoundingRspRejected,
} from "@/lib/email/robowork-emails";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, action } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json(
      { error: 'action must be "approve" or "reject"' },
      { status: 400 }
    );
  }

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

  if (action === "approve") {
    // Update application status
    const { error: updateError } = await (supabase as any)
      .from("founding_rsp_applications")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      console.error("[founding-rsp/review] Approve update error:", updateError);
      return NextResponse.json({ error: "Failed to approve application" }, { status: 500 });
    }

    // Get the application data
    const { data: application } = await (supabase as any)
      .from("founding_rsp_applications")
      .select("*")
      .eq("id", id)
      .single();

    // Count existing approved founding RSPs for next number
    const { count } = await (supabase as any)
      .from("founding_rsp_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");

    const nextNumber = count || 1;

    // If applicant has a user_id, update their RSP row
    if (application?.user_id) {
      await supabase
        .from("robot_service_providers")
        .update({
          is_founding_rsp: true,
          founding_rsp_number: nextNumber,
        } as any)
        .eq("user_id", application.user_id);
    }

    // Send approval email (fire-and-forget)
    if (application?.email) {
      sendFoundingRspApproved({
        email: application.email,
        company_name: application.company_name,
        founding_number: nextNumber,
      });
    }
  } else {
    // Reject
    const { error: updateError } = await (supabase as any)
      .from("founding_rsp_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      console.error("[founding-rsp/review] Reject update error:", updateError);
      return NextResponse.json({ error: "Failed to reject application" }, { status: 500 });
    }

    // Get the application data for email
    const { data: application } = await (supabase as any)
      .from("founding_rsp_applications")
      .select("email, company_name")
      .eq("id", id)
      .single();

    // Send rejection email (fire-and-forget)
    if (application?.email) {
      sendFoundingRspRejected({
        email: application.email,
        company_name: application.company_name,
      });
    }
  }

  return NextResponse.json({ success: true });
}
