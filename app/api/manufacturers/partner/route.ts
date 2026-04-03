import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { contactName, email, company, tierInterest, message } = body;

    // Validate required fields
    if (!contactName || !email || !company || !tierInterest || !message) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: contactName, email, company, tierInterest, message",
        },
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

    const { error } = await supabase.from("manufacturer_partnerships").insert({
      contact_name: contactName,
      email,
      company,
      tier_interest: tierInterest,
      message,
    });

    if (error) {
      console.error("Failed to insert partnership inquiry:", error);
      return NextResponse.json(
        { error: "Failed to submit partnership inquiry" },
        { status: 500 }
      );
    }

    // Send admin notification email
    const adminEmail = process.env.ADMIN_EMAIL || "admin@robotomated.com";

    try {
      await resend.emails.send({
        from: "Robotomated <notifications@robotomated.com>",
        to: adminEmail,
        subject: `New Partnership Inquiry: ${company} (${tierInterest})`,
        html: `
          <h2>New Partnership Inquiry</h2>
          <p><strong>Contact:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Tier Interest:</strong> ${tierInterest}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }

    // Send auto-reply to the submitter
    try {
      await resend.emails.send({
        from: "Robotomated <partnerships@robotomated.com>",
        to: email,
        subject: "We received your partnership inquiry - Robotomated",
        html: `
          <h2>Thank you for your interest, ${contactName}!</h2>
          <p>We have received your partnership inquiry for <strong>${company}</strong> regarding the <strong>${tierInterest}</strong> tier.</p>
          <p>Our partnerships team will review your request and get back to you within 2 business days.</p>
          <p>In the meantime, feel free to explore our <a href="https://robotomated.com/manufacturers">manufacturer directory</a> to see how we showcase robotics companies.</p>
          <br>
          <p>Best regards,</p>
          <p>The Robotomated Team</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send auto-reply email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Partnership inquiry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
