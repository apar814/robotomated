import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cacheGet } from "@/lib/cache/redis";

type ServiceStatus = "operational" | "degraded" | "down";

interface ServiceCheck {
  status: ServiceStatus;
  latency_ms?: number;
}

interface HealthResponse {
  status: ServiceStatus;
  services: {
    database: ServiceCheck;
    cache: ServiceCheck;
    payments: ServiceCheck;
    email: ServiceCheck;
    ai: ServiceCheck;
  };
  checked_at: string;
}

async function checkDatabase(): Promise<ServiceCheck> {
  const start = Date.now();
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("robots").select("id").limit(1);
    const latency_ms = Date.now() - start;
    if (error) return { status: "down", latency_ms };
    return { status: "operational", latency_ms };
  } catch {
    return { status: "down", latency_ms: Date.now() - start };
  }
}

async function checkCache(): Promise<ServiceCheck> {
  const start = Date.now();
  try {
    // cacheGet returns null both on miss and when Redis is unavailable;
    // if it doesn't throw, the connection layer is working (or unconfigured).
    await cacheGet("health:ping");
    const latency_ms = Date.now() - start;

    const hasConfig =
      !!process.env.UPSTASH_REDIS_REST_URL &&
      !!process.env.UPSTASH_REDIS_REST_TOKEN;

    return { status: hasConfig ? "operational" : "degraded", latency_ms };
  } catch {
    return { status: "down", latency_ms: Date.now() - start };
  }
}

function checkEnvService(key: string): ServiceCheck {
  return { status: process.env[key] ? "operational" : "degraded" };
}

export async function GET() {
  const [database, cache] = await Promise.all([
    checkDatabase(),
    checkCache(),
  ]);

  const payments = checkEnvService("STRIPE_SECRET_KEY");
  const email = checkEnvService("RESEND_API_KEY");
  const ai = checkEnvService("ANTHROPIC_API_KEY");

  const allServices = [database, cache, payments, email, ai];

  let overall: ServiceStatus = "operational";
  if (allServices.some((s) => s.status === "down")) {
    overall = "down";
  } else if (allServices.some((s) => s.status === "degraded")) {
    overall = "degraded";
  }

  const body: HealthResponse = {
    status: overall,
    services: { database, cache, payments, email, ai },
    checked_at: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=30",
    },
  });
}
