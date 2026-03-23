import * as Sentry from "@sentry/nextjs";

let initialized = false;

export function initSentry() {
  if (initialized) return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === "production",
  });

  initialized = true;
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  console.error(error);
  try {
    Sentry.captureException(error, { extra: context });
  } catch {
    // Silent fail
  }
}
