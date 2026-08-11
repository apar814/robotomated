import { describe, it, expect } from "vitest";
import {
  stratifiedSelect,
  makeOptionOrders,
  permuteOptions,
  scoreSubmission,
  fisherYates,
  type PoolQuestion,
  type ScorableQuestion,
} from "./exam-engine";

/** Deterministic PRNG so tests are reproducible. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build a pool mirroring the v2 bank composition: 25/20/20/20/15, diff mix per domain. */
function buildBankLikePool(): PoolQuestion[] {
  const spec: [string, number][] = [
    ["SAFETY_FUNDAMENTALS", 25],
    ["ROBOT_BASICS", 20],
    ["DEPLOYMENT_FUNDAMENTALS", 20],
    ["TROUBLESHOOTING_L1", 20],
    ["REGULATIONS_ETHICS", 15],
  ];
  const pool: PoolQuestion[] = [];
  for (const [domain, n] of spec) {
    for (let i = 0; i < n; i++) {
      // roughly 30/45/25 difficulty mix within each domain
      const difficulty = i % 4 === 0 ? 1 : i % 4 === 3 ? 3 : 2;
      pool.push({
        id: `${domain}-${i}`,
        domain_code: domain,
        difficulty,
        options: ["a", "b", "c", "d"],
      });
    }
  }
  return pool;
}

describe("stratifiedSelect — quota satisfaction", () => {
  const pool = buildBankLikePool();

  it("selects exactly the requested count with proportional domain quotas", () => {
    const rng = mulberry32(42);
    const ids = stratifiedSelect(pool, 50, new Set(), rng);
    expect(ids).toHaveLength(50);
    expect(new Set(ids).size).toBe(50); // no duplicates

    const byDomain: Record<string, number> = {};
    for (const id of ids) {
      const d = pool.find((q) => q.id === id)!.domain_code!;
      byDomain[d] = (byDomain[d] || 0) + 1;
    }
    // 25/20/20/20/15 of 100 scaled to 50 => 12-13 / 10 / 10 / 10 / 7-8
    expect(byDomain.SAFETY_FUNDAMENTALS).toBeGreaterThanOrEqual(12);
    expect(byDomain.SAFETY_FUNDAMENTALS).toBeLessThanOrEqual(13);
    expect(byDomain.ROBOT_BASICS).toBe(10);
    expect(byDomain.DEPLOYMENT_FUNDAMENTALS).toBe(10);
    expect(byDomain.TROUBLESHOOTING_L1).toBe(10);
    expect(byDomain.REGULATIONS_ETHICS).toBeGreaterThanOrEqual(7);
    expect(byDomain.REGULATIONS_ETHICS).toBeLessThanOrEqual(8);
  });

  it("difficulty mix tracks the pool distribution within tolerance", () => {
    const rng = mulberry32(7);
    const ids = stratifiedSelect(pool, 50, new Set(), rng);
    const byDiff: Record<number, number> = {};
    for (const id of ids) {
      const q = pool.find((p) => p.id === id)!;
      byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
    }
    // pool is ~25% L1 / 50% L2 / 25% L3; selection should track it closely
    expect(byDiff[1]).toBeGreaterThanOrEqual(10);
    expect(byDiff[1]).toBeLessThanOrEqual(16);
    expect(byDiff[2]).toBeGreaterThanOrEqual(20);
    expect(byDiff[2]).toBeLessThanOrEqual(28);
    expect(byDiff[3]).toBeGreaterThanOrEqual(10);
    expect(byDiff[3]).toBeLessThanOrEqual(16);
  });

  it("different seeds produce different selections (randomized per attempt)", () => {
    const a = stratifiedSelect(pool, 50, new Set(), mulberry32(1)).join(",");
    const b = stratifiedSelect(pool, 50, new Set(), mulberry32(2)).join(",");
    expect(a).not.toBe(b);
  });

  it("falls back gracefully when the pool lacks domain codes (legacy rows)", () => {
    const legacy: PoolQuestion[] = Array.from({ length: 20 }, (_, i) => ({
      id: `L${i}`,
      domain_code: null,
      difficulty: 2,
      options: ["a", "b", "c", "d"],
    }));
    const ids = stratifiedSelect(legacy, 50, new Set(), mulberry32(3));
    expect(ids).toHaveLength(20); // takes the whole pool, never throws
  });
});

