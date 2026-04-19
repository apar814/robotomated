import Link from "next/link";

const CERT_LEVELS = [
  { level: 0, name: "Awareness", price: "Free", color: "rgba(34,197,94,0.8)", passScore: "70%", time: "30 min", proves: "You understand what robots are and where they fit." },
  { level: 1, name: "Foundation", price: "$299", color: "rgba(14,165,233,0.8)", passScore: "80%", time: "90 min", proves: "You can evaluate and recommend robotic solutions." },
  { level: 2, name: "Specialist", price: "$599", color: "rgba(139,92,246,0.8)", passScore: "85%", time: "2 hrs", proves: "You can deploy and operate robots in your specialization." },
  { level: 3, name: "Master", price: "$1,299", color: "rgba(239,68,68,0.8)", passScore: "90%", time: "4 rounds", proves: "You survived The Gauntlet. You are elite.", isGauntlet: true },
  { level: 4, name: "Fleet Commander", price: "$2,499", color: "rgba(245,158,11,0.8)", passScore: "92%", time: "3 hrs", proves: "You can manage multi-robot fleets at enterprise scale." },
  { level: 5, name: "CRO", price: "By Merit", color: "rgba(255,255,255,0.9)", passScore: "N/A", time: "Board Review", proves: "The highest credential in robotics operations. Earned, never purchased.", isLocked: true },
];

const BIZ_BENEFITS = [
  "Certify your entire operations team",
  "Verify RSPs are RCO certified",
  "Reduce liability with certified operators",
  "Track team certifications in dashboard",
  "Bulk pricing available",
];

export function CertificationSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#0EA5E9" }} />
          <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
            Certification
          </span>
        </div>

        <h2
          className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.02em", color: "var(--theme-text-primary)" }}
        >
          Get Certified. Get Hired.
        </h2>
        <p className="mt-4 max-w-2xl font-[family-name:var(--font-ui)] text-[15px] leading-[1.7]" style={{ color: "var(--theme-text-secondary)" }}>
          The Robotomated Certified Operator (RCO) program is the industry
          standard credential for robotics professionals. Six levels. One career path.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT — Timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[11px] top-0 h-full w-[2px]" style={{ background: "rgba(255,255,255,0.08)" }} />

            <div className="space-y-0">
              {CERT_LEVELS.map((cert) => (
                <div key={cert.level} className="group relative flex gap-8 pb-6">
                  {/* Timeline node */}
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: cert.color, boxShadow: `0 0 8px ${cert.color}` }}>
                    <span className="font-[family-name:var(--font-brand)] text-[11px] font-bold text-white">{cert.level}</span>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-r-2xl border-l-[3px] p-6 transition-all duration-300 hover:border-l-[3px]"
                    style={{
                      background: "var(--layer-2, rgba(18,18,18,1))",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderLeft: `3px solid ${cert.color}`,
                      borderRadius: "0 16px 16px 0",
                    }}
                  >
                    {/* Level badge */}
                    <span
                      className="inline-block rounded-md px-2.5 py-1 font-[family-name:var(--font-brand)] text-[9px] tracking-[0.15em]"
                      style={{ background: `${cert.color}26`, border: `1px solid ${cert.color}4D`, color: cert.color }}
                    >
                      LEVEL {cert.level} — {cert.name.toUpperCase()}
                    </span>

                    {/* Gauntlet warning */}
                    {cert.isGauntlet && (
                      <span className="ml-2 inline-block font-[family-name:var(--font-brand)] text-[9px] tracking-[0.12em] text-[#EF4444]">
                        [ THE GAUNTLET ]
                      </span>
                    )}

                    {/* Locked indicator for L5 */}
                    {cert.isLocked && (
                      <span className="ml-2 inline-block font-[family-name:var(--font-brand)] text-[9px] tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                        [ BY MERIT ONLY ]
                      </span>
                    )}

                    <div className="mt-3 flex items-center gap-4">
                      <span className="font-[family-name:var(--font-mono)] text-lg font-bold" style={{ color: cert.color }}>{cert.price}</span>
                      <span className="font-[family-name:var(--font-mono)] text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Pass: {cert.passScore} · {cert.time}
                      </span>
                    </div>

                    {/* What it proves */}
                    <p className="mt-3 border-l-2 pl-3 font-[family-name:var(--font-ui)] text-[14px] italic" style={{ borderColor: cert.color, color: "rgba(255,255,255,0.6)" }}>
                      {cert.proves}
                    </p>

                    {/* CTA */}
                    {!cert.isLocked ? (
                      <Link
                        href={cert.level === 0 ? "/certify/awareness" : "/certify"}
                        className="mt-4 inline-block rounded-lg px-5 py-2.5 font-[family-name:var(--font-brand)] text-[10px] tracking-[0.1em] transition-all hover:brightness-110"
                        style={{ background: `${cert.color}1F`, border: `1px solid ${cert.color}4D`, color: cert.color }}
                      >
                        {cert.level === 0 ? "START FREE" : "BEGIN CERTIFICATION"} →
                      </Link>
                    ) : (
                      <p className="mt-4 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                        Requires RCO Fleet Commander + 5 years
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Gauntlet warning bar */}
            <div className="mt-6 rounded-lg px-5 py-3 text-center" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <span className="font-[family-name:var(--font-brand)] text-[10px] tracking-[0.12em] text-[#EF4444]">
                THE GAUNTLET: 4 ROUNDS · 2 HOURS · NO SECOND CHANCES
              </span>
            </div>
          </div>

          {/* RIGHT — For Businesses */}
          <div className="h-fit rounded-2xl p-8" style={{ background: "var(--layer-2, rgba(18,18,18,1))", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
              For Businesses
            </p>
            <p className="mt-2 font-[family-name:var(--font-ui)] text-lg font-bold" style={{ color: "var(--theme-text-primary)" }}>
              Train your team. Reduce risk.
            </p>

            <ul className="mt-8 space-y-3">
              {BIZ_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#0EA5E9]" />
                  <span className="font-[family-name:var(--font-ui)] text-[14px] leading-[1.6]" style={{ color: "var(--theme-text-secondary)" }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="stat-cell rounded-lg px-4 py-4" style={{ background: "rgba(14,165,233,0.04)", border: "1px solid rgba(14,165,233,0.1)" }}>
                <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-[#0EA5E9]" style={{ textShadow: "0 0 20px rgba(14,165,233,0.15)" }}>73%</p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] leading-[1.5]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Fewer incidents with certified operators
                </p>
              </div>
              <div className="stat-cell rounded-lg px-4 py-4" style={{ background: "rgba(14,165,233,0.04)", border: "1px solid rgba(14,165,233,0.1)" }}>
                <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-[#0EA5E9]" style={{ textShadow: "0 0 20px rgba(14,165,233,0.15)" }}>+34%</p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] leading-[1.5]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Higher earnings on RoboWork
                </p>
              </div>
            </div>

            <Link
              href="/certify"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-7 py-3.5 font-[family-name:var(--font-brand)] text-[11px] tracking-[0.08em] transition-all hover:-translate-y-0.5 hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--theme-text-primary)" }}
            >
              CERTIFY YOUR TEAM →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
