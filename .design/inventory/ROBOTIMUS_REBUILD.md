# RobotimusHeroPanel — Rebuild Inventory

**Rebuilt:** 2026-04-29 on `feat/spacex-redesign`
**File:** `components/home/robotimus-hero-panel.tsx`
**Status:** Orphaned — no page renders this component.

## What changed

Full rebuild from scratch. Preserved: conversation rotation timing, route to `/advisor` on CTA, suggestion chip click handlers, prop interface, export name. Discarded: gradient panels, glow animations, glassmorphism, decorative brackets, ticker strip, rounded-2xl cards, textShadow, all 40 hardcoded color violations.

471 lines → 248 lines (53% of original). All colors use locked token system from `globals.css`.

## Placement plan

Place on `/advisor` page when built, or delete by 2026-05-29 if `/advisor` is not scheduled.

## Before/after screenshots

- Before (original, old palette): `.design/homepage-review/before-robotimus.png`
- After (rebuilt, token-only): `.design/homepage-review/after-robotimus.png`
