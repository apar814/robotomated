import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: email.toLowerCase().trim(), source: "homepage" });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Already subscribed!" });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Subscribed!" });
}
