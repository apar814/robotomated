import type { Metadata } from "next";
import Link from "next/link";

/* ══════════════════════════════════════════════
   Study path data for each level
   ══════════════════════════════════════════════ */

interface StudyModule {
  number: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  topics: { title: string; minutes: number }[];
  quizQuestions: number;
}

interface StudyLevelData {
  level: number;
  name: string;
  slug: string;
  color: string;
  badge: string;
  accent: string;
  cta: string;
  description: string;
  totalHours: number;
  modules: StudyModule[];
  examInfo: {
    questions: number;
    duration: number;
    passScore: number;
  };
}

const STUDY_LEVELS: Record<string, StudyLevelData> = {
  foundation: {
    level: 1,
    name: "Foundation",
    slug: "foundation",
    color: "blue",
    badge: "bg-white/10 text-white",
    accent: "text-white",
    cta: "border border-white/20 bg-white/5 hover:bg-white/10",
    description:
      "Master the core knowledge every robot operator needs. Safety, types, operations, diagnostics, and compliance.",
    totalHours: 14,
    examInfo: { questions: 80, duration: 90, passScore: 75 },
    modules: [
      {
        number: 1,
        title: "Robot Safety Fundamentals",
        description:
          "The most critical module. Master the safety protocols that keep humans and robots working together safely.",
        estimatedMinutes: 180,
        topics: [
          { title: "ISO 10218 Overview", minutes: 45 },
          { title: "Risk Assessment Methods (ISO 12100)", minutes: 60 },
          { title: "Emergency Procedures & E-Stop Systems", minutes: 30 },
          { title: "Lockout/Tagout for Robotic Systems", minutes: 45 },
          { title: "Safety Zone Design & Validation", minutes: 30 },
        ],
        quizQuestions: 15,
      },
      {
        number: 2,
        title: "Robot Types & Architecture",
        description:
          "Understand the full landscape of robotic systems — from warehouse AMRs to surgical robots to humanoids.",
        estimatedMinutes: 210,
        topics: [
          { title: "AMR vs AGV vs Cobot vs Industrial", minutes: 40 },
          { title: "Sensors Deep Dive (LIDAR, cameras, IMU, force/torque)", minutes: 60 },
          { title: "Actuators & Drive Systems", minutes: 45 },
          { title: "Compute & AI Hardware (NVIDIA, edge)", minutes: 50 },
          { title: "Degrees of Freedom & Kinematics Basics", minutes: 30 },
        ],
        quizQuestions: 15,
      },
      {
        number: 3,
        title: "Basic Deployment & Operations",
        description:
          "Learn how to commission, operate, and maintain robotic systems in real facilities.",
        estimatedMinutes: 180,
        topics: [
          { title: "Site Assessment & Workspace Setup", minutes: 40 },
          { title: "Robot Commissioning Procedures", minutes: 35 },
          { title: "HMI & Operator Interfaces", minutes: 30 },
          { title: "Basic Programming Concepts", minutes: 45 },
          { title: "Maintenance Schedules & Documentation", minutes: 30 },
        ],
        quizQuestions: 12,
      },
      {
        number: 4,
        title: "Basic Fault Diagnosis",
        description:
          "Identify and resolve the most common robot failures before they become incidents.",
        estimatedMinutes: 150,
        topics: [
          { title: "Error Code Interpretation", minutes: 30 },
          { title: "Sensor Failure Diagnosis", minutes: 35 },
          { title: "Connectivity Troubleshooting", minutes: 25 },
          { title: "Mechanical Jam Resolution", minutes: 30 },
          { title: "Diagnostic Procedures & Escalation", minutes: 30 },
        ],
        quizQuestions: 12,
      },
      {
        number: 5,
        title: "Compliance, Ethics & Documentation",
        description:
          "Navigate the regulatory landscape and build the documentation habits that protect you and your employer.",
        estimatedMinutes: 120,
        topics: [
          { title: "OSHA Regulations for Robotics", minutes: 25 },
          { title: "Safety Standards Overview (ISO, IEC)", minutes: 25 },
          { title: "Incident Reporting Requirements", minutes: 20 },
          { title: "Operator Liability & Data Privacy", minutes: 25 },
          { title: "Documentation Best Practices", minutes: 25 },
        ],
        quizQuestions: 10,
      },
    ],
  },
  specialist: {
    level: 2,
    name: "Specialist",
    slug: "specialist",
    color: "green",
    badge: "bg-white/10 text-white",
    accent: "text-white",
    cta: "border border-white/20 bg-white/5 hover:bg-white/10",
    description:
      "Deep expertise in programming, fleet management, fault diagnosis under pressure, and computer vision.",
    totalHours: 32,
    examInfo: { questions: 120, duration: 150, passScore: 78 },
    modules: [
      {
        number: 1,
        title: "Robot Programming & Control Systems",
        description:
          "Deep dive into ROS2, motion planning, trajectory optimization, and advanced control theory.",
        estimatedMinutes: 480,
        topics: [
          { title: "ROS2 Architecture & Node Design", minutes: 90 },
          { title: "Motion Planning Algorithms", minutes: 80 },
          { title: "Trajectory Optimization", minutes: 70 },
          { title: "PID & Force Control Tuning", minutes: 60 },
          { title: "Sensor Fusion Techniques", minutes: 60 },
          { title: "QoS Profiles & Safety-Critical Topics", minutes: 60 },
          { title: "Launch Files & System Configuration", minutes: 60 },
        ],
        quizQuestions: 20,
      },
      {
        number: 2,
        title: "Multi-Robot Fleet Operations",
        description:
          "Manage fleets of robots at scale — coordination, optimization, and real-time monitoring.",
        estimatedMinutes: 360,
        topics: [
          { title: "Fleet Coordination Algorithms", minutes: 60 },
          { title: "Task Allocation Strategies", minutes: 50 },
          { title: "Traffic Management & Deadlock Prevention", minutes: 60 },
          { title: "OTA Update Procedures", minutes: 50 },
          { title: "Uptime Optimization & KPI Tracking", minutes: 70 },
          { title: "Fleet Dashboard Design", minutes: 70 },
        ],
        quizQuestions: 18,
      },
      {
        number: 3,
        title: "Live Fault Diagnosis Under Pressure",
        description:
          "Debug edge cases and perform zero-downtime repairs in active production environments.",
        estimatedMinutes: 480,
        topics: [
          { title: "Edge Case Pattern Recognition", minutes: 80 },
          { title: "Zero-Downtime Repair Techniques", minutes: 80 },
          { title: "Mid-Shift Reprogramming", minutes: 70 },
          { title: "Hardware Failure Response", minutes: 80 },
          { title: "Sensor Drift Compensation", minutes: 60 },
          { title: "Actuator Degradation Diagnosis", minutes: 60 },
          { title: "Triage Under Time Pressure", minutes: 50 },
        ],
        quizQuestions: 22,
      },
      {
        number: 4,
        title: "Computer Vision & AI Integration",
        description:
          "Integrate perception systems and AI models into robotic platforms for real-world performance.",
        estimatedMinutes: 600,
        topics: [
          { title: "Point Cloud Processing", minutes: 80 },
          { title: "Object Detection Pipelines (YOLO, DETR)", minutes: 90 },
          { title: "Semantic Segmentation", minutes: 80 },
          { title: "Model Fine-Tuning for Robotics", minutes: 90 },
          { title: "Sim-to-Real Transfer Basics", minutes: 80 },
          { title: "Camera Calibration & Multi-Sensor Alignment", minutes: 60 },
          { title: "VLA Models Overview", minutes: 60 },
          { title: "Performance Benchmarking", minutes: 60 },
        ],
        quizQuestions: 22,
      },
    ],
  },
  master: {
    level: 3,
    name: "Master",
    slug: "master",
    color: "violet",
    badge: "bg-white/10 text-white",
    accent: "text-white",
    cta: "border border-white/20 bg-white/5 hover:bg-white/10",
    description:
      "Sim-to-real mastery, dexterous manipulation, world models, edge inference, and full-stack system architecture.",
    totalHours: 49,
    examInfo: { questions: 150, duration: 180, passScore: 82 },
    modules: [
      {
        number: 1,
        title: "Simulation to Reality Bridge",
        description:
          "Close the sim-to-real gap with advanced transfer learning, domain randomization, and adversarial testing.",
        estimatedMinutes: 720,
        topics: [
          { title: "Physics Engine Tuning (MuJoCo, Isaac Sim)", minutes: 120 },
          { title: "Domain Randomization Strategies", minutes: 100 },
          { title: "Adversarial Simulation Design", minutes: 100 },
          { title: "Reality Gap Analysis & Measurement", minutes: 80 },
          { title: "Neural Network Transfer Learning", minutes: 100 },
          { title: "Sim-to-Real Validation Frameworks", minutes: 80 },
          { title: "Continuous Sim-Real Feedback Loops", minutes: 80 },
          { title: "Case Study: Production Sim-to-Real Pipelines", minutes: 60 },
        ],
        quizQuestions: 25,
      },
      {
        number: 2,
        title: "Dexterous Manipulation",
        description:
          "Master fine motor control — from surgical precision to handling deformable objects.",
        estimatedMinutes: 900,
        topics: [
          { title: "High-DOF Hand Control (50+ DOF)", minutes: 120 },
          { title: "Deformable Object Manipulation", minutes: 100 },
          { title: "Force Feedback Systems Design", minutes: 100 },
          { title: "Surgical-Precision Tasks", minutes: 120 },
          { title: "Tool Use in Novel Environments", minutes: 100 },
          { title: "Tactile Sensing Integration", minutes: 80 },
          { title: "Grasp Planning Under Uncertainty", minutes: 100 },
          { title: "Teleoperation to Autonomy Transition", minutes: 80 },
          { title: "Benchmarks & Evaluation (NIST, YCB)", minutes: 100 },
        ],
        quizQuestions: 28,
      },
      {
        number: 3,
        title: "World Models & Scene Understanding",
        description:
          "Build and leverage world models for autonomous operation in novel environments.",
        estimatedMinutes: 720,
        topics: [
          { title: "Spatial Reasoning Architectures", minutes: 100 },
          { title: "Novel Environment Handling", minutes: 80 },
          { title: "Latent Action Spaces", minutes: 100 },
          { title: "Diffusion Policies for Robotics", minutes: 100 },
          { title: "End-to-End Autonomy (No Teleoperation)", minutes: 100 },
          { title: "Scene Graph Construction", minutes: 80 },
          { title: "Semantic Memory for Robots", minutes: 80 },
          { title: "Multi-Modal World Models", minutes: 80 },
        ],
        quizQuestions: 25,
      },
      {
        number: 4,
        title: "Edge Inference & System Architecture",
        description:
          "Optimize inference for edge deployment and design full-stack robot systems.",
        estimatedMinutes: 600,
        topics: [
          { title: "On-Device Inference Optimization", minutes: 80 },
          { title: "Model Compression (Quantization, Pruning, Distillation)", minutes: 80 },
          { title: "Distributed Compute Architectures", minutes: 80 },
          { title: "Hardware/Software Co-Design", minutes: 80 },
          { title: "Swarm Coordination Protocols", minutes: 80 },
          { title: "Full-Stack Robot System Design", minutes: 100 },
          { title: "Real-Time Performance at Scale", minutes: 100 },
        ],
        quizQuestions: 22,
      },
    ],
  },
  "fleet-commander": {
    level: 4,
    name: "Fleet Commander",
    slug: "fleet-commander",
    color: "amber",
    badge: "bg-white/10 text-white",
    accent: "text-white",
    cta: "border border-white/20 bg-white/5 hover:bg-white/10",
    description:
      "Program design, crisis management, business operations, and enterprise capstone preparation.",
    totalHours: 62,
    examInfo: { questions: 150, duration: 180, passScore: 85 },
    modules: [
      {
        number: 1,
        title: "Program Design & Training",
        description:
          "Design operator certification and training programs for your organization.",
        estimatedMinutes: 900,
        topics: [
          { title: "Competency Framework Design", minutes: 120 },
          { title: "Skills Gap Analysis Methods", minutes: 100 },
          { title: "Training Curriculum Development", minutes: 120 },
          { title: "Assessment Design & Validation", minutes: 120 },
          { title: "Continuous Education Programs", minutes: 100 },
          { title: "Training ROI Measurement", minutes: 80 },
          { title: "Cross-Cultural Training Considerations", minutes: 80 },
          { title: "Regulatory Training Requirements", minutes: 80 },
          { title: "Case Study: Building an Internal Academy", minutes: 100 },
        ],
        quizQuestions: 25,
      },
      {
        number: 2,
        title: "Crisis Management & Incident Command",
        description:
          "Lead response to multi-robot incidents, factory emergencies, and high-stakes situations.",
        estimatedMinutes: 720,
        topics: [
          { title: "Incident Command Structure for Robotics", minutes: 100 },
          { title: "Multi-Robot Emergency Response", minutes: 100 },
          { title: "Regulatory Reporting Procedures", minutes: 80 },
          { title: "PR & Communications During Incidents", minutes: 80 },
          { title: "Post-Incident Analysis (RCA)", minutes: 100 },
          { title: "Tabletop Exercise Design", minutes: 80 },
          { title: "Insurance & Liability Considerations", minutes: 80 },
          { title: "Case Study: Real-World Robot Incidents", minutes: 100 },
        ],
        quizQuestions: 25,
      },
      {
        number: 3,
        title: "Robot Business Operations",
        description:
          "Master the business side of large-scale robot deployments — economics, contracts, and scaling.",
        estimatedMinutes: 900,
        topics: [
          { title: "Fleet Economics & TCO Modeling", minutes: 120 },
          { title: "Contract Negotiation Strategies", minutes: 100 },
          { title: "Client Management & SLA Design", minutes: 100 },
          { title: "Scaling Robot Operations (10x)", minutes: 100 },
          { title: "Vendor Evaluation Frameworks", minutes: 80 },
          { title: "Capital vs RaaS Decision Analysis", minutes: 80 },
          { title: "Competitive Intelligence in Robotics", minutes: 80 },
          { title: "Revenue Modeling for Robot Services", minutes: 80 },
          { title: "Case Study: Building a $10M Robot Business", minutes: 80 },
        ],
        quizQuestions: 25,
      },
      {
        number: 4,
        title: "Enterprise Capstone Preparation",
        description:
          "Prepare for the Fleet Commander capstone — the ultimate test of strategic leadership.",
        estimatedMinutes: 1200,
        topics: [
          { title: "Enterprise Deployment Planning", minutes: 150 },
          { title: "Multi-Site Orchestration Strategy", minutes: 120 },
          { title: "ROI & Payback Period Modeling", minutes: 120 },
          { title: "Stakeholder Management & Executive Reporting", minutes: 100 },
          { title: "Compliance Framework Design", minutes: 100 },
          { title: "Integration Architecture Documentation", minutes: 120 },
          { title: "Risk Register Development", minutes: 100 },
          { title: "Presentation Skills for Panel Review", minutes: 100 },
          { title: "Practice Capstone: 4-Hour Mock Scenario", minutes: 240 },
          { title: "Peer Review & Feedback", minutes: 50 },
        ],
        quizQuestions: 30,
      },
    ],
  },
};

