# Obsidian Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Robotomated from a robot directory into the Bloomberg Terminal for robotics — a procurement intelligence platform with obsidian design system, complete buyer intelligence on every robot, and fleet management data foundation.

**Architecture:** 4-phase sequential implementation. Phase A rebuilds the design system (globals.css, layout, shared components). Phase B rebuilds the homepage. Phase C adds complete buyer intelligence to robot detail pages with new DB columns. Phase D adds fleet management tables. Each phase commits independently and must pass `npx next build`.

**Tech Stack:** Next.js 15, Tailwind CSS v4, Supabase PostgreSQL, TypeScript strict, Space Grotesk + JetBrains Mono fonts

**Design Spec:** `docs/superpowers/specs/2026-03-27-obsidian-grid-design-system.md`

---

## Phase A: Design System Implementation

### Task 1: Update globals.css with Obsidian Grid tokens and styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1:** Replace the entire `@theme` block with obsidian color tokens:
  - Backgrounds: `--color-obsidian: #080808`, `--color-obsidian-2: #0F0F0F`, `--color-obsidian-3: #1A1A1A`, `--color-obsidian-surface: #0C0C0C`, `--color-obsidian-elevated: #101010`, `--color-obsidian-hover: #151515`
  - Accents: `--color-electric-blue: #0EA5E9`, `--color-lime: #C8FF00`, `--color-magenta: #FF006E`, `--color-amber: #FBBF24`
  - Dim variants: `--color-electric-blue-dim: rgba(14,165,233,0.06)`, `--color-lime-dim: rgba(200,255,0,0.05)`, `--color-magenta-dim: rgba(255,0,110,0.05)`
  - Text: `--color-text-primary: #E8E8E8`, `--color-text-secondary: #888888`, `--color-text-tertiary: #555555`, `--color-text-ghost: #2E2E2E`, `--color-text-data: #FFFFFF`, `--color-text-muted: #6B7280`
  - Borders: `--color-border: #1A1A1A`, `--color-border-subtle: #131313`, `--color-border-active: rgba(14,165,233,0.2)`
  - Semantic: `--color-background: #080808`, `--color-foreground: #E8E8E8`
  - Keep font definitions but change: `--font-sans: "Space Grotesk"`, `--font-display: "Space Grotesk"`, keep `--font-mono: "JetBrains Mono"`

- [ ] **Step 2:** Replace glass card system with obsidian card system (1px top gradient border blue→transparent, corner glow on hover, bg-surface/bg-elevated transitions)

- [ ] **Step 3:** Add scanline overlay, data particle keyframes, ticker scroll animation, count-up animation, pulse-live animation

- [ ] **Step 4:** Update base styles: `body { background-color: #080808 }`, scrollbar colors to obsidian palette

- [ ] **Step 5:** Add responsive utility classes for status bar collapse, ticker hide on mobile

- [ ] **Step 6:** Run `npx next build` — fix any errors

### Task 2: Update root layout with new fonts

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1:** Replace Syne + Outfit imports with Space Grotesk + JetBrains Mono (keep JetBrains Mono as-is, replace both Syne and Outfit with Space Grotesk)

- [ ] **Step 2:** Update font variable assignments on `<html>` element

- [ ] **Step 3:** Run `npx next build` — verify clean

### Task 3: Rebuild header component

**Files:**
- Modify: `components/layout/header.tsx`

- [ ] **Step 1:** Rebuild header: 48px height, obsidian bg with backdrop-blur, JetBrains Mono logo `ROBOTOMATED.` with blue accent dot, Space Grotesk nav links (Explore, Compare, Reviews, Industries, Learn, Market Intel), search trigger with ⌘K, blue AI Advisor button

- [ ] **Step 2:** Add mobile hamburger menu with obsidian styling

- [ ] **Step 3:** Run `npx next build`

### Task 4: Build status bar component

**Files:**
- Create: `components/layout/status-bar.tsx`
- Modify: `app/layout.tsx` (add StatusBar below Header)

