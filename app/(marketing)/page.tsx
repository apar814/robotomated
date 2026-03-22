import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex w-full flex-col items-center px-4 pb-20 pt-24 text-center sm:pt-32">
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          Your warehouse,{" "}
          <span className="bg-gradient-to-r from-blue to-violet bg-clip-text text-transparent">
            robotomated.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Find, compare, and understand robots. Expert reviews, transparent
          scoring, and AI-powered recommendations for every use case.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/robots"
            className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
          >
            Explore Robots
          </Link>
          <Link
            href="/advisor"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-navy-lighter"
          >
            Talk to AI Advisor
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="w-full border-t border-border px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
          {[
            {
              title: "Transparent Scoring",
              desc: "RoboScore rates every robot on 8 dimensions. Methodology is public. No black boxes.",
              color: "text-blue",
            },
            {
              title: "AI-Powered Advisor",
              desc: "Describe your needs in plain English. Get matched to the right robot in seconds.",
              color: "text-violet",
            },
            {
              title: "Expert Reviews",
              desc: "Deep technical reviews that bridge techy-and-intimidating with accessible-and-useful.",
              color: "text-green",
            },
          ].map(({ title, desc, color }) => (
            <div key={title}>
              <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
