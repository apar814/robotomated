import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  let body: {
    robot_brand: string;
    robot_model: string;
    robot_value: number;
    robot_count?: number;
    use_case: string;
    location: string;
    coverage_needs: string[];
    annual_budget?: string;
    contact_name: string;
    contact_email: string;
    contact_phone?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    robot_brand,
    robot_model,
    robot_value,
    robot_count,
    use_case,
    location,
    coverage_needs,
    annual_budget,
    contact_name,
    contact_email,
    contact_phone,
  } = body;

  if (!robot_brand || !robot_model || !robot_value || !use_case || !location || !contact_name || !contact_email) {
    return NextResponse.json(
      { error: "All required fields must be provided" },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact_email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("robot_insurance_inquiries").insert({
    robot_manufacturer: robot_brand,
    robot_model,
    robot_name: `${robot_brand} ${robot_model}`,
    purchase_price: robot_value,
    business_name: contact_name,
    business_email: contact_email,
    use_case,
    coverage_type: coverage_needs.length > 0 ? coverage_needs.join(", ") : "comprehensive",
    status: "new",
  });

  if (error) {
    console.error("Insurance inquiry insert error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: "admin@robotomated.com",
      subject: `[Insurance Inquiry] ${robot_brand} ${robot_model} - ${contact_name}`,
      html: `
        <h2>New Insurance Inquiry</h2>
        <p><strong>Contact:</strong> ${contact_name} (${contact_email}${contact_phone ? `, ${contact_phone}` : ""})</p>
        <p><strong>Robot:</strong> ${robot_brand} ${robot_model}</p>
        <p><strong>Value:</strong> $${robot_value.toLocaleString()}</p>
        <p><strong>Count:</strong> ${robot_count || 1}</p>
        <p><strong>Use Case:</strong> ${use_case}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Coverage Needs:</strong> ${coverage_needs.length > 0 ? coverage_needs.join(", ") : "Not specified"}</p>
        <p><strong>Annual Budget:</strong> ${annual_budget || "Not specified"}</p>
      `,
    });
  } catch (emailErr) {
    console.error("Insurance inquiry email error:", emailErr);
  }

  return NextResponse.json({ success: true });
}
