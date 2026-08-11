# Claims Inventory — /learn MDX Articles — 2026-08-11

Point-in-time, document-only audit of all 225 pre-existing MDX articles
under `content/learn/`, per docs/claims-policy.md. **Nothing has been
changed** — this is the backlog, ranked by risk, following the pattern of
docs/claims-inventory-2026-08-03.md. Audited by five parallel read-only
passes covering every file; Tier-1 items are listed individually with
file and line below.

## Totals

| Directory group | Files | Tier 1 items | Tier 2 instances | Tier 3 items | Clean files |
|---|---|---|---|---|---|
| guides, home, delivery, retail, hospitality | 42 | 28 | 142 (33 files) | 5 | 8 |
| vs, security, inspection, agricultural | 47 | 102 | 668 (47 files) | 48 | 0 |
| cost, market | 44 | 96 | ~537 (44 files) | 7 | 0 |
| warehouse, humanoid, getting-started | 47 | 54 | 171 (44 files) | 7 | 2 |
| manufacturing, medical, problems, construction | 45 | 85 | ~375 (44 files) | 29 | 1 |
| **TOTAL** | **225** | **365** | **~1,893** | **96** | **11** |

Only 11 of 225 files are clean. Tier definitions: **Tier 1** —
unattributed quotes; named real companies/institutions with unsourced
metrics; clinical or safety outcome claims; salary/earnings claims.
**Tier 2** — unsourced market statistics, adoption percentages,
projections, ROI/payback figures, multipliers. **Tier 3** —
illustrative content not visibly labeled as illustrative.

## Patterns worth naming (why this is worse than volume alone)

1. **Fabricated named-institution clinical studies.** "A 2025 study at
   Johns Hopkins found a 17% reduction in hospital-acquired infections";
   "Houston Methodist data: 53% reduction in C. diff, 44% MRSA, $1.2M";
   a "2025 meta-analysis of 18 studies" complete with an invented 95%
   confidence interval. Several ship inside FAQ frontmatter that renders
   as FAQPage JSON-LD — fabricated clinical claims marked up for search
   engines. This is the policy's named worst case.
2. **Invented federal-agency statistics.** "OSHA issued over $4.2M in
   robotics citations, up 35%"; "OSHA recorded 340 AGV incidents, eleven
   fatal" (OSHA publishes no such series); an unsupported "$46/hour" BLS
   attribution anchoring an entire ROI model.
3. **Fake verification methodology.** One case-study article claims "we
   verified data through site visits, financial documentation, and
   interviews… this is not vendor marketing data" above five invented
   anonymous case studies — a fabricated claim of editorial diligence.
4. **Internal contradictions proving generation.** Zipline "over 1
   million" vs "over 65 million" deliveries in the same file; Physical
   Intelligence funding stated three different ways across files; two
   different global market sizes for 2026. One caught contradiction
   discredits every other number.
5. **Stale/false company facts.** Defunct companies (Abundant Robotics,
   Root AI) presented as actively deploying; an invented top-20 revenue
   leaderboard assigning precise revenues to private companies.

## Suggested order of attack

1. Medical/clinical Tier-1 strips (fabricated hospital studies and
   infection-outcome claims, incl. their FAQ-frontmatter/JSON-LD copies)
   — same-day class, mirrors the Tier-2b treatment of problems.ts.
2. Safety-record and federal-agency fabrications (OSHA/BLS/NHTSA-class
   attributions) — these impersonate authoritative sources.
3. The vs/ directory clinical-comparison files (surgical outcomes
   tables) and the warehouse "verified case study" file — candidates for
   removal or full illustrative-relabel rather than line edits.
4. market/ leaderboards and funding/market-size figures — source from
   checkable filings or cut.
5. Tier-2 sweeps per directory; Tier-3 relabeling last.

---

# Full findings by directory group


## Group 1: guides, home, delivery, retail, hospitality

# MDX Claims Audit — content/learn/{guides,home,delivery,retail,hospitality} (42 files)
Audited 2026-08-11 against docs/claims-policy.md (four-bucket rule). READ-ONLY; no repo files modified.

## TIER 1 (individual items)
- content/learn/delivery/delivery-robots-last-mile-2026.mdx:36 — [named-company-metric] "With over 7 million completed deliveries across university campuses... Starship has more real-world delivery data" — vendor scale metric stated as fact, no source
- content/learn/delivery/delivery-robots-last-mile-2026.mdx:48 — [named-company-metric] "Kiwibot v4 has carved out a strong position... with over 500 units deployed across US universities" — unsourced deployment count
- content/learn/delivery/delivery-robots-last-mile-2026.mdx:64 — [named-company-metric] "Coco... Los Angeles, where it has completed hundreds of thousands of deliveries" — unsourced volume claim
- content/learn/delivery/sidewalk-delivery-robots-guide.mdx:25 — [clinical-safety-outcome] "There have been no serious pedestrian injuries reported across millions of deliveries" — safety outcome claim (rendered FAQ), no source; highest-risk category
- content/learn/delivery/sidewalk-delivery-robots-guide.mdx:67 — [named-company-metric] "Starship 6M+ | Kiwibot 500K+ | Serve 200K+ | Coco 100K+" (Deliveries Completed table, lines 67-70) — per-vendor volume metrics, no source
- content/learn/delivery/sidewalk-delivery-robots-guide.mdx:74 — [named-company-metric] "over 6 million deliveries completed across 50+ US college campuses" — Starship scale claim, no source
- content/learn/delivery/sidewalk-delivery-robots-guide.mdx:147 — [named-company-metric] "Amazon, FedEx, and UPS are all testing sidewalk robots for package delivery" — likely false/stale: Amazon Scout and FedEx Roxo were shut down in 2022
- content/learn/delivery/delivery-robots-for-university-campus.mdx:18 — [named-company-metric] "Starship Technologies charges $5,000 to $8,000 per robot per month. Kiwibot... $2,000 to $4,000" — unpublished vendor pricing asserted as fact (rendered FAQ; repeated in table line 69)
- content/learn/delivery/delivery-robots-for-university-campus.mdx:75 — [named-company-metric] "Student satisfaction | 4.7/5 average [Starship] | 4.4/5 average [Kiwibot]" — invented satisfaction scores attributed to named vendors
- content/learn/retail/retail-shelf-scanning-robots.mdx:42 — [named-company-metric] "Deployed in thousands of stores... Tally has scanned billions of shelf positions" — Simbe scale metrics, no source
- content/learn/retail/robots-for-retail-inventory.mdx:88 — [named-company-metric] "Simbe Robotics (Tally) — ... deployed in over 100 retail chains globally" — unsourced
- content/learn/retail/store-fulfillment-robots.mdx:137 — [named-company-metric] "Walmart has deployed over 200 in-store MFCs... Target and Best Buy are expanding pick-assist AMR deployments" — unsourced; Walmart actually retreated from Alert Innovation MFCs — likely false
- content/learn/hospitality/restaurant-robots-guide-2026.mdx:53 — [named-company-metric] "Keenon DinerBot T10 is the most widely deployed... over 80,000 units operating in 60+ countries" — unsourced vendor scale claim
- content/learn/hospitality/hotel-robot-concierge-guide.mdx:45 — [named-company-metric] "Over 600 hotels globally including Hilton, Marriott, Hyatt... More than 3 million autonomous deliveries" — Relay scale metrics, no source
- content/learn/hospitality/hotel-robot-concierge-guide.mdx:63 — [named-company-metric] "Hotels deploying Relay report 85-92% positive guest interaction ratings" — outcome metric tied to named vendor, no attributable source
- content/learn/hospitality/hotel-robot-concierge-guide.mdx:69 — [unattributed-quote] "Three major chains report 5-8% higher repeat booking rates among guests who interacted with robots" — testimonial-style metric from unnamed companies (policy: unnamed company = indistinguishable from fabrication)
- content/learn/hospitality/hotel-robot-concierge-guide.mdx:105 — [named-company-metric] "Major chains including Hilton, Marriott, and Hyatt have moved from pilots to regional deployment programs, confirming that early ROI data supports expansion" — unsourced claim about named chains' internal data
- content/learn/hospitality/hotel-cleaning-robots-guide.mdx:46 — [named-company-metric] "Whiz (SoftBank Robotics) — The most widely deployed... with over 15,000 units globally" — unsourced
- content/learn/hospitality/hotel-cleaning-robots-guide.mdx:85 — [clinical-safety-outcome] "254nm UVC light for pathogen elimination (99.9% kill rate for most bacteria and viruses)" — disinfection efficacy claim without peer-reviewed sourcing (policy: clinical outcomes are highest-risk)
- content/learn/guides/how-to-buy-a-surgical-robot.mdx:31 — [named-company-metric] "The da Vinci platform has the deepest evidence base (12+ million procedures)" — checkable Intuitive figure but unsourced in text
- content/learn/guides/robot-fleet-management-basics.mdx:90 — [salary-earnings] "Robot technician... Budget $60,000-$85,000 annual salary" (and line 92: automation engineer "$90,000-$130,000") — robotics-job salary figures stated as fact, no source (lower severity: employer budgeting context)
- content/learn/guides/how-to-buy-an-eldercare-robot.mdx:28 — [clinical-safety-outcome] "Over 30 peer-reviewed studies support its efficacy in reducing behavioral and psychological symptoms of dementia" (PARO; repeated in table line 39) — clinical efficacy claim, no named citation
- content/learn/guides/how-to-buy-an-eldercare-robot.mdx:45 — [named-company-metric] "ElliQ has strong engagement data showing that users interact with it an average of 30+ times per day" — vendor metric, no source
- content/learn/guides/how-to-buy-an-eldercare-robot.mdx:67 — [clinical-safety-outcome] "This model has shown strong results in reducing social isolation and emergency room visits" — clinical/utilization outcome claim, no source
- content/learn/guides/how-to-buy-a-construction-robot.mdx:27 — [named-company-metric] "This category is production-proven and deployed on hundreds of commercial construction sites" (Dusty FieldPrinter) — unsourced scale claim
- content/learn/guides/robot-safety-assessment-guide.mdx:29 — [named-company-metric] "In 2025, OSHA issued over $4.2 million in citations related to robotic equipment, a 35% increase over 2024" — named institution (OSHA) with unsourced, likely invented enforcement statistics
- content/learn/guides/robot-leasing-vs-buying.mdx:22 — [named-company-metric] "buyout options... typically at 40 to 60% of original purchase price... Locus Robotics, 6 River Systems, and Fetch Robotics all offer conversion options in their standard contracts" — unsourced contract terms attributed to named vendors (Fetch no longer sells standalone)
- content/learn/guides/how-to-buy-a-delivery-robot.mdx:19 — [named-company-metric] "Starship Technologies alone has completed over 6 million autonomous deliveries" — unsourced

## TIER 2 (per file)
- content/learn/home/robot-lawn-mower-guide-2026.mdx — 1 instance — worst: line 18 "North American sales grew 28% in 2025"
- content/learn/delivery/delivery-robots-last-mile-2026.mdx — 7 instances — worst: line 120 "By 2027-2028, the industry consensus projects that delivery robots will be cost-competitive" (invented future, no named source; also 26, 98, 116, 126, 136, 140)
- content/learn/delivery/sidewalk-delivery-robots-guide.mdx — 6 instances — worst: line 32 "Last-mile delivery... accounts for 53% of total shipping costs" (also 23, 28, 53, 109, 127)
- content/learn/delivery/delivery-robots-for-university-campus.mdx — 8 instances — worst: line 31 "85% of students surveyed use food delivery apps at least weekly" (phantom survey; also 25, 31 "30 to 40% unfilled", 49, 122, 124, 128-138 "Student Adoption Data" table presented as real multi-campus data)
- content/learn/retail/retail-shelf-scanning-robots.mdx — 8 instances — worst: line 22 "Out-of-stock items cost the global retail industry an estimated $1.2 trillion annually" (also 85 x2, 89, 93, 97, 127, 131)
- content/learn/retail/robots-for-retail-inventory.mdx — 8 instances — worst: line 30 "$1.77 trillion in global retail losses from out-of-stocks annually" (also 17, 19, 24, 28, 51, 105, 112)
- content/learn/retail/store-fulfillment-robots.mdx — 10 instances — worst: line 28 "BOPIS and ship-from-store orders now represent 30% to 45% of total online retail volume" (also 17, 19, 24, 30, 39-42, 51-53, 63-65, 74-80 table, 101-106 ROI table)
- content/learn/hospitality/restaurant-robots-guide-2026.mdx — 7 instances — worst: line 23 "The restaurant industry lost 3.6 million workers during the pandemic and has only recovered about 80%" (also 25, 105, 133, 137, 149 "MTBF for all three platforms exceeds 2,000 operating hours")
- content/learn/hospitality/restaurant-robots-guide.mdx — 8 instances — worst: line 28 "average hourly wages for line cooks exceeding $18... Turnover remains above 70% annually" (unsourced tail of NRA sentence; also 19, 21, 24, 60, 62, 108, 136)
- content/learn/hospitality/hotel-robot-concierge-guide.mdx — 5 instances — worst: line 65 "15-25% of guests... post about it... generating organic marketing value of $5,000-$15,000 annually" (also 47, 55, 57, 93)
- content/learn/hospitality/hotel-cleaning-robots-guide.mdx — 7 instances — worst: line 28 "labor costs rising 12% to 15% annually" (also 21, 24, 30, 105-110 table, 115-117 "Cleanliness scores improve by 8% to 15% on average")
- content/learn/guides/how-to-buy-a-surgical-robot.mdx — 4 instances — worst: line 53 "Hospitals that launch robotic programs typically see 15-30% case volume increases within 24 months" (also 55, 75, 107)
- content/learn/guides/how-to-buy-a-cobot-manufacturing.mdx — 4 instances — worst: line 21 "The global cobot market hit $2.2 billion in 2025, growing at 25% annually" (also 97 "$42,000 per lost-time incident" unsourced here, 98, 108)
- content/learn/guides/how-to-buy-an-agricultural-robot.mdx — 5 instances — worst: line 22 "Farm labor costs rose 18% between 2022 and 2025. Seasonal worker availability dropped 23%" (also 36 "by 2027-2028", 67, 68, 72)
- content/learn/guides/how-to-evaluate-robot-vendors.mdx — 2 instances — worst: line 21 "over 3,000 companies globally, and roughly 15% of robotics startups fail within their first five years"
- content/learn/guides/robot-roi-calculation-guide.mdx — 5 instances — worst: line 62 "reduces turnover in remaining positions by 15-30% based on published deployment data" (phantom "published data"; also 52, 62 "40-60% turnover", 66, 99)
- content/learn/guides/robot-maintenance-planning-guide.mdx — 5 instances — worst: line 147 "For cobots: collision events and end-effector wear (together about 40% of incidents)... AMRs... about 50%" (also 29, 31, 33)
- content/learn/guides/robot-fleet-management-basics.mdx — 1 instance — worst: line 48 "poor charging management can reduce effective fleet capacity by 15-25%"
- content/learn/guides/how-to-buy-a-security-robot.mdx — 5 instances — worst: line 78 "Multiple studies suggest visible robotic patrol reduces incidents by 30-50%" (phantom studies; also 18 "Over 10,000 autonomous security robots", 74, 88 x2)
- content/learn/guides/how-to-buy-a-delivery-robot.mdx — 4 instances — worst: line 80 "Payback on the fleet investment... typically occurs within 8-14 months" (also 19 "$8-12 vs $1.50-3.00", 66, 82)
- content/learn/guides/how-to-buy-an-eldercare-robot.mdx — 2 instances — worst: line 18 "the population over 65 grows by 10,000 people per day" (also 57)
- content/learn/guides/how-to-buy-a-construction-robot.mdx — 2 instances — worst: line 70 "eliminates the 2-5% rework rate common with manual layout" (also 66 "$150,000-$250,000 in labor savings" extrapolation)
- content/learn/guides/how-to-buy-a-humanoid-robot.mdx — 2 instances — worst: line 72 "total cost of a pilot program... typically runs $200,000-$500,000" (also 74)
- content/learn/guides/how-to-buy-a-warehouse-robot.mdx — 5 instances — worst: line 25 "spending will exceed $9 billion globally in 2026, yet nearly 40% of first-time buyers report dissatisfaction" (also 23/105 "based on analysis of 120+ installations" — claimed proprietary Robotomated analysis that does not exist; 35, 101, 107-111; generic end-of-page Sources block does not map claims to sources)
- content/learn/guides/robot-safety-assessment-guide.mdx — 1 instance — worst: line 29 "a single robot-related injury averages $180,000 in direct costs"
- content/learn/guides/robot-insurance-requirements.mdx — 4 instances — worst: line 86 "typically see workers' comp premium reductions of 10 to 25%" (also 48, 64, 80)
- content/learn/guides/how-to-evaluate-warehouse-robot-vendors.mdx — 2 instances — worst: line 20 "reduces implementation risk by 60-70% compared to unproven solutions" (also 22)
- content/learn/guides/robot-vendor-due-diligence-checklist.mdx — 2 instances — worst: line 30 "at least 40 robotics startups shut down or were acquired in distress sales" (also 114)
- content/learn/guides/robot-leasing-vs-buying.mdx — 3 instances — worst: line 20 "Buying typically saves 15 to 30% over the total cost of a 5-year lease" (also 107 Section 179 "$1.22M in 2026" stale/unsourced, 150-157 vendor RaaS pricing table)
- content/learn/guides/robot-workforce-transition-guide.mdx — 4 instances — worst: line 18 "Industry data shows that 85% of companies deploying robots redeploy affected workers" (phantom "industry data"; also 22, 25 "3x higher success rates", 56)
- content/learn/guides/robot-cybersecurity-guide.mdx — 1 instance — worst: line 177 "prevents incidents that commonly cost $200,000 to $2 million"
- content/learn/guides/robot-data-privacy-compliance.mdx — 1 instance — worst: line 184 "Over $1.5 billion in total settlements through 2025" (BIPA total, unsourced)
- content/learn/guides/fleet-management-systems-guide.mdx — 3 instances — worst: line 37 "Operations running fleet management software report 25% to 40% higher robot utilization rates... 60% to 80% reduction in traffic deadlocks... 15% to 30% improvement in order throughput"

## TIER 3 (per file)
- content/learn/delivery/sidewalk-delivery-robots-guide.mdx — line 88 "Per-Delivery Cost Breakdown... Total cost per delivery $1.40-$1.90" (table 90-98) — invented cost-model table presented as fact, no SAMPLE/illustrative label in rendered text
- content/learn/delivery/sidewalk-delivery-robots-guide.mdx — line 111 "Campus Deployment Economics... Monthly margin $6,000-$9,000" (table 113-120) — invented fleet-economics table presented as real-world data, unlabeled
- content/learn/delivery/delivery-robots-for-university-campus.mdx — line 105 "ROI Model for a 20,000-Student Campus... Total annual benefit $812,760" (tables 107-122) — detailed revenue/cost model presented as factual economics, no illustrative label
- content/learn/hospitality/hotel-robot-concierge-guide.mdx — line 73 "ROI Analysis: 200-Room Full-Service Hotel... Net annual impact +$22K to +$122K" (77-89) — hypothetical hotel model with precise dollar outcomes, unlabeled as illustrative
- content/learn/guides/how-to-get-robot-budget-approved.mdx — line 59 "Cost of Inaction... Total cost of inaction $1,062,000 / $3,425,000" (also financial model 94-108) — template numbers rendered without per-table example label; mitigated only partly by the article's "presentation template" framing and the single "Example:" tag at line 46

## SOURCED-BUT-VERIFY (per file)
- delivery-robots-last-mile-2026.mdx — line 42 — source named in text: "The company reports [per-delivery costs below $2]" (Starship self-report); line 70 "Coco reports"; line 110 "Nuro projects"
- restaurant-robots-guide.mdx — line 28 — source named in text: "The National Restaurant Association reports 82% of operators..." (verify 2026 survey exists)
- hotel-robot-concierge-guide.mdx — line 18 — "American Hotel & Lodging Association reports over 100,000 unfilled positions"; line 67 — "A Cornell Hospitality Research study found 64%..." (verify study exists)
- hotel-cleaning-robots-guide.mdx — line 28 — "American Hotel and Lodging Association reports 87% of members face housekeeping shortages"
- robot-roi-calculation-guide.mdx — line 60 — "Bureau of Labor Statistics reports... $42,000 per lost-time incident" — likely misattribution (BLS counts incidents, does not publish cost averages; NSC does)
- robot-maintenance-planning-guide.mdx — line 21 — "$260,000 per hour, according to Aberdeen Group research" — figure normally cited for automotive downtime, not "manufacturers average"; verify
- how-to-buy-an-eldercare-robot.mdx — line 18 — "The Bureau of Labor Statistics projects a shortage of 150,000 paid caregivers annually through 2030" — BLS does not publish shortage projections; likely misattribution
- how-to-buy-a-construction-robot.mdx — line 17 — "Associated General Contractors of America reports that 91%..."; line 66 — "Dusty Robotics reports... reduces layout labor by 75%" (vendor self-report)
- robot-workforce-transition-guide.mdx — line 31 — "McKinsey's 2025 automation survey found that 45%... 3x higher... 40% faster" — verify this survey exists
- robot-insurance-requirements.mdx — line 28 — "A 2025 survey by Marsh McLennan found that 62%..." — verify existence
- robot-cybersecurity-guide.mdx — line 33 — "grew 340% between 2022 and 2025, according to ICS-CERT advisories" — ICS-CERT (dissolved into CISA) does not publish robot-incident counts; likely fabricated attribution
- how-to-buy-a-warehouse-robot.mdx — lines 137-144 — end-of-page Sources block (MHI, RIA, Interact Analysis, Gartner, MH&L, WERC) — sources are generic; verify each inline stat actually maps to one
- robot-integration-guide-wms-erp.mdx — lines 154-161 — Sources block incl. "ARC Advisory Group... 200+ deployments" — verify
- robot-safety-compliance-guide.mdx — lines 21, 43, 119 — OSHA penalty figures ($16,131 / $161,323) with Sources block — verify against current OSHA penalty schedule
- robot-data-privacy-compliance.mdx — line 182 — "France (CNIL): Fined Amazon $35 million in 2024" (real event, actual fine €32M — verify framing); line 183 — "Italy (Garante): Issued guidance in 2025 requiring DPIAs for all workplace robot deployments" — verify existence

