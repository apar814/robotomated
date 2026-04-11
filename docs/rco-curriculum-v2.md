# RCO Certification Program — Complete Curriculum
## Grounded in ANSI/A3 R15.06-2025, ISO 10218:2025, ISO/TS 15066

### Research Sources
- ANSI/A3 R15.06-2025 (403-page robot safety standard, published Oct 2025)
- ISO 10218-1:2025 & ISO 10218-2:2025 (industrial robot safety)
- ISO/TS 15066 (collaborative robot safety, now integrated into ISO 10218-2:2025)
- FANUC NOCTI Certification Program (FCR-O1, FCR-T1 exam blueprints)
- A3 Certified Robot Integrator (CRI) program
- OMRON AMR Level 2 Integration Practices
- Universal Robots Academy (e-Series Core/Pro/Application tracks)
- OSHA robotics guidelines (no specific standard — general duty clause applies)
- PayScale, Glassdoor, ZipRecruiter salary data (2025-2026)

---

## LEVEL 0 — AWARENESS (Robot Literacy)
**Credential:** RCO-A (Robotomated Certified — Awareness)
**Cost:** Free | **Questions:** 40 | **Duration:** 60 min | **Pass:** 70%
**Study time:** 3-5 hours | **Renewal:** None (permanent)
**Prerequisites:** None

### What You Learn
Foundational understanding of robots as tools: what they are, the 5 major categories (industrial arms, AMRs, cobots, drones, humanoids), basic safety awareness when working near deployed robots, and the structure of the robotics economy. This is not operator training — it is literacy. You finish knowing enough to evaluate automation opportunities and speak with vendors without being misled.

### Learning Objectives
1. Identify and differentiate the 5 robot categories by form factor, capability, and use case
2. Describe basic robot architecture: sensors, actuators, compute, power
3. Explain fundamental safety principles when working near robots (keep-out zones, E-Stop, lockout/tagout awareness)
4. Articulate the ROI framework for automation (labor cost vs robot cost, payback period, TCO basics)
5. Recognize common automation scams and vendor overstatements

### Domain Weights
| Domain | Weight | Key Topics |
|--------|--------|------------|
| The Robot Revolution | 20% | History, current state, market size ($103B→$24T), who's building what |
| How Robots Work | 25% | Sensors (LIDAR, cameras, IMU), actuators, batteries, compute, DoF basics |
| Safety Basics | 30% | E-Stop, keep-out zones, ISO 10218 awareness, "never enter a robot's workspace without lockout" |
| The Robot Economy | 15% | Buy vs lease vs RaaS, labor cost comparison, ROI basics, total cost of ownership |
| Your First Interaction | 10% | HMI basics, what operators do, what a deployment looks like day-to-day |

### Assessment Method
40 multiple-choice questions, 60 minutes. Open-book. Questions test conceptual understanding, not operational skill.

### Job Titles Unlocked
- Any role working near robots (warehouse staff, facility management, healthcare workers)
- Career changers evaluating the robotics field
- Non-technical managers overseeing automation initiatives

### Salary Data (2026)
Entry-level roles in robot-adjacent positions: $42,000-$58,000/year
(Source: Glassdoor, PayScale — warehouse automation associate, logistics coordinator)

---

## LEVEL 1 — FOUNDATION (Robot Operator)
**Credential:** RCO-F (Robotomated Certified — Foundation)
**Cost:** $149 ($99 RSP) | **Questions:** 80 | **Duration:** 90 min | **Pass:** 75%
**Study time:** 20-40 hours | **Renewal:** Every 2 years
**Prerequisites:** None (Level 0 recommended)

### What You Learn
Safe operation and monitoring of deployed robots. Startup/shutdown procedures, basic fault diagnosis (error code interpretation, sensor failure recognition, when to escalate), HMI navigation, and the regulatory landscape (OSHA general duty clause, ANSI/A3 R15.06 awareness, ISO 10218 framework). Aligned with FANUC FCR-O1 operator competencies: frame setup, basic program execution, backup/restore, and safety system verification.

### Learning Objectives
1. Safely start up, operate, and shut down any deployed robot following manufacturer procedures
2. Navigate HMI/teach pendant interfaces to monitor status, adjust parameters, and execute stored programs
3. Interpret error codes and diagnostic outputs to classify faults as Level 1 (operator-resolvable) vs Level 2 (technician-required)
4. Execute emergency procedures including E-Stop activation, lockout/tagout, and incident documentation
5. Perform daily safety checks: verify guard integrity, test E-Stop function, inspect end-effectors
6. Document operations: shift logs, incident reports, maintenance requests per OSHA requirements

