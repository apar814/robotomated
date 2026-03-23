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

  // Fallback while loading
  if (companies.length === 0) {
    return (
      <section className="border-y border-border/50 bg-[#F3F2EF] py-8">
        <p className="mb-6 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          Featuring robots from leading manufacturers
        </p>
      </section>
    );
  }

  return (
    <section className="border-y border-border/50 bg-[#F3F2EF] py-8">
      <p className="mb-6 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
        Featuring robots from leading manufacturers
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-12 px-4">
          {[...companies, ...companies].map((company, i) => (
            <div key={`${company.name}-${i}`} className="flex flex-shrink-0 items-center gap-3 opacity-60 transition-opacity hover:opacity-100">
              <CompanyLogo name={company.name} logoUrl={company.logo_url} size={32} />
              <span className="whitespace-nowrap text-sm text-neutral-500">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
