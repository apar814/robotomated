# MDX Article Containment — 2026-08-11

Emergency unpublish of the /learn MDX library following the claims audit
(docs/claims-inventory-mdx-2026-08-11.md): 365 Tier-1 fabrications across
214 of 225 files, including invented named-hospital clinical studies and
fake federal-agency statistics.

## Action

- **223 of 225 articles unpublished.** Source files remain in the repo;
  they are removed from routing, listings, and the sitemap, and their URLs
  return **410 Gone** (with X-Robots-Tag: noindex) via middleware — 410
  signals permanent removal and de-indexes faster than 404.
- **Mechanism:** allowlist in `lib/learn/published-mdx.ts` is the single
  source of truth. `lib/learn/articles.ts` filters every loader through
  it (pages, listings, generateStaticParams); `middleware.ts` 410s
  non-allowlisted two-segment /learn URLs in MDX directories;
  `app/sitemap.ts` emits only allowlisted articles.
- **The glossary (60 terms) and 15 field-guide explainers from
  feat/learn-layer-20260810 are unaffected** — built to claims policy,
  still live.
- The MDX article route emits no JSON-LD (the FAQPage concern from the
  audit applied to frontmatter that never rendered as schema on this
  route); with the articles unpublished, the fabricated claims are out of
  the HTML entirely. Verified post-deploy by grepping production HTML for
  marker strings.

## Kept (2 files — passed first-pass audit AND adversarial second read)

- /learn/guides/questions-to-ask-robot-salesperson — negotiating-guidance
  thresholds only; one borderline "(typically 3-5% per year)" parenthetical
  removed for zero tolerance (only copy change in this action)
- /learn/getting-started/robot-selection-framework — process guidance;
  "975 robot models" is database-backed (~986 in DB)

## Rejected on second read (9 first-pass "clean" candidates)

| File | Reason |
|---|---|
| home/robot-vacuum-vs-robot-mop | invented survey framing, unsourced figures |
| guides/warehouse-robot-pilot-program-guide | unsourced dollar/timeline figures incl. FAQ frontmatter |
| guides/robot-integration-wms-checklist | fabricated provenance naming Manhattan/Blue Yonder/SAP; invented stats |
| guides/robot-deployment-timeline-guide | invented survey framing + unsourced dollars in FAQ frontmatter |
| guides/robot-safety-standards-iso-10218 | misattributes ISO/TS 15066 chest limit (210 N claimed; standard: 140 N QS); OSHA 2024 max presented unattributed as floor |
| guides/robot-integration-guide-wms-erp | load-bearing benchmarks cite unverifiable "ARC 200+ deployments study"; likely-hallucinated SAP "Robot Framework Interface" |
| guides/robot-safety-compliance-guide | 2024 OSHA maximums mislabeled "(2026 rates)" and called starting points; QS force values mislabeled transient |
| getting-started/how-to-choose-your-first-robot | unsourced market percentages stated as fact; stale hardcoded price |
| manufacturing/cobot-safety-assessment-guide | force table contradicts ISO/TS 15066; invented "CBSF" instrumentation; wrong forehead value in FAQ frontmatter |

Note: the three "safety" files state three mutually contradictory chest
force limits (210 N / 140 N transient / 100 N QS) — the signature of
invented values in the highest-risk content class.

## Every URL removed (223)

