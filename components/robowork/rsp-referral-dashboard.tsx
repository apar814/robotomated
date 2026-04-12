"use client";

import { useState } from "react";

interface Referral {
  id: string;
  status: "pending" | "qualified" | "paid";
  reward_amount: number;
  created_at: string;
  qualified_at: string | null;
  paid_at: string | null;
  company_name: string;
}

interface Props {
  referralCode: string | null;
  referralCount: number;
  qualifiedCount: number;
  paidCount: number;
  totalEarned: number;
  referrals: Referral[];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", label: "Pending" },
  qualified: { bg: "bg-electric-blue/10", text: "text-electric-blue", label: "Qualified" },
  paid: { bg: "bg-blue-600/10", text: "text-blue-400", label: "Paid" },
};

export function RspReferralDashboard({
  referralCode: initialCode,
  referralCount,
  qualifiedCount,
  paidCount,
  totalEarned,
  referrals,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const referralLink = code
    ? `https://robotomated.com/robowork/providers/register?ref=${code}`
    : null;

  async function generateCode() {
    setGenerating(true);
    try {
      const res = await fetch("/api/robowork/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-code" }),
      });
      const data = await res.json();
      if (data.referral_code) {
        setCode(data.referral_code);
      }
    } catch (err) {
      console.error("Failed to generate code:", err);
    } finally {
      setGenerating(false);
    }
  }

  function copyToClipboard(text: string, type: "code" | "link") {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  function shareOnLinkedIn() {
    if (!referralLink) return;
    const text = encodeURIComponent(
      "I'm a Robot Service Provider on Robotomated — the world's first RaaS marketplace. Join using my referral link and let's grow the robotics services industry together."
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}&summary=${text}`,
      "_blank"
    );
  }

  function shareOnX() {
    if (!referralLink) return;
    const text = encodeURIComponent(
      `Join me on @robotomated — the world's first RaaS marketplace for Robot Service Providers. Sign up with my referral link: ${referralLink}`
    );
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  }

  return (
    <>
      {/* REFERRAL CODE & LINK */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              Your Referral Link
            </span>
          </div>

          {code ? (
            <div className="space-y-4">
              {/* Code display */}
              <div className="flex items-center gap-3 rounded-lg border border-border bg-obsidian-surface p-4">
                <div className="flex-1">
                  <p className="text-xs text-text-ghost">Your referral code</p>
                  <p className="mt-1 font-mono text-lg font-bold text-text-primary">
                    {code}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(code, "code")}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-border-active hover:text-text-primary"
                >
                  {copied === "code" ? "Copied!" : "Copy Code"}
                </button>
              </div>

              {/* Link display */}
              <div className="flex items-center gap-3 rounded-lg border border-border bg-obsidian-surface p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-ghost">Your referral link</p>
                  <p className="mt-1 truncate font-mono text-sm text-electric-blue">
                    {referralLink}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(referralLink!, "link")}
                  className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-[#0A0F1E] transition-colors hover:bg-blue-600/90"
                >
                  {copied === "link" ? "Copied!" : "Copy Link"}
                </button>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={shareOnLinkedIn}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-[#0A66C2] hover:text-[#0A66C2]"
                >
                  Share on LinkedIn
                </button>
                <button
                  onClick={shareOnX}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                >
                  Share on X
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-obsidian-surface p-8 text-center">
              <p className="text-sm text-text-secondary">
                Generate your unique referral code to start earning $500 per
                qualified referral.
              </p>
              <button
                onClick={generateCode}
                disabled={generating}
                className="mt-4 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-[#0A0F1E] transition-colors hover:bg-blue-600/90 disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Referral Code"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Referrals", value: referralCount, color: "text-text-primary" },
              { label: "Qualified", value: qualifiedCount, color: "text-electric-blue" },
              { label: "Paid Out", value: paidCount, color: "text-blue-400" },
              { label: "Total Earned", value: `$${totalEarned.toLocaleString()}`, color: "text-blue-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-obsidian-surface p-5 text-center"
              >
                <p className={`font-mono text-2xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-text-ghost">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERRALS TABLE */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              Your Referrals
            </span>
          </div>

          {referrals.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-obsidian-surface">
                    <th className="px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                      Company
                    </th>
                    <th className="px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                      Date
                    </th>
                    <th className="px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                      Reward
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((ref) => {
                    const style = STATUS_STYLES[ref.status] || STATUS_STYLES.pending;
                    return (
                      <tr
                        key={ref.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-text-primary">
                          {ref.company_name}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {new Date(ref.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[13px] font-semibold uppercase tracking-wider ${style.bg} ${style.text}`}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-text-secondary">
                          ${ref.reward_amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-obsidian-surface p-10 text-center">
              <p className="text-sm text-text-secondary">
                No referrals yet. Share your referral link to start earning $500
                per qualified RSP.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
