"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "no-token">("idle");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
    }
  }, [token]);

  async function handleUnsubscribe() {
    if (!token) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "no-token") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Invalid Link</h1>
        <p className="mt-2 text-muted">This unsubscribe link appears to be invalid.</p>
        <Link href="/" className="mt-6 inline-block text-blue hover:underline">
          Go to Robotomated
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Unsubscribed</h1>
        <p className="mt-2 text-muted">
          You&apos;ve been removed from the weekly digest. We&apos;re sorry to see you go.
        </p>
        <Link href="/" className="mt-6 inline-block text-blue hover:underline">
          Back to Robotomated
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Unsubscribe</h1>
      <p className="mt-2 text-muted">
        Are you sure you want to unsubscribe from the Robotomated weekly digest?
      </p>
      <button
        onClick={handleUnsubscribe}
        disabled={status === "loading"}
        className="mt-6 rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Unsubscribing..." : "Yes, unsubscribe me"}
      </button>
      {status === "error" && (
        <p className="mt-4 text-sm text-orange">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}

export function UnsubscribeClient() {
  return (
    <Suspense fallback={<div className="text-center text-muted">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
