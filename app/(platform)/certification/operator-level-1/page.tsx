import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { EnrollButton } from "./enroll-button";

export const metadata: Metadata = {
  title: "Operator Level 1 Certification — $399 Early Bird | Robotomated",
  description:
    "Become a Robotomated Certified Operator in 4 weeks. Hybrid live + self-paced. 10 hrs/week. $45-75K starting salary. Placement assistance included. No prerequisites.",
  openGraph: {
    title: "Operator Level 1 Certification | Robotomated",
    description:
      "Become a certified robot operator in 4 weeks. $45-75K starting salary. Placement assistance included.",
    url: "https://robotomated.com/certification/operator-level-1",
    type: "website",
  },
};

const MODULES = [
  {
    num: 1,
    title: "Robot Fundamentals & Safety Protocols",
    topics: [
      "Types of robots: industrial, collaborative, mobile, aerial",
      "Safety standards: ISO 10218, TS 15066, OSHA requirements",
      "Emergency stop procedures and lockout/tagout",
      "Risk assessment for robot workcells",
    ],
  },
  {
    num: 2,
    title: "Industrial Robots",
    topics: [
      "Articulated, SCARA, delta, and cartesian robot architectures",
      "End-of-arm tooling selection and integration",
      "Basic programming concepts: waypoints, I/O, motion types",
      "Cell layout and safety fencing design",
    ],
  },
  {
    num: 3,
    title: "Cobots & AMRs",
    topics: [
      "Collaborative robot setup, calibration, and teach pendant programming",
      "Pick-and-place, palletizing, machine tending tasks",
      "Autonomous mobile robot navigation and fleet management",
      "Route optimization and traffic management",
    ],
  },
  {
    num: 4,
    title: "Programming & Operation",
    topics: [
      "Hands-on cobot programming exercises",
      "AMR fleet software operation and monitoring",
      "Common failure modes and field troubleshooting",
      "Preventive maintenance schedules",
    ],
  },
  {
    num: 5,
    title: "Job Readiness & Certification Exam",
    topics: [
      "Resume workshop: positioning robotics skills for employers",
      "Interview preparation: technical and behavioral",
      "Practical assessment: timed multi-robot scenario (The Gauntlet)",
      "Written certification exam (70% passing score)",
    ],
  },
];

const FAQ = [
  {
    q: "What salary can I expect after certification?",
    a: "Certified robot operators typically start at $45,000-$75,000 depending on role type and location. Specialized roles like cobot programmers and AMR fleet managers are at the higher end. The Bureau of Labor Statistics projects 25%+ growth in automation-related roles through 2030.",
  },
  {
    q: "Are there any prerequisites?",
    a: "None. The program is designed for career changers and people new to robotics. We recommend completing our free Level 0 Robot Awareness quiz first to build familiarity, but it is not required.",
  },
  {
    q: "What does placement assistance include?",
    a: "After certification, we connect you with employers in our Workforce Network who are actively hiring. We help with resume optimization, interview prep, and direct introductions to hiring managers. There are never any fees to students.",
  },
  {
    q: "Is placement guaranteed?",
    a: "Placement is a feature of the program, not a guarantee. We work directly with employers to match certified operators to open roles, and our goal is 100% placement. However, hiring decisions ultimately rest with employers. We are transparent about this.",
  },
  {
    q: "What is the schedule and time commitment?",
    a: "About 10 hours per week for 4 weeks. Live sessions run Tuesdays and Thursdays, 7-9 PM ET. Self-paced modules unlock each Monday and can be done on your own schedule. The certification exam is in Week 4.",
  },
  {
    q: "Is this online or in-person?",
    a: "Hybrid. Live instructor-led sessions are conducted via video call. Practical assessments use our simulation environment. No travel required. All you need is a computer with a webcam and stable internet.",
  },
  {
    q: "What if I don't pass the exam?",
    a: "You get one free retake included with your enrollment. The exam requires a 70% passing score. Most students who complete the coursework pass on the first attempt.",
  },
  {
    q: "What is the refund policy?",
    a: "Full refund within 7 days of enrollment if your cohort has not yet started. After the cohort begins, we offer a 50% refund if you withdraw within the first week. No refunds after Week 1.",
  },
];

