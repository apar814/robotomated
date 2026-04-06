"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

interface ExamQuestion {
  id: string;
  question_text: string;
  question_type:
    | "multiple_choice"
    | "multi_select"
    | "scenario"
    | "fault_diagnosis"
    | "code_review"
    | "calculation"
    | "sequencing"
    | "true_false_justify";
  options: string[] | { label: string; text: string }[];
  difficulty: number;
  category: string;
  domain_code?: string;
  time_limit: number | null;
  media_url: string | null;
  scenario_context?: string;
  code_snippet?: string;
  select_count?: number; // For multi_select: how many to select
}

interface ExamSession {
  id: string;
  certification_id: string;
  status: string;
  started_at: string;
  expires_at: string;
  answers: Record<string, number | number[] | string | string[]>;
  tab_switch_count: number;
}

interface ExamInterfaceProps {
  sessionId: string;
  sessionToken: string;
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

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
  const [answers, setAnswers] = useState<
    Record<string, number | number[] | string | string[]>
  >({});
  const [selectedAnswer, setSelectedAnswer] = useState<
    number | number[] | string | null
  >(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const hasSubmitted = useRef(false);

  // Sequencing drag state
  const [sequenceOrder, setSequenceOrder] = useState<number[]>([]);

  // Calculation text answer
  const [calcAnswer, setCalcAnswer] = useState("");

  const apiBase = `/api/certify/session/${sessionId}?token=${sessionToken}`;

  /* ── Fetch session + questions ── */
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

  /* ── Timer ── */
  useEffect(() => {
    if (loading || !session || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasSubmitted.current) handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);

  /* ── Tab switch detection ── */
  useEffect(() => {
    if (loading || !session) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => {
          const newCount = c + 1;
          if (newCount >= 3) {
            setShowTabWarning(true);
          }
          return newCount;
        });
        fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tab_switch: true }),
        }).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);

  /* ── Save answer to API ── */
  const saveAnswer = useCallback(
    async (
      questionId: string,
      answer: number | number[] | string | string[]
    ) => {
      try {
        await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question_id: questionId, answer }),
        });
      } catch {
        // Silently fail — answers tracked locally
      }
    },
    [apiBase]
  );

  /* ── Option helpers ── */
  function getOptionText(
    opt: string | { label: string; text: string }
  ): string {
    return typeof opt === "string" ? opt : opt.text;
  }

  function getOptionLabel(
    opt: string | { label: string; text: string },
    idx: number
  ): string {
    if (typeof opt === "object" && opt.label) return opt.label;
    return String.fromCharCode(65 + idx);
  }

  /* ── Multiple choice handler ── */
  const handleSelectSingle = useCallback(
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

  /* ── Multi-select handler ── */
  const handleToggleMulti = useCallback(
    (index: number) => {
      setSelectedAnswer((prev) => {
        const arr = Array.isArray(prev) ? [...(prev as number[])] : [];
        const pos = arr.indexOf(index);
        if (pos >= 0) arr.splice(pos, 1);
        else arr.push(index);
        const questionId = questions[currentIndex]?.id;
        if (questionId) {
          setAnswers((p) => ({ ...p, [questionId]: arr }));
          saveAnswer(questionId, arr);
        }
        return arr;
      });
    },
    [currentIndex, questions, saveAnswer]
  );

  /* ── Sequencing handler ── */
  const handleMoveSequence = useCallback(
    (fromIdx: number, direction: "up" | "down") => {
      setSequenceOrder((prev) => {
        const newOrder = [...prev];
        const toIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
        if (toIdx < 0 || toIdx >= newOrder.length) return prev;
        [newOrder[fromIdx], newOrder[toIdx]] = [
          newOrder[toIdx],
          newOrder[fromIdx],
        ];
        const questionId = questions[currentIndex]?.id;
        if (questionId) {
          setAnswers((p) => ({ ...p, [questionId]: newOrder }));
          saveAnswer(questionId, newOrder);
        }
        return newOrder;
      });
    },
    [currentIndex, questions, saveAnswer]
  );

  /* ── Calculation handler ── */
  const handleCalcChange = useCallback(
    (value: string) => {
      setCalcAnswer(value);
      const questionId = questions[currentIndex]?.id;
      if (questionId) {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
        saveAnswer(questionId, value);
      }
    },
    [currentIndex, questions, saveAnswer]
  );

  /* ── Navigation ── */
  const navigateTo = useCallback(
    (idx: number) => {
      setCurrentIndex(idx);
      const q = questions[idx];
      if (!q) return;
      const saved = answers[q.id];
      if (q.question_type === "sequencing") {
        if (Array.isArray(saved)) {
          setSequenceOrder(saved as number[]);
        } else {
          setSequenceOrder(q.options.map((_, i) => i));
        }
        setSelectedAnswer(null);
      } else if (q.question_type === "calculation") {
        setCalcAnswer(typeof saved === "string" ? saved : "");
        setSelectedAnswer(null);
      } else if (
        q.question_type === "multi_select" ||
        q.question_type === "code_review"
      ) {
        setSelectedAnswer(
          Array.isArray(saved) ? (saved as number[]) : []
        );
      } else {
        setSelectedAnswer(
          saved !== undefined ? (saved as number) : null
        );
      }
    },
    [questions, answers]
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) navigateTo(currentIndex - 1);
  }, [currentIndex, navigateTo]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) navigateTo(currentIndex + 1);
    else setShowReview(true);
  }, [currentIndex, questions.length, navigateTo]);

  /* ── Submit exam ── */
  const handleSubmitExam = useCallback(async () => {
    if (hasSubmitted.current || submitting) return;
    hasSubmitted.current = true;
    setSubmitting(true);
    setShowConfirm(false);
    setShowReview(false);

    try {
      const res = await fetch(
        `/api/certify/session/${sessionId}/submit?token=${sessionToken}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
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

  /* ── Helpers ── */
  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isTimeLow = timeRemaining < 600; // 10 min warning
  const isTimeCritical = timeRemaining < 300; // 5 min critical

  /* ══════════════════════════════════════════════
     LOADING
     ══════════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════════
     ERROR
     ══════════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════════
     TAB SWITCH BLOCK
     ══════════════════════════════════════════════ */
  if (showTabWarning && tabSwitchCount >= 5) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8">
            <h2 className="font-display text-xl font-bold text-red-400">
              Exam Session Flagged
            </h2>
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              Your exam has been flagged for review due to excessive tab
              switches ({tabSwitchCount} detected). Your answers have been
              saved. A reviewer will assess your session.
            </p>
            <a
              href="/certify"
              className="mt-6 inline-block rounded-lg border border-[var(--theme-border)] px-6 py-3 text-sm font-medium text-[var(--theme-muted)] hover:text-white"
            >
              Return to Certifications
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     REVIEW SCREEN
     ══════════════════════════════════════════════ */
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

            <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-10">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      navigateTo(idx);
                      setShowReview(false);
                    }}
                    className={`flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      isAnswered
                        ? "border-[var(--theme-blue)]/30 bg-[var(--theme-blue)]/10 text-[var(--theme-blue)]"
                        : "border-[var(--theme-border)] text-[var(--theme-muted)] hover:border-[var(--theme-blue)]/30"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-[var(--theme-muted)]">
              <span>Time remaining: {formatTime(timeRemaining)}</span>
              {tabSwitchCount > 0 && (
                <span className="text-yellow-400">
                  {tabSwitchCount} tab switch
                  {tabSwitchCount === 1 ? "" : "es"}
                </span>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowReview(false)}
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

  /* ══════════════════════════════════════════════
     EXAM INTERFACE
     ══════════════════════════════════════════════ */
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const questionTypeBadge: Record<string, { label: string; color: string }> = {
    multiple_choice: { label: "Multiple Choice", color: "bg-blue/10 text-blue" },
    multi_select: {
      label: "Multi-Select",
      color: "bg-violet/10 text-violet",
    },
    scenario: { label: "Scenario", color: "bg-green/10 text-green" },
    fault_diagnosis: {
      label: "Fault Diagnosis",
      color: "bg-red-500/10 text-red-400",
    },
    code_review: {
      label: "Code Review",
      color: "bg-amber-500/10 text-amber-400",
    },
    calculation: {
      label: "Calculation",
      color: "bg-cyan-500/10 text-cyan-400",
    },
    sequencing: {
      label: "Sequencing",
      color: "bg-purple-500/10 text-purple-400",
    },
    true_false_justify: {
      label: "True/False + Justify",
      color: "bg-orange-500/10 text-orange-400",
    },
  };

  const typeBadge =
    questionTypeBadge[currentQuestion.question_type] ||
    questionTypeBadge.multiple_choice;

  return (
    <div className="min-h-screen">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--theme-muted)]">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs text-[var(--theme-muted)]">
              ({answeredCount} answered)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowReview(true)}
              className="rounded-md border border-[var(--theme-border)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted)] hover:text-white"
            >
              Review All
            </button>
            <div
              className={`font-mono text-sm font-bold ${
                isTimeCritical
                  ? "animate-pulse text-red-400"
                  : isTimeLow
                    ? "text-yellow-400"
                    : "text-white"
              }`}
            >
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-[var(--theme-border)]">
          <div
            className="h-1 bg-[var(--theme-blue)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ── Anti-cheat warning ── */}
      {tabSwitchCount > 0 && tabSwitchCount < 5 && (
        <div className="border-b border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-center text-xs text-yellow-400">
          Warning: {tabSwitchCount} tab switch
          {tabSwitchCount === 1 ? "" : "es"} detected. Excessive switching
          may invalidate your exam. ({5 - tabSwitchCount} remaining before
          auto-flag)
        </div>
      )}

      {/* ── Question ── */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Type + difficulty badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeBadge.color}`}
          >
            {typeBadge.label}
          </span>
          {currentQuestion.domain_code && (
            <span className="rounded-full bg-[var(--theme-border)]/50 px-2.5 py-0.5 text-[10px] text-[var(--theme-muted)]">
              {currentQuestion.domain_code.replace(/_/g, " ")}
            </span>
          )}
          <span className="text-[10px] text-[var(--theme-muted)]">
            Difficulty: {"*".repeat(currentQuestion.difficulty)}
            {"·".repeat(5 - currentQuestion.difficulty)}
          </span>
        </div>

        {/* Scenario context */}
        {currentQuestion.scenario_context && (
          <div className="mb-6 rounded-lg border border-[var(--theme-border)] bg-[#0C0C0C] p-4 text-sm leading-relaxed text-[var(--theme-muted)]">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--theme-blue)]">
              Scenario
            </p>
            <p className="whitespace-pre-line">
              {currentQuestion.scenario_context}
            </p>
          </div>
        )}

        {/* Code snippet */}
        {currentQuestion.code_snippet && (
          <div className="mb-6 overflow-x-auto rounded-lg border border-[var(--theme-border)] bg-[#0C0C0C] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Code
            </p>
            <pre className="font-mono text-sm leading-relaxed text-[var(--theme-muted)]">
              <code>{currentQuestion.code_snippet}</code>
            </pre>
          </div>
        )}

        {/* Question text */}
        <p className="text-lg font-medium leading-relaxed text-white">
          {currentQuestion.question_text}
        </p>

        {/* ── ANSWER AREA (by type) ── */}
        <div className="mt-8">
          {/* MULTIPLE CHOICE / SCENARIO / FAULT DIAGNOSIS / TRUE-FALSE */}
          {(currentQuestion.question_type === "multiple_choice" ||
            currentQuestion.question_type === "scenario" ||
            currentQuestion.question_type === "fault_diagnosis" ||
            currentQuestion.question_type === "true_false_justify") && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const label = getOptionLabel(option, idx);
                const text = getOptionText(option);
                const isSelected = selectedAnswer === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectSingle(idx)}
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
                    <span className="pt-0.5">{text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* MULTI-SELECT / CODE REVIEW */}
          {(currentQuestion.question_type === "multi_select" ||
            currentQuestion.question_type === "code_review") && (
            <div className="space-y-3">
              {currentQuestion.select_count && (
                <p className="mb-2 text-xs font-semibold text-violet">
                  Select {currentQuestion.select_count} answers
                </p>
              )}
              {currentQuestion.options.map((option, idx) => {
                const label = getOptionLabel(option, idx);
                const text = getOptionText(option);
                const selected = Array.isArray(selectedAnswer)
                  ? (selectedAnswer as number[])
                  : [];
                const isSelected = selected.includes(idx);

                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleMulti(idx)}
                    className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left text-sm transition-all ${
                      isSelected
                        ? "border-violet bg-violet/10 text-white"
                        : "border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-muted)] hover:border-violet/30 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                        isSelected
                          ? "border-violet bg-violet text-white"
                          : "border-[var(--theme-border)]"
                      }`}
                    >
                      {isSelected ? "✓" : label}
                    </span>
                    <span className="pt-0.5">{text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* SEQUENCING */}
          {currentQuestion.question_type === "sequencing" && (
            <div className="space-y-2">
              <p className="mb-2 text-xs font-semibold text-purple-400">
                Arrange in correct order (use arrows to reorder)
              </p>
              {sequenceOrder.map((optIdx, posIdx) => {
                const option = currentQuestion.options[optIdx];
                const text = getOptionText(option);

                return (
                  <div
                    key={optIdx}
                    className="flex items-center gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 font-mono text-xs font-bold text-purple-400">
                      {posIdx + 1}
                    </span>
                    <span className="flex-1 text-sm text-[var(--theme-muted)]">
                      {text}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() =>
                          handleMoveSequence(posIdx, "up")
                        }
                        disabled={posIdx === 0}
                        className="rounded px-2 py-0.5 text-xs text-[var(--theme-muted)] hover:bg-[var(--theme-border)] hover:text-white disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() =>
                          handleMoveSequence(posIdx, "down")
                        }
                        disabled={
                          posIdx === sequenceOrder.length - 1
                        }
                        className="rounded px-2 py-0.5 text-xs text-[var(--theme-muted)] hover:bg-[var(--theme-border)] hover:text-white disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CALCULATION */}
          {currentQuestion.question_type === "calculation" && (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-cyan-400">
                  Show your work and enter your final answer
                </p>
                <textarea
                  value={calcAnswer}
                  onChange={(e) => handleCalcChange(e.target.value)}
                  placeholder="Show your calculation reasoning and final answer here..."
                  className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 font-mono text-sm text-white placeholder:text-[var(--theme-muted)] focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  rows={6}
                />
              </div>
              {/* Also show options if present (for final answer selection) */}
              {currentQuestion.options.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[var(--theme-muted)]">
                    Select your final answer:
                  </p>
                  {currentQuestion.options.map((option, idx) => {
                    const label = getOptionLabel(option, idx);
                    const text = getOptionText(option);
                    const isSelected = selectedAnswer === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectSingle(idx)}
                        className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left text-sm transition-all ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-500/10 text-white"
                            : "border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-muted)] hover:border-cyan-500/30 hover:text-white"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-500 text-white"
                              : "border-[var(--theme-border)]"
                          }`}
                        >
                          {label}
                        </span>
                        <span className="pt-0.5">{text}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
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
