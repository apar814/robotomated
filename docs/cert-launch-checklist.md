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
- [ ] handle_new_user trigger + backfill (users table has 0 rows,
      causing duplicate Stripe customers per purchase)