describe("stratifiedSelect — retake bias", () => {
  const pool = buildBankLikePool();

  it("a retake avoids previously seen questions as far as quotas allow", () => {
    const rng1 = mulberry32(11);
    const first = stratifiedSelect(pool, 50, new Set(), rng1);
    const seen = new Set(first);
    const second = stratifiedSelect(pool, 50, seen, mulberry32(12));
    const overlap = second.filter((id) => seen.has(id)).length;
    // 100-question pool, 50 seen: a perfect retake reuses 0. Strata make a
    // small overlap possible, but it must be near-minimal.
    expect(overlap).toBeLessThanOrEqual(5);
  });

  it("when nearly all questions are seen, still fills the full count", () => {
    const seen = new Set(pool.slice(0, 95).map((q) => q.id));
    const ids = stratifiedSelect(pool, 50, seen, mulberry32(13));
    expect(ids).toHaveLength(50);
  });
});

describe("option permutation scoring", () => {
  const q = (id: string, type: string, correct: number[]): ScorableQuestion => ({
    id,
    question_type: type,
    correct_answers: correct,
    correct_answer: null,
  });

  it("permuteOptions serves options in permuted order; identity without perm", () => {
    expect(permuteOptions(["a", "b", "c", "d"], [2, 0, 3, 1])).toEqual(["c", "a", "d", "b"]);
    expect(permuteOptions(["a", "b"], undefined)).toEqual(["a", "b"]);
    expect(permuteOptions(["a", "b", "c"], [1, 0])).toEqual(["a", "b", "c"]); // length mismatch -> identity
  });

  it("remaps served single-answer indices to canonical before comparing", () => {
    // perm[served]=canonical: served index 1 is canonical option 0
    const orders = { q1: [2, 0, 3, 1] };
    const questions = [q("q1", "multiple_choice", [0])];
    expect(scoreSubmission(questions, { q1: 1 }, orders).correctCount).toBe(1);
    expect(scoreSubmission(questions, { q1: 0 }, orders).correctCount).toBe(0); // canonical 2
  });

  it("round-trips: answering the served position of the correct option always scores", () => {
    const rng = mulberry32(99);
    const options = ["w", "x", "y", "z"];
    for (let canonical = 0; canonical < 4; canonical++) {
      const orders = makeOptionOrders([{ id: "q1", options }], rng);
      const servedIndex = orders.q1.indexOf(canonical);
      const result = scoreSubmission(
        [q("q1", "multiple_choice", [canonical])],
        { q1: servedIndex },
        orders
      );
      expect(result.correctCount).toBe(1);
    }
  });

  it("multi_select requires an exact set match — no partial credit", () => {
    const orders = { m1: [3, 1, 4, 0, 2] }; // 5 options
    const questions = [q("m1", "multi_select", [0, 1, 4])];
    // canonical {0,1,4} => served positions: canonical0->served3, canonical1->served1, canonical4->served2
    expect(scoreSubmission(questions, { m1: [3, 1, 2] }, orders).correctCount).toBe(1);
    expect(scoreSubmission(questions, { m1: [3, 1] }, orders).correctCount).toBe(0); // missing one
    expect(scoreSubmission(questions, { m1: [3, 1, 2, 0] }, orders).correctCount).toBe(0); // extra
    expect(scoreSubmission(questions, { m1: [] }, orders).correctCount).toBe(0);
  });

  it("legacy rows score via correct_answer fallback with identity permutation", () => {
    const legacy: ScorableQuestion = {
      id: "old1",
      question_type: "multiple_choice",
      correct_answers: null,
      correct_answer: 2,
    };
    expect(scoreSubmission([legacy], { old1: 2 }, {}).correctCount).toBe(1);
    expect(scoreSubmission([legacy], { old1: 1 }, {}).correctCount).toBe(0);
  });

  it("unanswered questions score as incorrect", () => {
    const questions = [q("q1", "multiple_choice", [0]), q("m1", "multi_select", [0, 1])];
    const r = scoreSubmission(questions, {}, {});
    expect(r.correctCount).toBe(0);
    expect(r.total).toBe(2);
  });
});

describe("fisherYates", () => {
  it("returns a permutation of the input without mutating it", () => {
    const input = [1, 2, 3, 4, 5];
    const out = fisherYates(input, mulberry32(5));
    expect(out.slice().sort()).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});
