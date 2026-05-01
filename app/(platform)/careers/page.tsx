import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CareersClient } from "./careers-client";

export const metadata: Metadata = {
  title: "Careers in Robotics — Training, Certification & Talent Network | Robotomated",
  description:
    "The automation economy needs a workforce. Join our training waitlist for roles like Robot Technician, Drone Pilot, and Fleet Manager — or access our talent network for certified robotics operators.",
  openGraph: {
    title: "Careers in Robotics — Training, Certification & Talent Network | Robotomated",
    description:
      "Training programs and talent placement for the robotics workforce. Robot Technicians, Drone Pilots, Cobot Programmers, and more.",
    url: "https://robotomated.com/careers",
    type: "website",
  },
};

export default function CareersPage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Careers in Robotics",
          description: "Training and talent network for the robotics workforce.",
          url: "https://robotomated.com/careers",
          publisher: { "@type": "Organization", name: "Robotomated" },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A0F1E] px-4 pb-20 pt-14">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1E]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Careers", href: "/careers" },
            ]}
          />
          <p className="mt-8 font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-white">
            Workforce Development
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            The Automation Economy Needs a Workforce
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/50">
            Robots are changing every industry. The people who build, operate,
            and maintain them are the most valuable workers of the next decade.
            We&apos;re building the training and job placement network to get you
            there.
          </p>
        </div>
      </section>

      {/* Two columns + manufacturer CTA */}
      <CareersClient />
    </div>
  );
}
