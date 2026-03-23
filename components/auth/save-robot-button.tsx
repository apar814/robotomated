"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

export function SaveRobotButton({ robotId, className }: { robotId: string; className?: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) { setLoading(false); return; }

      supabase
        .from("user_saved_robots")
        .select("id")
        .eq("user_id", uid)
        .eq("robot_id", robotId)
        .maybeSingle()
        .then(({ data: row }) => {
          setSaved(!!row);
          setLoading(false);
        });
    });
  }, [robotId]);

  async function toggle() {
    if (!userId) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (saved) {
      await supabase
        .from("user_saved_robots")
        .delete()
        .eq("user_id", userId)
        .eq("robot_id", robotId);
      setSaved(false);
    } else {
      await supabase
        .from("user_saved_robots")
        .insert({ user_id: userId, robot_id: robotId });
      setSaved(true);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "rounded-lg border p-2 transition-all",
        saved
          ? "border-pink-500/30 bg-pink-500/10 text-pink-400"
          : "border-border text-muted hover:border-pink-500/30 hover:text-pink-400",
        loading && "opacity-50",
        className
      )}
      aria-label={saved ? "Unsave robot" : "Save robot"}
      title={saved ? "Remove from saved" : "Save robot"}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
