import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("manufacturer_partnerships")
    .select("id, contact_name, email, company, tier_interest, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch partnerships", data: [] }, { status: 500 });
  }

  // Remap for frontend consistency
  const mapped = (data || []).map((p) => ({
    ...p,
    contact_email: p.email,
    manufacturers: { name: p.company, slug: "" },
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

  const { data: partnership } = await supabase
    .from("manufacturer_partnerships")
    .select("id, contact_name, email, company, tier_interest, message")
    .eq("id", id)
    .single();

  if (!partnership) {
    return NextResponse.json({ error: "Partnership not found" }, { status: 404 });
  }

  const newStatus = action === "approve" ? "contacted" : "closed_lost";

  await supabase
    .from("manufacturer_partnerships")
    .update({ status: newStatus })
    .eq("id", id);

  // Send email
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: partnership.email,
      subject:
        action === "approve"
          ? `Partnership inquiry received: ${partnership.company}`
          : `Update on your partnership inquiry`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: ${action === "approve" ? "#60A5FA" : "#FF006E"}; font-size: 20px;">
            Partnership ${action === "approve" ? "Inquiry Accepted" : "Update"}
          </h1>
          <p>Hi ${partnership.contact_name},</p>
          <p>${
            action === "approve"
              ? `Thank you for your interest in the ${partnership.tier_interest} partnership for <strong>${partnership.company}</strong>. Our team will be in touch within 48 hours.`
              : `Thank you for your interest in partnering with Robotomated. We are unable to proceed at this time. Please reach out to team@robotomated.com for more details.`
          }</p>
        </div>
      `,
    });
  } catch {
    console.error("[Admin] Failed to send partnership email");
  }

  return NextResponse.json({ ok: true });
}
