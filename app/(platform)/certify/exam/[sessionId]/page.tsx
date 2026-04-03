"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ---------- Mock data ---------- */

interface Question {
  id: number;
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the primary purpose of an emergency stop (e-stop) on a robotic system?",
    options: [
      { label: "A", text: "To pause the program for debugging" },
      { label: "B", text: "To immediately halt all robot motion in an unsafe situation" },
      { label: "C", text: "To save the current position before shutdown" },
      { label: "D", text: "To switch between automatic and manual modes" },
    ],
    correctAnswer: "B",
  },
  {
    id: 2,
    text: "Which standard specifically addresses safety requirements for collaborative robot systems?",
    options: [
      { label: "A", text: "ISO 9001" },
      { label: "B", text: "ISO 14001" },
      { label: "C", text: "ISO/TS 15066" },
      { label: "D", text: "ISO 27001" },
    ],
    correctAnswer: "C",
  },
  {
    id: 3,
    text: "What does 'payload capacity' refer to in robotics specifications?",
    options: [
      { label: "A", text: "The total weight of the robot arm" },
      { label: "B", text: "The maximum weight the robot can carry at its end-effector" },
      { label: "C", text: "The weight of the robot's base unit" },
      { label: "D", text: "The combined weight of all attached sensors" },
    ],
    correctAnswer: "B",
  },
  {
    id: 4,
    text: "In a collaborative workspace, what is 'speed and separation monitoring'?",
    options: [
      { label: "A", text: "Tracking how fast operators walk through the facility" },
      { label: "B", text: "Monitoring network data transfer speeds" },
      { label: "C", text: "Adjusting robot speed based on the distance to nearby humans" },
      { label: "D", text: "Measuring the time between robot maintenance intervals" },
    ],
    correctAnswer: "C",
  },
  {
    id: 5,
    text: "What does 'repeatability' measure in a robot's specification sheet?",
    options: [
      { label: "A", text: "How many times the robot can perform before maintenance" },
      { label: "B", text: "The consistency of returning to the same position across multiple attempts" },
      { label: "C", text: "The number of programs the robot can store" },
      { label: "D", text: "How quickly the robot can repeat a motion cycle" },
    ],
    correctAnswer: "B",
  },
  {
    id: 6,
    text: "Which type of robot is specifically designed to work alongside humans without safety fencing?",
    options: [
      { label: "A", text: "Industrial articulated robot" },
      { label: "B", text: "SCARA robot" },
      { label: "C", text: "Collaborative robot (cobot)" },
      { label: "D", text: "Delta/parallel robot" },
    ],
    correctAnswer: "C",
  },
  {
    id: 7,
    text: "What is the correct action if a robot exhibits unexpected movement during operation?",
    options: [
      { label: "A", text: "Continue observing to gather more data" },
      { label: "B", text: "Attempt to physically redirect the robot" },
      { label: "C", text: "Activate the emergency stop and clear the area" },
      { label: "D", text: "Switch to manual mode and override" },
    ],
    correctAnswer: "C",
  },
  {
    id: 8,
    text: "What does 'degrees of freedom' (DOF) describe in a robotic arm?",
    options: [
      { label: "A", text: "The temperature range in which the robot can operate" },
      { label: "B", text: "The number of independent joints or axes of movement" },
      { label: "C", text: "The number of programs that can run simultaneously" },
      { label: "D", text: "The range of materials the robot can handle" },
    ],
    correctAnswer: "B",
  },
  {
    id: 9,
    text: "Before performing routine maintenance on a robot, what is the first step?",
    options: [
      { label: "A", text: "Open the control cabinet" },
      { label: "B", text: "Follow lockout/tagout (LOTO) procedures" },
      { label: "C", text: "Put the robot in manual mode" },
      { label: "D", text: "Disconnect the end-effector" },
    ],
    correctAnswer: "B",
  },
  {
    id: 10,
    text: "An AMR (Autonomous Mobile Robot) uses SLAM. What does SLAM stand for?",
    options: [
      { label: "A", text: "Standard Logistics Automation Management" },
      { label: "B", text: "Simultaneous Localization and Mapping" },
      { label: "C", text: "Sensor-Linked Autonomous Movement" },
      { label: "D", text: "Systematic Load Assignment Method" },
    ],
    correctAnswer: "B",
  },
];

/* ---------- Anti-cheat tracking ---------- */

interface AntiCheatLog {
  type: "tab_switch" | "focus_loss";
  timestamp: number;
}

/* ---------- Component ---------- */

