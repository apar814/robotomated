import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/seo/json-ld";
import { RspReferralDashboard } from "@/components/robowork/rsp-referral-dashboard";

export const metadata: Metadata = {
  title: "Refer an RSP — Earn $500 | Robotomated",
  description:
    "Refer a Robot Service Provider to Robotomated and earn $500 for every qualified referral. Share your referral link and grow the network.",
  openGraph: {
    title: "Refer an RSP — Earn $500 | Robotomated",
    description:
      "Refer a Robot Service Provider to Robotomated and earn $500 for every qualified referral.",
    url: "https://robotomated.com/robowork/referrals",
    type: "website",
  },
};

export default async function RspReferralsPage() {
  const supabase = createServerClient();

  // Check if user is authenticated and is an RSP
  const {
    data: { user },
  } = await (supabase as any).auth.getUser();

  let rsp = null;
  let referrals: any[] = [];

  if (user) {
    const { data } = await (supabase as any)
      .from("robot_service_providers")
      .select("id, referral_code, referral_count, company_name")
      .eq("user_id", user.id)
      .single();

    rsp = data;

    if (rsp) {
      const { data: refs } = await (supabase as any)
        .from("rsp_referrals")
        .select("id, status, reward_amount, created_at, qualified_at, paid_at, referred_id")
        .eq("referrer_id", rsp.id)
        .order("created_at", { ascending: false });

      if (refs) {
        for (const ref of refs) {
          const { data: referred } = await (supabase as any)
            .from("robot_service_providers")
            .select("company_name")
            .eq("id", ref.referred_id)
            .single();
          referrals.push({
            ...ref,
            company_name: referred?.company_name || "Unknown",
          });
        }
      }
    }
  }

  const qualified = referrals.filter((r) => r.status === "qualified").length;
  const paid = referrals.filter((r) => r.status === "paid").length;

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Refer an RSP — Earn $500 | Robotomated",
          description:
            "Refer a Robot Service Provider to Robotomated and earn $500 for every qualified referral.",
          url: "https://robotomated.com/robowork/referrals",
          publisher: { "@type": "Organization", name: "Robotomated" },
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5">
            <span className="font-mono text-[13px] uppercase tracking-widest text-white">
              RSP Referral Program
            </span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-6xl">
            Refer an RSP.{" "}
            <span className="text-white">Earn $500.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Know a great robotics service company? Refer them to Robotomated.
            When they complete their first job, you earn $500.
            No cap on referrals.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              How It Works
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Share Your Link",
                desc: "Generate your unique referral link and share it with RSPs in your network.",
              },
              {
                step: "02",
                title: "They Register",
                desc: "The referred RSP signs up using your link and completes verification.",
              },
              {
                step: "03",
                title: "You Earn $500",
                desc: "Once they complete their first job, you receive $500. Simple as that.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-lg border border-border bg-obsidian-surface p-6 transition-all hover:-translate-y-0.5 hover:border-border-active"
              >
                <span className="mb-3 inline-block font-mono text-2xl font-extrabold text-white">
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD OR CTA */}
      {rsp ? (
        <RspReferralDashboard
          referralCode={rsp.referral_code}
          referralCount={rsp.referral_count || 0}
          qualifiedCount={qualified}
          paidCount={paid}
          totalEarned={paid * 500}
          referrals={referrals}
        />
      ) : (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-lg border border-border bg-obsidian-surface p-10">
              <h2 className="font-display text-2xl font-extrabold text-text-primary">
                {user ? "Become an RSP to Start Referring" : "Sign In to Access Your Referral Dashboard"}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
                {user
                  ? "You need to be a registered Robot Service Provider to participate in the referral program."
                  : "Log in to your RSP account or register as a new Robot Service Provider to start earning referral rewards."}
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                {!user && (
                  <a
                    href="/auth/login"
                    className="inline-flex items-center rounded-md border border-border bg-obsidian-surface px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-active"
                  >
                    Sign In
                  </a>
                )}
                <a
                  href="/robowork/providers/register"
                  className="inline-flex items-center rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-[#0A0F1E] transition-colors hover:bg-white/90"
                >
                  Register as RSP
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
