import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface ProviderCardProps {
  slug: string;
  company_name: string;
  city: string | null;
  state: string | null;
  rating: number;
  review_count: number;
  specializations: string[];
  fulfillment_types: string[];
  response_time_hours: number | null;
  verified: boolean;
  insurance_verified: boolean;
  background_checked: boolean;
  is_founding_rsp?: boolean;
  founding_rsp_number?: number | null;
}

const fulfillmentIcons: Record<string, { label: string; icon: ReactNode }> = {
  with_operator: {
    label: "With Operator",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  drop_off: {
    label: "Drop Off",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  remote_operated: {
    label: "Remote",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
      </svg>
    ),
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn("h-3.5 w-3.5", star <= Math.round(rating) ? "text-[#C8FF00]" : "text-white/10")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ProviderCard({
  slug,
  company_name,
  city,
  state,
  rating,
  review_count,
  specializations,
  fulfillment_types,
  response_time_hours,
  verified,
  insurance_verified,
  background_checked,
  is_founding_rsp,
  founding_rsp_number,
}: ProviderCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-obsidian-surface p-5 transition-all hover:border-[#0EA5E9]/30 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href={`/robowork/providers/${slug}`}>
            <h3 className="font-sans text-base font-semibold text-text-primary group-hover:text-[#0EA5E9] transition-colors">
              {company_name}
              {is_founding_rsp && founding_rsp_number && (
                <span
                  className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000" }}
                >
                  Founding RSP #{founding_rsp_number}
                </span>
              )}
            </h3>
          </Link>
          {(city || state) && (
            <p className="mt-0.5 font-sans text-xs text-text-tertiary">
              {[city, state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
        {response_time_hours != null && (
          <span className="rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-text-secondary">
            {response_time_hours < 1 ? "<1h" : `${Math.round(response_time_hours)}h`} response
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={rating} />
        <span className="font-mono text-xs text-text-secondary">{Number(rating).toFixed(1)}</span>
        <span className="text-text-ghost text-xs">({review_count} review{review_count !== 1 ? "s" : ""})</span>
      </div>

      {/* Specializations */}
      {specializations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specializations.slice(0, 4).map((spec) => (
            <span
              key={spec}
              className="rounded-full bg-[#0EA5E9]/10 px-2.5 py-0.5 font-sans text-[10px] font-medium text-[#0EA5E9]"
            >
              {spec}
            </span>
          ))}
          {specializations.length > 4 && (
            <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 font-sans text-[10px] text-text-ghost">
              +{specializations.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Fulfillment types */}
      {fulfillment_types.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {fulfillment_types.map((ft) => {
            const info = fulfillmentIcons[ft];
            if (!info) return null;
            return (
              <span
                key={ft}
                className="flex items-center gap-1 rounded bg-white/[0.04] px-2 py-1 font-sans text-[10px] text-text-secondary"
              >
                {info.icon}
                {info.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Verification badges */}
      <div className="mt-4 flex items-center gap-2">
        {verified && (
          <span className="flex items-center gap-1 rounded-full bg-[#0EA5E9]/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#0EA5E9]">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            VERIFIED
          </span>
        )}
        {insurance_verified && (
          <span className="flex items-center gap-1 rounded-full bg-[#00E5A0]/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#00E5A0]">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            INSURED
          </span>
        )}
        {background_checked && (
          <span className="flex items-center gap-1 rounded-full bg-[#14B8A6]/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#14B8A6]">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
            </svg>
            BG CHECKED
          </span>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/robowork/providers/${slug}`}
        className="mt-4 block w-full rounded-lg border border-[#0EA5E9]/30 bg-[#0EA5E9]/5 py-2 text-center font-sans text-xs font-medium text-[#0EA5E9] transition-colors hover:bg-[#0EA5E9]/10"
      >
        View Profile
      </Link>
    </div>
  );
}
