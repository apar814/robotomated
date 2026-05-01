"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { IconRobot, IconSearch, IconCheck, IconCertificate } from "@/components/ui/icons";

interface WizardCelebrationProps {
  companyName: string;
}

const CONFETTI_COLORS = ["#D4D4D4", "#F59E0B", "#10B981", "#7B2FFF", "#FF006E"];
const CONFETTI_COUNT = 30;

function generateConfettiPieces() {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
  }));
}

const confettiPieces = generateConfettiPieces();

const checkItems = [
  "Your provider profile is now live on Robotomated",
  "You'll receive notifications when matching jobs are posted",
  "Our team will review your verification within 24\u201348 hours",
  "You can start browsing and bidding on jobs right now",
];

const actionCards: { icon: ReactNode; title: string; subtitle: string; href: string }[] = [
  {
    icon: <IconSearch size={20} />,
    title: "Browse Open Jobs",
    subtitle: "Find robotics jobs that match your skills and fleet",
    href: "/robowork/jobs",
  },
  {
    icon: <IconCheck size={20} />,
    title: "Complete Verification",
    subtitle: "Get verified faster by uploading remaining documents",
    href: "/account",
  },
  {
    icon: <IconCertificate size={20} />,
    title: "Get RCO Certified",
    subtitle: "Stand out with Robotomated Certified Operator status",
    href: "/certify",
  },
];

export default function WizardCelebration({ companyName }: WizardCelebrationProps) {
  return (
    <div className="relative overflow-hidden px-4 py-12 text-center">
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(800px) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          position: absolute;
          top: -10px;
          width: 10px;
          height: 10px;
          animation: confetti-fall var(--duration) ease-in var(--delay) both;
        }
      `}</style>

      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            ["--delay" as string]: `${piece.delay}s`,
            ["--duration" as string]: `${piece.duration}s`,
          }}
        />
      ))}

      {/* Robot icon circle */}
      <div
        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--theme-card)", border: "2px solid var(--theme-border)" }}
      >
        <IconRobot size={48} aria-label="Robot" />
      </div>

      {/* Heading */}
      <h2
        className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--theme-text-primary)" }}
      >
        Welcome to Robotomated, {companyName}!
      </h2>

      {/* Subtitle */}
      <p
        className="mx-auto mb-10 max-w-md text-lg"
        style={{ color: "var(--theme-text-secondary)" }}
      >
        Your profile is live. Here&apos;s what happens next.
      </p>

      {/* Checkmark items */}
      <ul className="mx-auto mb-12 max-w-lg space-y-4 text-left">
        {checkItems.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm text-emerald-400">
              ✓
            </span>
            <span style={{ color: "var(--theme-text-primary)" }}>{item}</span>
          </li>
        ))}
      </ul>

      {/* Action cards */}
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-3">
        {actionCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col items-center rounded-xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              backgroundColor: "var(--theme-card)",
              borderColor: "var(--theme-border)",
            }}
          >
            <span className="mb-3">{card.icon}</span>
            <span
              className="mb-1 text-sm font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {card.title}
            </span>
            <span
              className="text-center text-xs leading-relaxed"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {card.subtitle}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
