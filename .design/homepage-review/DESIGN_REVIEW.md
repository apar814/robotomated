# Design Review: Homepage

Reviewed against: `/DESIGN.md` (SpaceX-inspired)
Date: 2026-04-29
Branch: `feat/spacex-redesign`

## Screenshots

Not captured via browser tool (no Playwright MCP available). This review is based on code analysis of every component rendered on the homepage. Manual visual verification recommended at `http://localhost:3000` at 375px and 1440px.

## Summary

The homepage reads as two design systems coexisting on one page. The hero section (lines 97-155 of page.tsx) follows DESIGN.md: pure black background, white type, section marker, single ghost CTA. Everything below the hero reverts to the pre-redesign electric blue palette. The root cause is that 11 sub-components imported by page.tsx hardcode color values inline rather than using the CSS custom properties that were migrated in globals.css. The token migration changed the variables; these components bypass the variables entirely.

## Diagnosis: Why Components Are Off-System

### Category A: Hardcoded hex values that bypass the token system (the primary problem)

These components use inline `style={{}}` or Tailwind arbitrary values like `text-[#2563EB]` that directly specify old-palette colors. They never read CSS custom properties, so the globals.css migration had zero effect on them.

| Component | File | Violations | Primary offenders |
|-----------|------|------------|-------------------|
| **RobotimusHeroPanel** | `components/home/robotimus-hero-panel.tsx` | **40** | `#2563EB` (29x), `rgba(37,99,235,...)` (11x), `#10B981` (2x), `#7B2FFF` (1x), gradient backgrounds, box-shadow glows |
| **CertificationSection** | `components/home/certification-section.tsx` | **12** | `#0EA5E9` (8x), `rgba(14,165,233,...)` (3x), `#EF4444` (2x), text-shadows |
| **RaaSExplainer** | `components/home/raas-explainer.tsx` | **5** | `#2563EB` (5x), gradient background, `bg-[#2563EB]/10` tinted containers |
| **ChannelShowcase** | `components/home/channel-showcase.tsx` | **5** | `#2563EB` (2x), `#F59E0B` (1x), uses `card-2080 holo-card channel-glow morphing-border` CSS classes |
| **HeroPills** | `components/home/hero-pills.tsx` | **4** | `#2563EB` hardcoded in JavaScript (line 45, 58, 59, 66) as dynamic style assignments |
| **OpportunityBanner** | `components/home/opportunity-banner.tsx` | **4** | `#60A5FA` (1x), `#2563EB` (1x), gradient background, `btn-glow` class, text-shadow |
| **RecentlyViewed** | `components/home/recently-viewed.tsx` | **4** | `#2563EB` (3x), `rounded-xl` (1x), hover color `text-[#2563EB]` |
| **WhyRobotomated** | `components/home/why-robotomated.tsx` | **3** | `#2563EB` (2x), text-shadow |
| **MarketPulseTicker** | `components/home/market-pulse-ticker.tsx` | **3** | `#060A12` (2x, gradient mask backgrounds), `#2563EB` (1x, dot color) |
| **RecentlyFunded** | `components/home/recently-funded.tsx` | **2** | `#60A5FA` (2x), `text-blue-400` Tailwind class |
| **WorkforceAnnouncement** | `components/home/workforce-announcement.tsx` | **1** | Uses Tailwind token classes (`bg-electric-blue/10`, `border-electric-blue/20`) which resolve to white/4 via tokens -- may render as nearly invisible |

### Category B: Token system gaps

The current token system in globals.css has structural gaps that make it difficult for components to migrate even if they wanted to:

1. **No neutral ramp beyond ink-70.** The DESIGN.md defines `--ink` (#000), `--ink-90` (#0A0A0A), `--ink-80` (#141414), `--ink-70` (#1F1F1F). The globals.css exposes these as `--layer-0` through `--layer-4` and as `--theme-bg`, `--theme-card`, `--theme-border`. But there is no `--ink-60`, `--ink-50`, etc. Components that previously used `rgba(255,255,255,0.06)`, `rgba(255,255,255,0.08)`, `rgba(255,255,255,0.12)` for subtle tints have no token equivalent. They would need to hardcode `rgba()` values even in a fully migrated state.

2. **`--theme-accent-blue` maps to `#FFFFFF`.** This was a deliberate decision (collapse all accent colors to white per DESIGN.md's two-value system). However, it makes `bg-electric-blue`, `text-electric-blue`, `border-electric-blue` render as white -- meaning any component using these tokens for interactive highlights, active states, or category differentiation now shows solid white, which is visually broken for tinted backgrounds and borders. The WorkforceAnnouncement component's `bg-electric-blue/10` renders as `rgba(255,255,255,0.1)` which may be the intended muted look, or may appear invisible.

3. **No semantic tokens for status states.** Components like CertificationSection use `#EF4444` for "required" badges and `#10B981` for "online" indicators. DESIGN.md has `--alert` (#FF3B00) but no success/positive token. The RobotimusHeroPanel uses `#10B981` for "Online" status. There is no token for this.

4. **No token for interactive-element accent.** DESIGN.md says "primary button: background `--paper` on dark" -- meaning white. But components need a way to mark "this is interactive" that is neither white (too strong for subtle borders/tints) nor `--ink-70` (too weak). The old system used `#2563EB` for this. The new system has no equivalent.

5. **`--data` (#00D4FF) exists but is restricted.** DESIGN.md allows this only for "live data, real-time indicators." It is correctly used in status-bar.tsx but cannot serve as a general interactive accent.

## Prioritized Worklist: Top 5 Components to Migrate

Ordered by visual impact on the homepage (how much of the visible page they occupy and how jarring the contrast is with the hero):

### 1. ChannelShowcase (`components/home/channel-showcase.tsx`)
**Why first:** This is the largest section below the hero fold. It renders 5 large cards with `card-2080 holo-card channel-glow morphing-border` classes and uses `#2563EB` as accent. It occupies more vertical space than any other component. Fixing this alone would unify roughly 40% of the below-fold page.
**Violations:** 5 hardcoded colors, 4 old CSS classes (card-2080, holo-card, channel-glow, morphing-border)
**Migration approach:** Replace card wrapper classes with flat `border border-[#1F1F1F] bg-[#0A0A0A]`, replace `#2563EB` accent with `rgba(255,255,255,0.45)`, remove channel accent colors.

### 2. RobotimusHeroPanel (`components/home/robotimus-hero-panel.tsx`)
**Why second:** This is the most visible branded element -- it sits in the right column area (currently orphaned since the hero was restructured but may still render below). It has 40 violations -- the most of any component -- including gradient backgrounds, glow animations, and `#7B2FFF` purple. It is a miniature version of the entire old design system in one component.
**Violations:** 40 hardcoded colors, gradients, glows, shadows, `#7B2FFF` purple, `#10B981` green
**Migration approach:** This is a sacred-cow-adjacent component (Robotimus avatar is precious). Strip all glow/gradient/shadow styling. Keep the chat preview content. Use `--ink-90` for container, `#1F1F1F` for borders, white for text.

### 3. CertificationSection (`components/home/certification-section.tsx`)
**Why third:** This section is revenue-critical and renders prominently on the homepage. The `#0EA5E9` cyan accent and `#EF4444` red badges clash hard with the black/white hero above it.
**Violations:** 12 hardcoded colors, text-shadows, tinted backgrounds
**Migration approach:** Replace cyan accents with white/45 muted labels. Replace red required badges with `--alert` (#FF3B00) token. Remove text-shadows and tinted backgrounds.

### 4. WhyRobotomated (`components/home/why-robotomated.tsx`)
**Why fourth:** Smaller component but uses `#2563EB` for feature icons and hover states, plus text-shadow. These small uses of blue create a "pepper effect" that makes the whole page feel unresolved.
**Violations:** 3 hardcoded colors, text-shadow
**Migration approach:** Replace blue with white/45 for icons, remove text-shadow, remove hover color change.

### 5. OpportunityBanner (`components/home/opportunity-banner.tsx`)
**Why fifth:** Full-width banner section with gradient background, `btn-glow` class, `#60A5FA` text, and text-shadow. It reads as a completely different site from the hero.
**Violations:** 4 hardcoded colors, gradient background, btn-glow class, text-shadow
**Migration approach:** Replace gradient with flat `#000000`, replace blue CTA with ghost button (white border), replace `#60A5FA` text with white, remove all shadows.

## What Works Well

- The hero section is an exact implementation of DESIGN.md's hero pattern: section marker, display headline, single ghost CTA, near-empty composition.
- The stats bar below the hero correctly uses mono font, uppercase labels, hairline separators, and no color.
- The trust statement bar uses correct uppercase/tracking/muted-white styling.
- The trending robots section cards use the new flat styling (2px radius, `#0A0A0A` background, `#1F1F1F` borders, white text, no glow).
- The "03 / THE ECONOMICS" abundance section correctly implements the section-marker pattern and removes all blue accents.
- globals.css token system is correctly structured -- the problem is not the tokens but the components bypassing them.
