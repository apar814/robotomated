import type { Metadata } from "next";
import { EmployerIntentForm } from "./form";

export const metadata: Metadata = {
  title: "Hire Certified Robot Operators | Robotomated Workforce Network",
  description:
    "Access pre-vetted, certified robot operators for your automation needs. Robot technicians, cobot programmers, AMR fleet operators, drone pilots, and safety inspectors. No recruiting fees during launch.",
  openGraph: {
    title: "Hire Certified Robot Operators | Robotomated",
    description:
      "Access pre-vetted, certified robot operators. No recruiting fees during launch.",
    url: "https://robotomated.com/employers/hire-certified-operators",
    type: "website",
  },
};

const STATS = [
  { value: "975+", label: "Robots Tracked" },
  { value: "200+", label: "Manufacturers" },
  { value: "$45-75K", label: "Starting Salary" },
  { value: "4 weeks", label: "To Certified" },
];

const ROLE_TYPES = [
  {
    title: "Robot Technician",
    desc: "Install, maintain, troubleshoot industrial and service robots",
    demand: "High",
  },
  {
    title: "Cobot Programmer",
    desc: "Program collaborative robots for manufacturing and assembly",
    demand: "Very High",
  },
  {
    title: "AMR Fleet Operator",
    desc: "Manage autonomous mobile robot fleets in warehouses and logistics",
    demand: "High",
  },
  {
    title: "Drone Pilot",
    desc: "Operate commercial drones for inspection, surveying, delivery",
    demand: "Growing",
  },
  {
    title: "Safety Inspector",
    desc: "Audit robot installations for compliance and safety standards",
    demand: "Moderate",
  },
];

export default function EmployerHirePage() {
  return (
    <main className="min-h-screen bg-obsidian">
      {/* Hero */}
      <section className="px-4 pt-24 pb-16 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <p className="text-electric-blue font-mono text-sm tracking-widest uppercase mb-4">
          Robotomated Workforce Network
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
          Hire Pre-Vetted, Certified{" "}
          <span className="text-electric-blue">Robot Operators</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-4">
          Skip the recruiting black hole. We train and certify operators on the
          robots you actually use, then connect them directly to you.
        </p>
        <p className="text-base text-lime font-semibold mb-8">
          No recruiting fees during our launch period.
        </p>

        {/* Trust strip */}
        <p className="text-sm text-text-tertiary mb-8">
          Powered by Robotomated's database of 975+ robots and the platforms that run them
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-obsidian-surface border border-border rounded-lg p-4"
            >
              <p className="text-2xl font-bold text-electric-blue">
                {stat.value}
              </p>
              <p className="text-xs text-text-tertiary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          Roles We Certify Operators For
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLE_TYPES.map((role) => (
            <div
              key={role.title}
              className="bg-obsidian-surface border border-border rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-text-primary">
                  {role.title}
                </h3>
                <span className="text-xs font-mono text-lime bg-lime-dim px-2 py-0.5 rounded">
                  {role.demand}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section
        id="form"
        className="px-4 pb-24 sm:px-6 lg:px-8 max-w-2xl mx-auto"
      >
        <div className="bg-obsidian-surface border border-border rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Tell Us What You Need
          </h2>
          <p className="text-text-secondary mb-8">
            Three quick steps. We'll reach out within 24 hours.
          </p>
          <EmployerIntentForm />
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Robotomated Workforce Network — Employer Hiring",
            description:
              "Pre-vetted, certified robot operator hiring for manufacturing, warehousing, and automation companies.",
            provider: {
              "@type": "Organization",
              name: "Robotomated",
              url: "https://robotomated.com",
            },
            areaServed: "US",
            serviceType: "Robot Operator Staffing",
          }),
        }}
      />
    </main>
  );
}
