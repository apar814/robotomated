import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collaborative Robots (Cobots): Everything You Need to Know | Robotomated",
  description:
    "Complete guide to cobots in 2026. Compare Universal Robots, FANUC, ABB, and Doosan models. Prices from $25K-$65K, payload specs, and deployment guides.",
  openGraph: {
    title: "Collaborative Robots (Cobots): Everything You Need to Know | Robotomated",
    description:
      "Complete guide to cobots in 2026. Compare UR, FANUC, ABB models. Prices, specs, and deployment guides.",
    url: "https://robotomated.com/cobot-robots",
    type: "article",
  },
  alternates: { canonical: "https://robotomated.com/cobot-robots" },
};

export default function CobotRobotsPage() {
  const faqs = [
    {
      question: "What is a cobot?",
      answer:
        "A collaborative robot (cobot) is an industrial robot arm designed to operate safely alongside human workers without safety cages. Cobots use force-limiting technology, rounded edges, and speed monitoring to stop or slow when they detect contact with a person. They comply with ISO/TS 15066, which defines maximum allowable forces and pressures for human-robot contact. Unlike traditional industrial robots that operate in fenced cells, cobots share workspace with humans and are often deployed for tasks like machine tending, palletizing, quality inspection, and assembly.",
    },
    {
      question: "How much does a cobot cost?",
      answer:
        "Cobot prices range from $25,000 to $65,000 for the robot arm alone. The Universal Robots UR3e (3 kg payload) starts at approximately $25,000. The UR5e (5 kg payload) costs around $35,000. The UR10e (12.5 kg payload) runs $48,000. The UR20 (20 kg payload) is approximately $58,000. FANUC CRX-10iA is priced around $40,000-$50,000. ABB GoFa CRB 15000 costs $45,000-$55,000. Add $10,000-$30,000 for end effectors, integration, and programming for a typical deployed cost of $40,000-$90,000.",
    },
    {
      question: "How long does it take to set up a cobot?",
      answer:
        "Basic cobot setup takes 1-2 days. Unboxing and mounting takes 2-4 hours. Programming the first task via teach pendant or graphical interface takes 4-8 hours for simple pick-and-place or palletizing applications. Integration with existing machinery (CNC machines, conveyors, vision systems) adds 1-4 weeks depending on complexity. Universal Robots claims 87% of their customers have their cobot running a production task within one day of delivery.",
    },
    {
      question: "Do cobots require safety fencing?",
      answer:
        "Not in most applications. Cobots are designed to operate without safety fencing when configured within ISO/TS 15066 parameters. However, the end effector and workpiece matter: if the cobot holds a sharp tool or heavy part, a risk assessment may require light curtains, area scanners, or reduced speed zones rather than full fencing. About 80% of cobot deployments operate without traditional safety cages, using a combination of speed and force limiting plus safety-rated area monitoring.",
    },
    {
      question: "What is the payload range for cobots?",
      answer:
        "Modern cobots range from 3 kg to 30 kg payload. The Universal Robots lineup covers 3 kg (UR3e), 5 kg (UR5e), 12.5 kg (UR10e), 20 kg (UR20), and 30 kg (UR30). FANUC CRX series spans 5 kg to 25 kg. ABB GoFa handles 5 kg while their SWIFTI CRB 1300 manages 11 kg at higher speeds. Doosan M-series goes up to 25 kg. For payloads above 30 kg, you typically need a traditional industrial robot with safety fencing.",
    },
    {
      question: "Can cobots replace industrial robots?",
      answer:
        "Cobots complement rather than replace industrial robots for most applications. Cobots operate at lower speeds (typically 1-2 m/s maximum) and handle lower payloads than industrial robots. A FANUC M-20 industrial robot can move at 12+ m/s with cycle times 3-5x faster than a cobot doing the same task. Use cobots when you need flexibility, quick changeovers, and human collaboration. Use industrial robots when you need maximum speed, heavy payloads, and 24/7 throughput in a dedicated cell.",
    },
  ];

  return (
    <div style={{ background: "var(--theme-bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      <nav className="mx-auto max-w-4xl px-6 pt-8">
        <ol className="flex items-center gap-2 text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
          <li><Link href="/" className="hover:text-white">Home</Link></li>
          <li>/</li>
          <li style={{ color: "var(--theme-text-secondary)" }}>Collaborative Robots</li>
        </ol>
      </nav>

      <article className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-12">
          <h1
            className="font-display text-4xl font-medium tracking-tight sm:text-5xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Collaborative Robots (Cobots): Everything You Need to Know
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
            Cobots crossed $2.1 billion in annual revenue in 2025, growing at
            23% CAGR -- the fastest segment in industrial automation. Universal
            Robots holds 45% market share, but FANUC, ABB, Doosan, and a dozen
            challengers are closing fast. This guide covers the technology,
            the economics, and the vendor landscape so you can deploy with
            confidence.
          </p>
          <div className="mt-4 flex items-center gap-4 text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
            <span>By Robotomated Editorial Team</span>
            <span>Last updated: April 2026</span>
          </div>
        </header>

        <section className="space-y-10">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
              How Cobots Work
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              Cobots achieve safe human collaboration through four methods
              defined in ISO/TS 15066. Safety-rated monitored stop halts the
              robot when a human enters the collaborative workspace. Hand guiding
              lets an operator physically move the robot arm to teach positions.
              Speed and separation monitoring uses LiDAR or area scanners to
              slow or stop the robot based on proximity to humans. Power and
              force limiting -- the most common method -- uses torque sensors in
              every joint to cap contact forces below pain thresholds (typically
              140-150N for transient contact). Universal Robots pioneered this
              approach with backdrivable joints that sense unexpected resistance
              within milliseconds. FANUC CRX cobots add a soft, shock-absorbing
              skin that further reduces impact forces. The practical result: a
              cobot that bumps into a human feels like a gentle push, not a
              collision. This eliminates the need for safety cages in most
              applications and reduces deployment cost by $15,000-$50,000
              compared to fenced industrial robot cells.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
              Top Cobot Manufacturers Compared
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              Universal Robots (UR) dominates with the broadest lineup: UR3e,
              UR5e, UR10e, UR20, and UR30 covering 3-30 kg payloads. UR&#39;s
              advantage is ecosystem -- the UR+ marketplace has 400+ certified
              grippers, vision systems, and software plugins. The{" "}
              <Link href="/universal-robots-ur5e-review" className="underline hover:text-white">
                UR5e remains the best all-around cobot
              </Link>{" "}
              for most first-time buyers. FANUC CRX series (CRX-5iA, CRX-10iA,
              CRX-20iA, CRX-25iA) appeals to shops already running FANUC
              industrial robots -- the programming environment and controller
              architecture are shared, reducing training overhead. ABB offers
              GoFa (5 kg, fast) and SWIFTI CRB 1300 (11 kg, highest speed in
              class at 6.2 m/s with safety monitoring). Doosan Robotics M-series
              competes aggressively on price, with the M0609 (6 kg payload)
              priced 15-20% below equivalent UR models. Techman Robot (TM5,
              TM12, TM14) includes built-in machine vision at no extra cost --
              a compelling value proposition for inspection and pick-and-place
              applications. Browse all cobots in our{" "}
              <Link href="/explore/cobots" className="underline hover:text-white">
                cobot directory
              </Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
              Cobot Applications by Industry
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              Manufacturing leads cobot adoption at 62% of deployments. The top
              application is machine tending -- loading and unloading CNC mills,
              lathes, and injection molding machines. A single UR10e tending two
              CNC machines can replace a full-time operator on each shift,
              delivering ROI in 10-14 months at typical shop rates. Palletizing
              is the second most common application: the UR20 with a Robotiq
              EPick vacuum gripper handles standard case palletizing at 8-12
              cases/minute. Quality inspection using vision-guided cobots (FANUC
              CRX-10iA with integrated iRVision) catches defects that human
              inspectors miss 5-15% of the time. Welding cobots from Universal
              Robots (with Vectis welding integration) and FANUC CRX bring
              robotic welding to shops that cannot justify a full welding cell.
              Assembly applications are growing, particularly for electronics,
              medical devices, and automotive sub-assemblies where precise,
              repeatable force control is critical. For logistics and{" "}
              <Link href="/warehouse-robots" className="underline hover:text-white">
                warehouse operations
              </Link>
              , cobots handle packing, kitting, and goods-to-person pick
              stations where they work alongside human workers.
            </p>
          </div>

          <div className="my-12 border p-8 text-center" style={{ borderColor: "var(--theme-border)", background: "var(--theme-section-alt)" }}>
            <p className="text-lg font-semibold" style={{ color: "var(--theme-text-primary)" }}>
              Need help choosing the right cobot for your application?
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Robotimus can match your payload, reach, and application requirements to the right cobot in under 60 seconds.
            </p>
            <Link href="/advisor" className="mt-4 inline-block rounded-lg border border-white/20 bg-transparent px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-white/80 hover:border-white hover:text-white">
              Ask Robotimus
            </Link>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
              Total Cost of Ownership
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              The robot arm itself is 40-50% of total deployed cost. A UR5e at
              $35,000 becomes a $60,000-$80,000 deployment when you add an end
              effector ($2,000-$8,000 for grippers, $5,000-$15,000 for welding
              torches), mounting and fixturing ($1,000-$5,000), integration and
              programming ($5,000-$20,000 from a UR-certified integrator), safety
              assessment ($2,000-$5,000), and a vision system if needed ($3,000-
              $15,000). Annual maintenance costs are low -- $1,000-$3,000 per
              year for joint replacements and calibration every 30,000-50,000
              operating hours. Power consumption is minimal at 200-500W typical,
              costing under $500/year in electricity. Against a fully loaded
              manufacturing operator cost of $55,000-$75,000/year (including
              benefits, overhead, training), a cobot operating two shifts
              achieves ROI in 8-14 months. For detailed pricing across all
              robot types, see our{" "}
              <Link href="/how-much-does-a-robot-cost" className="underline hover:text-white">
                robot cost guide
              </Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
              Programming and Ease of Use
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              Cobots are marketed as "easy to program" and for simple tasks,
              they deliver. Universal Robots Polyscope interface uses a drag-
              and-drop flowchart that machine operators (not programmers) can
              learn in 1-2 days. Hand-guided teaching lets you physically move
              the arm to desired positions and record waypoints. FANUC CRX uses
              a tablet-based interface with similar drag-and-drop logic. For
              complex multi-step tasks, vision-guided operations, or force-
              controlled assembly, you will likely need an integrator or someone
              with URScript (UR&#39;s Python-like language), FANUC Karel, or
              ABB RAPID programming skills. The ecosystem of pre-built
              application templates is growing: Robotiq&#39;s Palletizing
              Solution, Vectis Cobot Welding, and UR&#39;s Application Builder
              offer turnkey configurations for the most common tasks. Our{" "}
              <Link href="/learn" className="underline hover:text-white">
                learning hub
              </Link>{" "}
              and{" "}
              <Link href="/certify" className="underline hover:text-white">
                certification program
              </Link>{" "}
              cover cobot programming fundamentals.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
              Cobots vs. Industrial Robots: When to Choose What
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              Choose a cobot when: payloads are under 30 kg, you need frequent
              task changeovers (weekly or monthly), humans must share the
              workspace, you lack robotics engineers on staff, or your production
              runs are high-mix/low-volume. Choose a traditional industrial robot
              when: cycle time is critical (cobots max out at 1-2 m/s vs. 12+
              m/s for industrials), payloads exceed 30 kg, the cell is dedicated
              to one task 24/7, or you need maximum throughput in a fenced cell.
              Increasingly, the lines blur. FANUC CRX cobots can switch to full
              industrial speed when no humans are detected in the workspace. ABB
              SWIFTI operates at up to 6.2 m/s with SafeMove monitoring that
              automatically reduces speed when humans approach. This hybrid
              approach -- cobot safety with near-industrial speed -- represents
              the future of the category. Use our{" "}
              <Link href="/compare" className="underline hover:text-white">
                comparison tool
              </Link>{" "}
              to evaluate cobots against industrial robots for your specific task.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-display text-lg font-semibold" style={{ color: "var(--theme-text-primary)" }}>
                  {faq.question}
                </h3>
                <p className="mt-2 leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
