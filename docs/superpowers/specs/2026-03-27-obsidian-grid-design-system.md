# Obsidian Grid Design System — Robotomated

**Date:** 2026-03-27
**Status:** Approved
**Scope:** Full site design system overhaul — every page, every component
**Direction:** Bloomberg Terminal meets Vercel. Data-dense, professionally authoritative, alive with breathing data.

---

## 1. Design Philosophy

"The Bloomberg Terminal for Robotics." This is an intelligence platform, not a product catalog. Every design decision serves one question: does this make an operations director trust this tool with a $200K purchase decision?

**Core principles:**
- Data density on demand — simple by default, deep on click
- Professional authority — no decoration that doesn't earn its place
- Breathing data — subtle animations signal the platform is live and connected
- Enterprise trust — transparent methodology, independent scoring, real data signals only

---

## 2. Color System

Pure obsidian base. No navy, no warm undertones. Colors are functional — each has exactly one job.

### Backgrounds (darkest → lightest)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-void` | `#050505` | Page background, deepest layer |
| `--bg-base` | `#080808` | Primary surface |
| `--bg-surface` | `#0C0C0C` | Cards, panels |
| `--bg-elevated` | `#101010` | Hover states, elevated elements |
| `--bg-hover` | `#151515` | Active/pressed states |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--blue` | `#0EA5E9` | Interactive elements, borders, links, sector codes, card top-borders |
| `--blue-dim` | `rgba(14,165,233,0.06)` | Blue tinted backgrounds (badges, hover fills) |
| `--lime` | `#C8FF00` | Positive data ONLY: RoboScores, price drops, upward deltas, system status |
| `--lime-dim` | `rgba(200,255,0,0.05)` | Lime tinted backgrounds |
| `--magenta` | `#FF006E` | Negative data: downward deltas, low scores, errors |
| `--amber` | `#F59E0B` | Mid-range scores, warnings |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#E8E8E8` | Headings, robot names |
| `--text-secondary` | `#888888` | Body text, descriptions |
| `--text-tertiary` | `#555555` | Labels, meta, secondary info |
| `--text-ghost` | `#2E2E2E` | Card labels, grid backgrounds |
| `--text-data` | `#FFFFFF` | All numerical data in JetBrains Mono |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `#1A1A1A` | Primary borders between elements |
| `--border-subtle` | `#131313` | Internal card dividers, ticker separators |
| `--border-active` | `rgba(14,165,233,0.2)` | Hover state borders |

