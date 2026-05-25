"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState(authError === "auth_failed" ? "Authentication failed. Please try again." : "");
  const [googleStatus, setGoogleStatus] = useState<"idle" | "loading">("idle");

  async function handleGoogleSignIn() {
    setError("");
    setGoogleStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setError("Could not start Google sign-in. Please try again.");
      setGoogleStatus("idle");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--status-success-bg, rgba(255,255,255,0.05))" }}>
            <svg className="h-8 w-8" style={{ color: "var(--status-success-text, #D4D4D4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-3 text-sm text-muted">
          We sent a magic link to <strong className="text-foreground">{email}</strong>.
          Click the link in the email to sign in.
        </p>
        <button
          onClick={() => { setStatus("idle"); setEmail(""); }}
          className="mt-6 text-sm text-white hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          ROBOT<span className="opacity-65">O</span><span className="opacity-45">MATED</span>
        </Link>
        <h1 className="mt-6 text-xl font-bold">Sign in to your account</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in with Google or get a magic link.
        </p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleStatus === "loading"}
          className="flex w-full items-center justify-center gap-3 rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {googleStatus === "loading" ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wider text-muted">OR</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-orange">{error}</p>}

        <Button type="submit" disabled={status === "sending"} className="w-full py-3">
          {status === "sending" ? "Sending..." : "Send Magic Link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="text-white hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="space-y-4 w-full max-w-sm"><div className="mx-auto h-6 w-32 animate-shimmer rounded bg-white/[0.03]" /><div className="h-12 w-full animate-shimmer rounded-lg bg-white/[0.03]" /><div className="h-12 w-full animate-shimmer rounded-lg bg-white/[0.03]" /></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
