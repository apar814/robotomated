"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/seo/faq-section";
import { cn } from "@/lib/utils/cn";
import { Suspense } from "react";

const features = [
  { name: "Browse & search robots", free: true, pro: true },
  { name: "RoboScore & reviews", free: true, pro: true },
  { name: "Robot comparison", free: "2 robots", pro: "Up to 5" },
  { name: "Robotimus conversations", free: "5/month", pro: "Unlimited" },
  { name: "Price drop alerts", free: "3 robots", pro: "Unlimited" },
  { name: "Pro Insights (extended specs)", free: false, pro: true },
  { name: "Ad-free experience", free: false, pro: true },
  { name: "Priority support", free: false, pro: true },
];

const faqs = [
  { question: "Can I cancel anytime?", answer: "Yes. Cancel from your account billing page at any time. You'll keep Pro access until the end of your current billing period." },
  { question: "What happens when I cancel?", answer: "Your account reverts to the free tier. You keep all your saved robots and reviews. Robotimus conversations and price alerts revert to free tier limits." },
  { question: "Is there a free trial?", answer: "Yes — every Pro subscription starts with a 7-day free trial. You won't be charged until the trial ends, and you can cancel anytime during the trial." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards via Stripe. Payment processing is fully handled by Stripe — we never see or store your card details." },
  { question: "Can I switch plans?", answer: "Currently we offer Free and Pro ($49/month). Enterprise plans with custom pricing are coming soon — contact us for early access." },
];

function ProPageContent() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === "Not authenticated") {
        window.location.href = "/login?redirect=/pro";
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div>
      {canceled && (
        <div className="border-b border-border bg-obsidian-2 px-4 py-3 text-center text-sm text-muted">
          Checkout canceled. No charges were made.
        </div>
      )}

      {/* Hero */}
      <section className="border-b border-border px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
            Robotomated Pro
          </span>
          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
            Unlock the full power of Robotomated
          </h1>
          <p className="mt-4 text-lg text-muted">
            Unlimited AI conversations, advanced comparisons, pro insights, and zero ads.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold">$49</span>
              <span className="text-muted">/month</span>
            </div>
            <p className="text-sm text-white">7-day free trial included</p>
          </div>
          <Button onClick={handleCheckout} disabled={loading} className="mt-6 px-8 py-3 text-base">
            {loading ? "Processing..." : "Start Free Trial"}
          </Button>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Free vs Pro</h2>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-obsidian-3">
                  <th className="px-5 py-3 text-left font-medium text-muted">Feature</th>
                  <th className="px-5 py-3 text-center font-medium text-muted">Free</th>
                  <th className="px-5 py-3 text-center font-medium text-white">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={f.name} className={i % 2 === 0 ? "bg-obsidian-2" : "bg-obsidian-3"}>
                    <td className="px-5 py-3 font-medium">{f.name}</td>
                    <td className="px-5 py-3 text-center">
                      <FeatureValue value={f.free} />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <FeatureValue value={f.pro} pro />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={handleCheckout} disabled={loading} className="px-8 py-3">
              {loading ? "Processing..." : "Start 7-Day Free Trial"}
            </Button>
            <p className="mt-3 text-xs text-muted">Cancel anytime. No questions asked.</p>
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">What Pro Users Say</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "Coming soon", role: "Warehouse Manager", quote: "Testimonial coming soon — we're collecting feedback from our early Pro users." },
              { name: "Coming soon", role: "Home Automation Enthusiast", quote: "Testimonial placeholder — real reviews will appear here after launch." },
              { name: "Coming soon", role: "Robotics Engineer", quote: "Testimonial placeholder — we'll feature real Pro user stories here." },
            ].map((t, i) => (
              <div key={i} className="obsidian-card p-5">
                <p className="text-sm italic text-muted">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-3">
                  <p className="text-xs font-semibold">{t.name}</p>
                  <p className="text-[13px] text-muted">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <FaqSection items={faqs} />
        </div>
      </section>
    </div>
  );
}

function FeatureValue({ value, pro }: { value: boolean | string; pro?: boolean }) {
  if (value === true) {
    return (
      <svg className={cn("mx-auto h-5 w-5", pro ? "text-white" : "text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (value === false) {
    return <span className="text-muted">—</span>;
  }
  return <span className={cn("text-xs", pro ? "font-semibold text-white" : "text-muted")}>{value}</span>;
}

export default function ProPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20 space-y-4"><div className="mx-auto h-8 w-40 animate-shimmer rounded bg-white/[0.03]" /><div className="mx-auto h-16 w-64 animate-shimmer rounded-lg bg-white/[0.03]" /><div className="h-48 w-full animate-shimmer rounded-lg bg-white/[0.03]" /></div>}>
      <ProPageContent />
    </Suspense>
  );
}
