import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: certifications, error } = await supabase
      .from("rco_certifications")
      .select(
        "id, name, level, slug, description, price, question_count, exam_duration, passing_score, prerequisites, skills, specialization, industries, active"
      )
      .eq("active", true)
      .order("level", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch certifications" },
        { status: 500 }
      );
    }

    return NextResponse.json({ certifications: certifications || [] });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
