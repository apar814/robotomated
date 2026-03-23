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
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
            <svg className="h-8 w-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          className="mt-6 text-sm text-blue hover:underline"
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
          No password needed — we&apos;ll send you a magic link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            className="w-full rounded-lg border border-border bg-navy-light px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-blue focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-orange">{error}</p>}

        <Button type="submit" disabled={status === "sending"} className="w-full py-3">
          {status === "sending" ? "Sending..." : "Send Magic Link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="text-blue hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="text-blue hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
