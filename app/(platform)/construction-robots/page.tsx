import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Complete Guide to Construction Robots in 2026 | Robotomated",
  description:
    "Everything you need to know about construction robots in 2026: bricklaying robots, 3D printing, demolition bots, rebar tying, site survey drones. Costs, vendors, ROI, and deployment timelines.",
  openGraph: {
    title: "The Complete Guide to Construction Robots in 2026 | Robotomated",
    description:
      "Everything you need to know about construction robots in 2026: bricklaying robots, 3D printing, demolition bots, rebar tying, site survey drones. Costs, vendors, ROI, and deployment timelines.",
    url: "https://robotomated.com/construction-robots",
    type: "article",
  },
  alternates: { canonical: "https://robotomated.com/construction-robots" },
};

export default function ConstructionRobotsPage() {
  const faqs = [
    {
      question: "How much do construction robots cost?",
      answer:
        "Construction robot costs vary widely by type. Bricklaying robots like the FBR Hadrian X cost $2-3M for the full system, while the Construction Robotics SAM100 leases for $5,000-$10,000/month. 3D concrete printers range from $180,000 for smaller COBOD units to $500,000+ for the ICON Vulcan system. Rebar-tying robots like TyBot start around $150,000-$300,000. Demolition robots from Brokk range from $100,000-$500,000 depending on size class. Site survey drones like the DJI Matrice 350 RTK cost $10,000-$15,000 per unit plus $3,000-$8,000 for LiDAR payloads.",
    },
    {
      question: "Can 3D printing robots build a real house?",
      answer:
        "Yes. ICON has printed over 100 homes in the United States and Mexico using its Vulcan printer, including a community of 100 homes in Georgetown, Texas. COBOD's BOD2 printer has completed multi-story structures in Europe and the Middle East. Apis Cor printed a two-story administrative building in Dubai in 2019. These printers extrude proprietary concrete mixtures layer by layer, completing the wall structure of a 1,500 sq ft home in 24-48 hours of print time. Roofing, plumbing, electrical, and finishing still require human labor.",
    },
    {
      question: "How do construction robots improve safety?",
      answer:
        "Construction is the second most dangerous industry in the US, with 1,056 fatalities in 2022 according to OSHA. Robots directly reduce human exposure to the highest-risk tasks: demolition robots like Brokk remove workers from collapse zones, autonomous excavators from Built Robotics eliminate rollover and struck-by incidents, and drones replace workers who would otherwise inspect rooftops, bridges, and tower structures at height. Early adopter data suggests a 25-40% reduction in recordable incidents on sites deploying robotic systems.",
    },
    {
      question: "Will construction robots replace human workers?",
      answer:
        "The US construction industry has 600,000+ unfilled positions as of 2025, and the workforce is aging -- the median construction worker is 42 and rising. Robots are filling gaps that humans cannot or will not fill, not displacing existing workers. A Hadrian X bricklaying robot requires a 3-person support crew and handles the repetitive block-laying while humans focus on complex joints, corners, and finishing. The industry consensus is that robots will increase output per worker rather than reduce headcount, similar to how power tools expanded what individual tradespeople could accomplish.",
    },
    {
      question: "How long does it take to deploy a construction robot on-site?",
      answer:
        "Deployment timelines vary by system complexity. Rebar-tying robots like TyBot can be operational on a bridge deck in 1-2 days with a trained operator. Brokk demolition robots ship to site in standard containers and are operational within hours. 3D concrete printers require 3-7 days for site setup, calibration, and test prints. Bricklaying robots like the SAM100 need 1-2 days of setup per job. Autonomous heavy equipment from Built Robotics requires 2-4 weeks for initial GPS calibration, geofencing, and safety validation on each new site.",
    },
    {
      question: "What is the ROI of construction robots?",
      answer:
        "ROI depends heavily on the application. 3D-printed homes from ICON cost 20-30% less than conventional construction for comparable structures, with break-even on the printer investment within 10-15 homes. TyBot rebar-tying robots reduce bridge deck tying labor by 50-70%, achieving ROI within 2-3 bridge projects. Site survey drones pay for themselves on a single large project by reducing survey time from days to hours and catching errors that would cost $50,000-$500,000 to fix later. The SAM100 bricklaying robot lays 3,000 bricks per day versus 500 for a skilled mason, with rental ROI positive on projects exceeding 50,000 bricks.",
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
        <ol
          className="flex items-center gap-2 text-[13px]"
          style={{ color: "var(--theme-text-muted)" }}
        >
          <li>
            <Link href="/" className="hover:text-white">
              Home
            </Link>
          </li>
          <li>/</li>
          <li style={{ color: "var(--theme-text-secondary)" }}>
            Construction Robots
          </li>
        </ol>
      </nav>

      <article className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-12">
          <h1
            className="font-display text-4xl font-medium tracking-tight sm:text-5xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            The Complete Guide to Construction Robots in 2026
          </h1>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            The global construction robotics market reached $4.2 billion in 2025
            and is projected to grow at 16.8% CAGR through 2030. With 600,000+
            unfilled construction jobs in the US alone and an aging workforce,
            robots are no longer experimental curiosities -- they are solving an
            existential labor crisis. This guide covers every category of
            construction robot, from bricklaying systems to autonomous
            excavators, with real costs, vendor comparisons, and deployment
            considerations for general contractors, specialty trades, and
            developers.
          </p>
          <div
            className="mt-4 flex items-center gap-4 text-[13px]"
            style={{ color: "var(--theme-text-muted)" }}
          >
            <span>By Robotomated Editorial Team</span>
            <span>Last updated: April 2026</span>
          </div>
        </header>

        <section className="space-y-10">
          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Types of Construction Robots
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Construction robotics breaks into six distinct categories, each
              targeting a different phase of the build cycle. Bricklaying and
              masonry robots automate the most labor-intensive structural task
              on residential and commercial projects. 3D concrete printing
              systems create entire wall structures layer by layer, eliminating
              formwork and dramatically reducing material waste. Demolition and
              earthmoving robots handle the most dangerous site work -- tearing
              down structures and grading terrain -- with remote or fully
              autonomous operation. Rebar tying and finishing robots tackle
              repetitive, ergonomically punishing tasks like tying thousands of
              rebar intersections or applying drywall compound across acres of
              interior wall. Site survey and inspection drones provide real-time
              topographic data, progress monitoring, and structural inspection
              without scaffolding or lifts. Finally, autonomous heavy equipment
              -- excavators, dozers, and compactors -- operates 24/7 on grading
              and earthwork with GPS-guided precision.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              The right robot depends on your trade, project type, and the
              specific bottleneck you need to solve. Browse all available
              construction robots in our{" "}
              <Link
                href="/explore/construction"
                className="underline hover:text-white"
              >
                construction robot directory
              </Link>
              , or keep reading for a deep dive into each category.
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Bricklaying Robots: FBR Hadrian X and SAM100
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              The FBR Hadrian X, built by Australian company FBR Limited, is the
              most advanced bricklaying robot in production. Mounted on a truck
              chassis, its 30-meter telescopic boom places blocks at rates of up
              to 200 blocks per hour -- roughly 4x the pace of a skilled human
              mason. Hadrian X uses a proprietary adhesive system instead of
              traditional mortar, reducing material costs and curing time. The
              system handles blocks up to 20 kg and can construct the shell of a
              single-story home in 1-2 days. FBR has active contracts in
              Australia, the US, and the Middle East, with full system costs
              estimated at $2-3M. The company also offers build-as-a-service
              pricing for developers who prefer per-home economics over capital
              expenditure.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Construction Robotics' SAM100 (Semi-Automated Mason) takes a
              different approach: it augments a human mason rather than replacing
              one entirely. SAM100 lifts, butters with mortar, and places bricks
              at approximately 3,000 bricks per day, compared to 500 for a
              skilled mason working alone. A human partner handles corners,
              joints, and quality checks. SAM100 is designed for commercial
              masonry facades and is available for rent at $5,000-$10,000/month.
              The system mounts on standard scaffolding and requires a 2-person
              crew to operate effectively.
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              3D Concrete Printing: ICON, COBOD, and Apis Cor
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              3D construction printing has moved from proof-of-concept to
              production scale. ICON, the Austin-based company, leads the North
              American market with its Vulcan printer. The Vulcan system uses a
              gantry-style frame that can print structures up to 3,000 sq ft
              with walls 6-12 inches thick. ICON's Lavacrete material achieves
              compressive strengths exceeding 6,000 PSI -- well above the 2,500
              PSI minimum for standard residential concrete. ICON has printed
              homes for the Community First! Village (a housing community for
              the formerly homeless in Austin), military barracks for the US
              Marine Corps, and a planned 100-home development in Georgetown,
              Texas. System costs run $400,000-$500,000, with per-home printing
              costs of $10,000-$30,000 for the wall structure -- roughly 20-30%
              less than conventional framing and masonry.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              COBOD, based in Denmark, offers the BOD2 printer, which has been
              deployed in Germany, Saudi Arabia, India, and the US. The BOD2 is
              a modular gantry system that scales from single-story homes to
              3-story apartment buildings. COBOD's D.fab material, developed
              with CEMEX, reduces cement usage by 10-20% compared to standard
              concrete while maintaining structural integrity. Units start
              around $180,000-$350,000 depending on print volume. Apis Cor,
              originally Russian and now US-based, takes a different approach
              with a robotic arm mounted on a rotating base that can print
              circular and organic shapes that gantry systems struggle with.
              Apis Cor completed a 640 sq ft house in Russia in 24 hours of
              print time for approximately $10,000 in materials. For a broader
              look at pricing across all robot types, see our{" "}
              <Link
                href="/how-much-does-a-robot-cost"
                className="underline hover:text-white"
              >
                robot cost guide
              </Link>
              .
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Demolition and Earthmoving Robots
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Built Robotics, based in San Francisco, retrofits standard
              excavators, dozers, and compactors with autonomous driving
              technology. Their AI Guidance System uses GPS RTK, LiDAR, and
              inertial measurement units to achieve grade accuracy of +/- 1 inch
              -- matching or exceeding experienced operators. Built Robotics
              equipment operates 24/7 on earthmoving and grading tasks, with a
              human supervisor monitoring multiple machines remotely. The company
              has completed autonomous trenching for utility installations,
              solar farm grading, and highway embankment work. Retrofit costs
              range from $100,000-$250,000 per machine on top of the base
              equipment cost, with customers reporting 30-50% productivity gains
              on repetitive grading tasks due to continuous operation and
              consistent cut accuracy.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              For demolition specifically, Swedish manufacturer Brokk dominates
              the remote-controlled demolition robot market with models ranging
              from the 1.1-ton Brokk 110 to the 12-ton Brokk 900. These
              electric-powered machines operate in confined spaces, hazardous
              environments, and at heights where human-operated excavators
              cannot safely reach. The Brokk 170 ($150,000-$200,000) is the
              most popular model for interior demolition, producing 15-20x less
              vibration than jackhammers while achieving comparable material
              removal rates. Brokk machines are widely used in nuclear
              decommissioning, tunnel renovation, and process industry
              maintenance where human exposure must be minimized.
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Rebar Tying and Finishing Robots
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              TyBot, developed by Advanced Construction Robotics (ACR), is the
              first autonomous rebar-tying robot deployed at scale on bridge
              construction. TyBot rides on rails mounted across bridge deck
              rebar mats and autonomously ties intersections at a rate of 1,000+
              ties per hour using standard tie wire. A single TyBot replaces
              5-8 ironworkers on a bridge deck, reducing tying labor costs by
              50-70%. The system uses machine vision to identify intersections
              and navigate around obstacles. TyBot has completed over 100
              bridge projects across the US, with pricing starting at
              $150,000-$300,000 for purchase or $3,000-$5,000/week for rental.
              ACR also produces IronBot, an autonomous system for carrying and
              placing rebar bundles that weigh up to 2,500 lbs, eliminating
              crane dependency for rebar logistics.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              In interior finishing, Canvas (acquired by Dusty Robotics' parent)
              has developed a drywall finishing robot that applies joint compound
              to drywall seams automatically. The system uses computer vision to
              identify joints and applies compound with consistent thickness and
              feathering that reduces sanding time by 30-50%. Dusty Robotics
              itself produces a layout robot that prints full-scale floor plans
              directly onto concrete slabs using a precision inkjet system,
              replacing chalk lines and tape measures with sub-millimeter
              accuracy. Dusty's system reduces layout time by 75% and virtually
              eliminates layout errors that cascade into rework during framing,
              MEP rough-in, and millwork installation.
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Site Survey and Inspection Drones
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Drones are the most widely adopted robotic technology on
              construction sites today, with an estimated 45% of large US
              general contractors using them regularly as of 2025. The DJI
              Matrice 350 RTK ($10,000-$13,000) is the workhorse for
              photogrammetry and LiDAR mapping, offering 55 minutes of flight
              time and centimeter-level positioning accuracy with RTK
              correction. Paired with a DJI Zenmuse L2 LiDAR payload
              ($4,000-$6,000), it captures topographic survey data that
              traditionally required a 2-person crew and 2-3 days in under 2
              hours. Software platforms like DroneDeploy, Pix4D, and Propeller
              Aero process drone imagery into orthomosaics, 3D models, and
              volumetric calculations used for earthwork verification, progress
              tracking, and as-built documentation.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              For structural inspection, Boston Dynamics' Spot robot ($75,000)
              is gaining traction on large commercial and infrastructure
              projects. Spot walks autonomously through building sites on
              programmed routes, capturing 360-degree imagery and thermal data
              that is compared against BIM models to detect deviations. Spot
              can climb stairs, navigate rubble, and operate in conditions too
              dangerous for human inspectors. Skydio's autonomous drones
              ($10,000-$20,000) specialize in bridge, facade, and tower
              inspection using AI-powered obstacle avoidance that allows close
              inspection of complex geometries without pilot skill. For more
              on industrial drone applications, see our{" "}
              <Link
                href="/industrial-drones"
                className="underline hover:text-white"
              >
                industrial drone guide
              </Link>
              .
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Cost Analysis: $100K-$500K Systems and Rental Models
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Construction robot economics break into three tiers. Entry-level
              systems -- survey drones, layout robots, and handheld rebar tiers
              -- cost $10,000-$75,000 and deliver ROI on a single project.
              Mid-range systems -- demolition robots, rebar-tying bots, and
              finishing robots -- run $100,000-$500,000 and typically pay back
              within 2-5 projects depending on utilization. Premium systems --
              bricklaying robots, 3D printers, and autonomous heavy equipment
              -- cost $250,000-$3M+ and require sustained utilization across
              multiple projects for positive economics.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Rental and lease models are accelerating adoption. Brokk
              demolition robots rent for $5,000-$20,000/month depending on
              model size. Construction Robotics offers the SAM100 bricklayer
              at $5,000-$10,000/month. TyBot rebar tying is available at
              $3,000-$5,000/week for bridge projects. Several drone-as-a-service
              providers like DroneUp and Measure (a Verizon subsidiary) offer
              turnkey survey and inspection services at $1,500-$5,000 per site
              visit, eliminating the need to own equipment or employ licensed
              pilots. For developers and large GCs, many vendors offer
              project-based pricing that aligns robot costs with construction
              draws, removing the capex burden entirely.
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              The Labor Shortage Driving Adoption
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              The US construction industry has over 600,000 unfilled positions
              according to the Bureau of Labor Statistics, and the Associated
              Builders and Contractors estimates the industry needs to attract
              501,000 additional workers in 2024 alone beyond normal hiring. The
              median age of a US construction worker is 42 -- older than the
              overall workforce median of 39 -- and retirements are outpacing
              new entrants. Skilled trades like masonry, ironwork, and heavy
              equipment operation face the most acute shortages, with some
              regions reporting 6-12 month lead times to staff specialized
              crews. This labor gap directly translates to project delays:
              70% of contractors report that workforce shortages are their
              primary cause of schedule slippage.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Robots address this by multiplying the output of available
              workers rather than replacing them. A 3-person crew with a
              Hadrian X produces the masonry output of a 12-person traditional
              crew. A single TyBot operator replaces an 8-person rebar-tying
              gang. Autonomous excavators run overnight shifts that would
              require premium overtime labor rates. The net effect is that
              contractors can take on more projects with existing headcount,
              which is the primary business case driving adoption -- not
              cost reduction on a per-project basis, but revenue expansion
              through capacity increase.
            </p>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Safety Improvements and ROI
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Construction accounts for 21% of all US workplace fatalities
              despite employing only 5% of the workforce. The "Fatal Four" --
              falls, struck-by, electrocution, and caught-between -- cause 58%
              of construction deaths annually. Robots directly address three of
              these four categories. Drones eliminate fall risk for roof,
              bridge, and tower inspections. Remote-controlled demolition robots
              remove workers from struck-by and caught-between zones. Autonomous
              heavy equipment with proximity detection and geofencing prevents
              struck-by incidents involving machines. Insurance carriers are
              beginning to recognize this: early pilot programs from Zurich and
              Liberty Mutual offer 5-15% premium reductions for contractors
              deploying certified robotic safety systems.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Beyond direct safety, robots improve quality consistency, which
              reduces costly rework. 3D-printed walls have tolerances of +/- 2mm
              versus +/- 10mm for standard framing. Dusty Robotics layout
              systems reduce layout errors from an industry average of 1-2 per
              floor to near zero. TyBot produces uniformly tensioned ties that
              meet or exceed structural specifications on every intersection.
              This quality improvement alone can reduce total project costs by
              3-7% by eliminating rework cycles that plague traditional
              construction.
            </p>
          </div>

          <div className="my-12 border p-8 text-center" style={{ borderColor: "var(--theme-border)", background: "var(--theme-section-alt)" }}>
            <p className="text-lg font-semibold" style={{ color: "var(--theme-text-primary)" }}>
              Need help choosing the right construction robot for your project?
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Robotimus can analyze your project type, trade specialty, and budget to recommend the best construction robot in under 60 seconds.
            </p>
            <Link
              href="/advisor"
              className="mt-4 inline-block rounded-lg border border-white/20 bg-transparent px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-white/80 hover:border-white hover:text-white"
            >
              Ask Robotimus
            </Link>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Future Trends: Autonomous Heavy Equipment and Modular Construction
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Three converging trends will reshape construction robotics by
              2028. First, autonomous heavy equipment is moving from supervised
              autonomy to full autonomy. Caterpillar's partnership with Built
              Robotics, Komatsu's autonomous haulage system (already proven in
              mining), and John Deere's autonomous track loader (announced at
              CES 2024) signal that the major OEMs are committed to autonomy
              as a core feature, not an aftermarket add-on. Within 3-5 years,
              expect autonomous grading, trenching, and compaction to be
              standard options on mid-size and heavy equipment.
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              Second, modular and prefab construction -- where building
              components are manufactured in factory settings and assembled
              on-site -- is creating new opportunities for industrial robots.
              Companies like Factory OS, Volumetric Building Companies, and
              AUTOVOL use FANUC and ABB robotic arms in factory lines that
              produce wall panels, bathroom pods, and complete room modules.
              This shifts construction labor from uncontrolled outdoor sites to
              climate-controlled factories where traditional industrial
              automation is highly effective. Third, AI-powered project
              management platforms like Alice Technologies and nPlan are
              beginning to orchestrate robot deployment scheduling alongside
              human crews, optimizing when and where robots operate to maximize
              utilization across multi-trade workflows. Browse our{" "}
              <Link
                href="/explore/construction"
                className="underline hover:text-white"
              >
                full construction robot catalog
              </Link>{" "}
              or explore{" "}
              <Link
                href="/industrial-drones"
                className="underline hover:text-white"
              >
                industrial drone options
              </Link>{" "}
              for site survey and inspection solutions.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2
            className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3
                  className="font-display text-lg font-semibold"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {faq.question}
                </h3>
                <p
                  className="mt-2 leading-relaxed"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
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
