"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FoundingRspActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(action: "approve" | "reject") {
    if (
      !confirm(
        `Are you sure you want to ${action} this application?`
      )
    ) {
      return;
    }

    setLoading(action);
    try {
      const res = await fetch("/api/robowork/founding-rsp/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Failed to ${action}: ${data.error || "Unknown error"}`);
        return;
      }

      router.refresh();
    } catch (err) {
      alert(`Failed to ${action}: ${err}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
        style={{
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 4,
          border: "none",
          cursor: loading ? "wait" : "pointer",
          backgroundColor: "#22c55e",
          color: "#000",
          opacity: loading === "reject" ? 0.5 : 1,
        }}
      >
        {loading === "approve" ? "..." : "Approve"}
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
        style={{
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 4,
          border: "none",
          cursor: loading ? "wait" : "pointer",
          backgroundColor: "#ef4444",
          color: "#fff",
          opacity: loading === "approve" ? 0.5 : 1,
        }}
      >
        {loading === "reject" ? "..." : "Reject"}
      </button>
    </div>
  );
}
