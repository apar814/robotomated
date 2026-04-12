import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Robot Service & Maintenance — Expert Support Anywhere | Robotomated",
  description:
    "Find certified robot technicians for preventive maintenance, emergency repair, calibration, training, integration, and inspection services.",
};

const SERVICE_CATEGORIES = [
  {
    name: "Preventive Maintenance",
    description:
      "Scheduled inspections and part replacements to maximize uptime and extend robot lifespan.",
    icon: "PM",
  },
  {
    name: "Emergency Repair",
    description:
      "24/7 rapid-response technicians for critical failures and unplanned downtime.",
    icon: "ER",
  },
  {
    name: "Calibration",
    description:
      "Precision calibration services to restore accuracy and maintain quality standards.",
    icon: "CA",
  },
  {
    name: "Training",
    description:
      "Operator and maintenance staff training programs tailored to your robot fleet.",
    icon: "TR",
  },
  {
    name: "Integration",
    description:
      "End-to-end integration support for new deployments and production line changes.",
    icon: "IN",
  },
  {
    name: "Inspection",
    description:
      "Comprehensive safety and compliance inspections with detailed reporting.",
    icon: "IS",
  },
] as const;

function ServiceRequestForm() {
  return (
    <form
      action="/api/service/request"
      method="POST"
      className="grid gap-6 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="brand" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Robot Brand
        </label>
        <input
          id="brand"
          name="brand"
          type="text"
          required
          placeholder="e.g. Fanuc, ABB, Universal Robots"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="model" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Robot Model
        </label>
        <input
          id="model"
          name="model"
          type="text"
          required
          placeholder="e.g. CRX-10iA, UR10e"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="service_type"
          className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
        >
          Service Type
        </label>
        <select
          id="service_type"
          name="service_type"
          required
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#00C2FF] focus:outline-none"
        >
          <option value="">Select a service</option>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="urgency" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Urgency
        </label>
        <select
          id="urgency"
          name="urgency"
          required
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#00C2FF] focus:outline-none"
        >
          <option value="">Select urgency</option>
          <option value="low">Low - Within 2 weeks</option>
          <option value="medium">Medium - Within 3 days</option>
          <option value="high">High - Within 24 hours</option>
          <option value="critical">Critical - Immediate</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label
          htmlFor="description"
          className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Describe the issue or service needed..."
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          placeholder="City, State or ZIP"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Contact Email
        </label>
        <input
          id="contact"
          name="contact"
          type="email"
          required
          placeholder="you@company.com"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full rounded-lg bg-[#00C2FF] px-8 py-3 font-display font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00C2FF]/80"
        >
          Request Service
        </button>
      </div>
    </form>
  );
}

export default function ServicePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Service", href: "/service" },
        ]}
      />

      <section className="mt-8 text-center">
        <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
          [ OPERATE CHANNEL ]
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Expert robot service. Anywhere.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Connect with certified technicians for maintenance, repair,
          calibration, and more. Keep your fleet running at peak performance.
        </p>
      </section>

      <section className="mt-16">
        <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
          [ SERVICE TYPES ]
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-white">
          Service Categories
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="glass rounded-xl border border-white/10 p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7B2FFF]/20 font-[family-name:var(--font-mono)] text-sm font-bold text-[#7B2FFF]">
                {cat.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-white">
                {cat.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="request" className="mt-20">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
            [ REQUEST FORM ]
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">
            Request Service
          </h2>
          <p className="mt-2 text-muted">
            Tell us about your robot and the service you need. A certified
            technician will respond within 24 hours.
          </p>
          <div className="mt-8">
            <ServiceRequestForm />
          </div>
        </div>
      </section>
    </main>
  );
}
