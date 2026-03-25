"use client";

import { useEffect, useState } from "react";
import { CompanyLogo } from "@/components/ui/company-logo";

interface Manufacturer {
  name: string;
  logo_url: string | null;
}

export function TrustedBy() {
  const [companies, setCompanies] = useState<Manufacturer[]>([]);

  useEffect(() => {
    fetch("/api/manufacturers/top")
      .then((r) => r.json())
      .then((data) => setCompanies(data.manufacturers || []))
      .catch(() => {});
  }, []);

  if (companies.length === 0) {
    return (
      <section className="border-y border-border/50 bg-[#F3F2EF] py-8">
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          Featuring robots from leading manufacturers
        </p>
      </section>
    );
  }

  // Triple the list for seamless loop on wide screens
  const items = [...companies, ...companies, ...companies];

  return (
    <section className="border-y border-border/50 bg-[#F3F2EF] py-6">
      <p className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
        Featuring robots from leading manufacturers
      </p>
      <div className="logo-strip-mask relative overflow-hidden">
        <div className="logo-strip flex items-center gap-10 px-4">
          {items.map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className="group flex h-[28px] flex-shrink-0 items-center"
            >
              <CompanyLogo
                name={company.name}
                logoUrl={company.logo_url}
                height={28}
                maxWidth={120}
                className="grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
