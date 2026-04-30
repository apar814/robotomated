import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollButton } from "@/components/certify/enroll-button";
import { CERT_BY_SLUG, DETAIL_SLUGS, type CertLevel } from "@/lib/certifications";

/* ══════════════════════════════════════════════
   Detail-page-only data (curriculum, sample Qs)
   keyed by slug — pricing comes from canonical source
   ══════════════════════════════════════════════ */

interface DetailData {
  tagline: string;
  description: string;
  whoItsFor: string[];
  curriculum: { title: string; topics: string[] }[];
  specializations?: { name: string; focus: string; robots: string }[];
  gauntletRounds?: { title: string; time: string; pass: string }[];
  sampleQuestion: {
    type: string;
    question: string;
    context?: string;
    options: string[];
    answer: string;
    explanation: string;
  };
}

const DETAIL: Record<string, DetailData> = {
  foundation: {
    tagline: "Your entry point into professional robotics",
    description:
      "The RCO Foundation validates core robotics knowledge. Designed for anyone entering the robotics field. No prior experience required. You will be tested on safety, types, operations, diagnostics, and compliance across 80 questions in 90 minutes.",
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
          "ISO 10218 and ISO/TS 15066 standards",
          "Risk assessment methods (ISO 12100)",
          "Emergency procedures and E-Stop systems",
          "Lockout/tagout for robotic systems",
          "Safety zone design and validation",
        ],
      },
      {
        title: "Robot Types & Architecture",
        topics: [
          "AMR vs AGV vs Cobot vs Industrial arms",
          "Sensors: LIDAR, cameras, IMU, force/torque",
          "Actuators, drive systems, and batteries",
          "Compute hardware and AI accelerators",
          "Degrees of freedom and basic kinematics",
        ],
      },
      {
        title: "Basic Deployment & Operations",
        topics: [
          "Site assessment and workspace setup",
          "Robot commissioning procedures",
          "HMI and operator interfaces",
          "Basic programming concepts",
          "Maintenance schedules and documentation",
        ],
      },
      {
        title: "Basic Fault Diagnosis",
        topics: [
          "Error code interpretation",
          "Sensor failure diagnosis",
          "Connectivity troubleshooting",
          "Mechanical jam resolution",
          "Diagnostic procedures and escalation",
        ],
      },
      {
        title: "Compliance, Ethics & Documentation",
        topics: [
          "OSHA regulations for robotics",
          "Safety standards overview (ISO, IEC)",
          "Incident reporting requirements",
          "Operator liability and data privacy",
          "Documentation best practices",
        ],
      },
    ],
    sampleQuestion: {
      type: "Fault Diagnosis",
      question:
        "A UR5e cobot performing a palletizing task enters protective stop 3 times per hour. Force data shows spikes to 42N (threshold: 40N) during the final placement. The task runs flawlessly in simulation. What should you investigate FIRST?",
      options: [
        "A. Recalibrate the force/torque sensor",
        "B. Check TCP calibration \u2014 physical tool offset may differ from simulation",
        "C. Increase the force threshold to 50N",
        "D. Replace the end-of-arm gripper",
      ],
      answer: "B",
      explanation:
        "When a real robot triggers protective stops that don\u2019t occur in simulation, the most likely cause is a physical calibration mismatch. TCP (Tool Center Point) drift of even 0.5mm changes contact geometry enough to exceed force thresholds at the point of contact. Recalibrating the sensor (A) treats the symptom. Increasing the threshold (C) is dangerous \u2014 safety limits exist for a reason.",
    },
  },
  specialist: {
    tagline: "Deep expertise in your chosen robotics domain",
    description:
      "The RCO Specialist validates deep expertise in a specific robotics domain. Choose one of 7 specializations. 120 questions in 150 minutes plus 2 practical simulation scenarios.",
    whoItsFor: [
      "Experienced operators seeking specialization",
      "Technicians focused on specific robot categories",
      "Team leads responsible for category-specific deployments",
      "Engineers transitioning to hands-on robotics roles",
      "Professionals seeking manufacturer partner credentials",
    ],
    curriculum: [
      {
        title: "Robot Programming & Control Systems",
        topics: [
          "ROS2 architecture and node design",
          "Motion planning algorithms",
          "Trajectory optimization",
          "PID and force control tuning",
          "Sensor fusion techniques",
          "QoS profiles for safety-critical topics",
        ],
      },
      {
        title: "Multi-Robot Fleet Operations",
        topics: [
          "Fleet coordination algorithms",
          "Task allocation strategies",
          "Traffic management and deadlock prevention",
          "OTA update procedures",
          "KPI tracking and uptime optimization",
        ],
      },
      {
        title: "Live Fault Diagnosis Under Pressure",
        topics: [
          "Edge case pattern recognition",
          "Zero-downtime repair techniques",
          "Mid-shift reprogramming",
          "Hardware failure response",
          "Sensor drift compensation",
        ],
      },
      {
        title: "Computer Vision & AI Integration",
        topics: [
          "Point cloud processing",
          "Object detection pipelines (YOLO, DETR)",
          "Semantic segmentation",
          "Model fine-tuning for robotics",
          "Camera calibration and multi-sensor alignment",
        ],
      },
    ],
    specializations: [
      { name: "AMR Specialist", focus: "Autonomous Mobile Robots", robots: "Locus, 6 River, Fetch, Kiva" },
      { name: "Cobot Specialist", focus: "Collaborative Robots", robots: "UR, FANUC CRX, ABB GoFa" },
      { name: "Industrial Arm", focus: "High-speed Industrial", robots: "FANUC, KUKA, ABB, Yaskawa" },
      { name: "Drone Operations", focus: "Commercial Drones & UAVs", robots: "DJI Matrice, Agras, Skydio" },
      { name: "Humanoid (2026)", focus: "Humanoid Robots", robots: "Figure, 1X NEO, Digit" },
      { name: "Medical Robot", focus: "Robots in Healthcare", robots: "Aethon TUG, Moxi, Penny" },
      { name: "Eldercare", focus: "Care Environments", robots: "PARO, Labrador, TUG" },
    ],
    sampleQuestion: {
      type: "Code Review",
      question:
        "Identify the CRITICAL safety failures in this ROS2 emergency stop node:",
      context: `class EmergencyStop(Node):
  def __init__(self):
    super().__init__('emergency_stop')
    self.sub = self.create_subscription(
      LaserScan, 'scan', self.scan_cb, 10)
    self.pub = self.create_publisher(
      Twist, 'cmd_vel', 10)
    self.threshold = 0.5

  def scan_cb(self, msg):
    min_dist = min(msg.ranges)
    if min_dist < self.threshold:
      stop = Twist()
      self.pub.publish(stop)`,
      options: [
        "A. No QoS profile \u2014 messages may be dropped",
        "B. min(msg.ranges) includes inf values which evaluate incorrectly",
        "C. No latching on stop command \u2014 robot may resume",
        "D. Threshold hardcoded \u2014 cannot be adjusted",
        "E. No handling of NaN values in ranges",
      ],
      answer: "A, B, C, E",
      explanation:
        "Critical: inf values make min() return a finite value only when ALL readings are finite, but inf readings should indicate open space \u2014 a NaN reading makes min() return NaN which fails the comparison silently. Best-effort QoS can drop the stop command under load. Publishing one Twist() then silence means the velocity controller may resume.",
    },
  },
  master: {
    tagline: "You survive chaos. You handle what nobody trained you for.",
    description:
      "The RCO Master is the highest technical certification. 150 questions in 3 hours PLUS The Gauntlet \u2014 a 2-hour live assessment with 4 rounds of real-time fault injection, zero-downtime operations, novel deployment, and code review.",
    whoItsFor: [
      "Senior operators managing complex deployments",
      "Automation engineers pushing the state of the art",
      "Fleet architects designing large-scale systems",
      "Technical directors overseeing robotics programs",
      "Consultants who need to prove they can do the work",
    ],
    gauntletRounds: [
      { title: "Fault Injection", time: "30 min", pass: "Fix 4 of 5 injected faults" },
      { title: "Zero Downtime", time: "30 min", pass: "Zero production stoppages" },
      { title: "Novel Environment", time: "30 min", pass: "Robot completes task in unknown env" },
      { title: "Code Review & Fix", time: "30 min", pass: "Fix all safety-critical bugs" },
    ],
    curriculum: [
      {
        title: "Simulation to Reality Bridge",
        topics: [
          "Physics engine tuning (MuJoCo, Isaac Sim)",
          "Domain randomization strategies",
          "Adversarial simulation design",
          "Neural network transfer learning",
          "Reality gap measurement and closure",
        ],
      },
      {
        title: "Dexterous Manipulation & Fine Motor",
        topics: [
          "High-DOF hand control (50+ DOF)",
          "Deformable object manipulation",
          "Force feedback and tactile sensing",
          "Surgical-precision task execution",
          "Tool use in novel environments",
        ],
      },
      {
        title: "World Models & Scene Understanding",
        topics: [
          "Spatial reasoning architectures",
          "Latent action spaces",
          "Diffusion policies for robotics",
          "End-to-end autonomy (no teleoperation)",
          "Scene graph construction",
        ],
      },
      {
        title: "Edge Inference & System Architecture",
        topics: [
          "On-device inference optimization",
          "Model compression techniques",
          "Distributed compute architectures",
          "Hardware/software co-design",
          "Swarm coordination protocols",
        ],
      },
    ],
    sampleQuestion: {
      type: "Fault Diagnosis Scenario",
      question:
        "You\u2019re operating a Locus Origin AMR fleet in a 400,000 sq ft DC. It\u2019s 2:47 AM during peak season. Robot LR-047 stops mid-path: NAV_LOCALIZATION_FAILURE_047, LIDAR_SCAN_DEVIATION: 340%, Battery: 67%. The robot cannot be physically reached for 8 minutes due to fork traffic. What is your FIRST action?",
      options: [
        "A. Immediately send remote restart command",
        "B. Check if other robots in Zone C show similar LIDAR deviations",
        "C. Pull the robot\u2019s last 50 position logs to identify deviation start point",
        "D. Declare the robot offline and reroute all Zone C traffic immediately",
      ],
      answer: "C",
      explanation:
        "Before taking action, you must understand WHEN the deviation began. If it started suddenly (impact/reflective surface) vs gradually (accumulating error), the fix differs entirely. A remote restart mid-error risks compounding position uncertainty. Rerouting traffic (D) may be needed but only after diagnosis.",
    },
  },
  "fleet-commander": {
    tagline: "Enterprise fleet operations and automation strategy",
    description:
      "The highest RCO credential. 150 situational questions in 3 hours PLUS a 4-hour capstone simulation, written case study submission, and panel review interview. You design and run 1,000-robot deployments for Fortune 500 companies.",
    whoItsFor: [
      "Directors of automation and robotics",
      "VP-level operations leaders",
      "CTOs evaluating robotics investments",
      "Enterprise consultants specializing in automation",
      "Robotics program managers at Fortune 500 scale",
    ],
    curriculum: [
      {
        title: "Program Design & Training",
        topics: [
          "Competency framework design",
          "Skills gap analysis methods",
          "Training curriculum development",
          "Assessment design and validation",
          "Continuous education programs",
        ],
      },
      {
        title: "Crisis Management & Incident Command",
        topics: [
          "Incident command structure for robotics",
          "Multi-robot emergency response",
          "Regulatory reporting procedures",
          "PR and communications during incidents",
          "Post-incident analysis (RCA)",
        ],
      },
      {
        title: "Robot Business Operations",
        topics: [
          "Fleet economics and TCO modeling",
          "Contract negotiation strategies",
          "Client management and SLA design",
          "Scaling robot operations (10x)",
          "Vendor evaluation frameworks",
        ],
      },
      {
        title: "Enterprise Capstone Preparation",
        topics: [
          "Enterprise deployment planning",
          "Multi-site orchestration strategy",
          "ROI and payback period modeling",
          "Risk register development",
          "Panel presentation skills",
        ],
      },
    ],
    sampleQuestion: {
      type: "Enterprise Scenario",
      question:
        "FreshMart Grocery (200 stores) is deploying 800+ robots: shelf scanning, customer service, overnight cleaning, inventory, and security. Budget: $12M/3yr. Staff: 2,000 with union considerations. What is the correct deployment sequence?",
      options: [
        "A. Deploy cleaning robots first \u2014 lowest customer interaction risk, highest ROI",
        "B. Deploy shelf scanning first \u2014 immediate inventory accuracy ROI, data foundation for other systems",
        "C. Deploy all functions simultaneously in 10 pilot stores",
        "D. Deploy security robots first \u2014 after-hours means zero customer interaction",
      ],
      answer: "B",
      explanation:
        "Shelf scanning provides immediate, measurable inventory accuracy ROI (typically 2-5% inventory shrinkage reduction). Critically, it generates the spatial mapping data and store layout intelligence that all subsequent robot functions need. Starting with cleaning (A) gives ROI but no data foundation. Simultaneous deployment (C) concentrates risk and overwhelms training capacity. Security (D) has lower ROI priority.",
    },
  },
};

