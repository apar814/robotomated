"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (loading) return <div className="h-8 w-16" />;

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/login"
          className="hidden whitespace-nowrap rounded-md border px-4 py-2 text-[14px] font-medium transition-colors hover:border-white/40 hover:text-white sm:inline-flex"
          style={{
            borderColor: "var(--theme-border-strong)",
            color: "var(--theme-text-secondary)",
          }}
        >
          Log In
        </Link>
        <Link
          href="/login?mode=signup"
          className="inline-flex whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-bold text-black transition-colors hover:opacity-90"
          style={{ background: "#FFFFFF" }}
        >
          Sign Up
        </Link>
      </div>
    );
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        {(user.email?.[0] || "?").toUpperCase()}
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50 w-48 rounded-xl border py-1 shadow-xl"
          style={{
            borderColor: "var(--theme-border)",
            background: "var(--theme-surface)",
          }}
        >
          <p
            className="truncate border-b px-4 py-2 text-xs"
            style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}
          >
            {user.email}
          </p>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Account
          </Link>
          <Link
            href="/account/saved"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Saved Robots
          </Link>
          <Link
            href="/account/billing"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Billing
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full border-t px-4 py-2 text-left text-sm transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-secondary)" }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
