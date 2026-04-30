# Robotomated DESIGN.md
**Inspired by SpaceX. Adapted for the operating system of the robotics economy.**

> Source of truth for all visual decisions. Drop into project root. AI agents read this to generate consistent UI.

---

## 1. Visual Theme & Atmosphere

**Mission:** Make Robotomated feel like the SpaceX of robotics — the place professionals come when they're spending real money on real machines that have to work in the real world.

**Mood:** Engineering report meets cinematic dossier. Restraint as the dominant signal. The robots themselves carry the visual weight — the UI gets out of the way.

**Density:** Generous, almost uncomfortable amounts of negative space. White space is a status signal: only the most confident brands can afford to leave the page nearly empty. Robotomated is one of them.

**Design philosophy:** Trust the work to carry the weight. No decoration. No gradients. No glassmorphism. No purple. No emoji. No marketing language disguised as UI. If it doesn't help a buyer make a decision or a worker pass a certification, delete it.

**What this site is NOT:**
- Not a SaaS dashboard (that's Linear, Supabase)
- Not an AI tool (that's Cursor, Replicate)
- Not a media publication (that's The Verge, WIRED)
- It is an industrial reference platform with editorial credibility

---

## 2. Color Palette & Roles

Two-value system. Maximum contrast. No exceptions.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#000000` | Primary surface (dark mode default), primary text on light |
| `--paper` | `#FFFFFF` | Primary text on dark, primary surface on light |
| `--ink-90` | `#0A0A0A` | Cards/panels on dark surface (1-step elevation) |
| `--ink-80` | `#141414` | Hover/active panels on dark |
| `--ink-70` | `#1F1F1F` | Borders on dark mode |
| `--paper-90` | `#F5F5F5` | Cards on light surface |
| `--paper-80` | `#EBEBEB` | Hover states on light |
| `--paper-70` | `#D4D4D4` | Borders on light |

**Restricted accents** (use sparingly, never decoratively):

| Token | Hex | Allowed use |
|---|---|---|
| `--alert` | `#FF3B00` | ONLY for: critical warnings, recall notices, certification failures. Never for CTAs. |
| `--data` | `#00D4FF` | ONLY for: live data, real-time indicators, "now playing" markers, intelligence feed timestamps. Borrowed from launch telemetry HUDs. Never as a brand color. |
| `--interactive` | `#D4D4D4` | Primary interactive elements: links, focus rings, primary CTA borders, active nav. Escalates to `#FFFFFF` on hover. |

**Status tokens** (reserved for state communication, never decorative):

| Token | Hex | Allowed use |
|---|---|---|
| `--status-error` | `#FF3B00` | Genuine emergency only. Recalls, system failures, critical validation. |
| `--status-error-muted` | `#B33000` | Routine error indicators. Badges, form validation, "required" labels, failed checks. Most error UI uses this. |
| `--status-warning` | `#CC8400` | Caution without alarm. Expiring items, approaching limits. |
| `--status-success` | `#4A9E6B` | Passed, verified, complete, online. |
| `--status-info` | `#5B8FA8` | Informational, neutral. Tooltips, hints. |

**Status token usage rule:** Status tokens are reserved for state communication. Never decorative or aesthetic. Components that want visual interest must use lightness, weight, or spacing — not status hue.

**Forbidden:**
- Gradients (any kind)
- Drop shadows on text
- Color-as-decoration
- Brand colors borrowed from your robot manufacturer logos

**Canvas mode:** Dual. Dark mode is default. Light mode is opt-in via system preference. Marketing pages and certification flows can override to light mode for warmth — robot detail pages and the intelligence feed stay dark.

---

## 3. Typography Rules

Type IS the design. There are no decorations to fall back on.

**Font stack:**
- **Display + Headlines:** `"Space Grotesk", "Helvetica Neue", system-ui, sans-serif` — geometric, wide, tight tracking. Already in the codebase. Keep it.
- **Body:** `"Inter", system-ui, sans-serif` — workhorse, readable at small sizes
- **Mono (technical specs only):** `"JetBrains Mono", "SF Mono", monospace` — RoboScore numbers, ROI calculations, payload specs, salary ranges, latitude/longitude

**No serifs anywhere.** No script faces. No display ornaments.

**Hierarchy:**

| Class | Size | Line | Tracking | Weight | Usage |
|---|---|---|---|---|---|
| `display-1` | 96px / 6rem | 1.0 | -0.04em | 500 | Hero headlines only, one per page max |
| `display-2` | 64px / 4rem | 1.05 | -0.03em | 500 | Page titles |
| `headline` | 40px / 2.5rem | 1.1 | -0.02em | 500 | Section headers |
| `subhead` | 24px / 1.5rem | 1.2 | -0.01em | 500 | Subsections |
| `body-lg` | 18px / 1.125rem | 1.5 | 0 | 400 | Lead paragraphs |
| `body` | 16px / 1rem | 1.6 | 0 | 400 | Default body |
| `body-sm` | 14px / 0.875rem | 1.5 | 0 | 400 | Captions, metadata |
| `label` | 12px / 0.75rem | 1.2 | 0.12em | 500 | UPPERCASE METADATA LABELS |
| `mono-spec` | 14px / 0.875rem | 1.4 | 0 | 400 | Technical specs in mono |

**Capitalization rules:**
- Section markers in ALL CAPS with wide tracking: `01 / HUMANOIDS`, `02 / QUADRUPEDS`
- Metadata labels in ALL CAPS: `MANUFACTURER`, `PAYLOAD`, `STATUS`, `LAST UPDATED`
- Body copy in sentence case
- Never title case in headlines (forbidden — too marketing-y)

**Weight discipline:**
- Use 400 (regular) and 500 (medium) for 95% of the site
- 700 (bold) only for emphasis within body copy, never structurally
- No thin (300) weights, no extra-bold (800), no black (900)

---

## 4. Component Stylings

### Buttons
Square corners. No rounded pills. No gradients. No shadows.

**Primary button:**
- Background: `--paper` on dark mode, `--ink` on light mode
- Text: opposite (always max contrast)
- Border: 1px solid same as background
- Padding: `12px 24px`
- Radius: `2px` (just enough to not look like a 90s box)
- Font: 14px, weight 500, tracking 0.04em, UPPERCASE
- Hover: background shifts to `--paper-90` / `--ink-80`, no animation beyond 80ms ease

**Secondary button:**
- Background: transparent
- Text: `--paper` on dark, `--ink` on light
- Border: 1px solid current text color
- Same padding/radius/font as primary
- Hover: border + text invert

**Ghost button (tertiary):**
- No background, no border
- Underline on hover only

**No icon-only buttons in primary nav.** Always pair icons with labels.

### Cards

**Spec card** (robot detail, manufacturer card):
- Background: `--ink-90` on dark, `--paper-90` on light
- Border: 1px solid `--ink-70` / `--paper-70`
- Radius: `2px`
- Padding: `32px`
- No shadow. No hover lift. Hover state: border color shifts one step.

**Editorial card** (intelligence feed, news items):
- Full-bleed image at top, 16:9 ratio
- Below image: 24px padding, headline, deck, metadata row in uppercase labels
- No background color, no border — just typography on the canvas
- Separated by 1px hairline rules between cards, not borders around them

### Inputs
- Background: transparent
- Border: 1px solid `--ink-70` / `--paper-70` bottom only
- Padding: `12px 0`
- Focus: border-bottom-color shifts to `--paper` / `--ink`, no glow
- Label: uppercase, 12px, tracking 0.12em, sits ABOVE input
- No placeholder text inside the input

### Navigation (header)
- Logo: ROBOTOMATED in custom letter-spaced wordmark (mimics SpaceX wordmark proportions)
- Nav items: UPPERCASE, 12px, tracking 0.12em, weight 500
- Active state: underline 1px solid current color, 2px below baseline
- No dropdowns with images. Plain text menus only.
- Mobile: hamburger reveals full-screen overlay, not a sidebar

### Footer
- Sparse. Five sections max: PRODUCT / PLATFORM / RESOURCES / COMPANY / LEGAL
- Same typography rules as header
- No newsletter signup form in footer

### Tables (manufacturer directory, comparison tool)
- No alternating row colors
- 1px hairline rules between rows only
- Column headers: uppercase labels, 12px
- Cell padding: `16px 24px`
- Mono font for any numeric column

### Hero pattern (homepage, category pages)
- Full-bleed image or video, no overlay tint
- Headline positioned bottom-left, 96px display weight 500
- Single small UPPERCASE label above headline (e.g., `02 / QUADRUPEDS`)
- One CTA button only, never two competing
- Scroll indicator: vertical line, 1px, 40px tall, animated subtle pulse

### Section markers
Numbered dividers between major content blocks:
- Number + name in uppercase (e.g., `01 / FEATURED ROBOTS`)
- Long horizontal rule extending to right edge
- 1px solid `--ink-70` / `--paper-70`
- 80px vertical margin above, 40px below

---

## 5. Layout Principles

**Grid:** 12-column, 1440px max-width. 80px gutters at desktop, 24px at mobile.

**Spacing scale (px):** `4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192`

Use this scale ONLY. No arbitrary values. The discipline IS the design.

**Whitespace philosophy:**
- Sections separated by 128px on desktop, 64px on mobile
- Components within sections separated by 48px
- Related elements grouped at 16px
- Hero sections: minimum 192px of vertical breathing room before content begins

**Image strategy:**
- Robots are the heroes. Photography is full-bleed, never matted in cards.
- Studio shots on pure black or pure white only
- No drop shadows on product images
- No "hero illustrations" — vector art is forbidden
- Video > photography wherever the footage exists

**Asymmetric layouts allowed:**
- Two-column splits don't have to be 50/50 — try 5/7 or 4/8
- Headlines can break grid intentionally for emphasis
- Single-column reading width: 720px max for body copy

---

## 6. Depth & Elevation

**No elevation system.**

The site is flat. There are no shadows, no z-depth, no glassmorphism, no neumorphism. Hierarchy comes from:
1. Type scale
2. Whitespace
3. Background tone steps (`--ink-90` vs `--ink-80` vs `--ink-70`)
4. Hairline rules

Modals and overlays:
- Background: full opacity `--ink` / `--paper`
- No backdrop blur
- Closed by ESC, click outside, or X button (top-right, 24x24, hairline border)

---

## 7. Do's and Don'ts

### DO
- Use full-bleed media wherever possible
- Number your sections (01, 02, 03)
- Use UPPERCASE METADATA LABELS for all small text
- Trust monospace for technical specs
- Leave aggressive amounts of whitespace
- Treat each robot detail page like a launch dossier
- Caption images with metadata in mono
- Use the data accent (`#00D4FF`) only for live/real-time indicators
- Allow long horizontal rules to extend to viewport edges

### DON'T
- Don't use gradients. Ever.
- Don't add purple, blue, or any "tech brand" color
- Don't use rounded corners over 4px
- Don't add drop shadows
- Don't use emoji in UI
- Don't write marketing copy in headlines — write factual claims
- Don't use sentence-case in section markers
- Don't decorate with patterns, dot grids, or background textures
- Don't animate page transitions beyond a 200ms fade
- Don't use multiple competing CTAs in the same section
- Don't use stock photography — only real robots
- Don't use the brand colors of robot manufacturers — they undermine our editorial independence

---

## 8. Responsive Behavior

**Breakpoints:**
- `mobile`: < 640px
- `tablet`: 640px - 1024px
- `desktop`: 1024px - 1440px
- `wide`: > 1440px

**Mobile-specific rules:**
- Display-1 (96px) shrinks to 56px
- Display-2 (64px) shrinks to 40px
- Section spacing: 128px becomes 64px
- Single-column always
- Touch targets minimum 48x48px
- Buttons full-width on mobile

**Tablet rules:**
- Two-column layouts retain at this breakpoint
- Navigation collapses to hamburger at this breakpoint
- Tables become horizontally scrollable (do NOT stack into cards)

**Desktop rules:**
- 12-column grid active
- Asymmetric layouts encouraged
- Full hero treatments at top of category and detail pages

**Wide (>1440px):**
- Content stays at 1440px max-width, centered
- Hero images can extend full-bleed
- Don't upscale type beyond display-1

---

## 9. Agent Prompt Guide

### Quick token reference
PRIMARY DARK:   #000000 (--ink)
PRIMARY LIGHT:  #FFFFFF (--paper)
DARK CARD:      #0A0A0A (--ink-90)
DARK BORDER:    #1F1F1F (--ink-70)
ALERT:          #FF3B00 (use for warnings only)
DATA:           #00D4FF (use for live indicators only)
DISPLAY FONT:   Space Grotesk (500 weight)
BODY FONT:      Inter (400 weight)
MONO FONT:      JetBrains Mono (technical specs)
GRID:           12-col, 1440px max, 80px gutters
RADIUS:         2px (cards/buttons), 0px (everything else)
SPACING SCALE:  4/8/16/24/32/48/64/96/128/192

### Ready-to-use prompts

**Build a robot detail page:**
> "Generate a robot detail page following Robotomated DESIGN.md. Hero is full-bleed product video with bottom-left headline (display-2, weight 500). Below hero: section marker `01 / SPECIFICATIONS`, followed by 12-column spec grid with mono numbers. Section marker `02 / VERDICT` with body-lg editorial review. Section marker `03 / RELATED COVERAGE` with editorial cards from intelligence feed. No purple, no gradients, no shadows. Use `--ink` background, `--ink-90` for spec card backgrounds, hairline rules between rows."

**Build a category page:**
> "Generate a buyer's guide category page following Robotomated DESIGN.md. Hero with full-bleed lead robot photo and section marker like `02 / QUADRUPEDS`. Below: editorial intro paragraph (max 720px reading width, body-lg). Section `01 / TOP PICKS` with editorial cards. Section `02 / COMPARE` with sortable table using mono for spec columns. Section `03 / EVERY MODEL` with full sortable directory."

**Build the certification sales page:**
> "Generate the Operator Level 1 certification sales page following Robotomated DESIGN.md. Hero in light mode (override) with display-2 headline. Section `01 / WHAT YOU LEARN` with 5-module grid using spec cards. Section `02 / OUTCOMES` with mono salary range presentation. Section `03 / COHORT` with current cohort dynamic data. Section `04 / FAQ` with accordion. Single primary CTA button per section maximum."

**Build the intelligence feed:**
> "Generate the intelligence feed following Robotomated DESIGN.md. Dark mode only. Editorial card layout with full-bleed images, headlines at display-2, deck below in body-lg, metadata row in uppercase labels (SOURCE / TIMESTAMP / CATEGORY) with timestamp using `--data` color. Hairline rules between cards. Filter chips at top in uppercase, 12px tracking 0.12em."

### When in doubt
1. Remove an element
2. Increase whitespace
3. Reduce color count
4. Convert to mono if it's numeric
5. ALL CAPS the metadata
6. Ask: "would SpaceX put this on their site?" If no, delete it.

---

## Appendix: What this looks like in practice

The homepage hero on Robotomated, post-redesign:
- Full-bleed video of a humanoid robot from one of the manufacturers in our database
- Bottom-left: `01 / WHAT WE COVER` in 12px uppercase tracking 0.12em
- Below that: "975 robots. Every spec, every review, every certification path." in display-2 weight 500
- Single ghost CTA button: `EXPLORE THE DATABASE →`
- That's it. No badges. No "trusted by" logos. No animated background. No newsletter form. The video does the work.

If it feels almost empty, you're doing it right.