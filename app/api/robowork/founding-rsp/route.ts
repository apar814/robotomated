import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { sendFoundingRspApplicationReceived } from "@/lib/email/robowork-emails";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { company_name, email, city, robot_types, fleet_size, why_founding } = body;

  // Validate required fields
  if (!company_name || typeof company_name !== "string") {
    return NextResponse.json({ error: "company_name is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  if (!city || typeof city !== "string") {
    return NextResponse.json({ error: "city is required" }, { status: 400 });
  }
  if (!why_founding || typeof why_founding !== "string" || why_founding.length < 200) {
    return NextResponse.json(
      { error: "why_founding is required and must be at least 200 characters" },
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

  // Get auth user if available (not required)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await (supabase as any)
    .from("founding_rsp_applications")
    .insert({
      company_name,
      email,
      city,
      robot_types: robot_types || null,
      fleet_size: fleet_size || null,
      why_founding,
      user_id: user?.id || null,
      status: "pending",
    });

  if (error) {
    console.error("[founding-rsp] Insert error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }

  // Send emails (non-blocking, fire-and-forget)
  sendFoundingRspApplicationReceived({
    email: email as string,
    company_name: company_name as string,
  });

  resend.emails
    .send({
      from: EMAIL_FROM,
      to: process.env.ADMIN_EMAIL || "team@robotomated.com",
      subject: `New Founding RSP Application: ${company_name}`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <h1 style="color: #D4D4D4; font-size: 20px;">New Founding RSP Application</h1>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #888;">Company</td><td style="padding: 8px 0;">${company_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">City</td><td style="padding: 8px 0;">${city}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Fleet Size</td><td style="padding: 8px 0;">${fleet_size || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Robot Types</td><td style="padding: 8px 0;">${robot_types || "Not specified"}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://robotomated.com"}/admin/founding-rsp" style="display: inline-block; background: #D4D4D4; color: #000; padding: 10px 24px; text-decoration: none; font-weight: 600; border-radius: 4px;">Review Application</a>
        </div>
      `,
    })
    .catch((err) => console.error("[founding-rsp] Admin email failed:", err));

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function GET(request: NextRequest) {
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

  const { data, error } = await (supabase as any)
    .from("founding_rsp_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[founding-rsp] Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }

  return NextResponse.json({ applications: data });
}
