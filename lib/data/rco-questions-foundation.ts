/**
 * RCO Foundation (Level 1) — Professional Question Bank v2
 *
 * 100 questions across 5 domains, certification-exam quality.
 * Modeled after AWS SA / CPA rigor: every question tests knowledge
 * that could cause a real deployment failure if gotten wrong.
 *
 * Domain distribution:
 *   SAFETY_FUNDAMENTALS   25
 *   ROBOT_BASICS           20
 *   DEPLOYMENT_FUNDAMENTALS 20
 *   TROUBLESHOOTING_L1     20
 *   REGULATIONS_ETHICS     15
 *
 * Difficulty: 60% levels 1-2, 40% level 3
 * Types: 60 MC, 15 multi_select, 15 scenario, 10 fault_diagnosis
 */

export interface RcoQuestionV2 {
  question_text: string;
  question_type:
    | 'multiple_choice'
    | 'multi_select'
    | 'scenario'
    | 'fault_diagnosis'
    | 'calculation'
    | 'sequencing'
    | 'true_false_justify';
  difficulty: number;
  domain_code: string;
  level: 'foundation';
  scenario_context?: string;
  code_snippet?: string;
  options: { label: string; text: string }[];
  correct_answers: string[];
  explanation: string;
  real_world_context?: string;
  time_limit_seconds?: number;
  points?: number;
  tags: string[];
}

