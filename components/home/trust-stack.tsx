import { CheckCircle, Users, Shield, TrendingUp, Zap, Target } from "lucide-react";
import Link from "next/link";

interface TrustSignal {
  icon: React.ReactNode;
  stat: string;
  title: string;
  description: string;
  href: string;
}

const TRUST_SIGNALS: TrustSignal[] = [
  {
    icon: <CheckCircle className="h-8 w-8" />,
    stat: "0%",
    title: "Manufacturer Bias",
    description: "No paid placements. Ever.",
    href: "/methodology",
  },
  {
    icon: <Users className="h-8 w-8" />,
    stat: "986",
    title: "Robots Tracked",
    description: "Every spec, every review.",
    href: "/explore",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    stat: "+73%",
    title: "Incident Reduction",
    description: "With certified operators.",
    href: "/certify",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    stat: "+34%",
    title: "Earning Premium",
    description: "RCO holders on RoboWork.",
    href: "/robowork",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    stat: "6",
    title: "Certification Levels",
    description: "From awareness to CRO.",
    href: "/certify",
  },
  {
    icon: <Target className="h-8 w-8" />,
    stat: "$24T",
    title: "Market by 2040",
    description: "Robotics mega-industry.",
    href: "/market",
  },
];

export function TrustStack() {
  return (
    <section className="bg-gray-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Why Robotomated
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            The intelligence layer robotics was missing. Independent, transparent, trusted.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {TRUST_SIGNALS.map((signal, idx) => (
            <Link key={idx} href={signal.href}>
              <div className="flex h-full cursor-pointer flex-col rounded-lg border border-gray-800 bg-gray-900 p-8 transition-all hover:border-blue-600 hover:bg-gray-800/50">
                {/* Icon */}
                <div className="mb-6 text-blue-400">{signal.icon}</div>

                {/* Stat */}
                <p className="mb-2 text-4xl font-bold text-white">{signal.stat}</p>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-white">{signal.title}</h3>

                {/* Description */}
                <p className="flex-grow text-sm text-gray-400">{signal.description}</p>

                {/* Arrow */}
                <p className="mt-4 text-sm font-medium text-blue-400">Learn more &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
