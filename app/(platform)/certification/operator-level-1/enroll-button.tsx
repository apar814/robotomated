"use client";

import { useState } from "react";

export function EnrollButton() {
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/workforce-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const body = await res.json();
        if (body.error === "Not authenticated") {
          window.location.href =
            "/login?redirect=/certification/operator-level-1";
          return;
        }
        if (body.error === "Already enrolled in this cohort") {
          window.location.href = "/certification/welcome";
          return;
        }
        alert(body.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-white text-obsidian font-semibold py-3.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Redirecting to checkout..." : "Enroll Now"}
    </button>
  );
}
