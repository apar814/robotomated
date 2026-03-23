import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { article, helpful } = await request.json();

  if (!article || typeof helpful !== "boolean") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Store in a simple key-value approach using the existing database
  // For now, we'll use the price_history table pattern but log to console
  // In production, create a dedicated article_feedback table
  console.log(`Article feedback: ${article} — ${helpful ? "helpful" : "not helpful"}`);

  return NextResponse.json({ message: "Thanks for your feedback!" });
}