### Curriculum Modules
**Module 1: Safety Fundamentals (25%)**
- ANSI/A3 R15.06-2025 Part 3 (User Requirements) — key sections
- ISO 10218 safety hierarchy: elimination → substitution → engineering controls → administrative → PPE
- Risk assessment basics per ISO 12100
- Emergency procedures: E-Stop types (Category 0 vs 1 vs 2), protective stop, safety-rated monitored stop
- Lockout/tagout for robotic cells (OSHA 29 CFR 1910.147)
- Safety zone types: danger zone, safeguarded space, operating space per R15.06

**Module 2: Robot Types & Architecture (20%)**
- Industrial arms: 4-axis, 6-axis, SCARA, Delta — when each is used
- AMRs: SLAM navigation, LIDAR vs camera-based, fleet coordination basics
- Cobots: force-limiting vs speed/separation monitoring vs hand-guiding per ISO/TS 15066
- Drones: Part 107 awareness, BVLOS basics, payload classes
- Humanoids: current state, safety challenges, deployment constraints
- Sensor suites: LIDAR, depth cameras, IMU, force/torque, encoders, proximity
- Power systems: AC servo, batteries (Li-ion capacity, charge cycles), pneumatic

**Module 3: Deployment & Operations (20%)**
- Site assessment: floor conditions, WiFi mapping, power requirements, traffic patterns
- Robot commissioning: unpacking, mounting, calibration, network connection
- HMI/teach pendant operation: jogging, frame setup, running stored programs
- Basic programming awareness: waypoints, I/O signals, program flow (not coding)
- WMS/ERP integration awareness: what data flows between robot and enterprise systems
- Maintenance scheduling: manufacturer-recommended intervals, consumable replacement

**Module 4: Fault Diagnosis L1 (20%)**
- Error code interpretation across major platforms (UR, FANUC, ABB, Locus, 6 River)
- Sensor failure symptoms: degraded LIDAR, camera occlusion, encoder drift
- Network troubleshooting: WiFi drops, MQTT disconnection, API timeout
- Mechanical issues: jammed end-effector, wheel slippage, belt tension
- Escalation protocol: when to fix yourself vs when to call Level 2 support
- Diagnostic logging: what to capture before calling support

**Module 5: Regulations & Ethics (15%)**
- OSHA general duty clause and its application to robotics
- ANSI/A3 R15.06-2025 structure: Part 1 (robot), Part 2 (application), Part 3 (user)
- Incident reporting requirements per OSHA 29 CFR 1904
- Data privacy: what robot sensors capture, where data is stored, operator rights
- Liability framework: manufacturer vs integrator vs operator vs employer
- Documentation best practices for compliance audits

### Assessment Method
80 multiple-choice questions, 90 minutes. Closed-book. Mix of knowledge recall (40%), scenario-based application (40%), and diagnostic reasoning (20%).

### Job Titles Unlocked
- Robot Operator ($56K-$65K)
- AMR Technician ($58K-$68K)
- Warehouse Automation Specialist ($55K-$70K)
- Cobotic Assembly Operator ($52K-$62K)

### Salary Data (2026)
Robot Operator average: $64,523/year (Glassdoor)
Industrial Robot Operator average: $74,929/year (ERI SalaryExpert)
Robotics Technician average: $67,742/year (Salary.com)

---

## LEVEL 2 — SPECIALIST (Robot Systems Specialist)
**Credential:** RCO-S (Robotomated Certified — Specialist)
**Cost:** $299 ($199 RSP) | **Questions:** 120 | **Duration:** 150 min | **Pass:** 78%
**Study time:** 60-100 hours | **Renewal:** Every 2 years
**Prerequisites:** Level 1 Foundation
**Includes:** 2 practical simulation scenarios (60 min total)
**Choose 1 of 7 specialization tracks**

### What You Learn
Deep technical expertise in your chosen robotics domain. Programming (ROS2 node design, motion planning, force control tuning), fleet management (multi-robot coordination, task allocation, deadlock prevention), fault injection and recovery (deliberately break systems and fix them under time pressure), and perception/AI (computer vision pipelines, sensor fusion, ML model deployment). Aligned with FANUC FCR-T1 technician competencies plus integration skills from OMRON AMR Level 2 curriculum.

