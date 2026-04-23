import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Call at the top of any write-method handler (POST/PUT/PATCH/DELETE) that
 * needs admin-only access. Returns null if authorized as admin.
 * Returns a 401 NextResponse if not -- the caller should return it immediately.
 *
 * Usage:
 *   export async function POST(request: NextRequest) {
 *     const denied = await requireAdmin(request);
 *     if (denied) return denied;
 *     // ... rest of handler
 *   }
 */
export async function requireAdmin(
  _request: NextRequest
): Promise<NextResponse | null> {
  const supabase = createServerClient();

  let userId: string | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    userId = null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let role: string | null = null;
  try {
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();
    role = data?.role ?? null;
  } catch {
    role = null;
  }

  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
