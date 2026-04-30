"use client";

import { useState } from "react";

interface EnrollButtonProps {
  slug: string;
  price: number;
  rspPrice: number;
  className?: string;
}

export function EnrollButton({ slug, price, rspPrice, className }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
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
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-lg px-10 py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-50 ${className || ""}`}
      >
        {loading ? "Processing..." : `Enroll Now — $${price}`}
      </button>
      <p className="text-xs text-white/50">
        RSP members: ${rspPrice} &middot; Team pricing available for 5+ seats
      </p>
    </div>
  );
}