### Learning Objectives
1. Write, debug, and deploy robot programs in ROS2 or manufacturer-specific frameworks
2. Design and validate safety configurations per ANSI/A3 R15.06 Part 2
3. Integrate robots with enterprise systems (WMS, ERP, MES) via REST APIs and MQTT
4. Manage multi-robot fleets: task allocation, traffic management, deadlock resolution
5. Diagnose and resolve Level 2 faults autonomously without manufacturer support
6. Pass 2 timed simulation scenarios demonstrating hands-on competency

### Domain Weights
| Domain | Weight | Key Topics |
|--------|--------|------------|
| Advanced Programming | 25% | ROS2, motion planning, trajectory optimization, PID tuning, force control |
| Fleet Management | 20% | Multi-robot coordination, task allocation, conflict resolution, analytics |
| Fault Injection Mastery | 25% | Sensor spoofing, network partition, actuator degradation, recovery procedures |
| Perception & AI | 30% | Computer vision, object detection, sensor fusion, ML model deployment on edge |

### 7 Specialization Tracks
1. **AMR Specialist** — SLAM algorithms, dynamic path planning, fleet orchestration, warehouse integration (Locus, 6 River, Fetch, OTTO)
2. **Cobot Specialist** — Force control, collaborative modes per ISO/TS 15066, payload optimization, multi-arm coordination (UR, FANUC CRX, ABB GoFa)
3. **Industrial Arm Specialist** — High-speed trajectory, welding/painting paths, offline programming, cycle time optimization (FANUC, KUKA, ABB, Yaskawa)
4. **Drone Operations** — Flight planning, sensor payloads, photogrammetry, FAA Part 107 compliance, BVLOS operations (DJI Enterprise, Skydio, Autel)
5. **Humanoid Specialist** — Bipedal locomotion basics, manipulation planning, human-robot interaction, safety in unstructured environments (Figure, 1X, Digit, Unitree)
6. **Medical Robot Specialist** — Sterile field protocols, FDA regulatory awareness, surgical workflow integration, clinical safety systems (Aethon TUG, Moxi, da Vinci awareness)
7. **Eldercare Specialist** — Care environment safety, patient interaction protocols, privacy/HIPAA, companion robot deployment (PARO, Labrador, TUG, Relay)

### Practical Assessment
2 simulation scenarios, 30 minutes each:
- Scenario 1: Deploy a robot in a new environment with partial information. Map the space, configure safety zones, validate operation.
- Scenario 2: Diagnose and resolve an injected fault under time pressure with limited diagnostic tools.

### Job Titles Unlocked
- Robot Technician ($67K-$76K)
- Integration Specialist ($75K-$90K)
- Automation Engineer ($86K-$110K)
- Robotics Field Service Engineer ($70K-$85K)

### Salary Data (2026)
Robotics Technician average: $67,742 (Salary.com)
Automation Engineer average: $86,471 (PayScale)
Robotics Automation Engineer average: $137,429 (ZipRecruiter)

---

## LEVEL 3 — MASTER (Robot Systems Master)
**Credential:** RCO-M (Robotomated Certified — Master)
**Cost:** $499 ($349 RSP) | **Questions:** 150 | **Duration:** 180 min | **Pass:** 82%
**Study time:** 120-200 hours | **Renewal:** Every 3 years
**Prerequisites:** Level 2 Specialist
**Includes:** THE GAUNTLET — 2-hour live assessment (4 rounds)

### What You Learn
Chaos engineering for robots. Sim-to-real transfer (bridging the gap between simulation and physical deployment), dexterous manipulation (multi-finger grasp planning, deformable object handling), world modeling (building and maintaining environmental representations for autonomous decision-making), edge inference (deploying ML models on constrained hardware), and system architecture (designing multi-robot systems that scale). You must survive The Gauntlet: 4 rounds of live fault injection, zero-downtime maintenance, novel environment adaptation, and code review under pressure.

### Learning Objectives
1. Architect multi-robot systems across different manufacturers and form factors
2. Close the sim-to-real gap: identify transfer failure modes, build domain randomization pipelines
3. Design and validate safety architectures per ANSI/A3 R15.06 Parts 1+2+3
4. Deploy ML models on edge compute (Jetson, Hailo, Intel NCS) with latency constraints
5. Reprogram robot behavior live during production shifts without stopping operations
6. Survive The Gauntlet: demonstrate composure and competency under extreme pressure