## CLEAN FILES
- content/learn/home/robot-vacuum-vs-robot-mop.mdx
- content/learn/guides/questions-to-ask-robot-salesperson.mdx
- content/learn/guides/warehouse-robot-pilot-program-guide.mdx
- content/learn/guides/robot-integration-wms-checklist.mdx
- content/learn/guides/robot-deployment-timeline-guide.mdx
- content/learn/guides/robot-safety-standards-iso-10218.mdx
- content/learn/guides/robot-integration-guide-wms-erp.mdx (verify Sources block mapping)
- content/learn/guides/robot-safety-compliance-guide.mdx (verify OSHA penalty figures)

## COUNTS
tier1_items: 28 | tier2_instances: 142 across 33 files | tier3_items: 5 | files_audited: 42 | clean_files: 8

## Notes
- Judgment applied per instructions: manufacturer product specs/prices (payloads, speeds, list prices) were NOT counted; vendor scale/outcome metrics and unpublished pricing attributed to named companies were counted Tier 1; generic cost-range buyer guidance counted only when presented as market fact.
- Internal inconsistency worth fixing during remediation: chest transient force limit given as 140 N in how-to-buy-a-cobot-manufacturing.mdx:57 and robot-safety-compliance-guide.mdx:111, but 210 N in robot-safety-assessment-guide.mdx:22/108 and robot-safety-standards-iso-10218.mdx:64.
- The heaviest-risk files (Tier 1 density + unlabeled economics models): delivery/sidewalk-delivery-robots-guide.mdx, delivery/delivery-robots-for-university-campus.mdx, hospitality/hotel-robot-concierge-guide.mdx.

## Group 2: vs, security, inspection, agricultural

# MDX Claims Audit — Batch 2 (vs / security / inspection / agricultural)
Audited: 2026-08-11 | Policy: docs/claims-policy.md (four-bucket rule) | 47 files | READ-ONLY

## TIER 1 (individual items)
- content/learn/vs/amazon-proteus-vs-locus-origin.mdx:22 — [named-company-metric] "over 2 billion units picked across 300+ facilities" — Locus metric stated as fact, no attribution (repeated 38, 84, 134)
- content/learn/vs/amazon-proteus-vs-locus-origin.mdx:54 — [named-company-metric] "trained on data from millions of hours of real warehouse operations across Amazon's fulfillment network" — unsourced
- content/learn/vs/amazon-proteus-vs-locus-origin.mdx:56 — [named-company-metric] "refined across 300+ deployments... reduce worker walking by 50-80%" — Locus metrics, unsourced
- content/learn/vs/amazon-proteus-vs-locus-origin.mdx:82 — [named-company-metric] "Proteus handles the equivalent of what would require dozens of manual cart pushers" — authorial Amazon claim, unsourced
- content/learn/vs/amazon-proteus-vs-locus-origin.mdx:142 — [named-company-metric] "Amazon began offering Proteus to external customers in 2025" — likely invented company fact; no such announced program
- content/learn/vs/amr-vs-agv-guide.mdx:106 — [named-company-metric] "Some FDA auditors have specifically questioned AMR path variability during facility inspections" — unsourced claim about a federal agency's conduct
- content/learn/vs/autonomous-forklift-vs-traditional-forklift.mdx:21 — [clinical-safety-outcome] "Autonomous forklifts reduce incident rates by 70-90%" — FAQ (renders + likely FAQPage schema), no source
- content/learn/vs/autonomous-forklift-vs-traditional-forklift.mdx:26 — [clinical-safety-outcome] "They also reduce forklift-related injuries by 70-90%" — unsourced injury-reduction claim in Quick Answer
- content/learn/vs/autonomous-forklift-vs-traditional-forklift.mdx:99 — [clinical-safety-outcome] "Facilities... report 70-90% reduction in... safety incidents. Some... achieved zero recordable injuries" — unattributed outcome testimonial
- content/learn/vs/boston-dynamics-atlas-vs-figure-01.mdx:22 — [named-company-metric] "a startup that raised over $1 billion in under two years" — Figure funding, unsourced
- content/learn/vs/boston-dynamics-atlas-vs-figure-01.mdx:56 — [named-company-metric] "During the BMW pilot, Figure 02 demonstrated... sub-millimeter precision" — BMW/Figure claim, no source
- content/learn/vs/boston-dynamics-atlas-vs-figure-01.mdx:80 — [named-company-metric] "Boston Dynamics announced Atlas commercial pilots with Hyundai facilities in late 2025" — asserted without citation
- content/learn/vs/boston-dynamics-atlas-vs-figure-01.mdx:82 — [named-company-metric] "The BMW Spartanburg pilot, operational since mid-2025" — unsourced; publicly reported pilot began 2024, likely wrong
- content/learn/vs/boston-dynamics-atlas-vs-figure-01.mdx:96 — [named-company-metric] "a proven track record with Spot (thousands deployed)" — unsourced count; contradicts sibling files (1,500+/500+)
- content/learn/vs/boston-dynamics-atlas-vs-figure-01.mdx:98 — [named-company-metric] "over $1 billion in backing from... Microsoft, OpenAI, NVIDIA, and Jeff Bezos" — unsourced
- content/learn/vs/boston-dynamics-spot-vs-ghost-robotics.mdx:31 — [named-company-metric] "deployed at hundreds of industrial sites worldwide" — Spot count, unsourced, contradicts sibling files
- content/learn/vs/boston-dynamics-spot-vs-ghost-robotics.mdx:73 — [named-company-metric] "BP deploys Spot... National Grid uses Spot... Woodside Energy operates Spot" (73-76) — real deployments, zero citation
- content/learn/vs/boston-dynamics-spot-vs-ghost-robotics.mdx:96 — [named-company-metric] "Ghost Robotics has secured contracts with the US Air Force, US Marine Corps, and DHS" — checkable but uncited
- content/learn/vs/boston-dynamics-spot-vs-ghost-vision60.mdx:41 — [named-company-metric] "Deployments | 1,500+ commercial | 100+ military/security" — both counts unsourced
- content/learn/vs/boston-dynamics-spot-vs-ghost-vision60.mdx:87 — [named-company-metric] "Ghost Robotics has demonstrated multi-kilometer teleoperation ranges using military communication systems" — unsourced
- content/learn/vs/boston-dynamics-spot-vs-ghost-vision60.mdx:95 — [named-company-metric] "Over 1,500 units are deployed globally" — Spot count, unsourced
- content/learn/vs/boston-dynamics-spot-vs-ghost-vision60.mdx:115 — [named-company-metric] "The U.S. DoD, U.S. Air Force, and multiple allied militaries have evaluated or deployed Vision 60" — uncited
- content/learn/vs/boston-dynamics-spot-vs-unitree-b2.mdx:22 — [named-company-metric] "500+ enterprise deployments at companies like National Grid and Woodside Energy" — unsourced, contradicts 1,500+ in sibling
- content/learn/vs/boston-dynamics-spot-vs-unitree-b2.mdx:88 — [named-company-metric] "Deployed at National Grid... Woodside... NASA JPL... and 500+ other organizations" — unsourced count, named orgs uncited
- content/learn/vs/boston-dynamics-stretch-vs-locus-robotics.mdx:40 — [named-company-metric] "Locus robots have collectively picked over 2 billion units" — unsourced in this file
- content/learn/vs/cloud-robotics-vs-edge-computing.mdx:41 — [named-company-metric] "Locus Robotics' cloud-based fleet management... thousands of AMRs across hundreds of facilities" — scale metrics, no source
- content/learn/vs/cobot-vs-industrial-robot.mdx:98 — [named-company-metric] "BMW's Spartanburg plant runs KUKA... while deploying Universal Robots cobots at 30+ stations" — named plant + count, unsourced
- content/learn/vs/cobot-vs-industrial-robot.mdx:126 — [named-company-metric] BMW Spartanburg "30+ stations" claim repeated in FAQ — unsourced
- content/learn/vs/da-vinci-vs-mako-robot.mdx:61 — [clinical-safety-outcome] "Shorter hospital stays — Robotic prostatectomy: 1 day vs. 2-3 days open... saves $2,500-5,000 per patient" — no study
- content/learn/vs/da-vinci-vs-mako-robot.mdx:62 — [clinical-safety-outcome] "Fewer complications — Lower readmission rates save $10,000-25,000 per avoided readmission" — no peer-reviewed source
- content/learn/vs/da-vinci-vs-mako-robot.mdx:87 — [clinical-safety-outcome] "less blood loss, shorter stay... better continence recovery at 12 months" — multiple outcome claims, no named study
- content/learn/vs/da-vinci-vs-mako-robot.mdx:88 — [clinical-safety-outcome] "Robotic comparable to laparoscopic for benign cases; advantages in complex cases" — unsourced outcome claim
- content/learn/vs/da-vinci-vs-mako-robot.mdx:89 — [clinical-safety-outcome] "Robotic hernia repair and cholecystectomy show comparable outcomes... with higher cost" — unsourced
- content/learn/vs/da-vinci-vs-mako-robot.mdx:93 — [clinical-safety-outcome] "Studies show 2x better alignment accuracy with Mako vs. manual... misaligned implants fail faster" — no named study
- content/learn/vs/da-vinci-vs-mako-robot.mdx:95 — [clinical-safety-outcome] "Reduced soft tissue damage correlates with faster rehabilitation" — clinical correlation, no source
- content/learn/vs/da-vinci-vs-mako-robot.mdx:96 — [clinical-safety-outcome] "Studies report higher satisfaction scores at 6 months and 2 years post-operatively" — unnamed studies
- content/learn/vs/dji-matrice-vs-skydio-x10.mdx:58 — [named-company-metric] "DJI's manufacturing scale — they produce more drones than all competitors combined" — market claim, no source
- content/learn/vs/dji-matrice-vs-skydio-x10.mdx:131 — [salary-earnings] "an experienced commercial drone pilot costs $60,000-$90,000/year" — salary figure, no source
- content/learn/vs/dji-matrice-vs-skydio-x10.mdx:149 — [unattributed-quote] "Many Skydio operators report zero collision events over hundreds of flight hours" — unattributed operator testimonial
- content/learn/vs/fanuc-vs-kuka-vs-abb-comparison.mdx:17 — [named-company-metric] "a documented MTBF... exceeding 100,000 hours... unmatched in independent surveys" — names neither document nor survey
- content/learn/vs/fanuc-vs-kuka-vs-abb-comparison.mdx:45 — [named-company-metric] "MTBF figures regularly exceed 100,000 hours" — FANUC reliability metric, no source
- content/learn/vs/fanuc-vs-kuka-vs-abb-comparison.mdx:67 — [named-company-metric] "Programming time... typically 20-30% shorter than FANUC or ABB" — KUKA metric, no source
- content/learn/vs/fanuc-vs-kuka-vs-abb-comparison.mdx:91 — [named-company-metric] "[RobotStudio] reducing commissioning time by 30-50%" — ABB benefit metric, no source
- content/learn/vs/humanoid-vs-purpose-built-robot.mdx:40 — [named-company-metric] "Boston Dynamics Stretch... 800 cases per hour with 99.5% uptime in production deployments" — "auditable results" with no audit cited
- content/learn/vs/humanoid-vs-purpose-built-robot.mdx:40 — [named-company-metric] "Locus Robotics AMRs... deliver a documented 2-3x productivity increase" — "documented" with no document named
- content/learn/vs/intuitive-davinci-vs-hugo-ras.mdx:48 — [clinical-safety-outcome] "Thousands of peer-reviewed publications support its safety and efficacy" — no checkable citation
- content/learn/vs/intuitive-davinci-vs-hugo-ras.mdx:85 — [named-company-metric] "market intelligence consistently indicates... Hugo's total cost of ownership is 20-30% lower" — phantom source
- content/learn/vs/intuitive-davinci-vs-hugo-ras.mdx:97 — [named-company-metric] "Da Vinci dominates urology with over 85% market share in robotic prostatectomy" — precise share, no source
- content/learn/vs/intuitive-davinci-vs-hugo-ras.mdx:169 — [clinical-safety-outcome] "Early published studies show comparable outcomes... improve surgical precision compared to laparoscopic" — unnamed studies
- content/learn/vs/kiwibot-vs-starship-delivery-robot.mdx:150 — [clinical-safety-outcome] "Millions of deliveries have been completed without reported pedestrian injuries." — safety outcome as fact, no source
- content/learn/vs/locus-robotics-vs-6-river-systems.mdx:30 — [named-company-metric] "the robots Amazon acquired in 2012 for $775 million" — real figure but no attribution in text
- content/learn/vs/locus-robotics-vs-6-river-systems.mdx:91 — [salary-earnings] "$15,000/month — the equivalent of 1-2 full-time warehouse workers... replaces the equivalent of 20-30 workers" — implicit wage claim + unsourced ROI math
- content/learn/vs/sarcos-guardian-vs-ekso-bionics.mdx:90 — [clinical-safety-outcome] "Patients begin walking practice weeks earlier than with conventional therapy" — clinical outcome, no named study
- content/learn/vs/sarcos-guardian-vs-ekso-bionics.mdx:91 — [clinical-safety-outcome] "a typical 30-minute EksoNR session produces 800-1,200 steps versus 50-200 steps" — clinical outcome figure, no citation
- content/learn/vs/sarcos-guardian-vs-ekso-bionics.mdx:92 — [clinical-safety-outcome] "Studies show significant improvements in walking speed, endurance, and balance scores" — no named study
- content/learn/vs/skydio-2-plus-vs-autel-evo-max.mdx:49 — [unattributed-quote] "Organizations deploying Skydio X10 report that technicians with minimal drone experience can execute complex... missions" — unnamed orgs
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:18 — [clinical-safety-outcome] FAQ: "Benefits include less blood loss, shorter hospital stays, and faster recovery." — outcome as fact, no study
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:22 — [clinical-safety-outcome] FAQ: "These procedures show the clearest clinical advantages over open and laparoscopic approaches." — no source
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:25 — [clinical-safety-outcome] "Evidence shows 20-40% less blood loss, 1-2 day shorter hospital stays, and faster return to normal activity" — "Evidence shows," nothing named
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:29 — [clinical-safety-outcome] "multiple large randomized controlled trials, meta-analyses... spanning millions of procedures" — zero citations
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:39 — [clinical-safety-outcome] prostatectomy outcomes table (39-47): "Urinary continence (12 mo) 80-92%... Erectile function 40-68%" — full clinical table, no source
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:49 — [clinical-safety-outcome] "statistically significant advantages across nearly all metrics" — statistical claim, no study
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:53 — [clinical-safety-outcome] hysterectomy table (53-59): "Complication rate 3-8%... Conversion to open 1-3%" — unsourced complication rates
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:65 — [clinical-safety-outcome] "Robotic partial nephrectomy has become the standard of care for renal tumors under 7 cm." — standard-of-care claim, no source
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:67 — [clinical-safety-outcome] nephrectomy table (67-73): "Warm ischemia time... Complication rate (Clavien 3+) 3-8%" — unsourced
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:75 — [clinical-safety-outcome] "shorter warm ischemia time... directly impacts long-term kidney function preservation" — causal clinical claim, no source
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:79 — [clinical-safety-outcome] Mako knee table (79-86): "Revision rate (5-year) 3-5% vs 1-2%; Patient satisfaction 80-85% vs 88-93%" — named product, unsourced outcomes
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:88 — [clinical-safety-outcome] "implant placement accuracy... correlates with long-term implant survival" — causal claim, unsourced
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx:140 — [clinical-safety-outcome] "operative times are 30-60% longer and complication rates may be higher" — complication claim, unsourced
- content/learn/vs/warehouse-robots-vs-human-pickers.mdx:20 — [salary-earnings] FAQ: "Human picking costs $0.15-$0.40 per pick at fully loaded labor rates." — wage-derived cost as fact, unsourced
- content/learn/vs/warehouse-robots-vs-human-pickers.mdx:37 — [named-company-metric] "Goods-to-person (AutoStore, Exotec) | 300 - 600" — performance range tied to named vendors, no source
- content/learn/vs/warehouse-robots-vs-human-pickers.mdx:60 — [salary-earnings] "Direct labor | $0.10 - $0.25 | $18-$25/hr, 80-120 picks/hr" — picker wage range as fact, no source
- content/learn/security/corporate-campus-security-robots.mdx:40 — [clinical-safety-outcome] "Clients document 40-60% drops in trespassing and vehicle break-ins." — crime-outcome claim; "clients" unnamed
- content/learn/security/security-robots-for-commercial-buildings.mdx:29 — [salary-earnings] "average fully loaded cost of a security guard in the United States is $28 to $42 per hour" — no source
- content/learn/security/security-robots-for-commercial-buildings.mdx:55 — [named-company-metric] "Knightscope K5 is the most widely deployed outdoor security robot with over 500 commercial installations." — unsourced
- content/learn/security/security-robots-guide-2026.mdx:23 — [salary-earnings] "average fully loaded cost of a human security guard is $25-35 per hour — $220,000-305,000 per year" — no source; contradicts sibling file's $28-42/hr
- content/learn/security/security-robots-guide-2026.mdx:39 — [clinical-safety-outcome] "Studies from Knightscope deployment sites report 30-50% reductions in security incidents" — vendor-originated, not a checkable named source
- content/learn/security/security-robots-guide-2026.mdx:109 — [salary-earnings] "3-5 eliminated guard positions at $55,000-75,000 each (fully loaded cost per guard per year)" — third mutually inconsistent guard-cost figure
- content/learn/inspection/dimensional-measurement-robots.mdx:23 — [salary-earnings] "$60,000-$100,000/year for a dedicated CMM operator" — operator salary as fact in FAQ, no source
- content/learn/inspection/dimensional-measurement-robots.mdx:170 — [salary-earnings] "plus operator ($60,000-$100,000/year)" — repeated in rendered FAQ
- content/learn/inspection/industrial-inspection-robots-2026.mdx:70 — [named-company-metric] "With over 1,500 units deployed across energy, mining, construction, and manufacturing" — Spot install base, no source
- content/learn/inspection/machine-vision-inspection-guide.mdx:105 — [salary-earnings] "Annual labor savings: $120,000-$180,000 (2-3 FTE × $60,000)" — inspector fully-loaded cost asserted as fact
- content/learn/agricultural/agricultural-drone-guide.mdx:80 — [named-company-metric] "The DJI Agras T50 is the global market leader in agricultural spraying drones" — market-position claim, no source
- content/learn/agricultural/agricultural-robots-for-specialty-crops.mdx:21 — [named-company-metric] "Naviio" vineyard robot ($85,000-$120,000, 5-8 acres/day; also lines 24, 42, 47) — likely NON-EXISTENT company (corruption of "Naïo"); uncheckable product entry
- content/learn/agricultural/agricultural-robots-for-specialty-crops.mdx:30 — [salary-earnings] "H-2A visa workers cost $18 to $22 per hour fully loaded" — labor-cost fact, not covered by the NAWS attribution earlier in sentence
- content/learn/agricultural/agricultural-robots-for-specialty-crops.mdx:62 — [named-company-metric] "Advanced Farm Technologies leads the strawberry harvesting market... pick rates are 60 to 70% of human picker speed" — unsourced
- content/learn/agricultural/agricultural-robots-guide.mdx:57 — [named-company-metric] "Verdant Robotics Spraybox... Reduces chemical use by 99%" — vendor marketing claim as editorial fact (repeated line 140)
- content/learn/agricultural/agricultural-robots-guide.mdx:67 — [named-company-metric] "Advanced.farm — ... backed by $67M+ in funding" — named-company financial figure, no inline source
- content/learn/agricultural/autonomous-tractor-guide.mdx:132 — [named-company-metric] "Nationwide and John Deere Financial both offer specific autonomous equipment endorsements as of 2026" — unsourced product claim
- content/learn/agricultural/dairy-farm-robots-guide.mdx:31 — [salary-earnings] "at dairy wage rates ($15-$20/hour)" — wage figure as fact, no source
- content/learn/agricultural/dairy-farm-robots-guide.mdx:56 — [named-company-metric] installed-base column (56-58): "Lely 40,000+ | DeLaval 30,000+ | GEA 15,000+ | Boumatic 5,000+" — company fleet metrics, unsourced
- content/learn/agricultural/dairy-farm-robots-guide.mdx:62 — [clinical-safety-outcome] "Individual quarter monitoring detects mastitis 2-3 days before clinical symptoms appear" — herd-health outcome as fact, no source
- content/learn/agricultural/dairy-farm-robots-guide.mdx:97 — [clinical-safety-outcome] "reduced hoof disease incidence (digital dermatitis down 20-35%)" — health outcome with percentage, unsourced
- content/learn/agricultural/dairy-farm-robots-guide.mdx:101 — [clinical-safety-outcome] "Clean, well-bedded stalls reduce mastitis incidence" — health outcome asserted without source
- content/learn/agricultural/dairy-farm-robots-guide.mdx:127 — [unattributed-quote] "Dairy farmers who install robotic milking consistently report the lifestyle transformation as the primary benefit" — collective unattributed testimonial
- content/learn/agricultural/fruit-harvesting-robots-2026.mdx:45 — [named-company-metric] "covers an acre of strawberries in approximately 3 days... equivalent to roughly 30 human pickers" — Harvest CROO equivalence claim, unsourced
- content/learn/agricultural/fruit-harvesting-robots-2026.mdx:93 — [unattributed-quote] "Many growers report losing 10-20% of their crop to labor shortages during peak harvest" — unattributed testimonial carrying a metric
- content/learn/agricultural/robotic-harvesting-guide.mdx:70 — [named-company-metric] "Apple harvesting robots have reached commercial deployment with systems from Abundant Robotics" — company shut down in 2021; false current-deployment claim (repeated FAQ line 21)
- content/learn/agricultural/robotic-harvesting-guide.mdx:76 — [named-company-metric] "Root AI (acquired by AppHarvest) deploys harvesting robots in... greenhouse tomato production" (+ line 78 "20-30 tomatoes per minute") — AppHarvest bankrupt 2023; unsourced
- content/learn/agricultural/robotic-harvesting-guide.mdx:82 — [named-company-metric] "Systems from TaylorFarms and Harvest CROO achieve 80-90% of human picking speeds" — unsourced and factually dubious pairing
- content/learn/agricultural/robotic-weeding-guide.mdx:76 — [named-company-metric] "90-95% reduction in herbicide volume with the same weed control efficacy" — See & Spray efficacy claim as editorial fact; Deere's published figure is lower (also line 56)

