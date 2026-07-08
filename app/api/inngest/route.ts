import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { ingestNews } from "@/inngest/functions/ingest-news";

// Inngest handler — INNGEST_SIGNING_KEY (Vercel env) authenticates requests in prod.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [ingestNews],
});