/* ─── Static params for slug-based routes ─── */

export function generateStaticParams() {
  return DETAIL_SLUGS.map((slug) => ({ level: slug }));
}

/* ─── Metadata ─── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const cert = CERT_BY_SLUG[level];
  if (!cert) return { title: "Certification Not Found" };
  return {
    title: `RCO Level ${cert.level}: ${cert.name} -- ${cert.tag} | Robotomated`,
    description: DETAIL[level]?.description ?? cert.proves,
  };
}

/* ─── Page ─── */

export default async function CertificationDetailPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const cert = CERT_BY_SLUG[level];
  const detail = DETAIL[level];

  if (!cert || !detail) {
    notFound();
  }

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/certify"
            className="text-sm text-muted transition-colors hover:text-white"
          >
            &larr; All Certifications
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-border bg-white/5 px-3 py-1 text-[13px] font-bold uppercase tracking-[0.1em] text-white">
              Level {cert.level}
            </span>
            <span className="font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.1em] text-muted">
              {cert.tag}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            RCO {cert.name}
          </h1>
          <p className="mt-2 text-lg text-muted">{detail.tagline}</p>
          <p className="mt-6 leading-relaxed text-muted">{detail.description}</p>

          {/* Exam details bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-border bg-[#0C0C0C] p-5 sm:grid-cols-5">
            <div>
              <p className="text-xs text-muted">Price</p>
              <p className="font-display text-xl font-bold text-white">
                ${cert.price}
              </p>
              <p className="text-[13px] text-muted">RSP: ${cert.rspPrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Questions</p>
              <p className="font-display text-xl font-bold text-white">
                {cert.questions}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Duration</p>
              <p className="font-display text-xl font-bold text-white">
                {cert.duration} min
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Pass Score</p>
              <p className="font-display text-xl font-bold text-white">
                {cert.passScore}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Study Time</p>
              <p className="font-display text-xl font-bold text-white">
                {cert.studyHours}h
              </p>
            </div>
          </div>

          {/* Assessment badges */}
          {cert.hasGauntlet && (
            <div className="mt-4 rounded-lg border border-border bg-white/[0.02] px-4 py-3">
              <p className="text-sm font-semibold text-white">
                + THE GAUNTLET: 2-hour live assessment (4 rounds)
              </p>
              <p className="mt-1 text-xs text-muted">
                Fault injection, zero-downtime, novel environment, code review
              </p>
            </div>
          )}
          {cert.hasPractical && (
            <div className="mt-4 rounded-lg border border-border bg-white/[0.02] px-4 py-3">
              <p className="text-sm font-semibold text-white">
                + 2 practical simulation scenarios (60 min total)
              </p>
            </div>
          )}
          {cert.hasCapstone && (
            <div className="mt-4 rounded-lg border border-border bg-white/[0.02] px-4 py-3">
              <p className="text-sm font-semibold text-white">
                + 4-hour capstone simulation + case study + panel review
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <EnrollButton slug={cert.slug} price={cert.price} rspPrice={cert.rspPrice} />
            <Link
              href={`/certify/study/${cert.slug}`}
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Preview Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHAT IT PROVES ═══ */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">What It Proves</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {cert.proves}
          </p>
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">Who This Is For</h2>
          <ul className="mt-6 space-y-3">
            {detail.whoItsFor.map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ DOMAIN WEIGHTS ═══ */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">Exam Domains</h2>
          <p className="mt-2 text-sm text-muted">
            Questions are weighted across these domains:
          </p>
          <div className="mt-6 space-y-3">
            {cert.domains.map((d) => (
              <div key={d.name} className="flex items-center gap-4">
                <div className="h-3 flex-1 rounded-full bg-border">
                  <div
                    className="h-3 rounded-full bg-white/40"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="w-44 text-sm text-muted">{d.name}</span>
                <span className="w-10 text-right font-[family-name:var(--font-mono)] text-sm font-bold text-white">
                  {d.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPECIALIZATIONS ═══ */}
      {detail.specializations && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold">
              Choose Your Specialization
            </h2>
            <p className="mt-2 text-muted">
              Select one track when you enroll. The exam and practical are
              tailored to your domain.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {detail.specializations.map((spec) => (
                <div
                  key={spec.name}
                  className="rounded-xl border border-border bg-[#0A0A0A] p-4"
                >
                  <h3 className="font-display text-base font-bold text-white">
                    {spec.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {spec.focus}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    Key robots: {spec.robots}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ THE GAUNTLET ═══ */}
      {detail.gauntletRounds && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold">
              The Gauntlet
            </h2>
            <p className="mt-2 text-muted">
              4 rounds. 2 hours. No second chances.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {detail.gauntletRounds.map((r, idx) => (
                <div
                  key={r.title}
                  className="rounded-xl border border-border bg-[#0A0A0A] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white/20">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                      {r.time}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-white">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">Pass: {r.pass}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CURRICULUM ═══ */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">
            Curriculum Overview
          </h2>
          <div className="mt-8 space-y-6">
            {detail.curriculum.map((module, idx) => (
              <div key={module.title} className="rounded-xl border border-border bg-[#0A0A0A] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-bold text-white">
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

      {/* ═══ SAMPLE QUESTION ═══ */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">Sample Question</h2>
          <p className="mt-1 text-xs text-muted">
            Type: {detail.sampleQuestion.type}
          </p>
          <div className="mt-6 rounded-xl border border-border bg-[#0A0A0A] p-6">
            {detail.sampleQuestion.context && (
              <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-[#0C0C0C] p-4 font-mono text-xs leading-relaxed text-muted">
                {detail.sampleQuestion.context}
              </pre>
            )}
            <p className="text-sm font-medium leading-relaxed text-white">
              {detail.sampleQuestion.question}
            </p>
            <div className="mt-4 space-y-2">
              {detail.sampleQuestion.options.map((opt) => (
                <div
                  key={opt}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted"
                >
                  {opt}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-border bg-white/[0.02] px-4 py-3">
              <p className="text-sm font-semibold text-white">
                Correct: {detail.sampleQuestion.answer}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {detail.sampleQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CAREER OUTCOMES ═══ */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold">Career Outcomes</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {cert.careers.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-4 text-lg font-semibold text-white">
            Average salary increase: {cert.salaryBump}
          </p>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold">
            Ready to earn your RCO {cert.name}?
          </h2>
          <p className="mt-4 text-muted">
            {cert.prerequisites === "None"
              ? "No prerequisites. Start today."
              : `Requires ${cert.prerequisites}.`}
            {cert.renewalYears > 0 && ` Renewal every ${cert.renewalYears} years.`}
          </p>
          <div className="mt-8">
            <EnrollButton slug={cert.slug} price={cert.price} rspPrice={cert.rspPrice} />
          </div>
        </div>
      </section>
    </div>
  );
}