- [ ] **Step 1:** Create StatusBar: 26px height, JetBrains Mono 10px, shows ACTIVE (pulsing lime dot) + ROBOTS count + MANUFACTURERS count + MARKETS count. Right side: REFRESHED timestamp that ticks every second, resets every 30s. Client component for the timer.

- [ ] **Step 2:** Add responsive collapse: mobile shows only `305 ROBOTS // $103B MARKET`

- [ ] **Step 3:** Add to layout.tsx below Header

- [ ] **Step 4:** Run `npx next build`

### Task 5: Build data ticker component

**Files:**
- Create: `components/layout/data-ticker.tsx`

- [ ] **Step 1:** Build ticker strip: 30px height, horizontal scroll animation (42s), fade masks on edges. Ticker items with robot symbols (ATLAS, STCH, UR20, SPOT, DIGIT, PNDA, REX, UR10, ION, B2) + scores + deltas + prices. Hidden on mobile (<768px).

- [ ] **Step 2:** Run `npx next build`

### Task 6: Rebuild RoboScore components

**Files:**
- Modify: `components/ui/robo-score.tsx`

- [ ] **Step 1:** Update RoboScoreBadge: lime color for elite (90+), white for strong (80-89), amber for good (70-79), magenta for below (<70). JetBrains Mono font, tabular-nums.

- [ ] **Step 2:** Add RoboScoreTooltip component: 280px tooltip on hover (desktop) / tap-to-expand (mobile) showing 9-dimension methodology breakdown with percentage bars. JetBrains Mono throughout.

- [ ] **Step 3:** Update RoboScoreRing with obsidian palette

- [ ] **Step 4:** Update ScoreBar with obsidian palette and 9 dimensions

- [ ] **Step 5:** Run `npx next build`

### Task 7: Rebuild footer

**Files:**
- Modify: `components/layout/footer.tsx`

- [ ] **Step 1:** Rebuild with obsidian styling: JetBrains Mono 9px links, ghost color, border-subtle top border, AI Advisor secondary CTA in footer

- [ ] **Step 2:** Run `npx next build`

### Task 8: Build shared obsidian components

**Files:**
- Create: `components/ui/sector-code.tsx`
- Create: `components/ui/trust-bar.tsx`
- Create: `components/ui/social-proof-strip.tsx`
- Create: `components/ui/advisor-cta-strip.tsx`
- Modify: `components/robots/robot-card.tsx`

- [ ] **Step 1:** SectorCode component: bracketed codes [WRH][MED][MFG][AGR][CON][DEL][UAV][SEC] etc., JetBrains Mono 9px, blue-dim bg + blue border

- [ ] **Step 2:** TrustBar: single row with 4 trust signals (INDEPENDENT METHODOLOGY, DATA SOURCES, UPDATED, FOUNDED), blue dot prefixes, mobile 2x2 grid

- [ ] **Step 3:** SocialProofStrip: "USED BY TEAMS IN" + category tags (Warehouse Operations, Hospital Procurement, etc.)

- [ ] **Step 4:** AdvisorCtaStrip: mid-page CTA with headline, subtext, blue button

- [ ] **Step 5:** Update RobotCard: new hierarchy (name → manufacturer + sector → RoboScore → price → key spec → "View Analysis →")

- [ ] **Step 6:** Run `npx next build`

- [ ] **Step 7:** Commit: `git commit -m "feat: obsidian grid design system"`

---

## Phase B: Homepage Rebuild

### Task 9: Rebuild homepage

**Files:**
- Modify: `app/(marketing)/page.tsx`
- Create: `components/home/hero-particles.tsx`
- Create: `components/home/market-intelligence.tsx`
- Modify: `components/home/newsletter-form.tsx`

- [ ] **Step 1:** Build HeroParticles component: 20 floating data particles (CSS-only, no canvas), staggered delays, blue color at 15% opacity

- [ ] **Step 2:** Build MarketIntelligence component: 4 data cards (Total Market Size $103B, Fastest Growing: Humanoid +847%, Most Evaluated: Warehouse AMRs, Avg RoboScore: 74.2)

