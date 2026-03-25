import FirecrawlApp from "@mendable/firecrawl-js";

let instance: FirecrawlApp | null = null;

export function getFirecrawl(): FirecrawlApp {
  if (!instance) {
    const key = process.env.FIRECRAWL_API_KEY;
    if (!key) throw new Error("FIRECRAWL_API_KEY not set");
    instance = new FirecrawlApp({ apiKey: key });
  }
  return instance;
}
