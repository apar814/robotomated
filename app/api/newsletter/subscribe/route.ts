import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { email, industry } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: email.toLowerCase().trim(),
      industry_preference: industry || null,
      source: "homepage",
    });

  if (error) {
    if (error.code === "23505") {
      // Already subscribed — update industry preference if provided
      if (industry) {
        await supabase
          .from("newsletter_subscribers")
          .update({ industry_preference: industry })
          .eq("email", email.toLowerCase().trim());
      }
      return NextResponse.json({ message: "You're already subscribed! Preference updated." });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Subscribed! Check your inbox Monday for the first digest." });
}
