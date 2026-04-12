import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Newsletter Referral Leaderboard — Robotomated",
  description: "See the top referrers in the Robotomated newsletter community. Refer 3 friends to earn our Robot Buyer's Guide PDF.",
  alternates: { canonical: "/newsletter/leaderboard" },
};

interface Referrer {
  email: string;
  referral_count: number;
}

export default async function LeaderboardPage() {
  let leaders: Referrer[] = [];

  try {
    const supabase = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("newsletter_subscribers")
      .select("email, referral_count")
      .gt("referral_count", 0)
      .order("referral_count", { ascending: false })
      .limit(25);
    leaders = data || [];
  } catch {
    // referral_count column may not exist yet
  }

  function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!domain) return "***";
    const masked = local.length > 2 ? local[0] + "***" + local.slice(-1) : "***";
    return `${masked}@${domain}`;
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <section className="px-4 pb-16 pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2563EB]">
            Newsletter Community
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
            Referral Leaderboard
          </h1>
          <p className="mt-3 text-white/50">
            Refer 3 friends to the Robotomated newsletter and earn our{" "}
            <span className="font-semibold text-[#60A5FA]">Robot Buyer&apos;s Guide PDF</span>.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-xl">
          {leaders.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-sm text-white/40">
                No referrals yet. Be the first to share your referral link!
              </p>
              <a
                href="/newsletter"
                className="mt-4 inline-block rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Subscribe and get your link
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {leaders.map((leader, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg border px-5 py-3 ${
                    i === 0
                      ? "border-[#60A5FA]/30 bg-[#60A5FA]/[0.04]"
                      : i < 3
                        ? "border-[#2563EB]/20 bg-[#2563EB]/[0.02]"
                        : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold ${
                        i === 0
                          ? "bg-[#60A5FA] text-black"
                          : i < 3
                            ? "bg-[#2563EB]/20 text-[#2563EB]"
                            : "bg-white/10 text-white/40"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-white/70">{maskEmail(leader.email)}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-white">
                    {leader.referral_count} referral{leader.referral_count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-xl border border-[#7B2FFF]/20 bg-[#7B2FFF]/[0.04] p-6 text-center">
            <h2 className="text-sm font-semibold text-white">How it works</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-2xl font-bold text-[#2563EB]">1</p>
                <p className="mt-1 text-xs text-white/50">Subscribe to the newsletter</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-[#2563EB]">2</p>
                <p className="mt-1 text-xs text-white/50">Share your unique referral link</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-[#60A5FA]">3</p>
                <p className="mt-1 text-xs text-white/50">3 referrals = Robot Buyer&apos;s Guide PDF</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
