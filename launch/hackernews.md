# Hacker News — Show HN Post

## Title
Show HN: Robotomated – AI-powered robot discovery and comparison platform

## Body

Robotomated (https://robotomated.com) is a platform for researching and comparing robots across every category — consumer, industrial, healthcare, warehouse, delivery.

**The problem:** The robotics market is growing fast but fragmented. There's no single source of truth for comparing a $300 vacuum against a $50K cobot against a $2.5M surgical system. Review sites are either too narrow (just vacuums) or too shallow (just specs).

**What we built:**

- **RoboScore** — A transparent 0-100 scoring system across 8 weighted dimensions (performance 25%, reliability 20%, ease of use 15%, intelligence 15%, value 10%, ecosystem 8%, safety 5%, design 2%). Methodology is fully public at /methodology. Manufacturers cannot pay to influence scores.

- **AI Advisor** — Powered by Claude Sonnet (Anthropic SDK, streaming). The full robot database is injected into the system prompt context, so recommendations are always grounded in real data. No hallucinated products. Renders recommendations as interactive cards, not just text.

- **Programmatic SEO** — 112 statically generated pages at build time. Every robot, manufacturer, category, and comparison pair gets a unique page with structured data (JSON-LD Product, Review, BreadcrumbList, FAQ schemas).

**Stack:**

- Next.js 16 (App Router, TypeScript strict, Turbopack)
- Supabase (PostgreSQL, Auth with magic links, RLS, Storage)
- Tailwind CSS v4 (no component library — everything custom)
- Claude claude-sonnet-4-20250514 via @anthropic-ai/sdk (streaming)
- Stripe for subscriptions ($49/mo Pro tier)
- Recharts for price history visualization
- Shiki for code syntax highlighting in guides
- MDX via next-mdx-remote for educational content
- Upstash Redis for caching
- PostHog for analytics (with cookie consent)
- Vercel for deployment

**Data model:** 8 tables with full RLS. Robots have a specs JSONB column for arbitrary key-value specs, a score_breakdown JSONB for the 8-dimension scores, and relationships to manufacturers, categories, reviews, and price history.

**Revenue model:** Affiliate commissions (tracked via /go/[slug]/[retailer] redirects), Pro subscriptions via Stripe, eventually enterprise marketplace.

Would love technical feedback. The AI advisor is the feature I'm most interested in improving — currently it works well for straightforward queries but struggles with nuanced multi-criteria comparisons.

Try the advisor: https://robotomated.com/advisor