export function generateStaticParams() {
  return [
    { level: "foundation" },
    { level: "specialist" },
    { level: "master" },
    { level: "fleet-commander" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const data = STUDY_LEVELS[level];
  if (!data) return { title: "Study Path Not Found" };
  return {
    title: `RCO ${data.name} Study Path -- ${data.totalHours} Hours | Robotomated`,
    description: data.description,
  };
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default async function StudyLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const data = STUDY_LEVELS[level];

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">
            Study Path Not Found
          </h1>
          <p className="mt-4 text-muted">
            This study path does not exist.
          </p>
          <Link
            href="/certify/study"
            className="hover-btn-bl mt-6 inline-block rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            View All Study Paths
          </Link>
        </div>
      </div>
    );
  }

  const totalQuizQuestions = data.modules.reduce(
    (sum, m) => sum + m.quizQuestions,
    0
  );

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/certify/study"
            className="text-sm text-muted transition-colors hover:text-white"
          >
            &larr; All Study Paths
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold uppercase tracking-[0.1em] ${data.badge}`}
            >
              Level {data.level}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            {data.name} Study Path
          </h1>
          <p className="mt-4 text-muted">{data.description}</p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6 rounded-xl border border-border bg-[#0C0C0C] p-5">
            <div>
              <p className="text-xs text-muted">Total Time</p>
              <p className="font-display text-xl font-bold text-white">
                {data.totalHours}h
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-xs text-muted">Modules</p>
              <p className="font-display text-xl font-bold text-white">
                {data.modules.length}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-xs text-muted">Quiz Questions</p>
              <p className="font-display text-xl font-bold text-white">
                {totalQuizQuestions}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-xs text-muted">Exam</p>
              <p className="font-display text-xl font-bold text-white">
                {data.examInfo.questions}q / {data.examInfo.passScore}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          {data.modules.map((mod) => (
            <div
              key={mod.number}
              className="rounded-2xl border border-border bg-[#0A0A0A] p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${data.badge} font-[family-name:var(--font-brand)] text-lg font-bold`}
                >
                  {mod.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-white">
                        {mod.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        {mod.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-border px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-muted">
                      {formatMinutes(mod.estimatedMinutes)}
                    </span>
                  </div>

                  {/* Topics */}
                  <div className="mt-6 space-y-2">
                    {mod.topics.map((topic, idx) => (
                      <div
                        key={topic.title}
                        className="flex items-center justify-between rounded-lg border border-border/50 bg-[#0C0C0C] px-4 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-[family-name:var(--font-mono)] text-[13px] text-muted">
                            {mod.number}.{idx + 1}
                          </span>
                          <span className="text-sm text-muted">
                            {topic.title}
                          </span>
                        </div>
                        <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                          {formatMinutes(topic.minutes)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Module quiz */}
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-white/5 px-4 py-2.5">
                    <span className="text-sm font-medium text-white">
                      Module Quiz
                    </span>
                    <span className="text-xs text-muted">
                      {mod.quizQuestions} questions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold">
            Ready to practice?
          </h2>
          <p className="mt-4 text-muted">
            Unlimited practice questions from the {data.name} question bank.
            Study mode or test mode. Immediate feedback.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/certify/${data.level}`}
              className={`inline-flex items-center rounded-lg px-8 py-3 text-sm font-semibold text-white transition-all ${data.cta}`}
            >
              Take the Exam
            </Link>
            <Link
              href="/certify/study"
              className="inline-flex items-center rounded-lg border border-border px-8 py-3 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Other Study Paths
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
