import { NextRequest, NextResponse } from "next/server";
import { createUntypedServerClient } from "@/lib/supabase/server";
import { sendEmployerIntentNotification } from "@/lib/email/templates/workforce";
import type {
  EmployerIntentSubmission,
  RoleType,
  Timeline,
  WillingnessToPay,
} from "@/lib/workforce/types";

const VALID_ROLE_TYPES: RoleType[] = [
  "robot_tech", "cobot_programmer", "amr_fleet", "drone_pilot", "safety_inspector", "other",
];
const VALID_TIMELINES: Timeline[] = [
  "immediately", "1_3_months", "3_6_months", "6_12_months", "exploring",
];
const VALID_WTP: WillingnessToPay[] = [
  "yes_percentage", "yes_flat_fee", "not_yet", "need_more_info",
];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as EmployerIntentSubmission;

  // Validate required fields
  if (
    !body.company_name?.trim() ||
    !body.contact_name?.trim() ||
    !body.contact_email?.trim()
  ) {
    return NextResponse.json(
      { error: "Company name, contact name, and email are required" },
      { status: 400 }
    );
  }

  if (!VALID_ROLE_TYPES.includes(body.role_type)) {
    return NextResponse.json({ error: "Invalid role type" }, { status: 400 });
  }

  if (!VALID_TIMELINES.includes(body.timeline)) {
    return NextResponse.json({ error: "Invalid timeline" }, { status: 400 });
  }

  if (body.willingness_to_pay && !VALID_WTP.includes(body.willingness_to_pay)) {
    return NextResponse.json({ error: "Invalid willingness to pay value" }, { status: 400 });
  }

  const supabase = createUntypedServerClient();

  const { error } = await supabase.from("employer_intent").insert({
    company_name: body.company_name.trim(),
    contact_name: body.contact_name.trim(),
    contact_email: body.contact_email.trim().toLowerCase(),
    contact_phone: body.contact_phone?.trim() || null,
    contact_title: body.contact_title?.trim() || null,
    role_type: body.role_type,
    role_type_other: body.role_type === "other" ? body.role_type_other?.trim() || null : null,
    hires_needed: Math.max(1, body.hires_needed || 1),
    timeline: body.timeline,
    salary_min: body.salary_min || null,
    salary_max: body.salary_max || null,
    willingness_to_pay: body.willingness_to_pay || null,
    notes: body.notes?.trim() || null,
    source: "website",
  });

  if (error) {
    console.error("Failed to insert employer intent:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }

  // Send emails (non-blocking)
  sendEmployerIntentNotification({
    company_name: body.company_name,
    contact_name: body.contact_name,
    contact_email: body.contact_email,
    contact_title: body.contact_title,
    role_type: body.role_type,
    hires_needed: body.hires_needed || 1,
    timeline: body.timeline,
    salary_min: body.salary_min,
    salary_max: body.salary_max,
    notes: body.notes,
  }).catch((err) => console.error("Failed to send employer notification:", err));

  return NextResponse.json({ success: true });
}
