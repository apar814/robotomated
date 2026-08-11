/**
 * Pure exam-engine functions: stratified question selection, per-session
 * option permutation, and scoring. No I/O — everything is injectable and
 * unit-testable (see lib/certify/__tests__/exam-engine.test.ts).
 */

export type Rng = () => number;

export interface PoolQuestion {
  id: string;
  domain_code: string | null;
  difficulty: number;
  options: unknown[];
}

export interface ScorableQuestion {
  id: string;
  question_type: string;
  correct_answers: number[] | null;
  correct_answer: number | null;
}

/** answers as stored on the session: served option indices */
export type AnswerMap = Record<string, number | number[]>;
/** question_id -> perm where perm[servedIndex] = canonical option index */
export type OptionOrders = Record<string, number[]>;

export function fisherYates<T>(items: T[], rng: Rng): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Largest-remainder apportionment of `total` seats by weight. */
function apportion(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 0);
  const exact = weights.map((w) => (w / sum) * total);
  const floors = exact.map(Math.floor);
  let remaining = total - floors.reduce((a, b) => a + b, 0);
  const order = exact
    .map((e, i) => ({ i, frac: e - floors[i] }))
    // ties break toward the larger stratum so the biggest domain gets the
    // extra seat (SF 12.5 vs RE 7.5 -> 13/7, not 12/8)
    .sort((a, b) => b.frac - a.frac || weights[b.i] - weights[a.i]);
  for (const { i } of order) {
    if (remaining <= 0) break;
    if (weights[i] > floors[i]) {
      floors[i]++;
      remaining--;
    }
  }
  return floors;
}

/**
 * Stratified selection: domain quotas proportional to pool composition,
 * difficulty quotas proportional within each domain, Fisher-Yates within
 * each stratum, and unseen-first ordering so retakes are biased toward
 * questions the candidate hasn't encountered.
 *
 * Falls back to a flat unseen-first shuffle when the pool lacks domain
 * codes (legacy rows) or is smaller than the requested count.
 */
export function stratifiedSelect(
  pool: PoolQuestion[],
  count: number,
  seenIds: Set<string> = new Set(),
  rng: Rng = Math.random
): string[] {
  const flatFallback = () => {
    const unseen = fisherYates(pool.filter((q) => !seenIds.has(q.id)), rng);
    const seen = fisherYates(pool.filter((q) => seenIds.has(q.id)), rng);
    return [...unseen, ...seen].slice(0, Math.min(count, pool.length)).map((q) => q.id);
  };

  if (pool.length <= count) return flatFallback();
  if (pool.some((q) => !q.domain_code)) return flatFallback();

  const domains = [...new Set(pool.map((q) => q.domain_code as string))].sort();
  const domainPools = domains.map((d) => pool.filter((q) => q.domain_code === d));
  const domainQuotas = apportion(domainPools.map((p) => p.length), count);

  const picked: string[] = [];
  const leftovers: PoolQuestion[] = [];

  domains.forEach((_, di) => {
    const dPool = domainPools[di];
    const quota = domainQuotas[di];
    const diffs = [...new Set(dPool.map((q) => q.difficulty))].sort();
    const diffPools = diffs.map((lv) => dPool.filter((q) => q.difficulty === lv));
    const diffQuotas = apportion(diffPools.map((p) => p.length), quota);

    let taken = 0;
    const domainLeftovers: PoolQuestion[] = [];
    diffs.forEach((_, li) => {
      const stratum = diffPools[li];
      const ordered = [
        ...fisherYates(stratum.filter((q) => !seenIds.has(q.id)), rng),
        ...fisherYates(stratum.filter((q) => seenIds.has(q.id)), rng),
      ];
      const take = Math.min(diffQuotas[li], ordered.length);
      ordered.slice(0, take).forEach((q) => picked.push(q.id));
      taken += take;
      domainLeftovers.push(...ordered.slice(take));
    });
    // backfill within the domain if a difficulty stratum ran short
    const ordered = [
      ...fisherYates(domainLeftovers.filter((q) => !seenIds.has(q.id)), rng),
      ...fisherYates(domainLeftovers.filter((q) => seenIds.has(q.id)), rng),
    ];
    for (const q of ordered) {
      if (taken >= quota) { leftovers.push(q); continue; }
      picked.push(q.id);
      taken++;
    }
  });

  // global backfill if domains ran short (shouldn't happen with a full bank)
  if (picked.length < count) {
    const pickedSet = new Set(picked);
    const rest = [
      ...fisherYates(leftovers.filter((q) => !pickedSet.has(q.id) && !seenIds.has(q.id)), rng),
      ...fisherYates(leftovers.filter((q) => !pickedSet.has(q.id) && seenIds.has(q.id)), rng),
    ];
    for (const q of rest) {
      if (picked.length >= count) break;
      picked.push(q.id);
    }
  }

  // presentation order is itself shuffled so domains don't appear in blocks
  return fisherYates(picked, rng);
}

/** Generate a per-question option permutation: perm[servedIndex] = canonicalIndex. */
export function makeOptionOrders(
  questions: Pick<PoolQuestion, "id" | "options">[],
  rng: Rng = Math.random
): OptionOrders {
  const orders: OptionOrders = {};
  for (const q of questions) {
    orders[q.id] = fisherYates(q.options.map((_, i) => i), rng);
  }
  return orders;
}

/** Apply a permutation to canonical options for serving. Identity if no perm. */
export function permuteOptions<T>(options: T[], perm: number[] | undefined): T[] {
  if (!perm || perm.length !== options.length) return options;
  return perm.map((canonicalIdx) => options[canonicalIdx]);
}

function canonicalCorrect(q: ScorableQuestion): number[] {
  if (q.correct_answers && q.correct_answers.length > 0) return q.correct_answers;
  if (q.correct_answer !== null && q.correct_answer !== undefined) return [q.correct_answer];
  return [];
}

/**
 * Score a submission. Served indices are remapped to canonical indices
 * through the session's option permutation before comparison.
 * multi_select requires an exact set match — no partial credit.
 */
export function scoreSubmission(
  questions: ScorableQuestion[],
  answers: AnswerMap,
  optionOrders: OptionOrders
): { correctCount: number; total: number; perQuestion: Record<string, boolean> } {
  let correctCount = 0;
  const perQuestion: Record<string, boolean> = {};

  for (const q of questions) {
    const correct = canonicalCorrect(q);
    const perm = optionOrders[q.id];
    const raw = answers[q.id];
    const toCanonical = (served: number): number =>
      perm && perm.length > 0 && served >= 0 && served < perm.length ? perm[served] : served;

    let isCorrect = false;
    if (q.question_type === "multi_select") {
      const served = Array.isArray(raw) ? raw : raw !== undefined ? [raw as number] : [];
      const canonical = new Set(served.map(toCanonical));
      isCorrect =
        canonical.size === correct.length && correct.every((c) => canonical.has(c));
    } else {
      const served = Array.isArray(raw) ? raw[0] : raw;
      isCorrect =
        typeof served === "number" && correct.length === 1 && toCanonical(served) === correct[0];
    }
    perQuestion[q.id] = isCorrect;
    if (isCorrect) correctCount++;
  }

  return { correctCount, total: questions.length, perQuestion };
}
