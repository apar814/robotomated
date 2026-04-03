import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Exam Results -- RCO Certification",
  description: "View your RCO certification exam results.",
};

/* Placeholder result data - will be fetched from DB when session exists */
const MOCK_RESULT = {
  passed: true,
  score: 82,
  totalQuestions: 50,
  correctAnswers: 41,
  certificationName: "RCO Level 1: Foundation",
  credentialId: "RCO-2026-00142",
  issuedAt: "2026-04-03",
  expiresAt: "2028-04-03",
  breakdown: [
    { category: "Robot Safety Fundamentals", correct: 12, total: 14, percentage: 86 },
    { category: "Robotics Terminology", correct: 10, total: 12, percentage: 83 },
    { category: "Basic Operations", correct: 11, total: 14, percentage: 79 },
    { category: "Maintenance Awareness", correct: 8, total: 10, percentage: 80 },
  ],
  tabSwitches: 0,
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  // TODO: Fetch actual result from DB by sessionId
  // const supabase = createServerClient();
  // const { data: session } = await supabase
  //   .from("rco_exam_sessions")
  //   .select("*")
  //   .eq("id", sessionId)
  //   .single();

  const result = MOCK_RESULT;

  if (!result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Results Not Found</h1>
          <p className="mt-4 text-muted">
            This exam session does not exist or results are not yet available.
          </p>
          <Link
            href="/certify"
            className="mt-6 inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue/90"
          >
            Back to Certifications
          </Link>
        </div>
      </div>
    );
  }

  if (result.passed) {
    return (
      <div>
        {/* Pass: Celebration */}
        <section className="border-b border-border px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green/10">
              <span className="font-display text-4xl font-bold text-green">
                {result.score}%
              </span>
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
              Certification <span className="text-green">Earned</span>
            </h1>
            <p className="mt-4 text-muted">
              Congratulations. You have successfully passed the{" "}
              <span className="text-white">{result.certificationName}</span>{" "}
              exam.
            </p>
          </div>
        </section>

        {/* Credential details */}
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-display text-lg font-bold text-white">
                  Your Credential
                </h2>
                <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-semibold text-green">
                  Active
                </span>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Credential ID</dt>
                  <dd className="font-mono text-white">{result.credentialId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Certification</dt>
                  <dd className="text-white">{result.certificationName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Score</dt>
                  <dd className="text-white">
                    {result.correctAnswers}/{result.totalQuestions} ({result.score}%)
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Issued</dt>
                  <dd className="text-white">{result.issuedAt}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Expires</dt>
                  <dd className="text-white">{result.expiresAt}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Verification URL</dt>
                  <dd className="text-blue">
                    <Link href={`/verify/${result.credentialId}`}>
                      robotomated.com/verify/{result.credentialId}
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Score breakdown */}
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-xl font-bold">Score Breakdown</h2>
            <div className="mt-6 space-y-4">
              {result.breakdown.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{cat.category}</span>
                    <span className="font-medium text-white">
                      {cat.correct}/{cat.total} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-border">
                    <div
                      className={`h-2 rounded-full ${
                        cat.percentage >= 75 ? "bg-green" : "bg-red-400"
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="px-4 py-12">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            <button className="flex-1 rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90">
              Download Certificate (PDF)
            </button>
            <button className="flex-1 rounded-lg bg-[#0077B5] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0077B5]/90">
              Share on LinkedIn
            </button>
            <Link
              href="/certify"
              className="flex-1 rounded-lg border border-border px-6 py-3 text-center text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Back to Certifications
            </Link>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- Fail result ---------- */
  return (
    <div>
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
            <span className="font-display text-4xl font-bold text-red-400">
              {result.score}%
            </span>
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            Not quite there yet.
          </h1>
          <p className="mt-4 text-muted">
            You scored {result.correctAnswers}/{result.totalQuestions} on the{" "}
            <span className="text-white">{result.certificationName}</span>{" "}
            exam. A score of 75% is required to pass.
          </p>
        </div>
      </section>

      {/* Score breakdown */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-xl font-bold">
            Areas to Review
          </h2>
          <p className="mt-2 text-sm text-muted">
            Focus on the categories where you scored below the passing threshold.
          </p>
          <div className="mt-6 space-y-4">
            {result.breakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{cat.category}</span>
                  <span
                    className={`font-medium ${
                      cat.percentage >= 75 ? "text-green" : "text-red-400"
                    }`}
                  >
                    {cat.correct}/{cat.total} ({cat.percentage}%)
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-border">
                  <div
                    className={`h-2 rounded-full ${
                      cat.percentage >= 75 ? "bg-green" : "bg-red-400"
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retake CTA */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-xl font-bold">Ready to try again?</h2>
          <p className="mt-2 text-sm text-muted">
            You can retake the exam after a 48-hour waiting period.
            Review the curriculum and study materials before your next attempt.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/certify"
              className="rounded-lg bg-blue px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
            >
              Retake Exam
            </Link>
            <Link
              href="/learn"
              className="rounded-lg border border-border px-8 py-3 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Study Materials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
