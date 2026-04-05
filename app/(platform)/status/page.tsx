import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { cacheGet } from "@/lib/cache/redis";
import { StatusBoard } from "./status-board";

export const metadata: Metadata = {
  title: "System Status -- Robotomated",
  description:
    "Real-time operational status of Robotomated services including database, cache, payments, email, and AI.",
  openGraph: {
    title: "System Status -- Robotomated",
    description: "Real-time operational status of all Robotomated services.",
    url: "https://robotomated.com/status",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

type ServiceStatus = "operational" | "degraded" | "down";

interface ServiceCheck {
  status: ServiceStatus;
  latency_ms?: number;
}

interface HealthData {
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

async function getHealthData(): Promise<HealthData> {
  // Check database
  let database: ServiceCheck;
  const dbStart = Date.now();
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("robots").select("id").limit(1);
    const latency_ms = Date.now() - dbStart;
    database = error
      ? { status: "down", latency_ms }
      : { status: "operational", latency_ms };
  } catch {
    database = { status: "down", latency_ms: Date.now() - dbStart };
  }

  // Check cache
  let cache: ServiceCheck;
  const cacheStart = Date.now();
  try {
    await cacheGet("health:ping");
    const latency_ms = Date.now() - cacheStart;
    const hasConfig =
      !!process.env.UPSTASH_REDIS_REST_URL &&
      !!process.env.UPSTASH_REDIS_REST_TOKEN;
    cache = { status: hasConfig ? "operational" : "degraded", latency_ms };
  } catch {
    cache = { status: "down", latency_ms: Date.now() - cacheStart };
  }

  const payments: ServiceCheck = {
    status: process.env.STRIPE_SECRET_KEY ? "operational" : "degraded",
  };
  const email: ServiceCheck = {
    status: process.env.RESEND_API_KEY ? "operational" : "degraded",
  };
  const ai: ServiceCheck = {
    status: process.env.ANTHROPIC_API_KEY ? "operational" : "degraded",
  };

  const allServices = [database, cache, payments, email, ai];
  let overall: ServiceStatus = "operational";
  if (allServices.some((s) => s.status === "down")) {
    overall = "down";
  } else if (allServices.some((s) => s.status === "degraded")) {
    overall = "degraded";
  }

  return {
    status: overall,
    services: { database, cache, payments, email, ai },
    checked_at: new Date().toISOString(),
  };
}

export default async function StatusPage() {
  const data = await getHealthData();
  return <StatusBoard initialData={data} />;
}
