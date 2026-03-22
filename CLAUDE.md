# CLAUDE.md — Robotomated

## What This Is
The intelligence layer for the robotics era. Where anyone — homeowner,
warehouse ops manager, construction super, hospital admin — comes to
understand robots, find the right one, learn how to use it, and buy it.
Consumer UX. Enterprise depth. Content + Commerce + AI.
Domain: robotomated.com | Redirects: robotomate.com, robotomato.com

## Stack
Framework: Next.js 15 (App Router, TypeScript strict)
Styling: Tailwind CSS v4 (no component library Phase 1)
State: Zustand (client) + TanStack Query (server)
Database: Supabase (PostgreSQL + Auth + RLS + Storage)
AI: Claude Sonnet (Anthropic SDK, streaming)
Deploy: Vercel (free Hobby tier)
Email: Resend | Analytics: PostHog | Monitoring: Sentry
Caching: Upstash Redis | DNS: Cloudflare | Payments: Stripe (Phase 3)
Content: MDX via next-mdx-remote | Charts: Recharts
Testing: Vitest (unit) + Playwright (E2E)

## Build Spec
docs/robotomated_build_spec.html — 15 copy-paste Claude Code prompts.
Open in browser. Run prompts in order, one per session. Commit after each.
Phase 1 (P1-5): scaffold, schema, homepage, browse, SEO
Phase 2 (P6-9): education, reviews, AI advisor, auth
Phase 3 (P10-15): affiliate, data pipeline, Stripe, analytics, launch

## Business Model
Phase 1: Content + affiliate (months 1-6, $0 → $2K MRR)
Phase 2: Pro subscription + marketplace soft launch ($15-45K MRR)
Phase 3: Enterprise SaaS + full marketplace ($150K+ MRR)
Revenue: affiliate 5-12%, marketplace GMV 8-15%, Pro $49/mo,
  Enterprise $299-2499/mo, market intelligence $2.5K-50K/report

## Brand
Name: Robotomated ("Your warehouse, robotomated.")
Palette: navy #0A0F1E, blue #00C2FF, violet #7B2FFF, green #00E5A0
Font: Space Grotesk (body) + JetBrains Mono (code/specs)
Tone: authoritative, accessible, never condescending. Bridges
"techy and intimidating" with "shallow and marketing-driven."

## Scoring: RoboScore (0-100, 8 Dimensions)
Performance 25% | Reliability 20% | Ease of Use 15% |
Intelligence 15% | Value 10% | Ecosystem 8% | Safety 5% | Design 2%
Methodology is PUBLIC. Scores are EXPLAINABLE. No black boxes.
Editorial independence is THE moat. Never take money to influence scores.

## Architecture Rules
- Content pages are SSR (SEO critical — this is how we win Google)
- AI advisor assists, never gatekeeps. Users can always browse without AI.
- Every review score is explainable with transparent methodology.
- Complexity on demand: simple default, deep data on click.
- Mobile-native: 60%+ of discovery is mobile.

## What NOT to Do
- NEVER let manufacturers pay to influence review scores.
- NEVER recommend robots not verified in the database.
- NEVER make up specifications.
- NEVER gate basic browsing behind signup/paywall.
- NEVER sacrifice editorial independence for revenue. Ever.

## Verify Before Done
1. `turbo build` — compiles clean
2. `turbo test` — all passing
3. SSR pages render with proper structured data (Schema.org)
4. Mobile responsive — every page works on phone
5. Page load < 2s on 3G connection

## Session Protocol
Before ending: update context/current-phase.md, append decisions.

## Budget Reality
$10K total. ~$200-300/mo burn (Claude API + domain).
30+ months of runway if disciplined. No premature monetization.
Content compounds. Code can be rewritten. A 12-month SEO lead cannot.