### Score Tier Colors
| Tier | Range | Color |
|------|-------|-------|
| Elite | 90-100 | `--lime` (#C8FF00) |
| Strong | 80-89 | `--text-data` (#FFFFFF) |
| Good | 70-79 | `--amber` (#F59E0B) |
| Below avg | <70 | `--magenta` (#FF006E) |

### RoboScore 9-Dimension Weights (updated)
Previous 8-dimension model redistributed to add Vendor Reliability.

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Performance | 22% | Speed, payload, precision, throughput |
| Reliability | 18% | Uptime, MTBF, build quality, durability |
| Ease of Use | 13% | Setup complexity, UI quality, learning curve |
| Intelligence | 12% | Autonomy, AI capabilities, sensor suite, adaptability |
| Vendor Reliability | 10% | Funding stability, years in market, support network, customer retention |
| Value | 9% | Price-to-capability ratio, TCO, ROI timeline |
| Ecosystem | 7% | Third-party integrations, accessories, developer tools, community |
| Safety | 5% | Certifications, collision avoidance, emergency stops, compliance |
| Design | 4% | Form factor, ergonomics, noise, aesthetics |

**Vendor Reliability (NEW):** Scored on total funding raised / public market cap, years in operation, geographic support coverage, number of deployments, and customer retention signals. This dimension answers "will this company still support this robot in 3 years?" — the #1 unspoken fear of enterprise buyers.

---

## 3. Typography

### Font Stack
- **UI Chrome:** Space Grotesk — headings, navigation, body text, descriptions
- **Data:** JetBrains Mono — ALL numerical data, scores, prices, ticker symbols, sector codes, status text, labels, timestamps, deltas

### Scale
| Element | Font | Size | Weight | Letter-spacing |
|---------|------|------|--------|---------------|
| Hero H1 | Space Grotesk | 72px (desktop), 40px (mobile) | 700 | -0.05em |
| Section H2 | Space Grotesk | 28px | 700 | -0.035em |
| Card H3 | Space Grotesk | 14px | 700 | -0.02em |
| Nav items | Space Grotesk | 12px | 500 | -0.01em |
| Body | Space Grotesk | 13px | 400 | 0 |
| Data values | JetBrains Mono | 13-34px | 700 | 0 |
| Labels | JetBrains Mono | 9px | 600 | 0.12em |
| Ticker | JetBrains Mono | 10px | 500-700 | 0.04em |
| Status bar | JetBrains Mono | 10px | 500 | 0.03em |

### Rules
- `font-variant-numeric: tabular-nums` on ALL numerical data
- Hero headline: 3-line break on desktop ("The Bloomberg / Terminal for / Robotics")
- Card labels: ALL CAPS, ghost color, 0.12em letter-spacing
- Sector codes: bracketed `[WRH]`, mono, blue-tinted badge

---

## 4. Layout System

### Grid
- Max width: 1200px
- Bento grid: 4 columns desktop, 2 tablet, 1 mobile
- Card gap: 1px (cards on dark substrate — creates floating-plane effect)
- Border radius: 4-6px (cards), 4px (buttons, badges), 2px (tags)

### Card Anatomy
Each card has:
1. **Top border:** 1px gradient from `--blue` to transparent (35% opacity)
2. **Label:** JetBrains Mono 9px, ghost color, uppercase, with 4px colored dot indicator
3. **Content:** Data-specific layout
4. **Hover:** Background shifts to `--bg-elevated` + blue corner glow (top-left, 60x60px radial gradient at 6% opacity)

### Hero
- **Max height:** 60vh on desktop — enterprise buyers must see data without scrolling
- **Background:** 20 floating data particles (2-3px, blue, 15% opacity, 16-26s float duration)
- **Ambient glows:** Blue top-right at 2.5% opacity, lime bottom-left at 1.2% opacity
- **Content:** Tag line → 72px headline → system status line

---

## 5. Component Specifications

### 5.1 Header (sticky)
- Height: 48px
- Background: `rgba(8,8,8,0.92)` + `backdrop-filter: blur(20px)`
- Logo: `ROBOTOMATED.` in JetBrains Mono 13px/700, dot in blue
- Nav: Space Grotesk 12px/500, tertiary color, active gets white + 4% white bg
- Search trigger: 1px border, ghost text, `⌘K` kbd badge
- AI Advisor button: blue background, black text, JetBrains Mono 10px/600

### 5.2 Status Bar
- Height: 26px
- Fixed data signals: `ACTIVE` (lime pulsing dot) + `ROBOTS 305` + `MANUFACTURERS 167` + `MARKETS 15`
- Right side: `REFRESHED 00:00 AGO` — timestamp ticks every second, resets every 30s
- Mobile: collapse to `305 ROBOTS // $103B MARKET` only

### 5.3 Ticker Strip
- Height: 30px
- Fade masks: 80px on each side
- Scroll speed: 42s linear infinite
- Each item: `SYMBOL score delta price` separated by 1px vertical borders
- Symbols: ATLAS, STCH, UR20, SPOT, DIGIT, PNDA, REX, UR10, ION, B2
- **Hidden on mobile** (< 768px)

### 5.4 Trust Bar (NEW)
- Position: directly below hero, above ticker
- Layout: single row, 4 items evenly spaced
- Background: `--bg-void` with top/bottom 1px borders
- Height: ~40px
- Content (JetBrains Mono 9px, tertiary color, uppercase, 0.08em spacing):
  - `INDEPENDENT METHODOLOGY — No manufacturer pays for scores`
  - `DATA SOURCES — 50+ verified specs per robot`
  - `UPDATED — Weekly price & availability checks`
  - `FOUNDED 2025 · San Francisco, CA`
- Each item has a 4px blue dot prefix
- Mobile: 2x2 grid, 2 items per row

### 5.5 Hero Section
- Max height: 60vh desktop
- Padding: 40px top, 24px bottom (compressed from v4's 64px/40px)
- Tag: JetBrains Mono 10px, blue, with 12px blue line prefix
- Headline: Space Grotesk 72px/700, -0.05em, gradient "Robotics" (blue → lime)
- System status: `MONITORING 305 ROBOTS // 167 MANUFACTURERS // $103B MARKET // UPDATED TODAY`
  - Robot count animates from 0 → 305 over 2.2s with ease-out cubic on page load
- **AI Advisor CTA button:** Below system status line. Blue background, JetBrains Mono. "FIND YOUR ROBOT →"
- Secondary CTA: "COMPARE ROBOTS" as ghost button beside it

### 5.6 Social Proof Strip (NEW)
- Position: below trust bar, above ticker
- Layout: single row with fade masks
- Content: `USED BY TEAMS IN` prefix, then category tags:
  - `Warehouse Operations` · `Hospital Procurement` · `Manufacturing Engineering` · `Fleet Management` · `Construction Operations` · `Agricultural Technology`
- Style: Space Grotesk 11px, secondary color
- Tags separated by `·` in ghost color
- When real customers exist, replace with company logos

### 5.7 Robot Cards (in bento grid and browse pages)
Clear hierarchy per card:
1. **Robot name** — Space Grotesk 14px/700, primary color
2. **Manufacturer + sector code** — `Boston Dynamics · [WRH]` — 10px, tertiary + blue badge
3. **RoboScore** — JetBrains Mono 16px/700, lime color, prominent
   - Hover tooltip (desktop) / tap-to-expand (mobile): full methodology breakdown
4. **Price** — JetBrains Mono 13px/600, lime for available, tertiary for RFQ
5. **Key spec** — ONE stat most relevant to category:
   - Warehouse: payload capacity
   - Cobots: reach/payload
   - Consumer: battery life
   - Drones: flight time
   - Medical: precision rating
   - Format: `PAYLOAD 20kg` in mono 10px
6. **CTA** — "View Analysis →" (NOT "Buy" or "Shop") — blue text, 11px

### 5.8 RoboScore Tooltip (NEW — site-wide)
- Desktop: hover tooltip, 280px wide, dark bg with subtle border
- Mobile: tap to expand inline
- Content:
  ```
  ROBOSCORE™ METHODOLOGY — 9 DIMENSIONS
  ──────────────────────────────────
  Performance       22%  ████████░░
  Reliability       18%  ██████░░░░
  Ease of Use       13%  █████░░░░░
  Intelligence      12%  ████░░░░░░
  Vendor Reliability 10% ████░░░░░░
  Value              9%  ███░░░░░░░
  Ecosystem          7%  ███░░░░░░░
  Safety             5%  ██░░░░░░░░
  Design             4%  ██░░░░░░░░
  ──────────────────────────────────
  Independently verified.
  Not manufacturer-provided.
  ```
- JetBrains Mono throughout, 10px
- Bar fills colored by the robot's actual sub-scores

### 5.9 AI Advisor CTA Strip (NEW — mid-page)
- Position: after trending robots grid, before sectors
- Full-width dark strip with top/bottom 1px borders
- Content: "Not sure which robot fits your operation?" (Space Grotesk 18px/600)
- Subtext: "Our AI advisor narrows 305 robots down to your top 3 in 5 questions." (13px, tertiary)
- CTA button: "START ADVISOR →" — blue bg, black text
- Blue ambient glow behind button on hover

### 5.10 Search + Filter Bar (NEW — browse pages + above robot grid)
- Prominent search input: full-width or near-full-width
- Placeholder: `Search 305 robots by name, manufacturer, use case, or spec...`
- Style: 1px border, 48px height, JetBrains Mono placeholder text
- Below search: horizontal filter pills for sectors `[WRH]` `[MFG]` `[MED]` etc.
- Active filter: blue border + blue dim background
- On homepage: appears above the bento grid as a compact version

---

## 6. Animation & Motion

### Principles
- Data should feel alive — "breathing," not flashy
- All motion respects `prefers-reduced-motion`
- Default transition: 150ms ease for hovers, 200ms for state changes

### Specific Animations
| Element | Animation | Duration | Behavior |
|---------|-----------|----------|----------|
| Hero robot count | Count up from 0 | 2.2s | Ease-out cubic, delayed 600ms |
| Status bar timestamp | Tick every 1s | Continuous | Reset to 00:00 every 30s |
| Ticker strip | Scroll left | 42s | Linear infinite loop |
| Data particles | Float upward | 16-26s each | 20 particles, staggered delays |
| Live indicator | Pulse opacity | 2.5s | Ease infinite |
| Card hover | Bg shift + corner glow | 150ms | On mouseenter |
| Score bars | Width transition | 1.2s | Cubic-bezier(0.16,1,0.3,1) on viewport entry |
| Page content | Fade up + deblur | 700ms | Staggered 50ms per element |
| Scanlines | Static overlay | None | 1px/2px repeating gradient at 1% opacity |

---

## 7. Responsive Breakpoints

| Breakpoint | Layout changes |
|------------|---------------|
| Desktop (≥1024px) | 4-column bento, full header nav, ticker visible, full status bar, 72px hero |
| Tablet (768-1023px) | 2-column bento, collapsed nav to hamburger, ticker visible, full status bar, 48px hero |
| Mobile (<768px) | 1-column bento, hamburger nav, ticker hidden, status bar shows `305 ROBOTS // $103B MARKET` only, 40px hero, trust bar becomes 2x2 grid |

---

## 8. Page-Specific Designs

### 8.1 Homepage
Full implementation of all components above in order:
1. Header (sticky)
2. Status bar
3. Hero (60vh max, particles, system status, dual CTA)
4. Trust bar
5. Social proof strip
6. Ticker
7. Search bar (compact)
8. Bento grid (stats + trending + sectors + score dist + price alert + reviews)
9. AI Advisor CTA strip
10. Value pillars ([01] SCORING, [02] ROI, [03] ADVISOR)
11. Compare CTA
12. Newsletter
13. Footer

### 8.2 Robot Detail Page (`/explore/[category]/[slug]`)
- Header + status bar (persistent)
- Breadcrumb: `Explore / [Category] / [Robot Name]`
- Two-column layout:
  - Left (60%): Robot images, description, full review content
  - Right (40%): Sticky sidebar with RoboScore breakdown (9 dimensions with bars), price card, key specs table, AI Advisor CTA, affiliate links
- All data in JetBrains Mono, all chrome in Space Grotesk

#### 8.2.1 TCO Summary Card (sticky sidebar)
Positioned prominently in the right sidebar below the RoboScore breakdown. Shows the REAL cost, not just sticker price.
- **Purchase Price** — JetBrains Mono 24px/700, lime
- **Est. Annual Maintenance** — mono 14px, secondary (as % of purchase price or flat estimate)
- **5-Year Total Cost** — mono 20px/700, primary (purchase + 5x maintenance + deployment)
- **Cost per Shift** — mono 14px, tertiary (at standard 8hr shift, standard utilization)
- **Cost per Hour** — mono 14px, tertiary
- Bottom note: `Based on industry averages. Actual costs vary by deployment.` in 9px tertiary
- Card style: lime left-border (2px), surface background, blue gradient top-border

#### 8.2.2 Total Cost of Ownership Section (below fold, full width)
Expandable panel, default collapsed with summary visible. JetBrains Mono labels, Space Grotesk descriptions.

| Data Point | Format | Source |
|------------|--------|--------|
| Annual maintenance cost | % of purchase price + flat estimate | Industry data + manufacturer specs |
| Warranty | Standard length + coverage scope | Manufacturer published |
| Support model | On-site / Remote / Partner network | Manufacturer published |
| Spare parts availability | Manufacturer / Third-party / Proprietary lock-in | Research + manufacturer |
| Typical deployment time | Days/weeks to operational | Customer reports + manufacturer |
| Training required | Operator hours + technical staff needed | Manufacturer published |
| Infrastructure requirements | Power (V/A), space (m²), flooring type, network | Manufacturer specs |

Layout: 2-column grid of data cards, each with label (mono 9px ghost) + value (mono 13px data) + description (11px tertiary).

#### 8.2.3 Vendor Health Indicators (sidebar card below TCO)
Signals the buyer can trust the manufacturer will exist in 5 years.

| Indicator | Format |
|-----------|--------|
| Total funding raised | `$XXM` or `PUBLIC` — mono, data color |
| Founded year | `EST. 20XX` — longevity signal, years in parens |
| Employee count | `~XXX employees` — estimated |
| Deployments | `XXXX+ units deployed` (if public data available) |
| Support coverage | Geographic map or region list |

Card style: 1px border, `[VENDOR]` label in blue sector-code style. If data is unavailable for a field, show `NOT DISCLOSED` in ghost color — transparency about what we don't know builds trust.

#### 8.2.4 Compliance & Certifications (sidebar card)
| Field | Format |
|-------|--------|
| Safety certifications | CE, UL, ISO badge pills |
| Industry-specific | FDA (medical), OSHA, ATEX (hazardous) — with status: `CERTIFIED` / `PENDING` / `N/A` |
| Insurance implications | Brief note on how this robot class affects commercial insurance |

Badge style: mono 9px, blue-dim bg + blue border for certified, ghost for N/A.

#### 8.2.5 Buyer's Checklist Component
- Position: below the review content, before related robots
- CTA: "Download: 20 Questions to Ask Before Buying" — blue button
- Preview: show first 5 questions inline in a numbered list, rest behind download
- Questions cover: pricing transparency, warranty terms, support SLAs, integration costs, training, spare parts, deployment timeline, references, pilot programs, contract terms
- Download format: PDF (branded with Robotomated obsidian theme)
- Lead capture: email required for download (high-value lead magnet)
- Design: card with blue left-border, `[BUYER'S GUIDE]` label, list in mono 11px

#### 8.2.6 Below-Fold Sections (full width, sequential)
1. TCO Section (8.2.2)
2. ROI Calculator (existing)
3. Buyer's Checklist (8.2.5)
4. Comparison to similar robots
5. Related reviews

### 8.3 Explore/Browse Page (`/explore`, `/explore/[category]`)
- Header + status bar
- Full-width search bar at top
- Horizontal sector filter pills
- Sort controls: `SCORE ↓` `PRICE ↑` `NEWEST` `NAME`
- Robot list: card grid (1/2/3 columns responsive) using the robot card spec from 5.7
- Sidebar filters on desktop: price range, score range, manufacturer, year, key specs
- Pagination or infinite scroll

### 8.4 Learn/Article Pages
- Header + status bar
- Article hero: title (Space Grotesk 36px), author, date, read time — all in the obsidian aesthetic
- Content: prose-optimized width (680px max), `@tailwindcss/typography` with dark theme overrides
- Inline robot cards where robots are mentioned
- Related articles at bottom
- Newsletter CTA at end

---

## 9. Design Tokens Summary (CSS Custom Properties)

All tokens defined in `globals.css` under `@theme` block. Every component references tokens — no hardcoded colors in component files.

---

## 10. Implementation Order

1. **globals.css** — new color system, typography, base styles, animations, scanlines
2. **Homepage** — full rebuild with all new components
3. **Robot detail page** — two-column layout with RoboScore breakdown
4. **Explore/browse page** — search, filters, robot card grid
5. **Learn article pages** — dark prose styling
6. **Shared components** — header, footer, robot card, RoboScore tooltip, search bar

Build verification after each page: `turbo build` must pass clean.