### The Gauntlet (2 hours, 4 rounds)
| Round | Title | Time | Pass Criteria |
|-------|-------|------|---------------|
| 1 | Fault Injection | 30 min | 5 unknown faults injected into a live system. Find and fix 4 of 5. |
| 2 | Zero Downtime | 30 min | Perform maintenance and updates on a running system. Zero production stoppages. |
| 3 | Novel Environment | 30 min | Deploy a robot in an unseen environment. Remap, validate safety, complete assigned task. |
| 4 | Code Review & Fix | 30 min | Broken ROS2 control code. Fix all safety-critical bugs live. |

### Job Titles Unlocked
- Senior Robot Engineer ($110K-$140K)
- Fleet Architect ($120K-$155K)
- Technical Director, Robotics ($130K-$170K)
- Principal Robotics Engineer ($140K-$185K)

### Salary Data (2026)
Senior Robotics Engineer average: $148,604 (PayScale)
Robotics Engineer 75th percentile: $184,848 (ZipRecruiter)

---

## LEVEL 4 — FLEET COMMANDER
**Credential:** RCO-FC (Robotomated Certified — Fleet Commander)
**Cost:** $799 ($599 RSP) | **Questions:** 150 | **Duration:** 180 min | **Pass:** 85%
**Study time:** 200+ hours | **Renewal:** Every 3 years
**Prerequisites:** Level 3 Master
**Includes:** 4-hour capstone + case study + panel review

### What You Learn
Leadership and strategic operations. You learn to design fleet architectures spanning multiple facilities, run incident command during production-critical failures, build operator training programs (you teach others what you've learned), and present automation ROI cases to executive leadership. The capstone requires you to design a complete automation strategy for a multi-site operation and defend it before a panel.

### Learning Objectives
1. Design fleet architectures for 50+ robot operations across multiple facilities
2. Build and deliver RCO-aligned operator training programs for teams of 20+
3. Run incident command: classify severity, coordinate response, manage communication
4. Present executive-level business cases: ROI modeling, sensitivity analysis, risk quantification
5. Design procurement strategies: buy vs lease vs RaaS decision frameworks
6. Establish operational metrics: OEE, MTBF, MTTR, fleet utilization, cost-per-unit-moved

### Capstone Assessment (4 hours)
- Part 1 (2 hours): Design a complete automation strategy for a provided business scenario (multi-site, multi-robot-type, $2M+ budget)
- Part 2 (1 hour): Written case study analysis — identify failures in a provided deployment postmortem
- Part 3 (1 hour): Live panel defense — present your strategy to 2 evaluators, answer challenges

### Job Titles Unlocked
- Head of Automation ($150K-$200K)
- VP Operations ($180K-$260K)
- Director of Robotics ($160K-$220K)
- Chief Robotics Officer (at smaller companies) ($200K+)

### Salary Data (2026)
VP Operations average total comp: $253,028 (Built In)
Senior VP Operations: $359,654 (ERI SalaryExpert)

---

## LEVEL 5 — CHIEF ROBOTICS OFFICER (CRO)
**Credential:** RCO-CRO (Robotomated Certified — CRO)
**Cost:** $2,499 | **Duration:** 90 min panel | **Pass:** 80% panel consensus
**Prerequisites:** Level 4 Fleet Commander + demonstrated industry impact
**Not an exam — an induction.**

### What This Is
The highest designation in robotics operations. You don't study for it — you earn it through demonstrated impact. Portfolio defense (show what you've built), expert panel review (answer questions from senior industry practitioners), and an ongoing contribution commitment (you agree to contribute to RCO curriculum updates, mentor Level 3-4 candidates, and maintain active industry engagement).

### Assessment Method
| Component | Weight | Format |
|-----------|--------|--------|
| Portfolio Defense | 33% | Present 3 major robotics deployments or programs you've led. Quantified outcomes required. |
| Panel Review | 34% | 90-minute live session with 2 CRO-level evaluators. Questions on strategy, ethics, industry direction. |
| Contribution Commitment | 33% | Signed commitment to mentor 2 candidates/year, review curriculum quarterly, maintain industry engagement. |

### Job Titles Unlocked
- Chief Robotics Officer ($250K-$400K+)
- Robotics Board Member / Advisor
- Industry Fellow / Distinguished Engineer

---

## SPECIALIZATION TRACK DETAIL

