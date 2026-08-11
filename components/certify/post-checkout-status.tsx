"use client";

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 90_000;

type Phase = "confirming" | "ready" | "starting" | "slow" | "error";

/**
 * Rendered on /certify/[level]?enrolled=true after Stripe checkout.
 * The webhook that records the payment can land seconds after the redirect,
 * so fast clickers would otherwise hit a bare 403 from /api/certify/start.
 * Polls the entitlement endpoint, then offers the exam start CTA.
 */
export function PostCheckoutStatus({ slug }: { slug: string }) {
  const [phase, setPhase] = useState<Phase>("confirming");
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (phase !== "confirming" && phase !== "slow") return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/certify/entitlement?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.enrolled) {
          setPhase("ready");
          return;
        }
        if (data.authenticated === false) {
          window.location.href = `/login?redirect=/certify/${slug}?enrolled=true`;
          return;
        }
      } catch {
        // transient network issue — keep polling
      }
      if (cancelled) return;
      if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) {
        setPhase("slow");
      }
    }

    const timer = setInterval(poll, POLL_INTERVAL_MS);
    poll();
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [slug, phase]);

  async function startExam() {
    setPhase("starting");
    setError("");
    try {
      const res = await fetch("/api/certify/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certification_slug: slug }),
      });
      const data = await res.json();
      if (data.session_id && data.session_token) {
        window.location.href = `/certify/exam/${data.session_id}?token=${data.session_token}`;
      } else {
        setPhase("error");
        setError(data.error || "Could not start the exam. Please try again.");
      }
    } catch {
      setPhase("error");
      setError("Connection issue — please retry.");
    }
  }

  return (
    <div className="border-b border-lime/20 bg-lime/[0.06] px-4 py-4">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
        {(phase === "confirming") && (
          <>
            <p className="text-sm font-semibold text-white">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-lime align-middle" />
              Payment received — confirming your enrollment…
            </p>
            <p className="text-xs text-white/50">
              This usually takes a few seconds. Keep this page open.
            </p>
          </>
        )}
        {phase === "slow" && (
          <>
            <p className="text-sm font-semibold text-white">
              Still confirming your enrollment
            </p>
            <p className="text-xs text-white/50">
              Your payment is safe — confirmation is just taking longer than
              usual. We&apos;ll keep checking; you can also refresh in a minute
              or email support@robotomated.com.
            </p>
          </>
        )}
        {(phase === "ready" || phase === "starting" || phase === "error") && (
          <>
            <p className="text-sm font-semibold text-lime">
              You&apos;re enrolled. Ready when you are.
            </p>
            <button
              onClick={startExam}
              disabled={phase === "starting"}
              className="mt-1 inline-flex items-center justify-center rounded-sm bg-white px-8 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:opacity-50"
            >
              {phase === "starting" ? "Preparing your exam…" : "Start Exam"}
            </button>
            <p className="text-xs text-white/50">
              Or study first — your enrollment is valid for 2 years.
            </p>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
