import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      manufacturerId,
      contactName,
      jobTitle,
      workEmail,
      linkedinUrl,
      description,
      contactInfo,
      logoUrl,
      catalogUrl,
      interestedFeatured,
      interestedSponsored,
      preferredContact,
    } = body;

    // Validate required fields
    if (!manufacturerId || !contactName || !jobTitle || !workEmail) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: manufacturerId, contactName, jobTitle, workEmail",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(workEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("manufacturer_claims")
      .insert({
        manufacturer_id: manufacturerId,
        contact_name: contactName,
        job_title: jobTitle,
        work_email: workEmail,
        linkedin_url: linkedinUrl || null,
        description: description || null,
        contact_info: contactInfo || null,
        logo_url: logoUrl || null,
        catalog_url: catalogUrl || null,
        interested_featured: interestedFeatured || false,
        interested_sponsored: interestedSponsored || false,
        preferred_contact: preferredContact || "email",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert manufacturer claim:", error);
      return NextResponse.json(
        { error: "Failed to submit claim" },
        { status: 500 }
      );
    }

    // Send admin notification email
    const adminEmail = process.env.ADMIN_EMAIL || "admin@robotomated.com";

    try {
      await resend.emails.send({
        from: "Robotomated <notifications@robotomated.com>",
        to: adminEmail,
        subject: `New Manufacturer Claim: ${contactName} (${jobTitle})`,
        html: `
          <h2>New Manufacturer Claim Submitted</h2>
          <p><strong>Claim ID:</strong> ${data.id}</p>
          <p><strong>Manufacturer ID:</strong> ${manufacturerId}</p>
          <p><strong>Contact:</strong> ${contactName}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Email:</strong> ${workEmail}</p>
          ${linkedinUrl ? `<p><strong>LinkedIn:</strong> ${linkedinUrl}</p>` : ""}
          ${description ? `<p><strong>Description:</strong> ${description}</p>` : ""}
          ${interestedFeatured ? "<p>Interested in Featured placement</p>" : ""}
          ${interestedSponsored ? "<p>Interested in Sponsored content</p>" : ""}
          <p><strong>Preferred Contact:</strong> ${preferredContact || "email"}</p>
        `,
      });
    } catch (emailError) {
      // Log but don't fail the request if email fails
      console.error("Failed to send admin notification email:", emailError);
    }

    return NextResponse.json({ success: true, claimId: data.id });
  } catch (error) {
    console.error("Manufacturer claim error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
