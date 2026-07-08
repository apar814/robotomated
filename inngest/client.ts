import { Inngest } from "inngest";

/**
 * Env (added to Vercel by hand — never committed):
 * - INNGEST_EVENT_KEY    (send events in prod)
 * - INNGEST_SIGNING_KEY  (verify requests to /api/inngest; read automatically by serve())
 * Local dev needs neither — `npx inngest-cli dev` discovers the app unauthenticated.
 */
export const inngest = new Inngest({ id: "robotomated" });
