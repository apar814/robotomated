"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-0">
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-neutral-400 focus:border-blue focus:outline-none sm:rounded-r-none"
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap sm:rounded-l-none"
      >
        {status === "loading" ? "Subscribing..." : "Get the Weekly RoboReport"}
      </Button>
      {status === "success" && (
        <p className="text-sm text-green sm:absolute sm:bottom-0 sm:left-0 sm:translate-y-8">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-orange sm:absolute sm:bottom-0 sm:left-0 sm:translate-y-8">
          {message}
        </p>
      )}
    </form>
  );
}