export default async function OperatorLevel1Page({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const params = await searchParams;
  const supabase = createServerClient();

  // Get active cohort
  const { data: cohort } = await supabase
    .from("cohorts")
    .select("*")
    .eq("status", "open")
    .order("start_date", { ascending: true })
    .limit(1)
    .single();

  const spotsLeft = cohort ? cohort.capacity - cohort.enrolled_count : 0;
  const isEarlyBird = cohort ? cohort.enrolled_count < 10 : false;
  const price = isEarlyBird ? 399 : 599;

  const startDate = cohort
    ? new Date(cohort.start_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "TBD";

  return (
    <main className="min-h-screen bg-obsidian">
      {/* Canceled notice */}
      {params.canceled && (
        <div className="bg-amber/10 border-b border-amber/20 px-4 py-3 text-center">
          <p className="text-sm text-amber">
            Checkout was canceled. Your spot is still reserved. Ready when you are.
          </p>
        </div>
      )}

      {/* Hero */}
      <section className="px-4 pt-24 pb-16 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <p className="text-electric-blue font-mono text-sm tracking-widest uppercase mb-4">
          Robotomated Certified Operator
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
          Become a Certified{" "}
          <span className="text-electric-blue">Robot Operator</span> in 4 Weeks
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-2">
          $45-75K starting roles. No prerequisites. Placement assistance included.
        </p>
        <p className="text-base text-text-tertiary max-w-xl mx-auto mb-8">
          The robotics industry needs operators now. Companies are deploying
          cobots, AMRs, and drones faster than they can hire people to run them.
        </p>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto bg-obsidian-surface border border-electric-blue/30 rounded-xl p-8 mb-8">
          {isEarlyBird && cohort && (
            <p className="text-lime font-mono text-sm mb-2">
              Early Bird — {cohort.capacity - cohort.enrolled_count} of{" "}
              {cohort.capacity} seats left
            </p>
          )}
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="text-4xl font-bold text-text-primary">
              ${price}
            </span>
            {isEarlyBird && (
              <span className="text-text-tertiary line-through text-lg">
                $599
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm mb-6">
            One-time payment. Placement assistance included.
          </p>
          <EnrollButton />
          {cohort && (
            <p className="text-xs text-text-tertiary mt-3">
              {cohort.name} starts {startDate} · {spotsLeft} spot
              {spotsLeft !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { v: "4 weeks", l: "Program Length" },
            { v: "10 hrs/wk", l: "Time Commitment" },
            { v: "70%", l: "Passing Score" },
            { v: "$45-75K", l: "Starting Salary" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-obsidian-surface border border-border rounded-lg p-3"
            >
              <p className="text-lg font-bold text-electric-blue">{s.v}</p>
              <p className="text-xs text-text-tertiary">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          5-Module Curriculum
        </h2>
        <div className="space-y-4">
          {MODULES.map((mod) => (
            <div
              key={mod.num}
              className="bg-obsidian-surface border border-border rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-electric-blue/10 text-electric-blue font-mono text-sm px-3 py-1 rounded-full">
                  Module {mod.num}
                </span>
                <h3 className="font-semibold text-text-primary">{mod.title}</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {mod.topics.map((topic) => (
                  <li
                    key={topic}
                    className="text-sm text-text-secondary flex gap-2"
                  >
                    <span className="text-electric-blue shrink-0">-</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Cohort Callout */}
      {cohort && (
        <section className="px-4 pb-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-obsidian-surface border border-lime/20 rounded-xl p-8 text-center">
            <p className="text-lime font-mono text-sm mb-2">Next Cohort</p>
            <p className="text-2xl font-bold text-text-primary mb-2">
              {cohort.name}
            </p>
            <p className="text-text-secondary mb-4">
              Starts {startDate} · {spotsLeft} of {cohort.capacity} seats
              remaining
            </p>
            <div className="max-w-xs mx-auto bg-obsidian rounded-full h-3 mb-2">
              <div
                className="bg-electric-blue rounded-full h-3 transition-all"
                style={{
                  width: `${(cohort.enrolled_count / cohort.capacity) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-text-tertiary">
              {cohort.enrolled_count} enrolled
            </p>
          </div>
        </section>
      )}

      {/* Social Proof Placeholder */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-obsidian-surface border border-border rounded-xl p-8 text-center">
          <p className="text-electric-blue font-mono text-sm mb-2">
            Employer Network
          </p>
          <p className="text-xl font-bold text-text-primary mb-2">
            Companies Are Already Asking for Certified Operators
          </p>
          <p className="text-text-secondary max-w-xl mx-auto">
            Our Workforce Network connects you directly with employers hiring
            robot technicians, cobot programmers, and AMR fleet operators. Your
            certification puts you at the front of the line.
          </p>
          {cohort && (
            <p className="text-sm text-text-tertiary mt-4">
              First cohort starting {startDate}. Testimonials coming soon.
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="bg-obsidian-surface border border-border rounded-lg p-5"
            >
              <h3 className="font-semibold text-text-primary mb-2">{item.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8 max-w-md mx-auto text-center">
        <EnrollButton />
        <p className="text-xs text-text-tertiary mt-3">
          Secure checkout via Stripe. Full refund within 7 days if cohort hasn't
          started.
        </p>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "Robotomated Certified Operator — Level 1",
            description:
              "4-week hybrid certification program for robot operators. Covers cobot operation, AMR fleet management, safety protocols, and practical assessment.",
            provider: {
              "@type": "Organization",
              name: "Robotomated",
              url: "https://robotomated.com",
            },
            offers: {
              "@type": "Offer",
              price: price.toString(),
              priceCurrency: "USD",
              availability:
                spotsLeft > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/SoldOut",
            },
            courseMode: "blended",
            duration: "P4W",
            hasCourseInstance: cohort
              ? {
                  "@type": "CourseInstance",
                  name: cohort.name,
                  startDate: cohort.start_date,
                  endDate: cohort.end_date,
                  courseMode: "blended",
                }
              : undefined,
          }),
        }}
      />
    </main>
  );
}
