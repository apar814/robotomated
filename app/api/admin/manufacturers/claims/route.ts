import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("manufacturer_claims")
    .select("id, manufacturer_id, contact_name, job_title, work_email, status, created_at, manufacturers(name, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch claims", data: [] }, { status: 500 });
  }

  // Remap fields for the frontend
  const mapped = (data || []).map((c) => ({
    ...c,
    contact_email: c.work_email,
  }));

  return NextResponse.json({ data: mapped });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, action } = body;

  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: claim } = await supabase
    .from("manufacturer_claims")
    .select("id, manufacturer_id, contact_name, work_email, manufacturers(name)")
    .eq("id", id)
    .single();

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  await supabase
    .from("manufacturer_claims")
    .update({ status: newStatus, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (action === "approve" && claim.manufacturer_id) {
    await supabase
      .from("manufacturers")
      .update({
        claimed_profile: true,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", claim.manufacturer_id);
  }

  // Send email notification
  try {
    const mfrName = (claim.manufacturers as { name: string } | null)?.name || "your company";
    await resend.emails.send({
      from: EMAIL_FROM,
      to: claim.work_email,
      subject:
        action === "approve"
          ? `Your profile claim for ${mfrName} has been approved`
          : `Update on your profile claim for ${mfrName}`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: ${action === "approve" ? "#00E5A0" : "#FF006E"}; font-size: 20px;">
            Profile Claim ${action === "approve" ? "Approved" : "Not Approved"}
          </h1>
          <p>Hi ${claim.contact_name},</p>
          <p>${
            action === "approve"
              ? `Your claim for the <strong>${mfrName}</strong> profile on Robotomated has been approved.`
              : `After review, we were unable to verify your claim for the <strong>${mfrName}</strong> profile. Please reach out to team@robotomated.com if you believe this was in error.`
          }</p>
        </div>
      `,
    });
  } catch {
    console.error("[Admin] Failed to send claim status email");
  }

  return NextResponse.json({ ok: true });
}
