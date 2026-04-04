# RSP Onboarding & Founding Program — Phase 1 Spec

**Date**: 2026-04-04
**Scope**: 7-step onboarding wizard + Founding RSP program
**Approach**: Full rewrite of registration flow (Approach A)

---

## 1. Goal

Replace the existing 5-step RSP registration form with a premium 7-step onboarding wizard that feels like joining an elite network. Add a Founding RSP program (100 spots) to create urgency and acquire initial supply.

**Success criteria:**
- RSP can go from landing page to live profile in under 15 minutes
- Every step adds immediate perceived value
- Founding RSP program creates urgency with exclusive perks
- All data flows through existing `POST /api/robowork/providers` contract
- Mobile-first — every step works on phone

---

## 2. Data Model

### 2.1 Migration: extend `robot_service_providers`

New columns on existing table:

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `business_type` | text | null | `solo`, `small_fleet`, `mid_fleet`, `large_fleet`, `rental_company`, `integrator` |
| `years_in_robotics` | integer | null | 0-20+ |
| `is_founding_rsp` | boolean | false | Set by admin on approval |
| `founding_rsp_number` | integer | null | Unique, 1-100 |
| `founding_perks_claimed` | jsonb | `{}` | Tracks which perks redeemed |
| `onboarding_completed_at` | timestamptz | null | Set when wizard completes |
| `verification_tier` | integer | 0 | 0=none, 1=identity, 2=insured, 3=background, 4=RCO |
| `specialization_levels` | jsonb | `{}` | Keys are from both industry + task lists, e.g. `{"warehouse": "expert", "pick_and_pack": "beginner"}` |
| `stripe_connect_id` | text | null | Future Stripe Connect account ID |
| `stripe_onboarding_complete` | boolean | false | Future: true when Stripe setup done |
| `phone` | text | null | Verified phone number |
| `phone_verified` | boolean | false | |
| `email_verified` | boolean | false | Registration email verified |

### 2.2 New table: `founding_rsp_applications`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, default gen_random_uuid() |
| `user_id` | uuid | FK to auth.users, nullable (can apply before account) |
| `company_name` | text | not null |
| `email` | text | not null |
| `city` | text | not null |
| `robot_types` | text[] | e.g. `["warehouse", "medical"]` |
| `fleet_size` | integer | |
| `why_founding` | text | Free-text motivation |
| `status` | text | `pending`, `approved`, `rejected`. Default `pending` |
| `created_at` | timestamptz | default now() |
| `reviewed_at` | timestamptz | nullable |
| `reviewed_by` | text | nullable, admin email |

RLS: public insert (anyone can apply), select own rows, admin select/update all.

---

## 3. Component Architecture

```
app/(platform)/robowork/providers/register/page.tsx    — Step 0 landing (SSR)
components/robowork/register-wizard.tsx                 — Client wizard shell
components/robowork/wizard-steps/
  step-business-basics.tsx                              — Step 1
  step-service-areas.tsx                                — Step 2
  step-robot-fleet.tsx                                  — Step 3
  step-specializations.tsx                              — Step 4
  step-verification.tsx                                 — Step 5
  step-payment.tsx                                      — Step 6
  step-preview.tsx                                      — Step 7
components/robowork/wizard-progress.tsx                 — Progress bar + step titles
components/robowork/wizard-celebration.tsx               — Post-publish confetti screen

app/(platform)/robowork/founding-rsp/page.tsx           — Founding RSP landing (SSR)
components/robowork/founding-rsp-form.tsx                — Application form

app/(platform)/admin/founding-rsp/page.tsx              — Admin review queue
app/api/robowork/founding-rsp/route.ts                  — POST apply, GET list (admin)
```

### 3.1 Register Wizard Shell

`RegisterWizard` is a client component that:
- Manages all form state in a single `WizardData` object passed down via props
- Tracks current step (1-7) + completion state
- Renders `WizardProgress` at top
- Renders the active step component
- Handles back/next navigation with slide animation (CSS transform + opacity transition, 200ms)
- On step completion, shows encouragement toast: "Great start! You're X% of the way to your first job."
- On final submit, calls `POST /api/robowork/providers` with all collected data
- On success, shows `WizardCelebration`

### 3.2 WizardData interface

```typescript
interface WizardData {
  // Step 1
  companyName: string;
  businessType: string;
  yearsInRobotics: number;
  website: string;
  linkedin: string;
  bio: string;
  profileImage: File | null;
  profileImageUrl: string;

  // Step 2
  city: string;
  state: string;
  country: string;
  serviceRadius: number;
  additionalCities: { city: string; state: string }[];

  // Step 3
  robots: RobotEntry[];

  // Step 4
  specializations: string[];
  taskSpecializations: string[];
  specializationLevels: Record<string, "beginner" | "experienced" | "expert">;

  // Step 5
  emailVerified: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  identityMethod: "government_id" | "linkedin" | null;
  identityDocUrl: string;
  insuranceDocUrl: string;
  backgroundCheckConsent: boolean;

  // Step 6
  paymentSetupStarted: boolean;

  // Step 7 — no additional data, just preview
}
```

