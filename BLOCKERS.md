# Blockers Log — Workforce Network Overnight Sprint

## B1: Pre-existing build errors in worktree
**Status**: Non-blocking for workforce code
**Detail**: `next build` fails due to missing files that exist as uncommitted changes on main but weren't included in the worktree:
- `lib/robots/verdict` (imported by explore/[category]/[slug]/page.tsx)
- `components/home/market-pulse-ticker` (imported by homepage)

**Resolution**: Copy these files from main to the worktree, OR commit them on main first. These are NOT caused by workforce network changes.

## B2: Community/Discord invite link not yet created
**Status**: Non-blocking (placeholder in welcome email)
**Detail**: Welcome email references "community invite coming 3 days before start" — no Discord/Slack community exists yet.
**Resolution**: Set up a Discord server before Cohort 1 starts. Placeholder language is appropriate for now.

## B3: Stripe webhook endpoint for workforce
**Status**: Needs Apar action
**Detail**: The workforce webhook at `/api/stripe/workforce-webhook` uses `STRIPE_WEBHOOK_SECRET` (same as existing). For this to work:
1. In Stripe Dashboard, add `checkout.session.completed` event to the existing webhook endpoint
2. OR create a new webhook endpoint pointing to `/api/stripe/workforce-webhook` with its own secret
**Resolution**: Apar should verify webhook config in Stripe Dashboard in the morning.
