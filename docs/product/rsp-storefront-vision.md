# RSP Storefront Vision

## The Mental Model
Think Airbnb + Upwork + ZocDoc combined.
Businesses trust RSPs with their facility,
equipment, and people's safety.
The profile must prove trustworthiness
at every level.

## The 7 Profile Sections

### 1. Certifications
- RCO level, score, date, expiry
- Credential ID with verify link
- Third-party certs (OSHA, manufacturer)

### 2. Robot Familiarity
Three tiers:
- Expert: 3 dots — 2+ yrs, 15+ deployments
- Intermediate: 2 dots — 6+ months, 5+ jobs
- Familiar: 1 dot — trained, under 5 jobs

Auto-upgrade rules:
- Familiar → Intermediate: 5+ verified jobs
- Intermediate → Expert: 15+ jobs,
  2+ years, 5-star avg on those jobs

### 3. Capabilities
- Verified (confirmed by completed jobs)
- Self-reported (RSP claims, not yet verified)
- Categories: Deployment, Programming,
  Maintenance, Industries

### 4. Availability
- Real-time status (available/deployed)
- Fleet composition
- Service models offered
- Operating hours
- Geographic coverage map
- Current job load vs capacity

### 5. Verified Reviews
Post-job system captures:
- Star rating + written review
- Robot used, job type, duration
- Auto-captured metrics:
  uptime achieved, issues resolved,
  on-time delivery, rehire intent

### 6. Case Studies
- Challenge, result, metrics
- Robot types used
- Industry context
- Published only with RSP approval

### 7. Booking & Contact
- Post a job CTA
- Direct message
- Request quote
- Response time shown
- Next available date

## RSP Score Formula
Job completion rate: 25%
Average star rating: 25%
Response time score: 20%
Certification level: 15%
Uptime delivered: 15%

Score display:
- 80+: green
- 60-79: amber
- <60: red
- 90+: "Top 10% of RSPs" badge

## Database Tables Needed
- rsp_robot_familiarity
- rsp_capabilities
- rsp_reviews (upgrade existing)
- rsp_case_studies
- rsp_availability_schedule

## Auto-Verification Rules
Every completed Robotomated job:
1. Upgrades robot familiarity if threshold met
2. Adds verified review
3. Updates availability metrics
4. Recalculates RSP Score
5. Verifies capability claims

## The Strategic Payoff
When a business sees:
- RCO Master cert with score they can verify
- Expert in UR5e — 31 deployments, 4 years
- 47 verified reviews, 4.9 stars
- 98% on-time rate
- Zero safety incidents
- Available tomorrow

They book immediately.
No phone call. No reference check.
That is the Airbnb moment.
That is when the marketplace becomes
self-sustaining.

## Marketing Copy (use on founding-rsp page)
"Build your credibility automatically.
Every job you complete on Robotomated
verifies your capabilities, upgrades your
robot familiarity ratings, and adds to
your review score. The more you work,
the more you win."
