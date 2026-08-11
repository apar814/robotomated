# Current Phase — 2026-08-10 (cert launch prep)

## Focus
Workforce Network / Operator Level 1 certification launch. Code is shipped;
launch is gated on database migrations and final verification.

## What's Shipped (delta since April snapshot)
- Workforce Network Phase 1 code complete: employer landing page + intent
  form, operator-level-1 sales page, Stripe workforce checkout + webhook,
  admin pipeline dashboard, drip cron, outreach script (see CLAUDE.md)
- Stripe live-key guard: app refuses to start with sk_live outside
  production (c7a793c); .env.local swapped to sk_test 2026-08-10
- Claims policy (docs/claims-policy.md) + inventory + RETIRED block in
  lib/data/market-claims.ts
- Claims cleanup Tier-1 (certify funnel) and Tier-2 (case-studies,
  industry-types, problems.ts) executed and committed
- 2026-08-10: purged retired-claim survivors from cert launch surfaces
  ($45-75K on employer page / day-7 email / homepage banner; six numeric
  careerImpact claims in trend-modules.ts) — df71dfa
- Admin role-based auth code: middleware checks users.role='admin' for
  /admin and /api/admin (fails closed)

## Launch Blockers (in order)
1. **Migrations 039+039+040 not applied to live DB.** cohorts,
   employer_intent, certification_enrollments tables and users.role column
   are all missing. Consequences right now: sales page shows no cohort,
   checkout returns "no cohorts enrolling", employer form 500s, /admin
   locked out for everyone (fails closed). Ready-to-paste bundle:
   docs/combined-migrations-039-042.sql (039 role, 040 news, 041 workforce
   [renamed from dup 039], 042 handle_new_user trigger + backfill, and the
   admin-role grant for apar814@gmail.com). Cohort seed = CURRENT_DATE+28d
   at time of run.
2. End-to-end Stripe test-mode checkout (needs #1 first): enroll flow,
   webhook enrollment insert, seat count increment, Day-0 email.
3. STRIPE_WORKFORCE_WEBHOOK_SECRET configured in Vercel + Stripe webhook
   endpoint registered for /api/stripe/workforce-webhook.

## Remaining Claims Work (not launch-gating per inventory)
- Tier-3: rco-questions-trends.ts / rco-questions-commander.ts explanations
  asserting unsourced real-world stats — reframe as scenario assumptions
- Tier-4: page-by-page pass (eldercare, cleaning, lease, insure, parts,
  humanoid-comparison, robowork, tools)

## Notes / Decisions
- Migration workflow is manual: paste combined SQL into Supabase dashboard
  (docs/combined-migrations-*.sql pattern), not supabase CLI push
- Migration numbering collision: 039_add_user_role.sql and
  039_workforce_network.sql both exist; harmless under manual workflow but
  rename one to 041 if CLI-based migrations ever adopted
- Employer page qualitative "demand" badges (High/Very High/Growing) are
  invented ratings — outside claims-policy scope (no numbers) but worth an
  honesty pass eventually
- DB counts verified 2026-08-10: 986 robots, 321 manufacturers ("975+" and
  "200+" copy is accurate and database-backed)