## TIER 2 (per file)
- content/learn/vs/amazon-proteus-vs-locus-origin.mdx — 11 instances — worst: line 116 "Both platforms deliver 40-60% cost savings versus manual labor over five years"
- content/learn/vs/amr-vs-agv-guide.mdx — 20 instances — worst: line 92 "**3-Year Total** | **$725,500-$1,279,500** | **$796,500-$1,179,500**"
- content/learn/vs/amr-vs-agv-warehouse.mdx — 15 instances — worst: line 105 "By 2028, expect the category distinction to fade as most warehouse transport robots offer both modes"
- content/learn/vs/amr-vs-agv-which-is-better.mdx — 17 instances — worst: line 66 "**5-Year TCO** | **$875,000** | **$895,000**"
- content/learn/vs/autonomous-forklift-vs-traditional-forklift.mdx — 30 instances — worst: line 113 "the best systems reach 80-90% and are projected to achieve parity by 2028"
- content/learn/vs/boston-dynamics-atlas-vs-figure-01.mdx — 7 instances — worst: line 142 "By 2028-2030, industry analysts project humanoid robots could reach price points competitive with annual worker compensation"
- content/learn/vs/boston-dynamics-spot-vs-ghost-robotics.mdx — 9 instances — worst: line 18 "Vision 60 pricing... estimated at $100,000-$200,000 per unit" (repeated 50, 111; no source)
- content/learn/vs/boston-dynamics-spot-vs-ghost-vision60.mdx — 8 instances — worst: line 103 "Spot replaces 2-4 human inspection shifts per day"
- content/learn/vs/boston-dynamics-spot-vs-unitree-b2.mdx — 7 instances — worst: line 32 "~$15,000-25,000 (estimated)" B2 price — likely wrong by 4-6x; drives the file's "3-5x cheaper" thesis
- content/learn/vs/boston-dynamics-stretch-vs-locus-robotics.mdx — 19 instances — worst: line 67 "**3-year ROI:** Approximately $473,000 net savings after investment"
- content/learn/vs/cloud-robotics-vs-edge-computing.mdx — 9 instances — worst: line 86 "edge processing costs one-fifth to one-tenth of equivalent cloud processing"
- content/learn/vs/cobot-vs-industrial-robot-smb.mdx — 11 instances — worst: line 134 "cobots handle 70-80% of typical SMB automation applications"
- content/learn/vs/cobot-vs-industrial-robot.mdx — 13 instances — worst: line 18 "cobots deliver 54% lower 3-year total cost of ownership ($89,100 vs. $194,000...)"
- content/learn/vs/da-vinci-vs-mako-robot.mdx — 19 instances — worst: line 144 "Most Mako deployments break even in 2-3 years. Da Vinci break-even is typically 3-4 years"
- content/learn/vs/dji-matrice-vs-skydio-x10.mdx — 4 instances — worst: line 41 "Price (drone only) ~$10,000-$13,000 | ~$15,000-$20,000"
- content/learn/vs/fanuc-vs-kuka-industrial-robots.mdx — 12 instances — worst: line 113 "Mean time between failure (MTBF) figures exceeding 80,000 hours are common"
- content/learn/vs/fanuc-vs-kuka-vs-abb-comparison.mdx — 15 instances — worst: line 28 "FANUC, KUKA, and ABB collectively control approximately 45% of the global industrial robot market"
- content/learn/vs/humanoid-vs-purpose-built-robot.mdx — 5 instances — worst: line 32 "Deployment Readiness | 2026-2028 (limited commercial)" (invented-future timeline)
- content/learn/vs/intuitive-davinci-vs-hugo-ras.mdx — 14 instances — worst: line 125 "5-year total cost of ownership (500 procedures/year): da Vinci 5: $9.5M-$12.5M / Hugo RAS: $7.0-$9.5M" (125-128)
- content/learn/vs/kiwibot-vs-starship-delivery-robot.mdx — 12 instances — worst: line 116 "Starship: $1.50-$2.50 per delivery (at scale)" — only "industry estimates" attribution
- content/learn/vs/locus-robotics-vs-6-river-systems.mdx — 10 instances — worst: line 91 "$15,000/month... replaces 20-30 workers... the math is overwhelmingly favorable"
- content/learn/vs/robot-lease-vs-buy.mdx — 10 instances — worst: line 52 "up to $1,220,000 (2026 limit)" — Section 179 limit stated as current law, no source, high wrong-fact risk
- content/learn/vs/sarcos-guardian-vs-ekso-bionics.mdx — 12 instances — worst: line 147 "global exoskeleton market is projected to exceed $8 billion by 2030"
- content/learn/vs/skydio-2-plus-vs-autel-evo-max.mdx — 6 instances — worst: line 89 "EVO Max 4T kit runs around $13,000-15,000. A comparable Skydio X10 kit... costs $18,000-22,000"
- content/learn/vs/surgical-robot-vs-manual-surgery-outcomes.mdx — 20 instances — worst: line 20 "costs $2,500-$6,000 more per procedure... can offset 40-70% of this premium" (FAQ)
- content/learn/vs/universal-robots-ur10-vs-fanuc-crx10.mdx — 12 instances — worst: line 71 "over 75,000 cobots deployed globally" — no attribution in text
- content/learn/vs/universal-robots-ur5e-vs-ur10e.mdx — 14 instances — worst: line 22 "Universal Robots dominates the collaborative robot market with roughly 50% global market share"
- content/learn/vs/warehouse-robots-vs-human-pickers.mdx — 30 instances — worst: line 139 "Published case studies show 20-40% reduction in total warehouse headcount" — unnamed case studies
- content/learn/security/corporate-campus-security-robots.mdx — 6 instances — worst: line 18 "Staffing 24/7 patrol routes across such a campus runs $1.5-$3.5 million annually"
- content/learn/security/perimeter-security-drones-2026.mdx — 8 instances — worst: line 132 "This visual verification step reduces false-alarm guard dispatches by 60-80% in practice."
- content/learn/security/security-robots-for-commercial-buildings.mdx — 12 instances — worst: line 20 "robot... $4,000 to $8,000 per month... guard coverage... $8,000 to $14,000... 30 to 50% reduction" (FAQ)
- content/learn/security/security-robots-guide-2026.mdx — 8 instances — worst: line 23 "Security guard turnover exceeds 100% annually at many firms."
- content/learn/inspection/ai-quality-control-roi.mdx — 60 instances — worst: lines 123-167 "Real-World ROI Examples" — three fully invented case studies with fabricated financials ("$1,082,500... Payback: 3.5 months") framed as real-world
- content/learn/inspection/dimensional-measurement-robots.mdx — 10 instances — worst: line 26 "Investment runs $150,000-$400,000 per cell with typical payback in 12-24 months"
- content/learn/inspection/industrial-inspection-robots-2026.mdx — 13 instances — worst: line 141 "catches equipment degradation 30-90 days earlier, preventing unplanned shutdowns that cost $100,000-1,000,000+ per event"
- content/learn/inspection/machine-vision-inspection-guide.mdx — 22 instances — worst: line 26 "achieving 99.5-99.9% detection rates vs. 75-85% for human inspectors... typically pay back in 6-18 months"
- content/learn/inspection/surface-defect-detection-guide.mdx — 25 instances — worst: line 122 "**Results:** Detection rate 99.3-99.7%... replacing 6-12 human inspectors per shift" — unsourced outcome as observed data
- content/learn/inspection/vision-guided-robotics-guide.mdx — 15 instances — worst: line 26 "can increase robot cell flexibility by 40-60%"
- content/learn/agricultural/agricultural-automation-adoption-guide.mdx — 14 instances — worst: line 112 "reducing chemical use by 30 to 70% compared to broadcast spraying"
- content/learn/agricultural/agricultural-drone-guide.mdx — 11 instances — worst: line 27 "detects crop stress 2-3 weeks before visible symptoms... improve yields 5-15%"
- content/learn/agricultural/agricultural-robots-for-specialty-crops.mdx — 13 instances — worst: line 93 "Net annual savings per 100 acres — $75,000-$560,000"
- content/learn/agricultural/agricultural-robots-guide.mdx — 14 instances — worst: line 26 "A 500-acre vegetable operation can save $150,000+ annually with a 2.5-year payback" — invented scenario output upgraded to fact (repeated FAQ line 136)
- content/learn/agricultural/autonomous-tractor-guide.mdx — 9 instances — worst: line 26 "15-25% productivity gains and labor savings of $40,000-$80,000 per season on operations above 1,000 acres"
- content/learn/agricultural/dairy-farm-robots-guide.mdx — 13 instances — worst: line 27 "Over 100,000 robotic milking units are now installed worldwide"
- content/learn/agricultural/fruit-harvesting-robots-2026.mdx — 12 instances — worst: line 21 "Farm labor availability in the United States has declined by 20% over the past decade"
- content/learn/agricultural/robotic-harvesting-guide.mdx — 16 instances — worst: line 30 "an estimated $3.1 billion in unharvested US produce in 2025" — estimator unnamed
- content/learn/agricultural/robotic-weeding-guide.mdx — 16 instances — worst: line 30 "Glyphosate resistance alone costs US agriculture an estimated $2 billion per year" (whole paragraph unsourced)

## TIER 3 (per file)
- content/learn/vs/amazon-proteus-vs-locus-origin.mdx — line 108 "For a mid-size 3PL operating a 200,000 sq ft facility with 30 AMRs" (108-116) — invented TCO scenario with precise dollar totals, no SAMPLE/illustrative label
- content/learn/vs/amr-vs-agv-guide.mdx — line 79 "Cost Analysis: Total Deployment Comparison" (79-92) — invented 15-unit-fleet cost model, no illustrative label
- content/learn/vs/amr-vs-agv-warehouse.mdx — line 59 "mid-size operation (50,000 square-foot facility, 15 transport units)" (59-69) — invented cost table with exact totals ($765,000/$805,000), unlabeled
- content/learn/vs/amr-vs-agv-which-is-better.mdx — line 54 "Scenario: 15-Unit Fleet in a 100,000 sq ft Warehouse" (54-66) — "Scenario" is not the required visible illustrative label; exact totals presented as fact
- content/learn/vs/autonomous-forklift-vs-traditional-forklift.mdx — line 34 three consecutive invented cost tables (34-70: acquisition, operating, 5-yr TCO) — presented as real-world fact, no label
- content/learn/vs/boston-dynamics-stretch-vs-locus-robotics.mdx — line 60 "Consider a distribution center unloading 15 trucks per day..." (60-68) — invented ROI scenario, "Consider" is not a visible label
- content/learn/vs/boston-dynamics-stretch-vs-locus-robotics.mdx — line 76 "Consider a fulfillment center with 30 pickers processing 8,000 orders per day" (76-84) — same pattern, precise savings ($684,000)
- content/learn/vs/cloud-robotics-vs-edge-computing.mdx — line 49 "A typical workflow trains a new picking model on 500,000 labeled images... (4-8 hours on an 8xA100 cluster)" — invented "typical" scenario, unlabeled
- content/learn/vs/cloud-robotics-vs-edge-computing.mdx — line 79 "Cloud Upload Cost (monthly)... $500-$1,000... $300 (local server cluster)" (79-84) — invented cost-scenario table, unlabeled
- content/learn/vs/cobot-vs-industrial-robot-smb.mdx — line 109 "Hardware and tooling $45,000... 5-Year TCO $94,000 / $210,000" (109-121) — "representative" cost table; "representative" is not an illustrative label
- content/learn/vs/cobot-vs-industrial-robot.mdx — line 78 "A realistic three-year TCO comparison... Total 3-Year TCO $89,100 / $194,000" (78-90) — invented per-vendor dollar table, "realistic" is not a label
- content/learn/vs/da-vinci-vs-mako-robot.mdx — line 55 "Break-even analysis: At 200 cases/year: per-case cost ~$6,500..." (55-58) — invented break-even model, unlabeled
- content/learn/vs/da-vinci-vs-mako-robot.mdx — line 70 Mako break-even model (70-73: $3,500/$2,200/$1,600) — invented, unlabeled
- content/learn/vs/dji-matrice-vs-skydio-x10.mdx — line 109 "Aircraft (2x): $26,000... 3-year total: ~$72,400 / ~$56,800" (109-126) — invented 2-drone-fleet TCO breakdowns, unlabeled
- content/learn/vs/fanuc-vs-kuka-industrial-robots.mdx — line 119 "For a typical manufacturing workcell... Total 5-Year TCO $118,000-172,000 / $138,000-195,000" (119-127) — "typical" is not an illustrative label
- content/learn/vs/intuitive-davinci-vs-hugo-ras.mdx — line 113 "Capital acquisition (estimated)... 5-year total cost of ownership" (113-128) — reads as factual financial analysis; "(estimated)" is not SAMPLE/illustrative
- content/learn/vs/robot-lease-vs-buy.mdx — line 44 "A $150,000 industrial robot... purchasing saves approximately $200,000 versus continuous leasing" — invented worked example, unlabeled
- content/learn/vs/robot-lease-vs-buy.mdx — line 54 "A $500,000 AMR fleet purchase... generates $150,000 in first-year tax savings" — unlabeled example calculation
- content/learn/vs/robot-lease-vs-buy.mdx — line 60 "Companies that purchased first-generation AMRs in 2022 found themselves with outdated navigation software" — invented anonymous-company narrative as fact
- content/learn/vs/robot-lease-vs-buy.mdx — line 64 "A $1,200,000 warehouse robot fleet on a 48-month operating lease requires approximately $28,000 per month" — unlabeled example
- content/learn/vs/robot-lease-vs-buy.mdx — line 72 "Total Cost Comparison: 5-Year Scenario... Consider a 20-unit AMR fleet" (72-88) — entire invented cost table ($930,000/$1,056,000/$3,000,000), no visible label
- content/learn/vs/warehouse-robots-vs-human-pickers.mdx — line 94 "On 100,000 monthly picks, that is 900 fewer errors... monthly accuracy savings of $22,500-$45,000" — invented worked example, unlabeled
- content/learn/security/corporate-campus-security-robots.mdx — line 76 "24/7 Economics: Detailed Model — A 60-acre campus with 6 buildings... 20 guards" (76-98) — fully invented campus cost model, reads as real deployment economics
- content/learn/security/perimeter-security-drones-2026.mdx — line 109 "Cost and ROI Analysis" (109-120) — invented guard-vs-drone model; "Annual savings: $115,000-$150,000" derived from unsourced assumptions
- content/learn/security/security-robots-for-commercial-buildings.mdx — line 79 "Here is a model for a 300,000 square foot office complex... **Annual savings** $146,000 (24%)" (79-99) — "a model" is not a visible label; line 101 treats the 24% as a real finding
- content/learn/inspection/ai-quality-control-roi.mdx — line 123 "Real-World ROI Examples" (123-167) — three invented case studies, unlabeled AND actively mislabeled as "Real-World" (also counted worst Tier 2)
- content/learn/inspection/dimensional-measurement-robots.mdx — line 128 "**Scenario:** Automotive bracket, 500 parts/day..." (128-142) — "Scenario:" is weaker than required label; line 144 upgrades output ("costs 50% less") to general fact
- content/learn/inspection/machine-vision-inspection-guide.mdx — line 126 "Typical Payback" table (126-131: "$35,000 → $95,000 → 4 months") — invented illustrations presented as "typical" real-world data
- content/learn/inspection/surface-defect-detection-guide.mdx — line 118 "Implementation by Industry... Typical system / Results" blocks (118-138) — read as reported field results, no deployment or source cited
- content/learn/inspection/surface-defect-detection-guide.mdx — line 157 "Typical System Payback" table (157-161: "$500,000-$2M → $800,000-$1.5M → 12-18 months") — invented rows presented as typical fact
- content/learn/agricultural/agricultural-automation-adoption-guide.mdx — line 57 "For a 1,000-acre corn operation:" savings table (57-68) + "pays for itself in a single season" — invented example operation, unlabeled
- content/learn/agricultural/agricultural-automation-adoption-guide.mdx — line 88 "For a 1,000-acre corn/soybean operation" benefit table (88-95) — invented, unlabeled
- content/learn/agricultural/agricultural-automation-adoption-guide.mdx — line 149 adoption-roadmap tables with "Expected Savings" ($25,000-$35,000/year etc.) (149-163) — invented multi-year scenarios as fact
- content/learn/agricultural/agricultural-drone-guide.mdx — line 110 "Row Crop Farm (2,000 acres)" ROI table (110-120: "Net benefit $66,000-$86,000") — invented operation, unlabeled
- content/learn/agricultural/agricultural-drone-guide.mdx — line 122 "Specialty Crop (Vineyard, 200 acres)" benefit table (122-131) — invented operation, unlabeled
- content/learn/agricultural/agricultural-robots-for-specialty-crops.mdx — line 87 weeding ROI table "Annual cost per 100 acres" (87-93) — generic example cost table, no label
- content/learn/agricultural/agricultural-robots-for-specialty-crops.mdx — line 99 harvesting ROI table "Annual savings per 50 acres $100,000-$250,000" (99-105) — same, unlabeled
- content/learn/agricultural/agricultural-robots-guide.mdx — line 91 "Scenario: 500-acre vegetable operation" (91-105: "$150,000+ with 2.5-year payback") — "Scenario" weaker than required label; output upgraded to fact at lines 26/136
- content/learn/agricultural/agricultural-robots-guide.mdx — line 111 "can replace 2-3 seasonal workers and pay back within 2 seasons" — invented outcome, unlabeled
- content/learn/agricultural/autonomous-tractor-guide.mdx — line 93 "Large Row Crop Operation (3,000 acres)" ROI table (93-103: "Payback < 1 season") — invented operation, unlabeled
- content/learn/agricultural/autonomous-tractor-guide.mdx — line 105 "Mid-Size Farm (1,000 acres)" table (105-114: "Payback 1-2 seasons") — invented, unlabeled
- content/learn/agricultural/dairy-farm-robots-guide.mdx — line 105 "200-Cow Dairy Operation" tables (105-123: "Total annual benefit $225,000-$330,000... Payback 4-6 years") — invented operation, unlabeled
- content/learn/agricultural/fruit-harvesting-robots-2026.mdx — line 80 "Economic Analysis" manual-vs-robot cost breakdowns (80-93) — generic example tables presented as typical real-world figures, unlabeled
- content/learn/agricultural/robotic-harvesting-guide.mdx — line 86 "Strawberry Harvesting Cost Comparison (100-acre operation)" (86-95: "Total season cost $430,000-$630,000") — invented operation table, unlabeled
- content/learn/agricultural/robotic-harvesting-guide.mdx — line 99 "Apple Harvesting (50-acre orchard)" table (99-106: "Net annual benefit $50,000-$60,000") — invented, unlabeled
- content/learn/agricultural/robotic-weeding-guide.mdx — line 82 "Specialty Crops (Vegetables, 500 acres)" ROI table (82-90: "Net annual benefit $26,000-$91,000") — invented operation, unlabeled
- content/learn/agricultural/robotic-weeding-guide.mdx — line 92 "Broadacre Row Crops (3,000 acres, See & Spray)" table (92-100: "Payback 5-8 years") — invented, unlabeled
- content/learn/agricultural/robotic-weeding-guide.mdx — line 102 "Organic Production (200 acres)" table (102-111: "Net annual benefit $66,000") — invented, unlabeled

