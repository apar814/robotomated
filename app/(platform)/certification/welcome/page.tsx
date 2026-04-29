import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to Your Cohort | Robotomated",
  robots: "noindex",
};

export default function CertificationWelcomePage() {
  return (
    <main className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-obsidian-surface border border-lime/30 rounded-xl p-8 sm:p-10">
          <p className="text-4xl mb-4">&#127881;</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            You&apos;re In
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            Welcome to the Robotomated Certified Operator program. Check your
            email for your welcome kit and next steps.
          </p>

          <div className="bg-obsidian rounded-lg p-5 text-left mb-6">
            <p className="text-lime font-mono text-sm mb-3">What happens now:</p>
            <ol className="space-y-2 text-sm text-text-secondary">
              <li className="flex gap-2">
                <span className="text-electric-blue font-mono shrink-0">1.</span>
                Check your inbox for the welcome email with your cohort details
              </li>
              <li className="flex gap-2">
                <span className="text-electric-blue font-mono shrink-0">2.</span>
                Complete the free Level 0 Robot Awareness quiz if you haven&apos;t already
              </li>
              <li className="flex gap-2">
                <span className="text-electric-blue font-mono shrink-0">3.</span>
                Block 10 hrs/week on your calendar for the next 4 weeks
              </li>
              <li className="flex gap-2">
                <span className="text-electric-blue font-mono shrink-0">4.</span>
                Watch for your community invite 3 days before cohort starts
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/certify"
              className="flex-1 bg-electric-blue text-obsidian font-semibold py-3 rounded-lg hover:brightness-110 transition-all text-center"
            >
              Take Level 0 Quiz
            </Link>
            <Link
              href="/explore"
              className="flex-1 border border-border text-text-secondary font-medium py-3 rounded-lg hover:border-electric-blue hover:text-text-primary transition-colors text-center"
            >
              Explore Robots
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
