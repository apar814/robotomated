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

  if (loading) return <div className="h-8 w-8" />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
      >
        Sign In
      </Link>
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
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue to-violet text-xs font-bold text-white"
      >
        {(user.email?.[0] || "?").toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-border bg-navy-light py-1 shadow-xl">
          <p className="truncate border-b border-border px-4 py-2 text-xs text-muted">
            {user.email}
          </p>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-muted transition-colors hover:bg-navy-lighter hover:text-foreground"
          >
            Account
          </Link>
          <Link
            href="/account/saved"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-muted transition-colors hover:bg-navy-lighter hover:text-foreground"
          >
            Saved Robots
          </Link>
          <Link
            href="/account/billing"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-muted transition-colors hover:bg-navy-lighter hover:text-foreground"
          >
            Billing
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full border-t border-border px-4 py-2 text-left text-sm text-muted transition-colors hover:bg-navy-lighter hover:text-foreground"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
