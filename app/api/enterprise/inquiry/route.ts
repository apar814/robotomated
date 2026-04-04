import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, company, fleet_size, annual_robot_spend, timeline } =
      body;

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, company" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("enterprise_accounts")
      .insert({
        company_name: company,
        domain: email.split("@")[1] || null,
        tier: "starter",
        account_manager: name,
        features: { contact_email: email, fleet_size, annual_robot_spend, timeline },
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert enterprise inquiry:", error);
      return NextResponse.json(
        { error: "Failed to submit inquiry" },
        { status: 500 }
      );
    }

    // Send admin notification email
    const adminEmail = process.env.ADMIN_EMAIL || "admin@robotomated.com";

    try {
      await resend.emails.send({
        from: "Robotomated <notifications@robotomated.com>",
        to: adminEmail,
        subject: `Enterprise Inquiry: ${company}`,
        html: `
          <h2>New Enterprise Inquiry</h2>
          <p><strong>Inquiry ID:</strong> ${data.id}</p>
          <hr />
          <h3>Contact</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <hr />
          <h3>Details</h3>
          <p><strong>Fleet Size:</strong> ${fleet_size || "Not specified"}</p>
          <p><strong>Annual Robot Spend:</strong> ${annual_robot_spend || "Not specified"}</p>
          <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
        `,
      });
    } catch (emailError) {
      // Log but don't fail the request if email fails
      console.error("Failed to send admin notification email:", emailError);
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Enterprise inquiry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
