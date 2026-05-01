"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PriceAlertFormProps {
  robotId: string;
  robotName: string;
  currentPrice: number | null;
}

export function PriceAlertForm({ robotId, robotName, currentPrice }: PriceAlertFormProps) {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState(
    currentPrice ? Math.round(currentPrice * 0.9).toString() : ""
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !targetPrice) return;

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          robot_id: robotId,
          email: email.trim().toLowerCase(),
          target_price: parseFloat(targetPrice),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to set alert");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-white/5 p-5 text-center" style={{ borderColor: "var(--status-success, #3A5876)" }}>
        <p className="font-semibold" style={{ color: "var(--status-success-text, #6B8AB8)" }}>Price alert set!</p>
        <p className="mt-1 text-sm text-muted">
          We&apos;ll email you when {robotName} drops below ${parseFloat(targetPrice).toLocaleString()}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-navy-light p-5">
      <h3 className="text-sm font-semibold">Price Drop Alert</h3>
      <p className="mt-1 text-xs text-muted">
        We&apos;ll email you when the price drops below your target.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
            />
          </div>
          <div className="w-32">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
              <input
                type="number"
                required
                min={1}
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Target"
                className="w-full rounded-lg border border-border bg-navy-lighter py-2.5 pl-7 pr-3 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-orange">{error}</p>}

        <Button type="submit" disabled={status === "submitting"} className="w-full">
          {status === "submitting" ? "Setting alert..." : "Set Price Alert"}
        </Button>
      </form>
    </div>
  );
}
