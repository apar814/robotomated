import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const { robot_id, action } = await request.json();

  if (!robot_id || !["save", "unsave"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabaseResponse = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (action === "save") {
    const { error } = await supabase
      .from("user_saved_robots")
      .insert({ user_id: user.id, robot_id });

    if (error && error.code !== "23505") {
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  } else {
    await supabase
      .from("user_saved_robots")
      .delete()
      .eq("user_id", user.id)
      .eq("robot_id", robot_id);
  }

  return supabaseResponse;
}