### Track 1: AMR Specialist
**Platforms covered:** Locus Robotics, 6 River Systems, Fetch/Zebra, OTTO Motors, MiR
**Key competencies:** SLAM algorithm configuration, dynamic path planning with obstacle avoidance, fleet traffic management, WMS integration (Manhattan, Blue Yonder, SAP EWM), zone-based task allocation, battery management strategies, multi-floor operations with elevator integration
**Assessment:** Deploy a 3-robot fleet in a simulated warehouse, complete 50 pick tasks in 30 minutes with zero collisions

### Track 2: Cobot Specialist
**Platforms covered:** Universal Robots (UR5e, UR10e, UR20), FANUC CRX, ABB GoFa/SWIFTI, Techman TM
**Key competencies:** All 4 collaborative operation modes per ISO/TS 15066 (safety-rated monitored stop, hand guiding, speed and separation monitoring, power and force limiting), payload calculation including end-effector weight, force control tuning for contact tasks, polyscope/teach pendant programming
**Assessment:** Program a cobot for a peg-in-hole insertion task with force compliance, validate safety per ISO/TS 15066

### Track 3: Industrial Arm Specialist
**Platforms covered:** FANUC (M-series, LR Mate), KUKA (KR series), ABB (IRB series), Yaskawa (Motoman)
**Key competencies:** Offline programming (RoboDK, KUKA.Sim), high-speed trajectory optimization, welding path planning, painting and coating sequences, cycle time analysis and reduction, multi-robot cell coordination, safety system design per ANSI/A3 R15.06 Part 2
**Assessment:** Optimize a welding cell cycle time by 15% while maintaining weld quality parameters

### Track 4: Drone Operations
**Platforms covered:** DJI (Matrice 350 RTK, Mavic 3 Enterprise), Skydio (X10), Autel (EVO II Enterprise)
**Key competencies:** FAA Part 107 regulatory compliance, airspace classification, flight planning for inspection missions, photogrammetry and 3D reconstruction, thermal imaging interpretation, BVLOS waiver preparation, automated flight path programming, payload sensor management
**Assessment:** Plan and execute a simulated infrastructure inspection mission with deliverable report

### Track 5: Humanoid Specialist
**Platforms covered:** Figure (Figure 03), 1X Technologies (NEO), Agility (Digit), Unitree (G1/H1), Apptronik (Apollo)
**Key competencies:** Bipedal locomotion stability (ZMP, capture point), whole-body motion planning, human-robot interaction in unstructured environments, safety protocols for dynamically stable robots (can't just cut power), teleoperation and shared autonomy, sim-to-real transfer for manipulation
**Assessment:** Configure a humanoid for a novel manipulation task in an unstructured environment

### Track 6: Medical Robot Specialist
**Platforms covered:** Aethon TUG, Diligent Moxi, Intuitive da Vinci (awareness only), Stryker MAKO (awareness only)
**Key competencies:** Sterile field protocols, FDA 510(k) regulatory awareness, HIPAA compliance for robot sensor data, clinical workflow integration, elevator and access control integration in hospital environments, infection control protocols for robot surfaces
**Assessment:** Design a deployment plan for a hospital logistics robot across 4 floors including infection control procedures

### Track 7: Eldercare Specialist
**Platforms covered:** PARO, Labrador Retriever, TUG (care facility variant), Relay (senior living)
**Key competencies:** Care environment safety (fall risk, fragile populations), patient privacy (HIPAA, state regulations), companion robot interaction design, medication delivery protocols, caregiver training and handoff procedures, ethical considerations in care automation
**Assessment:** Design a care facility deployment plan addressing safety, privacy, and clinical workflow integration

---

## SALARY PROGRESSION SUMMARY

| Level | Credential | Typical Roles | Salary Range (2026) | Avg Increase |
|-------|-----------|---------------|---------------------|-------------|
| 0 | RCO-A | Robot-adjacent staff | $42K-$58K | Career access |
| 1 | RCO-F | Robot Operator, AMR Tech | $56K-$75K | +$12K |
| 2 | RCO-S | Integration Specialist, Automation Engineer | $75K-$137K | +$27K |
| 3 | RCO-M | Senior Engineer, Fleet Architect | $110K-$185K | +$55K |
| 4 | RCO-FC | Head of Automation, VP Ops | $150K-$260K | +$100K |
| 5 | RCO-CRO | CRO, Board Member | $250K-$400K+ | Executive |

All salary data from PayScale, Glassdoor, ZipRecruiter, ERI SalaryExpert (2025-2026 US national averages).
