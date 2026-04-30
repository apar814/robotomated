# Design Decisions

## D1: Dark-only mode
DESIGN.md says "Dual. Dark mode is default." but PREFLIGHT_NOTES says "explicitly dark-only is fine" and the founder forced dark mode due to broken light mode. Decision: dark-only for this sprint. Light mode vars will be set to reasonable values but not actively maintained.

## D2: Token aliasing strategy
Rather than renaming 110 component files, I will rewrite the CSS custom properties so existing Tailwind class names (bg-obsidian, text-text-primary, etc.) resolve to DESIGN.md values. This means zero component file changes for basic color migration.

## D3: Stripping decorative CSS
DESIGN.md forbids: gradients, shadows, glassmorphism, dot grids, scanlines, glow effects, HUD corners. I will remove or neutralize all of these from globals.css. Components using them will simply stop showing the effect.

## D4: Inter font loading
DESIGN.md specifies Inter for body text. I will add Inter via next/font/google. Space Grotesk stays for display/headlines. JetBrains Mono stays for technical specs.

## D5: Border radius
DESIGN.md: 2px for buttons/badges/cards. Current: 6-16px. Will update via CSS custom property and targeted component edits.
