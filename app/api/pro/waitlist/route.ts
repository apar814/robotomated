import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const cleanEmail = email.toLowerCase().trim();
  const supabase = createServerClient();

  // Check if already on waitlist
  const { data: existing } = await supabase
    .from("pro_waitlist")
    .select("position")
    .eq("email", cleanEmail)
    .single();

  if (existing) {
    return NextResponse.json({
      message: "You're already on the waitlist!",
      position: existing.position,
    });
  }

  const { data, error } = await supabase
    .from("pro_waitlist")
    .insert({ email: cleanEmail })
    .select("position")
    .single();

  if (error) {
    if (error.code === "23505") {
      // Race condition — already inserted
      const { data: dup } = await supabase
        .from("pro_waitlist")
        .select("position")
        .eq("email", cleanEmail)
        .single();
      return NextResponse.json({ message: "You're on the list!", position: dup?.position });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json({
    message: "You're on the Pro waitlist!",
    position: data?.position,
  });
}
