# News Entity Extraction — Design

**Status:** Design only. No migrations, no deploy.
**Date:** 2026-08-03
**Goal:** Every news card can render "Related: [Robot] — RoboScore X" linking
into the database, by extracting manufacturer and robot-model mentions from
each `news_item` and matching them against the `robots` and `manufacturers`
tables.

---

## 1. Schema

One join table covers both entity types. A single polymorphic table (entity_type
+ entity_id) was rejected: it can't carry real foreign keys, and FK integrity is
the point — a match row must die with the robot/manufacturer it references.
Two nullable FKs with a CHECK constraint keep referential integrity and stay
queryable with plain joins.

```sql
-- Draft only — becomes migration 041 when approved
CREATE TABLE news_item_entities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_item_id    UUID NOT NULL REFERENCES news_items(id) ON DELETE CASCADE,
  robot_id        UUID REFERENCES robots(id) ON DELETE CASCADE,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,

  -- exactly one entity per row
  CHECK (num_nonnulls(robot_id, manufacturer_id) = 1),

  matched_text    TEXT NOT NULL,          -- the literal span from the article, for audit/debug
  match_method    TEXT NOT NULL,          -- 'exact' | 'alias' | 'fuzzy' | 'llm'
  confidence      REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  extracted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (news_item_id, robot_id),
  UNIQUE (news_item_id, manufacturer_id)
);

CREATE INDEX idx_nie_news_item ON news_item_entities(news_item_id);
CREATE INDEX idx_nie_robot ON news_item_entities(robot_id) WHERE robot_id IS NOT NULL;
CREATE INDEX idx_nie_manufacturer ON news_item_entities(manufacturer_id) WHERE manufacturer_id IS NOT NULL;
```

Notes:
- `ON DELETE CASCADE` both directions: deleting a news item or a robot cleans up
  its matches. No orphaned "Related" chips.
- `matched_text` + `match_method` make every match explainable — same principle
  as RoboScore. If a card shows a wrong chip, one query shows why it matched.
- The two partial `UNIQUE` constraints make re-runs idempotent (upsert on
  conflict do update confidence).

### Alias support (needed for real-world matching)

Robot names in news rarely match `robots.name` exactly ("Spot" vs "Spot
Enterprise"; "G1" vs "Unitree G1"; "Digit" appears without "Agility"). Rather
than alter the robots table, add a small alias table owned by this feature:

```sql
CREATE TABLE robot_aliases (
  robot_id UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  alias    TEXT NOT NULL,
  PRIMARY KEY (robot_id, alias)
);
```

Seeded initially from `robots.name` + `robots.model_number`, then curated.
Manufacturer aliases can start as a code-side map (e.g. "UR" → Universal
Robots, "BD" → Boston Dynamics) — promote to a table only if it grows.

---

## 2. Pipeline placement

A post-ingestion step, not inline with fetch:

```
fetch feeds → summarize/categorize → insert news_items   (existing, unchanged)
                                          ↓
                        extract-entities (new, batched)
                        reads news_items WHERE id NOT IN (SELECT news_item_id FROM news_item_entities)
                          AND created_at > now() - interval '7 days'
```

- Runs after the daily aggregation (either at the end of the cron route or as a
  separate cron 30 min later). Batched, so a backfill over the existing ~1,000
  rows is the same code path as the daily increment.
- Failure isolation: extraction failing must never block ingestion. News cards
  render fine with zero chips.

---

## 3. Matching strategy (tiered, cheap-first)

**Tier 1 — deterministic dictionary match (free, runs always).**
Load `manufacturers.name` + aliases and `robot_aliases` into memory (~1–2k
strings). Scan `title + summary` with word-boundary, case-insensitive matching.
- Manufacturer hit in title → confidence 0.95, method `exact`
- Manufacturer hit in summary only → 0.85
- Robot alias hit + its manufacturer also mentioned → 0.95
- Robot alias hit alone, alias is distinctive (≥2 tokens or unique like
  "Optimus") → 0.8
- Robot alias hit alone, alias is a common word ("Spot", "Digit", "Stretch",
  "Apollo", "G1") → **do not match at Tier 1.** These are the false-positive
  factory; they go to Tier 3.

**Tier 2 — fuzzy match (free, runs always).**
Normalized comparison (lowercase, strip punctuation/hyphens): catches "UR10e"
vs "UR-10e", "Go2" vs "Go 2". Levenshtein ≤ 1 on tokens ≥ 5 chars.
Confidence 0.7, method `fuzzy`.

**Tier 3 — LLM disambiguation (paid, runs only when needed).**
Only for ambiguous candidates flagged by Tier 1 (common-word aliases) and
items where Tiers 1–2 found a manufacturer but no robot. One Haiku call per
news item (not per candidate), prompt includes the title/summary and the short
candidate list, returns which candidates are genuinely referenced. Confidence
0.75 for accepts, method `llm`.
- Budget: bounded by the daily item cap (~50 items/day post-expansion → worst
  case ~50 Haiku calls/day, well under a dollar).
- The LLM never invents entities — it only confirms/rejects candidates that
  already exist in our tables. This keeps the "never recommend robots not
  verified in the database" rule structurally enforced.

---

## 4. Confidence handling

Stored as 0–1 `REAL`; consumed with two thresholds:

| Range | Behavior |
|---|---|
| ≥ 0.8 | Render "Related" chip on news cards |
| 0.5 – 0.8 | Stored, not rendered; visible in an admin review view (`/admin/content`) where a human can confirm (bumps to 1.0) or delete |
| < 0.5 | Not stored |

Rationale: a wrong "Related: Spot — RoboScore 84" chip on a news card about a
dog is an editorial-credibility bug, not a cosmetic one. Precision beats recall
here; unmatched items cost nothing.

Re-runs: extraction is idempotent per (news_item, entity). Manual confirmations
(confidence = 1.0, or a future `reviewed_at` column) are never overwritten by
automated re-runs — upsert only raises confidence, never lowers it past a
human's decision.

---

## 5. Rendering contract

Query for a news card (used by NewsHub, /news, intelligence page):

```sql
SELECT r.slug, r.name, r.robo_score
FROM news_item_entities nie
JOIN robots r ON r.id = nie.robot_id
WHERE nie.news_item_id = $1 AND nie.confidence >= 0.8
ORDER BY nie.confidence DESC
LIMIT 3;
```

Card renders up to 3 chips: `Related: Unitree G1 — RoboScore 87` →
`/explore/[category]/[slug]`. Manufacturer-only matches link to
`/manufacturers/[slug]` without a score (RoboScore is per-robot).

---

## 6. Open questions (decide before building)

1. **Backfill scope** — all ~1,000 existing rows or only last 90 days? (Cost is
   Tier-3 only; Tier 1–2 are free either way.)
2. **arXiv items** — papers mention robots generically ("a UR5 testbed").
   Suggest running extraction on them but with the render threshold raised to
   manufacturer-in-title only, or excluding `source = 'arXiv cs.RO'` from chips.
3. **Alias curation ownership** — seed script + admin UI, or flat file in repo?
   Flat file (`lib/news/entity-aliases.ts`) is more reviewable in PRs.
