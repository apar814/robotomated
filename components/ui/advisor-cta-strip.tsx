import Link from "next/link";

export function AdvisorCtaStrip() {
  return (
    <div
      className="w-full px-6 py-10"
      style={{
        borderTop: "1px solid #1A1A1A",
        borderBottom: "1px solid #1A1A1A",
      }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-lg font-semibold text-primary">
          Not sure which robot fits your operation?
        </h2>
        <p className="mt-2 text-[13px] text-tertiary">
          Our AI advisor narrows 305 robots down to your top 3 in 5 questions.
        </p>
        <Link
          href="/advisor"
          className="mt-5 inline-block rounded-[4px] bg-electric-blue px-6 py-2.5 font-mono text-[10px] font-bold tracking-widest text-black transition-shadow hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
        >
          START ADVISOR →
        </Link>
      </div>
    </div>
  );
}