---

## 4. Step 0 — Landing Page

SSR page at `/robowork/providers/register`. Replaces existing page.

**Sections:**

1. **Hero**: "Build your robotics business on the world's first RaaS marketplace."
   - Primary CTA: "Start Your Free Profile" — smooth-scrolls to wizard and sets step 1
   - Secondary CTA: "See how it works" — scrolls to how-it-works section

2. **Value props** (3 cards in a row):
   - GET FOUND: "975 businesses actively searching for robot operators. Be where they look."
   - GET PAID: "Integrated payments. Escrow protection. Automatic payouts. No invoicing headaches."
   - GET CERTIFIED: "Earn your RCO certification. Win more jobs. Charge higher rates."

3. **Social proof**: "Joining 500+ Robot Service Providers across 5 markets"

4. **How it works** (3 numbered steps):
   - Build your profile (15 minutes)
   - Get verified (24-48 hours)
   - Start winning jobs (immediately)

5. **Beta markets callout**: LA, Chicago, Dallas, Atlanta, NJ as priority launch markets.

6. **Wizard renders below** (hidden until CTA clicked, then visible with scroll-into-view).

**Metadata**: title "Become a Robot Service Provider — RoboWork | Robotomated", description for SEO, OpenGraph.

---

## 5. Steps 1-4: Data Collection

### Step 1 — Business Basics
- Company name: text input, required
- Business type: 6 selectable cards (`solo`, `small_fleet`, `mid_fleet`, `large_fleet`, `rental_company`, `integrator`). Each card has icon + label + subtitle.
- Years in robotics: range slider 0-20, shows current value
- Website: text input, optional, url validation
- LinkedIn: text input, optional
- Bio: textarea, max 500 chars, character counter, placeholder: "Describe your expertise and what makes you the right operator..."
- Photo upload: click-to-upload area, accepts jpg/png, max 2MB, uploads to Supabase Storage `rsp-profiles/` bucket, shows preview thumbnail

Encouragement: "Great start! You're 15% of the way to your first job on Robotomated."

### Step 2 — Service Areas
- Primary city: text input, required
- State: dropdown of US states, required
- Service radius: range slider 25-500 miles, step 25, shows value label
- Beta market detection: on city+state change, check against list `["Los Angeles", "Chicago", "Dallas", "Atlanta", "Newark", "Jersey City"]`. Show green badge if match, amber "priority waitlist" if not.
- Additional cities toggle: "Operate in multiple cities?" — reveals add fields, up to 5 entries (city + state pairs)

Encouragement: "Nice — you're covering [radius] miles. That's a lot of potential jobs."

### Step 3 — Robot Fleet
- "Add a robot" button starts each entry
- Robot search: debounced text input hitting `GET /api/robots?search=`. If match found, auto-fills name, manufacturer, category from DB. If not, show manual entry fields (name, manufacturer, category).
- Per robot fields: daily rate ($), weekly rate ($), monthly rate ($), minimum booking (days), fulfillment types (checkboxes: with operator, drop-off autonomous, remote operated), availability toggle + date picker, photo upload (up to 5, Supabase Storage `rsp-robots/`)
- Each robot renders as a card with collapse/expand
- Fleet summary bar at bottom: "Your fleet: N robots | Est. daily revenue potential: $X-$Y" (sum of daily rates)
- At least 1 robot required to proceed

Encouragement: "Your fleet is looking strong. Businesses love seeing detailed listings."

### Step 4 — Specializations
- Industry specializations: 10 multi-select cards (warehouse, manufacturing, healthcare, agricultural, security, hospitality, construction, eldercare, retail, education). Each is a toggleable card with icon.
- Task specializations: 10 multi-select cards (material handling, pick & pack, floor cleaning, security patrol, inspection, welding/assembly, customer service, agricultural harvest, medical delivery, humanoid operation)
- For each selected specialization (industry + task combined), show an inline experience level toggle: Beginner | Experienced | Expert. Default: Experienced.
- At least 1 industry and 1 task required
- Note text: "Specialized RSPs earn 40% more per job."

Encouragement: "Almost there — verification is next, then you're live."

---

## 6. Steps 5-7: Trust, Payment, Launch

### Step 5 — Verification

Headline: "Verified RSPs win 3x more jobs"

**Required (gating):**
- Email verification: "Send code" button → generates 6-digit code, sends via Resend to user's email, input field to enter code, validates match. Sets `emailVerified = true`.
- Phone number: input + "Send code" button. Phase 1: UI only, accepts any 6-digit input as valid (SMS integration deferred). Sets `phoneVerified = true`.

