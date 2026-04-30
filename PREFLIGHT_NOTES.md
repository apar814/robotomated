# PREFLIGHT NOTES — SpaceX Redesign Sprint
**Started**: April 29, 2026 — afternoon sprint
**Mode**: Hybrid — first 90 minutes monitored by founder, then autonomous
**Branched from**: main at commit 5393886 (post-Workforce Network merge)
**Source of truth**: /DESIGN.md at repo root + /docs/design/robotomated-DESIGN.md

## Founder context (read this first)
The founder (Apar) just finished a brutal cleanup morning where production was discovered to have been broken for 17 days. He is tired of the current aesthetic — "it looks childish." His exact words: "i dont see it... cluttered menu bar... difficult to read words... things not showing up in light mode." He wants the SpaceX-inspired redesign per /DESIGN.md and he wants restraint. The current site is the opposite of what he wants.

The site is now in forced dark mode (light mode is broken — text invisible on white background). The redesign should either rebuild the color system to fix light mode properly OR explicitly commit to dark-only. Founder preference: explicitly dark-only is fine.

## Sacred cows — DO NOT touch without asking
- All Stripe checkout flows (compliance/conversion risk)
- All /api/* routes (no UI to redesign)
- All /admin/* routes (lowest priority, defer to phase 2)
- Database migrations (supabase/migrations/*)
- /lib/ai/claude.ts (Robotimus prompt was just rewritten today, hands off)
- /DESIGN.md and /docs/design/* (source of truth, read-only)

## Workforce Network treatment (special handling)
Pages: /certification/operator-level-1, /certification/welcome, /employers/hire-certified-operators, /admin/workforce-network
These were just shipped this morning and contain conversion-critical copy and form structure.
- DO apply the new design system (typography, color tokens, spacing)
- DO NOT change copy, headlines, form fields, or CTA structure
- DO NOT change Stripe checkout integration or webhook handlers
- DO NOT remove the workforce-announcement strip on homepage

## Known issues to fix as part of the redesign
1. Light mode renders text invisibly. Currently masked by app/providers.tsx removing `enableSystem` flag. Either properly fix light mode contrast OR remove light mode entirely.
2. Homepage 5-card "Platform Channels" section renders with invisible text inside cards. Rebuild from scratch per DESIGN.md section 4 patterns.
3. ROBOTOMATED wordmark at top of homepage barely legible. Rebuild as custom letter-spaced wordmark mimicking SpaceX wordmark proportions.
4. Menu bar (header.tsx) feels cluttered per founder. Apply DESIGN.md section 4 nav rules: UPPERCASE, 12px, tracking 0.12em, plain text only, no dropdown images, hamburger reveals full-screen overlay on mobile.
5. Multiple recent commits referenced "contrast audit", "section labels increased to 13px minimum", "light mode contrast" — these recurring issues indicate the color/contrast system needs a full rebuild, not patches.

## Phased approach — gates required for first three phases
- **Phase 0**: Setup. Save /docs/design/robotomated-DESIGN.md as readable reference if not already present. Audit current state of design tokens. → STOP and present audit to founder.
- **Phase 1**: Migration map (every current token → new token, every component affected, scope estimate). → STOP and founder approves before proceeding.
- **Phase 2**: Token migration foundation only — tailwind.config.ts, globals.css, font setup. Do NOT yet touch components. → STOP, founder verifies homepage doesn't completely break.
- **Phase 3**: Component refactor (atomic → molecular). AUTONOMOUS from this point.
- **Phase 4**: Page-level application in priority order below. Autonomous.
- **Phase 5**: Mascot treatment proposal only (BOLT, Robotimus). Document, do not execute.
- **Phase 6**: QA — visual regression captures, Lighthouse check, build verification.

## Page priority for Phase 4 (top = ship first)
1. Homepage / (highest traffic, founder hates current state most)
2. /humanoid-robots (highest-value SEO landing page)
3. /explore (category index)
4. /explore/[category]/[slug] (robot detail pages — affiliate revenue)
5. /manufacturers (manufacturer directory)
6. /manufacturers/[slug] (manufacturer pages)
7. /intelligence (news feed)
8. /certification/operator-level-1 (revenue page — design only, not copy)
9. /employers/hire-certified-operators (revenue page — design only, not copy)
10. /advisor (Robotimus chat — careful treatment, the chat itself is precious)

## Pages NOT to redesign in this sprint
- All /admin/* routes (defer to phase 2 sprint)
- All /api/* (no UI)
- /workforce-network admin page (admin route)
- Any /learn/* pages (222+ pages, defer to phase 2)

## Brand voice notes (from DESIGN.md)
- "Trust the work to carry the weight"
- Aggressive, almost uncomfortable whitespace
- ALL CAPS METADATA LABELS for all small structured text
- Numbered section markers (e.g., 01 / HUMANOIDS, 02 / QUADRUPEDS)
- Monospace for technical specs only (RoboScore numbers, prices, payload, salary)
- Pure black (#000000) and pure white (#FFFFFF) — no other backgrounds
- Restricted accents: #FF3B00 (alert only — recalls, errors), #00D4FF (live data only — timestamps, real-time indicators)
- FORBIDDEN: gradients, drop shadows, purple, glassmorphism, decorative patterns, dot grids, background textures
- FORBIDDEN copy words: revolutionary, groundbreaking, game-changing, innovative, exciting, leverage, supercharge, seamless

## Font discipline
- Display + Headlines: Space Grotesk (already loaded — KEEP)
- Body: Inter (load if not present — note: Inter may not be in current font stack)
- Mono (technical specs only): JetBrains Mono (already loaded — KEEP)
- DROP from font loading: Orbitron, Chakra Petch (currently loaded but not aligned with SpaceX aesthetic)
- Weight discipline: 400 and 500 only for 95% of UI. 700 only for body emphasis. NEVER thin (300), extra-bold (800), or black (900).

## Definition of done for this sprint
- All 6 phases completed OR explicit stopping point with handoff doc
- Top 5 priority pages re-skinned and visually verified by founder
- Token system fully migrated, old token aliases preserved for compatibility during transition
- Visual regression: before/after screenshots captured for top 8 pages at 375px AND 1440px
- npm run build passes locally with zero errors
- Vercel preview deployment passes (push to feat/spacex-redesign branch and watch the preview)
- No sacred cow files modified
- AFTERNOON_REPORT.md written summarizing changes, decisions, blockers, and recommended review order

## Stop conditions (in priority order)
1. Sacred cow accidentally touched → revert immediately, document in BLOCKERS.md, alert founder
2. npm run build breaks and not fixed within 30 minutes → stop, document, alert founder
3. Phase 1 audit reveals scope larger than 80 components → stop after Phase 1, propose 2-pass plan
4. Founder unavailable for >2 hours during monitored window (Phase 0-2) → pause and wait
5. 5 hours elapsed total → wrap up cleanly, write AFTERNOON_REPORT.md, stop
6. 3 unrecoverable blockers in a row → stop and report

## Logging requirements
- DESIGN_OVERNIGHT_LOG.md: timestamped entry per meaningful unit of work
- DESIGN_DECISIONS.md: every design choice that diverged from DESIGN.md, with rationale
- BLOCKERS.md: anything that stopped progress
- AFTERNOON_REPORT.md: final summary on completion or stop

## Working agreement with founder
- Phase 0, 1, 2: STOP after each phase, present results, wait for explicit approval
- Phase 3+: autonomous, but commit after every meaningful unit (15+ commits expected) so progress is visible
- If unsure whether something is a sacred cow violation → ask, don't assume
- If a design decision feels like it conflicts with DESIGN.md → favor DESIGN.md, document the tension in DECISIONS.md
- The founder is more interested in restraint than completeness. Half the redesign with proper SpaceX feel beats all the redesign with compromises.