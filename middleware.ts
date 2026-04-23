import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiRateLimit } from "@/lib/cache/rate-limit";

// Use the *last* XFF hop (the edge-proxy-appended address) rather than the
// first — attackers can inject arbitrary values at the head of the list by
// sending their own XFF header, which lets them evade per-IP rate limits.
// Next 16 removed `request.ip`, so fall back to `x-real-ip` (also set by
// trusted edge infrastructure) before giving up.
function getClientIp(request: NextRequest): string {
  const last = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  return last ?? request.headers.get("x-real-ip") ?? "anonymous";
}

export async function middleware(request: NextRequest) {
  // API rate limiting
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (apiRateLimit) {
      const ip = getClientIp(request);
      const { success, limit, remaining, reset } = await apiRateLimit.limit(ip);
      if (!success) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        });
      }
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Fail closed: if auth lookup throws (network, bad JWT, etc.) treat as unauthenticated.
  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;

  // Protect /admin routes: require authenticated user with role = 'admin'.
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    let role: string | null = null;
    try {
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      role = data?.role ?? null;
    } catch {
      role = null;
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect /account routes
  if (pathname.startsWith("/account") && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/api/:path*"],
};