- [ ] **Step 3:** Rebuild page.tsx with exact section order:
  1. Hero (60vh max, 72px headline, system status line with animated robot count, dual CTAs)
  2. TrustBar
  3. SocialProofStrip
  4. DataTicker
  5. Search bar (compact) + category filter tabs with sector codes
  6. Featured robots bento grid (6 robots, using new RobotCard)
  7. AdvisorCtaStrip
  8. MarketIntelligence strip
  9. Sector browse grid (sectors with codes + counts)
  10. Latest Intelligence (3-col: news, articles, price movements)
  11. Newsletter signup
  12. Footer

- [ ] **Step 4:** Update newsletter-form with obsidian styling

- [ ] **Step 5:** Run `npx next build` — fix errors

- [ ] **Step 6:** Commit: `git commit -m "feat: homepage rebuild with full buyer intelligence layout"`

---

## Phase C: Robot Detail Page — Complete Buyer Intelligence

### Task 10: Database migration for buyer intelligence fields

**Files:**
- Create: `supabase/migrations/012_buyer_intelligence_fields.sql`
- Modify: `lib/supabase/types.ts`

- [ ] **Step 1:** Write migration SQL adding all new columns to robots table:
  ```sql
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_pct DECIMAL;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_low INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS maintenance_annual_cost_high INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_months INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS warranty_coverage TEXT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_model TEXT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS support_response_hours INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS spare_parts_availability TEXT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_min INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS deployment_weeks_max INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS floor_space_sqft INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS power_requirements TEXT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS network_requirements TEXT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS wms_integrations TEXT[];
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS erp_integrations TEXT[];
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS api_available BOOLEAN DEFAULT false;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS operator_training_hours INT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS safety_certifications TEXT[];
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS industry_certifications TEXT[];
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_funding_total TEXT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_employees_range TEXT;
  ALTER TABLE robots ADD COLUMN IF NOT EXISTS vendor_health_score INT;
  ```

- [ ] **Step 2:** Update `lib/supabase/types.ts` with new Robot type fields

- [ ] **Step 3:** Run `npx next build`

### Task 11: Build TCO and buyer intelligence components

**Files:**
- Create: `components/robots/tco-summary-card.tsx`
- Create: `components/robots/tco-section.tsx`
- Create: `components/robots/vendor-health-card.tsx`
- Create: `components/robots/compliance-card.tsx`
- Create: `components/robots/deployment-guide.tsx`
- Create: `components/robots/maintenance-guide.tsx`
- Create: `components/robots/training-section.tsx`
- Create: `components/robots/buyers-checklist.tsx`
- Create: `components/robots/quick-verdict-bar.tsx`

- [ ] **Step 1:** TcoSummaryCard: sidebar card with purchase price, annual maintenance, 5-year total, cost/shift, cost/hour. Lime left-border, mono data values.

- [ ] **Step 2:** TcoSection: expandable panel with purchase costs breakdown, annual operating costs, 5-year summary table, interactive ROI calculator with adjustable labor cost input

- [ ] **Step 3:** VendorHealthCard: sidebar card showing funding, founded year, employees, deployments, support coverage. `[VENDOR]` label. Shows `NOT DISCLOSED` for missing data.

- [ ] **Step 4:** ComplianceCard: safety cert badges (CE, UL, ISO), industry-specific clearances with status pills (CERTIFIED/PENDING/N/A), insurance note

- [ ] **Step 5:** DeploymentGuide: infrastructure requirements (floor, power, network, environment), deployment timeline (8-week gantt-style), integration requirements (WMS, ERP, API)

- [ ] **Step 6:** MaintenanceGuide: maintenance schedule table (daily→annual), service & support details, common issues & fixes

- [ ] **Step 7:** TrainingSection: operator/supervisor/IT training hours, manufacturer programs, change management notes

- [ ] **Step 8:** BuyersChecklist: show 5 questions free, email gate for full 20-question PDF. Stores email in newsletter_subscribers with tag 'buyers_checklist'.

- [ ] **Step 9:** QuickVerdictBar: single row — Best For, Avoid If, Payback Period, Complexity

- [ ] **Step 10:** Run `npx next build`

### Task 12: Rebuild robot detail page

