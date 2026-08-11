import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Auth callback. Two shapes arrive here:
 *
 * 1. PKCE (?code=...) — Google OAuth always; magic links clicked in the SAME
 *    browser that requested them (the code_verifier cookie is present).
 *    Exchanged server-side for a session.
 *
 * 2. Implicit (#access_token=...&refresh_token=...) — magic links clicked in
 *    a DIFFERENT browser/device than the one that requested them (no
 *    code_verifier, so Supabase's verify endpoint falls back to fragment
 *    tokens). Fragments never reach the server, so we redirect to
 *    /auth/complete — browsers re-apply the fragment to the redirect target —
 *    where a client component finishes the session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/account";

  if (code) {
    const supabaseResponse = NextResponse.redirect(`${origin}${redirect}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] code exchange failed:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
    return supabaseResponse;
  }

  // No code: possible implicit-flow fragment tokens (invisible to the
  // server). Hand off to the client-side completion page — the URL fragment
  // survives the redirect.
  return NextResponse.redirect(
    `${origin}/auth/complete?redirect=${encodeURIComponent(redirect)}`
  );
}
