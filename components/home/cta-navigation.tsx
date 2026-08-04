import Link from "next/link";
import { Search, ShoppingCart, Briefcase, Award } from "lucide-react";

interface CTAOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  intent: string;
}

const CTA_OPTIONS: CTAOption[] = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Compare & Research",
    description: "Search 986 robots, run TCO calc, read independent reviews.",
    cta: "Explore Robots",
    href: "/explore",
    intent: "Decision-maker / Researcher",
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Buy or Lease",
    description: "Purchase outright, lease from $1,500/mo, or certified pre-owned.",
    cta: "Find My Robot",
    href: "/find-my-robot",
    intent: "Procurement / Operations",
  },
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: "Hire a Robot",
    description: "Post a job, get verified bids in 24h. Pay per outcome, not equipment.",
    cta: "Post a Job",
    href: "/robowork/post",
    intent: "RaaS Buyer",
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Get Certified",
    description: "6-level RCO program. Earn more on RoboWork. Required by insurers.",
    cta: "Start Certification",
    href: "/certify",
    intent: "Operators / Professionals",
  },
];

export function CTANavigation() {
  return (
    <section className="bg-black py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Choose Your Path</h2>
          <p className="text-gray-400">
            Robotomated works for everyone in the robot lifecycle.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CTA_OPTIONS.map((option, idx) => (
            <Link key={idx} href={option.href}>
              <div className="flex h-full cursor-pointer flex-col rounded-lg border border-gray-800 bg-gray-900 p-8 transition-all hover:border-blue-500 hover:bg-gray-800">
                {/* Icon */}
                <div className="mb-6 text-blue-400">{option.icon}</div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-white">{option.title}</h3>

                {/* Description */}
                <p className="mb-6 flex-grow text-sm text-gray-400">{option.description}</p>

                {/* Button-styled CTA (span — the whole card is already a link) */}
                <span className="block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition-colors group-hover:bg-blue-700">
                  {option.cta}
                </span>

                {/* Intent Label */}
                <p className="mt-4 text-center text-xs text-gray-500">For: {option.intent}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
