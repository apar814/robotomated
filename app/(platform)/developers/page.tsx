import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "API Documentation — Robotomated Developer Portal",
  description:
    "Access robot data via the Robotomated API. Browse endpoints, authentication, rate limits, and code examples.",
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
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4">
      {label && (
        <span className="mb-2 block font-mono text-xs text-cyan-400">
          {label}
        </span>
      )}
      <pre className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
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
  return (
    <div className="glass rounded-lg p-5">
      <div className="flex items-center gap-3">
        <span className="rounded bg-[#00E5A0]/15 px-2 py-0.5 font-mono text-xs font-bold text-[#00E5A0]">
          {method}
        </span>
        <code className="font-mono text-sm text-[#00C2FF]">{path}</code>
      </div>
      {params && (
        <code className="mt-2 block font-mono text-xs text-muted">
          {params}
        </code>
      )}
      <p className="mt-2 text-sm text-muted">{description}</p>
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
      <section className="border-b border-border px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Developers", href: "/developers" },
            ]}
          />
          <h1 className="font-display mt-8 text-4xl font-bold sm:text-5xl">
            Robotomated API
          </h1>
          <p className="mt-4 text-lg text-muted">
            Access the world&apos;s most comprehensive robot database
          </p>
        </div>
      </section>

      {/* ---- Getting Started ---- */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display mb-6 text-2xl font-bold">
            Getting Started
          </h2>

          <div className="space-y-6">
            {/* API Key */}
            <div className="glass rounded-lg p-5">
              <h3 className="mb-2 text-sm font-semibold">
                1. Request an API Key
              </h3>
              <p className="text-sm text-muted">
                Send a request to{" "}
                <Link
                  href="mailto:api@robotomated.com"
                  className="text-[#00C2FF] underline underline-offset-2"
                >
                  api@robotomated.com
                </Link>{" "}
                with your name, organization, and intended use case. We
                typically respond within one business day.
              </p>
            </div>

            {/* Base URL */}
            <div className="glass rounded-lg p-5">
              <h3 className="mb-2 text-sm font-semibold">2. Base URL</h3>
              <code className="rounded bg-black/40 px-3 py-1 font-mono text-sm text-[#00C2FF]">
                https://robotomated.com/api/v1
              </code>
            </div>

            {/* Authentication */}
            <div className="glass rounded-lg p-5">
              <h3 className="mb-2 text-sm font-semibold">
                3. Authentication
              </h3>
              <p className="mb-3 text-sm text-muted">
                Include your API key in every request via the{" "}
                <code className="font-mono text-[#00E5A0]">x-api-key</code>{" "}
                header.
              </p>
              <CodeBlock>{`x-api-key: YOUR_API_KEY`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Endpoints Reference ---- */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display mb-6 text-2xl font-bold">
            Endpoints Reference
          </h2>

          <div className="space-y-4">
            <Endpoint
              method="GET"
              path="/api/v1/robots"
              params="?category=warehouse&limit=10&offset=0&sort=robo_score"
              description="List robots with optional filtering, pagination, and sorting."
            />
            <Endpoint
              method="GET"
              path="/api/v1/robots/:slug"
              description="Retrieve full details for a single robot by its URL slug."
            />
            <Endpoint
              method="GET"
              path="/api/v1/categories"
              description="List all robot categories."
            />
            <Endpoint
              method="GET"
              path="/api/v1/manufacturers"
              params="?limit=50&offset=0"
              description="List manufacturers with pagination."
            />
          </div>
        </div>
      </section>

      {/* ---- Response Format ---- */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display mb-6 text-2xl font-bold">
            Response Format
          </h2>
          <p className="mb-4 text-sm text-muted">
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
      "robo_score": 87
    }
  ],
  "total": 642,
  "limit": 20,
  "offset": 0
}`}</CodeBlock>
        </div>
      </section>

      {/* ---- Code Examples ---- */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display mb-6 text-2xl font-bold">
            Code Examples
          </h2>

          <div className="space-y-6">
            {/* curl */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted">cURL</h3>
              <CodeBlock>{`curl -H "x-api-key: YOUR_KEY" \\
  https://robotomated.com/api/v1/robots?category=warehouse`}</CodeBlock>
            </div>

            {/* JavaScript */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted">
                JavaScript
              </h3>
              <CodeBlock>{`const res = await fetch('https://robotomated.com/api/v1/robots', {
  headers: { 'x-api-key': 'YOUR_KEY' }
});
const { data } = await res.json();`}</CodeBlock>
            </div>

            {/* Python */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted">Python</h3>
              <CodeBlock>{`import requests

r = requests.get(
    'https://robotomated.com/api/v1/robots',
    headers={'x-api-key': 'YOUR_KEY'}
)
data = r.json()['data']`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Rate Limits ---- */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display mb-6 text-2xl font-bold">Rate Limits</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-lg p-5 text-center">
              <p className="font-display text-3xl font-bold text-[#00C2FF]">
                1,000
              </p>
              <p className="mt-1 text-sm text-muted">requests / day</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Free Tier
              </p>
            </div>
            <div className="glass rounded-lg p-5 text-center">
              <p className="font-display text-3xl font-bold text-[#7B2FFF]">
                10,000
              </p>
              <p className="mt-1 text-sm text-muted">requests / day</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Partner Tier
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted">
            Rate-limited responses return{" "}
            <code className="font-mono text-[#00E5A0]">429 Too Many Requests</code>{" "}
            with a <code className="font-mono text-[#00E5A0]">Retry-After</code>{" "}
            header indicating seconds until the limit resets.
          </p>
        </div>
      </section>

      {/* ---- Partner Program CTA ---- */}
      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display mb-4 text-2xl font-bold">
            Need More?
          </h2>
          <p className="mb-6 text-muted">
            Need higher limits or custom integrations? Contact us about our
            partner program.
          </p>
          <Link
            href="mailto:api@robotomated.com"
            className="inline-block rounded-lg bg-[#7B2FFF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6a24e0]"
          >
            Contact the API Team
          </Link>
        </div>
      </section>
    </div>
  );
}