export default function ExamPage() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 min default
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const antiCheatLog = useRef<AntiCheatLog[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const questions = MOCK_QUESTIONS;
  const totalQuestions = questions.length;

  /* Timer */
  useEffect(() => {
    if (!started || submitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, submitted]);

  /* Anti-cheat: tab visibility */
  useEffect(() => {
    if (!started || submitted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        antiCheatLog.current.push({
          type: "tab_switch",
          timestamp: Date.now(),
        });
        setTabSwitchCount((c) => c + 1);
      }
    };
    const handleBlur = () => {
      antiCheatLog.current.push({
        type: "focus_loss",
        timestamp: Date.now(),
      });
      setTabSwitchCount((c) => c + 1);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [started, submitted]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const handleNext = useCallback(() => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: selectedAnswer }));
    }
    setSelectedAnswer(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowReview(true);
    }
  }, [selectedAnswer, currentIndex, totalQuestions, questions]);

  const handleSubmit = useCallback(() => {
    setShowConfirm(false);
    setShowReview(false);
    setSubmitted(true);
  }, []);

  const calculateScore = useCallback(() => {
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctAnswer) correct++;
    }
    return {
      correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100),
    };
  }, [answers, questions, totalQuestions]);

  /* ---------- Pre-start screen ---------- */
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F1E] px-4">
        <div className="w-full max-w-lg text-center">
          <div className="glass-card rounded-xl p-8">
            <h1 className="font-display text-2xl font-bold text-white">
              RCO Certification Exam
            </h1>
            <p className="mt-4 text-muted">
              You are about to begin your certification exam. Once started,
              the timer cannot be paused. Tab switches and window focus loss
              will be tracked.
            </p>
            <div className="mt-6 space-y-3 text-left text-sm text-muted">
              <div className="flex justify-between border-b border-border pb-2">
                <span>Questions</span>
                <span className="font-medium text-white">{totalQuestions}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span>Time Limit</span>
                <span className="font-medium text-white">{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span>Navigation</span>
                <span className="font-medium text-white">Forward only</span>
              </div>
              <div className="flex justify-between">
                <span>Anti-cheat</span>
                <span className="font-medium text-white">Active</span>
              </div>
            </div>
            <button
              onClick={() => setStarted(true)}
              className="mt-8 w-full rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Submitted / Results ---------- */
  if (submitted) {
    const score = calculateScore();
    const passed = score.percentage >= 75;

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F1E] px-4">
        <div className="w-full max-w-lg text-center">
          <div className="glass-card rounded-xl p-8">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                passed ? "bg-green/10" : "bg-red-500/10"
              }`}
            >
              <span
                className={`font-display text-3xl font-bold ${
                  passed ? "text-green" : "text-red-400"
                }`}
              >
                {score.percentage}%
              </span>
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold text-white">
              {passed ? "Congratulations!" : "Not quite there yet."}
            </h2>
            <p className="mt-2 text-muted">
              {passed
                ? `You passed with ${score.correct}/${score.total} correct answers. Your credential is being generated.`
                : `You scored ${score.correct}/${score.total}. You need 75% to pass. Review the areas below and try again.`}
            </p>

            {tabSwitchCount > 0 && (
              <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-sm text-yellow-400">
                {tabSwitchCount} tab switch{tabSwitchCount === 1 ? "" : "es"} / focus loss event{tabSwitchCount === 1 ? "" : "s"} detected
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {passed ? (
                <a
                  href="/certify"
                  className="rounded-lg bg-green px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-green/90"
                >
                  View Your Credential
                </a>
              ) : (
                <a
                  href="/certify"
                  className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
                >
                  Return to Certifications
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Review screen ---------- */
  if (showReview) {
    const answeredCount = Object.keys(answers).length;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F1E] px-4">
        <div className="w-full max-w-lg">
          <div className="glass-card rounded-xl p-8">
            <h2 className="font-display text-xl font-bold text-white">
              Review Your Exam
            </h2>
            <p className="mt-2 text-sm text-muted">
              You have answered {answeredCount} of {totalQuestions} questions.
              Unanswered questions will be marked incorrect.
            </p>

            <div className="mt-6 grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium ${
                    answers[q.id]
                      ? "border-blue/30 bg-blue/10 text-blue"
                      : "border-border text-muted"
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            {tabSwitchCount > 0 && (
              <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-sm text-yellow-400">
                {tabSwitchCount} tab switch / focus loss event{tabSwitchCount === 1 ? "" : "s"} recorded
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(true)}
                className="flex-1 rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Confirmation modal */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
              <div className="glass-card w-full max-w-sm rounded-xl p-6 text-center">
                <h3 className="font-display text-lg font-bold text-white">
                  Submit your exam?
                </h3>
                <p className="mt-2 text-sm text-muted">
                  This action cannot be undone. Your answers will be submitted
                  for grading.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-white"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
                  >
                    Confirm Submit
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
  const isTimeLow = timeRemaining < 300; // under 5 min

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Top bar: progress + timer */}
      <div className="sticky top-0 z-40 border-b border-border bg-[#0A0F1E]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="text-sm text-muted">
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
        <div className="h-1 w-full bg-border">
          <div
            className="h-1 bg-blue transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Anti-cheat warning */}
      {tabSwitchCount > 0 && (
        <div className="border-b border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-center text-xs text-yellow-400">
          Warning: {tabSwitchCount} tab switch / focus loss event{tabSwitchCount === 1 ? "" : "s"} detected. Excessive switching may invalidate your exam.
        </div>
      )}

      {/* Question */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-lg font-medium text-white">{currentQuestion.text}</p>

        <div className="mt-8 space-y-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setSelectedAnswer(opt.label)}
              className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left text-sm transition-all ${
                selectedAnswer === opt.label
                  ? "border-blue bg-blue/10 text-white"
                  : "border-border text-muted hover:border-blue/30 hover:text-white"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  selectedAnswer === opt.label
                    ? "border-blue bg-blue text-white"
                    : "border-border"
                }`}
              >
                {opt.label}
              </span>
              <span className="pt-0.5">{opt.text}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`rounded-lg px-8 py-3 text-sm font-semibold transition-colors ${
              selectedAnswer !== null
                ? "bg-blue text-white hover:bg-blue/90"
                : "cursor-not-allowed bg-border text-muted"
            }`}
          >
            {currentIndex < totalQuestions - 1 ? "Next Question" : "Review Answers"}
          </button>
        </div>
      </div>
    </div>
  );
}
