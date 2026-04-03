import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  let body: {
    brand: string;
    model: string;
    service_type: string;
    description: string;
    urgency: string;
    location: string;
    contact: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { brand, model, service_type, description, urgency, location, contact } = body;

  if (!brand || !model || !service_type || !description || !urgency || !location || !contact) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      robot_manufacturer: brand,
      robot_model: model,
      robot_name: `${brand} ${model}`,
      business_name: contact.split("@")[1]?.split(".")[0] || "Unknown",
      business_email: contact,
      service_type,
      description,
      urgency,
      city: location,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Service request insert error:", error);
    return NextResponse.json(
      { error: "Failed to create service request" },
      { status: 500 }
    );
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: "admin@robotomated.com",
      subject: `[Service Request] ${urgency.toUpperCase()} - ${brand} ${model} - ${service_type}`,
      html: `
        <h2>New Service Request</h2>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Robot:</strong> ${brand} ${model}</p>
        <p><strong>Service:</strong> ${service_type}</p>
        <p><strong>Urgency:</strong> ${urgency}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
      `,
    });
  } catch (emailErr) {
    console.error("Service request email error:", emailErr);
  }

  return NextResponse.json({ success: true, id: data.id });
}
