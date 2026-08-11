# Cert Payment Launch Checklist

## Permanent state (do not change)
- .env.local uses sk_test_ — local dev never touches live money
- Vercel production uses sk_live_
- lib/stripe/index.ts guard throws on sk_live outside production

## Before first real transaction
- [ ] Credential identity: real name/email at issuance, not
      "Exam Candidate" / pending@robotomated.com
- [ ] Verify public /verify page renders real identity
- [ ] Question pool: 100+ questions, randomized per attempt
      (currently 20 seeded = every candidate sees the whole pool)
- [ ] Success-page pending state (poll for entitlement, no bare 403)
- [ ] Full test-mode rehearsal passed end to end via Stripe CLI

## Go-live steps (only after all boxes above)
- [ ] Stripe dashboard → switch to LIVE mode
- [ ] Create webhook destination: https://robotomated.com/api/stripe/certify-webhook
      Event: checkout.session.completed
      API version: 2026-02-25.clover (must match lib/stripe/index.ts)
- [ ] Copy that LIVE signing secret → Vercel env as
      STRIPE_WEBHOOK_SECRET_CERT (Production scope)
- [ ] Redeploy so the env var takes effect
- [ ] One real $149 purchase with your own card, then refund it
- [ ] Confirm rco_payments row, entitlement, exam access, certificate,
      /verify page

## Fast follow after first transaction
- [x] handle_new_user trigger + backfill — migration 042 written
      (in docs/combined-migrations-039-042.sql bundle); pending DB apply

## Re-enabling a certification (Specialist / Master / Fleet Commander / CRO)

All three required before a cert goes purchasable — no exceptions:

1. [ ] Question pool seeded and verified — pool size >= 2x the
       configured question_count (claims-policy audited, answer keys
       verified, stratified selection quotas satisfiable)
2. [ ] `active: true` in rco_certifications (live DB)
3. [ ] `comingSoon` removed from the cert's entry in
       lib/certifications.ts

Config and DB must be changed together in the same deploy window:
comingSoon (config) drives the UI and the first checkout guard;
active (DB) drives the second checkout guard plus enroll/start. If
they disagree, either the UI shows a buy button the API refuses, or
the UI says "coming soon" for a cert the API would sell.

CRO additionally has NO rco_certifications row at all — one must be
created (with question_count, passing_score, renewal_years) before it
can ever be enabled. Until then its checkout 404s at the cert lookup.