**Files:**
- Modify: `app/(platform)/explore/[category]/[slug]/page.tsx`

- [ ] **Step 1:** Rebuild with obsidian design, two-column layout:
  - Left (60%): hero image, robot name + manufacturer + sector code, description, full review
  - Right (40%): sticky sidebar with RoboScore 9-dimension breakdown, TcoSummaryCard, VendorHealthCard, ComplianceCard, AI Advisor CTA, affiliate links

- [ ] **Step 2:** Add QuickVerdictBar below hero

- [ ] **Step 3:** Add below-fold sections: TcoSection, ROI Calculator, MaintenanceGuide, DeploymentGuide, TrainingSection, ComplianceCard (expanded), BuyersChecklist, Similar Robots, Price Alert

- [ ] **Step 4:** Run `npx next build`

- [ ] **Step 5:** Commit: `git commit -m "feat: complete buyer intelligence on robot detail pages"`

---

## Phase D: Fleet Management Foundation

### Task 13: Fleet management database migration

**Files:**
- Create: `supabase/migrations/013_fleet_management.sql`
- Modify: `lib/supabase/types.ts`

- [ ] **Step 1:** Write migration SQL:
  ```sql
  CREATE TABLE IF NOT EXISTS robot_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    robot_id UUID REFERENCES robots(id),
    custom_name TEXT,
    serial_number TEXT,
    purchase_date DATE,
    purchase_price INT,
    site_location TEXT,
    department TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','maintenance','offline','decommissioned')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES robot_assets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    log_date DATE NOT NULL,
    maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('routine','repair','emergency','upgrade')),
    description TEXT,
    technician TEXT,
    cost INT,
    downtime_hours DECIMAL,
    parts_replaced TEXT[],
    next_service_date DATE,
    documents TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES robot_assets(id) ON DELETE CASCADE,
    schedule_name TEXT NOT NULL,
    interval_type TEXT NOT NULL CHECK (interval_type IN ('daily','weekly','monthly','quarterly','annual','hours-based')),
    interval_value INT NOT NULL DEFAULT 1,
    task_description TEXT,
    estimated_hours DECIMAL,
    estimated_cost INT,
    requires_professional BOOLEAN DEFAULT false,
    last_completed DATE,
    next_due DATE,
    alert_days_before INT DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- RLS policies
  ALTER TABLE robot_assets ENABLE ROW LEVEL SECURITY;
  ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can manage own assets" ON robot_assets
    FOR ALL USING (auth.uid() = user_id);

  CREATE POLICY "Users can manage own maintenance logs" ON maintenance_logs
    FOR ALL USING (auth.uid() = user_id);

  CREATE POLICY "Users can manage schedules for own assets" ON maintenance_schedules
    FOR ALL USING (
      asset_id IN (SELECT id FROM robot_assets WHERE user_id = auth.uid())
    );

  -- Indexes
  CREATE INDEX idx_robot_assets_user ON robot_assets(user_id);
  CREATE INDEX idx_robot_assets_status ON robot_assets(status);
  CREATE INDEX idx_maintenance_logs_asset ON maintenance_logs(asset_id);
  CREATE INDEX idx_maintenance_logs_date ON maintenance_logs(log_date);
  CREATE INDEX idx_maintenance_schedules_asset ON maintenance_schedules(asset_id);
  CREATE INDEX idx_maintenance_schedules_next_due ON maintenance_schedules(next_due);
  ```

- [ ] **Step 2:** Update `lib/supabase/types.ts` with RobotAsset, MaintenanceLog, MaintenanceSchedule types

- [ ] **Step 3:** Run `npx next build`

- [ ] **Step 4:** Commit: `git commit -m "feat: fleet management database foundation"`

---

## Verification

After all phases:
- [ ] `npx next build` passes clean
- [ ] All pages render with obsidian design system
- [ ] Mobile responsive (ticker hidden, status bar collapsed, single-column cards)
- [ ] RoboScore tooltips work on hover/tap
- [ ] Robot count animates on homepage load
- [ ] Ticker scrolls smoothly
- [ ] Status bar timestamp ticks
