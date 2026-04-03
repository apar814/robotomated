import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface CredentialWithCert {
  id: string;
  credential_id: string;
  holder_name: string;
  holder_email: string;
  issued_at: string;
  expires_at: string | null;
  status: string;
  rco_certifications: {
    name: string;
    level: number;
  } | null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ credentialId: string }> }
) {
  try {
    const { credentialId } = await params;

    if (!credentialId) {
      return NextResponse.json(
        { error: "Credential ID is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: credential, error } = await supabase
      .from("rco_credentials")
      .select(
        "id, credential_id, holder_name, holder_email, issued_at, expires_at, status, rco_certifications(name, level)"
      )
      .eq("credential_id", credentialId)
      .single<CredentialWithCert>();

    if (error || !credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    const isExpired =
      credential.expires_at &&
      new Date(credential.expires_at) < new Date();

    return NextResponse.json({
      credential: {
        credentialId: credential.credential_id,
        holderName: credential.holder_name,
        certificationName: credential.rco_certifications?.name || "RCO Certification",
        level: credential.rco_certifications?.level || 0,
        issuedAt: credential.issued_at,
        expiresAt: credential.expires_at,
        status: isExpired ? "expired" : credential.status,
        verified: true,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
