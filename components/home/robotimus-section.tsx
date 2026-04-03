"use client";

import { RobotimusAvatar } from "@/components/robotimus-avatar";
import Link from "next/link";

const starterPrompts = [
  "Should I buy, lease, or hire?",
  "What fits my $150K budget?",
  "Help me build a CFO business case",
  "Which robots work in hospitals?",
];

export function RobotimusSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28" style={{ backgroundColor: "#080808" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - intro */}
          <div className="flex flex-col items-start">
            <RobotimusAvatar size={80} glow={true} />
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-[36px]">
              Meet Robotimus.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-neutral-400">
              Your independent robotics advisor. Ask anything about buying, leasing, hiring, or
              operating robots. Powered by real deployment data across 305+ robots.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                305 robots in his knowledge base
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                Trained on real deployment data
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                Available 24/7
              </li>
            </ul>
          </div>

          {/* Right side - simulated chat */}
          <div className="flex flex-col gap-4">
            <div
              className="overflow-hidden rounded-xl border border-neutral-800"
              style={{ backgroundColor: "#111111" }}
            >
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-neutral-800 px-4 py-3">
                <RobotimusAvatar size={24} />
                <span className="text-sm font-semibold text-white">Robotimus</span>
                <span className="relative ml-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs text-neutral-500">Online</span>
              </div>

              {/* Chat body */}
              <div className="flex flex-col gap-4 p-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed text-white"
                    style={{ backgroundColor: "#1a1a2e" }}
                  >
                    I have a 30,000 sq ft warehouse and $150K budget. What robot do I need?
                  </div>
                </div>

                {/* Robotimus message */}
                <div className="flex items-start gap-2">
                  <div className="mt-1 shrink-0">
                    <RobotimusAvatar size={24} />
                  </div>
                  <div
                    className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-neutral-200"
                    style={{ backgroundColor: "#0d1520" }}
                  >
                    Great question. For your size and budget, I&apos;d recommend looking at the{" "}
                    <span className="font-semibold text-sky-400">Locus Origin</span>{" "}
                    (RoboScore: 87) or the{" "}
                    <span className="font-semibold text-sky-400">6 River Systems Chuck</span>.
                    Both are proven in your sq footage range. But first -- do you want to buy,
                    lease, or hire? That changes my recommendation significantly.
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="border-t border-neutral-800 p-3">
                <Link
                  href="/advisor"
                  className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 transition-colors hover:border-neutral-600"
                  style={{ backgroundColor: "#0a0a0a" }}
                >
                  <span className="flex-1 text-sm text-neutral-500">
                    Ask Robotimus anything...
                  </span>
                  <span className="shrink-0 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500">
                    Ask Now
                  </span>
                </Link>
              </div>
            </div>

            {/* Starter prompt pills */}
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              {starterPrompts.map((prompt) => (
                <Link
                  key={prompt}
                  href="/advisor"
                  className="shrink-0 rounded-full border border-neutral-700 px-4 py-2 text-xs text-neutral-400 transition-colors hover:border-sky-600 hover:text-sky-400"
                  style={{ backgroundColor: "#111111" }}
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
