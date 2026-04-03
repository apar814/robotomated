import type { Metadata } from "next";
import Link from "next/link";

interface CertificationData {
  level: number;
  name: string;
  price: number;
  questions: number;
  duration: number;
  passScore: number;
  prerequisites: string;
  color: string;
  tagline: string;
  description: string;
  whoItsFor: string[];
  curriculum: { title: string; topics: string[] }[];
  skills: string[];
  specializations?: string[];
  sampleQuestion: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
}

const CERTIFICATIONS: Record<string, CertificationData> = {
  "1": {
    level: 1,
    name: "Foundation",
    price: 149,
    questions: 50,
    duration: 60,
    passScore: 75,
    prerequisites: "None",
    color: "blue",
    tagline: "Your entry point into professional robotics",
    description:
      "The RCO Level 1 Foundation certification validates core robotics knowledge. Designed for anyone entering the robotics field -- from warehouse operators to facility managers to career changers. No prior experience required.",
    whoItsFor: [
      "New robotics operators and technicians",
      "Warehouse and logistics staff transitioning to automation",
      "Facility managers overseeing robotic deployments",
      "Career changers entering the robotics industry",
      "Students preparing for robotics careers",
    ],
    curriculum: [
      {
        title: "Robot Safety Fundamentals",
        topics: [
          "Emergency stop procedures and safety zones",
          "Risk assessment basics",
          "Personal protective equipment for robotic environments",
          "ISO 10218 and ISO/TS 15066 overview",
        ],
      },
      {
        title: "Robotics Terminology and Concepts",
        topics: [
          "Robot types and classifications",
          "Degrees of freedom and workspace definitions",
          "Sensors, actuators, and end-effectors",
          "Payload, reach, and repeatability",
        ],
      },
      {
        title: "Basic Operations",
        topics: [
          "Power-on and initialization sequences",
          "Manual and automatic modes",
          "Basic teach pendant operations",
          "Program selection and execution",
        ],
      },
      {
        title: "Maintenance Awareness",
        topics: [
          "Daily inspection checklists",
          "Recognizing common failure indicators",
          "When to escalate to certified technicians",
          "Documentation and log keeping",
        ],
      },
    ],
    skills: [
      "General robot safety",
      "Industry terminology",
      "Basic robot operations",
      "Emergency stop procedures",
      "Workspace safety zones",
      "Basic maintenance awareness",
    ],
    sampleQuestion: {
      question:
        "A cobot's collaborative workspace has been defined with a safety-rated monitored stop. An operator needs to enter the workspace to load parts. What is the correct sequence?",
      options: [
        "A. Enter the workspace while the robot is in automatic mode",
        "B. Wait for the safety-rated monitored stop, verify the robot has stopped, then enter",
        "C. Press the emergency stop, enter, then restart the robot",
        "D. Reduce robot speed to minimum and enter the workspace",
      ],
      answer: "B",
      explanation:
        "Safety-rated monitored stop allows the robot to halt when a human enters the collaborative workspace. The operator must verify the stop before entering. Emergency stops (C) are for emergencies only, not routine operations.",
    },
  },
  "2": {
    level: 2,
    name: "Specialist",
    price: 299,
    questions: 100,
    duration: 90,
    passScore: 75,
    prerequisites: "Level 1 Foundation",
    color: "violet",
    tagline: "Deep expertise in your chosen robotics domain",
    description:
      "The RCO Level 2 Specialist certification validates deep expertise in a specific robotics category. Choose your specialization and demonstrate mastery of the systems, safety protocols, and operational procedures unique to your domain.",
    whoItsFor: [
      "Experienced operators seeking specialization",
      "Technicians focused on specific robot categories",
      "Team leads responsible for category-specific deployments",
      "Engineers transitioning to hands-on robotics roles",
      "Professionals seeking manufacturer partner credentials",
    ],
    curriculum: [
      {
        title: "Category-Specific Operations",
        topics: [
          "Platform-specific operational procedures",
          "Advanced programming and configuration",
          "Category-specific sensor systems",
          "Application design and optimization",
        ],
      },
      {
        title: "Advanced Safety Protocols",
        topics: [
          "Category-specific safety standards",
          "Risk assessment for specialized applications",
          "Safety system design and validation",
          "Incident investigation procedures",
        ],
      },
      {
        title: "Troubleshooting and Diagnostics",
        topics: [
          "Systematic fault diagnosis",
          "Common failure modes by category",
          "Diagnostic tools and techniques",
          "Repair vs. replace decision frameworks",
        ],
      },
      {
        title: "Integration and Compliance",
        topics: [
          "System integration fundamentals",
          "Communication protocols (ROS, OPC-UA, MQTT)",
          "Regulatory compliance by jurisdiction",
          "Documentation and audit preparation",
        ],
      },
    ],
    skills: [
      "Category-specific operations",
      "Advanced safety protocols",
      "Troubleshooting and diagnostics",
      "Integration fundamentals",
      "Performance optimization",
      "Compliance and regulations",
    ],
    specializations: [
      "AMR (Autonomous Mobile Robots)",
      "Collaborative Robots (Cobots)",
      "Industrial Robotics",
      "Drone Systems",
      "Medical Robotics",
      "Agricultural Robotics",
      "Humanoid Robotics",
    ],
    sampleQuestion: {
      question:
        "An AMR fleet is experiencing path planning failures in a warehouse with dynamic obstacles. The SLAM system shows consistent localization but the global planner frequently returns no-path-found errors. What is the most likely root cause?",
      options: [
        "A. LIDAR sensor degradation causing mapping artifacts",
        "B. Costmap inflation radius is too large for the aisle widths",
        "C. The AMR's odometry is drifting between SLAM corrections",
        "D. Network latency is delaying obstacle detection updates",
      ],
      answer: "B",
      explanation:
        "If SLAM localization is consistent, the issue is not sensor or odometry related. An oversized costmap inflation radius causes the planner to see aisles as too narrow, returning no-path-found even when physical clearance exists.",
    },
  },
  "3": {
    level: 3,
    name: "Master",
    price: 499,
    questions: 150,
    duration: 120,
    passScore: 80,
    prerequisites: "Level 2 Specialist",
    color: "green",
    tagline: "Multi-system expertise and operational leadership",
    description:
      "The RCO Level 3 Master certification validates advanced multi-system expertise. Demonstrate your ability to manage diverse robot fleets, design complex automation workflows, and lead operational teams.",
    whoItsFor: [
      "Senior operators managing multi-robot environments",
      "Automation engineers designing integrated systems",
      "Operations managers responsible for fleet performance",
      "Safety engineers overseeing complex robotic installations",
      "Consultants advising on robotics implementations",
    ],
    curriculum: [
      {
        title: "Fleet Management",
        topics: [
          "Multi-robot coordination and task allocation",
          "Fleet monitoring and performance analytics",
          "Capacity planning and utilization optimization",
          "Predictive maintenance strategies",
        ],
      },
      {
        title: "Advanced Safety Engineering",
        topics: [
          "Safety system architecture for multi-robot environments",
          "Functional safety (IEC 62443, ISO 13849)",
          "Safety validation and verification processes",
          "Emergency response planning for complex installations",
        ],
      },
      {
        title: "Cross-Platform Integration",
        topics: [
          "Heterogeneous fleet management",
          "Enterprise system integration (ERP, WMS, MES)",
          "Data architecture for robotics telemetry",
          "API design and middleware patterns",
        ],
      },
      {
        title: "Operational Excellence",
        topics: [
          "KPI definition and performance tracking",
          "Continuous improvement methodologies",
          "Team training program design",
          "Change management for automation transitions",
        ],
      },
    ],
    skills: [
      "Fleet management",
      "Advanced safety engineering",
      "Cross-platform integration",
      "Workflow automation design",
      "Risk assessment and mitigation",
      "Team training and leadership",
    ],
    sampleQuestion: {
      question:
        "A facility operates a mixed fleet of 12 AMRs from two manufacturers and 8 cobots. The WMS integration layer shows increasing task queue depth during peak hours despite adequate robot availability. What should you investigate first?",
      options: [
        "A. Network bandwidth between the WMS and fleet management systems",
        "B. Task allocation algorithm fairness between manufacturer platforms",
        "C. Robot charging schedules overlapping with peak demand periods",
        "D. Cobot cycle times increasing due to payload variation",
      ],
      answer: "B",
      explanation:
        "With adequate robot availability but growing queues, the bottleneck is likely in task allocation -- not capacity. Heterogeneous fleets often suffer from allocation algorithms that favor one platform, leaving capable robots idle while queues build.",
    },
  },
  "4": {
    level: 4,
    name: "Fleet Commander",
    price: 799,
    questions: 150,
    duration: 150,
    passScore: 80,
    prerequisites: "Level 3 Master",
    color: "violet",
    tagline: "Enterprise fleet operations and automation strategy",
    description:
      "The RCO Level 4 Fleet Commander is the highest certification in the program. It validates enterprise-grade expertise in fleet operations, automation strategy, vendor management, and organizational transformation.",
    whoItsFor: [
      "Directors of automation and robotics",
      "VP-level operations leaders",
      "Chief Technology Officers evaluating robotics investments",
      "Enterprise consultants specializing in automation",
      "Robotics program managers at scale",
    ],
    curriculum: [
      {
        title: "Enterprise Fleet Operations",
        topics: [
          "Multi-site fleet orchestration",
          "Global fleet standardization vs. localization",
          "Disaster recovery and business continuity",
          "Scalability architecture patterns",
        ],
      },
      {
        title: "Automation Strategy",
        topics: [
          "Technology roadmap development",
          "Build vs. buy vs. integrate decision frameworks",
          "Phased automation deployment strategies",
          "Innovation pipeline management",
        ],
      },
      {
        title: "Business and Finance",
        topics: [
          "ROI analysis and TCO modeling",
          "Capital vs. RaaS (Robotics as a Service) evaluation",
          "Vendor evaluation and contract negotiation",
          "Budget planning for automation programs",
        ],
      },
      {
        title: "Organizational Leadership",
        topics: [
          "Workforce transition and upskilling strategies",
          "Regulatory compliance across jurisdictions",
          "Stakeholder communication and executive reporting",
          "Building a robotics center of excellence",
        ],
      },
    ],
    skills: [
      "Enterprise fleet operations",
      "Automation strategy",
      "ROI analysis and business cases",
      "Vendor evaluation and selection",
      "Regulatory compliance at scale",
      "Organizational change management",
    ],
    sampleQuestion: {
      question:
        "Your organization is evaluating a $2.4M investment in warehouse automation across three facilities. The CFO requires a 24-month payback period. Facility A has high labor costs but legacy infrastructure, Facility B is new construction, and Facility C has moderate costs but existing partial automation. How should you sequence the deployment?",
      options: [
        "A. Start with Facility A -- highest labor costs mean fastest ROI",
        "B. Start with Facility B -- new construction minimizes integration risk and establishes the reference architecture",
        "C. Start with Facility C -- existing automation provides a foundation to build on quickly",
        "D. Deploy simultaneously across all three to maximize the 24-month window",
      ],
      answer: "B",
      explanation:
        "New construction (B) eliminates retrofit costs and integration risk, establishing a clean reference architecture. Lessons learned de-risk Facility A (legacy) and C (integration) deployments. Simultaneous deployment (D) concentrates risk and strains implementation teams.",
    },
  },
};

