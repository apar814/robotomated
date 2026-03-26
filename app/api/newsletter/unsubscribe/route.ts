import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error, count } = await supabase
    .from("newsletter_subscribers")
    .delete({ count: "exact" })
    .eq("unsubscribe_token", token);

  if (error || !count) {
    return NextResponse.json(
      { error: "Token not found or already unsubscribed" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Unsubscribed successfully" });
}
