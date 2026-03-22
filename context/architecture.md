# Robotomated — Architecture

## Stack (Locked — from Build Spec)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router, TS strict) | SSR for SEO (the #1 priority). React ecosystem. |
| Styling | Tailwind CSS v4 (no component library Phase 1) | Rapid, clean. Add Radix primitives as needed. |
| Database | Supabase (PostgreSQL + Auth + RLS + Storage) | All-in-one. Free tier covers launch. |
| State | Zustand (client) + TanStack Query (server) | Lightweight, type-safe, well-separated concerns. |
| AI | Claude Sonnet (Anthropic SDK, streaming) | Advisor reasoning. Tool use in Phase 2+. |
| Search | Supabase full-text → Elasticsearch at scale | Don't over-engineer at 200 robots. |
| Deploy | Vercel (free Hobby tier) | Next.js native. Edge SSR. Cron jobs. $0/mo. |
| Email | Resend (3K emails/mo free) | Transactional + newsletter. |
| Analytics | PostHog (1M events/mo free) | Product analytics + custom events. |
| Monitoring | Sentry (5K errors/mo free) | Error tracking from day one. |
| Caching | Upstash Redis (10K commands/day free) | Category lists, top robots, manufacturer lists. |
| DNS | Cloudflare (free) | DDoS protection + fast DNS. |
| Payments | Stripe (Phase 3) | Pro subscriptions $49/mo. 2.9% + 30¢. |
| Content | MDX via next-mdx-remote | Articles + guides stored as files. |
| Charts | Recharts | Price history, score breakdowns. |
| Testing | Vitest (unit) + Playwright (E2E) | Fast + real browser testing. |

## Monthly Cost (~$150)
Claude API: ~$150 (advisor + summaries at MVP scale)
Everything else: $0 on free tiers
Upgrade to Vercel Pro ($20) + Supabase Pro ($25) at ~50K MAU
$10K budget = 60+ months of runway at this burn.

## Project Structure (Build Spec — Prompt 1)
```
robotomated/
├── CLAUDE.md
├── app/
│   ├── (marketing)/        # Homepage, about, landing pages
│   │   └── page.tsx        # Homepage (hero, categories, newsletter)
│   ├── (platform)/         # Core product pages
│   │   ├── explore/        # Browse + search + robot detail
│   │   ├── reviews/        # All reviews + review detail
│   │   ├── advisor/        # AI advisor chat
│   │   ├── learn/          # Education hub (MDX articles)
│   │   ├── compare/        # Side-by-side comparison
│   │   ├── best/           # "Best Of" SEO guide pages
│   │   └── market/         # Marketplace (Phase 2)
│   ├── admin/              # Admin dashboard + review management
│   ├── api/                # All API routes
│   │   ├── advisor/        # Claude streaming endpoint
│   │   ├── robots/         # Robot CRUD + search
│   │   ├── reviews/        # Review submission
│   │   ├── newsletter/     # Email signup
│   │   └── webhooks/       # Stripe webhooks (Phase 3)
│   ├── login/              # Magic link auth
│   ├── account/            # User profile, saved robots, billing
│   ├── go/                 # Affiliate redirect tracking
│   ├── pro/                # Pro subscription page
│   └── portal/             # Manufacturer submission portal
├── components/
│   ├── ui/                 # Reusable primitives
│   ├── layout/             # Header, footer, sidebar
│   ├── robots/             # Robot cards, score badges, specs
│   └── advisor/            # AI chat components
├── lib/
│   ├── supabase/           # DB client + generated types
│   ├── ai/                 # Claude API helpers
│   └── utils/              # Shared utilities
├── content/learn/          # MDX articles (5 real articles at launch)
├── types/                  # TypeScript interfaces
├── supabase/
│   ├── migrations/         # SQL migrations
│   └── seed.sql            # Seed data
├── scripts/
│   └── update-prices.ts    # Vercel cron job for price monitoring
├── context/                # Product context (for Claude Code sessions)
└── docs/
    ├── robotomated_build_spec.html  # 15-prompt build guide
    └── RoboNexus_PRD_v1.docx        # Full PRD
```

Single Next.js app. No monorepo overhead for Phase 1.
Add Turborepo when marketplace (Phase 2) justifies it.

## Build Spec
docs/robotomated_build_spec.html contains 15 copy-paste Claude Code
prompts covering the entire build from scaffold to launch. Open in
browser, use Copy buttons, run prompts in order, one per session.

Phase 1 (Prompts 1-5, Days 1-30): scaffold, schema, homepage, browse, SEO
Phase 2 (Prompts 6-9, Days 31-60): education, reviews, AI advisor, auth
Phase 3 (Prompts 10-15, Days 61-90): affiliate, data pipeline, Stripe, analytics, launch

## SEO Architecture (Critical — This Is How We Win)
Every robot gets a programmatic page: /robots/[slug]
  → Product schema markup, specs table, RoboScore, reviews, price history
Every category gets a "Best Of" page: /best/[category]
  → "Best Warehouse Robots 2026" — refreshed quarterly
Every review gets its own page: /reviews/[slug]
  → Review schema markup, expert byline, structured scoring
Sitemap auto-generated. Structured data on every page.
Target: rank page 1 for "[category] robots" within 6 months.

## AI Advisor Architecture
Claude Sonnet as reasoning layer.
Structured product database as retrieval context (not RAG — direct
JSON injection of relevant robots based on parsed user intent).
Multi-turn conversational memory.
Always returns 3 specific recommendations with model names + reasons.
Preference model stored for Pro users.

## Database Schema Summary
8 core tables: robots, manufacturers, robot_categories, reviews,
marketplace_listings, users, advisor_conversations, price_history
Full schema: context/product.md (Database Schema section)
Seed: 200 robots across 10 categories with full specs

## Performance Targets
Page load: < 2s on 3G
Search results: < 200ms
AI advisor first token: < 500ms (streaming)
Robot detail page: SSR, fully rendered at edge
