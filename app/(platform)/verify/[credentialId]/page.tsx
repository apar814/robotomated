import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Verify Credential -- Robotomated Certified Operator",
  description:
    "Verify the authenticity of a Robotomated Certified Operator (RCO) credential.",
};

interface CredentialRow {
  id: string;
  credential_id: string;
  holder_name: string;
  issued_at: string;
  expires_at: string | null;
  status: string;
  rco_certifications: {
    name: string;
    level: number;
  } | null;
}

export default async function VerifyCredentialPage({
  params,
}: {
  params: Promise<{ credentialId: string }>;
}) {
  const { credentialId } = await params;

  const supabase = createServerClient();
  const { data: credential } = await supabase
    .from("rco_credentials")
    .select(
      "id, credential_id, holder_name, issued_at, expires_at, status, rco_certifications(name, level)"
    )
    .eq("credential_id", credentialId)
    .single<CredentialRow>();

  if (!credential) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="glass-card rounded-xl p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold text-white">
              Credential Not Found
            </h1>
            <p className="mt-3 text-sm text-muted">
              No credential matching{" "}
              <span className="font-mono text-white">{credentialId}</span>{" "}
              was found in our system. Please verify the credential ID and try
              again.
            </p>
            <Link
              href="/certify"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0A0F1E] hover:bg-white/90"
            >
              Learn About RCO
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">
            Verified by Robotomated
          </p>
        </div>
      </div>
    );
  }

  const isExpired =
    credential.expires_at && new Date(credential.expires_at) < new Date();
  const isActive = credential.status === "active" && !isExpired;
  const displayStatus = isExpired ? "expired" : credential.status;

  const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    active: { label: "Active", bg: "bg-green/10", text: "text-green" },
    expired: { label: "Expired", bg: "bg-yellow-500/10", text: "text-yellow-400" },
    revoked: { label: "Revoked", bg: "bg-red-500/10", text: "text-red-400" },
    suspended: { label: "Suspended", bg: "bg-orange-500/10", text: "text-orange-400" },
  };

  const statusInfo = STATUS_CONFIG[displayStatus] || STATUS_CONFIG.expired;

  const LEVEL_NAMES: Record<number, string> = {
    1: "Foundation",
    2: "Specialist",
    3: "Master",
    4: "Fleet Commander",
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="glass-card rounded-xl p-8">
          {/* Verification badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isActive && !isExpired ? (
                <svg
                  className="h-6 w-6 text-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
              <span className="text-sm font-medium text-muted">
                Credential Verification
              </span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Credential details */}
          <div className="mt-6 border-t border-border pt-6">
            <h1 className="font-display text-xl font-bold text-white">
              {credential.holder_name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {credential.rco_certifications?.name || "RCO Certification"}
            </p>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Credential ID</dt>
              <dd className="font-mono text-white">{credential.credential_id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Level</dt>
              <dd className="text-white">
                Level {credential.rco_certifications?.level || 0} --{" "}
                {LEVEL_NAMES[credential.rco_certifications?.level || 0] || "Unknown"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Issued</dt>
              <dd className="text-white">
                {new Date(credential.issued_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Expires</dt>
              <dd className={isExpired ? "text-yellow-400" : "text-white"}>
                {credential.expires_at
                  ? new Date(credential.expires_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No expiration"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Status</dt>
              <dd className={statusInfo.text}>{statusInfo.label}</dd>
            </div>
          </dl>
        </div>

        {/* Branding */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted">
            Verified by{" "}
            <Link href="/" className="text-white hover:underline">
              Robotomated
            </Link>
          </p>
          <p className="mt-1 text-xs text-muted">
            The industry standard for robotics operator certification.
          </p>
        </div>
      </div>
    </div>
  );
}