- /learn/agricultural/agricultural-automation-adoption-guide
- /learn/agricultural/agricultural-drone-guide
- /learn/agricultural/agricultural-robots-for-specialty-crops
- /learn/agricultural/agricultural-robots-guide
- /learn/agricultural/autonomous-tractor-guide
- /learn/agricultural/dairy-farm-robots-guide
- /learn/agricultural/fruit-harvesting-robots-2026
- /learn/agricultural/robotic-harvesting-guide
- /learn/agricultural/robotic-weeding-guide
- /learn/construction/autonomous-excavation-guide
- /learn/construction/bim-robots-guide
- /learn/construction/bricklaying-robots-2026
- /learn/construction/construction-3d-printing-guide
- /learn/construction/construction-robotics-2026-overview
- /learn/construction/construction-robots-for-concrete-work
- /learn/construction/construction-robots-guide-2026
- /learn/construction/construction-site-monitoring-robots
- /learn/construction/rebar-tying-robots-guide
- /learn/construction/robots-in-construction-2026
- /learn/cost/agricultural-robot-cost-guide
- /learn/cost/cobot-cost-guide
- /learn/cost/cobot-roi-calculator-guide
- /learn/cost/construction-robot-cost-guide
- /learn/cost/delivery-robot-cost-guide
- /learn/cost/drone-cost-guide
- /learn/cost/drone-spraying-cost-per-acre
- /learn/cost/eldercare-robot-cost-guide
- /learn/cost/healthcare-robot-roi-analysis
- /learn/cost/how-much-does-a-warehouse-robot-cost-2026
- /learn/cost/how-robots-affect-insurance
- /learn/cost/how-to-get-cfo-buy-in-robotics
- /learn/cost/humanoid-robot-cost-guide
- /learn/cost/lease-vs-buy-robots
- /learn/cost/manufacturing-robot-roi-study
- /learn/cost/robot-maintenance-cost-annual
- /learn/cost/robot-payback-period-calculation
- /learn/cost/robot-vs-human-labor-cost-comparison
- /learn/cost/security-robot-cost-guide
- /learn/cost/surgical-robot-cost-guide
- /learn/cost/surgical-robot-cost-hospital
- /learn/cost/total-cost-of-ownership-industrial-robot
- /learn/cost/warehouse-automation-budget-guide
- /learn/cost/warehouse-automation-roi-by-size
- /learn/cost/warehouse-robot-cost-guide
- /learn/cost/warehouse-robot-depreciation-guide
- /learn/delivery/delivery-robots-for-university-campus
- /learn/delivery/delivery-robots-last-mile-2026
- /learn/delivery/sidewalk-delivery-robots-guide
- /learn/getting-started/automation-readiness-assessment
- /learn/getting-started/first-warehouse-robot-guide
- /learn/getting-started/how-to-choose-your-first-robot
- /learn/getting-started/introduce-robots-workforce
- /learn/getting-started/robot-deployment-failure-reasons
- /learn/getting-started/robot-terminology-glossary
- /learn/getting-started/scale-robot-fleet
- /learn/getting-started/warehouse-automation-mistakes
- /learn/getting-started/what-is-a-robot
- /learn/guides/fleet-management-systems-guide
- /learn/guides/how-to-buy-a-cobot-manufacturing
- /learn/guides/how-to-buy-a-construction-robot
- /learn/guides/how-to-buy-a-delivery-robot
- /learn/guides/how-to-buy-a-humanoid-robot
- /learn/guides/how-to-buy-a-security-robot
- /learn/guides/how-to-buy-a-surgical-robot
- /learn/guides/how-to-buy-a-warehouse-robot
- /learn/guides/how-to-buy-an-agricultural-robot
- /learn/guides/how-to-buy-an-eldercare-robot
- /learn/guides/how-to-evaluate-robot-vendors
- /learn/guides/how-to-evaluate-warehouse-robot-vendors
- /learn/guides/how-to-get-robot-budget-approved
- /learn/guides/robot-cybersecurity-guide
- /learn/guides/robot-data-privacy-compliance
- /learn/guides/robot-deployment-timeline-guide
- /learn/guides/robot-fleet-management-basics
- /learn/guides/robot-insurance-requirements
- /learn/guides/robot-integration-guide-wms-erp
- /learn/guides/robot-integration-wms-checklist
- /learn/guides/robot-leasing-vs-buying
- /learn/guides/robot-maintenance-planning-guide
- /learn/guides/robot-roi-calculation-guide
- /learn/guides/robot-safety-assessment-guide
- /learn/guides/robot-safety-compliance-guide
- /learn/guides/robot-safety-standards-iso-10218
- /learn/guides/robot-vendor-due-diligence-checklist
- /learn/guides/robot-workforce-transition-guide
- /learn/guides/warehouse-robot-pilot-program-guide
- /learn/home/robot-lawn-mower-guide-2026
- /learn/home/robot-vacuum-vs-robot-mop
- /learn/hospitality/hotel-cleaning-robots-guide
- /learn/hospitality/hotel-robot-concierge-guide
- /learn/hospitality/restaurant-robots-guide
- /learn/hospitality/restaurant-robots-guide-2026
- /learn/humanoid/data-flywheel-robotics
- /learn/humanoid/eldercare-robots-caregiver-shortage
- /learn/humanoid/figure-ai-robot-review
- /learn/humanoid/figure-robot-vs-boston-dynamics-atlas
- /learn/humanoid/fleet-learning-robotics
- /learn/humanoid/humanoid-robot-cost-2026
- /learn/humanoid/humanoid-robot-use-cases-2026
- /learn/humanoid/humanoid-use-cases-proven-2026
- /learn/humanoid/robot-roi-calculator-guide
- /learn/humanoid/robot-safety-standards-2026
- /learn/humanoid/robotics-deployment-timeline
- /learn/humanoid/robots-as-a-service-guide
- /learn/humanoid/top-humanoid-robot-companies-2026
- /learn/humanoid/us-vs-china-humanoid-robots-2026
- /learn/humanoid/us-vs-china-robotics-strategic
- /learn/inspection/ai-quality-control-roi
- /learn/inspection/dimensional-measurement-robots
- /learn/inspection/industrial-inspection-robots-2026
- /learn/inspection/machine-vision-inspection-guide
- /learn/inspection/surface-defect-detection-guide
- /learn/inspection/vision-guided-robotics-guide
- /learn/manufacturing/best-cobots-small-business
- /learn/manufacturing/bin-picking-robots-guide
- /learn/manufacturing/cobot-guide-2026
- /learn/manufacturing/cobot-palletizing-guide
- /learn/manufacturing/cobot-safety-assessment-guide
- /learn/manufacturing/cobot-vs-industrial-robot
- /learn/manufacturing/cobot-welding-guide
- /learn/manufacturing/cobots-for-food-manufacturing
- /learn/manufacturing/machine-tending-robots-guide
- /learn/manufacturing/manufacturing-automation-smb-guide
- /learn/manufacturing/robotic-assembly-guide
- /learn/manufacturing/robotic-painting-guide
- /learn/manufacturing/robotic-welding-cost-guide
- /learn/manufacturing/welding-robots-guide-2026
- /learn/market/agricultural-robotics-investment-2026
- /learn/market/china-robotics-industry-overview
- /learn/market/cobot-adoption-manufacturing-2026
- /learn/market/drone-delivery-market-2026
- /learn/market/humanoid-robots-market-2026
- /learn/market/robotics-ai-integration-2026
- /learn/market/robotics-as-a-service-raas-guide
- /learn/market/robotics-funding-q1-2026
- /learn/market/robotics-ipo-pipeline-2026
- /learn/market/robotics-jobs-market-2026
- /learn/market/robotics-market-by-region-2026
- /learn/market/robotics-market-outlook-2026
- /learn/market/security-robot-market-2026
- /learn/market/space-robotics-market-2026
- /learn/market/surgical-robotics-market-2026
- /learn/market/top-robotics-companies-by-revenue
- /learn/market/underwater-robotics-market-2026
- /learn/market/warehouse-automation-trends-2026
- /learn/medical/best-surgical-robots-hospitals
- /learn/medical/healthcare-robotics-buying-guide-2026
- /learn/medical/hospital-logistics-robots-guide
- /learn/medical/pharmacy-automation-guide
- /learn/medical/pharmacy-automation-robots
- /learn/medical/rehabilitation-robots-guide
- /learn/medical/rehabilitation-robots-guide-2026
- /learn/medical/robots-for-hospital-logistics
- /learn/medical/surgical-robot-comparison
- /learn/medical/surgical-robot-comparison-2026
- /learn/medical/uv-disinfection-robots-guide
- /learn/problems/construction-safety-robotics
- /learn/problems/farm-labor-automation-crisis
- /learn/problems/food-delivery-cost-reduction
- /learn/problems/hospital-infection-control-robots
- /learn/problems/robot-downtime-reduction-guide
- /learn/problems/robot-integration-challenges
- /learn/problems/robot-maintenance-cost-reduction
- /learn/problems/robot-training-change-management
- /learn/problems/robot-vendor-selection-mistakes
- /learn/problems/warehouse-labor-shortage-robots
- /learn/retail/retail-shelf-scanning-robots
- /learn/retail/robots-for-retail-inventory
- /learn/retail/store-fulfillment-robots
- /learn/security/corporate-campus-security-robots
- /learn/security/perimeter-security-drones-2026
- /learn/security/security-robots-for-commercial-buildings
- /learn/security/security-robots-guide-2026
- /learn/vs/amazon-proteus-vs-locus-origin
- /learn/vs/amr-vs-agv-guide
- /learn/vs/amr-vs-agv-warehouse
- /learn/vs/amr-vs-agv-which-is-better
- /learn/vs/autonomous-forklift-vs-traditional-forklift
- /learn/vs/boston-dynamics-atlas-vs-figure-01
- /learn/vs/boston-dynamics-spot-vs-ghost-robotics
- /learn/vs/boston-dynamics-spot-vs-ghost-vision60
- /learn/vs/boston-dynamics-spot-vs-unitree-b2
- /learn/vs/boston-dynamics-stretch-vs-locus-robotics
- /learn/vs/cloud-robotics-vs-edge-computing
- /learn/vs/cobot-vs-industrial-robot
- /learn/vs/cobot-vs-industrial-robot-smb
- /learn/vs/da-vinci-vs-mako-robot
- /learn/vs/dji-matrice-vs-skydio-x10
- /learn/vs/fanuc-vs-kuka-industrial-robots
- /learn/vs/fanuc-vs-kuka-vs-abb-comparison
- /learn/vs/humanoid-vs-purpose-built-robot
- /learn/vs/intuitive-davinci-vs-hugo-ras
- /learn/vs/kiwibot-vs-starship-delivery-robot
- /learn/vs/locus-robotics-vs-6-river-systems
- /learn/vs/robot-lease-vs-buy
- /learn/vs/sarcos-guardian-vs-ekso-bionics
- /learn/vs/skydio-2-plus-vs-autel-evo-max
- /learn/vs/surgical-robot-vs-manual-surgery-outcomes
- /learn/vs/universal-robots-ur10-vs-fanuc-crx10
- /learn/vs/universal-robots-ur5e-vs-ur10e
- /learn/vs/warehouse-robots-vs-human-pickers
- /learn/warehouse/agv-navigation-technologies-compared
- /learn/warehouse/agv-safety-standards-guide
- /learn/warehouse/agv-vs-amr-which-to-choose
- /learn/warehouse/amr-fleet-management-software
- /learn/warehouse/asrs-roi-calculator-guide
- /learn/warehouse/asrs-systems-complete-guide
- /learn/warehouse/autonomous-forklift-guide
- /learn/warehouse/autonomous-forklift-guide-2026
- /learn/warehouse/best-amr-picking-robots-2026
- /learn/warehouse/best-autonomous-mobile-robots-2026
- /learn/warehouse/best-robots-for-small-warehouses
- /learn/warehouse/best-warehouse-robots-2026
- /learn/warehouse/cube-storage-systems-guide
- /learn/warehouse/goods-to-person-systems-guide
- /learn/warehouse/goods-to-person-vs-person-to-goods
- /learn/warehouse/heavy-payload-agv-guide
- /learn/warehouse/mini-load-asrs-guide
- /learn/warehouse/robots-for-small-warehouse-under-50000
- /learn/warehouse/shuttle-asrs-vs-crane-asrs
- /learn/warehouse/tugger-agv-guide
- /learn/warehouse/warehouse-automation-roi-case-study-2026
- /learn/warehouse/warehouse-robot-fleet-sizing