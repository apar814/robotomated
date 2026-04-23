import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Cookie-aware admin guard for API route handlers. Uses the same SSR pattern
 * as middleware.ts: reads Supabase auth cookies from the incoming NextRequest
 * and resolves the logged-in user.
 *
 * Intended use case: admin-only writes on routes NOT already covered by the
 * /api/admin/* matcher in middleware.ts. Middleware handles /api/admin/*
 * automatically, so most admin routes don't need to call this directly.
 *
 * Returns null if the caller is authenticated AND has role = "admin".
 * Returns a 401 NextResponse otherwise -- the caller should return it immediately.
 *
 * Usage:
 *   export async function POST(request: NextRequest) {
 *     const denied = await requireAdmin(request);
 *     if (denied) return denied;
 *     // ... rest of handler
 *   }
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Route handlers can't mutate request cookies; ignore.
        },
      },
    }
  );

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
