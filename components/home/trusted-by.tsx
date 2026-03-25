"use client";

import { useEffect, useState } from "react";

interface Manufacturer {
  name: string;
  logo_url: string | null;
  website: string | null;
}

function getDomain(website: string | null): string | null {
  if (!website) return null;
  try {
    return new URL(website.startsWith("http") ? website : `https://${website}`).hostname.replace("www.", "");
  } catch {
    return null;
  }
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
      <section className="border-y border-white/[0.04] bg-white/[0.02] py-8">
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
          Featuring robots from leading manufacturers
        </p>
      </section>
    );
  }

  const items = [...companies, ...companies, ...companies];

  return (
    <section className="border-y border-white/[0.04] bg-white/[0.02] py-6">
      <p className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
        Featuring robots from leading manufacturers
      </p>
      <div className="logo-strip-mask relative overflow-hidden">
        <div className="logo-strip flex items-center gap-10 px-4">
          {items.map((company, i) => {
            const domain = getDomain(company.website);
            const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null;
            return (
              <div key={`${company.name}-${i}`} className="group flex flex-shrink-0 items-center gap-2.5">
                {faviconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={faviconUrl}
                    alt={company.name}
                    width={24}
                    height={24}
                    className="rounded-full border border-white/[0.08] bg-white/[0.06] opacity-40 transition-all duration-300 group-hover:opacity-90"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-[9px] font-bold text-white/30">
                    {company.name.charAt(0)}
                  </div>
                )}
                <span className="whitespace-nowrap text-xs text-white/25 transition-colors duration-300 group-hover:text-white/60">
                  {company.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