**Tier system (non-gating, complete now or later):**

Visual display: 4-tier ladder, each tier shows icon, name, requirements, badge preview, what it unlocks.

- **Tier 1 — Identity Verified**: Upload government ID (Supabase Storage `rsp-verification/`) OR paste LinkedIn URL. Immediate self-attestation (admin reviews async). Unlocks: Identity Verified badge.
- **Tier 2 — Insured**: Upload Certificate of Insurance (PDF, Supabase Storage). Note: "$2M general liability minimum." Status: "Under review (24-48 hours)." Unlocks: Insured badge, premium job access.
- **Tier 3 — Background Checked**: Consent checkbox + info text. "$29.99 — free for Founding RSPs." Button shows "Coming soon" (Checkr deferred). Unlocks: Background Checked badge, hospital/school/eldercare jobs.
- **Tier 4 — RCO Certified**: Not inline. Shows description + "Get certified" link to `/certify`. Discount code `RSP_DISCOUNT_50` displayed. Unlocks: top search placement, Certified Operator label.

"Skip for now" link below tiers 1-4 — user can proceed without completing optional tiers.

### Step 6 — Payment Setup

Headline: "Set up payments in 2 minutes"

**Revenue model explanation:**
- Visual: Business pays → Robotomated (escrow) → Job complete → 88% to you, 12% platform fee → 2 business day payout
- Founding RSPs: 92% / 8% split (highlighted if applicable)

**Stripe Connect section:**
- "Connect your bank account" button
- Phase 1: clicking sets `paymentSetupStarted = true` in wizard data and shows success message: "You're on the list. We'll notify you when payouts go live."
- Requirements listed: bank account, SSN or EIN, business address
- Security note: "Bank info is stored by Stripe — Robotomated never sees your account numbers."
- Tax note: "We handle your 1099. You'll receive tax documents before filing season."

This step is skippable — "Set up later" link.

### Step 7 — Profile Preview

Headline: "Here's how businesses will find you"

Renders a preview card mirroring the public profile layout:
- Company name + logo
- Verification badges earned (filled/empty)
- Robot fleet cards (name, rates, fulfillment types)
- Specializations as tags
- Service area (city + radius)
- RSP Score: "Pending — calculated after first job"
- Founding RSP badge if applicable

"Publish Your Profile" primary CTA.

**On publish:**
1. Upload any pending files to Supabase Storage
2. `POST /api/robowork/providers` with all wizard data
3. Set `onboarding_completed_at = now()` server-side
4. Show celebration screen

### Celebration Screen

Component: `WizardCelebration`
- CSS confetti animation (keyframe-based, no library)
- "Welcome to Robotomated, [Company Name]!"
- What happens next: 4 checkmarks (profile live, job notifications, verification review, browse jobs)
- Three action cards linking to: `/robowork/jobs` (Browse Open Jobs), verification completion, `/certify` (Get RCO Certified)

---

## 7. Founding RSP Program

### 7.1 Landing Page: `/robowork/founding-rsp`

SSR page with:
- Hero: "Founding Robot Service Provider" + subheadline about 100 spots
- 7 perk cards (numbered, each with value callout)
- Live counter: "X of 100 spots remaining" — queries DB count of approved applications
- Requirements section (1 robot, insurance, identity, first job within 60 days)
- Application form (bottom of page)
- SEO metadata + JSON-LD

### 7.2 Application Form

Client component `FoundingRspForm`:
- Fields: name, email, company, city, robot types (multi-select from category list), fleet size (number), "Why do you want to be a founding RSP?" (textarea, 200 char min)
- Submits to `POST /api/robowork/founding-rsp`
- Success state: "Application received! We review within 48 hours." + confirmation email

### 7.3 API: `POST /api/robowork/founding-rsp`

- Validates required fields
- Inserts into `founding_rsp_applications` with status `pending`
- Sends email to applicant (confirmation) via Resend
- Sends email to admin (notification) via Resend
- Returns `{ success: true }`

### 7.4 Admin Page: `/admin/founding-rsp`

Simple table:
- Columns: company, email, city, fleet size, robot types, why, status, date
- Each row: Approve / Reject buttons
- On approve: sets `status = 'approved'`, `reviewed_at = now()`, updates the RSP's `robot_service_providers` row (if exists) with `is_founding_rsp = true` and next `founding_rsp_number`, sends approval email with perks summary
- On reject: sets `status = 'rejected'`, `reviewed_at = now()`, sends polite rejection email

### 7.5 Badge Integration

Founding RSP badge ("Founding RSP #XX") appears on:
- `ProviderCard` component — gold badge next to company name
- Provider profile page — in badge row
- Bid submissions — businesses see it when reviewing bids

