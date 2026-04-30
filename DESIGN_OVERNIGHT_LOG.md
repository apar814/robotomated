# Design Sprint Log

## Phase 1: Audit
- globals.css: 1270 lines, layers of old systems (obsidian, glass, 2080, HUD, sci-fi)
- 163 components total, 110 use old color tokens
- FORBIDDEN by DESIGN.md found in CSS: scanline overlay, gradient-text, bg-mesh, bg-dots, bg-grid, cursor-glow, hud-corners, hud-label, glow-pulse, card-glow, noise-overlay, btn-glow, stat-glow, shimmer-text, hero-accent gradient, morphing-border, holo-card, channel-glow, btn-scan, hero-grid animated
- Fonts to drop: Orbitron (--font-brand), Chakra Petch (--font-ui)
- Font to add: Inter (body)
- Strategy: rewrite CSS vars at root level so all Tailwind classes map to new values. Strip forbidden decorative CSS. Component edits for radius/uppercase/spacing.
- Scope: token migration is ~1 file (globals.css). Component cleanup is 20-30 files for the top 5 pages.
- UNDER 80 component threshold for page-level work. Proceeding.

## Phase 2: Token Migration
- Starting globals.css rewrite