const COLOR_MAP: Record<string, { badge: string; cta: string; accent: string }> = {
  blue: {
    badge: "bg-blue/10 text-blue",
    cta: "bg-blue hover:bg-blue/90",
    accent: "text-blue",
  },
  violet: {
    badge: "bg-violet/10 text-violet",
    cta: "bg-violet hover:bg-violet/90",
    accent: "text-violet",
  },
  green: {
    badge: "bg-green/10 text-green",
    cta: "bg-green hover:bg-green/90 text-navy",
    accent: "text-green",
  },
};

export function generateStaticParams() {
  return [{ level: "1" }, { level: "2" }, { level: "3" }, { level: "4" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const cert = CERTIFICATIONS[level];
  if (!cert) {
    return { title: "Certification Not Found" };
  }
  return {
    title: `RCO Level ${cert.level}: ${cert.name} -- Robotomated Certified Operator`,
    description: cert.description,
  };
}

export default async function CertificationDetailPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const cert = CERTIFICATIONS[level];

  if (!cert) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Certification Not Found</h1>
          <p className="mt-4 text-muted">
            The certification level you are looking for does not exist.
          </p>
          <Link
            href="/certify"
            className="mt-6 inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue/90"
          >
            View All Certifications
          </Link>
        </div>
      </div>
    );
  }

  const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/certify"
            className="text-sm text-muted transition-colors hover:text-white"
          >
            &larr; All Certifications
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
            >
              Level {cert.level}
            </span>
            <span className="text-sm text-muted">{cert.prerequisites !== "None" ? `Requires ${cert.prerequisites}` : "No prerequisites"}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            RCO {cert.name}
          </h1>
          <p className="mt-2 text-lg text-muted">{cert.tagline}</p>
          <p className="mt-6 text-muted">{cert.description}</p>

          {/* Exam details bar */}
          <div className="mt-8 flex flex-wrap gap-6 rounded-xl border border-border bg-[#0C0C0C] p-5">
            <div>
              <p className="text-xs text-muted">Price</p>
              <p className="font-display text-xl font-bold text-white">${cert.price}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-xs text-muted">Questions</p>
              <p className="font-display text-xl font-bold text-white">{cert.questions}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-xs text-muted">Duration</p>
              <p className="font-display text-xl font-bold text-white">{cert.duration} min</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-xs text-muted">Pass Score</p>
              <p className="font-display text-xl font-bold text-white">{cert.passScore}%</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/certify/${cert.level}`}
              className={`inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-semibold text-white transition-colors ${colors.cta}`}
            >
              Enroll Now -- ${cert.price}
            </Link>
            <p className="flex items-center text-xs text-muted">
              Pay yourself | Have employer pay
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">Who This Is For</h2>
          <ul className="mt-6 space-y-3">
            {cert.whoItsFor.map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colors.accent === "text-blue" ? "bg-blue" : colors.accent === "text-green" ? "bg-green" : "bg-violet"}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Specializations (Level 2 only) */}
      {cert.specializations && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold">
              Choose Your Specialization
            </h2>
            <p className="mt-2 text-muted">
              Select one specialization track when you enroll. Each track tailors
              the exam to your specific robotics domain.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {cert.specializations.map((spec) => (
                <div
                  key={spec}
                  className="glass-card rounded-lg px-4 py-3 text-sm text-muted"
                >
                  {spec}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curriculum */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">Curriculum Overview</h2>
          <div className="mt-8 space-y-6">
            {cert.curriculum.map((module, idx) => (
              <div key={module.title} className="glass-card rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colors.badge}`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {module.title}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {module.topics.map((topic) => (
                        <li
                          key={topic}
                          className="flex items-start gap-2 text-sm text-muted"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-border" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Question */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">Sample Question</h2>
          <div className="mt-6 glass-card rounded-xl p-6">
            <p className="text-sm font-medium text-white">
              {cert.sampleQuestion.question}
            </p>
            <div className="mt-4 space-y-2">
              {cert.sampleQuestion.options.map((opt) => (
                <div
                  key={opt}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted"
                >
                  {opt}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-green/20 bg-green/5 px-4 py-3">
              <p className="text-sm font-semibold text-green">
                Correct Answer: {cert.sampleQuestion.answer}
              </p>
              <p className="mt-1 text-sm text-muted">
                {cert.sampleQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturer Endorsements */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">
            Manufacturer Endorsements
          </h2>
          <p className="mt-2 text-muted">
            Leading robotics manufacturers recognize the RCO credential as
            a standard for operator competency.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["Boston Dynamics", "Universal Robots", "FANUC", "ABB", "KUKA", "Locus Robotics", "Fetch Robotics", "Clearpath"].map(
              (name) => (
                <div
                  key={name}
                  className="glass rounded-lg p-4 text-center text-sm text-muted"
                >
                  {name}
                </div>
              )
            )}
          </div>
          <p className="mt-4 text-xs text-muted">
            Endorsement partnerships are in development. Manufacturer logos
            will appear here upon formal agreement.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold">
            Ready to earn your RCO Level {cert.level} {cert.name}?
          </h2>
          <p className="mt-4 text-muted">
            Join thousands of certified robotics professionals.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/certify/${cert.level}`}
              className={`inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-semibold text-white transition-colors ${colors.cta}`}
            >
              Enroll Now -- ${cert.price}
            </Link>
            <p className="text-xs text-muted">
              Pay yourself | Have employer pay
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
