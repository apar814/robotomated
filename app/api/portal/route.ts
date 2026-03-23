import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { company_name, contact_email, robot_name, model_number, product_url, specs, notes } = await request.json();

  if (!company_name || !contact_email || !robot_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("manufacturer_submissions").insert({
    company_name,
    contact_email,
    robot_name,
    model_number: model_number || null,
    product_url: product_url || null,
    specs: specs || {},
    notes: notes || null,
  });

  if (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  // TODO: Send confirmation email via Resend when API key is configured
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'Robotomated <noreply@robotomated.com>',
  //   to: contact_email,
  //   subject: `Submission received: ${robot_name}`,
  //   text: `Thanks for submitting ${robot_name}. We'll review it within 3 business days.`,
  // });
  //
  // Notify admin:
  // await resend.emails.send({
  //   from: 'Robotomated <noreply@robotomated.com>',
  //   to: 'admin@robotomated.com',
  //   subject: `New submission: ${robot_name} from ${company_name}`,
  //   text: `New manufacturer submission.\n\nCompany: ${company_name}\nRobot: ${robot_name}\nEmail: ${contact_email}`,
  // });

  return NextResponse.json({ message: "Submission received" });
}
