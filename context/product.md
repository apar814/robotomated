# Robotomated — Product

## Five Core Modules

### Module 1: RoboIntel (AI Purchase Advisor) — BUILD FIRST
Claude-powered conversational advisor. Trained on structured robot data,
user preferences, use-case matching, and real-time pricing.
- Conversational onboarding: "Tell me what you want robots to help with"
- 200+ mapped use cases (household → surgical assistance)
- Constraint matching: budget, space, skill, connectivity, environment
- "Is This Right For Me" personalized fit score (0-100 per robot per user)
- Comparison engine: side-by-side specs, sentiment, expert score
- ROI calculator for commercial/enterprise use cases
- Purchase timing: price history, upcoming releases, seasonal trends
- Multi-robot orchestration planning (household or enterprise fleet)

### Module 2: RoboReview (Expert + Community Reviews) — BUILD FIRST
The Wirecutter of robotics. Structured, rigorous, reproducible.
- Expert reviews: staff + contracted robotics engineers
- Community reviews: verified purchase badge, structured form
- Video reviews: embedded with timestamped insight cards
- Comparative reviews: head-to-head standardized benchmarks
- Long-term reviews: 3/6/12-month follow-ups
- Enterprise reviews: IT admin, fleet manager, operator perspectives
- Target: 50 at launch, 500 by end of Year 1

### Module 3: RoboMarket (Buy/Sell/Trade) — Phase 2
Purpose-built robotics marketplace.
- New: direct from manufacturer and authorized resellers
- Certified refurbished: Robotomated-inspected, re-warranted
- Peer-to-peer: consumer-to-consumer with escrow
- Enterprise surplus: bulk decommissioning listings
- Parts & accessories: sensors, actuators, batteries, frames
- Services: installation, training, maintenance partners
- Price history, fair value score, condition grading (5-tier)

### Module 4: RoboLearn (Education) — Phase 2
Every knowledge level, from "What is a robot?" to custom manipulation
tasks on a 7-DOF arm.
- Consumer: setup, maintenance, troubleshooting, optimization
- Enthusiast: hardware hacking, custom programming, projects
- Professional: fleet management, integration, vendor assessment
- Developer: SDK, API, robot app development
- Student: curriculum-aligned K-12 and university

### Module 5: RoboConnect (Developer/Enterprise) — Phase 3
API, integrations, and ecosystem hub.
- Public API for third-party integration
- Manufacturer data feed portal
- Enterprise fleet management dashboard
- White-label licensing for retailers/distributors/OEMs

## RoboScore (Proprietary Scoring — 8 Dimensions)

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Performance | 25% | Task completion, speed, accuracy |
| Reliability | 20% | MTBF, error rate, recovery behavior |
| Ease of Use | 15% | Setup time, learning curve, app quality |
| Intelligence | 15% | AI capability, adaptability, edge-case handling |
| Value | 10% | Price/performance, TCO over 3 years |
| Ecosystem | 8% | Integrations, SDK, community, support |
| Safety | 5% | Certifications, fail-safes, physical safety |
| Design | 2% | Form factor, noise, ergonomics |

Methodology is PUBLIC. Every score is EXPLAINABLE.
AI aids review process but NEVER replaces editorial judgment.
Human-in-the-loop for all final scores.

## Content Production Engine (Phase 1 — THE Priority)
- "Best Of" guides per category, refreshed quarterly
- Robot release calendar (track every announced product)
- Weekly newsletter "The Robotomated Brief"
- YouTube channel: in-depth reviews, comparisons, lab demos
- Programmatic SEO pages for every robot model
- Target: 10,000 high-intent keywords at launch
- Target: 500K organic monthly visits by Month 12

## Build Phases

### Phase 1: Foundation + Content (Days 1-90) — $10K Budget
Sprint 1 (Days 1-30): Next.js site live, Supabase DB, 200 seed robots,
  browse + search, SEO infrastructure
Sprint 2 (Days 31-60): First 10 expert reviews, 5 "Best Of" guides,
  5 beginner articles per target industry, newsletter signup
Sprint 3 (Days 61-90): AI advisor (Claude-powered), comparison tool,
  affiliate links activated. Target: $500-2K MRR by Day 90.

### Phase 2: Community + Marketplace (Months 4-9)
Community reviews, Pro subscription ($49/mo), marketplace soft launch,
referral program, manufacturer launch partnerships, influencer program.

### Phase 3: Enterprise + Scale (Months 10+)
Enterprise SaaS ($2,499+/mo), white-label licensing, market intelligence
reports, conference presence, channel partner program.

## Robot Database
Start: 200 robots across 10 categories (seed)
Month 6: 2,000 | Month 12: 8,000 | Year 3: 25,000+
Categories: home, humanoid, educational, service/commercial,
hobby/DIY, agricultural, industrial, healthcare, construction, military

## Database Schema (Core Tables)
robots: id, slug, name, manufacturer_id, category_id, specs JSONB,
  description, images, robo_score, sub_scores JSONB, created_at
manufacturers: id, slug, name, country, founded_year, website, verified
robot_categories: id, slug, name, parent_id, use_case_tags, icon
reviews: id, robot_id, reviewer_id, type (expert|community),
  robo_score, sub_scores JSONB, body, published_at
marketplace_listings: id, robot_id, seller_id, condition, price,
  quantity, listing_type (new|used|refurb), status
users: id, email, name, persona_type, preferences JSONB,
  subscription_tier, created_at
advisor_conversations: id, user_id, messages JSONB,
  final_recommendations JSONB, created_at
price_history: id, robot_id, retailer_id, price, currency, recorded_at
