import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createApiKey, revokeApiKey, getApiKeys } from "@/lib/api/key-manager";

/* ------------------------------------------------------------------ */
/*  Auth helper — extract user from Supabase JWT                       */
/* ------------------------------------------------------------------ */

async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return user;
}

/* ------------------------------------------------------------------ */
/*  GET — List user's API keys (prefix only, never full key)           */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const keys = await getApiKeys(user.id);
    return NextResponse.json({ keys });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/*  POST — Create new API key (key shown once in response)             */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Key name is required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Key name must be 100 characters or fewer" },
        { status: 400 }
      );
    }

    const result = await createApiKey(user.id, name, "free");
    return NextResponse.json(
      { key: result.key, keyId: result.keyId },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE — Revoke an API key                                         */
/* ------------------------------------------------------------------ */

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const keyId = typeof body.keyId === "string" ? body.keyId : "";

    if (!keyId) {
      return NextResponse.json(
        { error: "keyId is required" },
        { status: 400 }
      );
    }

    const result = await revokeApiKey(keyId, user.id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
