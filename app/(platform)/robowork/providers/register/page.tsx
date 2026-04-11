import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RegisterWizard } from "@/components/robowork/register-wizard";
import { IconTarget, IconDollar, IconTrophy } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Become a Robot Service Provider — RoboWork | Robotomated",
  description:
    "Join RoboWork, the world's first Robot-as-a-Service marketplace. List your robots, set your rates, get certified, and connect with businesses that need automation. Free 15-minute registration.",
  openGraph: {
    title: "Become a Robot Service Provider — RoboWork | Robotomated",
    description:
      "List your robots, set your rates, and connect with businesses that need automation on the world's first RaaS marketplace.",
    url: "https://robotomated.com/robowork/providers/register",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://robotomated.com/robowork/providers/register",
  },
};

const VALUE_PROPS: { icon: ReactNode; label: string; title: string; description: string }[] = [
  {
    icon: <IconTarget size={20} />,
    label: "GET FOUND",
    title: "Your robots, front and center",
    description:
      "Businesses searching for automation solutions find you first. Your profile, fleet, and specializations are indexed, ranked, and surfaced to decision-makers actively looking to deploy robots.",
  },
  {
    icon: <IconDollar size={20} />,
    label: "GET PAID",
    title: "Transparent pricing, zero surprises",
    description:
      "Set daily, weekly, and monthly rates. Customers see exactly what they'll pay. No hidden fees, no bidding wars — just clear pricing that builds trust and closes deals faster.",
  },
  {
    icon: <IconTrophy size={20} />,
    label: "GET CERTIFIED",
    title: "Verification that earns trust",
    description:
      "Our tiered verification system — Basic, Verified, Premium — signals credibility to buyers. Certified providers see 3x more inquiries than unverified listings.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Create your profile",
    subtitle: "5 minutes",
    description:
      "Company name, service areas, specializations. The basics that tell customers who you are and where you operate.",
  },
  {
    number: "02",
    title: "List your fleet",
    subtitle: "5 minutes",
    description:
      "Add robots from our database or enter custom models. Set rates, availability, and fulfillment options for each unit.",
  },
  {
    number: "03",
    title: "Verify and go live",
    subtitle: "5 minutes",
    description:
      "Confirm your email and phone. Optionally complete identity verification for Premium tier. Then publish — you're live.",
  },
];

const BETA_MARKETS = [
  "Los Angeles",
  "Chicago",
  "Dallas",
  "Atlanta",
  "New Jersey",
];

export default function RegisterProviderPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section
        style={{
          borderBottom: "1px solid var(--theme-border)",
          padding: "3rem 1rem 3.5rem",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "RoboWork", href: "/robowork" },
              { name: "Register", href: "/robowork/providers/register" },
            ]}
          />

          <p
            style={{
              marginTop: "2rem",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--theme-text-secondary)",
            }}
          >
            PROVIDER REGISTRATION
          </p>

          <h1
            style={{
              marginTop: "0.75rem",
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--theme-text)",
            }}
          >
            Build your robotics business on the world&apos;s first RaaS
            marketplace.
          </h1>

          <p
            style={{
              marginTop: "1rem",
              maxWidth: "560px",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "var(--theme-text-secondary)",
            }}
          >
            List your robots, set your own rates, and get matched with
            businesses that need automation — all in a free 15-minute
            registration.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginTop: "1.75rem",
            }}
          >
            <a
              href="#wizard"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "#0EA5E9",
                color: "#000",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.15s ease",
              }}
            >
              Start Your Free Profile →
            </a>
            <a
              href="#how-it-works"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--theme-border)",
                backgroundColor: "transparent",
                color: "var(--theme-text)",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "border-color 0.15s ease",
              }}
            >
              See how it works ↓
            </a>
          </div>

          {/* Social proof */}
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.8125rem",
              color: "var(--theme-text-secondary)",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.02em",
            }}
          >
            Joining 500+ Robot Service Providers across 5 markets
          </p>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section style={{ padding: "3rem 1rem" }}>
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.label}
              style={{
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--theme-border)",
                backgroundColor: "var(--theme-bg-secondary)",
              }}
            >
              <span style={{ display: "flex" }}>{prop.icon}</span>
              <p
                style={{
                  marginTop: "0.75rem",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#0EA5E9",
                  fontWeight: 600,
                }}
              >
                {prop.label}
              </p>
              <h3
                style={{
                  marginTop: "0.5rem",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--theme-text)",
                  lineHeight: 1.3,
                }}
              >
                {prop.title}
              </h3>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  color: "var(--theme-text-secondary)",
                }}
              >
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        style={{
          scrollMarginTop: "5rem",
          padding: "3rem 1rem",
          borderTop: "1px solid var(--theme-border)",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--theme-text-secondary)",
            }}
          >
            HOW IT WORKS
          </p>
          <h2
            style={{
              marginTop: "0.5rem",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--theme-text)",
            }}
          >
            Live in 15 minutes. Seriously.
          </h2>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            {HOW_IT_WORKS_STEPS.map((s) => (
              <div
                key={s.number}
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: "2.5rem",
                    height: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.5rem",
                    backgroundColor: "rgba(14, 165, 233, 0.1)",
                    color: "#0EA5E9",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  }}
                >
                  {s.number}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--theme-text)",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      marginTop: "0.125rem",
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.75rem",
                      color: "#0EA5E9",
                    }}
                  >
                    {s.subtitle}
                  </p>
                  <p
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      color: "var(--theme-text-secondary)",
                    }}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Beta Markets ── */}
      <section
        style={{
          padding: "3rem 1rem",
          borderTop: "1px solid var(--theme-border)",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--theme-text-secondary)",
            }}
          >
            PRIORITY LAUNCH MARKETS
          </p>
          <h2
            style={{
              marginTop: "0.5rem",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--theme-text)",
            }}
          >
            We&apos;re launching in 5 metros first
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "var(--theme-text-secondary)",
            }}
          >
            Providers in these markets get early access, priority support, and
            founding-member pricing. Not in one of these cities? Register anyway
            — we&apos;re expanding fast.
          </p>
          <div
            style={{
              marginTop: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {BETA_MARKETS.map((market) => (
              <span
                key={market}
                style={{
                  display: "inline-block",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(14, 165, 233, 0.12)",
                  color: "#0EA5E9",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                }}
              >
                {market}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founding RSP Callout ── */}
      <section
        style={{
          padding: "2.5rem 1rem",
          borderTop: "1px solid var(--theme-border)",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            backgroundColor: "rgba(245, 158, 11, 0.06)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#F59E0B",
              fontWeight: 600,
            }}
          >
            FOUNDING RSP PROGRAM
          </p>
          <h3
            style={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--theme-text)",
            }}
          >
            Be one of the first. Get benefits forever.
          </h3>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "var(--theme-text-secondary)",
            }}
          >
            The first 100 RSPs in each market receive permanently reduced
            commission rates, a Founding RSP badge on their profile, and direct
            access to our product team.
          </p>
          <a
            href="/robowork/founding-rsp"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#F59E0B",
              textDecoration: "none",
            }}
          >
            Learn about the Founding RSP program →
          </a>
        </div>
      </section>

      {/* ── Registration Wizard ── */}
      <section
        id="wizard"
        style={{
          padding: "3rem 1rem 4rem",
          borderTop: "1px solid var(--theme-border)",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--theme-text-secondary)",
              marginBottom: "1.5rem",
            }}
          >
            START YOUR REGISTRATION
          </p>
          <RegisterWizard />
        </div>
      </section>
    </div>
  );
}
