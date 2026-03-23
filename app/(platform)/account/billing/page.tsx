"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

interface UserProfile {
  subscription_tier: string;
  subscription_ends_at: string | null;
  stripe_customer_id: string | null;
}

function BillingContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase
        .from("users")
        .select("subscription_tier, subscription_ends_at, stripe_customer_id")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data as UserProfile | null);
          setLoading(false);
        });
    });
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setPortalLoading(false);
    } catch {
      setPortalLoading(false);
    }
  }

  if (loading) return <div className="py-20 text-center text-muted">Loading...</div>;

  const isPro = profile?.subscription_tier === "pro" || profile?.subscription_tier === "enterprise";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {success && (
        <div className="mb-6 rounded-xl border border-green/20 bg-green/5 p-4 text-center">
          <p className="font-semibold text-green">Welcome to Robotomated Pro!</p>
          <p className="mt-1 text-sm text-muted">Your 7-day free trial has started.</p>
        </div>
      )}

      <h1 className="text-2xl font-bold">Billing</h1>

      {/* Current plan */}
      <div className="mt-6 rounded-xl border border-border bg-navy-light p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Current Plan</h2>
            <p className="mt-2 text-xl font-bold">
              {isPro ? (
                <span className="bg-gradient-to-r from-blue to-violet bg-clip-text text-transparent">
                  Robotomated Pro
                </span>
              ) : (
                "Free"
              )}
            </p>
            {isPro && profile?.subscription_ends_at && (
              <p className="mt-1 text-sm text-muted">
                Next billing: {new Date(profile.subscription_ends_at).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </p>
            )}
          </div>
          <div>
            {isPro ? (
              <span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue">Active</span>
            ) : (
              <span className="rounded-full bg-navy-lighter px-3 py-1 text-xs font-semibold text-muted">Free Tier</span>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {isPro ? (
            <Button variant="secondary" onClick={openPortal} disabled={portalLoading}>
              {portalLoading ? "Loading..." : "Manage Subscription"}
            </Button>
          ) : (
            <Link
              href="/pro"
              className="rounded-lg bg-gradient-to-r from-blue to-violet px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Upgrade to Pro — $49/mo
            </Link>
          )}
        </div>
      </div>

      {/* What's included */}
      <div className="mt-6 rounded-xl border border-border bg-navy-light p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          {isPro ? "Your Pro Features" : "Free Tier Includes"}
        </h2>
        <ul className="space-y-2 text-sm text-muted">
          {isPro ? (
            <>
              <li className="flex items-center gap-2"><Check /> Unlimited AI Advisor conversations</li>
              <li className="flex items-center gap-2"><Check /> Unlimited price drop alerts</li>
              <li className="flex items-center gap-2"><Check /> Compare up to 5 robots</li>
              <li className="flex items-center gap-2"><Check /> Pro Insights on all robots</li>
              <li className="flex items-center gap-2"><Check /> Ad-free experience</li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-2"><Check /> Browse all robots & reviews</li>
              <li className="flex items-center gap-2"><Check /> 5 AI Advisor conversations/month</li>
              <li className="flex items-center gap-2"><Check /> 3 price drop alerts</li>
              <li className="flex items-center gap-2"><Check /> Compare 2 robots at a time</li>
            </>
          )}
        </ul>
      </div>

      <div className="mt-6 text-center">
        <Link href="/account" className="text-sm text-muted hover:text-foreground">
          &larr; Back to Account
        </Link>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg className="h-4 w-4 shrink-0 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
}
