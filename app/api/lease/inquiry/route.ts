import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      robot_category,
      model_search,
      estimated_price,
      monthly_budget,
      business_name,
      industry,
      revenue_range,
      employee_count,
      facility_sqft,
      state,
      lease_term,
      lease_type,
      credit_profile,
      urgency,
      use_case,
      hours_per_day,
      environment,
      contact_name,
      business_email,
      phone,
    } = body;

    // Validate required fields
    if (!business_name || !business_email) {
      return NextResponse.json(
        { error: "Missing required fields: business_name, business_email" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(business_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Build use_case text combining multiple form fields
    const useCaseParts = [
      use_case ? `Use case: ${use_case}` : null,
      hours_per_day ? `Hours/day: ${hours_per_day}` : null,
      environment ? `Environment: ${environment}` : null,
      robot_category ? `Category: ${robot_category}` : null,
      model_search ? `Model: ${model_search}` : null,
      estimated_price ? `Est. price: ${estimated_price}` : null,
      revenue_range ? `Revenue: ${revenue_range}` : null,
      lease_type ? `Lease type: ${lease_type}` : null,
    ].filter(Boolean).join("\n");

    const { data, error } = await supabase
      .from("lease_inquiries")
      .insert({
        robot_name: model_search || robot_category || null,
        business_name,
        business_email,
        business_phone: phone || null,
        industry: industry || null,
        facility_size: facility_sqft || null,
        employee_count: employee_count || null,
        preferred_term: lease_term ? parseInt(lease_term, 10) : 36,
        budget_monthly: monthly_budget
          ? parseFloat(monthly_budget.replace(/[^0-9.]/g, "")) || null
          : null,
        credit_rating: credit_profile || "not_specified",
        use_case: useCaseParts || null,
        urgency: urgency || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert lease inquiry:", error);
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
        subject: `New Lease Inquiry: ${business_name} - ${robot_category || "General"}`,
        html: `
          <h2>New Lease Inquiry Submitted</h2>
          <p><strong>Inquiry ID:</strong> ${data.id}</p>
          <hr />
          <h3>Robot Details</h3>
          <p><strong>Category:</strong> ${robot_category || "Not specified"}</p>
          <p><strong>Model:</strong> ${model_search || "Not specified"}</p>
          <p><strong>Est. Price:</strong> ${estimated_price || "Not specified"}</p>
          <p><strong>Monthly Budget:</strong> ${monthly_budget || "Not specified"}</p>
          <hr />
          <h3>Business Info</h3>
          <p><strong>Business:</strong> ${business_name}</p>
          <p><strong>Industry:</strong> ${industry || "Not specified"}</p>
          <p><strong>Revenue:</strong> ${revenue_range || "Not specified"}</p>
          <p><strong>Employees:</strong> ${employee_count || "Not specified"}</p>
          <p><strong>Facility:</strong> ${facility_sqft || "Not specified"} sq ft</p>
          <p><strong>State:</strong> ${state || "Not specified"}</p>
          <hr />
          <h3>Lease Preferences</h3>
          <p><strong>Term:</strong> ${lease_term || "Not specified"} months</p>
          <p><strong>Type:</strong> ${lease_type || "Not specified"}</p>
          <p><strong>Credit:</strong> ${credit_profile || "Not specified"}</p>
          <p><strong>Urgency:</strong> ${urgency || "Not specified"}</p>
          <hr />
          <h3>Use Case</h3>
          <p>${use_case || "Not specified"}</p>
          <p><strong>Hours/day:</strong> ${hours_per_day || "Not specified"}</p>
          <p><strong>Environment:</strong> ${environment || "Not specified"}</p>
          <hr />
          <h3>Contact</h3>
          <p><strong>Name:</strong> ${contact_name || "Not provided"}</p>
          <p><strong>Email:</strong> ${business_email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        `,
      });
    } catch (emailError) {
      // Log but don't fail the request if email fails
      console.error("Failed to send admin notification email:", emailError);
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Lease inquiry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
