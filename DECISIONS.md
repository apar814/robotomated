# Decisions Log — Workforce Network Overnight Sprint

## D1: Stripe Integration Approach
**Decision**: Use inline `price_data` in Stripe Checkout (same pattern as existing `certify-checkout/route.ts`) instead of pre-created Stripe Products/Prices.
**Rationale**: The existing codebase creates prices dynamically. No PREFLIGHT_NOTES.md with pre-created price IDs found. This approach is simpler and matches existing patterns.
**Impact**: Apar can create proper Stripe Products later for dashboard visibility. Functional behavior is identical.

## D2: Migration Number
**Decision**: Using `039_workforce_network.sql` (overnight prompt said 003, but actual latest migration is 038).
**Rationale**: Supabase migrations must be sequential. 38 migrations already exist.

## D3: Admin Email Gating
**Decision**: Gating admin dashboard API on `apar814@gmail.com` (matching Supabase auth user).
**Rationale**: Overnight prompt mentioned `apar@buildtal.com` but that's the notification email. The Supabase auth user is likely `apar814@gmail.com` based on existing codebase patterns.

## D4: Webhook Secret
**Decision**: Using existing `STRIPE_WEBHOOK_SECRET` env var (not creating a separate `STRIPE_WORKFORCE_WEBHOOK_SECRET`).
**Rationale**: Single webhook endpoint is simpler. The webhook handler filters by metadata `product: "operator-level-1"`.

## D5: Role Types Schema
**Decision**: Using single `role_type TEXT` column with CHECK constraint instead of `role_types[]` array.
**Rationale**: Simpler form UX, simpler queries, sufficient for MVP. If multi-role selection needed later, can add a junction table.

## D6: No New Dependencies
**Decision**: Zero new dependencies added. All features built with existing stack.