export const FOUNDATION_QUESTIONS: RcoQuestionV2[] = [
  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 1: SAFETY_FUNDAMENTALS (25 questions)
  // ═══════════════════════════════════════════════════════════════

  // SF-1
  {
    question_text:
      'A facility is deploying a UR5e cobot on a shared assembly line. Under ISO/TS 15066, which collaborative operation mode requires the robot to monitor the real-time distance to all personnel and dynamically adjust its TCP speed to maintain the protective separation distance?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Safety-rated monitored stop' },
      { label: 'B', text: 'Hand guiding' },
      { label: 'C', text: 'Speed and separation monitoring' },
      { label: 'D', text: 'Power and force limiting' },
    ],
    correct_answers: ['C'],
    explanation:
      'Speed and separation monitoring (SSM) is defined in ISO/TS 15066 clause 5.5.3. The robot system continuously calculates the minimum protective separation distance based on the relative speed of the robot and the operator, the stopping time/distance of the robot, and measurement uncertainty of the sensor system. When the actual distance falls below the calculated minimum, the robot must decelerate or stop. This differs from power and force limiting, which caps contact forces, and safety-rated monitored stop, which simply halts the robot when a human enters the collaborative workspace.',
    real_world_context:
      'Universal Robots UR5e deployments commonly use SSM with area scanners when the application requires higher speeds than PFL mode allows but operators must periodically access the workspace.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['iso-ts-15066', 'collaborative-operations', 'UR5e', 'SSM'],
  },

  // SF-2
  {
    question_text:
      'During a risk assessment for a new FANUC CRX-10iA cobot cell, the team identifies a hazard with a severity rating of S2 (serious/irreversible injury) and a probability of O2 (likely). Using the risk estimation matrix in ISO 12100, what risk reduction priority does this combination produce?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Acceptable risk — no additional measures required' },
      { label: 'B', text: 'Low priority — administrative controls sufficient' },
      {
        label: 'C',
        text: 'High priority — engineering controls and safeguarding required before deployment',
      },
      {
        label: 'D',
        text: 'Medium priority — warning signage and training are adequate',
      },
    ],
    correct_answers: ['C'],
    explanation:
      'ISO 12100 (Safety of machinery) uses a risk estimation combining severity (S1/S2), frequency/exposure (F1/F2), and possibility of avoidance (P1/P2). An S2+O2 combination always falls in the high-risk zone requiring engineering controls per the three-step method: (1) inherently safe design, (2) safeguarding and complementary protective measures, (3) information for use. Administrative controls alone (training, signage) are never sufficient for S2-severity hazards with non-negligible probability. This is fundamental to the hierarchy of controls mandated by both ISO 12100 and OSHA.',
    real_world_context:
      'FANUC CRX-10iA installations in automotive assembly require this exact risk assessment process. A real deployment failure occurred when a tier-1 supplier skipped formal risk assessment and relied only on the cobot PFL mode, not accounting for sharp tooling that increased severity to S2.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['iso-12100', 'risk-assessment', 'FANUC', 'hierarchy-of-controls'],
  },

  // SF-3
  {
    question_text:
      'An operator discovers that the Category 3 safety circuit on an ABB IRB 1200 has a single channel with monitoring. The safety engineer insists this is insufficient. Why?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Category 3 requires dual-channel architecture with cross-monitoring so that a single fault does not lead to loss of the safety function',
      },
      {
        label: 'B',
        text: 'Category 3 only applies to non-robotic machinery',
      },
      {
        label: 'C',
        text: 'Category 3 allows single channel if the MTBF exceeds 20 years',
      },
      {
        label: 'D',
        text: 'Category 3 is not defined in ISO 13849-1',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'ISO 13849-1 defines Category 3 as requiring that a single fault in any part shall not lead to loss of the safety function. This is achieved through redundancy (dual-channel) and monitoring (cross-checking between channels). A single-channel architecture, even with monitoring, cannot satisfy this because a fault in the single channel results in immediate loss of the safety function. Category 3 also requires that the single fault is detected at or before the next demand on the safety function.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['iso-13849', 'safety-categories', 'ABB', 'safety-circuits'],
  },

  // SF-4
  {
    question_text:
      'A warehouse AMR fleet (Locus Robotics) operates in a zone where forklift traffic crosses the AMR travel paths. Select ALL appropriate safety measures for this mixed-traffic environment. (Select 3)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Install physical barriers or bollards at every crossing point to create defined interaction zones',
      },
      {
        label: 'B',
        text: 'Configure the AMR fleet manager to enforce reduced speed zones within 5 meters of forklift crossing areas',
      },
      {
        label: 'C',
        text: 'Rely solely on the AMR LIDAR to detect and avoid forklifts dynamically',
      },
      {
        label: 'D',
        text: 'Implement time-segregated traffic patterns where AMRs yield to forklift right-of-way at intersections',
      },
      {
        label: 'E',
        text: 'Disable AMR obstacle avoidance to prevent unnecessary stops that reduce throughput',
      },
      {
        label: 'F',
        text: 'Remove all forklifts and replace them with additional AMRs',
      },
    ],
    correct_answers: ['A', 'B', 'D'],
    explanation:
      'Mixed-traffic environments require layered safety: (A) Physical barriers at crossing points create defined interaction zones and prevent uncontrolled encounters. (B) Speed reduction zones ensure AMRs can stop within their sensor detection range at high-risk areas. (D) Traffic management protocols establish clear right-of-way rules. Option C is insufficient because LIDAR alone cannot reliably detect all forklift approach angles, especially with raised loads blocking line-of-sight. Option E is dangerous — disabling obstacle avoidance in a mixed-traffic environment creates collision risk. Option F is impractical and not a safety control.',
    real_world_context:
      'Locus Robotics deployments in large 3PL warehouses (DHL, GEODIS) routinely handle mixed traffic. The standard practice is layered controls: physical separation where possible, speed zones, and traffic management software integration.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['AMR-safety', 'mixed-traffic', 'Locus', 'warehouse-safety'],
  },

  // SF-5
  {
    question_text:
      'What is the correct lockout/tagout (LOTO) sequence before performing maintenance inside a KUKA KR 60-3 industrial robot cell?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Press e-stop, enter cell, apply lock to main disconnect, attach tag, verify zero energy',
      },
      {
        label: 'B',
        text: 'Notify affected personnel, shut down robot and ancillary equipment, isolate energy sources at main disconnect, apply personal lock and tag, verify zero energy state by attempting restart',
      },
      {
        label: 'C',
        text: 'Switch to manual mode on the teach pendant, reduce speed to 10%, enter the cell with the pendant',
      },
      {
        label: 'D',
        text: 'Power off the controller, wait 30 seconds, then enter the cell',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'OSHA 29 CFR 1910.147 defines the LOTO procedure: (1) Notify all affected employees, (2) Shut down equipment using normal procedures, (3) Isolate all energy sources (electrical, pneumatic, hydraulic, gravity/stored energy), (4) Apply individual lock and tag to each isolation device, (5) Verify zero energy state by attempting to restart. Option A skips notification and applies the lock in the wrong sequence (entering before lockout). Option C is a programming/teaching procedure, not maintenance lockout. Option D does not isolate energy or verify zero-energy state — capacitors, pneumatic accumulators, and gravity-loaded axes can still store lethal energy.',
    real_world_context:
      'A 2019 OSHA investigation found that a maintenance technician was fatally injured inside a FANUC robot cell because the LOTO procedure was performed on the robot controller but not on the upstream pneumatic supply, which held stored energy in an accumulator.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['LOTO', 'OSHA', 'KUKA', 'maintenance-safety'],
  },

  // SF-6
  {
    question_text:
      'Under ISO 10218-2, what is the minimum requirement for the perimeter safeguarding of an industrial robot cell that operates at speeds above collaborative limits?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Painted floor markings with audible warning alarms' },
      {
        label: 'B',
        text: 'Physical guarding (fencing, barriers) with interlocked access gates that trigger a safety-rated stop when opened',
      },
      {
        label: 'C',
        text: 'A single light curtain across the primary operator access point',
      },
      {
        label: 'D',
        text: 'Safety-rated soft barriers using virtual fencing from a 3D vision system',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO 10218-2 (Robot systems and integration) clause 5.2.2 requires that perimeter safeguarding for non-collaborative robot cells use physical guards meeting ISO 14120. Access points must have interlocked gates (ISO 14119) that initiate a safety-rated stop when opened. Floor markings alone provide no physical barrier. A single light curtain may supplement but does not satisfy the full perimeter requirement. Virtual fencing is not currently recognized as a primary safeguarding method under ISO 10218-2 for non-collaborative applications.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['iso-10218', 'perimeter-safeguarding', 'interlocked-gates'],
  },

  // SF-7
  {
    question_text:
      'A cobot application uses power and force limiting (PFL) mode. The risk assessment identifies a transient contact scenario where the robot TCP could contact a human forearm. According to ISO/TS 15066 Annex A, which biomechanical limit must not be exceeded?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Maximum static force of 65 N for any body region' },
      {
        label: 'B',
        text: 'The transient force limit and pressure limit specific to the forearm body region as defined in Table A.2',
      },
      { label: 'C', text: 'A universal energy transfer limit of 0.5 J for all body regions' },
      {
        label: 'D',
        text: 'The robot manufacturer payload rating divided by the safety factor of 2',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO/TS 15066 Annex A provides body-region-specific biomechanical limits for both transient (impact) and quasi-static (clamping) contact. The forearm has specific maximum permissible force and pressure values that differ from other body regions (e.g., hand, chest, head). There is no single universal force or energy limit — each body region has its own threshold based on pain onset research. For transient contact on the forearm, the limits are higher than for the head or face but lower than for the thigh. The robot system must be validated against the specific body region limits relevant to the identified contact scenarios.',
    real_world_context:
      'UR and FANUC cobot deployment guides reference ISO/TS 15066 Annex A tables directly. A common commissioning error is applying the most conservative (head/face) limits universally, which unnecessarily restricts performance, or applying the least conservative limits, which creates unsafe conditions for exposed body regions.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['iso-ts-15066', 'PFL', 'biomechanical-limits', 'transient-contact'],
  },

  // SF-8
  {
    question_text:
      'During commissioning of a collaborative cell, you measure the stopping distance of a UR10e at full speed with a 5 kg payload. The measured stopping distance is 180 mm, but the safety data sheet specifies a maximum of 150 mm for the configured safety limits. What is the correct action?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Accept the measurement since the difference is within typical engineering tolerance',
      },
      {
        label: 'B',
        text: 'Halt commissioning, investigate the cause (payload calibration, brake condition, mounting compliance), and do not resume until the stopping distance meets or betters the specified maximum',
      },
      {
        label: 'C',
        text: 'Update the safety data sheet to reflect the new measured value',
      },
      {
        label: 'D',
        text: 'Add 180 mm to the existing safety distance calculations and proceed',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'A stopping distance exceeding the manufacturer specified maximum indicates a potential safety system failure: worn brakes, incorrect payload configuration, non-rigid mounting, or controller fault. Commissioning must halt because all safety distance calculations (for SSM, safeguarding placement, etc.) are based on the specified stopping distance. Options A and D are dangerous — they accept a safety parameter that exceeds specification. Option C inverts the correct process: the system must meet the specification, not the other way around.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['commissioning', 'stopping-distance', 'UR10e', 'safety-validation'],
  },

  // SF-9
  {
    question_text:
      'A technician needs to jog a FANUC M-20iD/25 at reduced speed inside a fenced cell with the gate interlock bypassed using a hold-to-run enabling device. Which safety conditions must ALL be simultaneously maintained? (Select 3)',
    question_type: 'multi_select',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Robot must be in manual reduced speed mode (T1) with a maximum TCP speed of 250 mm/s',
      },
      {
        label: 'B',
        text: 'The enabling device must be held in the active (middle) position — releasing or fully squeezing triggers a stop',
      },
      {
        label: 'C',
        text: 'The teach pendant must be the sole active motion control device',
      },
      {
        label: 'D',
        text: 'A second operator must be stationed outside the cell at the e-stop panel',
      },
      {
        label: 'E',
        text: 'The main power disconnect must be partially engaged for reduced power output',
      },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'ISO 10218-1 clause 5.8 specifies the conditions for manual operation within a safeguarded space: (A) T1 mode limits TCP speed to 250 mm/s per ISO 10218-1. (B) The three-position enabling device must be held in the active middle position — the panic-release and full-squeeze positions both trigger a stop, preventing both involuntary release and panic-grip hazards. (C) Only the teach pendant may command motion, preventing unexpected activation from other sources. While having a second person at the e-stop (D) is good practice, it is not a mandatory requirement under the standard. Option E is nonsensical — partial power disconnects create more hazards.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['iso-10218', 'manual-mode', 'enabling-device', 'FANUC', 'T1-mode'],
  },

  // SF-10
  {
    question_text:
      'What is the primary purpose of a safety-rated monitored stop (as opposed to a Category 0 or Category 1 stop) in a collaborative robot application?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'To remove power from the motors immediately to save energy',
      },
      {
        label: 'B',
        text: 'To keep the robot energized and in position while halted, allowing immediate resumption when the collaborative workspace is clear, without requiring a re-homing cycle',
      },
      {
        label: 'C',
        text: 'To allow the robot to complete its current motion trajectory before stopping',
      },
      {
        label: 'D',
        text: 'To trigger a controlled deceleration that takes exactly 2 seconds regardless of speed',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'A safety-rated monitored stop (ISO 10218-1 clause 5.5) halts all motion but keeps the drives energized and the robot at its current position. The safety system continuously monitors that the robot remains stationary. This is critical for collaborative applications because it allows the robot to resume immediately once the human exits the collaborative workspace, avoiding time-consuming restart or re-homing procedures. A Category 0 stop removes power immediately (uncontrolled). A Category 1 stop decelerates then removes power. Neither maintains the energized-at-position state.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['safety-rated-stop', 'collaborative-operations', 'stop-categories'],
  },

  // SF-11
  {
    question_text:
      'Which of the following correctly describes the relationship between Performance Level (PL) in ISO 13849-1 and Safety Integrity Level (SIL) in IEC 62061?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'They are identical scales that can be used interchangeably' },
      {
        label: 'B',
        text: 'PL uses five discrete levels (a through e) for reliability of safety functions in machinery, while SIL uses four levels (1 through 3, with SIL 4 not applicable to machinery) and is probability-based; approximate mappings exist (e.g., PL d approximates SIL 2)',
      },
      {
        label: 'C',
        text: 'PL is only for electrical systems while SIL covers mechanical and hydraulic systems',
      },
      {
        label: 'D',
        text: 'SIL replaced PL in 2015 and PL is no longer valid for new installations',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO 13849-1 uses Performance Levels (PL a through PL e) and is applicable to all safety-related parts of machinery control systems regardless of technology (electrical, hydraulic, pneumatic, mechanical). IEC 62061 uses Safety Integrity Levels (SIL 1 through SIL 3 for machinery sector) and is specifically for electrical/electronic/programmable electronic systems. Both standards are valid and active. ISO 13849-1 Annex K provides approximate mappings: PL a~none, PL b~SIL 1, PL c~SIL 1, PL d~SIL 2, PL e~SIL 3. The choice of standard depends on the system architecture and the integrator preference.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['iso-13849', 'iec-62061', 'PL', 'SIL', 'safety-standards'],
  },

  // SF-12
  {
    question_text:
      'An AMR (Autonomous Mobile Robot) operating in a hospital corridor encounters a patient in a wheelchair blocking 80% of the hallway. The AMR has a narrow gap available but its safety scanner detects the gap width is below the minimum configured passthrough threshold. What should the AMR do?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Reduce speed and carefully navigate through the narrow gap',
      },
      {
        label: 'B',
        text: 'Stop, wait for the path to clear, and request an alternate route from the fleet manager if the blockage persists beyond the configured timeout',
      },
      {
        label: 'C',
        text: 'Sound an audible alarm to warn the patient to move, then proceed',
      },
      {
        label: 'D',
        text: 'Reverse at full speed to find an alternate route immediately',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'When the available passage is below the minimum configured passthrough width, the AMR must not attempt to navigate through it, regardless of speed. The correct behavior is to stop safely, wait for the obstruction to clear, and escalate to the fleet management system for rerouting if the blockage persists. Option A violates the configured safety threshold. Option C is inappropriate in a healthcare setting and does not address the physical constraint. Option D at full speed is unsafe in a corridor environment.',
    real_world_context:
      'Hospital AMR deployments (Aethon TUG, Diligent Moxi) are configured with minimum corridor width thresholds specifically for wheelchair and bed clearance. Violating these thresholds has resulted in near-miss incidents.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['AMR-safety', 'healthcare-robotics', 'obstacle-avoidance', 'fleet-management'],
  },

  // SF-13
  {
    question_text:
      'What is the fundamental difference between a "safeguarded space" and a "collaborative workspace" as defined in ISO 10218-2?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'They are synonymous terms used interchangeably in the standard',
      },
      {
        label: 'B',
        text: 'A safeguarded space is protected by perimeter devices and humans should not be present during automatic operation, while a collaborative workspace is where the robot and human can simultaneously occupy the same space during production',
      },
      {
        label: 'C',
        text: 'A safeguarded space is indoors and a collaborative workspace is outdoors',
      },
      {
        label: 'D',
        text: 'A collaborative workspace requires fencing while a safeguarded space does not',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO 10218-2 clearly distinguishes these two concepts. A safeguarded space (clause 3.7) is the space within the robot cell defined by perimeter safeguarding where the robot operates; humans must not be present during automatic operation and entry requires safeguarding (interlocked gates, light curtains, etc.). A collaborative workspace (clause 3.3) is the space within the operating space where the robot system and a human can perform tasks simultaneously during production. This distinction is critical because the safety requirements, risk assessment, and safeguarding methods differ fundamentally between the two.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['iso-10218', 'collaborative-workspace', 'safeguarded-space', 'definitions'],
  },

  // SF-14
  {
    question_text:
      'A facility plans to install a safety laser scanner to protect the entrance to a robot cell. The scanner will trigger a safety-rated stop when a person is detected. Which factors must be included in calculating the minimum mounting distance from the hazard zone? (Select 3)',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The response time of the safety laser scanner' },
      { label: 'B', text: 'The stopping time/distance of the robot at its maximum speed' },
      { label: 'C', text: 'The approach speed of the human body (standardized at 1.6 m/s for walking or 2.0 m/s for arm reach in ISO 13855)' },
      { label: 'D', text: 'The ambient temperature of the facility' },
      { label: 'E', text: 'The color of the safety scanner housing' },
      { label: 'F', text: 'The annual maintenance budget for the scanner' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'ISO 13855 (Positioning of safeguards with respect to approach speeds) defines the minimum distance calculation as S = K x T + C, where K is the approach speed of the human body (1.6 m/s for walking approach, 2.0 m/s for reaching), T is the overall system response time (scanner response time + robot stopping time + communication delays), and C is an additional distance accounting for detection zone geometry and intrusion depth before detection. The scanner response time (A), robot stopping performance (B), and standardized human approach speed (C) are the three mandatory factors. Temperature, housing color, and maintenance budget have no bearing on the safety distance calculation.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['iso-13855', 'safety-distance', 'laser-scanner', 'safeguard-positioning'],
  },

  // SF-15
  {
    question_text:
      'After a robot strikes an operator (minor injury), which is the correct immediate sequence of actions?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Document the incident, then check on the operator, then activate the e-stop',
      },
      {
        label: 'B',
        text: 'Activate the emergency stop, provide first aid to the operator, secure the scene, report the incident to the supervisor and safety team, do not restart the robot until the incident is investigated',
      },
      {
        label: 'C',
        text: 'Restart the robot to check if the error repeats, then decide whether to report',
      },
      {
        label: 'D',
        text: 'Move the operator away from the area and restart production to meet the shift target',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'The correct incident response follows the priority: (1) Stop the hazard — activate e-stop to prevent further injury, (2) Aid the injured — provide first aid and call emergency medical services if needed, (3) Secure the scene — preserve evidence for investigation, (4) Report — notify supervision, safety team, and follow the facility incident reporting procedure. Never restart the robot before investigation. Restarting to "reproduce" the error (C) could cause additional injury. Prioritizing production over investigation (D) is a serious safety culture failure and may violate OSHA reporting requirements.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['incident-response', 'emergency-procedures', 'OSHA-reporting'],
  },

  // SF-16
  {
    question_text:
      'A new cobot cell designer asks why safety-rated soft axis and space limiting (per ISO 10218-1) is preferable to relying solely on mechanical hardstops in many applications. What is the primary advantage?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Safety-rated soft limits can be dynamically reconfigured for different products or tasks without physical modification, while also providing earlier deceleration before reaching the boundary',
      },
      {
        label: 'B',
        text: 'Mechanical hardstops are cheaper so soft limits exist only for premium robot models',
      },
      {
        label: 'C',
        text: 'Soft axis limits are more reliable than mechanical hardstops in all conditions',
      },
      {
        label: 'D',
        text: 'Mechanical hardstops are no longer permitted under ISO 10218-1',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'Safety-rated soft axis and space limiting allows the robot controller to enforce configurable workspace boundaries through the safety-rated control system. The key advantages are: (1) Reconfigurability — limits can be adjusted for different production runs without mechanical changes, (2) Proactive deceleration — the robot begins slowing before reaching the limit rather than impacting a hardstop at speed, (3) Integration with other safety functions — soft limits can interact with speed monitoring and zone-based safety configurations. Mechanical hardstops are still valid and sometimes used as a secondary measure, but they are reactive (absorb energy at impact) rather than proactive.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['soft-axis-limits', 'space-limiting', 'iso-10218', 'cell-design'],
  },

  // SF-17
  {
    question_text:
      'Which statement correctly describes the "three-step method" for risk reduction in ISO 12100?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Step 1: Inherently safe design measures, Step 2: Safeguarding and complementary protective measures, Step 3: Information for use (warnings, instructions, training)',
      },
      {
        label: 'B',
        text: 'Step 1: Install warning signs, Step 2: Train operators, Step 3: Add safety equipment if budget allows',
      },
      {
        label: 'C',
        text: 'Step 1: Conduct risk assessment, Step 2: Accept residual risk, Step 3: Document in the safety file',
      },
      {
        label: 'D',
        text: 'Step 1: Install fencing, Step 2: Add light curtains, Step 3: Add e-stops',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'ISO 12100 clause 6.1 defines the three-step method as a strict hierarchy: (1) Inherently safe design eliminates hazards or reduces risk through design choices (e.g., reducing robot speed, eliminating pinch points, using lower energy). (2) Safeguarding adds protective measures that the designer cannot design out (guards, interlocks, safety devices). (3) Information for use addresses residual risks through instructions, warnings, training, and PPE requirements. The hierarchy is critical — higher-level measures are always preferred because they are less susceptible to human error.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['iso-12100', 'risk-reduction', 'hierarchy-of-controls'],
  },

  // SF-18
  {
    question_text:
      'A UR16e cobot equipped with a pneumatic gripper is performing a palletizing task. The operator notices that when the e-stop is activated, the gripper releases its load (a 12 kg box) from 1.5 meters height. What safety principle has been violated?',
    question_type: 'scenario',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    scenario_context:
      'A UR16e cobot is palletizing 12 kg boxes using a pneumatic vacuum gripper. The compressed air supply is connected through a standard solenoid valve that de-energizes (closes the vacuum) when the e-stop cuts power to the robot controller I/O. During a safety drill, the e-stop is pressed while the robot holds a box at maximum height.',
    options: [
      {
        label: 'A',
        text: 'The gripper air supply must be maintained by a safety-rated check valve or accumulator so that activating the e-stop does not release the gripped load, preventing a "dropped load" hazard',
      },
      {
        label: 'B',
        text: 'The e-stop circuit should not cut power to the gripper I/O',
      },
      {
        label: 'C',
        text: 'The palletizing height should be reduced to 0.5 meters',
      },
      {
        label: 'D',
        text: 'Pneumatic grippers should not be used with cobots',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'ISO 10218-1 clause 5.6 requires consideration of stored energy and gravity effects during stop conditions. The "loss of grip" hazard during e-stop is a well-known integration failure. The correct engineering control is a normally-closed pneumatic check valve or accumulator that maintains vacuum even when the solenoid loses power, preventing load release. The gripper must be designed so that loss of power results in a safe state (load held, not released). Option B is partially correct in concept but implemented incorrectly — the e-stop must remove hazardous energy, but the gripper circuit must be designed to fail-safe. Options C and D are not practical engineering solutions.',
    real_world_context:
      'This exact scenario has caused injuries in multiple UR cobot installations. Schmalz and Piab vacuum gripper manufacturers now specifically document e-stop behavior and provide check valve integration guides for cobot applications.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['end-effector-safety', 'e-stop', 'fail-safe', 'pneumatic-gripper', 'UR16e'],
  },

  // SF-19
  {
    question_text:
      'In a collaborative robot risk assessment, what does "quasi-static contact" refer to, and why does it typically have lower force/pressure limits than "transient contact" in ISO/TS 15066?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Quasi-static is a brief impact that bounces off; it has lower limits because the energy is concentrated',
      },
      {
        label: 'B',
        text: 'Quasi-static contact is when a body part is clamped or trapped between the robot and a fixed object, creating sustained pressure; it has lower limits than transient (impact-and-rebound) contact because the body cannot absorb or deflect the sustained force',
      },
      {
        label: 'C',
        text: 'Quasi-static and transient contact have identical limits in ISO/TS 15066',
      },
      {
        label: 'D',
        text: 'Quasi-static contact only applies to fixed industrial robots, not cobots',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO/TS 15066 distinguishes transient contact (impact where the body part can recoil/move away) from quasi-static contact (clamping where the body part is trapped between the robot and a fixed surface). Quasi-static limits are lower (approximately half the transient limits for most body regions) because: (1) the body cannot absorb or deflect the force, (2) the contact duration is sustained, and (3) tissue compression continues until equilibrium. This distinction is critical for cell design — eliminating clamping geometries or ensuring the robot cannot trap an operator against fixed structures significantly increases the allowable robot speed and force in PFL mode.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['iso-ts-15066', 'quasi-static', 'transient-contact', 'PFL'],
  },

  // SF-20
  {
    question_text:
      'A safety audit reveals that a robot cell has two e-stop buttons, but they are wired in parallel to a single safety relay. The auditor flags this as non-compliant. Why?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Parallel wiring means a short circuit in one e-stop cable could prevent the other e-stop from functioning, defeating the safety function; e-stops must be wired in series',
      },
      {
        label: 'B',
        text: 'Two e-stop buttons on a single relay exceeds the maximum load rating',
      },
      {
        label: 'C',
        text: 'Only one e-stop is permitted per robot cell',
      },
      {
        label: 'D',
        text: 'E-stop buttons must be wireless to prevent cable damage',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'Emergency stop circuits must be designed so that a single fault cannot prevent the safety function from operating. E-stop buttons are normally-closed (NC) devices wired in series: when any button is pressed, the circuit opens and the safety relay de-energizes. If e-stops are wired in parallel, a short circuit across one e-stop button (e.g., from cable damage) would maintain the circuit even when that button is pressed, defeating the safety function. This violates ISO 13850 (Emergency stop) clause 4.1.4 which requires that the emergency stop function shall not be impaired by a single fault. Series wiring ensures any open circuit (button press or cable break) triggers the stop.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['e-stop-wiring', 'iso-13850', 'safety-circuits', 'series-wiring'],
  },

  // SF-21
  {
    question_text:
      'When performing a safety validation of a robot cell, what is the difference between "verification" and "validation" in the context of ISO 10218-2?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'They are identical processes performed at different times',
      },
      {
        label: 'B',
        text: 'Verification confirms the system was built according to the design specification (did we build it right?), while validation confirms the system achieves the required safety performance in the actual operating environment (did we build the right thing?)',
      },
      {
        label: 'C',
        text: 'Verification is performed by the manufacturer; validation is performed by the end user only',
      },
      {
        label: 'D',
        text: 'Validation is optional if verification passes all test cases',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO 10218-2 clause 6 distinguishes verification (checking the implementation against the design specification through review, inspection, and testing) from validation (confirming the integrated system meets the safety requirements in the actual production environment under realistic operating conditions). Both are mandatory. A system can pass verification (built correctly per design) but fail validation (the design itself was inadequate for the real-world conditions). Common validation failures include: safety distances insufficient due to actual human approach speeds, floor conditions affecting robot stopping distance, or environmental factors (dust, vibration) degrading safety sensor performance.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['safety-validation', 'iso-10218', 'verification', 'commissioning'],
  },

  // SF-22
  {
    question_text:
      'A Boston Dynamics Spot robot is deployed for autonomous inspection in a petrochemical facility. Which safety consideration is MOST critical and unique to mobile robots operating in hazardous classified areas?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    scenario_context:
      'A petrochemical facility is deploying Boston Dynamics Spot with a gas detection payload for autonomous inspection of pipe racks in a Zone 1 (IEC 60079) hazardous area where flammable gas may be present during normal operation.',
    options: [
      {
        label: 'A',
        text: 'The robot must have explosion-proof (Ex-rated) certification for Zone 1 environments, ensuring all electrical components cannot ignite flammable atmospheres',
      },
      {
        label: 'B',
        text: 'The robot must have a top speed below 5 km/h in all areas',
      },
      {
        label: 'C',
        text: 'The robot must be painted in high-visibility yellow',
      },
      {
        label: 'D',
        text: 'The robot must be accompanied by a human operator at all times',
      },
    ],
    correct_answers: ['A'],
    explanation:
      'IEC 60079 (Explosive atmospheres) defines Zone 1 as an area where flammable gas is likely to occur during normal operation. Any electrical equipment in Zone 1 must be certified to Ex standards (explosion-proof, intrinsically safe, or other recognized protection method). A mobile robot contains multiple ignition sources: motors, batteries, computing hardware, cameras, and communication radios. Without proper Ex certification, a spark from any component could ignite the atmosphere. This is the most critical consideration because it affects life safety at facility scale. Speed, visibility, and supervision are secondary concerns compared to explosion risk.',
    real_world_context:
      'Boston Dynamics Spot is deployed in petrochemical facilities by companies like BP and Woodside, but standard Spot units are NOT Ex-rated. Specialized integrators (e.g., ExRobotics) build Ex-certified mobile platforms for Zone 1. Spot deployments in refineries are typically limited to non-hazardous or Zone 2 areas unless modified.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['hazardous-areas', 'IEC-60079', 'Spot', 'petrochemical', 'explosion-proof'],
  },

  // SF-23
  {
    question_text:
      'During a safety function test, a safety-rated speed monitoring function on a KUKA LBR iiwa fails to trigger a stop when the TCP speed exceeds the configured 250 mm/s limit by 15%. The integrator argues this is acceptable because the biomechanical force limits are still not exceeded. Is this argument valid?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Yes, if the force limits are met, the speed limit is a secondary concern',
      },
      {
        label: 'B',
        text: 'No — a safety-rated function that fails to perform within its specified parameters is a safety system failure regardless of the downstream effect; the system must be taken out of service and repaired',
      },
      {
        label: 'C',
        text: 'Yes, a 15% overshoot is within normal tolerance for safety-rated monitoring',
      },
      {
        label: 'D',
        text: 'No, but only because 250 mm/s is a legally mandated limit that cannot be exceeded under any circumstances',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'A safety-rated function must perform within its specified parameters. If the safety-rated speed monitoring is configured for 250 mm/s and fails to trigger at 287.5 mm/s (115%), the safety function has failed. This is independent of whether the biomechanical limits are exceeded — the speed monitoring function is part of the safety architecture relied upon in the risk assessment. A degraded safety function invalidates the entire safety case. The system must be stopped, the root cause identified (sensor drift, controller fault, configuration error), and the function must be repaired and re-validated before resuming operation. Note that 250 mm/s in T1 mode is a standard requirement, but configurable speed limits in automatic mode can be set to other values — the point is that the configured limit must be enforced.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['safety-rated-speed', 'KUKA', 'LBR-iiwa', 'safety-function-failure'],
  },

  // SF-24
  {
    question_text:
      'What is the purpose of the "safety configuration checksum" on modern collaborative robots like the UR e-Series?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'To encrypt the robot program so it cannot be copied',
      },
      {
        label: 'B',
        text: 'To detect unauthorized or accidental modifications to safety parameters by providing a unique hash that changes if any safety setting is altered',
      },
      {
        label: 'C',
        text: 'To verify the robot firmware is genuine manufacturer software',
      },
      {
        label: 'D',
        text: 'To calculate the remaining battery life of the teach pendant',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'The safety configuration checksum (or safety hash) is a cryptographic hash of all safety-related parameters (joint limits, speed limits, force limits, safety I/O configuration, etc.). After the safety configuration is validated during commissioning, the checksum is recorded in the documentation. During subsequent audits or after any change, the current checksum is compared against the documented value. A mismatch indicates that safety parameters have been modified — intentionally or accidentally — and requires re-validation. This is a critical integrity control because unauthorized safety parameter changes (e.g., increasing force limits to improve cycle time) could create hazardous conditions.',
    real_world_context:
      'Universal Robots e-Series displays the safety checksum on the Safety tab of the installation screen. Best practice is to record this checksum in the risk assessment documentation and verify it during periodic safety audits.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['safety-checksum', 'UR-e-Series', 'safety-configuration', 'integrity'],
  },

  // SF-25
  {
    question_text:
      'A facility uses safety-rated area scanners to create two zones around a cobot cell: a warning zone and a safety zone. An operator walks through the warning zone at normal walking speed. What is the expected system behavior?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'SAFETY_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'The robot stops immediately when the warning zone is entered',
      },
      {
        label: 'B',
        text: 'The warning zone triggers a speed reduction of the robot (reduced speed mode) and activates visual/audible indicators; the safety zone triggers a safety-rated stop',
      },
      {
        label: 'C',
        text: 'Both zones trigger identical safety-rated stops',
      },
      {
        label: 'D',
        text: 'The warning zone locks the cell gate; the safety zone shuts off facility power',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Two-zone safety scanner configurations are a common implementation of speed and separation monitoring. The outer warning zone provides early detection, typically triggering the robot to reduce speed (e.g., from full production speed to a collaborative-safe speed) and activating warning indicators (lights, sounds). This allows production to continue at reduced throughput. The inner safety zone triggers a safety-rated stop when entered, as the operator is too close for the robot to maintain safe separation. This layered approach maximizes productivity while maintaining safety, as the robot only fully stops when necessary.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['area-scanner', 'two-zone-safety', 'speed-separation-monitoring'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 2: ROBOT_BASICS (20 questions)
  // ═══════════════════════════════════════════════════════════════

  // RB-1
  {
    question_text:
      'A warehouse operations manager is evaluating AMR solutions for goods-to-person picking. The facility has narrow aisles (1.2m wide), smooth concrete floors, and 24/7 operation. Which sensor combination is MOST critical for reliable AMR navigation in this environment?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: '2D LIDAR for navigation + ultrasonic sensors for obstacle detection' },
      { label: 'B', text: '2D LIDAR for localization/navigation + 3D cameras or 3D LIDAR for obstacle detection at multiple heights + wheel encoders for odometry' },
      { label: 'C', text: 'GPS for navigation + bumper sensors for collision detection' },
      { label: 'D', text: 'Magnetic tape following + infrared proximity sensors' },
    ],
    correct_answers: ['B'],
    explanation:
      'In narrow-aisle warehouse environments, reliable navigation requires: (1) 2D LIDAR for SLAM-based localization and navigation — it provides precise distance measurements to walls and racking for map-based positioning. (2) 3D perception (cameras or 3D LIDAR) for obstacle detection at multiple heights — critical because 2D LIDAR at a single plane can miss objects above or below the scan plane (e.g., forklift tines, overhanging loads). (3) Wheel encoders provide dead-reckoning odometry between LIDAR scans. GPS (C) does not work indoors. Magnetic tape (D) is inflexible and high-maintenance. Option A lacks multi-height perception, which is a safety risk in narrow aisles.',
    real_world_context:
      'Locus Robotics and 6 River Systems AMRs use this multi-sensor approach. A major 3PL reported a 40% reduction in AMR stoppages after adding 3D cameras to complement 2D LIDAR in narrow-aisle configurations.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['AMR', 'LIDAR', 'navigation', 'warehouse-sensors', 'narrow-aisle'],
  },

  // RB-2
  {
    question_text:
      'What is the practical significance of a 6-DOF (degrees of freedom) articulated robot arm versus a 4-DOF SCARA robot when selecting a platform for an assembly task?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: '6-DOF arms are faster than 4-DOF SCARAs in all applications',
      },
      {
        label: 'B',
        text: 'A 6-DOF arm can orient the end-effector in any direction in 3D space, enabling complex assembly angles, while a 4-DOF SCARA is limited to vertical insertion and horizontal movement — making it ideal for pick-and-place but insufficient for tasks requiring varied approach angles',
      },
      {
        label: 'C',
        text: '4-DOF SCARAs have higher payload capacity than 6-DOF arms of the same size',
      },
      {
        label: 'D',
        text: 'The only difference is the number of motors, which affects power consumption',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Degrees of freedom directly determine the workspace dexterity of a robot. A 6-DOF articulated arm can position AND orient its end-effector arbitrarily in 3D space (3 DOF for position + 3 DOF for orientation), enabling it to approach a workpiece from any angle. A 4-DOF SCARA (Selective Compliance Articulated Robot Arm) provides X-Y positioning, Z-axis vertical motion, and rotation about the Z-axis, but cannot tilt the end-effector. This makes SCARAs excellent for tasks requiring fast, precise vertical insertion (e.g., component placement on PCBs) but unsuitable for tasks requiring angled approach (e.g., inserting a connector at 45 degrees, tightening a screw on a vertical surface). Choosing the wrong kinematic configuration for the task is a common and costly deployment error.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['DOF', 'SCARA', 'articulated-arm', 'kinematics', 'robot-selection'],
  },

  // RB-3
  {
    question_text:
      'A cobot specification lists "repeatability: +/- 0.03 mm" and "accuracy: +/- 0.1 mm". An engineer plans to use the cobot for a task requiring placement within 0.05 mm of an absolute position defined in the CAD model. Will the cobot meet this requirement without calibration?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Yes, because the repeatability of 0.03 mm is well within the 0.05 mm requirement',
      },
      {
        label: 'B',
        text: 'No — the task requires 0.05 mm absolute positional accuracy, but the robot accuracy is 0.1 mm; repeatability only measures how consistently the robot returns to the same taught point, not how closely that point matches the commanded CAD coordinate',
      },
      {
        label: 'C',
        text: 'Yes, accuracy and repeatability are the same measurement expressed differently',
      },
      {
        label: 'D',
        text: 'No, because cobots cannot achieve sub-millimeter precision under any circumstances',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Repeatability and accuracy are fundamentally different per ISO 9283. Repeatability (0.03 mm) measures how precisely the robot returns to the same taught position over multiple cycles — it is the spread of the cluster. Accuracy (0.1 mm) measures how close the robot actual position is to the commanded (absolute) position — it is the offset between the mean cluster position and the target coordinate. For a task requiring 0.05 mm absolute positioning (matching CAD coordinates), the 0.1 mm accuracy specification is insufficient. The robot could be taught using vision-guided calibration or external measurement to compensate, but out-of-the-box, the absolute accuracy will not meet the requirement. This is a critical distinction that causes deployment failures when engineers confuse the two specifications.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['repeatability', 'accuracy', 'iso-9283', 'robot-specifications'],
  },

  // RB-4
  {
    question_text:
      'An AMR fleet uses differential drive (two powered wheels + caster). A facilities engineer proposes replacing the fleet with mecanum-wheel AMRs for a new facility with narrow cross-aisles. What is the primary operational advantage of mecanum wheels in this context?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Mecanum wheels provide higher top speed on smooth floors' },
      {
        label: 'B',
        text: 'Mecanum wheels enable omnidirectional movement (including lateral strafing) without rotating the robot body, allowing navigation through narrow cross-aisles and tight intersections without three-point turns',
      },
      { label: 'C', text: 'Mecanum wheels have lower maintenance requirements than standard wheels' },
      { label: 'D', text: 'Mecanum wheels provide better traction on wet or uneven floors' },
    ],
    correct_answers: ['B'],
    explanation:
      'Mecanum wheels use angled rollers (typically 45 degrees) on each wheel that, through independent speed and direction control of four wheels, allow the platform to move in any direction: forward, backward, sideways (strafing), and diagonal, as well as rotating in place. In narrow cross-aisles, a differential-drive AMR must perform a rotation to change direction (requiring more space than the aisle width may allow), while a mecanum-wheel AMR can strafe laterally into a cross-aisle without rotating. The tradeoff is that mecanum wheels have lower payload efficiency (some wheel force is always at an angle to the travel direction), higher roller maintenance, and reduced performance on rough or soft surfaces where the rollers can slip.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['mecanum-wheels', 'AMR', 'drive-types', 'omnidirectional'],
  },

  // RB-5
  {
    question_text:
      'A UR5e cobot has a rated payload of 5 kg. The proposed end-effector (gripper) weighs 2 kg and the heaviest workpiece is 4 kg. The engineer says the total is 6 kg which exceeds payload. The project manager argues that the gripper weight does not count because it is mounted directly to the flange. Who is correct?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'The project manager — manufacturer payload ratings exclude the weight of directly mounted tooling',
      },
      {
        label: 'B',
        text: 'The engineer — the rated payload includes everything attached to the tool flange (end-effector + workpiece + any mounting hardware), so the 6 kg total exceeds the 5 kg rating',
      },
      {
        label: 'C',
        text: 'Neither — payload is only measured at maximum reach, so at shorter reaches the limit is higher',
      },
      {
        label: 'D',
        text: 'The project manager — as long as the center of gravity is close to the flange, total weight is irrelevant',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'The rated payload of a robot arm includes ALL mass attached to the tool output flange: the end-effector, any adapters/mounting plates, cabling routed along the arm, and the workpiece. The UR5e 5 kg payload means the total of gripper (2 kg) + workpiece (4 kg) = 6 kg exceeds the rating by 1 kg. Operating over the payload rating causes: (1) safety system faults or degraded stopping performance, (2) increased joint wear and reduced lifespan, (3) inaccurate force/torque sensing in collaborative mode, (4) potential structural failure over time. While some robots have payload/reach tradeoff curves, the UR5e specification is a maximum at any reach. The correct solution is to select a lighter gripper, reduce workpiece mass, or upgrade to a UR10e (10 kg payload).',
    real_world_context:
      'This miscalculation is one of the most common cobot deployment failures. UR provides a payload calculator tool that accounts for the center of gravity offset, which further reduces effective payload when the CoG is far from the flange center.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['payload', 'UR5e', 'end-effector', 'robot-specifications'],
  },

  // RB-6
  {
    question_text:
      'A robot specification states "cycle time: 8 seconds" for a specific pick-and-place operation. The production requirement is 400 units per hour. Will this robot meet the throughput requirement, and what is the critical factor missing from this analysis?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: '8 seconds/cycle = 450 cycles/hour, which exceeds 400 units/hour, so the requirement is met',
      },
      {
        label: 'B',
        text: 'The theoretical 450 cycles/hour does not account for real-world utilization losses (infeeds, outfeeds, gripper changeover, error recovery, safety stops, maintenance); actual throughput is typically 75-85% of theoretical, yielding 340-380 units/hour which likely falls short',
      },
      {
        label: 'C',
        text: 'Cycle time specifications are always measured in laboratory conditions and are exactly half of real-world cycle time',
      },
      {
        label: 'D',
        text: 'The robot cannot maintain 8-second cycles continuously because it needs cooling breaks every 15 minutes',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'While 3600 seconds / 8 seconds = 450 theoretical cycles per hour, real-world throughput is always lower due to Overall Equipment Effectiveness (OEE) factors: (1) Availability — safety stops, error recovery, maintenance, changeovers reduce uptime. (2) Performance — infeed/outfeed delays, sensor verification pauses, speed reductions in collaborative zones. (3) Quality — rejected picks, re-grabs, misalignment recovery. A realistic OEE for a well-tuned robot cell is 75-85%, yielding 338-383 actual units per hour. To reliably meet 400 units/hour, the theoretical capacity should be approximately 470-530 cycles/hour, requiring a cycle time of 6.8-7.7 seconds. This capacity planning error is one of the most common reasons robot deployments miss ROI targets.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['cycle-time', 'throughput', 'OEE', 'capacity-planning'],
  },

  // RB-7
  {
    question_text:
      'Which statement correctly describes the relationship between a robot motor encoder and the joint torque sensor found in force-sensitive cobots like the KUKA LBR iiwa?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'They provide the same information and are redundant systems' },
      {
        label: 'B',
        text: 'The motor encoder measures the angular position/velocity of the joint via the motor shaft, while the joint torque sensor measures the actual force/torque at the joint output; together they enable impedance control and external collision detection',
      },
      { label: 'C', text: 'The encoder measures temperature while the torque sensor measures position' },
      { label: 'D', text: 'Torque sensors are only used during the calibration process and are disabled during operation' },
    ],
    correct_answers: ['B'],
    explanation:
      'Motor encoders (typically optical or magnetic) measure the rotational position and velocity of the motor shaft with high precision, providing the primary feedback for position control. Joint torque sensors (strain gauge-based) measure the actual torque at the joint output, after the gearbox. The combination enables: (1) External force/torque estimation — the difference between commanded motor torque and measured joint torque indicates external forces (collisions, contact with objects). (2) Impedance/compliance control — the robot can behave like a spring-damper system, essential for collaborative interaction. (3) Gravity compensation — accurate torque measurement enables smooth hand-guiding. The KUKA LBR iiwa has torque sensors in all 7 joints, making it one of the most sensitive cobots for force-controlled applications.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['encoder', 'torque-sensor', 'KUKA-iiwa', 'impedance-control'],
  },

  // RB-8
  {
    question_text:
      'A logistics company is evaluating two AMR battery technologies for a 24/7 warehouse operation: lithium iron phosphate (LiFePO4) and lithium-ion NMC (nickel manganese cobalt). Select ALL factors that favor LiFePO4 for this application. (Select 3)',
    question_type: 'multi_select',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'LiFePO4 has significantly higher cycle life (3000-5000 cycles vs. 1000-2000 for NMC), reducing battery replacement frequency in 24/7 operation' },
      { label: 'B', text: 'LiFePO4 has higher energy density, allowing smaller and lighter battery packs' },
      { label: 'C', text: 'LiFePO4 has superior thermal stability and lower fire risk, critical in a warehouse with flammable goods' },
      { label: 'D', text: 'LiFePO4 tolerates opportunity charging (partial charges throughout the day) better than NMC without significant degradation' },
      { label: 'E', text: 'LiFePO4 charges 5x faster than NMC chemistry' },
    ],
    correct_answers: ['A', 'C', 'D'],
    explanation:
      'For 24/7 AMR warehouse operations, LiFePO4 advantages are: (A) Dramatically higher cycle life — 3000-5000+ full cycles vs. 1000-2000 for NMC, meaning batteries last 3-5 years instead of 1-2 years in heavy-use scenarios, significantly reducing total cost of ownership. (C) Superior thermal stability — LiFePO4 does not undergo thermal runaway as readily as NMC, a critical safety factor in warehouses storing flammable or temperature-sensitive goods. (D) LiFePO4 has a flatter discharge curve and is more tolerant of partial charge/discharge cycling (opportunity charging), which is the typical AMR charging pattern (dock for 10-15 minutes between missions). Option B is false — NMC has higher energy density (150-220 Wh/kg vs. 90-120 Wh/kg for LiFePO4). Option E is false — charge rates are comparable; LiFePO4 may accept higher C-rates safely but not 5x.',
    real_world_context:
      'Locus Robotics and Fetch Robotics AMRs use LiFePO4 batteries specifically for the cycle life and opportunity-charging advantages in 24/7 warehousing. The lower energy density is acceptable because AMRs have space for larger battery packs.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['battery-technology', 'LiFePO4', 'AMR', 'warehouse-operations'],
  },

  // RB-9
  {
    question_text:
      'What is the primary function of a harmonic drive (strain wave gear) in a cobot joint, and why is it preferred over standard spur gear reducers?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'To increase motor speed for faster joint movement',
      },
      {
        label: 'B',
        text: 'To provide high gear reduction ratios (50:1 to 160:1) in a compact, lightweight, zero-backlash package, enabling precise positioning and smooth motion essential for collaborative applications',
      },
      {
        label: 'C',
        text: 'To convert rotary motor motion into linear actuator motion',
      },
      {
        label: 'D',
        text: 'To isolate motor vibrations from the robot structure',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Harmonic drives (invented by Harmonic Drive LLC, also manufactured by Nidec) use a wave generator, flex spline, and circular spline to achieve very high gear reduction ratios in a single stage. Key advantages for cobot applications: (1) Zero backlash — the flex spline engagement has no play, enabling precise and repeatable positioning. (2) Compact and lightweight — a single harmonic drive replaces multi-stage gear trains. (3) High reduction ratio — typical 100:1 ratios allow small, low-torque motors to produce high joint torques. (4) Smooth motion — important for collaborative applications where jerky motion is a safety concern. The tradeoff is higher cost, lower efficiency (~80-85%), and susceptibility to shock loads. Nearly all major cobots (UR, FANUC CRX, ABB GoFa, KUKA iiwa) use harmonic drives in multiple joints.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['harmonic-drive', 'actuators', 'cobot-joints', 'gear-reduction'],
  },

  // RB-10
  {
    question_text:
      'A manufacturing engineer must choose between a vision-guided robot using a 2D camera and one using a structured-light 3D camera for bin-picking randomly oriented parts. Which statement best describes the technical limitation that makes 2D insufficient?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: '2D cameras cannot detect color differences between parts' },
      {
        label: 'B',
        text: 'A 2D camera provides no depth information, making it unable to determine the height, orientation, and stacking of randomly piled parts; the robot cannot calculate a safe approach vector or grasp height without 3D point cloud data',
      },
      { label: 'C', text: '2D cameras are too slow for real-time robot guidance' },
      { label: 'D', text: '2D cameras require more expensive lenses than 3D cameras' },
    ],
    correct_answers: ['B'],
    explanation:
      'Random bin picking requires determining the 6-DOF pose (position + orientation) of each part in the bin. A 2D camera captures a flat projection of the scene, losing all depth information. Without depth, the system cannot: (1) Determine which part is on top of the pile (Z-height ordering). (2) Calculate the 3D orientation of parts for grasp planning. (3) Determine safe approach vectors to avoid collision with the bin walls or other parts. Structured-light 3D cameras (e.g., Photoneo, Zivid) project a known pattern onto the scene and calculate depth from the pattern deformation, producing a point cloud that enables full 3D pose estimation. This is why bin-picking applications almost universally require 3D vision.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['3D-vision', 'bin-picking', 'structured-light', 'robot-vision'],
  },

  // RB-11
  {
    question_text:
      'A humanoid robot uses series elastic actuators (SEAs) in its leg joints instead of rigid actuators. What operational advantage do SEAs provide for legged locomotion?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'SEAs provide faster joint acceleration than rigid actuators' },
      {
        label: 'B',
        text: 'SEAs include a compliant element (spring) between the motor and the joint output, which absorbs impact energy during foot strike, enables accurate force control through spring deflection measurement, and stores/releases energy for more efficient locomotion',
      },
      { label: 'C', text: 'SEAs reduce the total weight of the robot by eliminating the need for gearboxes' },
      { label: 'D', text: 'SEAs prevent the robot from falling by locking the joints when imbalance is detected' },
    ],
    correct_answers: ['B'],
    explanation:
      'Series Elastic Actuators place a calibrated spring element between the motor/gearbox output and the joint load. For legged robots, this provides: (1) Impact absorption — the spring compresses during foot strike, protecting the gearbox and structure from shock loads that would damage rigid actuators. (2) Force control — by measuring spring deflection (with a known spring constant), the actuator provides accurate joint torque measurement without a separate torque sensor (F = k*x). (3) Energy storage — during locomotion, the spring stores energy during deceleration and releases it during acceleration, similar to biological tendons, improving energy efficiency. (4) Inherent compliance — SEAs make the robot safer during human interaction because the joint "gives" on contact rather than rigidly resisting. Boston Dynamics Spot and many research humanoids use SEA-based or quasi-direct-drive actuators for these reasons.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['SEA', 'actuators', 'legged-locomotion', 'compliance', 'humanoid'],
  },

  // RB-12
  {
    question_text:
      'A 7-DOF cobot arm (like the KUKA LBR iiwa) has one more degree of freedom than the minimum 6 required for arbitrary positioning and orientation in 3D space. What practical advantage does this redundant DOF provide?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The 7th DOF allows the robot to lift 40% more payload' },
      {
        label: 'B',
        text: 'The redundant DOF allows the robot to maintain the same TCP pose while reconfiguring its elbow position, enabling obstacle avoidance, singularity avoidance, and optimization of joint configurations for ergonomics or cycle time',
      },
      { label: 'C', text: 'The 7th DOF is a spare that activates only when another joint fails' },
      { label: 'D', text: 'The 7th DOF provides rotation of the tool flange, which 6-DOF robots cannot do' },
    ],
    correct_answers: ['B'],
    explanation:
      'Kinematic redundancy (more DOF than the minimum 6 for the task) gives the robot infinite joint configurations (solutions) for any single TCP pose. The "extra" DOF typically manifests as elbow swing — the ability to move the elbow while keeping the tool in the same position and orientation. This enables: (1) Obstacle avoidance — swing the elbow around obstacles in the workspace. (2) Singularity avoidance — reconfigure joints to avoid singular configurations where the robot loses a DOF. (3) Joint limit avoidance — redistribute motion across joints to avoid hitting individual joint limits. (4) Ergonomic/force optimization — choose the configuration that minimizes joint torques or maximizes stiffness in the task direction. The KUKA LBR iiwa and Franka Emika Panda both leverage this for collaborative assembly tasks in confined spaces.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['redundant-DOF', 'KUKA-iiwa', 'kinematics', 'singularity-avoidance'],
  },

  // RB-13
  {
    question_text:
      'An industrial robot specification lists "IP67" protection rating. A facilities engineer wants to deploy it in a food processing area that requires daily high-pressure washdown. Is IP67 sufficient?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Yes, IP67 is the highest possible rating and covers all conditions' },
      {
        label: 'B',
        text: 'No — IP67 protects against temporary immersion in water (up to 1m for 30 min), but high-pressure washdown requires IP69K which is rated for close-range high-pressure, high-temperature water jets' },
      { label: 'C', text: 'Yes, the "7" in IP67 specifically means high-pressure washdown resistant' },
      { label: 'D', text: 'IP ratings do not apply to robots, only to electrical enclosures' },
    ],
    correct_answers: ['B'],
    explanation:
      'The IP (Ingress Protection) rating system (IEC 60529) has two digits: first digit = dust protection (6 = dust-tight), second digit = water protection (7 = temporary immersion). IP67 protects against dust and brief submersion but NOT high-pressure water jets. IP69K (DIN 40050 Part 9, now IEC 60529) specifically rates equipment for high-pressure (80-100 bar), high-temperature (80C) water at close range — exactly what food processing washdown requires. Robots for food/pharma environments (e.g., ABB IRB 1200 Washdown, Staubli TX2-60 HE) are available in IP69K-rated variants. Deploying an IP67 robot in a washdown environment would lead to water ingress, electrical faults, and contamination failures.',
    real_world_context:
      'Staubli and ABB offer dedicated hygiene/washdown robot variants. A US meat processor experienced $200K in losses when IP65-rated robots failed within 3 months of washdown exposure.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['IP-rating', 'washdown', 'food-processing', 'IP69K'],
  },

  // RB-14
  {
    question_text:
      'Which statement correctly describes the difference between SLAM (Simultaneous Localization and Mapping) and pre-mapped navigation for AMRs?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'SLAM requires GPS while pre-mapped navigation uses LIDAR' },
      {
        label: 'B',
        text: 'SLAM continuously builds and updates the environment map while simultaneously determining the robot position within it, enabling operation in changing environments; pre-mapped navigation relies on a static map created during a setup drive and is less adaptive to layout changes',
      },
      { label: 'C', text: 'Pre-mapped navigation is more accurate than SLAM in all conditions' },
      { label: 'D', text: 'SLAM only works outdoors while pre-mapped navigation is for indoor use' },
    ],
    correct_answers: ['B'],
    explanation:
      'SLAM (Simultaneous Localization and Mapping) algorithms process real-time sensor data to build a map of the environment and localize the robot within it simultaneously. This is computationally intensive but enables: (1) Operation in previously unknown environments. (2) Adaptation to layout changes (moved shelves, new obstacles). (3) Loop closure — recognizing previously visited areas to correct accumulated drift. Pre-mapped navigation uses a map created during a commissioning drive (typically one-time LIDAR scan) and localizes against this fixed reference. It is less computationally intensive and can be more precise in stable environments, but degrades when the environment changes significantly. Most modern AMR platforms (Locus, 6RS, Fetch) use a hybrid: SLAM-based mapping with particle filter localization against a reference map, plus real-time obstacle detection.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['SLAM', 'AMR-navigation', 'localization', 'mapping'],
  },

  // RB-15
  {
    question_text:
      'A robot integrator proposes using a single-beam time-of-flight (ToF) sensor for pallet detection on an AMR. A senior engineer rejects this in favor of a 3D camera system. Why is the 3D system necessary?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'ToF sensors are too expensive for commercial AMR applications' },
      {
        label: 'B',
        text: 'A single-beam ToF sensor provides only a single distance measurement point, which cannot determine pallet orientation, pocket position, or detect damage/obstructions on the pallet face; 3D imaging provides a point cloud that enables full geometric analysis for safe, accurate fork insertion',
      },
      { label: 'C', text: 'ToF sensors do not work on wooden pallets' },
      { label: 'D', text: '3D cameras are required by OSHA regulations for all pallet handling' },
    ],
    correct_answers: ['B'],
    explanation:
      'Pallet detection for automated forking requires determining: (1) Pallet position (X, Y, Z) relative to the AMR. (2) Pallet orientation (yaw angle) for fork alignment. (3) Pocket opening positions for accurate fork entry. (4) Obstruction detection — detecting damaged boards, shrink wrap covering pockets, or foreign objects. A single-beam ToF sensor provides one distance measurement at one point — it can detect "something is there" but not the geometric detail needed for safe forking. A 3D camera (structured light, stereo, or ToF array) produces a point cloud of the pallet face, enabling full pose estimation and pocket localization. This is why autonomous pallet movers (e.g., OTTO Motors, Vecna, MiR with top modules) use 3D vision for pallet engagement.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['ToF-sensor', '3D-camera', 'pallet-detection', 'AMR', 'forking'],
  },

  // RB-16
  {
    question_text:
      'An engineer is selecting servo motors for a new 6-axis robot design. The wrist joints (4, 5, 6) require high speed and low torque, while the base joints (1, 2, 3) require high torque and lower speed. Which motor sizing approach is correct?',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Use the same motor model for all joints to simplify spare parts inventory' },
      { label: 'B', text: 'Base joints need larger frame-size motors with higher continuous torque ratings to handle the inertia of the entire arm plus payload' },
      { label: 'C', text: 'Wrist joints can use smaller frame-size motors because they only move the end-effector and final links, requiring less torque' },
      { label: 'D', text: 'Motor selection must account for both peak torque (acceleration/deceleration) and RMS continuous torque over the entire duty cycle, not just static holding torque' },
      { label: 'E', text: 'Wrist joints need the largest motors because they move the fastest' },
    ],
    correct_answers: ['B', 'C', 'D'],
    explanation:
      'Robot servo motor sizing follows the principle that each joint must handle the static and dynamic loads specific to its position in the kinematic chain: (B) Base joints (J1, J2, J3) support the weight and inertia of the entire arm structure plus payload — they need the highest torque. J2 (shoulder) typically has the highest torque requirement because it supports the arm against gravity at full extension. (C) Wrist joints (J4, J5, J6) only move the relatively light wrist mechanism and end-effector, requiring lower torque but higher speed for tool orientation changes. (D) Motor sizing must consider the full duty cycle: peak torque for acceleration/deceleration, continuous (RMS) torque for thermal limits, and the torque-speed curve of the motor-drive combination. Option A is a logistics convenience that results in oversized (expensive, heavy) wrist motors or undersized (dangerous) base motors. Option E is incorrect — speed alone does not determine motor size; torque is the primary sizing factor.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['servo-motors', 'motor-sizing', 'joint-design', 'torque-requirements'],
  },

  // RB-17
  {
    question_text:
      'An AMR fleet operates in a multi-level facility. The fleet manager software assigns tasks, routes, and manages charging. What is the primary purpose of the "traffic management" function within the fleet manager?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'To track the total miles traveled by each AMR for maintenance scheduling' },
      {
        label: 'B',
        text: 'To coordinate movement of multiple AMRs to prevent deadlocks, optimize intersection throughput, enforce one-way zones, and manage priority-based yielding to maximize fleet efficiency and prevent congestion',
      },
      { label: 'C', text: 'To monitor network traffic between AMRs and the Wi-Fi access points' },
      { label: 'D', text: 'To generate reports on warehouse order fulfillment rates' },
    ],
    correct_answers: ['B'],
    explanation:
      'Fleet traffic management is the central coordination layer that prevents multi-robot operational failures: (1) Deadlock prevention — detecting and resolving situations where AMRs block each other (e.g., two AMRs approaching from opposite directions in a single-width aisle). (2) Intersection management — controlling which AMR proceeds through a shared intersection to prevent collision and maximize throughput. (3) Zone control — enforcing one-way travel, speed limits, and maximum occupancy in congested areas. (4) Priority management — allowing high-priority tasks (urgent orders, low-battery AMRs heading to chargers) to preempt lower-priority traffic. Without effective traffic management, fleet throughput degrades non-linearly as fleet size increases — a 50-robot fleet without traffic management can actually achieve less throughput than a 20-robot fleet.',
    real_world_context:
      'Locus Robotics fleet sizes of 50-100+ AMRs in a single facility require sophisticated traffic management. DHL reported that optimizing traffic management algorithms improved fleet throughput by 30% without adding any additional AMRs.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['fleet-management', 'traffic-management', 'AMR', 'deadlock-prevention'],
  },

  // RB-18
  {
    question_text:
      'What is the fundamental difference between a "cobot" (collaborative robot) and a standard industrial robot that has been retrofitted with external safety sensors?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'There is no difference — any robot with safety sensors is a cobot' },
      {
        label: 'B',
        text: 'A cobot is designed with inherent safety features (force/torque sensing, compliant joints, rounded surfaces, limited energy) integrated into its architecture, while a retrofitted industrial robot relies entirely on external sensors to detect humans and stop — the industrial robot itself has no inherent ability to limit contact forces',
      },
      { label: 'C', text: 'Cobots are smaller and weaker than industrial robots by definition' },
      { label: 'D', text: 'Cobots can only operate in hand-guiding mode, not autonomous mode' },
    ],
    correct_answers: ['B'],
    explanation:
      'The distinction is architectural. Purpose-built cobots (UR e-Series, FANUC CRX, KUKA LBR iiwa, ABB GoFa) integrate safety into the robot itself: (1) Joint torque/current sensing for collision detection. (2) Backdrivable or compliant joints that absorb contact energy. (3) Rounded, pinch-free external geometry. (4) Safety-rated power and force limiting in the controller. (5) Limited maximum force/speed even in fault conditions. A standard industrial robot (FANUC M-20iD, ABB IRB 6700) retrofitted with area scanners can detect and stop for humans, but if a collision occurs before the stop, the rigid, high-inertia robot can exert forces far exceeding biomechanical limits. It uses speed and separation monitoring or safety-rated monitored stop — valid collaborative modes — but cannot use power and force limiting (PFL) mode because the robot itself lacks the inherent force limitation.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['cobot-definition', 'inherent-safety', 'collaborative-modes'],
  },

  // RB-19
  {
    question_text:
      'A compute engineer must specify the edge computing hardware for an AMR that runs real-time SLAM, 3D obstacle detection, and path planning simultaneously. Which processing architecture is most appropriate?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'A standard quad-core x86 CPU with 8 GB RAM is sufficient for all tasks' },
      {
        label: 'B',
        text: 'A heterogeneous compute platform combining a multi-core CPU (for SLAM and planning) with a GPU or neural processing unit (for 3D point cloud processing and deep learning-based perception), with dedicated real-time I/O for motor control',
      },
      { label: 'C', text: 'All processing should be offloaded to a cloud server for maximum performance' },
      { label: 'D', text: 'An 8-bit microcontroller with optimized firmware can handle all three tasks' },
    ],
    correct_answers: ['B'],
    explanation:
      'Modern AMR compute requirements demand heterogeneous processing: (1) Multi-core CPU handles SLAM (iterative optimization), path planning (graph search algorithms), fleet communication, and system management. (2) GPU/NPU accelerates 3D point cloud processing, deep learning inference (object detection, semantic segmentation), and parallel sensor data processing — these are massively parallel workloads that CPUs handle poorly. (3) Real-time I/O (often a dedicated MCU or FPGA) handles motor control loops at 1-10 kHz, safety scanner communication, and encoder reading with deterministic timing that general-purpose OS cannot guarantee. Common platforms include NVIDIA Jetson (AGX Orin for high-end, Orin NX for mid-range) paired with a safety-rated MCU. Cloud offload (C) introduces latency and connectivity dependency that is unacceptable for real-time navigation. An 8-bit MCU (D) lacks the computational capability by orders of magnitude.',
    real_world_context:
      'Fetch Robotics AMRs use NVIDIA Jetson-class compute with a separate real-time safety controller. The Jetson AGX Orin provides 275 TOPS of AI performance in a 60W power envelope suitable for mobile platforms.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['edge-computing', 'AMR-hardware', 'GPU', 'NVIDIA-Jetson', 'heterogeneous-compute'],
  },

  // RB-20
  {
    question_text:
      'A robot specification states "reach: 850 mm" and "payload: 5 kg at maximum reach". The application requires the robot to handle a 5 kg part at a distance of 600 mm from the base. An engineer assumes the payload capacity is the same at 600 mm. Is this assumption correct?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_BASICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Yes — rated payload is constant regardless of reach distance' },
      {
        label: 'B',
        text: 'The assumption is conservative and likely correct for cobots — the rated payload is typically specified at maximum reach (worst-case moment arm), so at shorter reach the effective payload may be equal or slightly higher; however, the engineer should verify with the manufacturer payload-reach curve and account for end-effector weight and center of gravity offset',
      },
      { label: 'C', text: 'No — payload always decreases at shorter reach distances' },
      { label: 'D', text: 'Reach and payload are completely independent specifications' },
    ],
    correct_answers: ['B'],
    explanation:
      'For most collaborative and industrial robots, the rated payload is specified at maximum reach, which is the worst-case condition because the moment arm (torque on the base joints) is longest. At shorter reach distances, the moment arm is reduced, which generally means the joints can support equal or greater payload. However, this is not always a simple linear relationship because: (1) Different joint limits and configurations affect the load capacity at different reach distances. (2) The center of gravity of the payload + end-effector matters, not just the weight. (3) Dynamic loads during acceleration change the effective forces. The engineer should consult the manufacturer payload-reach diagram (all major manufacturers provide these) and use the payload calculator tool (e.g., UR provides an online tool). The assumption is conservative but should be verified.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['payload-reach', 'robot-specifications', 'moment-arm'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 3: DEPLOYMENT_FUNDAMENTALS (20 questions)
  // ═══════════════════════════════════════════════════════════════

  // DF-1
  {
    question_text:
      'During a site assessment for deploying 15 AMRs in a distribution center, the RF site survey reveals Wi-Fi coverage gaps in three aisle sections. What is the deployment risk if these gaps are not resolved?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'AMRs will move faster in those areas to compensate for signal loss' },
      {
        label: 'B',
        text: 'AMRs may lose communication with the fleet manager, causing missed task assignments, stale position updates (increasing collision risk), and inability to receive dynamic rerouting commands — leading to AMR stoppages, deadlocks, and throughput collapse in the affected zones',
      },
      { label: 'C', text: 'The AMRs will automatically switch to Bluetooth communication' },
      { label: 'D', text: 'Wi-Fi gaps only affect AMR software updates, not real-time operation' },
    ],
    correct_answers: ['B'],
    explanation:
      'AMR fleet operations depend on continuous Wi-Fi connectivity for: (1) Task assignment — the fleet manager dispatches missions via Wi-Fi. (2) Real-time position reporting — the fleet manager needs current AMR positions for traffic management. (3) Dynamic rerouting — responding to congestion, blocked paths, or priority changes. (4) Safety status — reporting obstacle detections and safety stops. When an AMR enters a coverage gap: it cannot receive new tasks, the fleet manager loses track of its position (creating phantom AMR issues), traffic management cannot coordinate with it (risking deadlocks when other AMRs try to pass), and if the AMR stops due to an obstacle, it cannot report this or receive a reroute. Even 2-3 second connectivity gaps at intersections can cause cascading stoppages in a dense fleet.',
    real_world_context:
      'A major 3PL deploying 60+ Locus AMRs reported that 3 Wi-Fi dead spots caused 15% fleet throughput reduction due to cascading stoppages. Resolving coverage gaps (adding 2 APs) immediately recovered the lost throughput.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['site-assessment', 'Wi-Fi', 'AMR-deployment', 'fleet-connectivity'],
  },

  // DF-2
  {
    question_text:
      'A cobot integrator is commissioning a UR10e for a machine tending application. The robot must pick parts from a CNC machine and place them on a conveyor. What is the correct commissioning sequence?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      {
        label: 'A',
        text: 'Write the full program, run at full speed, adjust if problems occur',
      },
      {
        label: 'B',
        text: '(1) Mechanical installation and alignment verification, (2) Safety configuration (joint limits, speed limits, force limits, safety I/O wiring), (3) TCP and payload calibration, (4) Teach waypoints at reduced speed, (5) Dry-run the program without parts at reduced speed, (6) Test with parts at reduced speed, (7) Gradually increase to production speed, (8) Safety validation and documentation',
      },
      {
        label: 'C',
        text: 'Install the robot, copy a program from a similar application, and start production immediately',
      },
      {
        label: 'D',
        text: 'Commission the robot without the end-effector attached, then add it after programming is complete',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Proper commissioning follows a systematic sequence that validates each layer before proceeding: (1) Mechanical — bolt torques, alignment, cable routing. (2) Safety — configure and verify all safety functions before any motion (this prevents injury during commissioning). (3) Calibration — accurate TCP definition is essential for correct waypoint teaching. (4-6) Progressive testing — teach at low speed, test without parts (verifying motion paths), then with parts (verifying grip, placement, CNC door interaction). (7) Speed ramp — gradually increase to production speed while monitoring cycle time, forces, and reliability. (8) Formal safety validation per ISO 10218-2. Option A risks damage to the robot, CNC, and injury. Option C ignores the unique geometry of each installation. Option D means all waypoints will be incorrect once the end-effector changes the TCP.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['commissioning', 'UR10e', 'machine-tending', 'deployment-sequence'],
  },

  // DF-3
  {
    question_text:
      'An AMR deployment plan specifies 20 charging stations for a fleet of 60 AMRs operating in two shifts. The AMRs have a 4-hour battery life and require 45 minutes for a full charge. During peak shift overlap, all 60 AMRs are active. Is the charging infrastructure adequate?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    scenario_context:
      'A 3PL warehouse operates two 10-hour shifts with 2-hour overlap. 60 AMRs are deployed, each with a 4-hour LiFePO4 battery (opportunity charging capable). Full charge takes 45 minutes. During the 2-hour overlap, all 60 AMRs are active. The facility has 20 auto-dock charging stations.',
    options: [
      {
        label: 'A',
        text: 'Yes — 20 stations for 60 AMRs is a standard 3:1 ratio recommended by most manufacturers',
      },
      {
        label: 'B',
        text: 'No — with 4-hour battery life, each AMR needs approximately 12-15 minutes of opportunity charging per hour to maintain charge; during peak operation with 60 AMRs, the demand is ~15 AMRs charging simultaneously, which 20 stations can handle, but with no margin for charger failures, queue congestion, or degraded batteries; a minimum of 25-30 stations is recommended for operational resilience',
      },
      {
        label: 'C',
        text: 'Yes — AMRs only need to charge once per day during the overnight gap',
      },
      {
        label: 'D',
        text: 'No — each AMR needs a dedicated charger, so 60 chargers are required',
      },
    ],
    correct_answers: ['B'],
    explanation:
      'Charging infrastructure planning requires queuing theory analysis: With a 4-hour battery life and opportunity charging, each AMR needs approximately 15 minutes of charging per operational hour (45-min charge / 4-hour cycle = ~19% of time on charger, but opportunity charging is more efficient, targeting ~12-15 min/hr). With 60 active AMRs, average demand is 12-15 AMRs simultaneously charging (60 * 0.2 to 0.25). While 20 chargers can technically serve this average, the peak demand follows a stochastic distribution with variance — during surge periods, 18-22 AMRs may need charging simultaneously. Add: (1) Charger failure (plan for 10-15% downtime), (2) Queue congestion (AMRs waiting waste productive time), (3) Battery degradation (older batteries need more frequent/longer charges). Industry best practice is a 2:1 to 2.5:1 AMR-to-charger ratio (24-30 chargers for 60 AMRs).',
    real_world_context:
      'A 6 River Systems deployment initially installed 15 chargers for 50 AMRs (3.3:1 ratio). Throughput dropped 20% after 6 months as batteries aged and charging frequency increased. Adding 10 more chargers (2:1 ratio) resolved the issue.',
    time_limit_seconds: 120,
    points: 2,
    tags: ['charging-infrastructure', 'fleet-sizing', 'AMR-deployment', 'queuing-theory'],
  },

  // DF-4
  {
    question_text:
      'When setting up a UR cobot, what does "TCP (Tool Center Point) calibration" accomplish, and what happens if it is skipped or done incorrectly?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'TCP calibration sets the Wi-Fi connection parameters for the robot controller' },
      {
        label: 'B',
        text: 'TCP calibration defines the exact position and orientation of the tool tip relative to the robot flange, enabling the robot to correctly calculate the tool position in space; if incorrect, all programmed positions will have a systematic offset and the robot will miss pick/place targets',
      },
      { label: 'C', text: 'TCP calibration adjusts the display contrast on the teach pendant' },
      { label: 'D', text: 'TCP calibration is an optional cosmetic setting that names the tool in the program' },
    ],
    correct_answers: ['B'],
    explanation:
      'The Tool Center Point (TCP) is the point on the end-effector that the robot controller uses as the reference for all position calculations. It is defined as an X, Y, Z offset and Rx, Ry, Rz rotation from the tool flange coordinate frame. Accurate TCP calibration is essential because: (1) All taught waypoints are recorded relative to the TCP — an incorrect TCP means every waypoint has a systematic position error. (2) Linear motion commands (moveL) move the TCP in a straight line — an incorrect TCP causes the tool tip to trace an arc instead. (3) Tool orientation commands rotate around the TCP — an incorrect TCP causes the tool to swing rather than rotate in place. (4) Safety space limitations reference the TCP position. Common calibration methods include the 4-point method (touch the same physical point from 4 different orientations to mathematically solve the TCP offset).',
    time_limit_seconds: 60,
    points: 1,
    tags: ['TCP-calibration', 'UR', 'commissioning', 'tool-setup'],
  },

  // DF-5
  {
    question_text:
      'A floor assessment for AMR deployment reveals that the warehouse floor has height variations of up to 15 mm over 3-meter spans and several expansion joint gaps of 20 mm width. Which deployment risks do these conditions create? (Select 3)',
    question_type: 'multi_select',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'LIDAR scan matching errors due to robot pitch/roll changes on uneven floor, causing localization drift' },
      { label: 'B', text: 'Increased wheel and drive motor wear from constant compensation for uneven surfaces' },
      { label: 'C', text: 'Payload instability — items on the AMR top surface may shift or fall due to sudden pitch changes at floor transitions and expansion joints' },
      { label: 'D', text: 'The AMR Wi-Fi signal strength will decrease on uneven floors' },
      { label: 'E', text: 'The AMR batteries will drain 50% faster on uneven floors' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'Floor conditions directly impact AMR performance: (A) LIDAR-based localization assumes the robot is on a flat plane. Floor height variations cause the robot to tilt, which changes the LIDAR scan plane and can cause scan matching failures (the LIDAR sees the environment from a different angle than expected), leading to localization drift or "lost" robots. (B) The drive system must continuously compensate for uneven surfaces, increasing motor current draw, wheel wear, and mechanical stress on the chassis and drivetrain. (C) Sudden elevation changes at expansion joints and floor transitions cause pitch jolts that can destabilize top-of-robot payloads. This is especially critical for AMRs carrying tall or stacked items. Wi-Fi (D) is unaffected by floor conditions. While uneven floors do increase energy consumption, the 50% figure (E) is grossly exaggerated — typical impact is 5-15%.',
    real_world_context:
      'AMR manufacturers typically specify maximum floor grade (2-3%), maximum gap width (10-15 mm), and maximum step height (5-10 mm). Sites exceeding these specs require floor remediation before deployment.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['floor-assessment', 'AMR-deployment', 'site-survey', 'localization'],
  },

  // DF-6
  {
    question_text:
      'A UR cobot program uses a "Force mode" to insert a peg into a hole with tight tolerances. The force mode is configured with a 20 N force limit in the Z-axis. During testing, the robot frequently fails to complete the insertion and times out. What is the most likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 3,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    scenario_context:
      'A UR5e is programmed for peg-in-hole insertion using Force mode. The peg diameter is 10.00 mm, the hole diameter is 10.05 mm (0.05 mm clearance). Force mode is set to apply 20 N downward force with compliance (free movement) in X and Y. The robot consistently approaches the hole correctly but fails to complete insertion, timing out after 5 seconds.',
    options: [
      { label: 'A', text: 'The 20 N force is too high and is crushing the workpiece' },
      {
        label: 'B',
        text: 'The X/Y compliance parameters are not properly tuned — the force mode compliance may not be sufficient to overcome the friction and alignment error during the initial chamfer engagement, preventing the peg from self-centering into the hole',
      },
      { label: 'C', text: 'The robot TCP speed is too high for force mode operation' },
      { label: 'D', text: 'The cobot does not support force-controlled insertion' },
    ],
    correct_answers: ['B'],
    explanation:
      'Peg-in-hole insertion with 0.05 mm clearance requires precise compliance tuning. Force mode applies a Z-axis force while allowing compliant (spring-like) motion in X and Y. If the compliance parameters are too stiff (high stiffness, low damping), the peg cannot self-center during initial contact with the hole chamfer — it pushes against the edge without sliding into the hole. If the compliance is too loose, the peg wanders and takes too long to find the hole. Successful tight-tolerance insertion requires: (1) Appropriate X/Y compliance stiffness (typically 0-500 N/m for tight fits). (2) Adequate Z-axis force to push through friction (20 N is reasonable). (3) Optional spiral search pattern to find the hole if the initial approach has more than ~0.02 mm positional error. The UR5e fully supports force mode — this is a parameter tuning issue, not a capability limitation.',
    real_world_context:
      'Force-controlled insertion is one of the most common UR cobot applications in electronics and automotive assembly. Tuning the compliance parameters is a skilled task that typically requires 2-4 hours of iterative testing for tight-tolerance applications.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['force-mode', 'peg-in-hole', 'compliance', 'UR5e', 'insertion'],
  },

  // DF-7
  {
    question_text:
      'During a pre-deployment site assessment, what is the purpose of measuring the ambient light conditions in the area where a vision-guided robot will operate?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'To ensure the operators can see the robot clearly for safety' },
      {
        label: 'B',
        text: 'To determine if the ambient lighting (intensity, direction, variability) will interfere with the vision system performance — direct sunlight, flickering fluorescents, or reflective surfaces can cause overexposure, shadows, or strobing artifacts that degrade part detection accuracy',
      },
      { label: 'C', text: 'To calculate the electricity cost of the lighting fixtures' },
      { label: 'D', text: 'To verify compliance with building occupancy codes' },
    ],
    correct_answers: ['B'],
    explanation:
      'Machine vision systems are highly sensitive to lighting conditions: (1) Direct sunlight through windows or skylights creates intense highlights and moving shadows as the sun position changes throughout the day, causing inconsistent part detection. (2) Fluorescent lights operating at 50/60 Hz can create strobing artifacts when the camera exposure time is not synchronized, causing brightness variation between frames. (3) Reflective surfaces (polished metal parts, glossy conveyors) create specular reflections that appear as bright spots, masking part features. (4) Low ambient light may require longer exposure times, introducing motion blur. The site assessment determines whether controlled lighting (dedicated LED panels, diffuse enclosures, light shields) is needed for reliable vision operation.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['site-assessment', 'machine-vision', 'lighting', 'deployment-planning'],
  },

  // DF-8
  {
    question_text:
      'A robot program on a FANUC CRX-10iA uses the following structure: approach point, pick point, lift point, travel point, place approach, place point, retract point. The cycle takes 12 seconds. The engineer wants to reduce cycle time. Which optimization is MOST effective while maintaining safety?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Delete the approach and retract points to reduce the number of waypoints' },
      {
        label: 'B',
        text: 'Use blending/zone parameters on non-critical waypoints (approach, lift, travel, place approach, retract) so the robot rounds corners instead of decelerating to a full stop at each point, while keeping pick and place points as fine (exact) positions',
      },
      { label: 'C', text: 'Increase the robot maximum speed beyond the safety-rated limit' },
      { label: 'D', text: 'Switch all motion commands from linear (moveL) to joint (moveJ) including pick and place operations' },
    ],
    correct_answers: ['B'],
    explanation:
      'Motion blending (called "zone" on FANUC, "blend radius" on UR, "zone data" on ABB) allows the robot to transition smoothly between waypoints without decelerating to zero velocity at each point. This eliminates the acceleration/deceleration time penalty at intermediate waypoints. The key principle: non-critical waypoints (approach, lift, travel, retract) can use blending because the exact position is not important — only the general path matters. Pick and place points must use fine (exact) positioning because the gripper must be precisely located for reliable grasp and placement. This optimization can reduce cycle time by 20-40% without changing robot speed. Deleting approach/retract points (A) risks collisions. Exceeding safety limits (C) is dangerous. Joint motion for pick/place (D) produces unpredictable curved paths near the workpiece.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['motion-blending', 'cycle-time', 'FANUC-CRX', 'programming-optimization'],
  },

  // DF-9
  {
    question_text:
      'An integrator is deploying a cobot cell that communicates with a PLC-controlled conveyor via digital I/O. The cobot program must wait for a "part present" signal before picking. During testing, the robot occasionally picks air (no part) despite the signal being active. What is the likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    scenario_context:
      'A UR10e picks parts from a conveyor that stops when a part reaches the pick position. A photoelectric sensor on the conveyor sends a "part present" signal to the robot digital input. The PLC stops the conveyor when the sensor triggers. During testing, the robot receives the "part present" signal and executes the pick, but approximately 5% of the time no part is present at the pick position.',
    options: [
      { label: 'A', text: 'The robot gripper is malfunctioning and failing to grasp the part' },
      {
        label: 'B',
        text: 'The signal timing is incorrect — the "part present" signal latches or persists after the part has passed the sensor (e.g., the conveyor overruns after the stop command, carrying the part past the pick position), so the robot receives a stale signal',
      },
      { label: 'C', text: 'The robot is moving too slowly to reach the part before it disappears' },
      { label: 'D', text: 'Digital I/O connections cannot be used for part detection' },
    ],
    correct_answers: ['B'],
    explanation:
      'This is a classic signal timing issue in conveyor-to-robot integration. The sequence should be: (1) Part reaches sensor position, (2) Sensor activates, (3) PLC commands conveyor stop, (4) Conveyor decelerates and stops with part at pick position, (5) Robot picks. The failure occurs because: the conveyor has mechanical inertia and does not stop instantly. If the conveyor overruns by 30-50 mm after the stop command (common with heavy loads or high-speed conveyors), the part moves past the pick position. But the "part present" signal may remain latched in the PLC or the sensor output may still be active (if the sensor has a wide detection zone). The fix involves: (1) Using a sensor at the exact pick position (not upstream), (2) Adding a conveyor "stopped" confirmation signal, (3) Verifying part presence with a second sensor at the pick point, or (4) Using the robot vision system for final position verification.',
    real_world_context:
      'This conveyor-robot timing issue is one of the most common integration problems. UR application engineers report that >30% of first-time conveyor integrations require signal timing adjustments.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['digital-IO', 'conveyor-integration', 'signal-timing', 'UR10e'],
  },

  // DF-10
  {
    question_text:
      'A maintenance plan for a fleet of 30 AMRs specifies quarterly preventive maintenance. Which components should be inspected during each quarterly PM cycle? (Select 3)',
    question_type: 'multi_select',
    difficulty: 1,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Drive wheel tread condition and caster wheel bearings for wear that affects traction and odometry accuracy' },
      { label: 'B', text: 'Safety scanner lens cleanliness and detection zone verification to ensure reliable obstacle detection' },
      { label: 'C', text: 'Battery health metrics (capacity, cycle count, cell balance) and charging contact condition' },
      { label: 'D', text: 'The color of the AMR chassis paint for brand compliance' },
      { label: 'E', text: 'The number of Bluetooth devices within range of the AMR' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'Quarterly AMR preventive maintenance focuses on components that degrade with use and directly affect performance and safety: (A) Drive wheels wear affects traction (causing slippage and reduced payload capacity) and odometry accuracy (worn wheels have a different effective diameter, causing distance calculation errors that degrade dead-reckoning between LIDAR scans). Caster bearings affect rolling resistance and can seize, causing the AMR to drag. (B) Safety scanner lenses accumulate dust, grease, and debris from the warehouse environment. A dirty lens reduces the effective detection range, potentially creating a safety hazard. Detection zone verification confirms the scanner still triggers at the configured distances. (C) Battery health monitoring identifies cells approaching end-of-life before they cause mid-mission failures. Charging contacts corrode or accumulate debris, causing unreliable charging.',
    real_world_context:
      'Locus Robotics provides a detailed quarterly PM checklist for their fleet customers. Facilities that skip PM typically see a 10-15% increase in unplanned downtime within 6 months.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['preventive-maintenance', 'AMR-fleet', 'PM-checklist', 'maintenance-planning'],
  },

  // DF-11
  {
    question_text:
      'When mounting a cobot to a table/worksurface, why is the rigidity and mass of the mounting surface critical to robot performance?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'A flexible mount makes the robot safer because it absorbs collision energy' },
      {
        label: 'B',
        text: 'A non-rigid mounting surface introduces vibration and deflection during robot motion, which degrades repeatability, increases settling time at waypoints, and can cause the safety-rated position monitoring to trigger false faults',
      },
      { label: 'C', text: 'Mounting rigidity only matters for robots over 50 kg payload' },
      { label: 'D', text: 'The mounting surface material is irrelevant as long as the bolt pattern matches' },
    ],
    correct_answers: ['B'],
    explanation:
      'The robot base mounting is the foundation of the entire kinematic chain. Any compliance (flexibility) in the mount becomes an uncontrolled additional degree of freedom that the robot controller cannot compensate for: (1) Vibration — a flexible mount amplifies oscillations during acceleration/deceleration, increasing cycle time because the robot must wait for vibrations to damp before proceeding. (2) Deflection — under payload, a flexible mount deflects, causing a systematic position error that changes with payload weight and arm configuration. (3) Safety monitoring — safety-rated position monitoring compares encoder positions against expected limits; if the base moves, the actual TCP position diverges from the calculated position, potentially triggering safety faults. UR recommends a minimum mounting surface rigidity that limits deflection to <0.1 mm under maximum dynamic load. Common failures include: mounting to thin aluminum extrusion tables, unsupported plywood, or wheeled carts.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['mounting', 'rigidity', 'commissioning', 'vibration'],
  },

  // DF-12
  {
    question_text:
      'A robot cell design requires the UR cobot to communicate with a PLC using Modbus TCP. During commissioning, the Modbus connection fails intermittently. The network has the robot, PLC, and 15 IP cameras on the same switch. What is the most likely cause?',
    question_type: 'fault_diagnosis',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    scenario_context:
      'A UR10e communicates with a Siemens S7-1200 PLC via Modbus TCP over a single unmanaged 24-port Ethernet switch. The same switch also connects 15 IP cameras streaming at 5 Mbps each. The Modbus connection drops for 200-500 ms every few minutes.',
    options: [
      { label: 'A', text: 'The Modbus TCP protocol is not compatible with Siemens PLCs' },
      {
        label: 'B',
        text: 'The IP camera traffic (75+ Mbps aggregate) is saturating the switch bandwidth or causing packet queuing delays, leading to Modbus TCP timeout failures; robot-PLC communication should be on a separate VLAN or dedicated network segment',
      },
      { label: 'C', text: 'The UR10e does not support Modbus TCP natively' },
      { label: 'D', text: 'Modbus TCP connections always drop intermittently by design' },
    ],
    correct_answers: ['B'],
    explanation:
      'Modbus TCP is a real-time industrial protocol that is sensitive to network latency and packet loss. On an unmanaged switch shared with 15 IP cameras (75+ Mbps of continuous video traffic), several issues arise: (1) Switch buffer overflow — when multiple cameras transmit simultaneously, the switch buffers fill and packets are dropped, including Modbus packets. (2) Broadcast storms — IP cameras using mDNS/ONVIF discovery generate broadcast traffic that all ports must process. (3) No QoS — an unmanaged switch cannot prioritize Modbus traffic over camera traffic. The solution is network segmentation: robot-PLC communication on a dedicated switch or VLAN with QoS prioritization. Best practice for robot cells is a separate industrial network (robot + PLC + I/O) isolated from IT/camera traffic. UR10e fully supports Modbus TCP and Siemens PLCs are fully compatible.',
    real_world_context:
      'Network architecture is one of the most overlooked aspects of robot cell deployment. A FANUC integrator reported that 25% of first-year support calls involved network-related communication failures between the robot and PLC.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['Modbus-TCP', 'network-architecture', 'PLC-communication', 'UR10e'],
  },

  // DF-13
  {
    question_text:
      'What is the purpose of a "risk assessment document" that must be completed before a robot cell is put into production, and who is responsible for creating it?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'It is a financial document estimating the ROI, created by the finance department' },
      {
        label: 'B',
        text: 'It systematically identifies all hazards associated with the robot system, estimates the risk of each, and documents the risk reduction measures applied; the system integrator is responsible for creating it per ISO 10218-2, with input from the robot manufacturer and the end user',
      },
      { label: 'C', text: 'It is an insurance form created by the insurance company' },
      { label: 'D', text: 'It is an optional document that is only required for robots over 100 kg payload' },
    ],
    correct_answers: ['B'],
    explanation:
      'ISO 10218-2 clause 4 requires a risk assessment for every robot system installation. The document must: (1) Identify all hazards (mechanical, electrical, thermal, noise, ergonomic, etc.) through systematic analysis of all robot operations (normal, teaching, maintenance, cleaning, fault recovery). (2) Estimate the risk of each hazard using severity, probability, and avoidability factors. (3) Document the risk reduction measures applied (inherent design, safeguarding, information). (4) Assess residual risk after measures are applied. The system integrator bears primary responsibility because they integrate the robot (manufacturer responsibility) into the specific application environment (unique to each installation). The end user provides operational context. This is not optional — it is a legal requirement in the EU (Machinery Directive) and a best-practice requirement under OSHA in the US.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['risk-assessment', 'iso-10218', 'documentation', 'integrator-responsibility'],
  },

  // DF-14
  {
    question_text:
      'An AMR integrator must decide between natural feature navigation (LIDAR SLAM) and fiducial marker navigation (QR codes/reflectors) for a new warehouse deployment. The warehouse layout changes monthly as seasonal SKUs are reorganized. Which is more appropriate and why?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Fiducial markers — they provide the highest accuracy regardless of layout changes' },
      {
        label: 'B',
        text: 'Natural feature SLAM — because it builds its map from structural features (walls, columns, racking), it adapts to moderate layout changes automatically; fiducial markers would need physical relocation every time the layout changes, creating maintenance burden and downtime',
      },
      { label: 'C', text: 'Magnetic tape guidance — it never needs remapping' },
      { label: 'D', text: 'GPS navigation — it works independently of the warehouse layout' },
    ],
    correct_answers: ['B'],
    explanation:
      'In a dynamic warehouse environment with monthly layout changes, natural feature SLAM is preferred because: (1) Structural features (walls, columns, fixed racking uprights) remain stable even when aisle contents change, providing reliable localization anchors. (2) SLAM algorithms can incrementally update the map to accommodate moderate changes. (3) No physical infrastructure (markers, reflectors, tape) needs to be moved when the layout changes. Fiducial markers (A) provide excellent accuracy but each marker is a fixed physical reference — moving aisles means moving/adding/removing markers, which requires downtime and careful re-surveying. Magnetic tape (C) is the least flexible option, requiring physical path changes. GPS (D) does not work indoors with sufficient accuracy for AMR navigation.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['SLAM', 'fiducial-markers', 'AMR-navigation', 'warehouse-layout'],
  },

  // DF-15
  {
    question_text:
      'During the initial deployment of a cobot welding cell, the integrator must perform a "mastering" or "zero-point calibration" procedure. What does this accomplish?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'It teaches the robot the location of the welding workpiece' },
      {
        label: 'B',
        text: 'It establishes the precise zero-position (home position) of each joint encoder, ensuring the robot controller internal model matches the actual physical joint positions; without it, all position calculations contain systematic offset errors',
      },
      { label: 'C', text: 'It calibrates the welding power supply voltage' },
      { label: 'D', text: 'It is a software license activation procedure required for first use' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robot mastering (also called zero-point calibration or encoder calibration) establishes the relationship between each joint encoder reading and the physical joint angle. Encoders measure relative rotation from an arbitrary reference — mastering defines where "zero degrees" is for each joint. This is critical because: (1) The robot kinematic model uses joint angles to calculate TCP position — if the zero point is wrong, all position calculations have a systematic error. (2) After encoder battery replacement, motor replacement, or mechanical collision, mastering must be re-performed because the encoder reference may have shifted. (3) Program portability between robots of the same model depends on accurate mastering — a program taught on one robot will produce different positions on another if their mastering differs. Mastering is typically performed using a calibration tool and reference marks on the robot body.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['mastering', 'zero-calibration', 'encoder', 'commissioning'],
  },

  // DF-16
  {
    question_text:
      'A cobot program includes a subroutine that runs when the robot encounters an unexpected collision (force/torque threshold exceeded). Which is the safest recovery strategy?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Immediately resume the program from the point of collision' },
      {
        label: 'B',
        text: 'Stop motion, retract along the approach vector to a safe clearance height, alert the operator via HMI, and wait for operator acknowledgment before resuming — logging the collision event with position and force data for investigation',
      },
      { label: 'C', text: 'Power off the robot completely and require a full restart' },
      { label: 'D', text: 'Increase the force threshold and retry the same motion' },
    ],
    correct_answers: ['B'],
    explanation:
      'A safe collision recovery strategy must: (1) Stop all motion immediately to prevent further damage or injury. (2) Retract to a safe position — moving along the approach vector (the reverse of the direction the robot was traveling) to clear the collision zone. (3) Notify the operator — display the collision details on the HMI so the operator can assess the situation (was it a person, a misplaced part, a fixture issue?). (4) Wait for acknowledgment — the operator must confirm it is safe to resume, preventing automatic restart into a potentially unsafe condition. (5) Log the event — recording position, force data, and timestamp enables root cause analysis. Option A risks repeated collisions. Option C is overly disruptive for minor collisions. Option D masks a real problem and could escalate to a dangerous force level.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['collision-recovery', 'error-handling', 'HMI', 'programming'],
  },

  // DF-17
  {
    question_text:
      'Before deploying an AMR fleet, the integrator creates a "facility map" by driving a mapping robot through the warehouse. What critical information beyond wall and obstacle positions must be encoded in this map for effective fleet operation?',
    question_type: 'multi_select',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Speed zones — areas where AMRs must reduce speed (pedestrian crossings, dock doors, narrow aisles)' },
      { label: 'B', text: 'Preferred travel lanes and one-way zones to establish traffic flow patterns and prevent head-on encounters' },
      { label: 'C', text: 'Charging station locations and approach vectors for reliable auto-docking' },
      { label: 'D', text: 'The names of all warehouse employees' },
      { label: 'E', text: 'Historical weather data for the region' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'An AMR facility map is much more than a 2D occupancy grid. Effective fleet operation requires annotated semantic information: (A) Speed zones define areas where safety or operational requirements mandate reduced speed — pedestrian zones, dock door areas (where forklifts enter/exit), narrow aisles, and blind corners. Without these, AMRs may travel at unsafe speeds in high-risk areas. (B) Traffic lanes and one-way zones prevent head-on encounters in narrow aisles (which cause deadlocks requiring one AMR to reverse a full aisle length), establish efficient traffic flow patterns, and reduce congestion at intersections. (C) Charging station positions and approach vectors must be precisely mapped so AMRs can auto-dock reliably — even a 10mm error in the charger position on the map can cause docking failures. These annotations are typically configured in the fleet management software after the initial geometric map is created.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['facility-mapping', 'AMR-deployment', 'semantic-map', 'fleet-management'],
  },

  // DF-18
  {
    question_text:
      'A production engineer wants to use a UR cobot for two different tasks: machine tending during the day shift and palletizing during the night shift. What must be changed between tasks?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Only the robot program needs to change; everything else remains the same' },
      {
        label: 'B',
        text: 'The program, end-effector (gripper/tool), TCP configuration, payload setting, safety configuration (if workspace/speed limits differ), and potentially the installation settings (if the mounting orientation changes) all must be updated for each task',
      },
      { label: 'C', text: 'The robot must be returned to the manufacturer for reprogramming' },
      { label: 'D', text: 'UR cobots can only be programmed for a single task and cannot be repurposed' },
    ],
    correct_answers: ['B'],
    explanation:
      'Multi-task cobot deployment requires changing several interdependent settings: (1) Program — each task has different waypoints, logic, and I/O sequences. (2) End-effector — machine tending may use a parallel gripper while palletizing may use a vacuum gripper; the physical tool must be swapped. (3) TCP — each end-effector has a different TCP offset that must be loaded. (4) Payload — the weight and center of gravity of each tool + workpiece must be correctly configured for proper motion planning and collision detection. (5) Safety configuration — different tasks may require different workspace limits, speed zones, or force limits; the safety configuration checksum must be verified for each. (6) Installation settings — if the robot base position changes (e.g., moved between stations), the coordinate frame must be updated. UR supports multiple installation/program files to facilitate task switching, but the operator must correctly select and verify all settings.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['multi-task', 'task-switching', 'UR', 'deployment-flexibility'],
  },

  // DF-19
  {
    question_text:
      'During commissioning of a robot cell, the integrator performs a "cycle time study" over 100 consecutive cycles. The average cycle time is 9.2 seconds, but the standard deviation is 1.8 seconds. The customer specification requires a maximum cycle time of 10 seconds. Should the integrator approve the cell?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    scenario_context:
      'A robot cell is commissioned for an automotive tier-1 supplier. 100 test cycles yield: mean = 9.2s, std dev = 1.8s, min = 7.1s, max = 14.3s. The customer requires that no cycle exceeds 10.0 seconds because the cell feeds a fixed-takt assembly line.',
    options: [
      { label: 'A', text: 'Yes — the average of 9.2 seconds is below the 10-second requirement' },
      {
        label: 'B',
        text: 'No — with a 1.8s standard deviation, approximately 33% of cycles exceed 10 seconds (mean + 0.44 sigma); the maximum observed cycle of 14.3 seconds would cause the downstream assembly line to starve; the root cause of the high variation must be identified and resolved',
      },
      { label: 'C', text: 'Yes — the minimum of 7.1 seconds shows the robot can meet the requirement' },
      { label: 'D', text: 'Yes — the 10-second requirement only applies to the first cycle' },
    ],
    correct_answers: ['B'],
    explanation:
      'For a fixed-takt assembly line, EVERY cycle must meet the time requirement, not just the average. With a normal distribution (mean 9.2, sigma 1.8), approximately 33% of cycles exceed 10 seconds: Z = (10.0 - 9.2) / 1.8 = 0.44, corresponding to roughly 33% probability of exceeding 10.0s. The observed max of 14.3s (mean + 2.8 sigma) confirms extreme outliers exist. The high standard deviation (1.8s on a 9.2s cycle = 19.6% coefficient of variation) indicates significant variability that must be diagnosed: common causes include vision system detection time variation, conveyor part position inconsistency, gripper settling time variation, or sensor signal timing issues. A well-tuned cell should have a coefficient of variation below 5% (sigma < 0.5s for a 9.2s cycle).',
    time_limit_seconds: 90,
    points: 2,
    tags: ['cycle-time-study', 'commissioning', 'statistical-analysis', 'takt-time'],
  },

  // DF-20
  {
    question_text:
      'When programming a cobot to perform a quality inspection using a wrist-mounted camera, why is it important to define waypoints using a "feature frame" (coordinate frame attached to the workpiece) rather than absolute robot coordinates?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'DEPLOYMENT_FUNDAMENTALS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Feature frames make the program run faster' },
      {
        label: 'B',
        text: 'If the workpiece position changes slightly (fixture adjustment, different pallet position), only the feature frame origin needs to be updated rather than re-teaching every waypoint; this also enables vision-guided dynamic frame updates for each cycle',
      },
      { label: 'C', text: 'Absolute coordinates are not supported by cobot controllers' },
      { label: 'D', text: 'Feature frames are required by ISO 10218 for all cobot programs' },
    ],
    correct_answers: ['B'],
    explanation:
      'A feature frame (also called user frame, work object, or part coordinate system) defines a local coordinate system attached to the workpiece or fixture. All waypoints are recorded relative to this frame rather than the robot base frame. Benefits: (1) Offset correction — if the workpiece moves (different pallet, fixture adjustment, conveyor drift), updating the single feature frame origin automatically corrects all waypoints. (2) Vision-guided operation — a camera can detect the workpiece position each cycle and dynamically set the feature frame, enabling the robot to handle positional variation without re-teaching. (3) Program portability — the same program works on multiple identical stations even if the robot base position differs slightly. (4) Multi-part flexibility — the same inspection routine can be applied to parts at different positions by defining different feature frames. This is a fundamental programming practice that dramatically reduces deployment and maintenance time.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['feature-frame', 'coordinate-systems', 'programming', 'vision-guided'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 4: TROUBLESHOOTING_L1 (20 questions)
  // ═══════════════════════════════════════════════════════════════

  // TS-1
  {
    question_text:
      'A UR cobot displays the error "Protective Stop: Joint 2 speed violation" and halts during automatic operation. The program has not been changed recently. What are the most likely causes to investigate?',
    question_type: 'fault_diagnosis',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    scenario_context:
      'A UR10e running a stable pick-and-place program for 3 months suddenly starts triggering "Protective Stop: Joint 2 speed violation" errors 2-3 times per shift. The program, payload, and safety configuration have not been modified.',
    options: [
      { label: 'A', text: 'The robot firmware has expired and needs renewal' },
      {
        label: 'B',
        text: 'Possible causes include: (1) Incorrect payload configuration — if the actual payload changed (heavier parts, different gripper) without updating the payload setting, the controller underestimates joint torques and the joint may exceed calculated speed limits; (2) Mechanical degradation — increased joint friction or brake drag causing the safety system to detect unexpected speed/torque; (3) Mounting looseness — a loose base mount introduces oscillation that the safety system detects as speed violation' },
      { label: 'C', text: 'The error is a normal notification that can be safely ignored' },
      { label: 'D', text: 'The UR10e does not have joint speed monitoring capability' },
    ],
    correct_answers: ['B'],
    explanation:
      'A "Joint speed violation" protective stop means the safety-rated speed monitoring detected that a joint exceeded its configured speed limit. For a previously stable program, this indicates a system change: (1) Payload mismatch is the most common cause — if someone added a heavier tool or the actual part weight increased (supplier change), the controller uses the configured (lower) payload for trajectory planning, commanding joint speeds that, under the actual (higher) load, cause overshoot during deceleration. The safety system detects the overshoot. (2) Mechanical issues — increased friction, bearing wear, or brake drag changes the joint dynamic response, causing speed control errors. (3) Mounting — a loose base mount allows the robot to oscillate, adding velocity components that the safety system measures. Diagnosis: verify payload matches actual (weigh tool + part), check base bolts, inspect joint for unusual noise or heat.',
    real_world_context:
      'UR technical support reports that >50% of "speed violation" calls are resolved by correcting the payload configuration. It is the single most common configuration error in UR deployments.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['protective-stop', 'speed-violation', 'UR10e', 'payload-mismatch'],
  },

  // TS-2
  {
    question_text:
      'An AMR fleet is experiencing frequent "localization lost" errors in a specific aisle of the warehouse. The aisle was recently reorganized. What is the most likely cause?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The AMR batteries need replacement' },
      {
        label: 'B',
        text: 'The aisle reorganization changed the physical features (racking, products, landmarks) that the AMR LIDAR uses for localization, creating a mismatch between the stored map and the actual environment; the map needs to be updated for the reorganized area',
      },
      { label: 'C', text: 'The AMR Wi-Fi antenna is damaged' },
      { label: 'D', text: 'The AMR LIDAR sensor needs factory recalibration' },
    ],
    correct_answers: ['B'],
    explanation:
      'LIDAR-based localization works by matching the current LIDAR scan against the stored map. When the physical environment changes significantly (aisle reorganization moves racking, changes product height profiles, removes/adds landmarks), the LIDAR scan no longer matches the stored map in that area. The localization algorithm cannot find a consistent match, triggering a "localization lost" error. The fix is to update the map — either by re-mapping the affected area or, in more advanced fleet management systems, by allowing the AMRs to incrementally update the map as they traverse the changed area. This is the most common AMR operational issue in dynamic warehouse environments. Battery health (A) does not cause localization errors. Wi-Fi loss (C) causes communication errors, not localization errors (LIDAR localization is on-board). LIDAR recalibration (D) would affect all areas, not just one aisle.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['localization', 'AMR-troubleshooting', 'map-mismatch', 'LIDAR'],
  },

  // TS-3
  {
    question_text:
      'A cobot gripper intermittently fails to pick parts from a known position. The robot position is correct (verified by manual jog), the gripper opens and closes mechanically, but approximately 10% of picks fail. What diagnostic approach should be followed?',
    question_type: 'fault_diagnosis',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    scenario_context:
      'A UR5e with a pneumatic parallel gripper picks cylindrical parts (25mm dia, polished steel) from a V-groove fixture. The robot TCP position is confirmed correct. The gripper fingers close to the programmed gap. But ~10% of picks result in the part not being gripped — it remains in the fixture.',
    options: [
      { label: 'A', text: 'Replace the robot immediately — the positioning system is unreliable' },
      {
        label: 'B',
        text: 'Investigate in order: (1) Check air pressure at the gripper — low/fluctuating pressure reduces grip force; (2) Inspect gripper finger surfaces for wear that reduces friction on the polished steel parts; (3) Check for part dimensional variation that changes the effective grip diameter; (4) Verify the pneumatic valve response time — a slow valve may not fully close the gripper before the robot lifts',
      },
      { label: 'C', text: 'Increase the robot speed so the gripper contacts the part with more force' },
      { label: 'D', text: 'Replace all the parts with a different material' },
    ],
    correct_answers: ['B'],
    explanation:
      'Intermittent gripper failures with correct positioning suggest a grip force or timing issue, not a positioning issue. The systematic diagnostic approach: (1) Air pressure — pneumatic grippers are highly sensitive to supply pressure. A pressure drop of 10-20% (due to compressor cycling, leaks, or demand from other equipment) directly reduces grip force. Check with a pressure gauge at the gripper, not at the main supply. (2) Finger wear — polished steel is low-friction. Gripper finger pads wear over time, reducing the coefficient of friction and the effective grip force. Even small wear can cause slippage on polished surfaces. (3) Part variation — if part diameter varies (e.g., 24.8-25.2mm), the grip geometry changes, affecting contact pressure distribution. (4) Valve timing — the program must include sufficient dwell time after the grip command for the pneumatic valve to fully actuate and the fingers to close completely before the robot lifts.',
    real_world_context:
      'Intermittent grip failures on polished parts are extremely common. Solutions include: textured gripper fingers, compliance-based grippers that adapt to diameter variation, and grip-confirmation sensors (pressure switches or vacuum sensors).',
    time_limit_seconds: 90,
    points: 2,
    tags: ['gripper-troubleshooting', 'pneumatic-gripper', 'intermittent-failure', 'diagnostic'],
  },

  // TS-4
  {
    question_text:
      'An AMR repeatedly stops at the same location in the warehouse, reporting an obstacle detected, but no visible obstacle exists. What should the technician investigate?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The AMR software needs a complete reinstall' },
      {
        label: 'B',
        text: 'Investigate: (1) Low-lying obstacles below eye level (floor debris, cable protectors, low racking supports); (2) Transparent surfaces (glass walls, clear plastic curtains) that LIDAR may or may not detect depending on angle; (3) Safety scanner lens contamination causing false readings; (4) Highly reflective floor surfaces or metal objects creating LIDAR multi-path reflections (ghost obstacles)',
      },
      { label: 'C', text: 'Disable the obstacle detection sensor in that area' },
      { label: 'D', text: 'The AMR needs its wheels replaced' },
    ],
    correct_answers: ['B'],
    explanation:
      'Phantom obstacle detections are a common AMR issue with several technical causes: (1) Low obstacles — items below operator eye level but within the safety scanner detection plane: small debris, cable ramps, floor imperfections, or low-profile structures that are not visible during casual inspection. Walk the path at the scanner height. (2) Transparent/semi-transparent materials — LIDAR behavior on glass and clear plastic is unpredictable; sometimes the beam passes through, sometimes it reflects, creating intermittent detection. (3) Lens contamination — dust, moisture, or grease on the scanner lens creates scattered readings that appear as close-range obstacles. (4) Specular reflection — the LIDAR beam bouncing off shiny floors or metal structures can create multi-path returns that the scanner interprets as nearby obstacles. Diagnosis involves: checking the scanner diagnostic view (shows raw detection points), cleaning the lens, and physically inspecting the exact stop location at scanner height.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['phantom-obstacle', 'AMR-troubleshooting', 'LIDAR-artifacts', 'safety-scanner'],
  },

  // TS-5
  {
    question_text:
      'A FANUC CRX-10iA displays error "SRVO-050 Collision Detect (G:1 A:2)" during a palletizing program. The error occurs at the same program line each time. What does this error indicate and what should be checked first?',
    question_type: 'fault_diagnosis',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    scenario_context:
      'A FANUC CRX-10iA running a palletizing program triggers SRVO-050 at line 15 (a linear move to the place position on layer 3 of the pallet). The error is repeatable — it occurs every time the program reaches this line. No physical collision with the pallet is observed.',
    options: [
      { label: 'A', text: 'The robot arm is physically hitting the pallet and needs to be repositioned' },
      {
        label: 'B',
        text: 'SRVO-050 indicates the collision detection torque threshold was exceeded on Group 1, Axis 2 (shoulder joint); for a repeatable occurrence at the same line, check: (1) Whether the approach angle causes axis 2 to operate near its torque limit with the current payload, (2) Whether the payload configuration matches the actual weight being carried at that point, (3) Whether the motion involves a near-singularity configuration that causes high joint torques',
      },
      { label: 'C', text: 'The CRX-10iA does not have collision detection, so this error is a firmware glitch' },
      { label: 'D', text: 'The error means the LIDAR safety scanner detected a person near the robot' },
    ],
    correct_answers: ['B'],
    explanation:
      'FANUC SRVO-050 (Collision Detection) is triggered when the external torque estimation exceeds the configured threshold — the system detects more resistance on a joint than expected for the planned motion. For a repeatable error at the same program line, the causes are deterministic: (1) The motion at line 15 (place on layer 3) likely extends the arm, increasing the moment on axis 2 (shoulder). With payload, the gravitational torque on axis 2 at extended positions can approach the collision detection threshold. (2) If the actual payload exceeds the configured value, the controller underestimates the expected torque, and normal gravitational loading triggers the collision detection. (3) Near-singularity configurations cause theoretical joint velocities to spike, which the system may interpret as unexpected external torque. Fix: verify payload setting, adjust the approach trajectory to avoid extended configurations, or tune the collision detection sensitivity for axis 2 at that program position.',
    real_world_context:
      'FANUC technical support reports that SRVO-050 on axis 2 during extended-reach positions is the single most common collision detection alarm in palletizing applications.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['SRVO-050', 'FANUC-CRX', 'collision-detection', 'torque-threshold'],
  },

  // TS-6
  {
    question_text:
      'A UR cobot safety system enters "Fault" state (red indicator) and displays "Safety System Violation - Position deviated from expected." The robot was operating normally until a power fluctuation occurred. What is the recovery procedure?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Press the play button to resume the program immediately' },
      {
        label: 'B',
        text: 'Power cycle the controller, verify the safety system status clears the fault, manually jog the robot to a known safe position at reduced speed, verify the safety configuration checksum matches the documented value, then restart the program from the beginning',
      },
      { label: 'C', text: 'Disconnect and reconnect the safety system cable' },
      { label: 'D', text: 'This error requires factory repair — the robot cannot be restarted on-site' },
    ],
    correct_answers: ['B'],
    explanation:
      'A safety system fault indicating position deviation means the safety-rated position monitoring detected that the robot position does not match the expected position. This can occur after a power interruption because: (1) The robot may have moved slightly due to gravity (payload, arm weight) when power was lost and servo holding torque ceased. (2) The encoder reference may have been disrupted. Recovery: (1) Power cycle — clear the fault condition and re-initialize the safety system. (2) Verify fault clearance — the safety system must complete its self-test and report normal status. (3) Manual jog — move the robot to a known position at reduced speed, visually confirming it moves correctly. (4) Checksum verification — ensure no safety parameters were corrupted by the power event. (5) Restart from beginning — the program state at the time of interruption is unreliable; restarting ensures consistent behavior. Never resume from the interrupted position after a safety fault.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['safety-fault', 'recovery-procedure', 'UR', 'power-interruption'],
  },

  // TS-7
  {
    question_text:
      'An AMR fleet experiences a sudden 30% throughput drop. No single AMR is reporting errors. The fleet dashboard shows all AMRs as "active." What system-level issue should be investigated first?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Replace all AMR batteries simultaneously' },
      {
        label: 'B',
        text: 'Check the fleet traffic management system for deadlock patterns, congestion zones, or suboptimal routing — a throughput drop with all AMRs active but no individual errors typically indicates fleet-level coordination issues such as AMRs waiting in queues, taking detour routes around congestion, or repeatedly yielding to each other at intersections',
      },
      { label: 'C', text: 'Restart every AMR in the fleet' },
      { label: 'D', text: 'The throughput measurement system is miscalibrated' },
    ],
    correct_answers: ['B'],
    explanation:
      'A fleet-wide throughput drop with all units active and no errors is the hallmark of a traffic management issue: (1) Deadlocks — two or more AMRs blocking each other, requiring slow resolution (backup, reroute). These cascade: one deadlock delays multiple AMRs in the surrounding area. (2) Congestion — too many AMRs routed through the same zone (e.g., near a popular pick zone or the packing area) creating queues where AMRs wait idle. (3) Suboptimal routing — after a map change or parameter adjustment, the routing algorithm may be sending AMRs on longer paths. (4) Yield storms — poorly tuned priority rules cause AMRs to repeatedly yield to each other, creating oscillation. Diagnosis: check the fleet heatmap for congestion zones, review the deadlock log for frequency and location, and examine route efficiency metrics (actual distance traveled vs. optimal). This is a systems-level problem, not an individual AMR problem.',
    real_world_context:
      'A Locus Robotics deployment at a 3PL facility experienced a 35% throughput drop that was traced to a single blocked aisle that the routing algorithm was sending 60% of traffic through after a map update changed one-way designations.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['fleet-throughput', 'traffic-management', 'deadlock', 'AMR-troubleshooting'],
  },

  // TS-8
  {
    question_text:
      'A cobot vision system for part inspection starts producing inconsistent results after working reliably for 6 months. The same part type is sometimes classified as "pass" and sometimes as "fail" with no actual quality change. What environmental factor is most likely responsible?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The robot joints are wearing out, causing camera position drift' },
      {
        label: 'B',
        text: 'Lighting conditions have changed — seasonal sunlight angle changes, burned-out or degraded overhead lights, or new reflective surfaces in the area are causing inconsistent illumination of the inspection target, leading to variable image quality and unreliable feature extraction',
      },
      { label: 'C', text: 'The camera firmware auto-updated and introduced a bug' },
      { label: 'D', text: 'The inspection algorithm has a memory leak that degrades over time' },
    ],
    correct_answers: ['B'],
    explanation:
      'Vision system consistency depends heavily on stable lighting. After months of operation, gradual lighting changes are the most common cause of inspection degradation: (1) Seasonal sunlight — the sun angle changes throughout the year, altering the amount and direction of natural light entering through windows, skylights, and dock doors. A system commissioned in winter may receive completely different ambient light in summer. (2) Lighting degradation — fluorescent and some LED fixtures gradually lose output (30-50% over 2-3 years), reducing the signal-to-noise ratio of the camera image. (3) Environmental changes — new machinery, reflective surfaces, or rearranged workstations near the inspection area change the reflected light patterns. The fix is controlled lighting: dedicated LED illumination with consistent color temperature and intensity, physical light shields to block ambient variation, and periodic lighting verification as part of PM.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['vision-system', 'lighting', 'inspection', 'troubleshooting'],
  },

  // TS-9
  {
    question_text:
      'A robot cell PLC receives a "robot ready" signal from the cobot, sends a "start cycle" command, but the robot does not move. The HMI shows the robot in "Remote" mode with no active errors. What is the most likely issue?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The robot motors have burned out' },
      {
        label: 'B',
        text: 'The robot is in Remote mode (correct for PLC control) but the program may not be loaded/running, the safety system may be in a state that prevents motion (e.g., safeguard input not satisfied), or the "start" digital input mapping may be misconfigured — check the program state, safety I/O status, and verify the digital input assignment matches the PLC output addressing',
      },
      { label: 'C', text: 'Remote mode means the robot cannot be started by any external signal' },
      { label: 'D', text: 'The PLC and robot use incompatible communication voltages' },
    ],
    correct_answers: ['B'],
    explanation:
      'A robot reporting "ready" but not responding to "start" in Remote mode is a classic integration troubleshooting scenario. The systematic checklist: (1) Program state — is a program loaded and in a "waiting for start" state? If no program is loaded or the program terminated, the robot reports ready but has nothing to execute. (2) Safety I/O — is the safety system satisfied? Common requirement: the safeguard reset input must be active (gate closed and acknowledged), the mode selector must be in "auto," and the emergency stop must be released. Any unsatisfied safety condition prevents motion without generating a visible error on some HMI configurations. (3) I/O mapping — verify the physical DI pin that the PLC drives matches the DI assignment in the robot program. A common error: the PLC outputs on DI_1 but the robot program monitors DI_2. (4) Signal timing — some robots require a rising edge (pulse), not a sustained level, for the start command.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['PLC-integration', 'remote-mode', 'digital-IO', 'troubleshooting'],
  },

  // TS-10
  {
    question_text:
      'An AMR intermittently loses Wi-Fi connection in a specific area, causing it to stop and wait for reconnection. The IT team confirms full Wi-Fi coverage. What interference source should be investigated?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The AMR LIDAR is interfering with the Wi-Fi signal' },
      {
        label: 'B',
        text: 'Investigate electromagnetic interference from nearby equipment: industrial microwave ovens (2.4 GHz band overlap), wireless barcode scanners, other AMR fleets on overlapping channels, large motor drives or welding equipment generating broadband RF noise — these can cause localized Wi-Fi disruption despite adequate AP coverage',
      },
      { label: 'C', text: 'The AMR antenna is broken and needs replacement' },
      { label: 'D', text: 'Wi-Fi coverage surveys are always inaccurate and cannot be trusted' },
    ],
    correct_answers: ['B'],
    explanation:
      'Localized Wi-Fi disruption despite confirmed coverage is almost always caused by interference. The 2.4 GHz band is shared with numerous industrial sources: (1) Microwave ovens — break rooms near warehouse floors are a common source of 2.4 GHz interference that can completely disrupt Wi-Fi within 10-20 meters during use. (2) Wireless barcode scanners — some models use 2.4 GHz direct-sequence spread spectrum that can congest the band in high-density scanning areas. (3) Overlapping Wi-Fi — if another system (different AMR vendor, building management, neighboring tenant) operates on overlapping channels, co-channel interference degrades performance. (4) Industrial EMI — variable frequency drives (VFDs), arc welding, and large motor starters generate broadband RF noise. Diagnosis: use a spectrum analyzer (not a Wi-Fi survey tool) to identify interference sources in the affected area. The fix may involve switching to 5 GHz band, adjusting channels, or relocating the interference source.',
    real_world_context:
      'A distribution center AMR deployment lost connectivity every day between 11:30 AM and 1:30 PM in one zone. A spectrum analyzer revealed that the break room microwave oven was the cause. Relocating the AP and switching to 5 GHz resolved the issue.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['Wi-Fi-interference', 'AMR-connectivity', 'EMI', 'troubleshooting'],
  },

  // TS-11
  {
    question_text:
      'A UR cobot arm drifts slightly during operation — positions taught yesterday are off by 1-2 mm today, but the drift is consistent across all waypoints (all shifted in the same direction). What is the most likely cause?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The joint encoders are failing and need replacement' },
      {
        label: 'B',
        text: 'The robot base has shifted — a consistent offset across all waypoints indicates the entire kinematic chain has moved relative to the workspace, typically due to loose mounting bolts, thermal expansion/contraction of the mounting structure, or the table/stand shifting on the floor',
      },
      { label: 'C', text: 'The TCP calibration needs to be redone' },
      { label: 'D', text: 'All UR cobots drift by 1-2 mm daily as a normal characteristic' },
    ],
    correct_answers: ['B'],
    explanation:
      'A consistent positional offset across ALL waypoints (same direction, same magnitude) is the diagnostic signature of a base frame shift — the robot base has physically moved relative to the workpiece coordinate system. If individual joints or the TCP were the problem, the offset would vary depending on the arm configuration. Common causes: (1) Loose mounting bolts — vibration over time can loosen even properly torqued bolts, especially on aluminum tables. (2) Thermal effects — a steel mounting structure in a facility with significant temperature variation (e.g., near a dock door that opens in winter) can expand/contract, shifting the robot base by 1+ mm. (3) Floor movement — if the robot stand is on a floor with vibration from nearby heavy machinery. Fix: check and re-torque all base mounting bolts, verify the robot base position against reference marks, and if thermal effects are the cause, consider re-teaching after the facility reaches thermal equilibrium.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['position-drift', 'base-shift', 'mounting', 'UR-troubleshooting'],
  },

  // TS-12
  {
    question_text:
      'An AMR docking station reports frequent "docking failure" events. The AMR approaches the charger but fails to make electrical contact. AMRs at other stations in the same facility dock successfully. What should be checked?',
    question_type: 'multi_select',
    difficulty: 1,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Charging contact surfaces on both the AMR and the station for corrosion, debris, or physical damage' },
      { label: 'B', text: 'Station alignment — verify the docking target (IR beacon, reflector, or visual marker) has not been bumped or shifted, causing the AMR to dock at a slight offset' },
      { label: 'C', text: 'Floor condition directly in front of the station — debris, unevenness, or wet floor that prevents the AMR from completing the final approach accurately' },
      { label: 'D', text: 'The AMR serial number is incompatible with this specific station' },
      { label: 'E', text: 'Solar flare activity affecting the station electronics' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'Station-specific docking failures (other stations work fine) point to local issues at that specific station: (A) Charging contacts are the most common docking failure cause. Corrosion, warehouse dust/debris, and physical wear from repeated docking create poor electrical contact. Regular cleaning of both station and AMR contacts is standard PM. (B) Docking stations use a target (IR beacon, reflective marker, or visual fiducial) for the AMR to align with during approach. If the station has been bumped (forklift traffic, cleaning equipment), the target shifts and the AMR docks at an offset, misaligning the contacts. (C) The final 0.5-1 meter of approach is critical — floor debris, a warped mat, or water puddle can cause wheel slip or deviation that prevents precise alignment. Since the problem is station-specific, AMR-wide issues (D, E) are not the cause.',
    time_limit_seconds: 75,
    points: 2,
    tags: ['docking-failure', 'charging-station', 'AMR-maintenance', 'troubleshooting'],
  },

  // TS-13
  {
    question_text:
      'A KUKA KR 10 R1100 displays "Drive error axis 3 - overcurrent" during high-speed operation. The error does not occur at reduced speed. What is the most likely cause?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The facility power supply voltage is too high' },
      {
        label: 'B',
        text: 'At high speed, the axis 3 motor draws more current for rapid acceleration/deceleration; the overcurrent may indicate: (1) Increased mechanical load on axis 3 (worn gearbox, contaminated joint, or brake drag), (2) Motor or drive degradation (insulation breakdown under load), or (3) The programmed motion demands exceed the axis dynamic capability at the configured payload',
      },
      { label: 'C', text: 'The error is caused by electromagnetic interference from the facility lighting' },
      { label: 'D', text: 'Overcurrent errors are normal at high speed and should be suppressed in the configuration' },
    ],
    correct_answers: ['B'],
    explanation:
      'An overcurrent error that only manifests at high speed is speed/load dependent, pointing to dynamic causes: (1) Mechanical degradation — increased friction in the joint (gearbox wear, insufficient lubrication, bearing degradation) requires more motor torque (current) to achieve the same acceleration. At low speed, the additional current is below the threshold; at high speed, the higher acceleration demands push the total current over the limit. (2) Motor/drive issues — partial insulation breakdown in the motor windings can create current paths that only manifest under high load (high speed). (3) Motion demands — if the programmed path requires axis 3 to accelerate/decelerate rapidly (e.g., short linear moves with tight blending), the dynamic torque requirements may exceed the axis capability, especially with payload. Diagnosis: check the axis 3 current traces in the KUKA diagnostic log, compare with baseline values from commissioning, and listen for unusual mechanical noise from the joint.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['overcurrent', 'KUKA', 'drive-error', 'mechanical-degradation'],
  },

  // TS-14
  {
    question_text:
      'A cobot running a UR program suddenly shows "Safety B board hardware fault" and enters a full stop state. The technician attempts to power cycle the controller but the fault persists after restart. What is the appropriate response?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Ignore the fault and override the safety system to continue production' },
      {
        label: 'B',
        text: 'A persistent safety board hardware fault after power cycle indicates a hardware failure in the dual-redundant safety system; the robot must be taken out of service and repaired by qualified UR service personnel — this is not a field-serviceable condition and the safety system cannot be bypassed',
      },
      { label: 'C', text: 'Update the robot firmware to the latest version to fix the bug' },
      { label: 'D', text: 'Replace the teach pendant cable as it is likely damaged' },
    ],
    correct_answers: ['B'],
    explanation:
      'UR cobots have a dual-redundant safety system with two independent safety processor boards (Safety A and Safety B) that cross-check each other. A hardware fault on either safety board means the redundant safety architecture is compromised — one of the two independent channels has failed. This is a serious condition because: (1) The remaining single channel cannot provide the Category 3 (or higher) performance level required by the safety standards. (2) The safety system is designed to prevent any operation when hardware integrity is compromised. (3) This is not a software or firmware issue — it is a physical hardware failure requiring board replacement by authorized service. Attempting to override (A) is dangerous and may be impossible by design. Firmware update (C) does not fix hardware. The teach pendant (D) is not part of the safety board hardware.',
    real_world_context:
      'UR safety board failures are rare (<0.1% per year) but when they occur, the robot must be serviced. UR certified service partners carry replacement safety boards and can typically repair on-site within 24-48 hours.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['safety-board-fault', 'UR', 'hardware-failure', 'service-required'],
  },

  // TS-15
  {
    question_text:
      'An AMR navigating autonomously in a warehouse suddenly deviates from its planned path by 2 meters and then corrects itself. This happens 3-4 times per day in different locations. What is the most likely cause?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The AMR is intentionally exploring the warehouse to update its map' },
      {
        label: 'B',
        text: 'Temporary localization errors — when the AMR passes through areas with poor LIDAR features (long featureless aisles, highly repetitive racking), the particle filter or scan matching algorithm may momentarily converge on a wrong position; as the AMR reaches an area with more distinctive features, it self-corrects ("kidnapped robot" recovery)',
      },
      { label: 'C', text: 'Other AMRs are transmitting conflicting position data' },
      { label: 'D', text: 'The AMR wheels are slipping on the floor' },
    ],
    correct_answers: ['B'],
    explanation:
      'Transient 2-meter deviations that self-correct are characteristic of localization algorithm errors in feature-poor environments. LIDAR SLAM localization relies on matching the current scan to the map. In areas with repetitive features (identical racking bays, long straight walls), the scan can match equally well at multiple positions (perceptual aliasing). The localization algorithm may briefly jump to a wrong position, causing the AMR to deviate from its intended path. When the AMR reaches an area with unique features (a corner, a pillar, a distinctive structure), the algorithm recognizes the correct position and corrects. This is different from wheel slip (D), which causes gradual drift without sudden correction. The fix involves: adding distinct landmarks in repetitive areas, increasing LIDAR scan frequency, or fusing additional sensor data (e.g., wheel odometry, IMU) to reject large instantaneous position jumps.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['localization-error', 'perceptual-aliasing', 'AMR-navigation', 'particle-filter'],
  },

  // TS-16
  {
    question_text:
      'A cobot pick-and-place program is failing because the robot oscillates (shakes) at the approach waypoint instead of reaching a stable position. The oscillation is a rapid back-and-forth motion of 1-2 mm amplitude. What tuning parameter is most likely incorrect?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The robot maximum speed is set too low' },
      {
        label: 'B',
        text: 'The servo gain (specifically the proportional or derivative gain in the position control loop) is too high for the current payload/inertia combination, causing overshoot oscillation; reducing the gain or properly configuring the payload will stabilize the positioning',
      },
      { label: 'C', text: 'The robot base is perfectly level, which causes resonance' },
      { label: 'D', text: 'The room temperature is affecting the joint lubricant viscosity' },
    ],
    correct_answers: ['B'],
    explanation:
      'Small-amplitude high-frequency oscillation at waypoints is a classic control system tuning issue. The robot position control loop uses PID (Proportional-Integral-Derivative) gains to move each joint to the commanded position. If the proportional gain is too high relative to the system inertia: (1) The joint overshoots the target position, (2) The controller corrects, but overshoots in the opposite direction, (3) This creates sustained oscillation. This commonly occurs when: the payload is different from what the controller expects (configured payload differs from actual), the mounting has changed (different compliance), or the gains were manually adjusted. Most cobots auto-tune gains based on the configured payload — so the first fix is to verify the payload configuration. If gains were manually adjusted, reduce the proportional gain until oscillation stops, then tune for settling time. Derivative gain issues can also cause high-frequency oscillation if set too high.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['oscillation', 'servo-tuning', 'PID-control', 'payload-configuration'],
  },

  // TS-17
  {
    question_text:
      'An ABB GoFa CRB 15000 cobot reports "Lead Through Activation Failed" when an operator attempts to hand-guide the robot. The lead-through button on the robot arm is working (LED illuminates when pressed). What should be checked?',
    question_type: 'multi_select',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The robot must be in manual mode (not automatic mode) for lead-through to function' },
      { label: 'B', text: 'All motion-supervising safety functions (speed, position, force limits) must be in a normal state — any active safety violation prevents lead-through activation' },
      { label: 'C', text: 'The robot payload must be correctly configured — incorrect payload causes the gravity compensation to be wrong, and the safety system may prevent lead-through if the sensed forces do not match expected gravity torques' },
      { label: 'D', text: 'The teach pendant battery needs replacement' },
      { label: 'E', text: 'The robot serial number must be registered online for lead-through to be enabled' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'Lead-through (hand-guiding) activation requires several conditions: (A) The robot must be in manual (teach) mode — automatic mode disables lead-through to prevent unintended human-robot contact during production. This is the most common cause of this error. (B) All safety functions must be in a normal state. If any safety parameter is violated (e.g., the robot is near a position limit, or a previous safety stop has not been properly cleared), the system prevents lead-through activation because it cannot guarantee safe compliant behavior. (C) Payload configuration must be correct because lead-through relies on gravity compensation — the controller calculates the gravitational torque on each joint and compensates for it, making the robot feel "weightless." If the payload is misconfigured, the compensation is wrong, and the robot either feels heavy (underpaid payload) or actively moves (overstated payload), which the safety system detects as abnormal and prevents activation.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['lead-through', 'hand-guiding', 'ABB-GoFa', 'troubleshooting'],
  },

  // TS-18
  {
    question_text:
      'A robot cell temperature monitoring system triggers an alert: "Joint 2 motor temperature: 85C (warning threshold: 80C)." The robot is running a continuous palletizing program. What should the operator do?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Immediately power off the robot to prevent fire' },
      {
        label: 'B',
        text: 'Reduce robot speed/duty cycle to decrease motor thermal load, investigate root cause (cycle time too aggressive, payload at limit, excessive joint 2 utilization due to workspace layout, ambient temperature increase), and schedule preventive maintenance to check joint 2 lubrication and mechanical condition',
      },
      { label: 'C', text: 'Ignore the warning — motors can safely operate at any temperature' },
      { label: 'D', text: 'Point a fan at joint 2 to cool it down' },
    ],
    correct_answers: ['B'],
    explanation:
      'A motor temperature warning (not critical fault) requires a measured response: (1) Immediate — reduce the thermal load by lowering speed, reducing acceleration, or adding pauses in the cycle. This prevents the temperature from reaching the critical threshold (typically 90-100C) that triggers a protective stop and potentially damages the motor insulation. (2) Investigate root cause — determine why this joint is running hot: is the cycle time too aggressive (continuous high-acceleration moves)? Is the payload at the limit (requiring maximum motor torque)? Has the joint mechanical resistance increased (lubrication degradation, bearing wear)? Is the ambient temperature higher than design conditions (facility HVAC failure, seasonal)? (3) Schedule PM — inspect joint 2 for mechanical issues. Motor temperature creep often precedes gearbox or bearing failure. Option A is premature for a warning. Option C ignores a degradation signal. Option D is not a real engineering solution.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['motor-temperature', 'thermal-management', 'preventive-maintenance'],
  },

  // TS-19
  {
    question_text:
      'A UR cobot program uses a wrist-mounted force/torque sensor to detect part insertion completion. The program waits for force in the Z-axis to exceed 30 N, indicating the part is seated. Intermittently, the program proceeds without the part being fully seated. What is causing the false force reading?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    scenario_context:
      'A UR5e with a wrist-mounted FT300 force/torque sensor inserts a rubber bushing into a housing. The program uses a force threshold of 30 N in Z to detect insertion completion. The bushing must be fully seated (20 mm depth). Approximately 8% of cycles, the program reports insertion complete at only 10-12 mm depth.',
    options: [
      { label: 'A', text: 'The force/torque sensor is defective and giving random readings' },
      {
        label: 'B',
        text: 'The rubber bushing creates variable friction during insertion that occasionally spikes above 30 N during the mid-stroke (due to interference with the housing chamfer or bushing deformation), triggering the threshold before full insertion; the fix is to use a combined force AND position check (force > 30 N AND Z position within 2 mm of target depth)' },
      { label: 'C', text: 'The UR5e built-in force sensing is interfering with the external FT300' },
      { label: 'D', text: '30 N is below the minimum detectable force of the FT300' },
    ],
    correct_answers: ['B'],
    explanation:
      'This is a classic sensor-based process control error: relying on a single condition (force threshold) when the process physics can produce the same reading at multiple states. Rubber bushing insertion involves: (1) Initial contact and chamfer engagement — moderate force. (2) Mid-stroke compression — the rubber deforms and may create a friction peak, especially if the bushing OD is at the upper tolerance or the housing ID is at the lower tolerance. (3) Final seating — high force as the bushing reaches its final position. The mid-stroke friction peak can exceed 30 N, triggering the completion condition prematurely. The robust solution is a compound condition: force > threshold AND position within acceptable range of target depth. This ensures the force reading is validated against the physical position. Alternative approaches include: monitoring force profile shape (not just threshold), using a moving average to filter spikes, or adding a position-based minimum before enabling force checking.',
    real_world_context:
      'Process engineers at automotive tier-1 suppliers routinely use compound force+position conditions for rubber/elastomer insertion. Single-condition thresholds cause 5-15% false completion rates in deformable material insertion.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['force-sensing', 'false-trigger', 'insertion', 'compound-condition', 'FT300'],
  },

  // TS-20
  {
    question_text:
      'An ABB IRB 1200 in a fenced cell triggers an "Axis motor overload" alarm on axis 1 only during one specific motion (a 180-degree rotation). All other motions execute normally. What is the most likely cause?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'TROUBLESHOOTING_L1',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The motor on axis 1 needs replacement because it has reached end of life' },
      {
        label: 'B',
        text: 'A cable, hose, or external dress pack routed along the robot is catching, snagging, or reaching its extension limit during the 180-degree rotation, creating additional resistance that overloads axis 1; the external routing must be inspected through the full range of motion',
      },
      { label: 'C', text: 'Axis 1 has a software limit at 180 degrees that prevents the motion' },
      { label: 'D', text: 'The 180-degree motion is too fast and needs to be slowed to 10% speed' },
    ],
    correct_answers: ['B'],
    explanation:
      'An overload that occurs only at a specific motion (180-degree rotation) but not during normal operation is highly indicative of an external mechanical obstruction that only manifests at extreme positions. The most common cause is the external dress pack — cables, pneumatic hoses, and communication lines routed along the outside of the robot. During a 180-degree axis 1 rotation: (1) Cables twist and may reach their torsional limit, creating increasing resistance. (2) Hoses may catch on the robot base or surrounding structures. (3) Cable connectors may snag on fixtures or guards. This is a particularly common issue when the dress pack was installed for a more limited range of motion and a new program requires the full axis 1 range. Diagnosis: manually jog axis 1 through the full rotation at slow speed while visually inspecting all external cables and hoses. The fix is re-routing the dress pack to accommodate the full range, using cable management arms, or adding strain relief.',
    real_world_context:
      'ABB service engineers report that external cable/hose interference is the #1 cause of axis-specific overload alarms. During preventive maintenance, inspecting the dress pack through the full range of motion is standard practice.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['axis-overload', 'dress-pack', 'ABB', 'cable-routing', 'troubleshooting'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 5: REGULATIONS_ETHICS (15 questions)
  // ═══════════════════════════════════════════════════════════════

  // RE-1
  {
    question_text:
      'Under OSHA regulations, who bears primary responsibility for ensuring robot safety in a manufacturing facility — the robot manufacturer, the system integrator, or the employer?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The robot manufacturer bears all responsibility' },
      {
        label: 'B',
        text: 'Under OSHA General Duty Clause (Section 5(a)(1)), the employer bears ultimate responsibility for providing a workplace free from recognized hazards; while the manufacturer must provide safe products (per product liability law) and the integrator must design a safe system (per ISO 10218-2), the employer is responsible for ongoing safe operation, maintenance, and training',
      },
      { label: 'C', text: 'The system integrator bears all responsibility indefinitely' },
      { label: 'D', text: 'OSHA does not regulate robot safety — only the robot manufacturer standards apply' },
    ],
    correct_answers: ['B'],
    explanation:
      'OSHA Section 5(a)(1) (General Duty Clause) requires each employer to furnish a place of employment free from recognized hazards. For robot safety, the responsibility is layered but the employer has the ultimate obligation: (1) Robot manufacturer — responsible for designing a safe product per applicable standards, providing safety documentation, and declaring conformity. (2) System integrator — responsible for designing a safe robot system per ISO 10218-2, performing risk assessment, and providing user instructions for the specific installation. (3) Employer — responsible for: maintaining the safety systems, training operators, enforcing safe work procedures, reporting incidents, and ensuring ongoing compliance. The employer cannot delegate this responsibility by claiming "the integrator signed off on it." OSHA citations are issued to the employer, not the manufacturer or integrator.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['OSHA', 'employer-responsibility', 'general-duty-clause', 'liability'],
  },

  // RE-2
  {
    question_text:
      'A manufacturer offers to provide "favorable review placement" on a robotics information platform in exchange for a marketing partnership fee. Under ethical guidelines for editorial independence, how should this be handled?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Accept the fee and adjust the review ranking accordingly — this is standard practice' },
      {
        label: 'B',
        text: 'Decline the offer — editorial content (reviews, scores, recommendations) must be completely independent of financial relationships; advertising and sponsored content must be clearly separated and labeled, and must never influence editorial rankings or scores',
      },
      { label: 'C', text: 'Accept the fee but do not change the review content' },
      { label: 'D', text: 'Only accept if the manufacturer product is already top-ranked' },
    ],
    correct_answers: ['B'],
    explanation:
      'Editorial independence is a fundamental ethical principle for any platform that provides reviews, ratings, or recommendations. Accepting payment to influence placement violates: (1) Reader trust — users rely on independent, unbiased information to make purchasing decisions. Once editorial is compromised, the platform value is destroyed. (2) FTC guidelines — in the US, the Federal Trade Commission requires clear disclosure of material connections between endorsers and advertisers. Disguising paid placement as editorial content is deceptive. (3) Professional ethics — media ethics standards (SPJ, ASME) strictly prohibit advertiser influence on editorial content. The correct approach is a clear separation: advertising (clearly labeled as such) generates revenue, while editorial content is produced independently. The sales team should never communicate advertiser expectations to the editorial team.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['editorial-independence', 'ethics', 'FTC-guidelines', 'conflict-of-interest'],
  },

  // RE-3
  {
    question_text:
      'A warehouse deploying AMRs collects operational data including: AMR positions (real-time), worker badge locations (real-time), pick rates per worker, and near-miss incident logs. Which data privacy concern is MOST significant?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'AMR position data may be stolen by competitors' },
      {
        label: 'B',
        text: 'Real-time worker location tracking combined with individual productivity metrics enables invasive employee surveillance that may violate workplace privacy expectations, labor agreements, and potentially GDPR/state privacy laws; the data collection scope and purpose must be transparent, minimized to operational necessity, and subject to employee notification and consent',
      },
      { label: 'C', text: 'Near-miss logs could be used in advertising campaigns' },
      { label: 'D', text: 'AMR operational data consumes too much cloud storage' },
    ],
    correct_answers: ['B'],
    explanation:
      'The convergence of AMR and worker tracking data creates a powerful surveillance capability: (1) Real-time location tracking shows exactly where each worker is at all times. (2) Combined with pick-rate data, it reveals individual productivity, break duration, and movement efficiency. (3) This enables monitoring that goes far beyond operational necessity — it can measure bathroom break duration, social interaction time, and micro-level work patterns. Legal and ethical concerns: (1) GDPR (EU) — requires lawful basis, data minimization, and transparency for processing employee personal data. (2) US state laws — Illinois BIPA, California CCPA/CPRA, and other state laws have employee data provisions. (3) Labor agreements — many collective bargaining agreements restrict electronic monitoring. (4) Ethical concerns — pervasive monitoring negatively affects worker well-being, trust, and retention. Best practice: collect only data necessary for safety and operational optimization, anonymize/aggregate when possible, clearly communicate what is collected and why, and restrict access to the data.',
    real_world_context:
      'Amazon warehouse worker monitoring practices have been extensively criticized by labor organizations and regulators. The EU Parliament has passed regulations on algorithmic management in the workplace, and several US states have introduced bills restricting automated worker surveillance.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['data-privacy', 'worker-surveillance', 'GDPR', 'workplace-ethics'],
  },

  // RE-4
  {
    question_text:
      'An OSHA inspector visits a facility with a robot cell and finds that the employer has not maintained the risk assessment documentation provided by the integrator, the operator training records are incomplete, and the safety system annual inspection has not been performed. Which OSHA violations could be cited?',
    question_type: 'multi_select',
    difficulty: 2,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'General Duty Clause violation — failure to maintain recognized safety documentation for a known hazard (industrial robot)' },
      { label: 'B', text: 'Recordkeeping violation — failure to maintain training records as required by hazard-specific training standards' },
      { label: 'C', text: 'Failure to follow manufacturer/integrator safety recommendations — which OSHA considers evidence of recognized standard of care' },
      { label: 'D', text: 'Violation of OSHA robot-specific standard 29 CFR 1910.400 (which does not exist)' },
      { label: 'E', text: 'Violation of the employer dress code policy' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'While OSHA does not have a robot-specific standard (D is fictional), several general OSHA requirements apply: (A) General Duty Clause (Section 5(a)(1)) — the employer must address recognized hazards. Industrial robots are well-established hazards with recognized safety standards (ANSI/RIA 15.06, which adopts ISO 10218). Failure to maintain safety documentation demonstrates inadequate hazard management. (B) Training requirements under 29 CFR 1910.332 (electrical safety training) and the General Duty Clause obligation to train workers on recognized hazards. Incomplete training records are a citable violation. (C) When manufacturers and integrators provide safety recommendations (inspection intervals, operating procedures, PPE requirements), failure to follow them demonstrates that the employer knew of the hazard and the appropriate precautions but did not implement them. OSHA uses ANSI/RIA 15.06 as a recognized consensus standard to evaluate employer compliance.',
    real_world_context:
      'OSHA has cited employers under the General Duty Clause for robot-related incidents, including fatalities. In several cases, failure to follow the integrator safety manual was cited as evidence of employer negligence.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['OSHA-violations', 'general-duty-clause', 'training-records', 'safety-documentation'],
  },

  // RE-5
  {
    question_text:
      'Under the EU Machinery Directive (2006/42/EC), what document must the robot system integrator provide before a robot cell can legally be put into service in an EU member state?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'A purchase order signed by both parties' },
      {
        label: 'B',
        text: 'A Declaration of Conformity (DoC) and CE marking, along with comprehensive technical documentation including the risk assessment, safety circuit diagrams, and operating instructions in the official language of the member state',
      },
      { label: 'C', text: 'A verbal confirmation that the system is safe' },
      { label: 'D', text: 'Only the robot manufacturer CE certificate is required; the integrator has no obligation' },
    ],
    correct_answers: ['B'],
    explanation:
      'The EU Machinery Directive 2006/42/EC (to be replaced by the Machinery Regulation 2023/1230 from January 2027) requires that any machine placed on the EU market or put into service must: (1) Have a Declaration of Conformity (DoC) — a formal document signed by the manufacturer (or integrator for assembled systems) declaring that the machine meets all applicable Essential Health and Safety Requirements. (2) Bear the CE marking — indicating conformity with EU legislation. (3) Have a technical file — including: risk assessment per ISO 12100, safety circuit design and validation, test reports, and instructions for use in the official language(s) of the country where the machine will be used. Importantly, the system integrator (not just the robot manufacturer) is considered the "manufacturer" of the complete robot system under the Directive, and bears the obligation for the integrated cell CE marking.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['EU-Machinery-Directive', 'CE-marking', 'Declaration-of-Conformity', 'integrator-obligations'],
  },

  // RE-6
  {
    question_text:
      'A robot strikes a worker causing injury that requires hospitalization. Under OSHA, within what timeframe must the employer report this incident, and to whom?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Within 30 days, by email to the local fire department' },
      {
        label: 'B',
        text: 'Within 24 hours of the employer learning of the in-patient hospitalization, reported to the nearest OSHA Area Office by phone or online (fatalities must be reported within 8 hours)',
      },
      { label: 'C', text: 'No reporting required as long as the worker receives medical treatment' },
      { label: 'D', text: 'Within 72 hours, reported to the robot manufacturer' },
    ],
    correct_answers: ['B'],
    explanation:
      'OSHA 29 CFR 1904.39 requires employers to report: (1) Fatalities — within 8 hours. (2) In-patient hospitalizations, amputations, or loss of an eye — within 24 hours. Reports must be made to the nearest OSHA Area Office by telephone (800-321-OSHA) or electronically through OSHA online portal. The clock starts when the employer learns of the reportable event (not when it occurs, in case of delayed hospitalization). Failure to report within the required timeframe is itself a citable violation. Additionally, the employer must: record the injury on the OSHA 300 Log, preserve the incident scene for investigation, and initiate their internal incident investigation. Reporting to the robot manufacturer (D) may be required by the purchase agreement but is not an OSHA requirement.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['OSHA-reporting', 'incident-reporting', 'workplace-injury', 'compliance'],
  },

  // RE-7
  {
    question_text:
      'A company deploys an AI-powered robot that autonomously decides the optimal workflow assignment for warehouse workers. A worker discovers that the AI system consistently assigns heavier tasks to younger workers and lighter tasks to older workers, without any individual capability assessment. What ethical and legal issue does this raise?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    scenario_context:
      'A logistics company uses an AI-driven AMR fleet management system that also optimizes human worker task assignments. The system was trained on historical performance data. Analysis reveals it assigns physically demanding tasks disproportionately to workers aged 20-35 and lighter tasks to workers aged 45+, regardless of individual physical capability or preference.',
    options: [
      { label: 'A', text: 'This is efficient optimization and poses no ethical or legal concern' },
      {
        label: 'B',
        text: 'This constitutes potential age-based discrimination — the AI system is making work assignment decisions based on a protected characteristic (age) rather than individual capability; this violates the Age Discrimination in Employment Act (ADEA) and potentially Title VII, and requires immediate review of the algorithm training data and decision criteria',
      },
      { label: 'C', text: 'This is acceptable because the AI is unbiased since it is not human' },
      { label: 'D', text: 'This is only a concern if the workers file a formal complaint' },
    ],
    correct_answers: ['B'],
    explanation:
      'AI systems can encode and amplify existing biases from their training data. If historical data shows younger workers completed physically demanding tasks more often (possibly due to previous biased assignments), the AI learns this pattern and perpetuates it. Legal issues: (1) ADEA prohibits employment decisions based on age for workers 40+. Work assignments are employment decisions. (2) The AI creating a disparate impact on a protected class is actionable even without discriminatory intent. (3) The employer is liable for the AI decisions, not the AI vendor. Ethical issues: (1) Individual capability assessment must replace demographic assumptions. (2) AI decision-making must be auditable and explainable. (3) Workers must have a meaningful way to challenge AI decisions. The fix requires: removing age as a direct or proxy variable, using individual capability assessments, implementing bias auditing, and providing human oversight of AI work assignments.',
    real_world_context:
      'The EU AI Act classifies AI systems used for worker management and task allocation as high-risk, requiring conformity assessments, human oversight, and bias auditing. The EEOC has issued guidance specifically addressing AI-based employment discrimination.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['AI-bias', 'age-discrimination', 'ADEA', 'algorithmic-fairness', 'worker-rights'],
  },

  // RE-8
  {
    question_text:
      'ANSI/RIA 15.06 is the primary US standard for industrial robot safety. What is its relationship to ISO 10218?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'They are competing standards with contradictory requirements' },
      {
        label: 'B',
        text: 'ANSI/RIA 15.06 adopts ISO 10218 (Parts 1 and 2) as the American National Standard with some US-specific annexes addressing OSHA requirements and US regulatory context; they are harmonized and substantially equivalent',
      },
      { label: 'C', text: 'ANSI/RIA 15.06 only applies to collaborative robots, not industrial robots' },
      { label: 'D', text: 'ISO 10218 supersedes ANSI/RIA 15.06 and the US standard is no longer valid' },
    ],
    correct_answers: ['B'],
    explanation:
      'ANSI/RIA 15.06 (currently the 2012 edition, with a revision in progress) adopts ISO 10218 Parts 1 and 2 as the American National Standard through the ANSI adoption process. The US version includes additional informative annexes addressing US-specific regulatory requirements (OSHA compliance, NFPA electrical codes, etc.) and practical guidance. The core technical requirements are substantially identical to ISO 10218. This harmonization means a robot system compliant with ISO 10218 is also substantially compliant with ANSI/RIA 15.06, and vice versa. The Robotic Industries Association (now part of A3 — Association for Advancing Automation) maintains the standard. While not legally mandatory (OSHA enforces the General Duty Clause, not specific standards), ANSI/RIA 15.06 is recognized as the consensus standard and is referenced in OSHA enforcement guidance.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['ANSI-RIA-15.06', 'ISO-10218', 'US-standards', 'harmonization'],
  },

  // RE-9
  {
    question_text:
      'A robot system collects video data from cameras mounted on a cobot for quality inspection. A worker union raises concerns about the camera recording workers. What is the appropriate response?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Workers have no right to privacy in a manufacturing environment' },
      {
        label: 'B',
        text: 'Implement privacy-by-design: ensure cameras are positioned and configured to capture only the inspection area, implement image masking or blurring for any incidental worker capture, establish a data retention policy (delete images after quality verification), provide transparent documentation of what is captured and why, and negotiate with the union on monitoring boundaries',
      },
      { label: 'C', text: 'Remove all cameras from the robot to eliminate the concern' },
      { label: 'D', text: 'Tell the union that the cameras only record parts, not people, and no changes are needed' },
    ],
    correct_answers: ['B'],
    explanation:
      'Privacy-by-design is both an ethical best practice and increasingly a legal requirement: (1) Data minimization — capture only what is necessary for the stated purpose (quality inspection). Position cameras to minimize incidental capture of workers. (2) Technical controls — implement real-time blurring or masking of human figures in the camera field of view; many industrial vision systems support region-of-interest masking. (3) Retention policy — quality inspection images should be deleted after verification (hours or days, not months). (4) Transparency — clearly document what is captured, the purpose, who has access, and the retention period. (5) Union engagement — worker representatives have legitimate standing to negotiate monitoring boundaries under the National Labor Relations Act (NLRA). Dismissing concerns (A, D) risks labor disputes, legal action, and trust erosion. Removing cameras (C) may not be necessary if privacy controls are properly implemented.',
    real_world_context:
      'European manufacturers are subject to GDPR worker privacy requirements. Many German works councils (Betriebsrat) have negotiated specific agreements on camera usage in robot cells, including mandatory image anonymization and strict data retention limits.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['data-privacy', 'worker-rights', 'privacy-by-design', 'union-relations'],
  },

  // RE-10
  {
    question_text:
      'If a robot system causes property damage or injury, who is typically liable under US product liability law?',
    question_type: 'multi_select',
    difficulty: 3,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'The robot manufacturer — if the robot itself had a design or manufacturing defect' },
      { label: 'B', text: 'The system integrator — if the integration design, safety system, or risk assessment was deficient' },
      { label: 'C', text: 'The employer — if the employer failed to follow safety procedures, maintain the system, or properly train operators' },
      { label: 'D', text: 'Only the operator who was closest to the robot at the time of the incident' },
      { label: 'E', text: 'No one — robots are considered autonomous agents with their own legal liability' },
    ],
    correct_answers: ['A', 'B', 'C'],
    explanation:
      'US product liability applies to the entire supply chain, and multiple parties can be liable simultaneously: (A) Robot manufacturer — liable under strict product liability (design defect, manufacturing defect, failure to warn) if the robot itself was defective. For example, if a safety sensor fails due to a design flaw. (B) System integrator — liable if the integration was deficient: inadequate risk assessment, improper safeguarding, incorrect safety circuit design, or insufficient instructions. The integrator is considered a "manufacturer" of the integrated system. (C) Employer — liable under negligence if they failed to maintain safety systems, provide adequate training, follow established procedures, or address known hazards. Worker compensation law may limit employer liability to employees but not to third parties. Individual operators (D) are almost never personally liable — employer liability absorbs this. Robots (E) are not legal persons and cannot bear liability — their manufacturers, integrators, and operators are liable.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['product-liability', 'negligence', 'strict-liability', 'supply-chain-liability'],
  },

  // RE-11
  {
    question_text:
      'A company is deploying AMRs that share sidewalks with pedestrians in an urban delivery application. Which regulatory and ethical considerations are MOST critical?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    scenario_context:
      'A food delivery company plans to deploy a fleet of sidewalk delivery robots (30 kg, 6 km/h max speed) in a dense urban area. The robots will share pedestrian sidewalks, cross streets at crosswalks, and operate during all business hours. The city does not yet have specific personal delivery device (PDD) legislation.',
    options: [
      { label: 'A', text: 'No regulations apply since the robots are small and slow' },
      {
        label: 'B',
        text: 'Critical considerations include: pedestrian safety (especially for visually impaired, wheelchair users, and children), ADA sidewalk accessibility (the robot must not obstruct the accessible path of travel), state/local PDD legislation or the need to advocate for it, liability framework for robot-pedestrian incidents, insurance requirements, and public acceptance/community impact',
      },
      { label: 'C', text: 'Only the vehicle traffic code applies since the robot crosses streets' },
      { label: 'D', text: 'The company only needs a standard business license to operate delivery robots' },
    ],
    correct_answers: ['B'],
    explanation:
      'Sidewalk robot deployment intersects multiple regulatory and ethical domains: (1) Pedestrian safety — the robot must navigate among vulnerable populations (visually impaired people using canes/guide dogs, wheelchair users, elderly with mobility aids, children). The robot must yield to all pedestrians. (2) ADA compliance — the Americans with Disabilities Act requires accessible sidewalks. A robot blocking the accessible path of travel (typically 36" minimum clear width) creates an ADA violation. This is being actively litigated. (3) PDD legislation — many states have passed or are considering Personal Delivery Device laws (e.g., Virginia, Florida, Pennsylvania) that define weight limits, speed limits, operational requirements, and insurance mandates. Without legislation, the legal status is ambiguous. (4) Liability — who is liable when a robot trips a pedestrian? The operator company, the manufacturer, the city that permitted it? (5) Community impact — public parks, elderly neighborhoods, and school zones may have different tolerance for sidewalk robots.',
    real_world_context:
      'Starship Technologies, Serve Robotics, and Coco operate sidewalk delivery robots. Multiple cities have enacted or are debating PDD regulations. The National Federation of the Blind has raised significant concerns about sidewalk robot accessibility impacts.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['PDD-regulation', 'ADA', 'pedestrian-safety', 'urban-deployment', 'ethics'],
  },

  // RE-12
  {
    question_text:
      'What is the purpose of a "Declaration of Incorporation" as opposed to a "Declaration of Conformity" under the EU Machinery Directive?',
    question_type: 'multiple_choice',
    difficulty: 3,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'They are the same document with different names in different EU countries' },
      {
        label: 'B',
        text: 'A Declaration of Incorporation is provided by the robot manufacturer for the robot arm (a partly completed machine that cannot function safely on its own), while the Declaration of Conformity is provided by the system integrator for the complete robot system (a machine that can safely perform its intended function); the robot arm cannot be CE-marked as a complete machine until it is integrated',
      },
      { label: 'C', text: 'A Declaration of Incorporation is required for robots sold outside the EU' },
      { label: 'D', text: 'A Declaration of Conformity is for electrical safety only, while Declaration of Incorporation covers mechanical safety' },
    ],
    correct_answers: ['B'],
    explanation:
      'The EU Machinery Directive 2006/42/EC distinguishes between: (1) Partly completed machinery (Article 2(g)) — a robot arm is a partly completed machine because it cannot perform its intended function safely without integration (end-effector, safeguarding, programming, installation). The manufacturer provides a Declaration of Incorporation stating which Essential Health and Safety Requirements are met, along with assembly instructions. It does NOT receive CE marking. (2) Complete machinery — the integrated robot system (arm + tooling + safeguards + controls) can perform its intended function safely. The integrator provides a Declaration of Conformity declaring full compliance with all applicable EHSRs, and applies the CE marking. This distinction is critical because the integrator takes legal responsibility for the complete system, including aspects the robot manufacturer cannot control (safeguarding, installation, application-specific risks).',
    time_limit_seconds: 75,
    points: 1,
    tags: ['EU-Machinery-Directive', 'Declaration-of-Incorporation', 'partly-completed-machinery'],
  },

  // RE-13
  {
    question_text:
      'A robot manufacturer discovers a safety-critical firmware bug that could cause the robot to fail to stop during a safety-rated monitored stop under specific conditions. The firmware is installed on 5,000 robots worldwide. What are the manufacturer obligations?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Fix the bug in the next scheduled firmware release (6 months away)' },
      {
        label: 'B',
        text: 'Issue an immediate safety notice to all affected customers detailing the conditions that trigger the bug and interim protective measures, develop and release an expedited firmware patch, and if the risk is sufficiently severe, issue a product recall or mandatory field service action; in the EU, notify the relevant market surveillance authority',
      },
      { label: 'C', text: 'Only notify customers who have reported the issue' },
      { label: 'D', text: 'Add the bug to the known-issues list in the release notes' },
    ],
    correct_answers: ['B'],
    explanation:
      'A safety-critical defect (failure of a safety function) triggers immediate obligations: (1) Immediate notification — all affected customers must be notified of the defect, the triggering conditions, and interim protective measures (e.g., avoid the specific conditions, implement additional safeguarding). (2) Expedited patch — a firmware fix must be developed, tested, and released as quickly as possible, outside the normal release schedule. (3) Recall consideration — if the defect creates an imminent risk of serious injury and the interim measures are insufficient, a product recall (voluntary or mandatory) may be necessary. (4) Regulatory notification — in the EU, the manufacturer must notify the market surveillance authority under the Machinery Directive and potentially the RAPEX (rapid alert) system. In the US, reporting may be required to OSHA or CPSC depending on the product classification. Waiting for the next scheduled release (A), only notifying affected reporters (C), or documenting in release notes (D) are all grossly inadequate for a safety-critical defect.',
    time_limit_seconds: 75,
    points: 1,
    tags: ['product-recall', 'safety-defect', 'manufacturer-obligations', 'firmware-patch'],
  },

  // RE-14
  {
    question_text:
      'Under what circumstances is an employer required to record a robot-related injury on the OSHA 300 Log?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    options: [
      { label: 'A', text: 'Only if the injury results in a fatality' },
      {
        label: 'B',
        text: 'When the injury meets the OSHA recordability criteria: death, days away from work, restricted work or transfer, medical treatment beyond first aid, loss of consciousness, or a significant injury or illness diagnosed by a physician or licensed healthcare professional',
      },
      { label: 'C', text: 'All robot-related incidents must be recorded, including near-misses' },
      { label: 'D', text: 'Robot injuries are exempt from OSHA 300 Log recording requirements' },
    ],
    correct_answers: ['B'],
    explanation:
      'OSHA 29 CFR Part 1904 defines recordable injuries and illnesses. There is no special category for robot-related injuries — they are subject to the same recording criteria as any workplace injury: (1) Death. (2) Days away from work. (3) Restricted work or job transfer. (4) Medical treatment beyond first aid (first aid includes bandaging, ice, OTC medications; beyond first aid includes sutures, prescription medications, physical therapy). (5) Loss of consciousness. (6) Significant injury diagnosed by a healthcare professional (e.g., fracture, punctured eardrum). If a robot causes a minor bruise that only requires an ice pack (first aid), it is not recordable. If the same incident requires sutures, it is recordable. Near-misses (C) are not OSHA-recordable but should be documented in the facility internal safety system for investigation and prevention.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['OSHA-300-Log', 'recordability', 'injury-classification', 'compliance'],
  },

  // RE-15
  {
    question_text:
      'A company wants to use customer facility data collected by its AMR fleet (layout maps, traffic patterns, throughput metrics) to train AI models that it will sell to other companies. What are the ethical and legal considerations?',
    question_type: 'scenario',
    difficulty: 3,
    domain_code: 'REGULATIONS_ETHICS',
    level: 'foundation',
    scenario_context:
      'An AMR-as-a-service company deploys fleets in multiple customer warehouses. The AMRs collect detailed facility data: building layouts, storage configurations, traffic patterns, seasonal demand curves, and worker-robot interaction metrics. The company wants to aggregate this data to train an "AI warehouse optimization model" that it will license to consulting firms and new customers.',
    options: [
      { label: 'A', text: 'The AMR company owns all data collected by its robots and can use it freely' },
      {
        label: 'B',
        text: 'This raises serious concerns: (1) Data ownership — customer facility data may be considered trade secrets or confidential business information protected by the service agreement; (2) Competitive harm — sharing aggregated competitor data (even anonymized) could reveal competitive intelligence; (3) Consent — customers likely did not consent to their operational data being used for third-party product development; (4) The practice requires explicit contractual permission, meaningful anonymization/aggregation that prevents re-identification, and transparency with customers',
      },
      { label: 'C', text: 'As long as the data is anonymized, no consent is needed' },
      { label: 'D', text: 'Data collected by machines is not subject to privacy or confidentiality laws' },
    ],
    correct_answers: ['B'],
    explanation:
      'Operational data collected in customer facilities carries significant ethical and legal obligations: (1) Trade secret protection — warehouse layout, inventory placement, throughput metrics, and operational patterns are competitively sensitive information. Misuse could violate the Defend Trade Secrets Act (DTSA) and state trade secret laws. (2) Contractual obligations — most enterprise service agreements contain confidentiality clauses that restrict use of customer data beyond service delivery. Using the data for AI training and licensing likely exceeds the contractual scope. (3) Anonymization limitations — warehouse operational data may be re-identifiable from the combination of layout, location, throughput, and seasonal patterns, even without explicit identifiers. (4) Competitive intelligence — if the AMR company serves competitors in the same market, aggregated insights could constitute sharing competitive intelligence. Best practice: explicitly address data ownership and usage rights in the service agreement, obtain opt-in consent for any secondary use, implement genuine de-identification, and allow customers to opt out.',
    real_world_context:
      'This is an active debate in the robotics-as-a-service industry. Several major AMR companies include data usage clauses in their service agreements, and customer procurement teams are increasingly scrutinizing these terms.',
    time_limit_seconds: 90,
    points: 2,
    tags: ['data-ownership', 'trade-secrets', 'RaaS-ethics', 'competitive-intelligence'],
  },
];
