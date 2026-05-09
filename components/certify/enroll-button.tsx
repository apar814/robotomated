"use client";

import { useState, useEffect } from "react";

interface EnrollButtonProps {
  slug: string;
  price: number;
  rspPrice: number;
  className?: string;
}

export function EnrollButton({ slug, price, rspPrice, className }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 8000);
    return () => clearTimeout(timer);
  }, [error]);

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/certify-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === "Not authenticated") {
        window.location.href = `/login?redirect=/certify/${slug}`;
      } else {
        setError("Something went wrong — please try again or contact support@robotomated.com");
        setLoading(false);
      }
    } catch {
      setError("Connection issue — please check your network and retry");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-sm bg-white px-10 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:opacity-50 ${className || ""}`}
      >
        {loading ? "Processing..." : `Enroll Now — $${price}`}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
      <p className="text-xs text-white/50">
        RSP members: ${rspPrice} &middot; Team pricing available for 5+ seats
      </p>
    </div>
  );
}