## SOURCED-BUT-VERIFY (per file, optional)
- vs/amazon-proteus-vs-locus-origin.mdx — line 74 — source named in text: "Locus claims" (2-3x productivity); line 82 "Amazon claims" (25-30% throughput); line 84 "Locus publishes" (2-3x, 4x peak)
- vs/amr-vs-agv-warehouse.mdx — line 18 — source named in text: "Locus Robotics reports" (2-3x productivity; repeated 91, 123); lines 131-135 end-list "MHI Annual Industry Report; Interact Analysis; Logistics IQ; MH&L; A3" — not tied to any in-text figure
- vs/autonomous-forklift-vs-traditional-forklift.mdx — line 21 — source named in text: "OSHA data" (85 deaths, 34,900 serious injuries; repeated line 78 "OSHA reports")
- vs/boston-dynamics-atlas-vs-figure-01.mdx — line 74 — source named in text: "Figure claims" (50-100 demonstrations); line 90 "Figure 02 has publicly targeted" sub-$60K; line 142 "Figure has publicly stated" sub-$30K goal — verify statements exist
- vs/boston-dynamics-spot-vs-unitree-b2.mdx — line 22 — source named in text: "RoboScore 87.0 / 81.2" (database-backed if mirrored in DB); lines 139-144 generic source list not tied to price/deployment figures
- vs/cobot-vs-industrial-robot.mdx — lines 130-134 — source named in text: "IFR World Robotics 2025; ISO/TS 15066:2016; Universal Robots TCO benchmarking; FANUC cycle time benchmarks; A3" — end-list only, no claim linked
- vs/kiwibot-vs-starship-delivery-robot.mdx — line 162 — source named in text: "Both companies report" (97%+ completion rates — vendor-reported)
- vs/locus-robotics-vs-6-river-systems.mdx — line 55 — source named in text: "Locus reports" (15-20% throughput); line 63 "6RS reports" (30-40% travel reduction); line 103 "Locus claims" (48-hour deployment)
- vs/sarcos-guardian-vs-ekso-bionics.mdx — line 66 — source named in text: "Sarcos estimates" (3-5x throughput)
- vs/boston-dynamics-stretch-vs-locus-robotics.mdx — line 85 — source named in text: "Locus reports" (positive ROI within first month; echoed unattributed at line 135)
- agricultural/agricultural-robots-for-specialty-crops.mdx — line 30 — source named in text: "National Agricultural Workers Survey" (15% labor decline since 2020; wages +28% — verify NAWS reports these)
- agricultural/agricultural-robots-guide.mdx — lines 150-157 — source named in text: "IFR World Robotics 2025; USDA ERS; A3; FAO; AgFunder; McKinsey (2025)" — trailing block, no body claim linked to a specific source
- agricultural/dairy-farm-robots-guide.mdx — line 33 — source named in text: "USDA" (40% of US dairy farms cite labor availability as top challenge — verify which report)

## CLEAN FILES
- (none — 0 of 47 files are clean)

## COUNTS
tier1_items: 102 | tier2_instances: 668 across 47 files | tier3_items: 48 | files_audited: 47 | clean_files: 0

---
### Auditor notes (cross-file, for remediation)
- Zero named sources in any security or inspection file; SOURCED-BUT-VERIFY is empty for those 10 files.
- Fake-attribution language recurs without any checkable source: "documented", "independent surveys", "market intelligence", "Studies show", "clients document", "facilities report", "published case studies".
- Cross-file contradictions (all unsourced): Spot installed base (hundreds / 500+ / 1,500+ / thousands); guard fully-loaded cost ($25-35/hr vs $28-42/hr vs $55-75K/yr); Vision 60 IP rating (IP54+ vs IP67); UR+ ecosystem (400+ vs 500+); ag labor decline (20% since 2015 / 15% since 2020 / 30-40% per decade); Agras T50 and FarmWise Titan prices differ across files.
- Likely factual errors beyond sourcing: Unitree B2 "$15,000-25,000" (reported ~$100K); Abundant Robotics and Root AI/AppHarvest presented as active (defunct); "Naviio" (probable corruption of Naïo Technologies); Amazon selling Proteus externally (line 142); Skydio X10 65-min flight time; Section 179 "$1,220,000 (2026 limit)".
- FAQ frontmatter repeats many violations and likely emits FAQPage structured data (surgical, forklift, inspection files) — doubles exposure in search results.

## Group 3: cost, market

# MDX Claims Audit — content/learn/cost/ (26) + content/learn/market/ (18)

Audited against docs/claims-policy.md (four-bucket rule). 44 files read in full.
Cross-file inconsistencies found (evidence of invention): global 2026 market = $65B (robotics-market-outlook-2026.mdx:22) vs $72B (robotics-market-by-region-2026.mdx:24); Physical Intelligence funding = $400M / $280M / $680M+ in three different files; Skild AI = $300M / $250M / $550M+; Section 179 2026 limit = $1.22M (depreciation guide) vs $1.16M (lease-vs-buy:69); bonus depreciation 2026 = 60% (warehouse-robot-depreciation-guide.mdx:51) vs 20% in its own table (line 59); Zipline "over 1 million deliveries" (drone-delivery:23) vs "over 65 million deliveries" (drone-delivery:50,175); US robotics VC 2025 = $8B (outlook:91) vs $6.8B (by-region:138). space-robotics-market-2026.mdx presents VIPER ($433M) and Astrobotic Peregrine as active programs (VIPER canceled 2024; Peregrine failed Jan 2024).

## TIER 1 (individual items)
- content/learn/cost/security-robot-cost-guide.mdx:18 — [salary-earnings] "a fully loaded security guard costs $45,000-$75,000 per year for a single shift" — unsourced wage claim anchoring the whole comparison
- content/learn/cost/security-robot-cost-guide.mdx:26 — [named-company-metric] "Knightscope K5 ... $6,000-$9,000 ... Cobalt ... $5,000-$8,000" — vendor lease pricing table, no source
- content/learn/cost/security-robot-cost-guide.mdx:37 — [named-company-metric] "Knightscope typically requires 12-36 month commitments. Early termination penalties range from 50-100%" — unsourced contract terms for named vendor
- content/learn/cost/security-robot-cost-guide.mdx:85 — [salary-earnings] "Allied Universal or Securitas run $22-$40 per hour billed" — named firms + unsourced billed rates
- content/learn/cost/humanoid-robot-cost-guide.mdx:18 — [named-company-metric] "Figure AI, Agility Robotics, 1X ... Apptronik have collectively raised over $5 billion" — unsourced funding total
- content/learn/cost/humanoid-robot-cost-guide.mdx:26 — [named-company-metric] "Figure 02 ... $100,000-$200,000 (pilot)" — per-vendor pilot pricing table, none of it public/sourced
- content/learn/cost/humanoid-robot-cost-guide.mdx:35 — [named-company-metric] "Agility Robotics has built its RoboFab facility with capacity for 10,000 units annually" — unsourced company claim
- content/learn/cost/humanoid-robot-cost-guide.mdx:70 — [salary-earnings] "fully loaded warehouse or manufacturing worker at $45,000-$65,000 per year" — unsourced wage benchmark
- content/learn/cost/construction-robot-cost-guide.mdx:25 — [named-company-metric] "Autonomous excavator ... retrofit $100,000-$150,000" — Built Robotics pricing table, unsourced
- content/learn/cost/construction-robot-cost-guide.mdx:33 — [salary-earnings] "A skilled excavator operator costs $65,000-$95,000 per year fully loaded" — unsourced wage claim
- content/learn/cost/construction-robot-cost-guide.mdx:41 — [named-company-metric] "Dusty Robotics ... Monthly subscription $4,500-$7,000" — unsourced vendor pricing
- content/learn/cost/construction-robot-cost-guide.mdx:58 — [named-company-metric] "Canvas drywall finishing ... $2.50-$4.00/SF | PaintJet ... $3,000-$6,000/mo" — unsourced vendor pricing
- content/learn/cost/construction-robot-cost-guide.mdx:73 — [named-company-metric] "ICON Vulcan $300,000-$500,000 | COBOD BOD2 $500,000-$800,000" — unsourced vendor pricing
- content/learn/cost/agricultural-robot-cost-guide.mdx:25 — [named-company-metric] "FarmWise Titan $150,000-$250,000 | Carbon Robotics LaserWeeder $120,000-$180,000" — unsourced vendor price table
- content/learn/cost/agricultural-robot-cost-guide.mdx:41 — [named-company-metric] "John Deere 8R Autonomous $78,000-$95,000 (autonomy kit premium)" — unsourced vendor price table
- content/learn/cost/agricultural-robot-cost-guide.mdx:50 — [salary-earnings] "A tractor operator costs $50,000-$70,000 per year fully loaded" — unsourced wage claim
- content/learn/cost/agricultural-robot-cost-guide.mdx:82 — [salary-earnings] "300-500 labor hours per acre per season at $15-$20 per hour" — unsourced harvest wage claim
- content/learn/cost/eldercare-robot-cost-guide.mdx:42 — [clinical-safety-outcome] "Over 30 peer-reviewed studies document its effectiveness in reducing agitation, depression" — no study named/cited; clinical efficacy claim
- content/learn/cost/eldercare-robot-cost-guide.mdx:56 — [named-company-metric] "deploying PARO units across 30+ VA medical centers" — named institution, unsourced count
- content/learn/cost/eldercare-robot-cost-guide.mdx:64 — [clinical-safety-outcome] "Documented outcomes include 30-40% reduction in sundowning incidents, 25% fewer emergency calls" — "documented" nowhere; clinical outcome
- content/learn/cost/eldercare-robot-cost-guide.mdx:68 — [salary-earnings] "The median annual cost of a home health aide in the US is $61,776" — fake-precise (Genworth-style) figure, no source; also "$5,350/month" assisted living
- content/learn/cost/surgical-robot-cost-hospital.mdx:33 — [named-company-metric] "Da Vinci 5 ... $2.3M-$2.8M | Hugo RAS ... $1.5M-$2.2M | Mako ... $1.2M-$1.8M" — pricing table, no Sources section in this file
- content/learn/cost/surgical-robot-cost-hospital.mdx:67 — [clinical-safety-outcome] "Mako's precision ... is associated with better outcomes and lower revision rates" — unsourced clinical claim
- content/learn/cost/surgical-robot-cost-hospital.mdx:131 — [clinical-safety-outcome] "Shorter length of stay (0.5-1.5 days average reduction), fewer complications, reduced readmissions" — unsourced clinical outcomes
- content/learn/cost/healthcare-robot-roi-analysis.mdx:19 — [clinical-safety-outcome] "lowers complication rates by 20-40%, and reduces readmissions by 15-25%" — FAQ clinical claim, no source
- content/learn/cost/healthcare-robot-roi-analysis.mdx:52 — [clinical-safety-outcome] "30-day complication rate ... Robotic 8-14% | readmission 3-6% | transfusion 2-8%" — full unsourced clinical outcomes table
- content/learn/cost/healthcare-robot-roi-analysis.mdx:93 — [clinical-safety-outcome] "Medication errors affect 7-10% of hospitalized patients. Each preventable adverse drug event costs $2,800-$5,600" — unsourced
- content/learn/cost/healthcare-robot-roi-analysis.mdx:129 — [unattributed-quote] "Studies consistently show that nurses spend 15-20% of their shift on non-clinical tasks" — "studies" never named
- content/learn/cost/healthcare-robot-roi-analysis.mdx:161 — [clinical-safety-outcome] "UV-C disinfection robots (Xenex, Tru-D, UVD Robots) reduce HAIs by 25-50%" — named companies + unsourced infection-outcome claim
- content/learn/cost/manufacturing-robot-roi-study.mdx:85 — [salary-earnings] "Direct labor $55,000-$70,000/yr per FTE" — unsourced wage row in palletizing table
- content/learn/cost/cobot-roi-calculator-guide.mdx:109 — [clinical-safety-outcome] "Each recordable injury costs $40,000-$80,000 ... Cobots ... reduce injury rates by 50-70%" — unsourced safety-outcome claim
- content/learn/cost/robot-payback-period-calculation.mdx:82 — [salary-earnings] "US Midwest $26-$32/hr ... China (Tier 1 cities) $8-$14/hr" — regional wage table, no source
- content/learn/cost/robot-maintenance-cost-annual.mdx:135 — [salary-earnings] "A dedicated robot maintenance technician costs $65,000-$95,000 annually (fully loaded)" — unsourced
- content/learn/cost/warehouse-automation-budget-guide.mdx:98 — [salary-earnings] "Budget $75,000-$120,000 annually for this role (fully loaded)" — automation engineer salary, unsourced
- content/learn/cost/robot-vs-human-labor-cost-comparison.mdx:35 — [salary-earnings] "Base compensation runs $18-$24 per hour ... base wages total $43,680 per year" — unsourced wage anchor (file claims "Every number is sourced" at line 29 — it is not)
- content/learn/cost/robot-vs-human-labor-cost-comparison.mdx:140 — [named-company-metric] "Amazon operates over 750,000 robots alongside over 1.5 million human employees. Their per-package cost has declined" — unsourced
- content/learn/cost/how-robots-affect-insurance.mdx:37 — [clinical-safety-outcome] "can reduce overexertion claims by 60-80%" — safety-outcome reduction table (lines 43-49) unsourced; BLS cite covers categories, not these percentages
- content/learn/cost/drone-spraying-cost-per-acre.mdx:88 — [named-company-metric] "DJI Agras T50 $18,000-$22,000 | XAG P100 Pro $20,000-$28,000 | Hylio AG-230 $25,000-$35,000" — unsourced vendor price table
- content/learn/market/robotics-market-outlook-2026.mdx:79 — [named-company-metric] "Figure 02 is operational at BMW. Tesla's Optimus is in limited deployment ... Atlas is in pilot programs with Hyundai" — unsourced deployment claims
- content/learn/market/robotics-market-outlook-2026.mdx:107 — [named-company-metric] "Figure: $675M Series B at $2.6B valuation ... Physical Intelligence: $400M" — funding list; amounts contradict two other articles in this repo
- content/learn/market/robotics-market-outlook-2026.mdx:117 — [named-company-metric] "Intuitive Surgical (ISRG) maintains a market cap above $170 billion" — unsourced
- content/learn/market/warehouse-automation-trends-2026.mdx:59 — [named-company-metric] "Locus Origin ... over 300 deployments and 2 billion+ units picked" — unsourced
- content/learn/market/warehouse-automation-trends-2026.mdx:84 — [named-company-metric] "AutoStore operates in over 1,250 installations across 49 countries" — unsourced
- content/learn/market/warehouse-automation-trends-2026.mdx:127 — [named-company-metric] "Geek+ raised $200M ... Berkshire Grey was acquired by SoftBank ... Amazon Robotics ... $1B+ annually" — unsourced deal/spend claims
- content/learn/market/surgical-robotics-market-2026.mdx:47 — [named-company-metric] "over 9,000 da Vinci systems installed ... approximately 65% market share by revenue" — unsourced
- content/learn/market/surgical-robotics-market-2026.mdx:55 — [named-company-metric] "Over 70,000 surgeons worldwide are trained on da Vinci systems" — unsourced
- content/learn/market/surgical-robotics-market-2026.mdx:74 — [named-company-metric] "Over 70% market share in robotic orthopedic surgery ... Procedure volume exceeding 500,000 annually" — Mako stats, unsourced
- content/learn/market/surgical-robotics-market-2026.mdx:116 — [clinical-safety-outcome] "reduce average stay by 1-2 days ... Lower infection rates, less blood loss, and fewer readmissions" — unsourced clinical outcomes
- content/learn/market/surgical-robotics-market-2026.mdx:151 — [clinical-safety-outcome] "Meta-analyses of clinical evidence consistently show ... comparable to or better" — no meta-analysis named
- content/learn/market/agricultural-robotics-investment-2026.mdx:46 — [named-company-metric] "Carbon Robotics: $60M Series C ... Monarch Tractor: $133M ... FarmWise: $80M" — unsourced funding list (lines 44-51)
- content/learn/market/agricultural-robotics-investment-2026.mdx:85 — [named-company-metric] "LaserWeeder ... processes up to 100,000 weeds per hour ... approximately $1 million per unit" — unsourced
- content/learn/market/agricultural-robotics-investment-2026.mdx:87 — [named-company-metric] "See & Spray ... reducing chemical use by 77% compared to broadcast spraying" — precise company performance stat, unsourced
- content/learn/market/agricultural-robotics-investment-2026.mdx:124 — [named-company-metric] "(Lely, DeLaval, GEA) are installed on over 100,000 farms ... penetration rates exceeding 40% in the Netherlands" — unsourced
- content/learn/market/humanoid-robots-market-2026.mdx:44 — [named-company-metric] "Figure: $1.1B+ raised ... Tesla ... $1-2B annually ... Apptronik: $550M+" — cumulative investment list (44-51), unsourced and inconsistent with sibling articles
- content/learn/market/humanoid-robots-market-2026.mdx:66 — [named-company-metric] "Figure is reportedly targeting production of 1,000+ units in 2026" — "reportedly" with no report named
- content/learn/market/robotics-funding-q1-2026.mdx:40 — [named-company-metric] "Apptronik — $350M Series C / Valuation: ~$3.2B ... Physical Intelligence — $280M ... ~$2.4B" — entire mega-round section (40-62) is unsourced deal reporting; amounts conflict with other repo files
- content/learn/market/robotics-funding-q1-2026.mdx:68 — [named-company-metric] "Machina Labs $85M ... Locus Robotics $65M ... Dusty Robotics $38M" — 10-company funding table (66-77), unsourced
- content/learn/market/cobot-adoption-manufacturing-2026.mdx:57 — [named-company-metric] "approximately 40% global market share. Over 75,000 UR cobots are deployed" — unsourced
- content/learn/market/cobot-adoption-manufacturing-2026.mdx:87 — [salary-earnings] "a CNC operator costs $45,000-65,000 per year in fully loaded wages" — unsourced
- content/learn/market/cobot-adoption-manufacturing-2026.mdx:130 — [unattributed-quote] "Multiple manufacturers report 10-20% reduction in turnover after cobot deployment" — unattributed testimonial-style claim
- content/learn/market/drone-delivery-market-2026.mdx:23 — [named-company-metric] "Zipline delivered over 1 million commercial packages. Wing (Alphabet) surpassed 350,000 deliveries" — unsourced
- content/learn/market/drone-delivery-market-2026.mdx:50 — [named-company-metric] "Zipline ... over 65 million commercial deliveries since 2016" — contradicts line 23 by 65x; likely fabricated/confused metric
- content/learn/market/drone-delivery-market-2026.mdx:72 — [named-company-metric] "Meituan alone completing over 2 million drone deliveries in 2025" — unsourced
- content/learn/market/drone-delivery-market-2026.mdx:118 — [named-company-metric] "Zipline has raised over $900 million" — unsourced
- content/learn/market/drone-delivery-market-2026.mdx:175 — [clinical-safety-outcome] "Zipline has completed over 65 million deliveries with zero serious injuries" — safety-outcome claim built on an internally contradicted number; also "risk ... significantly lower than ground vehicle delivery" unsourced
- content/learn/market/robotics-ai-integration-2026.mdx:58 — [named-company-metric] "Physical Intelligence (Pi): Raised $680M+" — third different figure for same company across repo files
- content/learn/market/robotics-ai-integration-2026.mdx:60 — [named-company-metric] "Skild AI: Raised $550M+" — conflicts with $300M and $250M in sibling articles
- content/learn/market/robotics-ai-integration-2026.mdx:68 — [named-company-metric] "The RO1 robot arm ($5,000 starting price)" — unsourced and implausible vendor price
- content/learn/market/robotics-jobs-market-2026.mdx:31 — [salary-earnings] "Robotics Engineers 320,000 ... $115,000-165,000" — full salary/employment table (29-40) with fake-precise unsourced figures
- content/learn/market/robotics-jobs-market-2026.mdx:137 — [named-company-metric] "The Bureau of Labor Statistics estimates that 12-15 million U.S. workers will need to change occupational categories ... by 2030" — likely misattribution (McKinsey-style figure ascribed to BLS); policy's "no causal upgrades"
- content/learn/market/robotics-jobs-market-2026.mdx:140 — [named-company-metric] "Amazon's Career Choice program: $1.2 billion investment" — unsourced
- content/learn/market/robotics-jobs-market-2026.mdx:141 — [named-company-metric] "FANUC and UR training academies ... certified over 200,000 individuals" — unsourced
- content/learn/market/robotics-jobs-market-2026.mdx:157 — [salary-earnings] "Robotics Engineer $90,000-110,000 | ... AI/ML $200,000-280,000" — salary benchmark table (155-162), unsourced
- content/learn/market/underwater-robotics-market-2026.mdx:31 — [named-company-metric] "U.S. Navy's Unmanned Undersea Vehicle (UUV) programs alone represent over $800 million in annual procurement" — unsourced
- content/learn/market/underwater-robotics-market-2026.mdx:49 — [named-company-metric] "Oceaneering operates the world's largest ROV fleet, with approximately 250 vehicles" + line 51 "approximately $800 million annually" revenue — unsourced
- content/learn/market/space-robotics-market-2026.mdx:41 — [named-company-metric] "GITAI ... Over $70 million in funding through 2025" — unsourced
- content/learn/market/space-robotics-market-2026.mdx:43 — [named-company-metric] "Astrobotic ... Over $600 million in NASA contracts" — unsourced; also presents failed Peregrine mission as current
- content/learn/market/space-robotics-market-2026.mdx:53 — [named-company-metric] "VIPER rover: $433 million investment ... spending 100 days at the lunar south pole" — mission canceled in 2024, presented as active fact
- content/learn/market/security-robot-market-2026.mdx:22 — [salary-earnings] "Guard wages have risen 18% since 2020, reaching $18-$28/hour ... Fully loaded annual cost per guard: $55,000-$85,000" — unsourced
- content/learn/market/security-robot-market-2026.mdx:40 — [named-company-metric] "K5 ... Detects an average of 40-60 anomalies per 24-hour cycle ... $6-$12/hour" — fabricated-looking Knightscope performance metric
- content/learn/market/security-robot-market-2026.mdx:54 — [named-company-metric] "Cobalt ... Pricing at $8-$15/hour includes remote specialist service" — unsourced vendor pricing
- content/learn/market/top-robotics-companies-by-revenue.mdx:34 — [named-company-metric] "Intuitive Surgical $8.4B ... Locus Robotics $0.6B ... Boston Dynamics $0.7B ... Agility Robotics $0.4B" — entire top-20 revenue table (32-53) of invented/uncheckable figures; note at 55 admits "estimates" with no checkable source
- content/learn/market/top-robotics-companies-by-revenue.mdx:98 — [named-company-metric] "Operating margin: approximately 35% ... Installed base: 9,200+ ... Procedures: 2.2 million+" — Intuitive financials, unsourced
- content/learn/market/top-robotics-companies-by-revenue.mdx:118 — [named-company-metric] "Symbotic ... $2.4 billion (65% YoY) ... Backlog: $12+ billion ... Walmart (25 distribution centers contracted)" — unsourced
- content/learn/market/top-robotics-companies-by-revenue.mdx:144 — [named-company-metric] "Figure AI ... $2.6 billion in total funding ... Valuation: $15 billion" — conflicts with outlook article's "$675M Series B at $2.6B valuation"
- content/learn/market/top-robotics-companies-by-revenue.mdx:154 — [named-company-metric] "Covariant ... $100M+ ARR" — unsourced private-company financials
- content/learn/market/robotics-ipo-pipeline-2026.mdx:28 — [named-company-metric] "Symbotic's strong post-IPO performance (up 180% from listing price)" — unsourced market-performance figure
- content/learn/market/robotics-ipo-pipeline-2026.mdx:37 — [named-company-metric] "Figure AI ... $15 billion (Series B, 2025) ... reports indicate S-1 preparation underway" — unnamed "reports"
- content/learn/market/robotics-ipo-pipeline-2026.mdx:51 — [named-company-metric] "Locus ... $2 billion+ (estimated) ... Revenue ... Approximately $600 million" — unsourced private financials
- content/learn/market/robotics-ipo-pipeline-2026.mdx:65 — [named-company-metric] "Covariant ... $2.5 billion (estimated) ... $100 million+ ARR" — unsourced
- content/learn/market/robotics-ipo-pipeline-2026.mdx:106 — [named-company-metric] "Apptronik $1B+ | Nuro $5B+ | RealPage Robotics $300M+" — watchlist valuation table (106-113); "RealPage Robotics" appears invented
- content/learn/market/china-robotics-industry-overview.mdx:50 — [named-company-metric] "UBTECH ... $800M+ ... $10B+ | Agibot $500M $3B | Unitree $200M $1.5B" — funding/valuation table (48-54), unsourced
- content/learn/market/china-robotics-industry-overview.mdx:62 — [named-company-metric] "ESTUN Automation $800M | Siasun $600M | STEP Robot $450M" — company revenue table (60-68), unsourced
- content/learn/market/china-robotics-industry-overview.mdx:74 — [named-company-metric] "Pudu Robotics ... 70,000+ units deployed in 60+ countries | Keenon ... 50,000+" — deployment table (72-78), unsourced
- content/learn/market/robotics-as-a-service-raas-guide.mdx:51 — [named-company-metric] "Locus Robotics AMR $2,500-$4,000 ... Knightscope K5 $6,000-$9,000 ... Xenex $3,000-$5,000" — four vendor pricing tables (49-81) covering 15 named vendors, all unsourced
- content/learn/market/robotics-as-a-service-raas-guide.mdx:101 — [named-company-metric] "Formic charges $8 to $15 per robot-hour" — unsourced vendor pricing

