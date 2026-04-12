import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Robotomated API -- Developer Portal",
  description:
    "Access the world's most comprehensive robot database via the Robotomated Intelligence API. Browse endpoints, pricing, authentication, and code examples.",
};

/* ------------------------------------------------------------------ */
/*  Reusable code block                                                */
/* ------------------------------------------------------------------ */
function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg bg-[#0a0a0a] p-4">
      {label && (
        <span className="mb-2 block font-mono text-xs text-[#00C2FF]">
          {label}
        </span>
      )}
      <pre className="font-mono text-sm leading-relaxed text-[#e0e0e0] whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Endpoint card                                                      */
/* ------------------------------------------------------------------ */
function Endpoint({
  method,
  path,
  params,
  description,
}: {
  method: string;
  path: string;
  params?: string;
  description: string;
}) {
  const methodColor =
    method === "POST"
      ? "bg-[#7B2FFF]/15 text-[#7B2FFF]"
      : "bg-[#00E5A0]/15 text-[#00E5A0]";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3">
        <span
          className={`rounded px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-wider ${methodColor}`}
        >
          {method}
        </span>
        <code className="font-mono text-sm text-[#00C2FF]">{path}</code>
      </div>
      {params && (
        <code className="mt-2 block font-mono text-xs text-gray-500">
          {params}
        </code>
      )}
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing tier card                                                   */
/* ------------------------------------------------------------------ */
function PricingCard({
  name,
  price,
  period,
  requests,
  features,
  highlight,
  cta,
  ctaHref,
}: {
  name: string;
  price: string;
  period?: string;
  requests: string;
  features: string[];
  highlight?: boolean;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 ${
        highlight
          ? "border-[#7B2FFF] bg-[#7B2FFF]/5"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#7B2FFF] px-3 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-wider text-white">
          Most Popular
        </span>
      )}
      <h3 className="font-display text-lg font-bold">{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-[family-name:var(--font-mono)] text-3xl font-bold">{price}</span>
        {period && <span className="text-sm text-gray-400">{period}</span>}
      </div>
      <p className="mt-2 text-sm text-[#00C2FF]">{requests}</p>
      <ul className="mt-5 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-0.5 text-[#00E5A0]">--</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
          highlight
            ? "bg-[#7B2FFF] text-white hover:bg-[#6a24e0]"
            : "border border-white/20 text-white hover:bg-white/5"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function DevelopersPage() {
  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="border-b border-white/10 px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Developers", href: "/developers" },
            ]}
          />
          <p className="mt-8 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ DEVELOPER PORTAL ]</p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Robotomated Intelligence API
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Access the world&apos;s most comprehensive robot database.
            Specifications, pricing, RoboScores, market analytics, and TCO
            modeling -- all via a single REST API.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#getting-started"
              className="rounded-lg bg-[#00C2FF] px-6 py-3 text-sm font-semibold text-[#0A0F1E] transition hover:bg-[#00b0e6]"
            >
              Get Started
            </Link>
            <Link
              href="#endpoints"
              className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              View Endpoints
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Pricing ---- */}
      <section className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB] text-center">[ PRICING ]</p>
          <h2 className="font-display mt-3 mb-2 text-center text-2xl font-bold">
            API Pricing
          </h2>
          <p className="mb-10 text-center text-sm text-gray-400">
            Start free. Scale when you need to.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <PricingCard
              name="Free"
              price="$0"
              period="/mo"
              requests="100 requests/day"
              features={[
                "Robot specifications",
                "Category browsing",
                "Manufacturer data",
                "Community support",
              ]}
              cta="Get Free Key"
              ctaHref="/login"
            />
            <PricingCard
              name="Starter"
              price="$99"
              period="/mo"
              requests="1,000 requests/day"
              features={[
                "Everything in Free",
                "Search API",
                "Market statistics",
                "Email support",
                "90-day data retention",
              ]}
              cta="Start Trial"
              ctaHref="/login"
            />
            <PricingCard
              name="Pro"
              price="$499"
              period="/mo"
              requests="10,000 requests/day"
              highlight
              features={[
                "Everything in Starter",
                "TCO calculator API",
                "Lease calculator API",
                "Webhook events",
                "Priority support",
                "Unlimited data retention",
              ]}
              cta="Start Trial"
              ctaHref="/login"
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              requests="Unlimited requests"
              features={[
                "Everything in Pro",
                "Dedicated endpoints",
                "Custom integrations",
                "SLA guarantee",
                "Dedicated account manager",
                "On-premise deployment",
              ]}
              cta="Contact Sales"
              ctaHref="mailto:api@robotomated.com"
            />
          </div>
        </div>
      </section>

      {/* ---- Getting Started ---- */}
      <section
        id="getting-started"
        className="border-b border-white/10 px-4 py-16"
      >
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ QUICKSTART ]</p>
          <h2 className="font-display mt-3 mb-8 text-2xl font-bold">
            Getting Started
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C2FF]/15 font-[family-name:var(--font-brand)] text-sm font-bold text-[#00C2FF]">
                  1
                </span>
                <h3 className="font-semibold">Create an account</h3>
              </div>
              <p className="mt-3 pl-11 text-sm text-gray-400">
                Sign up at{" "}
                <Link
                  href="/login"
                  className="text-[#00C2FF] underline underline-offset-2"
                >
                  robotomated.com/login
                </Link>{" "}
                to access the developer dashboard.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C2FF]/15 font-[family-name:var(--font-brand)] text-sm font-bold text-[#00C2FF]">
                  2
                </span>
                <h3 className="font-semibold">Generate an API key</h3>
              </div>
              <p className="mt-3 pl-11 text-sm text-gray-400">
                Navigate to your account settings and generate a new API key.
                Copy it immediately -- it will only be shown once.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C2FF]/15 font-[family-name:var(--font-brand)] text-sm font-bold text-[#00C2FF]">
                  3
                </span>
                <h3 className="font-semibold">Make your first request</h3>
              </div>
              <div className="mt-3 pl-11">
                <CodeBlock label="cURL">{`curl -H "x-api-key: rtm_live_YOUR_KEY" \\
  https://robotomated.com/api/v1/robots?limit=5`}</CodeBlock>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Authentication ---- */}
      <section className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ AUTH ]</p>
          <h2 className="font-display mt-3 mb-6 text-2xl font-bold">
            Authentication
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            Include your API key in every request via the{" "}
            <code className="rounded bg-[#0a0a0a] px-2 py-0.5 font-mono text-sm text-[#00E5A0]">
              x-api-key
            </code>{" "}
            header. Keys are prefixed with{" "}
            <code className="rounded bg-[#0a0a0a] px-2 py-0.5 font-mono text-sm text-[#00E5A0]">
              rtm_live_
            </code>{" "}
            for easy identification.
          </p>
          <CodeBlock label="Request Header">{`GET /api/v1/robots HTTP/1.1
Host: robotomated.com
x-api-key: rtm_live_aBcDeFgH...`}</CodeBlock>
          <p className="mt-4 text-sm text-gray-400">
            Requests without a valid key return{" "}
            <code className="font-mono text-[#00E5A0]">401 Unauthorized</code>.
            Never share your key publicly or commit it to version control.
          </p>
        </div>
      </section>

      {/* ---- Endpoints Reference ---- */}
      <section id="endpoints" className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ ENDPOINTS ]</p>
          <h2 className="font-display mt-3 mb-8 text-2xl font-bold">
            Endpoints Reference
          </h2>

          <div className="space-y-4">
            <Endpoint
              method="GET"
              path="/api/v1/robots"
              params="?category=warehouse&limit=20&offset=0&sort=robo_score"
              description="List robots with optional filtering, pagination, and sorting by any field."
            />
            <Endpoint
              method="GET"
              path="/api/v1/robots/[slug]"
              description="Retrieve full specifications, RoboScore breakdown, and pricing for a single robot."
            />
            <Endpoint
              method="GET"
              path="/api/v1/robots/search"
              params="?q=autonomous+forklift&category=warehouse&min_score=70"
              description="Full-text search across robot names, descriptions, and specifications."
            />
            <Endpoint
              method="GET"
              path="/api/v1/categories"
              description="List all robot categories with counts and descriptions."
            />
            <Endpoint
              method="GET"
              path="/api/v1/manufacturers"
              params="?limit=50&offset=0"
              description="List manufacturers with robot counts, headquarters, and metadata."
            />
            <Endpoint
              method="GET"
              path="/api/v1/market/stats"
              description="Aggregated market statistics: total robots, category distribution, price ranges, score averages."
            />
            <Endpoint
              method="POST"
              path="/api/v1/tco/calculate"
              description="Calculate total cost of ownership for a robot over a specified period. Includes purchase, maintenance, energy, and labor offset."
            />
            <Endpoint
              method="POST"
              path="/api/v1/lease/calculate"
              description="Generate lease-vs-buy analysis with monthly payment projections and break-even timelines."
            />
          </div>
        </div>
      </section>

      {/* ---- Response Format ---- */}
      <section className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ RESPONSE FORMAT ]</p>
          <h2 className="font-display mt-3 mb-6 text-2xl font-bold">
            Response Format
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            All list endpoints return a consistent envelope with pagination
            metadata.
          </p>
          <CodeBlock label="200 OK">{`{
  "data": [
    {
      "slug": "boston-dynamics-spot",
      "name": "Spot",
      "manufacturer": "Boston Dynamics",
      "category": "inspection",
      "robo_score": 87,
      "price_range": "$74,500 - $95,000"
    }
  ],
  "total": 642,
  "limit": 20,
  "offset": 0
}`}</CodeBlock>

          <div className="mt-6">
            <CodeBlock label="Error Response">{`{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Daily rate limit exceeded (100 requests/day)",
    "retry_after": 43200
  }
}`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* ---- Code Examples ---- */}
      <section className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ CODE EXAMPLES ]</p>
          <h2 className="font-display mt-3 mb-8 text-2xl font-bold">
            Code Examples
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-400">
                cURL
              </h3>
              <CodeBlock>{`curl -s -H "x-api-key: rtm_live_YOUR_KEY" \\
  "https://robotomated.com/api/v1/robots?category=warehouse&limit=5" \\
  | jq '.data[].name'`}</CodeBlock>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-400">
                JavaScript / TypeScript
              </h3>
              <CodeBlock>{`const API_KEY = process.env.ROBOTOMATED_API_KEY;

const response = await fetch(
  "https://robotomated.com/api/v1/robots?category=warehouse",
  { headers: { "x-api-key": API_KEY } }
);

const { data, total } = await response.json();
console.log(\`Found \${total} robots\`);

for (const robot of data) {
  console.log(\`\${robot.name} — RoboScore: \${robot.robo_score}\`);
}`}</CodeBlock>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-400">
                Python
              </h3>
              <CodeBlock>{`import requests
import os

API_KEY = os.environ["ROBOTOMATED_API_KEY"]

response = requests.get(
    "https://robotomated.com/api/v1/robots",
    headers={"x-api-key": API_KEY},
    params={"category": "warehouse", "limit": 10}
)

data = response.json()["data"]
for robot in data:
    print(f"{robot['name']} — RoboScore: {robot['robo_score']}")`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Rate Limits ---- */}
      <section className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ RATE LIMITS ]</p>
          <h2 className="font-display mt-3 mb-6 text-2xl font-bold">Rate Limits</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 pr-6 font-semibold">Tier</th>
                  <th className="pb-3 pr-6 font-semibold">Requests/Day</th>
                  <th className="pb-3 pr-6 font-semibold">Burst Rate</th>
                  <th className="pb-3 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-6 font-medium">Free</td>
                  <td className="py-3 pr-6 font-[family-name:var(--font-brand)] text-[#00C2FF]">100</td>
                  <td className="py-3 pr-6">10 req/min</td>
                  <td className="py-3 font-[family-name:var(--font-mono)]">$0</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-6 font-medium">Starter</td>
                  <td className="py-3 pr-6 font-[family-name:var(--font-brand)] text-[#00C2FF]">1,000</td>
                  <td className="py-3 pr-6">60 req/min</td>
                  <td className="py-3 font-[family-name:var(--font-mono)]">$99/mo</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-6 font-medium">Pro</td>
                  <td className="py-3 pr-6 font-[family-name:var(--font-brand)] text-[#7B2FFF]">
                    10,000
                  </td>
                  <td className="py-3 pr-6">300 req/min</td>
                  <td className="py-3 font-[family-name:var(--font-mono)]">$499/mo</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 font-medium">Enterprise</td>
                  <td className="py-3 pr-6 font-[family-name:var(--font-brand)] text-[#00E5A0]">
                    Unlimited
                  </td>
                  <td className="py-3 pr-6">Custom</td>
                  <td className="py-3">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            Rate-limited responses return{" "}
            <code className="font-mono text-[#00E5A0]">
              429 Too Many Requests
            </code>{" "}
            with a{" "}
            <code className="font-mono text-[#00E5A0]">Retry-After</code>{" "}
            header indicating seconds until the limit resets. Daily limits reset
            at midnight UTC.
          </p>
        </div>
      </section>

      {/* ---- Webhooks ---- */}
      <section className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ WEBHOOKS ]</p>
          <h2 className="font-display mt-3 mb-2 text-2xl font-bold">
            Webhook Events
          </h2>
          <p className="mb-6 text-sm text-gray-400">
            Pro and Enterprise tiers can subscribe to real-time webhook events.
            Events are delivered via HTTP POST with HMAC-SHA256 signature
            verification.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <code className="font-mono text-sm font-bold text-[#00C2FF]">
                  robot.added
                </code>
                <span className="rounded bg-[#7B2FFF]/15 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-wider text-[#7B2FFF]">
                  Pro+
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Fired when a new robot is added to the database. Includes full
                specifications and initial RoboScore.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <code className="font-mono text-sm font-bold text-[#00C2FF]">
                  robot.price_changed
                </code>
                <span className="rounded bg-[#7B2FFF]/15 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-wider text-[#7B2FFF]">
                  Pro+
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Fired when a robot&apos;s pricing data is updated. Includes
                previous and new price ranges.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <code className="font-mono text-sm font-bold text-[#00C2FF]">
                  market.report
                </code>
                <span className="rounded bg-[#7B2FFF]/15 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-wider text-[#7B2FFF]">
                  Pro+
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Weekly market intelligence digest with category trends, new
                entrants, and price movements.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <CodeBlock label="Webhook Payload Example">{`{
  "event": "robot.price_changed",
  "timestamp": "2026-04-03T14:30:00Z",
  "data": {
    "slug": "boston-dynamics-spot",
    "name": "Spot",
    "previous_price": "$74,500",
    "new_price": "$72,000",
    "change_pct": -3.36
  }
}`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ GET STARTED ]</p>
          <h2 className="font-display mt-3 mb-4 text-2xl font-bold">
            Ready to build with robot intelligence?
          </h2>
          <p className="mb-8 text-gray-400">
            Generate your free API key and start querying the world&apos;s
            largest robot database in under 60 seconds.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-lg bg-[#7B2FFF] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#6a24e0]"
            >
              Generate API Key
            </Link>
            <Link
              href="mailto:api@robotomated.com"
              className="rounded-lg border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
