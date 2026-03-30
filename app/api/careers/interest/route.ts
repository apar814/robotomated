import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let body: { email?: string; type?: string; role_interest?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, type, role_interest } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  if (!type || !["worker", "employer", "manufacturer"].includes(type)) {
    return NextResponse.json({ error: "Invalid interest type" }, { status: 400 });
  }

  const cleanEmail = email.toLowerCase().trim();
  const supabase = createServerClient();

  const { error } = await supabase.from("careers_interest").insert({
    email: cleanEmail,
    type,
    role_interest: role_interest || null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({
        message: "You're already on the list. We'll be in touch.",
      });
    }
    console.error("Careers interest error:", error.message, error.code);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  const messages: Record<string, string> = {
    worker: "You're on the waitlist. We'll notify you when training programs open.",
    employer: "Request received. We'll reach out with early access details.",
    manufacturer: "Partnership request submitted. Our team will be in touch.",
  };

  return NextResponse.json({ message: messages[type] });
}
