# Google Search Console Setup — Robotomated

## Step 1: Add Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Choose **"URL prefix"** and enter: `https://robotomated.com`
4. Click "Continue"

## Step 2: Verify Ownership via DNS (Cloudflare)

Google will show you a TXT record to add. Here's how:

1. Copy the TXT verification string (looks like `google-site-verification=XXXXX`)
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Select the `robotomated.com` domain
4. Go to **DNS → Records → Add record**
5. Set:
   - **Type:** TXT
   - **Name:** `@`
   - **Content:** paste the verification string
   - **TTL:** Auto
6. Click "Save"
7. Go back to Google Search Console and click "Verify"
8. Wait 1-5 minutes for DNS propagation, then verify

**Alternative: Verify via Vercel**
If using Vercel's DNS instead of Cloudflare:
1. Go to Vercel Dashboard → your project → Settings → Domains
2. The CNAME/A records are already configured
3. Add the Google TXT record in Vercel's DNS settings

## Step 3: Submit Sitemap

1. In Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml`
3. Click "Submit"
4. Status should change to "Success" within a few minutes
5. Google will show the number of discovered URLs (should be 80+)

## Step 4: Request Indexing for Key Pages

1. Go to **URL Inspection** (top search bar)
2. Enter each URL and click "Request Indexing":
   - `https://robotomated.com`
   - `https://robotomated.com/explore`
   - `https://robotomated.com/advisor`
   - `https://robotomated.com/learn`
   - `https://robotomated.com/reviews`
   - `https://robotomated.com/best/consumer`
   - `https://robotomated.com/best/warehouse`
   - `https://robotomated.com/methodology`
3. Note: Google limits indexing requests. Do the most important pages first.

## Step 5: Validate Structured Data

1. Go to [Rich Results Test](https://search.google.com/test/rich-results)
2. Test these URLs:
   - A robot detail page (should show Product + BreadcrumbList)
   - A best-of page (should show Product + FAQ)
   - A manufacturer page (should show FAQ + BreadcrumbList)
3. Fix any errors flagged

## What to Monitor — First 30 Days

### Week 1
- [ ] **Coverage report** — Check for crawl errors (404s, 5xx, redirect loops)
- [ ] **Sitemaps** — Verify all URLs discovered and indexed
- [ ] **URL Inspection** — Check homepage and top pages are indexed
- [ ] **Mobile Usability** — Fix any mobile issues flagged

### Week 2
- [ ] **Performance report** — First impressions data starts appearing
- [ ] **Top queries** — See what search terms are driving impressions
- [ ] **Click-through rate** — Identify pages with high impressions but low CTR (title/description may need improvement)
- [ ] **Index coverage** — Ensure 80%+ of submitted URLs are indexed

### Week 3-4
- [ ] **Search queries** — Identify which robot names and categories are getting traction
- [ ] **Page experience** — Core Web Vitals data starts appearing
- [ ] **Links report** — Check for any external links pointing to the site
- [ ] **Compare impressions vs clicks** — Focus content efforts on high-impression, low-click pages

### Monthly Ongoing
- [ ] Submit updated sitemap if new robots/pages added
- [ ] Monitor for new crawl errors after each deploy
- [ ] Track keyword rankings for target terms:
  - "best robot vacuum 2026"
  - "warehouse robot comparison"
  - "cobot vs industrial robot"
  - "[manufacturer] robots"
  - "roboscore"
- [ ] Review "Enhancements" section for structured data issues
- [ ] Check "Core Web Vitals" for performance regressions

## Key Metrics to Track

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|-------------------|
| Pages indexed | 80+ | 500+ |
| Total impressions | 1,000+ | 50,000+ |
| Total clicks | 50+ | 5,000+ |
| Average CTR | 2%+ | 4%+ |
| Average position | Top 50 for target keywords | Top 20 |
| Crawl errors | < 5 | 0 |

## Common Issues and Fixes

**"Discovered — currently not indexed"**
- Normal for new sites. Google prioritizes crawling. Be patient.
- Ensure pages have unique content and aren't thin.

**"Crawled — currently not indexed"**
- Google crawled but chose not to index. Usually means thin content or duplicate.
- Add more unique content to the page.

**"Page with redirect"**
- Check that internal links don't point to URLs that redirect.
- Fix any chains (A → B → C should be A → C).

**Mobile usability issues**
- Common: "Clickable elements too close together" — add more padding.
- "Content wider than screen" — check for horizontal overflow.
