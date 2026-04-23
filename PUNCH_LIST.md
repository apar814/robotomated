# Robotomated — Launch Punch List

Based on LAUNCH_CHECKLIST.md, GAP_REPORT.md, actual repo state, and zero open GH issues/PRs.

## Critical Blockers (must fix before any real traffic or revenue)

1. **/admin has no auth guard**
   Any logged-in user hits /admin and gets full robot CRUD.
   Effort: S | claude-code (add admin role check to middleware.ts)

2. **Stripe PRICE_ID likely misconfigured**
   .env.local may have a product ID (prod_...) not a price ID (price_...).
   Checkout will fail silently or throw at runtime.
   Effort: S | inline (verify in Stripe dashboard, update Vercel env var)

3. **Sentry not wired up**
   @sentry/nextjs installed, lib/monitoring/sentry.ts exists, but sentry.client.ts and sentry.server.ts do not exist. No DSN in env. Errors are silently lost in production.
   Effort: M | claude-code

4. **Redis caching inactive**
   Upstash client in lib/cache/redis.ts but UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not set. AI Advisor and catalog APIs are uncached.
   Effort: S | inline

5. **PostHog collecting no production data**
   Provider wired in layout.tsx but NEXT_PUBLIC_POSTHOG_KEY not set in .env.local or Vercel production. Zero analytics.
   Effort: S | inline

6. **Zero editorial content**
   GAP report requires 10 expert reviews, 5 Best Of guides, 5 learn articles per industry. All missing. No SEO surface area, no affiliate conversion paths.
   Effort: L | inline (content) + claude-code (MDX templates)

## High Priority (first 30 days)

7. **Amazon Associates not live** — Placeholder tag, account not approved. Effort: S | inline
8. **Rate limiting missing on AI Advisor** — /api/advisor open to abuse. Effort: S | claude-code
9. **Schema.org structured data incomplete** — Robot detail pages need Product/ItemPage schema. Effort: M | claude-code
10. **Open Graph images not systematically generated** — Each robot and category page needs its own. Effort: M | claude-code
11. **Robot catalog only 42 robots vs 200-robot target** — Category pages look empty. Effort: L | claude-code
12. **CRON_SECRET enforcement** — Referenced but not audited across 3 cron routes. Effort: S | claude-code

## Nice to Have (post-launch)

13. **Best Of guides content** — Route exists, content thin. Effort: M | claude-code
14. **Resend domain verification** — DNS record in Cloudflare. Effort: S | inline
15. **Social accounts (@robotomated)** — Not confirmed claimed. Effort: S | inline
16. **SECURITY.md** — None exists. Effort: S | claude-code
17. **Lighthouse mobile score audit** — Target >90. Effort: M | inline + claude-code

## Repo Hygiene Gaps

- **README.md does not exist** — public repo, blank GitHub landing. Effort: S | claude-code
- **LICENSE does not exist** — legally all-rights-reserved. Effort: S | inline
- **SECURITY.md does not exist** — no disclosure path. Effort: S | claude-code
- **No GitHub Actions workflows** — no CI on PR/push. Effort: S | claude-code
- **Dependabot not enabled** — no .github/dependabot.yml. Effort: S | inline
- **AMAZON_ASSOCIATE_TAG visible in .env.example** — low risk, affiliate tag not secret

## Top 3 Immediate Fires

1. /admin exposure (security)
2. Sentry silence (operability)
3. Zero editorial content (revenue/SEO)