## TIER 2 (per file)
- content/learn/cost/security-robot-cost-guide.mdx — 12 instances — worst: line 107 "three-shift guard coverage for two patrol posts: ... $810,000-$1,350,000 over three years"
- content/learn/cost/humanoid-robot-cost-guide.mdx — 10 instances — worst: line 58 "forward-looking model based on vendor roadmaps for 2027-2028" (at-scale cost table presented with point precision)
- content/learn/cost/construction-robot-cost-guide.mdx — 14 instances — worst: line 17 "$3.2 billion market growing at over 15% annually" (also line 19 claims "actual deployment data" never shown)
- content/learn/cost/agricultural-robot-cost-guide.mdx — 12 instances — worst: line 35 "Precision weeding robots reduce herbicide use by 80-95%"
- content/learn/cost/eldercare-robot-cost-guide.mdx — 8 instances — worst: line 66 "can expect annual savings of $80,000-$200,000 in reduced behavioral incident costs" (hypothetical presented as typical result)
- content/learn/cost/surgical-robot-cost-guide.mdx — 3 residual instances — worst: line 165 "Hospitals with robotic surgery programs report 15-30% case volume increases within 24 months" (Sources block is generic, this stat not tied to any)
- content/learn/cost/delivery-robot-cost-guide.mdx — 3 residual instances — worst: line 165 "cost per delivery is expected to decrease 15-20% annually at fleet level through 2028" (invented future, no source making the prediction)
- content/learn/cost/drone-cost-guide.mdx — 3 residual instances — worst: line 23 "Drones reduce inspection costs by 70-90% compared to traditional methods"
- content/learn/cost/warehouse-robot-cost-guide.mdx — 3 residual instances — worst: line 144 "Per-unit costs have declined 15-25% over the past five years ... Expect continued modest price declines (5-10% per year)"
- content/learn/cost/cobot-cost-guide.mdx — 2 residual instances — worst: line 170 "retain 40-60% of purchase value after 3 years ... based on secondary market data" (data not named)
- content/learn/cost/warehouse-automation-roi-by-size.mdx — 22 instances — worst: line 34 "based on deployment data from 200+ warehouse automation projects" (uncheckable dataset underwriting every benchmark table incl. line 190 "10-year NPV ... $15M-$60M")
- content/learn/cost/healthcare-robot-roi-analysis.mdx — 15 instances — worst: line 159 "A 400-bed hospital experiences 400-800 HAIs annually — a $8M-$40M problem"
- content/learn/cost/manufacturing-robot-roi-study.mdx — 25 instances — worst: line 33 "208 documented deployments across 14 countries" (invented-precision dataset; whole file presents it as an empirical study, incl. "22% of deployments fail" at line 23/26)
- content/learn/cost/how-much-does-a-warehouse-robot-cost-2026.mdx — 12 instances — worst: line 60 "Facilities that invest in structured 30-day onboarding programs see 40% faster time-to-productivity"
- content/learn/cost/cobot-roi-calculator-guide.mdx — 12 instances — worst: line 146 "our analysis of 200+ cobot installations" (uncheckable; underwrites ROI benchmark table 148-154)
- content/learn/cost/robot-payback-period-calculation.mdx — 8 instances — worst: line 115 "Based on industry data from 2025-2026 deployments" (unnamed data behind payback benchmark table)
- content/learn/cost/total-cost-of-ownership-industrial-robot.mdx — 10 instances — worst: line 142 "The robot saves $274,000 or more over five years — a 49% cost reduction" (model output presented as real-world fact)
- content/learn/cost/warehouse-automation-budget-guide.mdx — 3 instances — worst: line 154 "rising labor costs (5-8% annually)"
- content/learn/cost/surgical-robot-cost-hospital.mdx — 10 instances — worst: line 135 "Robotic surgery programs typically increase surgical case volume by 15-25% within two years"
- content/learn/cost/drone-spraying-cost-per-acre.mdx — 8 instances — worst: line 139 "Precision drone application typically reduces chemical usage by 15-30%"
- content/learn/cost/robot-maintenance-cost-annual.mdx — 12 instances — worst: line 143 "Facilities using predictive maintenance report 25-40% reduction in unplanned downtime and 15-25% reduction in total maintenance cost"
- content/learn/cost/warehouse-robot-depreciation-guide.mdx — 5 instances — worst: line 51 "Bonus depreciation allows 60% first-year deduction in 2026" (contradicted by its own table at line 59 showing 20%)
- content/learn/cost/robot-vs-human-labor-cost-comparison.mdx — 10 instances — worst: line 37 "Health insurance averages $7,900 per employee annually (employer share)" (fake-precise, unsourced)
- content/learn/cost/how-to-get-cfo-buy-in-robotics.mdx — 6 instances — worst: line 115 "the warehouse robotics market is growing at 23% annually through 2028" (also line 35 "approval rates roughly 3x higher")
- content/learn/cost/lease-vs-buy-robots.mdx — 6 instances — worst: line 69 "Section 179 allows first-year expensing up to $1.16 million ... in 2026" (conflicts with $1.22M in depreciation guide)
- content/learn/cost/how-robots-affect-insurance.mdx — 8 instances — worst: line 25 "reduces workers compensation premiums by 15-35% over 2-3 years"
- content/learn/market/robotics-market-outlook-2026.mdx — 30 instances — worst: lines 32-41 eight-segment market-size/CAGR table (all invented precision; plus line 22 "$65 billion ... $90-100 billion by 2028", line 81 "$10-15 billion by 2030" from unnamed "industry analysts")
- content/learn/market/warehouse-automation-trends-2026.mdx — 25 instances — worst: line 23 "valued at approximately $23 billion, growing at 15% annually. Over 80% of large 3PLs now operate some form of robotic automation"
- content/learn/market/surgical-robotics-market-2026.mdx — 18 instances — worst: line 130 "projected to reach $15-18 billion by 2030" (no source making the projection; line 61 "Industry analysts estimate Hugo could capture 15-20% market share by 2028" — analysts unnamed)
- content/learn/market/agricultural-robotics-investment-2026.mdx — 20 instances — worst: line 22 "projected to reach $12.1 billion by 2026 ... Venture capital invested over $2.3 billion in AgRobotics companies in 2025"
- content/learn/market/humanoid-robots-market-2026.mdx — 20 instances — worst: lines 31-36 market projection table out to 2030 (~100,000+ units, $10-15B) with no source
- content/learn/market/robotics-funding-q1-2026.mdx — 15 instances — worst: line 20 "totaled an estimated $3.8 billion across 127 deals" (entire quarter's dataset invented/uncheckable; line 139 "Median Series B valuation increased to approximately $350M")
- content/learn/market/cobot-adoption-manufacturing-2026.mdx — 20 instances — worst: lines 31-38 year-by-year installation time series (32,000→82,000 units, fake precision, no IFR attribution)
- content/learn/market/drone-delivery-market-2026.mdx — 18 instances — worst: line 23 "projected to reach $4.2 billion in 2026, growing at 38% annually ... exceed $12 billion by 2030" (plus 2027/2028/2030 volume forecasts at 156-159)
- content/learn/market/robotics-ai-integration-2026.mdx — 15 instances — worst: lines 140-145 value-distribution table (Hardware 60%→25%, Software 15%→50% by 2030 — invented percentages presented as data)
- content/learn/market/robotics-jobs-market-2026.mdx — 15 instances — worst: line 21 "directly employs an estimated 2.1 million people globally ... adds an estimated 5-8 million more"
- content/learn/market/underwater-robotics-market-2026.mdx — 12 instances — worst: line 79 "A resident ROV system ... $5,000-$15,000 per day, a 90% cost reduction"
- content/learn/market/space-robotics-market-2026.mdx — 12 instances — worst: line 18 "reached approximately $16 billion in 2026" (plus line 77 "$32-$40 billion by 2032" from unnamed "industry analysts")
- content/learn/market/security-robot-market-2026.mdx — 12 instances — worst: line 22 "employs 1.1 million guards but faces a 200,000+ unfilled position shortage" (plus line 77 program-savings hypothetical presented as typical)
- content/learn/market/robotics-market-by-region-2026.mdx — 25 instances — worst: line 24 "$72 billion in 2026" (directly contradicts $65B in robotics-market-outlook-2026.mdx for the same year; robot-density and installation figures throughout are unattributed IFR-style data)
- content/learn/market/top-robotics-companies-by-revenue.mdx — 8 instances — worst: line 59 "Together they hold approximately 55% of the global industrial robot market"
- content/learn/market/robotics-ipo-pipeline-2026.mdx — 10 instances — worst: lines 135-141 revenue-multiple table (8-15x RaaS, 30-100x pre-revenue) presented as market data with no source
- content/learn/market/china-robotics-industry-overview.mdx — 15 instances — worst: line 25 "$35 billion robotics industry accounts for over 50% of global robot installations" (plus line 29 "290,000 industrial robots in 2025 — more than the rest of the world combined")
- content/learn/market/robotics-as-a-service-raas-guide.mdx — 8 instances — worst: line 26 "grown to represent 35 to 40% of commercial robot deployments in 2026" (MarketsandMarkets cite covers market size only, not this share)

## TIER 3 (per file)
- content/learn/cost/security-robot-cost-guide.mdx — line 95 "For a mid-size commercial property deploying two outdoor patrol robots" — full 3-year TCO table (97-105) for an invented deployment, no SAMPLE/illustrative label in rendered text
- content/learn/cost/warehouse-automation-roi-by-size.mdx — line 53 "ROI Case Study: 22,000 Sq Ft E-Commerce Fulfillment" — invented before/after case study ("Payback: 8 months") presented as a real deployment, never labeled illustrative
- content/learn/cost/warehouse-automation-roi-by-size.mdx — line 99 "ROI Case Study: 55,000 Sq Ft Parts Distribution" — invented case study with vendor-specific detail (AutoStore, $2.88M), unlabeled
- content/learn/cost/warehouse-automation-roi-by-size.mdx — line 141 "ROI Case Study: 120,000 Sq Ft E-Commerce Fulfillment" — invented case study (Exotec, $8.4M, "Payback: 28 months"), unlabeled
- content/learn/cost/healthcare-robot-roi-analysis.mdx — line 109 "Financial Model: 400-Bed Hospital" — hypothetical hospital yielding "Payback: 5.8 months" with fabricated inputs (800 fewer errors x $4,000), not labeled illustrative
- content/learn/cost/healthcare-robot-roi-analysis.mdx — line 133 "Fleet: 8 autonomous delivery robots" — invented fleet model yielding "Payback: 4.1 months", not labeled illustrative
- content/learn/cost/how-much-does-a-warehouse-robot-cost-2026.mdx — line 116 "For a mid-size warehouse deploying 15 collaborative picking AMRs ... roughly $815K total" — invented scenario stated as "the math works out", no illustrative label

## SOURCED-BUT-VERIFY (per file, optional)
- surgical-robot-cost-guide.mdx — lines 190-197 — source named in text: "Intuitive Surgical Annual Report (2025); Stryker Mako Product Economics Disclosure; AHA Capital Equipment Survey; Becker's; ECRI; Journal of Robotic Surgery" — VERIFY: "Stryker Mako Product Economics Disclosure" does not appear to be a real published document; inline stats are not tied to specific sources
- delivery-robot-cost-guide.mdx — lines 167-174 — source named in text: "Starship Technologies Operations Data (2025); McKinsey; NCSL PDD tracker; FAA; Pitchbook; IEEE" — VERIFY: "Starship Technologies Operations Data" is not a checkable publication; line 153 Starship profitability claim rests on it
- drone-cost-guide.mdx — lines 170-177 — source named in text: "FAA Aerospace Forecast; AUVSI Economic Impact Study; DroneDeploy Benchmarks; USDA; Drone Industry Insights; Pix4D survey" — line 25 "$54 billion" market figure plausibly from DII/AUVSI but not pinned
- warehouse-robot-cost-guide.mdx — lines 146-153 — source named in text: "Interact Analysis 2025; MHI Annual Industry Report; Robotics Business Review TCO Study (80+ installations); BLS; LogisticsIQ; WERC" — the "80+ installations" analysis claimed as "our analysis" at line 27 is attributed to RBR at line 150; verify which
- cobot-cost-guide.mdx — lines 176-183 — source named in text: "IFR World Robotics 2025; UR distributor network; RIA; BLS; Robotiq State of Cobots; FANUC CRX docs" — MTBF 35,000 hrs (line 54) and ~50% UR share (line 31) should trace to these
- agricultural-robot-cost-guide.mdx — line 17 — source named in text: "USDA" ("farm labor costs have increased 20% ... workforce has shrunk by 15% ... average age ... 41") — verify these are actual USDA figures
- robot-vs-human-labor-cost-comparison.mdx — line 39 — source named in text: "Bureau of Labor Statistics" (43% warehouse turnover) — the attached $5,000-$8,000 replacement cost is NOT BLS and is unsourced
- how-robots-affect-insurance.mdx — line 35 — source named in text: "Bureau of Labor Statistics" (five most common warehouse injury categories) — the percentage table and reduction estimates at 43-49 are not BLS
- robotics-market-outlook-2026.mdx — line 57 — source named in text: "International Federation of Robotics" (560,000 installs 2025 / 531,000 2023)
- cobot-adoption-manufacturing-2026.mdx — line 104 — source named in text: "American Welding Society" (shortfall of 400,000 welders by 2025)
- robotics-as-a-service-raas-guide.mdx — line 19 — source named in text: "MarketsandMarkets" ($22.4B 2025 → $34.7B 2028 RaaS market)
- humanoid-robots-market-2026.mdx — line 70 — source named in text: "Elon Musk has projected" (Optimus "thousands" 2026 / "millions" 2029 — prediction correctly attributed to the person making it)

## CLEAN FILES
- (none — all 44 files contain at least Tier-2 violations; the least-violating files are warehouse-automation-budget-guide.mdx and warehouse-robot-depreciation-guide.mdx)

## COUNTS
tier1_items: 96 | tier2_instances: ~537 across 44 files | tier3_items: 7 | files_audited: 44 | clean_files: 0

## Group 4: warehouse, humanoid, getting-started

# MDX Claims Audit — content/learn/{warehouse,humanoid,getting-started} (47 files)
Audited against docs/claims-policy.md (four-bucket rule). READ-ONLY audit; no repo files modified.

## TIER 1 (individual items)
- content/learn/warehouse/best-robots-for-small-warehouses.mdx:114 — [named-company-metric] "Comparing to Amazon — Their robots cost $100M+" — Amazon investment figure stated as fact, no source
- content/learn/warehouse/best-autonomous-mobile-robots-2026.mdx:43 — [named-company-metric] "With over 2 billion units picked across its installed base" — Locus vendor metric stated as fact, unattributed
- content/learn/warehouse/best-amr-picking-robots-2026.mdx:41 — [named-company-metric] "over 2 billion units picked across 300+ warehouse deployments" — Locus metrics unsourced; contradicts "800 facilities" in another article
- content/learn/warehouse/autonomous-forklift-guide-2026.mdx:149 — [clinical-safety-outcome] "Accident rates for autonomous forklifts are significantly lower than for human-operated equipment" — safety outcome claim, no source
- content/learn/warehouse/goods-to-person-systems-guide.mdx:50 — [named-company-metric] "AutoStore is the market leader... with over 1,250 systems installed across 49 countries" — unsourced
- content/learn/warehouse/goods-to-person-systems-guide.mdx:52 — [named-company-metric] "The system operates with 99.7% uptime" — AutoStore uptime metric stated as fact, unsourced
- content/learn/warehouse/best-warehouse-robots-2026.mdx:52 — [named-company-metric] "Deployed in 300+ warehouses globally with over 2 billion units picked" — Locus; not covered by the article's Sources block
- content/learn/warehouse/cube-storage-systems-guide.mdx:38 — [named-company-metric] "AutoStore — the pioneer and market leader with over 1,250 installations globally" — unsourced
- content/learn/warehouse/cube-storage-systems-guide.mdx:73 — [named-company-metric] "Installations worldwide | 1,250+ | 100+" — AutoStore/Exotec install counts in comparison table, unsourced
- content/learn/warehouse/agv-safety-standards-guide.mdx:30 — [clinical-safety-outcome] "OSHA recorded over 340 incidents involving automated guided vehicles... Eleven resulted in fatalities" — fatality/incident data attributed to OSHA with no citation; OSHA publishes no such AGV-specific series
- content/learn/warehouse/robots-for-small-warehouse-under-50000.mdx:46 — [named-company-metric] "Locus Origin... with over 800 facilities running their robots globally" — unsourced; contradicts "300+ warehouses" elsewhere on the site
- content/learn/warehouse/warehouse-automation-roi-case-study-2026.mdx:29 — [unattributed-quote] "We verified data through site visits, financial documentation, and interviews... This is not vendor marketing data" — fabricated verification claim anchoring 5 anonymous "real" case studies
- content/learn/warehouse/warehouse-automation-roi-case-study-2026.mdx:57 — [named-company-metric] "Picks per labor hour | 85 | 195 | +129%" — invented before/after financials for anonymous facility using named vendors (Locus, Manhattan Active); entire file (5 case studies, L31-249) is unverifiable data presented as audited fact
- content/learn/warehouse/warehouse-automation-roi-case-study-2026.mdx:150 — [clinical-safety-outcome] "Palletizing injuries per year | 6 | 0 | -100%" — injury-elimination outcome claim from invented case study
- content/learn/warehouse/warehouse-automation-roi-case-study-2026.mdx:257 — [named-company-metric] "E-commerce (Ohio) | AMR picking | $987K | 12.1 months | 82% of projected" — summary table of five fictitious "verified" deployments
- content/learn/getting-started/automation-readiness-assessment.mdx:29 — [named-company-metric] "Industry data from the Robotics Industries Association shows that 34% of first-time robot deployments experience significant delays" — named institution + stat, no checkable citation
- content/learn/getting-started/warehouse-automation-mistakes.mdx:30 — [unattributed-quote] "After analyzing deployment data from over 200 warehouse automation projects" — fabricated first-person research dataset claim
- content/learn/getting-started/robot-deployment-failure-reasons.mdx:29 — [unattributed-quote] "After analyzing data from over 400 warehouse and manufacturing robot deployments" — fabricated first-person research dataset claim
- content/learn/humanoid/figure-robot-vs-boston-dynamics-atlas.mdx:81 — [named-company-metric] "Figure demonstrated 67 consecutive hours of autonomous operation at BMW's Spartanburg facility" — unsourced Figure/BMW metric (recurs site-wide)
- content/learn/humanoid/fleet-learning-robotics.mdx:71 — [named-company-metric] "At BMW's Spartanburg facility, Figure 02 operated autonomously for 67 consecutive hours" — same unsourced claim
- content/learn/humanoid/robotics-deployment-timeline.mdx:36 — [named-company-metric] "Twelve years. Over $5 billion in investment. Hundreds of millions of miles" — Waymo investment figure unsourced
- content/learn/humanoid/robotics-deployment-timeline.mdx:50 — [named-company-metric] "Figure's 67 hours of autonomous operation at BMW" — repeat of unsourced claim
- content/learn/humanoid/humanoid-robot-use-cases-2026.mdx:62 — [named-company-metric] "Figure 02's BMW deployment demonstrated 67 hours of autonomous warehouse operation" — repeat
- content/learn/humanoid/humanoid-robot-cost-2026.mdx:44 — [named-company-metric] "Figure 03... priced in the $30,000 to $50,000 range... autonomous operation periods exceeding 60 hours" — invented pricing for product with no public price
- content/learn/humanoid/humanoid-robot-cost-2026.mdx:48 — [named-company-metric] "Boston Dynamics Atlas (Electric) occupies the premium segment at $100,000 to $150,000 per unit" — invented pricing; Atlas has no published price
- content/learn/humanoid/humanoid-robot-cost-2026.mdx:50 — [named-company-metric] "Apptronik Apollo and Agility Digit fall in the $50,000 to $80,000 range" — invented pricing
- content/learn/humanoid/humanoid-robot-cost-2026.mdx:76 — [named-company-metric] "Figure AI went from hand-building prototypes to producing hundreds of units per month. Tesla plans thousands per month" — unsourced production metrics
- content/learn/humanoid/humanoid-robot-cost-2026.mdx:86 — [named-company-metric] "Agility Robotics offers Digit through RaaS agreements starting at approximately $10 per hour" — unsourced vendor pricing
- content/learn/humanoid/top-humanoid-robot-companies-2026.mdx:26 — [unattributed-quote] "We update these rankings quarterly based on verified deployment data" — fabricated verification claim for rankings built on invented numbers
- content/learn/humanoid/top-humanoid-robot-companies-2026.mdx:35 — [named-company-metric] "Units Deployed: 1,000+ (primarily internal)... external sales in the $20,000-$30,000 range" — Tesla Optimus deployment/sales figures unsourced
- content/learn/humanoid/top-humanoid-robot-companies-2026.mdx:43 — [named-company-metric] "Funding: $2.6 billion+ | Valuation: $39 billion | Units Deployed: 500+" — Figure units-deployed invented; figures presented without source
- content/learn/humanoid/top-humanoid-robot-companies-2026.mdx:54 — [named-company-metric] "Digit units operating in Amazon warehouses since 2024... RoboFab... capable of producing 10,000 units annually" — Agility/Amazon claims unsourced
- content/learn/humanoid/top-humanoid-robot-companies-2026.mdx:59 — [named-company-metric] "Funding: $150 million+ | Units Deployed: 2,000+" — Unitree figures unsourced
- content/learn/humanoid/top-humanoid-robot-companies-2026.mdx:71 — [named-company-metric] "Funding: $500 million+... Units Deployed: 100+" (1X) — catch-all: ALL 11 remaining company entries (L71-158: 1X, Boston Dynamics, Apptronik, UBTECH, Sanctuary, Kepler, EngineAI, Fourier, Xiaomi, Agibot, Mentee) carry unsourced funding + units-deployed figures
- content/learn/humanoid/us-vs-china-robotics-strategic.mdx:70 — [named-company-metric] "Figure 03's 67-hour autonomous operation periods" — repeat of unsourced claim
- content/learn/humanoid/robot-roi-calculator-guide.mdx:38 — [named-company-metric] "The Bureau of Labor Statistics reports that total compensation for warehouse and logistics workers averages $46 per hour" — BLS attribution not supported by any BLS series; $46 anchors the article's entire ROI math
- content/learn/humanoid/robot-roi-calculator-guide.mdx:62 — [named-company-metric] "Agility Robotics offers Digit through RaaS agreements at $10-30 per operating hour" — unsourced vendor pricing, repeated site-wide
- content/learn/humanoid/robot-roi-calculator-guide.mdx:142 — [named-company-metric] "85% operating efficiency, which aligns with reported performance from Agility and Figure AI commercial deployments" — invented performance data attributed to named companies
- content/learn/humanoid/humanoid-use-cases-proven-2026.mdx:37 — [named-company-metric] "Agility Digit at Amazon fulfillment centers, Figure 03 at BMW logistics... 60-80% of human pick rates with 99.5%+ accuracy" — invented performance metrics attached to named deployments
- content/learn/humanoid/humanoid-use-cases-proven-2026.mdx:47 — [named-company-metric] "Tesla Optimus at Tesla Fremont and Austin... Near-human throughput for parts kitting" — unsourced deployment/performance claim
- content/learn/humanoid/humanoid-use-cases-proven-2026.mdx:58 — [named-company-metric] "Relay Robotics at 500+ hospitals... 95%+ on-time delivery rates" — unsourced
- content/learn/humanoid/humanoid-use-cases-proven-2026.mdx:71 — [named-company-metric] "1X NEO at commercial facilities... human-level or better detection rates" — unsourced performance claim; ditto UBTECH "High guest satisfaction scores" L81-82
- content/learn/humanoid/humanoid-use-cases-proven-2026.mdx:92 — [named-company-metric] "Simbe Tally (wheeled, 100+ stores)... 95%+ planogram compliance detection" — unsourced
- content/learn/humanoid/eldercare-robots-caregiver-shortage.mdx:45 — [named-company-metric] "Over 700 TUG robots operate in healthcare facilities across the US" — unsourced
- content/learn/humanoid/eldercare-robots-caregiver-shortage.mdx:49 — [named-company-metric] "TUG achieves 95%+ on-time delivery rates" — unsourced vendor performance metric
- content/learn/humanoid/eldercare-robots-caregiver-shortage.mdx:53 — [named-company-metric] "Relay builds autonomous delivery robots deployed in over 500 hospitals" — unsourced
- content/learn/humanoid/eldercare-robots-caregiver-shortage.mdx:61 — [clinical-safety-outcome] "PARO... documented benefits in reducing agitation and improving mood in residents with Alzheimer's disease. Over 5,000 units" — clinical outcome claim with no peer-reviewed citation (policy's highest-risk category)
- content/learn/humanoid/eldercare-robots-caregiver-shortage.mdx:87 — [named-company-metric] "Early data from facilities using TUG and Relay robots shows turnover reductions of 10-15 percentage points" — invented outcome data tied to named vendors
- content/learn/humanoid/figure-ai-robot-review.mdx:67 — [named-company-metric] "actuator cost per unit dropped from approximately $1,200 (Figure 01) to under $400 (Figure 03)" — internal BOM costs presented as fact; not public information
- content/learn/humanoid/figure-ai-robot-review.mdx:73 — [named-company-metric] "commercial-grade humanoid robot in the $30,000-$50,000 price range" — invented Figure 03 pricing
- content/learn/humanoid/figure-ai-robot-review.mdx:79 — [named-company-metric] "operated continuously for 67 hours... paused for charging cycles (approximately 90 minutes every 6-7 hours)" — unsourced claim embellished with invented operational detail; article itself concedes it lacks verification (L85)
- content/learn/humanoid/figure-ai-robot-review.mdx:105 — [named-company-metric] "Grasping success rates... exceed 95%... navigates without collisions... exceeding 99.5%... uptime rates exceed 95%" — invented third-party-sounding performance data (L105-111)
- content/learn/humanoid/robots-as-a-service-guide.mdx:62 — [named-company-metric] "Warehouse AMRs (Locus, 6 River): $5-$12/hr... Humanoid robots (Agility Digit, Figure 03): $10-$30/hr..." — per-vendor RaaS price table, all unsourced (L62-65)
- content/learn/humanoid/data-flywheel-robotics.mdx:92 — [named-company-metric] "Digit units operating in Amazon fulfillment centers since 2024. Two years of continuous operational data" — overstates a limited pilot as sustained deployment, unsourced

## TIER 2 (per file)
- content/learn/warehouse/best-robots-for-small-warehouses.mdx — 5 instances — worst: line 106 "Against potential savings of $150,000–$400,000/year in labor costs"
- content/learn/warehouse/best-autonomous-mobile-robots-2026.mdx — 4 instances — worst: line 27 "The global AMR market in warehousing surpassed $4 billion in 2025"
- content/learn/warehouse/best-amr-picking-robots-2026.mdx — 5 instances — worst: line 23 "AMR-assisted picking deployments grew 52% year-over-year"
- content/learn/warehouse/autonomous-forklift-guide-2026.mdx — 3 instances — worst: line 22 "85 workplace deaths and 34,000 serious injuries annually... turnover rate... exceeds 40%"
- content/learn/warehouse/goods-to-person-systems-guide.mdx — 6 instances — worst: line 18 "consumes 50-70% of a picker's time... 3-5x productivity increase and up to 75% reduction in warehouse footprint"
- content/learn/warehouse/warehouse-robot-fleet-sizing.mdx — 6 instances — worst: line 94 "Industry data shows 3-5% planned downtime for well-maintained AMR fleets"
- content/learn/warehouse/best-warehouse-robots-2026.mdx — 1 instance — worst: line 94 "Vision-guided picking... reached 95%+ reliability in 2025" (not plausibly covered by the Sources block)
- content/learn/warehouse/agv-vs-amr-which-to-choose.mdx — 3 instances — worst: line 64 "a tugger AGV... can move 150+ pallets per hour... An AMR... roughly 120 pallets per hour"
- content/learn/warehouse/agv-navigation-technologies-compared.mdx — 3 instances — worst: line 183 "In 2020, roughly 60% of new AGV deployments used tape or wire... By 2025, SLAM... captured over 50%"
- content/learn/warehouse/amr-fleet-management-software.mdx — 6 instances — worst: line 66 "We've seen facilities where going from 15 to 20 robots reduced picks per hour by 8%" (fabricated firsthand observation)
- content/learn/warehouse/heavy-payload-agv-guide.mdx — 7 instances — worst: line 137 "Forklift-related product and facility damage costs the average manufacturing plant $50,000-$150,000 per year"
- content/learn/warehouse/goods-to-person-vs-person-to-goods.mdx — 6 instances — worst: line 28 "G2P delivers 3-5x higher pick rates and 99.9%+ accuracy but requires $2M-$15M+"
- content/learn/warehouse/tugger-agv-guide.mdx — 5 instances — worst: line 23 "ROI in 14-24 months... reduced product damage (30-50% reduction), improved delivery consistency (±2 minutes vs ±15 minutes)"
- content/learn/warehouse/autonomous-forklift-guide.mdx — 6 instances — worst: line 31 "Over 15,000 units are operating... globally, with the install base growing approximately 40% annually"
- content/learn/warehouse/asrs-systems-complete-guide.mdx — 3 instances — worst: line 26 "reduce warehouse footprint by 50-70%, cut labor costs by 60-80%, and achieve 99.9%+ accuracy"
- content/learn/warehouse/shuttle-asrs-vs-crane-asrs.mdx — 2 instances — worst: line 95 "Mean time between failures (MTBF): 2,000-4,000 operating hours"
- content/learn/warehouse/cube-storage-systems-guide.mdx — 1 instance — worst: line 32 "55-65% of floor space is consumed by aisles"
- content/learn/warehouse/mini-load-asrs-guide.mdx — 4 instances — worst: line 150 "Mini-load systems typically reduce picking labor by 60-75%"
- content/learn/warehouse/asrs-roi-calculator-guide.mdx — 4 instances — worst: line 64 "fully loaded cost of a warehouse worker in the US averages $55,000-$72,000/year in 2026"
- content/learn/warehouse/agv-safety-standards-guide.mdx — 2 instances — worst: line 148 "Insufficient stopping distance testing (38% of audits)" — invented "audit data" percentages (L148-152)
- content/learn/warehouse/robots-for-small-warehouse-under-50000.mdx — 4 instances — worst: line 31 "picking... accounts for 50 to 60% of warehouse labor hours... replaces the equivalent of 1.5 to 2 full-time picker positions"
- content/learn/warehouse/warehouse-automation-roi-case-study-2026.mdx — 3 instances — worst: line 22 "Vendor ROI projections are typically 20 to 40% optimistic" (FAQ stats derived from the fabricated study)
- content/learn/getting-started/what-is-a-robot.mdx — 1 instance — worst: line 69 "Sidewalk delivery bots are already operating in 25+ cities"
- content/learn/getting-started/first-warehouse-robot-guide.mdx — 4 instances — worst: line 28 "Unit costs... dropped 40% since 2023... average warehouse worker wage reached $21.50 per hour in Q1 2026, up 18% from 2022"
- content/learn/getting-started/robot-terminology-glossary.mdx — 3 instances — worst: line 129 "G2P systems can increase pick rates by 200% to 400%"
- content/learn/getting-started/warehouse-automation-mistakes.mdx — 7 instances — worst: line 28 "Warehouse robotics investment topped $8.3 billion in 2025... 25% to 35% of first deployments underperform"
- content/learn/getting-started/robot-deployment-failure-reasons.mdx — 6 instances — worst: line 20 "Poor integration... responsible for roughly 30% of underperforming projects... 25%... 20%... 15%... 10%" (invented failure taxonomy)
- content/learn/getting-started/scale-robot-fleet.mdx — 4 instances — worst: line 25 "Organizations that follow this phased approach reach full fleet productivity 40% faster"
- content/learn/getting-started/introduce-robots-workforce.mdx — 5 instances — worst: line 33 "A 2025 survey of 300 warehouse and manufacturing operations found that 62%..." (phantom survey, no name)
- content/learn/humanoid/us-vs-china-humanoid-robots-2026.mdx — 4 instances — worst: line 31 "China dominates humanoid robot manufacturing with 137 active producers" (unsourced count, repeated throughout)
- content/learn/humanoid/figure-robot-vs-boston-dynamics-atlas.mdx — 2 instances — worst: line 69 "The hydraulic Atlas was estimated to cost over $1 million per unit" (estimator unnamed)
- content/learn/humanoid/fleet-learning-robotics.mdx — 2 instances — worst: line 90 "Cost per new skill | $5,000 - $50,000 (engineering time) | Near zero"
- content/learn/humanoid/robotics-deployment-timeline.mdx — 3 instances — worst: line 98 "2028 (proj.) $8,000-$18,000 | $10,000-$80,000" — 2028/2030 price projections with no named source (policy: no invented futures)
- content/learn/humanoid/humanoid-robot-use-cases-2026.mdx — 3 instances — worst: line 71 "handles approximately 60-70% of tasks... at roughly 50-60% of human speed"
- content/learn/humanoid/humanoid-robot-cost-2026.mdx — 4 instances — worst: line 74 "Humanoid robot prices are dropping at approximately 40% per year"
- content/learn/humanoid/top-humanoid-robot-companies-2026.mdx — 1 instance — worst: line 175 "Total venture investment in humanoid robotics exceeds $6 billion"
- content/learn/humanoid/us-vs-china-robotics-strategic.mdx — 7 instances — worst: line 44 "Chinese entities invested approximately $3.4 billion in humanoid robotics in 2025"
- content/learn/humanoid/robot-roi-calculator-guide.mdx — 5 instances — worst: line 116 "payback periods under 6 months are typical for robots replacing warehouse or manufacturing labor in 2026"
- content/learn/humanoid/humanoid-use-cases-proven-2026.mdx — 3 instances — worst: line 137 "$15-18/hour wages with 30-40% positions unfilled" (agriculture)
- content/learn/humanoid/robot-safety-standards-2026.mdx — 2 instances — worst: line 80 "ASTM WK73939 (expected Q3-Q4 2027)... potential publication in late 2027" — ratification timeline predictions stated as fact
- content/learn/humanoid/eldercare-robots-caregiver-shortage.mdx — 7 instances — worst: line 116 "ROI: 275-590%" (built entirely on unsourced benefit estimates)
- content/learn/humanoid/figure-ai-robot-review.mdx — 1 instance — worst: line 127 "the addressable market exceeds $1 trillion annually"
- content/learn/humanoid/robots-as-a-service-guide.mdx — 4 instances — worst: line 165 "Buyers with deployments of 5+ units can typically negotiate 10-20% below list pricing"
- content/learn/humanoid/data-flywheel-robotics.mdx — 4 instances — worst: line 52 "generates data at a rate that exceeds what YouTube ingests daily" (fabricated comparison, L52-54)

## TIER 3 (per file)
- content/learn/warehouse/agv-vs-amr-which-to-choose.mdx — line 109 "Vehicle hardware | $350,000 | $450,000" — invented TCO table for a hypothetical 75,000 sq ft DC headlined "A Realistic Comparison"; no SAMPLE/illustrative label in rendered text
- content/learn/warehouse/shuttle-asrs-vs-crane-asrs.mdx — line 110 "Capital Cost Comparison (30,000 tote positions, 400 totes/hr)... $4,350,000 vs $2,610,000" — invented scenario economics (plus operating-cost table L127-134) presented as data, no illustrative label
- content/learn/warehouse/tugger-agv-guide.mdx — line 148 "Cost Comparison: 4-Route Lean Manufacturing Delivery... Annual savings $227,000... Payback... 21 months" — invented cost table presented as fact, no label
- content/learn/warehouse/autonomous-forklift-guide.mdx — line 82 "Per-Unit Economics (2-Shift Operation)... Annual total $179,520 vs $41,600" — invented economics table, no illustrative label
- content/learn/warehouse/heavy-payload-agv-guide.mdx — line 99 "In a recent automotive plant deployment, floor remediation cost $180,000 — 25% of the total AGV hardware cost" — anonymous anecdote presented as a real deployment; also invented ROI table L125-133
- content/learn/warehouse/asrs-roi-calculator-guide.mdx — line 145 "Real-World ROI Examples" — three fully detailed anonymous case studies (L147-196) explicitly labeled "Real-World" rather than illustrative; invented facilities with dollar-precise savings
- content/learn/humanoid/humanoid-robot-cost-2026.mdx — line 38 "Several warehouse operators in the Yangtze River Delta region have deployed G1 units" — unverifiable anecdote presented as fact, not labeled illustrative

## SOURCED-BUT-VERIFY (per file, optional)
- best-warehouse-robots-2026.mdx — line 26/86 — source named in text: "Interact Analysis, 'Mobile Robot Market Report' (2025)" (Sources block L131-138 also cites IFR, McKinsey, MHI, LogisticsIQ; verify each report exists and actually supports the 45% growth and TCO claims — sources are not mapped to specific stats)
- best-autonomous-mobile-robots-2026.mdx — line 82 — source named in text: "6RS reports full go-live in as little as two weeks" (vendor claim)
- best-amr-picking-robots-2026.mdx — line 133 — source named in text: "Locus Robotics claims the fastest deployment — some facilities go live within 48 hours" (vendor claim)
- figure-robot-vs-boston-dynamics-atlas.mdx — line 65 — source named in text: "Figure has stated publicly... targets a 90% cost reduction"
- humanoid-robot-cost-2026.mdx — line 94 — source named in text: "Bank of America's robotics research division... $13,000 to $17,000... by 2030. Goldman Sachs estimates a similar range"
- robot-roi-calculator-guide.mdx — line 50 — source named in text: "turnover averaging 43% annually according to the Bureau of Labor Statistics"; line 126 — "OSHA data shows... injury rates of 5.5 per 100 full-time workers" (verify both; note L38's $46/hr BLS claim is listed under Tier 1 as unsupported)
- eldercare-robots-caregiver-shortage.mdx — line 23 — source named in text: "approximately 100 million workers, according to the International Labour Organization" and "BLS projects a shortage of over 400,000... by 2030" (verify; BLS projects openings, not "shortage" — possible causal upgrade); line 35 — "$33,530 (BLS, 2025)"; line 57 — "Relay reports 98% successful delivery rates"
- figure-ai-robot-review.mdx — line 23 — source named in text: publicly reported "$39 billion valuation... over $2.6 billion in funding" (checkable press coverage, no citation given)
- robot-safety-standards-2026.mdx — lines 36-64 — source named in text: ISO 10218, ISO/TS 15066, ISO 13482, ASTM F3218/F3244/WK73939, IEEE P7009 (standards are real designations; verify WK73939 scope and status claims)

## CLEAN FILES
- content/learn/getting-started/how-to-choose-your-first-robot.mdx (all figures are conditional/hypothetical or generic guidance)
- content/learn/getting-started/robot-selection-framework.mdx ("975 robot models" is plausibly database-backed; remainder is process guidance)

## COUNTS
tier1_items: 54 | tier2_instances: 171 across 44 files | tier3_items: 7 | files_audited: 47 | clean_files: 2

## Cross-cutting notes
- The "67-hour Figure/BMW autonomous operation" claim appears in at least 7 files and is nowhere sourced; figure-ai-robot-review.mdx even adds invented operational detail while admitting no verification exists. Retire once, fix everywhere.
- Locus install-base figures conflict across files ("300+ warehouses" vs "over 800 facilities") — an internal consistency failure the claims policy is designed to prevent.
- warehouse-automation-roi-case-study-2026.mdx is the single worst file: it fabricates a verification methodology ("site visits, financial documentation, interviews") for five invented anonymized case studies — precisely the "unattributed case study indistinguishable from fabrication" the policy prohibits.
- top-humanoid-robot-companies-2026.mdx and humanoid-robot-cost-2026.mdx invent pricing, funding, and units-deployed figures for ~20 named companies, plus a fabricated "verified deployment data" quarterly-update claim.

## Group 5: manufacturing, medical, problems, construction

# MDX Claims Audit — content/learn/{manufacturing,medical,problems,construction} (45 files)
Audited 2026-08-11 against docs/claims-policy.md (four-bucket rule). READ-ONLY — no repo files modified.

## TIER 1 (individual items)
- content/learn/manufacturing/cobot-palletizing-guide.mdx:26 — [clinical-safety-outcome] "reducing pallet-related injuries by 80-90%" — unsourced injury-reduction outcome in Quick Answer
- content/learn/manufacturing/bin-picking-robots-guide.mdx:55 — [named-company-metric] "Mech-Mind — Market leader in bin picking AI, used by major automotive and electronics manufacturers" — unsourced market-position/adoption claim
- content/learn/manufacturing/bin-picking-robots-guide.mdx:130 — [clinical-safety-outcome] "Injury risk | Repetitive strain, cuts | Eliminated" — absolute injury-elimination claim in comparison table
- content/learn/manufacturing/best-cobots-small-business.mdx:61 — [named-company-metric] "FANUC is the largest robot manufacturer on the planet, with over 1 million robots installed worldwide" — no attribution
- content/learn/manufacturing/best-cobots-small-business.mdx:99 — [named-company-metric] "does not have UR's 75,000-unit track record or FANUC's 60-year reliability history" — unsourced install-base figure
- content/learn/manufacturing/cobot-guide-2026.mdx:45 — [named-company-metric] "With 75,000+ cobots deployed worldwide, UR has the largest ecosystem" — unsourced install-base + "largest" claim
- content/learn/manufacturing/cobot-guide-2026.mdx:63 — [named-company-metric] "FANUC's global service network: 260+ offices in 108 countries" — unsourced company metric
- content/learn/manufacturing/welding-robots-guide-2026.mdx:59 — [named-company-metric] "80,000+ hour MTBF (mean time between failures)" — specific FANUC reliability metric, no source
- content/learn/manufacturing/cobots-for-food-manufacturing.mdx:58 — [named-company-metric] "Staubli robots cost 30 to 50% more than competitors" — unsourced pricing claim about named company
- content/learn/manufacturing/cobots-for-food-manufacturing.mdx:60 — [named-company-metric] "certified food-grade covers from companies like Artiminds or RobotIQ" — unsourced and likely inaccurate (ArtiMinds sells software)
- content/learn/manufacturing/robotic-painting-guide.mdx:46 — [named-company-metric] "ABB IRB 5500 ... largest paint robot install base" — unsourced "largest install base" claim
- content/learn/manufacturing/robotic-welding-cost-guide.mdx:89 — [salary-earnings] "Welder wage (loaded) | $32-$55" — welder hourly earnings presented as market fact, no source
- content/learn/manufacturing/cobot-welding-guide.mdx:98 — [salary-earnings] "Welder/operator salary (2 shifts) | $140,000/yr" — implies $70K/yr welder salary, no source
- content/learn/medical/best-surgical-robots-hospitals.mdx:58 — [clinical-safety-outcome] "Studies consistently show improved implant positioning... lower revision rates at 2-5 year follow-up" — "studies" never named
- content/learn/medical/best-surgical-robots-hospitals.mdx:94 — [clinical-safety-outcome] "CT-guided percutaneous biopsy carries a 15-25% pneumothorax rate... 80-85% diagnostic yield" — complication rates, no citation
- content/learn/medical/best-surgical-robots-hospitals.mdx:117 — [clinical-safety-outcome] "Robotic surgery consistently reduces LOS by 0.5-1.5 days versus open surgery" — length-of-stay reduction, no source
- content/learn/medical/best-surgical-robots-hospitals.mdx:118 — [clinical-safety-outcome] "Lower complication rates reduce readmissions, improve quality metrics" — complication/readmission reduction, no source
- content/learn/medical/healthcare-robotics-buying-guide-2026.mdx:91 — [clinical-safety-outcome] "medication dispensing errors drop 80 to 95%" — error-rate reduction, unsourced
- content/learn/medical/healthcare-robotics-buying-guide-2026.mdx:93 — [clinical-safety-outcome] "eliminates 85 to 95% of dispensing errors. Payback period: 18 to 24 months" — error-elimination claim, unsourced
- content/learn/medical/healthcare-robotics-buying-guide-2026.mdx:109 — [clinical-safety-outcome] "Facilities using UV disinfection robots report 20 to 30% reductions in targeted HAIs" — no facility or study named
- content/learn/medical/hospital-logistics-robots-guide.mdx:32 — [salary-earnings] "average loaded cost of $48/hour for an RN, that is $250,000 annually" — RN wage figure anchoring ROI case, no source
- content/learn/medical/pharmacy-automation-guide.mdx:20 — [clinical-safety-outcome] "99.99% dispensing accuracy... Manual dispensing by human pharmacists averages 98-99%" — unsourced; ships in FAQ structured data
- content/learn/medical/pharmacy-automation-guide.mdx:27 — [clinical-safety-outcome] "reduce medication errors by 85%, cut labor costs 30-50%" — error-reduction in Quick Answer, unsourced
- content/learn/medical/pharmacy-automation-robots.mdx:18 — [clinical-safety-outcome] "manual dispensing error rates run between 1-4%... reducing dispensing errors to below 0.01%" — FDA cite covers only adjacent figure
- content/learn/medical/pharmacy-automation-robots.mdx:63 — [named-company-metric] "BD Rowa installations report reducing pharmaceutical waste to under 0.5%, saving $50,000-$200,000 annually" — named vendor outcome, no source
- content/learn/medical/pharmacy-automation-robots.mdx:73 — [clinical-safety-outcome] "Published data shows error rates below 0.01%, compared to 1-2% for manual dispensing" — "published data" not checkable
- content/learn/medical/rehabilitation-robots-guide-2026.mdx:103 — [clinical-safety-outcome] "15-25% greater improvement in walking speed, endurance, and independence compared to control groups" — "systematic reviews" unnamed
- content/learn/medical/rehabilitation-robots-guide-2026.mdx:151 — [clinical-safety-outcome] "Clinical studies show measurable improvements after 12-20 sessions" — unnamed studies, FAQ answer
- content/learn/medical/rehabilitation-robots-guide.mdx:20 — [clinical-safety-outcome] "improves walking outcomes in stroke patients by 30-40%... independent ambulation in 60-70% of cases versus 40-50%" — no citation, FAQ structured data
- content/learn/medical/rehabilitation-robots-guide.mdx:27 — [clinical-safety-outcome] "Clinical trials show 30-40% improvement in walking outcomes" — Quick Answer, no trial named
- content/learn/medical/rehabilitation-robots-guide.mdx:95 — [clinical-safety-outcome] "60-70% of ASIA D patients achieved independent community ambulation with robotic training vs. 40-50%" — no study named
- content/learn/medical/rehabilitation-robots-guide.mdx:142 — [named-company-metric] "Hocoma's latest Lokomat software... early results show 15-20% faster achievement of mobility milestones" — named company, unsourced outcome
- content/learn/medical/robots-for-hospital-logistics.mdx:22 — [named-company-metric] "A 2025 study at Johns Hopkins found a 17% reduction in hospital-acquired infections on floors using robotic delivery" — named hospital + infection outcome, no journal/authors; likely invented; ships in FAQ JSON-LD
- content/learn/medical/robots-for-hospital-logistics.mdx:65 — [salary-earnings] "average pharmacy tech salary of $42,000 (loaded cost $58,000)" — unsourced salary driving payback math
- content/learn/medical/robots-for-hospital-logistics.mdx:85 — [named-company-metric] "A 2025 Johns Hopkins study found a 17% reduction in HAI rates on floors served by delivery robots" — same invented named-hospital outcome repeated in body
- content/learn/medical/surgical-robot-comparison-2026.mdx:86 — [clinical-safety-outcome] "Studies show 40-50% reduction in positioning outliers and lower revision rates at 5-year follow-up" — unnamed studies
- content/learn/medical/uv-disinfection-robots-guide.mdx:24 — [clinical-safety-outcome] "This combined approach reduces HAIs by 25-35% compared to manual cleaning alone" — unsourced, FAQ structured data
- content/learn/medical/uv-disinfection-robots-guide.mdx:27 — [clinical-safety-outcome] "UV robots reduce hospital-acquired infections by 25-35%" — Quick Answer, unsourced
- content/learn/medical/uv-disinfection-robots-guide.mdx:70 — [named-company-metric] "Studies published in peer-reviewed journals show 50-70% reductions in targeted HAIs" — attached to Xenex LightStrike; journals never named
- content/learn/medical/uv-disinfection-robots-guide.mdx:90 — [clinical-safety-outcome] "Multiple single-center studies show 25-53% reductions in hospital-onset C. difficile infection rates" — no study named
- content/learn/medical/uv-disinfection-robots-guide.mdx:94 — [clinical-safety-outcome] "A 2025 meta-analysis of 18 studies found... reduced acquisition of multi-drug resistant organisms by 27% (95% CI: 14-38%)" — fake-precise CI, no journal/authors, not checkable
- content/learn/problems/construction-safety-robotics.mdx:37 — [named-company-metric] "Built Robotics reports zero safety incidents... industry average of 2.3 recordable incidents per 100 heavy equipment operating hours" — uncited; benchmark appears invented
- content/learn/problems/construction-safety-robotics.mdx:47 — [named-company-metric] "Layout errors drop 85-90%, reducing rework" — Dusty Robotics FieldPrinter outcome, no source
- content/learn/problems/construction-safety-robotics.mdx:49 — [named-company-metric] "Deployed by DPR Construction, Swinerton, and Turner Construction... saves $50,000-$150,000 in labor costs" — three named GCs tied to unsourced savings
- content/learn/problems/construction-safety-robotics.mdx:55 — [clinical-safety-outcome] "Hilti EXO-O1 and EksoVest... reducing shoulder load by 40-60%. Field studies show 30-40% reductions" — "field studies" unnamed
- content/learn/problems/construction-safety-robotics.mdx:57 — [named-company-metric] "German Bionic Cray X and SuitX BackX reduce compressive forces on the lower spine by 30-45%" — unsourced biomechanical outcome
- content/learn/problems/construction-safety-robotics.mdx:72 — [named-company-metric] "Construction Robotics SAM100... reducing cumulative musculoskeletal load by 60-70%" — named product, unsourced injury-related metric
- content/learn/problems/farm-labor-automation-crisis.mdx:25 — [salary-earnings] "Farm wages of $16-$22/hour trail warehousing ($19-$25), construction ($20-$30), and food processing ($17-$24)" — four-industry wage comparison, no source
- content/learn/problems/farm-labor-automation-crisis.mdx:37 — [named-company-metric] "A single LaserWeeder replaces 30-50 hand-weeding laborers" — Carbon Robotics claim stated as fact, uncited
- content/learn/problems/farm-labor-automation-crisis.mdx:61 — [named-company-metric] "One machine matches 8-15 manual pickers. Commercial harvests completed in Washington orchards" — Advanced Farm Technologies claim, no source
- content/learn/problems/farm-labor-automation-crisis.mdx:63 — [named-company-metric] "Agrobot E-Series... Current rates at 60% of skilled human pickers" — named company performance metric, uncited
- content/learn/problems/food-delivery-cost-reduction.mdx:20 — [named-company-metric] "Serve Robotics, Kiwibot, and Starship... sustained delivery costs of $1.50-$3.00 per trip, a 70-85% reduction" — three named companies, unsourced cost claims
- content/learn/problems/food-delivery-cost-reduction.mdx:24 — [salary-earnings] "a driver earning $15-$25/hour (including tips, fuel, vehicle costs)" — earnings claim plus DoorDash/Uber Eats fee figures, no source
- content/learn/problems/food-delivery-cost-reduction.mdx:42 — [named-company-metric] "Robots complete 4-6 deliveries per day... per-delivery cost runs $2.00-$3.00" — Serve Robotics unit economics as fact, uncited
- content/learn/problems/food-delivery-cost-reduction.mdx:50 — [named-company-metric] "Per-delivery costs of $1.00-$2.00 on established campuses. Kiwibot operates on 100+ campuses" — unsourced cost + adoption metrics
- content/learn/problems/food-delivery-cost-reduction.mdx:58 — [named-company-metric] "Starship operates the world's largest autonomous delivery fleet with over 7,000 robots" — no attribution in text
- content/learn/problems/food-delivery-cost-reduction.mdx:60 — [named-company-metric] "At the University of Kentucky, robots complete 12-18 deliveries per day... ratio reportedly reaches 1:50" — named institution, "reportedly" with no source
- content/learn/problems/hospital-infection-control-robots.mdx:42 — [clinical-safety-outcome] "Over 900 hospitals have deployed Xenex, with peer-reviewed studies documenting 50-70% reductions in C. diff, MRSA" — "peer-reviewed studies" unnamed; highest-risk class
- content/learn/problems/hospital-infection-control-robots.mdx:44 — [named-company-metric] "Deployed in 75+ countries across 200+ hospitals" — UVD Robots adoption metric, uncited
- content/learn/problems/hospital-infection-control-robots.mdx:52 — [clinical-safety-outcome] "Hospitals report 15-25% reductions in cross-unit contamination events" — "hospitals report" names no hospital
- content/learn/problems/hospital-infection-control-robots.mdx:60 — [named-company-metric] "Houston Methodist data: ...documented 53% reduction in C. diff and 44% reduction in MRSA. Financial impact: $1.2 million" — WORST ITEM: named institution + infection outcomes + dollars, zero citation
- content/learn/problems/warehouse-labor-shortage-robots.mdx:26 — [salary-earnings] "Warehouse wages have risen 22% since 2020... $19-$22/hour. Amazon's $21/hour minimum" — wage stats + named-company wage, no source
- content/learn/problems/warehouse-labor-shortage-robots.mdx:50 — [named-company-metric] "DHL's partnership across 30+ facilities demonstrated a 2.5x increase... 35% lower voluntary turnover" — Locus/DHL metrics, uncited
- content/learn/problems/warehouse-labor-shortage-robots.mdx:52 — [named-company-metric] "GEODIS reported... 100% order fulfillment during peak season 2025 with 40% fewer temporary hires" — no checkable source
- content/learn/problems/warehouse-labor-shortage-robots.mdx:54 — [named-company-metric] "XPO reported 2-3x productivity improvements" — plus Lockheed Martin/ACT Fulfillment deployment claims, uncited
- content/learn/problems/robot-maintenance-cost-reduction.mdx:58 — [salary-earnings] "Two technicians at $70,000/year salary cost $140,000 annually" — technician salary as fact in unlabeled cost model
- content/learn/construction/autonomous-excavation-guide.mdx:24 — [clinical-safety-outcome] "demonstrated a 40-60% reduction in safety incidents... No autonomous excavation fatalities have been reported" — unsourced safety outcome in FAQ (Schema.org)
- content/learn/construction/autonomous-excavation-guide.mdx:27 — [clinical-safety-outcome] "40-60% safety incident reductions" — Quick Answer repeats the unsourced safety outcome
- content/learn/construction/autonomous-excavation-guide.mdx:83 — [named-company-metric] "Caterpillar... over 600 autonomous haul trucks... collectively moved over 5 billion tons" — deployment metrics, no attribution in text
- content/learn/construction/autonomous-excavation-guide.mdx:105 — [named-company-metric] "Built Robotics has completed over 1,000 miles of autonomous trenching" — unsourced company achievement metric
- content/learn/construction/autonomous-excavation-guide.mdx:126 — [clinical-safety-outcome] "Safety incidents | 4-6 recordable | 1-2 recordable | -60%" — injury-reduction figure inside unlabeled ROI table
- content/learn/construction/autonomous-excavation-guide.mdx:152 — [clinical-safety-outcome] "zero fatalities in autonomous operations, compared to an industry average of 4-6 haul truck fatalities per year" — fatality claim, no source
- content/learn/construction/construction-robots-guide-2026.mdx:70 — [clinical-safety-outcome] "virtually eliminates drilling-related injuries" — injury-elimination outcome, unsourced
- content/learn/construction/construction-robots-guide-2026.mdx:78 — [salary-earnings] "experienced operators commanding $35-55/hour" — wage claim, no source
- content/learn/construction/rebar-tying-robots-guide.mdx:2 — [clinical-safety-outcome] "Rebar Tying Robots: 1,100 Ties Per Hour with Zero Back Injuries" — injury-elimination claim in the page title
- content/learn/construction/rebar-tying-robots-guide.mdx:26 — [clinical-safety-outcome] "eliminating the repetitive bending that causes 60% of ironworker back injuries" — unsourced injury causation/elimination in Quick Answer
- content/learn/construction/rebar-tying-robots-guide.mdx:73 — [named-company-metric] "TyBot has completed over 150 bridge deck projects across the United States" — unsourced deployment count
- content/learn/construction/rebar-tying-robots-guide.mdx:90 — [clinical-safety-outcome] "Back injury risk | High | Zero" — absolute injury-outcome claim in comparison table
- content/learn/construction/robots-in-construction-2026.mdx:43 — [unattributed-quote] "A mid-size general contractor using Spot... reports saving 15 person-hours per week" — anonymous testimonial with a metric, no person/company named
- content/learn/construction/construction-3d-printing-guide.mdx:53 — [named-company-metric] "ICON | Vulcan... Homes Completed 200+" — unsourced company output count in comparison table
- content/learn/construction/construction-3d-printing-guide.mdx:54 — [named-company-metric] "COBOD | BOD2... 100+ globally" — unsourced company output count
- content/learn/construction/construction-3d-printing-guide.mdx:55 — [named-company-metric] "Mighty Buildings... 150+" — unsourced company output count
- content/learn/construction/construction-3d-printing-guide.mdx:56 — [named-company-metric] "Apis Cor... 50+" — unsourced company output count
- content/learn/construction/construction-3d-printing-guide.mdx:57 — [named-company-metric] "SQ4D | ARCS... 30+" — unsourced company output count
- content/learn/construction/construction-3d-printing-guide.mdx:63 — [named-company-metric] "100-home community in Georgetown, Texas — the largest 3D-printed housing development in North America" — real project but superlative + count unsourced in text

## TIER 2 (per file)
- content/learn/manufacturing/best-cobots-small-business.mdx — 12 instances — worst: line 119 "Against a $55,000-$75,000 complete cell cost, payback is 11-18 months."
- content/learn/manufacturing/bin-picking-robots-guide.mdx — 15 instances — worst: line 21 "Total system cost has decreased roughly 30% since 2023"
- content/learn/manufacturing/cobot-guide-2026.mdx — 7 instances — worst: line 23 "Global cobot revenue surpassed $2.2 billion in 2025"
- content/learn/manufacturing/cobot-palletizing-guide.mdx — 10 instances — worst: line 123 "Payback period: 5.3 months on a $95,000 investment."
- content/learn/manufacturing/cobot-vs-industrial-robot.mdx — 12 instances — worst: line 50 "Typical ROI | 8-18 months | 18-36 months"
- content/learn/manufacturing/cobot-welding-guide.mdx — 10 instances — worst: line 26 "produce consistently high-quality welds that reduce rework by 60-80%"
- content/learn/manufacturing/cobots-for-food-manufacturing.mdx — 8 instances — worst: line 31 "The food manufacturing cobot market grew 42% in 2025, the fastest growth of any cobot application sector"
- content/learn/manufacturing/machine-tending-robots-guide.mdx — 8 instances — worst: line 24 "increasing CNC spindle utilization from 40% to 50% up to 80% to 90%"
- content/learn/manufacturing/manufacturing-automation-smb-guide.mdx — 6 instances — worst: line 30 "Ten years ago, the minimum viable automation investment was $150,000 or more"
- content/learn/manufacturing/robotic-assembly-guide.mdx — 9 instances — worst: line 24 "at 2x to 10x manual speed with defect rates under 0.1%"
- content/learn/manufacturing/robotic-painting-guide.mdx — 8 instances — worst: line 24 "20% to 40% paint savings, 95% or higher first-pass quality rates... ROI within 12 to 30 months"
- content/learn/manufacturing/robotic-welding-cost-guide.mdx — 10 instances — worst: line 111 "Robotic welding is 2 to 4 times more cost-effective than manual welding"
- content/learn/manufacturing/welding-robots-guide-2026.mdx — 7 instances — worst: line 133 "a robot welds 85-95% of the time vs. 25-35% for a manual welder"
- content/learn/medical/best-surgical-robots-hospitals.mdx — 7 instances — worst: line 115 "A hospital adding da Vinci in a market where competitors lack it can see 15-30% growth in surgical volume"
- content/learn/medical/healthcare-robotics-buying-guide-2026.mdx — 8 instances — worst: line 107 "Hospital-acquired infections cost U.S. hospitals $28.4 billion annually"
- content/learn/medical/hospital-logistics-robots-guide.mdx — 9 instances — worst: line 126 "Facilities that let nurses name their robots report 30% higher satisfaction scores"
- content/learn/medical/pharmacy-automation-guide.mdx — 5 instances — worst: line 31 "an estimated 7,000-9,000 deaths annually attributed to medication errors, costing... $42 billion per year"
- content/learn/medical/pharmacy-automation-robots.mdx — 7 instances — worst: line 47 "Omnicell dominates... with approximately 55% market share in U.S. hospitals"
- content/learn/medical/rehabilitation-robots-guide-2026.mdx — 3 instances — worst: line 139 "generates $300,000-$500,000 in annual therapy revenue... pays for itself within 6-12 months"
- content/learn/medical/rehabilitation-robots-guide.mdx — 3 instances — worst: line 144 "soft exosuits at $5,000-$15,000 price points... for home use by 2027-2028" (invented future)
- content/learn/medical/robots-for-hospital-logistics.mdx — 10 instances — worst: line 120 "Annual labor savings (15 x $52,000 loaded) | $780,000"
- content/learn/medical/surgical-robot-comparison-2026.mdx — 6 instances — worst: line 32 "market hit $8.2 billion in 2025 and is projected to reach $14 billion by 2028" (invented future; contradicts sibling file's $18B)
- content/learn/medical/surgical-robot-comparison.mdx — 6 instances — worst: line 78 "Lung cancer kills 1.8 million people per year globally... increases 5-year survival from 7% to 60%+"
- content/learn/medical/uv-disinfection-robots-guide.mdx — 5 instances — worst: line 31 "These infections kill an estimated 99,000 Americans per year and add $28-45 billion"
- content/learn/problems/construction-safety-robotics.mdx — 13 instances — worst: line 27 "The industry loses an estimated $11.5 billion annually"
- content/learn/problems/farm-labor-automation-crisis.mdx — 13 instances — worst: line 23 "H-2A visa certifications grew from 79,000 in 2015 to over 370,000 in 2025"
- content/learn/problems/food-delivery-cost-reduction.mdx — 7 instances — worst: line 82 "28 states have legislation permitting sidewalk robots"
- content/learn/problems/hospital-infection-control-robots.mdx — 6 instances — worst: lines 30-36 HAI incidence/cost table ("462,000 C. diff cases" etc., no source)
- content/learn/problems/warehouse-labor-shortage-robots.mdx — 10 instances — worst: line 24 "needs approximately 1.8 million workers... turnover exceeding 40%... 42 days to fill in 2025"
- content/learn/problems/robot-downtime-reduction-guide.mdx — 18 instances — worst: line 125 "Industry average is 85–92% for AMR fleets... Top-performing operations achieve 95–98%" (generic Sources block ties nothing to claims)
- content/learn/problems/robot-integration-challenges.mdx — 5 instances — worst: line 22 "together accounting for 85% of deployment failures based on analysis of 80+ case studies" (unverifiable self-claim)
- content/learn/problems/robot-maintenance-cost-reduction.mdx — 16 instances — worst: line 139 "Industry benchmarks show AMR maintenance costs $2-$5 per operating hour" (benchmarks unnamed)
- content/learn/problems/robot-training-change-management.mdx — 4 instances — worst: line 141 "Organizations that skip this investment typically spend 2-3x more"
- content/learn/problems/robot-vendor-selection-mistakes.mdx — 8 instances — worst: line 43 "deployments that skip pilots average 3x more downtime in the first 90 days, 40% longer time-to-value"
- content/learn/construction/autonomous-excavation-guide.mdx — 4 instances — worst: line 27 "20-30% productivity improvements, 40-60% safety incident reductions... ROI in 2-3 years"
- content/learn/construction/bim-robots-guide.mdx — 11 instances — worst: line 26 "rework that costs the US construction industry an estimated $65 billion annually"
- content/learn/construction/bricklaying-robots-2026.mdx — 7 instances — worst: line 22 "manufacturing productivity has increased 760% since 1950, construction productivity has actually declined"
- content/learn/construction/construction-3d-printing-guide.mdx — 8 instances — worst: line 123 "US housing shortage (estimated 4-7 million units)"
- content/learn/construction/construction-robotics-2026-overview.mdx — 20 instances — worst: line 134 "Autonomous earthmoving (controlled sites) | 2027-2028 | 30-40% grading labor reduction" — entire "What's Coming Next (2027-2030)" table (134-138) is prohibited invented-futures with no named source
- content/learn/construction/construction-robots-for-concrete-work.mdx — 12 instances — worst: line 28 "The average age of a concrete finisher is 47" (unsourced clause)
- content/learn/construction/construction-robots-guide-2026.mdx — 9 instances — worst: line 24 "The industry needs an estimated 500,000+ additional workers in the US alone" (also line 112 "dedicated construction robotics safety standards by 2027-2028" — invented future)
- content/learn/construction/construction-site-monitoring-robots.mdx — 4 instances — worst: line 27 "Projects using robotic monitoring report 30-50% reduction in undetected rework and 20-30% faster issue resolution"
- content/learn/construction/rebar-tying-robots-guide.mdx — 7 instances — worst: line 32 "60% of ironworkers report chronic lower back pain"
- content/learn/construction/robots-in-construction-2026.mdx — 2 instances — worst: line 93 "Expected ROI: 30-40% reduction in documentation labor"

## TIER 3 (per file)
- content/learn/manufacturing/cobots-for-food-manufacturing.mdx — line 96 "**Case study: Bakery packing line**" — fabricated case study labeled "Case study" (implies real), no company, invented metrics table (L102-112: -86% errors, $96,000 savings); frontmatter L9 compounds: "ROI data from bakery, meat, and beverage operations"
- content/learn/manufacturing/robotic-welding-cost-guide.mdx — line 127 "Wait, that seems long. Let us recalculate with proper utilization." — leftover LLM self-talk in user-facing content revealing ROI tables (L115-147) are invented; not labeled illustrative
- content/learn/manufacturing/best-cobots-small-business.mdx — line 107 "Here is a realistic ROI calculation for the most common small-shop cobot application" — invented before/after table (L109-121) framed as "realistic," not labeled
- content/learn/manufacturing/bin-picking-robots-guide.mdx — line 135 "A bin picking system at $150,000 replacing one operator across two shifts" — invented payback scenario (L133-141), no label
- content/learn/manufacturing/cobot-guide-2026.mdx — line 102 "For a single-shift operation replacing one manual task:" — invented cost model (L103-107), "Payback: 15 months" bolded as fact, not labeled
- content/learn/manufacturing/cobot-palletizing-guide.mdx — line 100 "### Cost of Manual Palletizing" — invented cost tables (L100-125) with precise fabricated figures ("Net Annual Savings: $213,300"), no label
- content/learn/manufacturing/machine-tending-robots-guide.mdx — line 119 "### The Math for a Single CNC Cell" — invented before/after model (L121-135) presented as "The Math," not labeled example
- content/learn/manufacturing/robotic-assembly-guide.mdx — line 149 "**Investment:** $80,000 (cobot, gripper, force sensor, programming)" — invented single-cell ROI model (L147-160), "Payback: 10 to 16 months" as fact, no label
- content/learn/manufacturing/cobot-vs-industrial-robot.mdx — line 118 "**Total cell cost** | **$54,000** | **$151,000**" — borderline: "Scenario:" headings weakly signal hypothetical, but conclusions ("costs 64% less", L120) stated as fact
- content/learn/manufacturing/cobot-welding-guide.mdx — line 105 "**Payback on $96,000 investment: 9.7 months.**" — borderline: has "Assumptions:" line (L94) but payback bolded as factual result; no visible illustrative label
- content/learn/medical/best-surgical-robots-hospitals.mdx — line 108 "| 150 | $2,500 margin uplift | ... | -$460,000 |" — invented ROI table (L108-112) with specific dollar losses; not labeled (math also broken: 150 and 300 cases yield identical net)
- content/learn/medical/healthcare-robotics-buying-guide-2026.mdx — line 109 "For a 300-bed hospital with 50 HAIs per year... a 25% reduction saves $500,000 annually" — hypothetical worked example, never labeled illustrative
- content/learn/medical/hospital-logistics-robots-guide.mdx — line 109 "ROI Analysis: 300-Bed Hospital... Annual savings $340,000-$385,000" — invented sample-hospital ROI table (L109-118) presented as fact, unlabeled
- content/learn/medical/pharmacy-automation-guide.mdx — line 104 "High-Volume Retail Pharmacy (800 Rx/day)... Payback 18 months" — two invented scenario tables (L104-124) with exact FTE/dollar figures, no label
- content/learn/medical/pharmacy-automation-robots.mdx — line 79 "Total Annual Benefit $430,000-$1,075,000" — example benefit table (L79-87) for hypothetical 300-bed hospital/retail pharmacy, unlabeled
- content/learn/medical/rehabilitation-robots-guide.mdx — line 130 "Annual revenue increase $80,000-$145,000... Payback period 12-24 months" — invented facility ROI table (L130-138), unlabeled
- content/learn/medical/robots-for-hospital-logistics.mdx — line 111 "Fleet size 5 TUG robots... Net year 1 benefit $445,000" — invented model (L111-126); L126 claims "based on published deployment data" with zero citation — hypothetical dressed as sourced
- content/learn/medical/surgical-robot-comparison-2026.mdx — line 112 "Here is what each platform actually costs over five years... $6,512,500" — computed estimate (L112-121) presented as "actually costs," no label
- content/learn/medical/uv-disinfection-robots-guide.mdx — line 136 "Prevented HAIs per year 20-42... Savings $400,000-$2,100,000... Payback 3-12 months" — hypothetical ROI table (L136-146) presented as analysis, unlabeled
- content/learn/problems/food-delivery-cost-reduction.mdx — line 66 "**50-robot deployment model:**" — invented fleet-economics table (L68-76); "model" is not a visible illustrative/SAMPLE label
- content/learn/problems/hospital-infection-control-robots.mdx — line 62 "**ROI framework for a 300-bed hospital:**" — invented ROI table (L64-72) embedding clinical assumptions "C. diff reduction (50%)" as line items, not labeled — clinical numbers inside an unlabeled model
- content/learn/problems/warehouse-labor-shortage-robots.mdx — line 82 "A facility processing $50 million annually at 80% staffing... loses approximately $1.9 million" — invented scenario presented as calculated fact, no label
- content/learn/problems/robot-vendor-selection-mistakes.mdx — line 29 "Eighteen months later, the 'cheapest' vendor has cost 40% more than the runner-up" — recurring "What happens:" composite failure narratives (also L39, L49, L66, L86, L107, L121) written as real cases, never labeled composites
- content/learn/problems/farm-labor-automation-crisis.mdx — line 29 "A strawberry farm needs 300 workers for a 6-week harvest and 20 the rest of the year" — archetype scenario stated as fact, unlabeled (minor)
- content/learn/construction/autonomous-excavation-guide.mdx — line 119 "Large Civil Project (500,000 CY earthwork)" — invented project ROI tables (L119-130 and L132-140 "Solar Site Preparation") with exact dollar figures as fact, no label
- content/learn/construction/bim-robots-guide.mdx — line 102 "Commercial Office Project (200,000 sq ft, 4 floors)" — fabricated project ROI tables (L102-111 "$325,000 total project savings"; also L113-123), no label
- content/learn/construction/construction-3d-printing-guide.mdx — line 75 "1,500 sq ft Single-Family Home" — invented cost-comparison budget (L77-88, "$205,000 vs $138,000-$165,000") presented as factual analysis, unlabeled
- content/learn/construction/construction-site-monitoring-robots.mdx — line 107 "Large Commercial Project ($100M, 24-month schedule)" — hypothetical ROI tables (L107-116 "Net benefit $1.4-$2.3M"; also L118-127), unlabeled
- content/learn/construction/rebar-tying-robots-guide.mdx — line 95 "Bridge Deck Project (75,000 ties)" — invented scenarios with false-precision figures (L95-105; also L114-122 "Large Commercial Project"), unlabeled
(Note: manufacturing/robotic-painting-guide.mdx L110 "### Annual Savings Example" IS labeled "Example" — compliant, excluded. Grep for illustrative/hypothetical/sample labels across construction/ returned zero hits.)

## SOURCED-BUT-VERIFY (per file, optional)
- manufacturing/cobot-welding-guide.mdx — line 30 — source named in text: "American Welding Society" (360,000-welder shortage by 2027 — AWS's published figure is ~330,000 by 2028; adjacent age/graduation stats NOT attributed)
- manufacturing/welding-robots-guide-2026.mdx — line 22 — source named in text: "American Welding Society" (same figure, same concern)
- manufacturing/cobots-for-food-manufacturing.mdx — line 29 — source named in text: "Bureau of Labor Statistics" ("36 days to fill" is not a BLS series)
- manufacturing/manufacturing-automation-smb-guide.mdx — line 28 — source named in text: "Robotics Industries Association 2025 survey" — HIGH RISK: RIA merged into A3 in 2021; a "RIA 2025 survey" cannot exist under that name
- manufacturing/manufacturing-automation-smb-guide.mdx — line 92 — source implied in text: "Section 179 ... $1.22 million (2026 limit)" — $1.22M was the 2024 limit; likely stale
- manufacturing/manufacturing-automation-smb-guide.mdx — line 88 — source named in text: "SBA 504 loan program"
- manufacturing/cobot-safety-assessment-guide.mdx — lines 21, 102-114, 204 — source named in text: "ISO/TS 15066" (verify force/pressure table; L104 skull 130N conflicts with cobot-guide-2026.mdx:31 "150N")
- manufacturing/cobot-guide-2026.mdx — line 31 — source named in text: "ISO/TS 15066" ("150N transient" — conflicts with safety guide's table)
- manufacturing/welding-robots-guide-2026.mdx — lines 46, 63 — "RoboScore: 86.5 / 80.2" — verify these match the robots DB (database-backed bucket)
- medical/healthcare-robotics-buying-guide-2026.mdx — line 31 — source named in text: "The American Hospital Association" (73% staffing-shortage stat)
- medical/pharmacy-automation-robots.mdx — line 18 — source named in text: "according to the FDA" (1.5M figure actually originates from 2006 IOM report)
- medical/pharmacy-automation-robots.mdx — line 51 — source named in text: "American Journal of Health-System Pharmacy" (no year/authors)
- medical/pharmacy-automation-robots.mdx — line 89 — source named in text: "Agency for Healthcare Research and Quality data" ($4,685 per preventable ADE)
- medical/rehabilitation-robots-guide.mdx — lines 84-89 — source named in text: "A 2024 Cochrane review of 62 RCTs (2,440 participants)" — counts match the 2020 Mehrholz Cochrane review; year likely wrong
- medical/uv-disinfection-robots-guide.mdx — line 86 — source named in text: "BETR-D trial... published in The Lancet" (real trial; verify 30% MRSA/VRE framing)
- medical/surgical-robot-comparison.mdx — lines 158-163 — sources named in text: "Intuitive Surgical Annual Report (2025)", "Stryker Orthopedics Clinical Data Registry" (verify registry exists; manufacturer-sourced clinical outcome), "Grand View Research (2026)" ($18B — contradicts surgical-robot-comparison-2026.mdx:32 $8.2B), plus generic AHA/Journal of Robotic Surgery/Medtronic entries not tied inline to stats
- problems/construction-safety-robotics.mdx — line 17 — source named in text: "OSHA" ("1,069 construction fatalities in 2024" — fatality counts come from BLS CFOI and 1,069 matches a pre-2024 year)
- problems/construction-safety-robotics.mdx — line 80 — source named in text: "OSHA" ($161,323 willful max — year-specific, verify current)
- problems/farm-labor-automation-crisis.mdx — line 17 — source named in text: "USDA" ("shortage of over 300,000 farmworkers" — no such published USDA estimate known; high-priority verify)
- problems/food-delivery-cost-reduction.mdx — line 18 — source named in text: "Capgemini Research Institute" (41-53% — widely cited figure is 41%)
- problems/hospital-infection-control-robots.mdx — line 18 — source named in text: "CDC" (1.7M HAIs / 99,000 deaths — 2002-2007-era estimates; current CDC figures materially lower)
- problems/hospital-infection-control-robots.mdx — line 24 — source named in text: "American Journal of Infection Control" (no author/year)
- problems/hospital-infection-control-robots.mdx — line 58 — source named in text: "The Lancet (BETR-D Trial)" (real; verify "31,000+ rooms" detail)
- problems/warehouse-labor-shortage-robots.mdx — line 18 — source named in text: "Bureau of Labor Statistics" ("800,000 unfilled positions" — recent JOLTS figures far lower; high-priority verify)
- problems/robot-training-change-management.mdx — lines 22, 26 — source named in text: "A 2025 McKinsey study" ("3.5x more likely" — specific study not identified; verify existence)
- problems/ (5 guide files) — Sources footers (robot-downtime-reduction-guide L139-145; robot-integration-challenges L162-169; robot-maintenance-cost-reduction L153-159; robot-training-change-management L155-161; robot-vendor-selection-mistakes L157-164) — generic report titles (Gartner/IDC/Deloitte) not tied to any in-text claim; several may not exist as described (Gartner RPA report is about software RPA, not physical robots)
- construction/bim-robots-guide.mdx — line 34 — source named in text: "The Construction Industry Institute" (rework 5-8% of project cost)
- construction/construction-site-monitoring-robots.mdx — line 33 — source named in text: "A McKinsey study" (35% of PM time — vague cite, no study name/year)
- construction/construction-robots-for-concrete-work.mdx — line 28 — source named in text: "The Associated General Contractors of America" (78% of concrete contractors)
- construction/construction-3d-printing-guide.mdx — lines 21, 100 — source named in text: "ASTM International F3580 (2024)" (verify standard number and date)
- construction/bricklaying-robots-2026.mdx — line 150 — source named in text: "OSHA... ANSI/RIA R15.06... ANSI/RIA R15.08" (checkable regulatory facts)

## CLEAN FILES
- content/learn/manufacturing/cobot-safety-assessment-guide.mdx (only file with zero Tier 1/2/3 violations; all numbers attributed to named ISO standards, examples explicitly framed as "Example:" — but see SOURCED-BUT-VERIFY for the ISO force-table conflict)

## COUNTS
tier1_items: 85 | tier2_instances: ~375 across 44 files | tier3_items: 29 | files_audited: 45 | clean_files: 1

## NOTES
- Highest-risk cluster: medical/ + problems/hospital-infection-control — 40+ unsourced clinical outcome claims (infection/complication/readmission/error reductions), several shipping inside FAQ frontmatter that renders as Schema.org JSON-LD in search results.
- Two claims appear fabricated outright: the "2025 Johns Hopkins 17% HAI study" (robots-for-hospital-logistics.mdx:22,85) and the "2025 meta-analysis of 18 studies, 27% (95% CI: 14-38%)" (uv-disinfection-robots-guide.mdx:94). The "RIA 2025 survey" citation (manufacturing-automation-smb-guide.mdx:28) cannot exist under that name.
- robotic-welding-cost-guide.mdx:127 contains leftover LLM self-talk ("Wait, that seems long. Let us recalculate...") shipped in user-facing content.
- Zero unattributed quotes/testimonials in medical/, problems/, and manufacturing/; the single unattributed testimonial is construction/robots-in-construction-2026.mdx:43.
- Prohibited invented-futures: the entire 2027-2030 forecast table in construction-robotics-2026-overview.mdx:134-138 and the $14B-by-2028 projection in surgical-robot-comparison-2026.mdx:32 (which also contradicts surgical-robot-comparison.mdx's sourced $18B figure).
- Machine specs, list prices, and vendor capability descriptions (e.g. TyBot 1,100 ties/hour, Spot $74,500) were treated as product facts and excluded.
