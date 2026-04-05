"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

/* ---------- Types ---------- */

interface ExamQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  difficulty: number;
  category: string;
  time_limit: number | null;
  media_url: string | null;
}

interface ExamSession {
  id: string;
  certification_id: string;
  status: string;
  started_at: string;
  expires_at: string;
  answers: Record<string, number>;
  tab_switch_count: number;
}

interface ExamInterfaceProps {
  sessionId: string;
  sessionToken: string;
}

/* ---------- Component ---------- */

export default function ExamInterface({
  sessionId,
  sessionToken,
}: ExamInterfaceProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const hasSubmitted = useRef(false);

  const apiBase = `/api/certify/session/${sessionId}?token=${sessionToken}`;

  /* ---------- Fetch session + questions ---------- */
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(apiBase);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load exam session");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setSession(data.session);
        setQuestions(data.questions);
        setAnswers(data.session.answers || {});
        setTabSwitchCount(data.session.tab_switch_count || 0);

        // Calculate remaining time from expires_at
        const expiresAt = new Date(data.session.expires_at).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeRemaining(remaining);

        setLoading(false);
      } catch {
        setError("Failed to connect to exam server");
        setLoading(false);
      }
    }
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Timer ---------- */
  useEffect(() => {
    if (loading || !session || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-submit on time expiry
          if (!hasSubmitted.current) {
            handleSubmitExam();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);

  /* ---------- Tab switch detection ---------- */
  useEffect(() => {
    if (loading || !session) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => c + 1);
        // Report to API
        fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tab_switch: true }),
        }).catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);

  /* ---------- Save answer to API ---------- */
  const saveAnswer = useCallback(
    async (questionId: string, answerIndex: number) => {
      try {
        await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: questionId,
            answer_index: answerIndex,
          }),
        });
      } catch {
        // Silently fail — answers are also tracked in local state
      }
    },
    [apiBase]
  );

  /* ---------- Navigation ---------- */
  const handleSelectAnswer = useCallback(
    (index: number) => {
      setSelectedAnswer(index);
      const questionId = questions[currentIndex]?.id;
      if (questionId) {
        setAnswers((prev) => ({ ...prev, [questionId]: index }));
        saveAnswer(questionId, index);
      }
    },
    [currentIndex, questions, saveAnswer]
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      const prevQuestionId = questions[currentIndex - 1]?.id;
      setSelectedAnswer(
        prevQuestionId && answers[prevQuestionId] !== undefined
          ? answers[prevQuestionId]
          : null
      );
    }
  }, [currentIndex, questions, answers]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      const nextQuestionId = questions[currentIndex + 1]?.id;
      setSelectedAnswer(
        nextQuestionId && answers[nextQuestionId] !== undefined
          ? answers[nextQuestionId]
          : null
      );
    } else {
      setShowReview(true);
    }
  }, [currentIndex, questions, answers]);

  /* ---------- Submit exam ---------- */
  const handleSubmitExam = useCallback(async () => {
    if (hasSubmitted.current || submitting) return;
    hasSubmitted.current = true;
    setSubmitting(true);
    setShowConfirm(false);
    setShowReview(false);

    try {
      const res = await fetch(
        `/api/certify/session/${sessionId}/submit?token=${sessionToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        router.push(`/certify/results/${sessionId}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit exam");
        hasSubmitted.current = false;
        setSubmitting(false);
      }
    } catch {
      setError("Failed to connect to exam server");
      hasSubmitted.current = false;
      setSubmitting(false);
    }
  }, [sessionId, sessionToken, submitting, router]);

  /* ---------- Helpers ---------- */
  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isTimeLow = timeRemaining < 300;

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--theme-border)] border-t-[var(--theme-blue)]" />
          <p className="mt-4 text-sm text-[var(--theme-muted)]">
            Loading exam...
          </p>
        </div>
      </div>
    );
  }

  /* ---------- Error state ---------- */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8">
            <h2 className="font-display text-xl font-bold text-white">
              Exam Error
            </h2>
            <p className="mt-2 text-sm text-red-400">{error}</p>
            <a
              href="/certify"
              className="mt-6 inline-block rounded-lg bg-[var(--theme-blue)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              Return to Certifications
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Review screen ---------- */
  if (showReview) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-8">
            <h2 className="font-display text-xl font-bold text-white">
              Review Your Exam
            </h2>
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              You have answered {answeredCount} of {totalQuestions} questions.
              Unanswered questions will be marked incorrect.
            </p>

            <div className="mt-6 grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setSelectedAnswer(
                      answers[q.id] !== undefined ? answers[q.id] : null
                    );
                    setShowReview(false);
                  }}
                  className={`flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                    answers[q.id] !== undefined
                      ? "border-[var(--theme-blue)]/30 bg-[var(--theme-blue)]/10 text-[var(--theme-blue)]"
                      : "border-[var(--theme-border)] text-[var(--theme-muted)] hover:border-[var(--theme-blue)]/30"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {tabSwitchCount > 0 && (
              <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-sm text-yellow-400">
                {tabSwitchCount} tab switch
                {tabSwitchCount === 1 ? "" : "es"} detected
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowReview(false);
                }}
                className="flex-1 rounded-lg border border-[var(--theme-border)] px-6 py-3 text-sm font-medium text-[var(--theme-muted)] transition-colors hover:text-white"
              >
                Back to Questions
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex-1 rounded-lg bg-[var(--theme-blue)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Confirmation modal */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
              <div className="w-full max-w-sm rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 text-center">
                <h3 className="font-display text-lg font-bold text-white">
                  Submit your exam?
                </h3>
                <p className="mt-2 text-sm text-[var(--theme-muted)]">
                  This action cannot be undone. Your answers will be submitted
                  for grading.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-lg border border-[var(--theme-border)] px-4 py-2.5 text-sm font-medium text-[var(--theme-muted)] transition-colors hover:text-white"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleSubmitExam}
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-[var(--theme-blue)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Confirm Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------- Exam interface ---------- */
  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen">
      {/* Top bar: progress + timer */}
      <div className="sticky top-0 z-40 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="text-sm text-[var(--theme-muted)]">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div
            className={`font-mono text-sm font-bold ${
              isTimeLow ? "text-red-400" : "text-white"
            }`}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-[var(--theme-border)]">
          <div
            className="h-1 bg-[var(--theme-blue)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Anti-cheat warning */}
      {tabSwitchCount > 0 && (
        <div className="border-b border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-center text-xs text-yellow-400">
          Warning: {tabSwitchCount} tab switch
          {tabSwitchCount === 1 ? "" : "es"} detected. Excessive switching may
          invalidate your exam.
        </div>
      )}

      {/* Question */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-[var(--theme-blue)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--theme-blue)]">
            {currentQuestion.category}
          </span>
          <span className="text-xs text-[var(--theme-muted)]">
            Difficulty: {currentQuestion.difficulty}/5
          </span>
        </div>

        <p className="text-lg font-medium text-white">
          {currentQuestion.question_text}
        </p>

        <div className="mt-8 space-y-3">
          {(currentQuestion.options as string[]).map(
            (option: string, idx: number) => {
              const label = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedAnswer === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left text-sm transition-all ${
                    isSelected
                      ? "border-[var(--theme-blue)] bg-[var(--theme-blue)]/10 text-white"
                      : "border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-muted)] hover:border-[var(--theme-blue)]/30 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      isSelected
                        ? "border-[var(--theme-blue)] bg-[var(--theme-blue)] text-white"
                        : "border-[var(--theme-border)]"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="pt-0.5">{option}</span>
                </button>
              );
            }
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
              currentIndex === 0
                ? "cursor-not-allowed text-[var(--theme-muted)]/50"
                : "border border-[var(--theme-border)] text-[var(--theme-muted)] hover:text-white"
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="rounded-lg bg-[var(--theme-blue)] px-8 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            {currentIndex < totalQuestions - 1
              ? "Next Question"
              : "Review Answers"}
          </button>
        </div>
      </div>
    </div>
  );
}
