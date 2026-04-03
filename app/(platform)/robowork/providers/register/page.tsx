import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RegisterProviderForm } from "@/components/robowork/register-provider-form";

export const metadata: Metadata = {
  title: "Register as a Robot Service Provider — RoboWork",
  description:
    "Join the RoboWork marketplace as a robot service provider. List your fleet, set your rates, and connect with businesses that need automation.",
  openGraph: {
    title: "Become a RoboWork Provider",
    description: "List your robot fleet and connect with businesses that need automation.",
  },
};

export default function RegisterProviderPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "RoboWork", href: "/robowork" },
              { name: "Providers", href: "/robowork/providers" },
              { name: "Register", href: "/robowork/providers/register" },
            ]}
          />
          <p className="mt-6 font-mono text-[9px] tracking-widest uppercase text-text-ghost">
            PROVIDER REGISTRATION
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold text-text-primary sm:text-4xl">
            Become a RoboWork Provider
          </h1>
          <p className="mt-3 max-w-xl font-sans text-sm text-text-secondary">
            List your robot fleet, set your rates, and connect with businesses that need automation.
            Registration takes about 5 minutes.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <RegisterProviderForm />
        </div>
      </section>
    </div>
  );
}
