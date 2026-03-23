# Robotomated.com — Launch Checklist

## Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/publishable key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- [ ] `ANTHROPIC_API_KEY` — Claude API key for AI Advisor
- [ ] `STRIPE_SECRET_KEY` — Stripe secret key (live mode)
- [ ] `STRIPE_PRICE_ID` — Stripe price ID for Robotomated Pro ($49/mo)
- [ ] `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- [ ] `RESEND_API_KEY` — Resend API key for emails
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key
- [ ] `NEXT_PUBLIC_SENTRY_DSN` — Sentry DSN for error monitoring
- [ ] `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL
- [ ] `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token
- [ ] `AMAZON_ASSOCIATE_TAG` — Amazon Associates tag
- [ ] `CRON_SECRET` — Secret for cron job authentication
- [ ] `NEXT_PUBLIC_APP_URL` — Set to https://robotomated.com

## Infrastructure
- [ ] Vercel project created and linked to GitHub repo
- [ ] All env vars set in Vercel dashboard
- [ ] Custom domain `robotomated.com` configured in Vercel
- [ ] DNS (Cloudflare) pointing to Vercel
- [ ] SSL certificate active
- [ ] Supabase project on paid plan (for production RLS + auth)

## Database
- [ ] All migrations applied (001-006)
- [ ] Seed data loaded (20 robots, 5 categories, 8 manufacturers)
- [ ] RLS policies verified — test as anon, authenticated, and service_role
- [ ] Database backups enabled in Supabase

## Auth
- [ ] Supabase Auth magic link email templates customized
- [ ] Auth redirect URLs configured: `https://robotomated.com/auth/callback`
- [ ] Test magic link flow end-to-end

## Affiliate Links
- [ ] Amazon Associates account approved
- [ ] Affiliate links set on top 20 robots
- [ ] Test affiliate click tracking: visit /go/[slug]/[retailer]
- [ ] Verify clicks logged in affiliate_clicks table

## Email
- [ ] Resend domain verified (robotomated.com)
- [ ] Newsletter signup working end-to-end
- [ ] Test price drop alert email delivery
- [ ] Manufacturer portal confirmation email working

## AI Advisor
- [ ] Claude API key active with sufficient credits
- [ ] Test advisor conversation with real API
- [ ] Verify conversation saved to advisor_conversations table
- [ ] Verify rate limiting (5/month free, unlimited pro)

## Stripe
- [ ] Stripe product "Robotomated Pro" created ($49/month)
- [ ] Stripe webhook endpoint: `https://robotomated.com/api/webhooks/stripe`
- [ ] Webhook events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
- [ ] Test checkout flow end-to-end (use Stripe test mode first)
- [ ] Stripe Customer Portal configured
- [ ] 7-day free trial verified

## SEO
- [ ] Sitemap accessible at https://robotomated.com/sitemap.xml
- [ ] robots.txt correct at https://robotomated.com/robots.txt
- [ ] Google Search Console: add property, verify ownership
- [ ] Submit sitemap to Google Search Console
- [ ] JSON-LD structured data validates (use Google Rich Results Test)
- [ ] OpenGraph tags render correctly (use Facebook Sharing Debugger)
- [ ] All pages have unique title and description
- [ ] Canonical URLs set on all programmatic pages

## Analytics
- [ ] PostHog project created
- [ ] Cookie consent banner working
- [ ] Verify events firing: robot_viewed, affiliate_click, search_performed
- [ ] Sentry project created
- [ ] Test error reporting in Sentry

## Performance
- [ ] Lighthouse score 90+ on homepage
- [ ] Lighthouse score 90+ on /explore
- [ ] Lighthouse score 90+ on robot detail page
- [ ] No layout shift (CLS < 0.1)
- [ ] Images optimized with next/image
- [ ] Redis caching working for category/manufacturer lists

## Content
- [ ] 20+ robots with complete specs and scores
- [ ] 5 educational articles published
- [ ] RoboScore methodology page accurate
- [ ] All internal links working (no 404s)

## Security
- [ ] CSP headers configured
- [ ] /admin routes protected (admin role only)
- [ ] Review content sanitized before storage
- [ ] Rate limiting on review submissions (5/day)
- [ ] Rate limiting on advisor (5/month free)
- [ ] No secrets in client-side code
- [ ] .env.local in .gitignore

## Google Search Console Setup
1. Go to https://search.google.com/search-console
2. Add property: `https://robotomated.com`
3. Verify via DNS TXT record (Cloudflare)
4. Submit sitemap: `https://robotomated.com/sitemap.xml`
5. Request indexing for homepage
6. Monitor Coverage report for crawl errors

## Post-Launch (Week 1)
- [ ] Monitor error rates in Sentry
- [ ] Check PostHog for traffic patterns
- [ ] Verify Google is indexing pages (site:robotomated.com)
- [ ] Review affiliate click data in admin dashboard
- [ ] Respond to any manufacturer portal submissions
- [ ] Publish 2 more educational articles
- [ ] Add 10+ more robots to database
