/**
 * RCO Awareness (Level 0) — Entry-Level Question Bank
 *
 * 40 questions across 5 domains for NON-TECHNICAL people.
 * Plain language, real scenarios, testing understanding and judgment.
 * No jargon. No memorization. Just practical robot literacy.
 *
 * Domain distribution:
 *   ROBOT_REVOLUTION     8 — Why robots now, types, real deployments
 *   HOW_ROBOTS_WORK      8 — Sensors, actuators, AI, power, comms
 *   ROBOT_SAFETY_BASIC   8 — Safety rules, emergencies, myths
 *   ROBOT_ECONOMY        8 — Buy vs lease, RaaS, ROI, industry direction
 *   FIRST_INTERACTION    8 — Starting/stopping, error lights, clearing paths
 *
 * Difficulty: All 1-2 (beginner friendly)
 * Types: All multiple_choice (4 options, 1 correct)
 */

export interface RcoQuestionV2 {
  question_text: string;
  question_type: 'multiple_choice' | 'scenario';
  difficulty: number;
  domain_code: string;
  level: 'awareness';
  scenario_context?: string;
  options: { label: string; text: string }[];
  correct_answers: string[];
  explanation: string;
  real_world_context?: string;
  time_limit_seconds?: number;
  points?: number;
  tags: string[];
}

