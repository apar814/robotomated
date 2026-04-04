# Robotomated Production Deployment Checklist

## Pre-Deploy
- [x] Build passes with 0 TypeScript errors
- [x] All env vars documented in .env.example
- [ ] All migrations run (018-023 pending)
- [ ] Seed data inserted (certifications, jobs, RSPs)
- [x] Git clean -- all changes committed

## Supabase Migrations
Run in SQL Editor at https://supabase.com/dashboard/project/zpbrvugcbtaeyiufkoas/sql
1. [ ] Copy/paste `docs/combined-migrations-018-023.sql` into SQL Editor and run
2. [ ] Copy/paste `scripts/seed-production.sql` into SQL Editor and run
3. [ ] Verify tables exist: run `scripts/check-tables.ts`

## Vercel Setup
- [ ] All environment variables added (see list below)
- [ ] Custom domain configured (robotomated.com)
- [ ] WWW redirect configured
- [ ] HTTPS enabled (automatic)
- [ ] Cron jobs configured in vercel.json (7 cron jobs)

## Post-Deploy Verification
- [ ] Homepage loads at robotomated.com
- [ ] /explore shows robots with RoboScores
- [ ] /advisor -- Robotimus chat works (requires ANTHROPIC_API_KEY)
- [ ] /robowork -- job postings visible
- [ ] /robowork/providers -- RSP profiles visible
- [ ] /lease -- leasing page loads
- [ ] /certify -- certification program loads (4 levels)
- [ ] /service -- service marketplace loads
- [ ] /trade-in -- valuation tool loads
- [ ] /cpo -- pre-owned marketplace loads
- [ ] /about -- mission page loads
- [ ] /learn -- articles page loads (200+ articles)
- [ ] /manufacturers -- directory loads
- [ ] /developers -- API docs page loads
- [ ] Dark/light mode toggle works
- [ ] Navigation mega-menu dropdowns work
- [ ] Search (Cmd+K) works
- [ ] Newsletter signup works
- [ ] Mobile responsive on all key pages

## Google Search Console
- [ ] Verify domain ownership
- [ ] Submit sitemap: robotomated.com/sitemap.xml
- [ ] Request indexing for key pages:
  - robotomated.com
  - robotomated.com/explore
  - robotomated.com/robowork
  - robotomated.com/lease
  - robotomated.com/certify
  - robotomated.com/about
  - robotomated.com/learn
  - robotomated.com/service
  - robotomated.com/trade-in
  - robotomated.com/manufacturers

## Monitoring
- [ ] Verify PostHog is tracking page views
- [ ] Test AI Advisor end-to-end
- [ ] Test newsletter signup end-to-end
- [ ] Test RoboWork job posting flow
- [ ] Check Sentry for any errors post-deploy