Implementation: check `is_founding_rsp` boolean on the provider data already returned by existing queries.

---

## 8. Email Templates

Three new emails in `lib/email/robowork-emails.ts`:

1. **Founding RSP application received** — to applicant. Confirms receipt, sets expectations (48hr review).
2. **Founding RSP approved** — to applicant. Congratulations, lists all 7 perks, links to dashboard.
3. **Enhanced provider welcome** — replaces existing welcome email. Mentions Founding RSP if applicable, lists 3 immediate actions (browse jobs, verify, certify), includes count of open jobs in their market.

Existing `sendProviderRegisteredNotification()` is updated to use the enhanced template.

---

## 9. API Changes

### Extended `POST /api/robowork/providers`

New accepted fields in request body:
- `business_type`, `years_in_robotics`, `phone`, `phone_verified`, `email_verified`
- `verification_tier`, `identity_doc_url`, `insurance_doc_url`, `background_check_consent`
- `specialization_levels` (jsonb)
- `payment_setup_started`
- `profile_image` (URL after upload)

Handler writes new columns to `robot_service_providers` insert. Existing fields (company_name, description, city, state, specializations, fulfillment_types, robots) continue working as-is.

Sets `onboarding_completed_at = now()` on successful insert.

---

## 10. Styling

All components use existing `--theme-*` CSS variables for light/dark mode. Follow existing patterns from the codebase:
- Cards: `var(--theme-card)` background, `var(--theme-border)` borders
- Inputs: `var(--theme-input-bg)`, `var(--theme-input-border)`
- Text: `var(--theme-text-primary)`, `var(--theme-text-secondary)`, `var(--theme-text-muted)`
- Accent: `#0EA5E9` for primary actions, `var(--theme-accent-blue)` for theme-aware accent
- Founding RSP badge: gold gradient (`#F59E0B` to `#D97706`)

Progress bar: segmented, filled segments use `#0EA5E9`, unfilled use `var(--theme-border)`.

Step transitions: `transform: translateX()` + `opacity` with 200ms ease-out.

Confetti: CSS keyframe animation, 30 colored squares falling with rotation, 3-second duration, no external library.

---

## 11. Deferred Items

| Item | Reason | When |
|------|--------|------|
| Stripe Connect Express | Requires Stripe account + business verification | Phase 2 |
| SMS verification (Twilio/etc) | Requires SMS provider setup | Phase 2 |
| Checkr background checks | Requires Checkr account + integration | Phase 2 |
| Map visualization (Step 2) | Nice-to-have, slider is sufficient | Phase 2 |
| Welcome email drip (6 emails) | Plan B — separate spec | Phase 3 |
| RSP dashboard upgrade | Plan C — separate spec | Phase 2 |
| RSP profile redesign | Plan D — separate spec | Phase 2 |
| PWA + push notifications | Plan F — separate spec | Phase 3 |
| Growth tools | Plan G — separate spec | Phase 2 |

---

## 12. File Manifest

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/025_rsp_onboarding.sql` | New | Add columns + founding table |
| `app/(platform)/robowork/providers/register/page.tsx` | Rewrite | Step 0 landing page |
| `components/robowork/register-wizard.tsx` | New | Wizard shell + state management |
| `components/robowork/wizard-progress.tsx` | New | Progress bar component |
| `components/robowork/wizard-celebration.tsx` | New | Confetti celebration screen |
| `components/robowork/wizard-steps/step-business-basics.tsx` | New | Step 1 |
| `components/robowork/wizard-steps/step-service-areas.tsx` | New | Step 2 |
| `components/robowork/wizard-steps/step-robot-fleet.tsx` | New | Step 3 |
| `components/robowork/wizard-steps/step-specializations.tsx` | New | Step 4 |
| `components/robowork/wizard-steps/step-verification.tsx` | New | Step 5 |
| `components/robowork/wizard-steps/step-payment.tsx` | New | Step 6 |
| `components/robowork/wizard-steps/step-preview.tsx` | New | Step 7 |
| `app/(platform)/robowork/founding-rsp/page.tsx` | New | Founding RSP landing |
| `components/robowork/founding-rsp-form.tsx` | New | Application form |
| `app/api/robowork/founding-rsp/route.ts` | New | Apply + admin endpoints |
| `app/(platform)/admin/founding-rsp/page.tsx` | New | Admin review queue |
| `app/api/robowork/providers/route.ts` | Extend | Accept new fields in POST |
| `lib/email/robowork-emails.ts` | Extend | 3 new email templates |
| `components/robowork/provider-card.tsx` | Edit | Add founding badge |
| `app/(platform)/robowork/providers/[slug]/page.tsx` | Edit | Add founding badge |