export const AWARENESS_QUESTIONS: RcoQuestionV2[] = [
  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 1: ROBOT_REVOLUTION (8 questions)
  // Why robots now, types, real deployments, human opportunity
  // ═══════════════════════════════════════════════════════════════

  // RR-1
  {
    question_text:
      'A local warehouse just announced they\'re bringing in robots to help with order picking. Several employees are worried about losing their jobs. Based on what actually happens at most companies that add warehouse robots, what\'s the most likely outcome?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Every warehouse worker will be replaced within a year' },
      { label: 'B', text: 'Workers will be retrained to manage and work alongside the robots, with fewer physically demanding tasks' },
      { label: 'C', text: 'The robots will break down constantly and get removed within months' },
      { label: 'D', text: 'Nothing will change because robots can\'t do warehouse work' },
    ],
    correct_answers: ['B'],
    explanation:
      'Companies like Amazon, DHL, and Walmart have added tens of thousands of warehouse robots, and their human workforce has actually grown. The roles shift: instead of walking 15 miles a day pulling items from shelves, workers supervise robots, handle exceptions, and focus on tasks requiring judgment and dexterity. Physically demanding and repetitive work decreases, while higher-skill roles increase.',
    real_world_context:
      'Amazon employs over 750,000 robots alongside more than 1.5 million human workers. Their warehouse injury rates dropped in facilities using robots for heavy lifting.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['jobs', 'warehouse', 'misconceptions', 'workforce-impact'],
  },

  // RR-2
  {
    question_text:
      'You see four different robots during a single day: one vacuuming a hotel lobby, one delivering food at a restaurant, one welding car parts in a factory, and one mowing a lawn. What do these robots have in common?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'They all use artificial intelligence to make creative decisions' },
      { label: 'B', text: 'They all perform tasks that are repetitive, physically demanding, or tedious for humans' },
      { label: 'C', text: 'They all require a human operator controlling them at all times' },
      { label: 'D', text: 'They all cost over $100,000' },
    ],
    correct_answers: ['B'],
    explanation:
      'The common thread across all types of robots — whether in hospitality, food service, manufacturing, or home use — is that they handle work that is repetitive, physically demanding, dirty, or tedious. This is often called the "4 D\'s" of robotics: dull, dirty, dangerous, and dear (expensive when done by humans). Not all robots use advanced AI, need constant human control, or cost six figures.',
    real_world_context:
      'Robot vacuums cost as little as $200, while industrial welding robots can exceed $500,000. The price range is enormous, but the principle is the same: automate the repetitive stuff.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['robot-types', 'use-cases', 'fundamentals'],
  },

  // RR-3
  {
    question_text:
      'Your neighbor says: "Robots are brand new technology — we don\'t know if they really work yet." What\'s the best response based on facts?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'They\'re right — robots only started working reliably in 2024' },
      { label: 'B', text: 'Industrial robots have been used in factories since the 1960s, and newer robots for homes and businesses have years of proven track records' },
      { label: 'C', text: 'Robots only work in Japan and South Korea where the technology is more advanced' },
      { label: 'D', text: 'Robots work well in labs but fail in the real world' },
    ],
    correct_answers: ['B'],
    explanation:
      'The first industrial robot, Unimate, started working on a General Motors assembly line in 1961. Since then, robots have been welding cars, assembling electronics, and handling materials in factories worldwide for over 60 years. Consumer robots like the Roomba have been in homes since 2002. This is mature, proven technology — what\'s new is robots moving into more everyday settings like restaurants, hospitals, and stores.',
    real_world_context:
      'Over 4 million industrial robots are operating in factories globally. iRobot has sold over 40 million Roomba vacuums since 2002.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['history', 'misconceptions', 'maturity'],
  },

  // RR-4
  {
    question_text:
      'A hospital administrator is considering adding robots. Which of these is a real, proven use of robots in hospitals today — not science fiction?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Robots that autonomously perform surgery without any surgeon present' },
      { label: 'B', text: 'Robots that deliver medications, meals, and linens between floors, freeing nurses to focus on patient care' },
      { label: 'C', text: 'Robots that diagnose patients and prescribe treatments' },
      { label: 'D', text: 'Robots that replace all janitorial staff' },
    ],
    correct_answers: ['B'],
    explanation:
      'Hospital delivery robots like the Aethon TUG and Savioke Relay are used in hundreds of hospitals today. They navigate hallways, ride elevators, and deliver medications, lab samples, meals, and clean linens. This frees nurses and staff from making routine delivery runs, letting them spend more time with patients. Surgical robots like the da Vinci system always have a surgeon in control — they assist, not replace.',
    real_world_context:
      'The UCSF Medical Center uses TUG robots that travel over 1,000 miles per month through hospital corridors, completing deliveries that would otherwise require staff to make thousands of trips.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['healthcare', 'real-deployments', 'use-cases'],
  },

  // RR-5
  {
    question_text:
      'Why are robots becoming more common in everyday businesses RIGHT NOW, when the basic technology has existed for decades?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'A single breakthrough invention in 2023 made all robots possible' },
      { label: 'B', text: 'Sensors, computing power, and AI have gotten dramatically cheaper and better, while labor shortages have made automation more attractive' },
      { label: 'C', text: 'Government regulations now require businesses to use robots' },
      { label: 'D', text: 'Robots were always this common — the media is just covering them more now' },
    ],
    correct_answers: ['B'],
    explanation:
      'Several trends converged: the cost of sensors like cameras and lidar dropped by over 90% in a decade, computing power increased while shrinking in size, AI software improved dramatically (especially for navigation and object recognition), and many industries face persistent labor shortages. It\'s not one breakthrough — it\'s a combination of cheaper hardware, better software, and stronger economic incentive.',
    real_world_context:
      'A lidar sensor that cost $75,000 in 2012 can now be purchased for under $500. Meanwhile, the US has over 8 million unfilled jobs, many in warehouses, restaurants, and healthcare.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['trends', 'economics', 'technology-convergence'],
  },

  // RR-6
  {
    question_text:
      'A friend tells you they saw a "robot" at a trade show that turned out to be a person inside a costume. This is embarrassing, but it highlights an important question: what ACTUALLY makes something a robot rather than just a fancy machine?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'It has to look like a human' },
      { label: 'B', text: 'It must be able to sense its environment, make decisions based on that information, and take physical action' },
      { label: 'C', text: 'It needs to be controlled by artificial intelligence' },
      { label: 'D', text: 'It has to be able to hold a conversation' },
    ],
    correct_answers: ['B'],
    explanation:
      'A robot is defined by three core capabilities: sensing (gathering information about its environment through cameras, touch sensors, etc.), processing (making decisions based on that information), and acting (moving, gripping, or otherwise physically affecting the world). It doesn\'t need to look human, use AI, or talk. A Roomba vacuum is a true robot — it senses obstacles, decides where to clean next, and physically moves and vacuums.',
    real_world_context:
      'Most working robots look nothing like humans. Warehouse robots are often flat platforms, surgical robots are mechanical arms, and agricultural robots may look like small tractors.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['definitions', 'fundamentals', 'sense-think-act'],
  },

  // RR-7
  {
    question_text:
      'A retail store owner says: "Robots are only for giant corporations like Amazon. My 20-employee store could never use one." Is this accurate?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Yes — robots are too expensive and complex for small businesses' },
      { label: 'B', text: 'No — small businesses can now rent robots by the month for tasks like floor cleaning, inventory scanning, and delivery, often for less than minimum wage' },
      { label: 'C', text: 'Only if the store has at least 50 employees to manage the robots' },
      { label: 'D', text: 'Robots only work in warehouses, not retail stores' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robot-as-a-Service (RaaS) has made robots accessible to businesses of all sizes. Companies like Brain Corp, Avidbots, and Bear Robotics offer commercial cleaning robots and service robots on monthly subscriptions — sometimes for less than $1,000/month. Many restaurants with fewer than 10 employees use delivery robots that cost less per hour than a minimum-wage worker. You don\'t need to be Amazon to benefit.',
    real_world_context:
      'Pudu Robotics reports that most of their restaurant delivery robot customers are independent restaurants with 5-20 employees, not chains.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['small-business', 'accessibility', 'raas', 'misconceptions'],
  },

  // RR-8
  {
    question_text:
      'Which of these statements about robots and jobs reflects what researchers and economists have actually observed?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_REVOLUTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Every robot eliminates exactly one human job' },
      { label: 'B', text: 'Countries with the most robots per worker (like South Korea, Japan, Germany) tend to have LOW unemployment, not high' },
      { label: 'C', text: 'Robots have caused mass unemployment everywhere they\'ve been deployed' },
      { label: 'D', text: 'Only developing countries benefit from robots; wealthy countries lose jobs' },
    ],
    correct_answers: ['B'],
    explanation:
      'This surprises many people, but the data is clear: the countries with the highest robot density (robots per 10,000 workers) — South Korea, Singapore, Japan, Germany — consistently have some of the lowest unemployment rates in the world. Robots tend to make companies more competitive, which helps them grow and create new types of jobs. The relationship between robots and employment is much more nuanced than "robots steal jobs."',
    real_world_context:
      'South Korea has over 1,000 robots per 10,000 manufacturing workers (the world\'s highest density) and an unemployment rate typically under 4%. Germany has over 400 robots per 10,000 workers with similarly low unemployment.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['jobs', 'economics', 'data-driven', 'misconceptions'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 2: HOW_ROBOTS_WORK (8 questions)
  // Sensors, actuators, AI, power, communication — plain language
  // ═══════════════════════════════════════════════════════════════

  // HRW-1
  {
    question_text:
      'A delivery robot is rolling down a sidewalk and suddenly stops before hitting a fire hydrant it\'s never seen before. How did it know the hydrant was there?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Someone with a remote control saw the hydrant and stopped the robot' },
      { label: 'B', text: 'The robot has sensors (like cameras and laser scanners) that detect objects in its path, even ones it hasn\'t encountered before' },
      { label: 'C', text: 'Every fire hydrant in the city was pre-programmed into the robot\'s map' },
      { label: 'D', text: 'The robot got lucky — it was about to turn anyway' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robots use sensors to perceive the world around them in real time. Common sensors include cameras (which see like eyes), lidar (which uses laser beams to measure distance to objects), and ultrasonic sensors (which work like sonar). These sensors detect ANY object in the robot\'s path — not just pre-programmed ones. The robot doesn\'t need to know it\'s a fire hydrant; it just knows "something solid is here, don\'t hit it."',
    real_world_context:
      'Starship Technologies delivery robots use 12 cameras, ultrasonic sensors, and radar to navigate sidewalks in cities and college campuses, making millions of deliveries.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['sensors', 'navigation', 'obstacle-detection'],
  },

  // HRW-2
  {
    question_text:
      'You notice that a warehouse robot has a flashing light on top, makes beeping sounds when backing up, and displays a screen showing its destination. Why does it have all these features?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'They\'re decorative features to make the robot look more advanced' },
      { label: 'B', text: 'They help the robot communicate with humans nearby — showing what it\'s doing, where it\'s going, and warning people when it moves' },
      { label: 'C', text: 'They\'re required by law on all electronic devices' },
      { label: 'D', text: 'They help the robot see better in dark warehouses' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robots that work around people need ways to communicate their intentions and status — just like cars use turn signals and brake lights. Flashing lights indicate the robot is active, beeping warns people it\'s moving (especially in reverse where people might not see it), and screens or displays share information like destination or status. This is called "legibility" — making the robot\'s behavior understandable to the humans around it.',
    real_world_context:
      'Locus Robotics warehouse robots use colored light bars that change color to show status: green means moving, yellow means waiting, red means stopped/error. Workers learn the system in minutes.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['communication', 'human-robot-interaction', 'safety-signals'],
  },

  // HRW-3
  {
    question_text:
      'A cleaning robot at a shopping mall runs for 4 hours, then drives itself to a charging station in the corner and parks there for 2 hours before resuming cleaning. What does this tell you about how the robot is powered?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'It runs on gasoline and needs to refuel' },
      { label: 'B', text: 'It uses rechargeable batteries and returns to charge itself when power runs low, similar to how you charge your phone' },
      { label: 'C', text: 'It plugs into a wall outlet with an extension cord while it works' },
      { label: 'D', text: 'It uses solar panels on its surface' },
    ],
    correct_answers: ['B'],
    explanation:
      'Most mobile robots — from Roombas to warehouse bots to mall cleaners — run on rechargeable lithium-ion batteries, similar to what\'s in your phone or laptop, just larger. When the battery gets low, the robot navigates itself back to a charging station (called "docking") and recharges. This is fully automatic: the robot monitors its own battery level and decides when to charge. Some advanced robots can even plan their routes to ensure they finish a task before needing to charge.',
    real_world_context:
      'The Avidbots Neo floor-cleaning robot can clean for up to 3 hours on a single charge, covering approximately 50,000 square feet, then docks itself to recharge.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['power', 'batteries', 'charging', 'autonomy'],
  },

  // HRW-4
  {
    question_text:
      'A factory robot arm picks up car doors all day long, placing each one in exactly the same position with millimeter precision. A delivery robot navigates busy sidewalks where every trip is different. What\'s the key difference in how these two robots "think"?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'The factory robot is real and the delivery robot is just a prototype' },
      { label: 'B', text: 'The factory robot follows a fixed, pre-programmed sequence, while the delivery robot uses AI to make decisions in real time based on what it sees' },
      { label: 'C', text: 'The delivery robot is more expensive, so it\'s smarter' },
      { label: 'D', text: 'There\'s no difference — all robots think the same way' },
    ],
    correct_answers: ['B'],
    explanation:
      'This is one of the most important distinctions in robotics. Traditional industrial robots follow exact, pre-programmed movements — they do the same thing the same way every time, which is perfect for factory assembly. Robots that navigate unpredictable environments need artificial intelligence to perceive their surroundings, identify obstacles, plan routes, and make decisions on the fly. Both approaches are valid — the right one depends on the task.',
    real_world_context:
      'A car factory robot arm might execute the same welding pattern 500,000 times with sub-millimeter precision. A Nuro delivery robot might take a slightly different route every single trip depending on traffic, pedestrians, and road conditions.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['ai', 'programming', 'fixed-vs-adaptive', 'decision-making'],
  },

  // HRW-5
  {
    question_text:
      'You see a robot vacuum bump into your couch, back up, turn slightly, and go around it. Your friend\'s newer robot vacuum seems to "know" the entire room layout and never bumps into anything. What likely explains the difference?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Your vacuum is broken and needs to be returned' },
      { label: 'B', text: 'Your vacuum uses simple bump sensors (feel when it hits something), while the newer one uses a camera or laser to map the room and plan efficient paths' },
      { label: 'C', text: 'Your friend\'s vacuum was told the room layout by the manufacturer' },
      { label: 'D', text: 'Both vacuums work the same way — the difference is just random' },
    ],
    correct_answers: ['B'],
    explanation:
      'This perfectly illustrates how different sensors create different robot behaviors. Early robot vacuums used bump sensors and random movement patterns — simple but effective. Modern robot vacuums use lidar (laser scanning) or cameras to build a complete map of your home, then plan the most efficient cleaning path. Better sensors lead to smarter navigation. This same principle applies to all robots: the quality and type of sensors determine how well a robot understands its environment.',
    real_world_context:
      'The iRobot Roomba j7+ uses a front-facing camera with AI to recognize and avoid specific objects like shoes, pet waste, and cables. Earlier models relied entirely on bump-and-turn navigation.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['sensors', 'navigation', 'mapping', 'consumer-robots'],
  },

  // HRW-6
  {
    question_text:
      'A hotel robot delivers room service to the 8th floor. To do this, it needs to: navigate the hallway, call the elevator, ride to the correct floor, find the room, and alert the guest. How does the robot communicate with the elevator?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'A human staff member presses the elevator button for it every time' },
      { label: 'B', text: 'The robot is connected to the building\'s elevator system through WiFi or a special network, so it can request floors digitally' },
      { label: 'C', text: 'The robot has a mechanical arm that physically pushes the buttons' },
      { label: 'D', text: 'The robot can only work on one floor and uses stairs' },
    ],
    correct_answers: ['B'],
    explanation:
      'Most delivery robots in hotels and hospitals are integrated with the building\'s systems through wireless networks. The robot sends a digital request to the elevator control system (like "send an elevator to floor 3, I need to go to floor 8"), rides the elevator, and proceeds to its destination. This is a great example of how robots communicate with other machines — not through buttons or voice, but through digital signals over WiFi, Bluetooth, or dedicated networks.',
    real_world_context:
      'The Relay robot by Savioke (used in hundreds of hotels) integrates with elevator systems from Otis, Schindler, and other manufacturers to navigate multi-floor buildings autonomously.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['communication', 'networking', 'building-integration', 'iot'],
  },

  // HRW-7
  {
    question_text:
      'A warehouse manager notices that a robot picking items from shelves occasionally grabs the wrong product. A technician explains that the robot\'s camera "can\'t tell the difference between two similar-looking packages." What does this reveal about how robots see?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Robot cameras are low quality and need to be replaced with human eyes' },
      { label: 'B', text: 'Robots process visual information differently than humans — they rely on patterns, colors, and shapes, and can struggle with items that look similar to their software' },
      { label: 'C', text: 'The robot is intentionally picking wrong items to be replaced with a newer model' },
      { label: 'D', text: 'Cameras don\'t actually help robots — they just use GPS to find items' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robot vision (called "computer vision") works very differently from human sight. A robot camera captures images and software analyzes the pixels to identify objects by shape, color, size, and learned patterns. When two packages look very similar — same size, similar labels, close colors — the software may not distinguish them reliably. This is why many warehouses add barcodes, QR codes, or RFID tags to help robots identify items accurately. Understanding robot limitations helps you set up better environments for them.',
    real_world_context:
      'Amazon\'s warehouses use a combination of cameras and barcode scanning on their picking robots to ensure accuracy. The barcode provides certainty where vision alone might be ambiguous.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['computer-vision', 'limitations', 'sensors', 'accuracy'],
  },

  // HRW-8
  {
    question_text:
      'You watch a robot arm in a bakery carefully frost a cake. It can frost 200 cakes per hour with perfect consistency. A human baker can frost 30 per hour but each one looks unique. What is the robot actually good at here?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'HOW_ROBOTS_WORK',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Being creative with frosting designs' },
      { label: 'B', text: 'Repeating the exact same motion with high speed and precision, without getting tired or inconsistent' },
      { label: 'C', text: 'Tasting the frosting to check quality' },
      { label: 'D', text: 'Deciding what kind of cake to make' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robots excel at repetition: doing the same task over and over with the same precision, at high speed, without fatigue, boredom, or variation. A robot doesn\'t get tired at hour 6, doesn\'t rush on a Friday afternoon, and doesn\'t vary its technique. This is the core strength of robotic actuators (the motors and mechanisms that create movement). Creativity, taste, and deciding what to make remain firmly in the human domain.',
    real_world_context:
      'Deco-Bot by Unifiller Systems can decorate 1,200 cupcakes per hour with identical precision. Many bakeries use robots for repetitive decoration while skilled bakers handle custom and artistic work.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['actuators', 'precision', 'repetition', 'strengths'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 3: ROBOT_SAFETY_BASIC (8 questions)
  // 5 safety rules, emergencies, what to do when robot stops, myths
  // ═══════════════════════════════════════════════════════════════

  // RSB-1
  {
    question_text:
      'You\'re walking through a warehouse and a mobile robot is coming toward you in a shared aisle. What\'s the safest thing to do?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Run past it quickly before it gets to you' },
      { label: 'B', text: 'Walk normally and predictably — the robot will detect you and navigate around you, just like it does with other obstacles' },
      { label: 'C', text: 'Lie flat on the ground so the robot doesn\'t see you' },
      { label: 'D', text: 'Jump on top of it to stop it from moving' },
    ],
    correct_answers: ['B'],
    explanation:
      'Modern warehouse robots are designed to work safely around people. Their sensors detect humans and they\'re programmed to slow down, stop, or navigate around you. The safest thing you can do is behave predictably — walk normally, don\'t make sudden movements, and let the robot\'s navigation system do its job. Running, jumping, or making sudden movements can actually confuse the robot\'s prediction of where you\'re going.',
    real_world_context:
      'Collaborative mobile robots from companies like MiR and Locus Robotics are safety-certified (ISO 3691-4) for operation in shared human-robot spaces and are used in thousands of warehouses.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['safety-rules', 'shared-spaces', 'pedestrian-behavior'],
  },

  // RSB-2
  {
    question_text:
      'A coworker says: "Don\'t worry about that robot arm — it\'s programmed to not hurt people, so you can reach into its work area to grab your coffee mug." Is this safe?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Yes — all modern robots automatically stop when a human is near' },
      { label: 'B', text: 'No — NEVER enter a robot\'s work area without following proper safety procedures, even if someone says it\'s safe. Not all robot arms are designed to stop for humans.' },
      { label: 'C', text: 'It\'s fine as long as the robot is moving slowly' },
      { label: 'D', text: 'It\'s safe if you move quickly enough' },
    ],
    correct_answers: ['B'],
    explanation:
      'This is safety rule number one: NEVER enter a robot\'s designated work area without proper procedures. Traditional industrial robot arms are powerful, fast, and may NOT have sensors to detect humans in their workspace — they\'re designed to work behind safety barriers. Even collaborative robots (cobots) that are designed to work near humans have limits. Always assume a robot arm\'s workspace is off-limits unless you have been specifically trained and authorized to enter it.',
    real_world_context:
      'Industrial robot arms can move at speeds over 6 feet per second with hundreds of pounds of force. Even a "small" robot arm can cause serious injury. Safety cages and light curtains exist for a reason.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['safety-rules', 'work-area', 'industrial-safety', 'critical'],
  },

  // RSB-3
  {
    question_text:
      'You\'re at work and a mobile robot suddenly stops in the middle of a hallway and starts flashing a red light. People are walking around it. What should you do?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Kick it to get it moving again' },
      { label: 'B', text: 'Give it space, don\'t try to move it yourself, and notify the designated robot contact or supervisor so they can address it properly' },
      { label: 'C', text: 'Ignore it — it\'ll figure it out eventually' },
      { label: 'D', text: 'Unplug it immediately' },
    ],
    correct_answers: ['B'],
    explanation:
      'A robot flashing red has detected a problem — it could be a sensor issue, a blocked path, a low battery, or a software error. The safest response is to give it space (don\'t push, kick, or try to manually move it) and alert the person responsible for robot operations. Trying to force the robot to move could injure you or damage the robot. Most facilities have a simple process for reporting robot issues — learn it on your first day.',
    real_world_context:
      'At most facilities with robots, there\'s a simple reporting procedure: tell your supervisor or tap a button on a wall panel. The robot ops team handles the rest. It\'s no different from reporting a broken vending machine.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['safety-rules', 'error-handling', 'reporting', 'red-light'],
  },

  // RSB-4
  {
    question_text:
      'Almost every robot you\'ll encounter in a workplace has a large, usually red, mushroom-shaped button somewhere on its body. What is it for?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'It\'s the power button to turn the robot on and off normally' },
      { label: 'B', text: 'It\'s the emergency stop button — pressing it immediately stops all robot movement in case of a safety concern' },
      { label: 'C', text: 'It\'s a decoration required by the manufacturer' },
      { label: 'D', text: 'It makes the robot go faster' },
    ],
    correct_answers: ['B'],
    explanation:
      'The emergency stop (E-stop) button is the single most important safety feature on any robot. When pressed, it immediately cuts power to the robot\'s motors, stopping all movement. It\'s big, red, and mushroom-shaped so that ANYONE can find it and press it quickly in an emergency, even someone who has never seen the robot before. Every person working near robots should know where the E-stop is located before the robot is even turned on.',
    real_world_context:
      'E-stop buttons are required by international safety standards (ISO 13850) on virtually all industrial and commercial robots. Some facilities also have E-stop buttons mounted on walls in addition to the ones on the robot itself.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['emergency-stop', 'safety-rules', 'critical', 'e-stop'],
  },

  // RSB-5
  {
    question_text:
      'Someone tells you: "Robots are more dangerous than regular machines because they can think for themselves and go rogue." Based on how robots actually work, is this true?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Yes — robots can override their programming and act unpredictably' },
      { label: 'B', text: 'No — robots follow their programming and safety rules strictly. They can\'t develop independent desires or "go rogue." Most robot accidents happen due to human error, not robot malfunction.' },
      { label: 'C', text: 'Yes — that\'s why robots are banned in most countries' },
      { label: 'D', text: 'It depends on whether the robot has been hacked' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robots do not have free will, desires, or intentions. They execute software instructions within defined boundaries. The vast majority of robot-related accidents are caused by human errors: entering a robot\'s work zone without proper lockout procedures, bypassing safety barriers, or incorrectly programming the robot. Modern robots have multiple safety layers — if one system fails, others stop the robot. The "rogue robot" fear comes from movies, not reality.',
    real_world_context:
      'OSHA data shows that most workplace robot injuries involve someone entering a robot work cell during operation, not robots acting outside their programming. Proper training prevents the majority of incidents.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['myths', 'safety-rules', 'misconceptions', 'human-error'],
  },

  // RSB-6
  {
    question_text:
      'You start a new job at a facility that uses several mobile robots. During orientation, you\'re told five basic safety rules. Which of these would NOT be one of them?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Know where the emergency stop buttons are' },
      { label: 'B', text: 'You must have an engineering degree to work in any area where robots operate' },
      { label: 'C', text: 'Don\'t block the robot\'s charging station or pathways' },
      { label: 'D', text: 'Report any unusual robot behavior to your supervisor' },
    ],
    correct_answers: ['B'],
    explanation:
      'You absolutely do NOT need an engineering degree to work safely around robots. The basic safety rules for working near robots are designed for everyone: (1) Know where the E-stop is, (2) Don\'t enter a robot arm\'s work area without authorization, (3) Keep the robot\'s paths and charging stations clear, (4) Be predictable — walk normally, don\'t surprise the robot, (5) Report problems to the right person. These are simple rules anyone can learn in a few minutes.',
    real_world_context:
      'Amazon warehouse employees receive approximately 1 hour of robot safety training before working alongside robots. The training focuses on practical rules, not technical knowledge.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['safety-rules', 'training', 'accessibility', 'orientation'],
  },

  // RSB-7
  {
    question_text:
      'A colleague places their backpack in the middle of the hallway where a delivery robot usually travels. The robot arrives, stops, and can\'t get around the backpack. What problem has the colleague created?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'No problem — the robot should be smart enough to move the backpack' },
      { label: 'B', text: 'They\'ve blocked the robot\'s path, which stops deliveries and could cause the robot to reroute into areas with more people, creating a less safe situation' },
      { label: 'C', text: 'The robot will just drive over the backpack' },
      { label: 'D', text: 'The backpack will damage the robot\'s sensors permanently' },
    ],
    correct_answers: ['B'],
    explanation:
      'Keeping robot pathways clear is one of the basic safety rules. When a robot\'s path is blocked, it may stop and wait (holding up important deliveries like medications in a hospital), try to reroute through areas with more foot traffic, or need human intervention to continue. Most robots can\'t physically move objects — they\'re designed to navigate around obstacles or stop. Think of it like blocking a fire lane: the path exists for a reason.',
    real_world_context:
      'Hospitals report that the most common cause of delivery robot delays is items left in hallways — carts, chairs, bags. Many facilities now have "robot lane" markings on floors to remind people to keep paths clear.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['safety-rules', 'path-clearing', 'workplace-etiquette'],
  },

  // RSB-8
  {
    question_text:
      'A maintenance worker needs to fix something inside a robot arm\'s work cell (the fenced area where it operates). What MUST happen before they enter?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_SAFETY_BASIC',
    level: 'awareness',
    options: [
      { label: 'A', text: 'They just need to wave at the robot so it knows they\'re there' },
      { label: 'B', text: 'The robot must be powered down and locked out so it cannot accidentally start up while the person is inside the work cell' },
      { label: 'C', text: 'They should enter quickly while the robot is between movements' },
      { label: 'D', text: 'They can enter anytime as long as they\'re wearing a hard hat' },
    ],
    correct_answers: ['B'],
    explanation:
      'Lockout/tagout (LOTO) is a critical safety procedure: before anyone enters a robot\'s work cell for maintenance, the robot must be completely powered down and physically locked in the off position, with a tag indicating who locked it out and why. This prevents anyone from accidentally restarting the robot while someone is inside. This is the same principle used for all heavy machinery and is required by workplace safety regulations in most countries.',
    real_world_context:
      'OSHA requires lockout/tagout procedures for all hazardous energy sources, including robot work cells. Violations are among the most frequently cited safety infractions in manufacturing.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['lockout-tagout', 'safety-rules', 'maintenance', 'critical'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 4: ROBOT_ECONOMY (8 questions)
  // Buy vs lease vs hire, RaaS, ROI, industry direction
  // ═══════════════════════════════════════════════════════════════

  // RE-1
  {
    question_text:
      'A restaurant owner is considering a robot that costs $15,000 to buy. A company also offers the same robot for $1,200 per month with maintenance included. The owner isn\'t sure if robots will work well in their restaurant. Which option makes more sense to START with?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Buy it outright — it\'s cheaper in the long run' },
      { label: 'B', text: 'The monthly rental — it lets them test whether a robot works for their restaurant without a $15,000 risk, and maintenance is included' },
      { label: 'C', text: 'Neither — robots are too expensive for restaurants' },
      { label: 'D', text: 'Buy two at once for a volume discount' },
    ],
    correct_answers: ['B'],
    explanation:
      'When you\'re not sure if a robot will work for your business, renting (often called Robot-as-a-Service or RaaS) is the smart first step. You pay monthly, maintenance is typically included, and you can return it if it doesn\'t work out. It\'s the same logic as renting an apartment before buying a house — test the fit before making a big commitment. If the robot proves valuable after 6-12 months, then buying might make financial sense.',
    real_world_context:
      'Bear Robotics offers their Servi restaurant robot on subscription plans starting around $999/month. Many restaurant owners try the monthly plan for 3-6 months before deciding to commit long-term.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['raas', 'buy-vs-rent', 'risk-management', 'restaurant'],
  },

  // RE-2
  {
    question_text:
      'A warehouse calculates that a mobile robot costs them about $3 per hour to operate (including purchase cost spread over 5 years, electricity, and maintenance). A human worker doing the same task costs $22 per hour (including wages, benefits, and insurance). What does this comparison tell you?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Human workers should be paid less to compete with robots' },
      { label: 'B', text: 'For repetitive physical tasks that a robot can do, the economics strongly favor automation — the robot costs a fraction of a human worker per hour and can work 20+ hours a day' },
      { label: 'C', text: 'The warehouse should replace all human workers immediately' },
      { label: 'D', text: 'This comparison is unfair because robots can\'t actually do warehouse work' },
    ],
    correct_answers: ['B'],
    explanation:
      'This is why robot adoption is accelerating in warehouses: for simple, repetitive physical tasks, the cost per hour of a robot is dramatically lower than a human worker. But this does NOT mean "replace all humans." Robots handle the repetitive transport and picking tasks while humans focus on problem-solving, quality control, customer service, and tasks requiring judgment. The economic case is strongest for the most repetitive, physically demanding work.',
    real_world_context:
      'Industry analyses show that warehouse robots can achieve a total cost of ownership between $2-5 per hour of operation, compared to fully-loaded labor costs of $20-35 per hour depending on region.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['roi', 'cost-comparison', 'warehouse', 'economics'],
  },

  // RE-3
  {
    question_text:
      'You hear the term "Robot-as-a-Service" (RaaS). What does this mean in practice?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Robots that serve food in restaurants' },
      { label: 'B', text: 'A business model where you pay a monthly fee to use a robot instead of buying it — similar to how you subscribe to Netflix instead of buying DVDs' },
      { label: 'C', text: 'A government program that provides free robots to businesses' },
      { label: 'D', text: 'A type of robot that repairs other robots' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robot-as-a-Service (RaaS) is a subscription model where businesses pay a regular fee (monthly or annually) to use robots. The RaaS provider handles the robot\'s maintenance, software updates, repairs, and sometimes even replacement. It\'s the same concept as Software-as-a-Service (SaaS) — like paying for Salesforce or Microsoft 365 instead of buying software outright. This model has made robots accessible to businesses that can\'t afford a $50,000+ upfront purchase.',
    real_world_context:
      'The RaaS market is growing rapidly. Companies like Locus Robotics, 6 River Systems, and Cobalt Robotics all offer subscription models that include the robot, software, maintenance, and support.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['raas', 'business-model', 'subscription', 'accessibility'],
  },

  // RE-4
  {
    question_text:
      'A small business owner asks: "How long does it typically take for a robot to pay for itself?" What\'s the most realistic answer for a commercial robot used in a warehouse or store?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'About 10-15 years' },
      { label: 'B', text: 'Typically 12-24 months for a well-matched robot deployment, though some see payback even faster' },
      { label: 'C', text: 'Robots never pay for themselves — they\'re always a net cost' },
      { label: 'D', text: 'Immediately — from day one' },
    ],
    correct_answers: ['B'],
    explanation:
      'For a robot that\'s well-matched to its task (the right robot for the right job), the typical payback period is 1-2 years. This accounts for the purchase price, installation, training, and ongoing costs versus the labor or efficiency savings. Some deployments — like warehouse picking robots in high-volume facilities — can pay back in under a year. The key phrase is "well-matched": a robot solving the wrong problem may never pay for itself.',
    real_world_context:
      'Locus Robotics reports that their warehouse customers typically see ROI within 6-12 months, driven by 2-3x productivity increases in order picking. Floor cleaning robots in retail often pay back within 12-18 months.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['roi', 'payback-period', 'business-case', 'economics'],
  },

  // RE-5
  {
    question_text:
      'Which industry has been using robots the longest and currently has the most robots deployed?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Healthcare' },
      { label: 'B', text: 'Automotive manufacturing — car factories have used robot arms for welding, painting, and assembly since the 1960s' },
      { label: 'C', text: 'Retail stores' },
      { label: 'D', text: 'Home cleaning' },
    ],
    correct_answers: ['B'],
    explanation:
      'The automotive industry was the first major adopter of robots and remains the largest user today. General Motors installed the first industrial robot (Unimate) in 1961 for die-casting handling. Today, a single car factory might have over 1,000 robot arms performing welding, painting, assembly, and quality inspection. The auto industry\'s success with robots paved the way for adoption in electronics, logistics, food service, healthcare, and eventually homes and offices.',
    real_world_context:
      'A modern Tesla factory uses over 1,000 robots. The average car is touched by 500+ robots during its assembly. The automotive industry accounts for about 30% of all industrial robot installations worldwide.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['industry-history', 'automotive', 'manufacturing', 'adoption'],
  },

  // RE-6
  {
    question_text:
      'A cleaning company is deciding between hiring three night-shift janitors or deploying two floor-cleaning robots plus one daytime janitor who handles tasks robots can\'t do (like restrooms and trash). Beyond just wages, what HIDDEN cost advantage do the robots offer?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Robots don\'t have hidden advantages — they cost the same as employees once you add maintenance' },
      { label: 'B', text: 'Robots don\'t require overtime pay, health insurance, workers\' compensation, sick days, or shift scheduling — these "hidden" costs often add 30-40% on top of an employee\'s wages' },
      { label: 'C', text: 'Robots make the building look more high-tech, attracting customers' },
      { label: 'D', text: 'Robots clean faster so the building can close earlier' },
    ],
    correct_answers: ['B'],
    explanation:
      'When comparing robot costs to labor costs, many people only look at wages. But the true cost of an employee includes benefits (health insurance, retirement), payroll taxes, workers\' compensation insurance, overtime premiums, paid time off, training, management overhead, and recruitment costs when they leave. These add 30-50% on top of base wages. Robots have their own ongoing costs (maintenance, electricity, software), but these are typically much lower as a percentage of the base cost.',
    real_world_context:
      'The Bureau of Labor Statistics reports that benefits add an average of 31% on top of wages for private industry workers. For night-shift work, the premium is even higher due to shift differentials and higher turnover.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['total-cost', 'labor-economics', 'hidden-costs', 'cleaning'],
  },

  // RE-7
  {
    question_text:
      'A business owner says: "I\'ll wait 5 years for robots to get cheaper before I invest." What\'s the risk of this strategy?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'No risk — waiting is always the smart move with technology' },
      { label: 'B', text: 'Competitors who adopt robots now will be more efficient and may capture market share. Five years of savings from robot efficiency can outweigh any future price drops.' },
      { label: 'C', text: 'Robots will actually get more expensive, so they should buy now' },
      { label: 'D', text: 'The government might ban robots in 5 years' },
    ],
    correct_answers: ['B'],
    explanation:
      'While robot prices do tend to decrease over time, the cost of NOT having a robot is real too. If your competitor automates their warehouse and can ship orders 3x faster at lower cost, every month you wait puts you further behind. The ROI calculation should include "what am I losing by not having this?" — which includes efficiency gains, reduced errors, ability to handle higher volume, and better working conditions. Waiting has a price.',
    real_world_context:
      'Early adopters of warehouse robotics like Amazon gained significant competitive advantages that later entrants struggle to match. The gap grows over time as robots generate data and efficiency improvements compound.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['strategy', 'competitive-advantage', 'timing', 'opportunity-cost'],
  },

  // RE-8
  {
    question_text:
      'A hospital CFO sees that a delivery robot costs $100,000 per year to lease and operate. The robot replaces 3,000 staff delivery trips per month. What\'s the right way to think about whether this is a good investment?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'ROBOT_ECONOMY',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Only compare the robot cost to the wages of delivery staff' },
      { label: 'B', text: 'Calculate the total value: staff time freed up for patient care, reduced delivery errors, faster delivery times, and fewer worker injuries from repetitive hallway trips — not just wage savings' },
      { label: 'C', text: 'Reject it — $100,000 is too expensive for any hospital robot' },
      { label: 'D', text: 'Only adopt it if it pays for itself in the first month' },
    ],
    correct_answers: ['B'],
    explanation:
      'The true value of a robot goes beyond simple wage replacement. In a hospital, when nurses and staff aren\'t making delivery runs, they spend more time with patients (improving care quality and patient satisfaction scores). Robots deliver with consistent timing (medications arrive on schedule), make fewer errors, and eliminate repetitive physical strain on staff. A complete ROI analysis includes all these factors — direct savings, indirect benefits, error reduction, and quality improvements.',
    real_world_context:
      'UCSF Medical Center found that their TUG robots freed up nursing staff time equivalent to several full-time positions, which translated into better patient care metrics — a value that exceeded the direct cost savings.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['roi', 'healthcare', 'total-value', 'decision-making'],
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 5: FIRST_INTERACTION (8 questions)
  // Practical scenarios: starting/stopping, reading error lights,
  // clearing paths, real encounters
  // ═══════════════════════════════════════════════════════════════

  // FI-1
  {
    question_text:
      'You\'re visiting a hospital and see a small robot rolling down the hallway carrying medications. It approaches you and slows down. What should you do?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Step aside and let it pass — it has a delivery to make' },
      { label: 'B', text: 'Stop it and check what medications it\'s carrying' },
      { label: 'C', text: 'Follow it to see where it\'s going' },
      { label: 'D', text: 'Report it to security as a potential hazard' },
    ],
    correct_answers: ['A'],
    explanation:
      'Hospital delivery robots like the Aethon TUG are programmed to navigate hallways and deliver medications, linens, and lab samples. They use sensors to detect people and will slow down or stop. Simply stepping aside allows it to continue its route efficiently. These robots are a normal part of modern hospital operations — no need to report them or interfere with their deliveries.',
    real_world_context:
      'Over 500 hospitals in the US use autonomous delivery robots. They typically carry medications, lab specimens, meals, and clean linens, making hundreds of deliveries per day.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['first-encounter', 'hospital', 'etiquette', 'practical'],
  },

  // FI-2
  {
    question_text:
      'It\'s your first day at a new job in a warehouse that uses robots. You notice a robot is blinking green and moving steadily down an aisle. Another robot is blinking yellow and moving slowly near a doorway. A third robot has a solid red light and isn\'t moving. Without any training yet, what can you reasonably guess about the red-light robot?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'It\'s charging its battery' },
      { label: 'B', text: 'It\'s likely stopped due to a problem — red almost universally means "stopped" or "error," just like in traffic lights and everyday electronics' },
      { label: 'C', text: 'It\'s moving at maximum speed' },
      { label: 'D', text: 'It\'s about to explode' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robot light signals generally follow the same intuitive color system used in traffic lights and everyday electronics: green means everything is normal and operating, yellow/amber means caution or transitioning, and red means stopped, error, or needs attention. You don\'t need to be a robot expert to read these signals — the colors are deliberately chosen to match what everyone already understands. When in doubt, a stopped red-light robot is safest to leave alone and report.',
    real_world_context:
      'Most robot manufacturers follow the IEC 60204 standard for indicator lights: green = normal operation, yellow = caution/attention needed, red = fault/stopped. This matches industrial machinery standards worldwide.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['status-lights', 'color-signals', 'first-day', 'practical'],
  },

  // FI-3
  {
    question_text:
      'A food delivery robot arrives at the front of a restaurant where you\'re picking up an order. It has a screen that says "Enter code to open." You don\'t have a code because the order is yours, not the robot\'s. What\'s happening?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'The robot is broken and displaying random messages' },
      { label: 'B', text: 'The robot is making a delivery to someone else — the code system ensures only the correct recipient can open the compartment and get their food' },
      { label: 'C', text: 'You need to enter your credit card number to open it' },
      { label: 'D', text: 'Anyone can type any code and it will open' },
    ],
    correct_answers: ['B'],
    explanation:
      'Delivery robots use codes (sent to the customer via the app) so that only the person who ordered the food can open the robot\'s compartment. This is a simple but effective security measure — similar to locker pickup codes at Amazon. The robot you\'re seeing is delivering to a different customer. When it\'s your delivery, you\'ll receive a code through the delivery app notification.',
    real_world_context:
      'Starship Technologies robots deliver food on college campuses and in neighborhoods. When the robot arrives, customers get a notification with a link to unlock the robot\'s lid. The entire interaction takes about 10 seconds.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['delivery-robot', 'security', 'user-interaction', 'practical'],
  },

  // FI-4
  {
    question_text:
      'You\'re in a store and see a tall robot slowly rolling down the aisle, scanning shelves with what looks like cameras and sensors. An employee nearby seems unconcerned. What is this robot most likely doing?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Spying on customers to collect personal data' },
      { label: 'B', text: 'Scanning shelves to check inventory — identifying out-of-stock items, misplaced products, and incorrect prices so the store can fix them quickly' },
      { label: 'C', text: 'It\'s a security robot looking for shoplifters' },
      { label: 'D', text: 'It\'s lost and trying to find its way back to the stockroom' },
    ],
    correct_answers: ['B'],
    explanation:
      'Inventory scanning robots (like those from Simbe Robotics or Zebra Technologies) are increasingly common in retail stores. They roll down aisles scanning shelves to create a real-time picture of what\'s in stock, what\'s running low, what\'s in the wrong place, and whether prices are displayed correctly. This helps stores keep shelves stocked and organized, which is better for shoppers. The cameras look at products on shelves, not at people.',
    real_world_context:
      'Walmart, Schnucks, and other retailers have deployed Simbe\'s Tally robot in hundreds of stores. The robot scans 30,000+ products per store in about 90 minutes — a task that would take employees many hours.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['retail', 'inventory-robot', 'first-encounter', 'practical'],
  },

  // FI-5
  {
    question_text:
      'A cleaning robot in your office building seems to be stuck — it\'s been going back and forth over the same 3-foot area for several minutes. What\'s the most likely cause and best response?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'The robot is broken and should be thrown away' },
      { label: 'B', text: 'Something is probably confusing its sensors — like a mirror, glass wall, or dark carpet edge. Move any obvious obstacles and if it\'s still stuck, notify facilities management.' },
      { label: 'C', text: 'It\'s cleaning an extra-dirty spot and will move on when it\'s satisfied' },
      { label: 'D', text: 'Push it hard to a different area so it can restart' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robots navigate using sensors, and certain environments can confuse those sensors. Mirrors and glass walls can create false obstacles or infinite reflections. Very dark surfaces can absorb laser beams, making the floor look like a cliff. Transparent or very shiny surfaces can reflect sensors in misleading ways. When a robot is stuck in a loop, there\'s usually a simple environmental cause. Gently removing an obvious obstacle (like moving a chair) or notifying facilities management is the right approach — never push or force a robot.',
    real_world_context:
      'Robot vacuum manufacturers include notes about problematic surfaces in their manuals. iRobot specifically recommends using boundary markers near mirrors and glass walls that sit at floor level.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['troubleshooting', 'sensor-confusion', 'practical', 'office'],
  },

  // FI-6
  {
    question_text:
      'You order a coffee from a robot barista kiosk. The screen says your order will take 3 minutes. After 5 minutes, the screen shows an error message: "Order paused — please alert staff." What should you expect?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'Your money is lost — robot errors mean you won\'t get your order or a refund' },
      { label: 'B', text: 'A staff member will resolve the issue — either fix the robot and complete your order, make your coffee manually, or give you a refund. Robot errors are handled like any other service equipment issue.' },
      { label: 'C', text: 'You need to open the robot and fix it yourself' },
      { label: 'D', text: 'The robot is permanently broken and will never work again' },
    ],
    correct_answers: ['B'],
    explanation:
      'Robot errors in customer-facing settings are handled the same way as any equipment issue: a staff member resolves it. Well-run robot deployments always have a human backup plan. The robot told you exactly what to do ("alert staff"), which is good design. Your order will be completed or refunded. Robot systems in customer-facing roles are designed with error recovery in mind — the screen message is part of that process.',
    real_world_context:
      'Cafe X and other robot barista companies train on-site staff to handle common errors. Most issues (like a jammed cup dispenser or an ingredient running low) are resolved in under 2 minutes.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['error-handling', 'customer-experience', 'practical', 'food-service'],
  },

  // FI-7
  {
    question_text:
      'Your company just got a new robot that moves supplies between rooms. Your supervisor asks everyone to "keep the robot\'s path clear." In practical terms, what does this actually mean for your daily work?',
    question_type: 'multiple_choice',
    difficulty: 1,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'You can never use the hallway again' },
      { label: 'B', text: 'Don\'t leave boxes, carts, bags, or other items sitting in the hallways or doorways where the robot travels — you can still walk there normally' },
      { label: 'C', text: 'You need to flatten yourself against the wall whenever the robot passes' },
      { label: 'D', text: 'The robot\'s path changes every day, so there\'s no way to know where to keep clear' },
    ],
    correct_answers: ['B'],
    explanation:
      'Keeping a robot\'s path clear simply means not leaving objects in the hallways and doorways where the robot travels. You can walk through these areas normally — the robot is designed to navigate around moving people. What it CAN\'T easily handle is stationary obstacles like boxes left on the floor, carts parked in doorways, or bags dropped in hallways. Think of it like keeping a fire exit clear: you walk through it freely, but don\'t block it with stuff.',
    real_world_context:
      'Most facilities mark robot travel paths with subtle floor markings or signs. The adjustment for employees is minimal — basically just "don\'t leave your stuff in the hallway," which is good practice anyway.',
    time_limit_seconds: 45,
    points: 1,
    tags: ['workplace-etiquette', 'path-clearing', 'practical', 'daily-habits'],
  },

  // FI-8
  {
    question_text:
      'You\'re alone in an office at night and a security robot on its patrol route rounds the corner and shines a light at you. It makes a chiming sound and a screen displays "Occupant detected — logging." You\'re an employee working late legitimately. What\'s happening and what should you do?',
    question_type: 'multiple_choice',
    difficulty: 2,
    domain_code: 'FIRST_INTERACTION',
    level: 'awareness',
    options: [
      { label: 'A', text: 'The robot is calling the police — leave immediately' },
      { label: 'B', text: 'The robot is doing its job — logging that someone is in the building, which is normal security patrol behavior. Continue working. If your company requires badge scans or check-ins, make sure you\'ve done that.' },
      { label: 'C', text: 'The robot is broken — security robots don\'t patrol at night' },
      { label: 'D', text: 'Hide so the robot doesn\'t record you' },
    ],
    correct_answers: ['B'],
    explanation:
      'Security patrol robots (like those from Cobalt Robotics or Knightscope) are designed to monitor buildings, detect unusual activity, and log events. Detecting a person in the building at night and logging it is exactly what it\'s supposed to do — it\'s not an alarm, it\'s a record. Security teams review these logs. If you\'re authorized to be there, it\'s a non-event. The robot\'s chime is just acknowledging your presence, much like a security guard would nod as they walk past.',
    real_world_context:
      'Cobalt Robotics security robots are deployed in hundreds of office buildings. They patrol predetermined routes, detect anomalies (open doors, water leaks, unexpected people), and alert remote security operators only when something seems unusual.',
    time_limit_seconds: 60,
    points: 1,
    tags: ['security-robot', 'night-encounter', 'practical', 'workplace'],
  },
];
