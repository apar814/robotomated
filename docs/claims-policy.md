# Claims Policy

**Effective:** 2026-08-03
**Applies to:** every user-facing surface — pages, components, exam content,
email templates, OG images, SVG mocks.

## The rule

Every user-facing **statistic, percentage, dollar figure, testimonial, or case
study** must satisfy exactly one of:

1. **Sourced** — the value lives in (or mirrors an entry in)
   `lib/data/market-claims.ts` or an equivalent data module with a `source`
   field, and the source is a real, checkable attribution (study, dataset,
   named publication). `TODO: unverified` sources may not be presented as
   fact — no year, no causal framing, no point-estimate confidence.
2. **Database-backed** — computed live from our own tables (robot counts,
   RoboScores, prices). These are self-sourcing.
3. **Product fact** — a property of the platform itself (6 certification
   levels, exam length, pass score). Derive from config
   (`lib/certifications.ts`), never hardcode a copy.
4. **Visibly labeled as illustrative** — mock/sample/example content must
   carry an explicit label **in the rendered UI** ("SAMPLE", "Illustrative
   example"), not just a code comment.

Anything that satisfies none of these gets removed, not softened.

## Specific prohibitions

- **No unattributed testimonials.** A quote from an unnamed company is
  indistinguishable from fabrication. Real name + real company or nothing.
- **No causal upgrades.** A source that measured X may not be quoted as
  evidence of Y (e.g., automation incident data presented as certification
  incident data).
- **No invented futures.** Adoption-curve percentages for 2027/2028/2030 are
  predictions; they may only appear with a named source making the prediction.
- **No exam content that teaches our own marketing.** Certification questions
  must test verifiable external knowledge, never platform claims.
- **Clinical/medical outcome claims are highest-risk.** Never without
  peer-reviewed sourcing. When in doubt, describe capability (what the robot
  does, FDA status) instead of outcomes.

## Process

- Retired claims are recorded in the RETIRED block of
  `lib/data/market-claims.ts` with the reason — check it before adding any
  stat, so dead claims don't reincarnate.
- New stat in a PR → reviewer asks "which of the four buckets?" If the answer
  takes more than a sentence, it's bucket-none.
- The rationale is CLAUDE.md's own rule: editorial independence is the moat.
  A reader who catches one invented number stops believing the RoboScores.
