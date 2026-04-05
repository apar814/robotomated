"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const INDUSTRIES = [
  { value: "warehouse", label: "Warehouse & Logistics" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consumer", label: "Consumer / Home" },
  { value: "medical", label: "Medical & Healthcare" },
  { value: "construction", label: "Construction" },
  { value: "agricultural", label: "Agricultural" },
  { value: "general", label: "All Industries" },
];

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("general");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, industry }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg px-4 py-3 text-sm sm:rounded-r-none"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap sm:rounded-l-none"
        >
          {status === "loading" ? "Subscribing..." : "Get the Weekly RoboReport"}
        </Button>
      </div>
      <select
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        className="w-full rounded-lg px-4 py-2.5 text-sm sm:w-auto"
      >
        {INDUSTRIES.map((ind) => (
          <option key={ind.value} value={ind.value}>
            {ind.label}
          </option>
        ))}
      </select>
      {status === "success" && (
        <p className="text-sm text-green">{message}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-orange">{message}</p>
      )}
    </form>
  );
}
