# Current Phase — 2026-04-23

## What's Shipped
- Next.js 16.2.1 app on Vercel, React 19, Tailwind v4
- Supabase schema: 8 migrations live
- Robot catalog: ~42+ robots seeded (wave-1 + wave-2 agricultural/drones/delivery/software)
- Browse/search: /explore with category pages and per-category manufacturer filter
- Robot detail pages: DJI cinematic redesign, RoboScore badge
- Industry landing pages /industries + TCO calculator
- AI Advisor: streaming Claude chat, industry chips, localStorage persistence, robot cards from DB, start-over
- Comparison tool: /compare
- Newsletter: signup, unsubscribe, weekly digest cron (Mondays via Resend)
- Affiliate redirect: /api/out/[slug] with click tracking
- Stripe Pro: checkout, webhook, customer portal, 7-day trial, /pro page
- Auth: magic link, /auth/callback, middleware protects /account
- Account page: billing management + saved robots
- Admin dashboard: robot CRUD, reviews, affiliate view, manufacturers
- Cron jobs: update-prices (daily), refresh-robot-data (weekly), weekly-digest (Monday)
- Firecrawl pipelines: spec, review, news, image scrapers
- SEO: sitemap (with resilience fix), robots.txt, CSP + security headers, structured data groundwork
- Google Search Console verification files committed
- Cookie consent banner + PostHog provider wired in layout
- Redis client: lib/cache/redis.ts (Upstash SDK present)
- /learn article directory structure exists (construction, warehouse, home, getting-started)

## In Progress
- Learn content: directory structure exists but zero .mdx article files written
- Admin auth: middleware only guards /account — /admin has NO role check (any logged-in user can access)
- Sentry: @sentry/nextjs installed, lib/monitoring/sentry.ts exists, but no sentry.client.ts / sentry.server.ts and no DSN configured
- Redis: Upstash client present but UPSTASH_REDIS_REST_URL / TOKEN not set in env — caching not active
- PostHog: provider in layout but NEXT_PUBLIC_POSTHOG_KEY not set in production — no data collected
- Amazon Associates: placeholder tag in .env.example, account not approved / live
- Stripe PRICE_ID: may be set to a product ID (prod_...) instead of a price ID (price_...)

## Not Started
- README.md (does not exist)
- LICENSE (does not exist)
- Expert / editorial reviews with RoboScore grading (zero published)
- Sentry project creation + DSN wiring in config files
- Upstash Redis env vars set in Vercel production
- PostHog project created + key in production env
- /admin route authentication guard (role-based)
- Actual learn article content (.mdx files)

## Known Issues
- /admin publicly accessible to any authenticated user — no role check in middleware
- /learn has zero content files despite directory scaffolding
- Sentry not capturing errors — no config files, no DSN
- Redis caching inactive — env vars missing in all environments
- PostHog not collecting production analytics — key not set
- Stripe may be misconfigured with product ID instead of price ID for Pro plan
- No README or LICENSE on what may be a public repo
