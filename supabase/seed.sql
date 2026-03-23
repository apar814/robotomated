-- ============================================================================
-- Robotomated.com — Seed Data
-- 5 categories, 8 manufacturers, 20 sample robots with realistic specs
-- ============================================================================

-- Categories
INSERT INTO robot_categories (id, slug, name, description, icon_name, display_order) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'warehouse', 'Warehouse & Logistics', 'AMRs, AGVs, picking systems, and warehouse automation', 'warehouse', 1),
  ('a0000001-0000-0000-0000-000000000002', 'manufacturing', 'Manufacturing', 'Cobots, welding arms, assembly robots, and industrial automation', 'factory', 2),
  ('a0000001-0000-0000-0000-000000000003', 'consumer', 'Consumer & Home', 'Vacuum robots, lawn mowers, pool cleaners, and home assistants', 'home', 3),
  ('a0000001-0000-0000-0000-000000000004', 'healthcare', 'Healthcare', 'Surgical robots, disinfection bots, pharmacy automation, and rehab', 'medical', 4),
  ('a0000001-0000-0000-0000-000000000005', 'delivery', 'Delivery & Last-Mile', 'Sidewalk delivery bots, drone delivery, and autonomous delivery vehicles', 'truck', 5);

-- Manufacturers
INSERT INTO manufacturers (id, slug, name, country, founded_year, website, verified) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'boston-dynamics',    'Boston Dynamics',      'US', 1992, 'https://bostondynamics.com',   true),
  ('b0000001-0000-0000-0000-000000000002', 'universal-robots',  'Universal Robots',     'DK', 2005, 'https://universal-robots.com', true),
  ('b0000001-0000-0000-0000-000000000003', 'irobot',            'iRobot',               'US', 1990, 'https://irobot.com',           true),
  ('b0000001-0000-0000-0000-000000000004', 'locus-robotics',    'Locus Robotics',       'US', 2014, 'https://locusrobotics.com',    true),
  ('b0000001-0000-0000-0000-000000000005', 'intuitive-surgical','Intuitive Surgical',   'US', 1995, 'https://intuitive.com',        true),
  ('b0000001-0000-0000-0000-000000000006', 'fanuc',             'FANUC',                'JP', 1972, 'https://fanuc.com',            true),
  ('b0000001-0000-0000-0000-000000000007', 'starship',          'Starship Technologies','US', 2014, 'https://starship.xyz',         true),
  ('b0000001-0000-0000-0000-000000000008', 'roborock',          'Roborock',             'CN', 2014, 'https://roborock.com',         true);

-- Robots: Warehouse & Logistics (4)
INSERT INTO robots (slug, name, manufacturer_id, category_id, model_number, year_released, price_msrp, price_current, description_short, description_long, specs, images, robo_score, score_breakdown, status) VALUES
('stretch', 'Stretch', 'b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'STR-01', 2023, 150000, 150000,
 'Mobile case-handling robot for warehouse truck unloading',
 'Boston Dynamics Stretch is a mobile robot designed for warehouse automation, specifically truck unloading and case handling. It features a custom-designed arm with advanced suction grippers.',
 '{"payload_kg": 23, "reach_m": 2.0, "battery_hours": 8, "weight_kg": 590, "cases_per_hour": 800, "navigation": "LiDAR + depth cameras", "connectivity": "WiFi 6, Ethernet"}',
 '[{"url": "/images/robots/stretch-1.jpg", "alt": "Stretch unloading truck"}]',
 87.5,
 '{"performance": 92, "reliability": 88, "ease_of_use": 78, "intelligence": 90, "value": 72, "ecosystem": 85, "safety": 95, "design": 88}',
 'active'),

('locus-origin', 'Origin', 'b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'LO-3', 2023, 35000, 32000,
 'Autonomous mobile robot for warehouse order fulfillment',
 'Locus Origin is an AMR designed for piece-picking fulfillment. Navigates autonomously through warehouse aisles and collaborates with human pickers for efficient order completion.',
 '{"payload_kg": 36, "speed_mps": 1.8, "battery_hours": 12, "weight_kg": 68, "picks_per_hour": 200, "navigation": "SLAM + LiDAR", "charging_time_min": 30}',
 '[{"url": "/images/robots/locus-origin-1.jpg", "alt": "Locus Origin in warehouse"}]',
 82.0,
 '{"performance": 85, "reliability": 84, "ease_of_use": 88, "intelligence": 82, "value": 85, "ecosystem": 78, "safety": 90, "design": 70}',
 'active'),

('locus-vector', 'Vector', 'b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'LV-2', 2024, 45000, 45000,
 'Heavy-payload AMR for pallet and bulk transport',
 'Locus Vector handles heavier payloads for pallet and bulk goods movement within warehouses. Designed to complement Origin bots in mixed-fleet deployments.',
 '{"payload_kg": 270, "speed_mps": 1.5, "battery_hours": 10, "weight_kg": 180, "navigation": "SLAM + LiDAR + depth", "connectivity": "WiFi 6, 5G optional"}',
 '[{"url": "/images/robots/locus-vector-1.jpg", "alt": "Locus Vector carrying pallet"}]',
 79.0,
 '{"performance": 82, "reliability": 80, "ease_of_use": 85, "intelligence": 78, "value": 80, "ecosystem": 78, "safety": 88, "design": 65}',
 'active'),

('spot-warehouse', 'Spot Enterprise', 'b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'SPOT-E', 2024, 75000, 74500,
 'Quadruped robot for warehouse inspection and monitoring',
 'Spot Enterprise adapted for warehouse use — autonomous patrol routes, thermal scanning, inventory spot-checks, and anomaly detection across large facilities.',
 '{"payload_kg": 14, "speed_mps": 1.6, "battery_hours": 3.5, "weight_kg": 32, "dof": 12, "ip_rating": "IP54", "operating_temp_c": "-20 to 45"}',
 '[{"url": "/images/robots/spot-warehouse-1.jpg", "alt": "Spot patrolling warehouse"}]',
 84.0,
 '{"performance": 80, "reliability": 85, "ease_of_use": 72, "intelligence": 94, "value": 68, "ecosystem": 92, "safety": 93, "design": 95}',
 'active');

-- Robots: Manufacturing (4)
INSERT INTO robots (slug, name, manufacturer_id, category_id, model_number, year_released, price_msrp, price_current, description_short, description_long, specs, images, robo_score, score_breakdown, status) VALUES
('ur5e', 'UR5e', 'b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'UR5E', 2019, 35000, 29500,
 'Lightweight collaborative robot arm for flexible automation',
 'The UR5e is a lightweight, versatile cobot with 5kg payload. Ideal for pick-and-place, quality inspection, and machine tending. Features built-in force/torque sensing.',
 '{"payload_kg": 5, "reach_mm": 850, "dof": 6, "repeatability_mm": 0.03, "weight_kg": 20.6, "power_w": 200, "ip_rating": "IP54", "force_torque_sensor": true}',
 '[{"url": "/images/robots/ur5e-1.jpg", "alt": "UR5e cobot arm"}]',
 88.0,
 '{"performance": 86, "reliability": 92, "ease_of_use": 95, "intelligence": 82, "value": 90, "ecosystem": 94, "safety": 96, "design": 78}',
 'active'),

('ur10e', 'UR10e', 'b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'UR10E', 2019, 46000, 42000,
 'Medium-payload cobot for heavier manufacturing tasks',
 'The UR10e handles payloads up to 12.5kg with a 1300mm reach. Perfect for palletizing, machine tending, and packaging tasks requiring a longer reach.',
 '{"payload_kg": 12.5, "reach_mm": 1300, "dof": 6, "repeatability_mm": 0.05, "weight_kg": 33.5, "power_w": 350, "ip_rating": "IP54", "force_torque_sensor": true}',
 '[{"url": "/images/robots/ur10e-1.jpg", "alt": "UR10e palletizing"}]',
 86.5,
 '{"performance": 88, "reliability": 90, "ease_of_use": 93, "intelligence": 80, "value": 86, "ecosystem": 94, "safety": 95, "design": 75}',
 'active'),

('ur20', 'UR20', 'b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'UR20', 2023, 58000, 58000,
 'Next-gen heavy-payload cobot with 20kg capacity',
 'The UR20 is Universal Robots'' largest cobot. 20kg payload, 1750mm reach, redesigned joints for faster cycle times and smoother motion in palletizing and welding.',
 '{"payload_kg": 20, "reach_mm": 1750, "dof": 6, "repeatability_mm": 0.05, "weight_kg": 64, "power_w": 500, "ip_rating": "IP54", "force_torque_sensor": true}',
 '[{"url": "/images/robots/ur20-1.jpg", "alt": "UR20 heavy-duty cobot"}]',
 85.0,
 '{"performance": 91, "reliability": 86, "ease_of_use": 90, "intelligence": 80, "value": 82, "ecosystem": 90, "safety": 94, "design": 80}',
 'active'),

('fanuc-crx-10', 'CRX-10iA/L', 'b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000002', 'CRX-10iA/L', 2020, 40000, 37000,
 'FANUC''s user-friendly collaborative robot arm',
 'The CRX-10iA/L combines FANUC''s industrial reliability with an intuitive tablet-based programming interface. 10kg payload with 1418mm reach.',
 '{"payload_kg": 10, "reach_mm": 1418, "dof": 6, "repeatability_mm": 0.04, "weight_kg": 40, "power_w": 300, "ip_rating": "IP67", "programming": "tablet drag-and-drop"}',
 '[{"url": "/images/robots/fanuc-crx10-1.jpg", "alt": "FANUC CRX-10iA/L"}]',
 84.5,
 '{"performance": 87, "reliability": 94, "ease_of_use": 82, "intelligence": 76, "value": 80, "ecosystem": 88, "safety": 94, "design": 72}',
 'active');

-- Robots: Consumer & Home (5)
INSERT INTO robots (slug, name, manufacturer_id, category_id, model_number, year_released, price_msrp, price_current, description_short, description_long, specs, images, robo_score, score_breakdown, status) VALUES
('roomba-j9', 'Roomba Combo j9+', 'b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'J9+', 2024, 999, 799,
 'Premium robot vacuum and mop with auto-empty dock',
 'The Roomba Combo j9+ is iRobot''s flagship. Vacuums and mops simultaneously, auto-empties debris, auto-refills water, and retracts mop pad on carpet automatically.',
 '{"suction_pa": 5000, "battery_min": 120, "dustbin_ml": 400, "water_tank_ml": 300, "noise_db": 65, "navigation": "PrecisionVision + iAdapt 3.0", "smart_home": ["Alexa", "Google", "Matter"]}',
 '[{"url": "/images/robots/roomba-j9-1.jpg", "alt": "Roomba j9+ on hardwood"}]',
 89.0,
 '{"performance": 90, "reliability": 88, "ease_of_use": 95, "intelligence": 92, "value": 82, "ecosystem": 95, "safety": 92, "design": 88}',
 'active'),

('roborock-s8-maxv', 'S8 MaxV Ultra', 'b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000003', 'S8MVU', 2024, 1799, 1399,
 'AI-powered robot vacuum with advanced obstacle avoidance',
 'Roborock S8 MaxV Ultra features dual cameras with Reactive AI 2.0, 6000Pa suction, sonic mopping, and an all-in-one dock that empties, washes mop, refills water, and self-dries.',
 '{"suction_pa": 6000, "battery_min": 180, "dustbin_ml": 400, "water_tank_ml": 300, "noise_db": 67, "navigation": "LiDAR + dual camera AI", "smart_home": ["Alexa", "Google", "Siri"]}',
 '[{"url": "/images/robots/roborock-s8maxv-1.jpg", "alt": "Roborock S8 MaxV Ultra"}]',
 91.0,
 '{"performance": 94, "reliability": 90, "ease_of_use": 92, "intelligence": 95, "value": 85, "ecosystem": 88, "safety": 90, "design": 92}',
 'active'),

('roomba-i3', 'Roomba i3+ EVO', 'b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'I3+E', 2022, 549, 349,
 'Mid-range robot vacuum with auto-empty base',
 'Solid mid-range vacuum with auto-empty dock. Good for apartments and smaller homes. Reliable navigation but less advanced object avoidance than premium models.',
 '{"suction_pa": 2500, "battery_min": 75, "dustbin_ml": 400, "noise_db": 68, "navigation": "iAdapt 3.0 + floor tracking", "smart_home": ["Alexa", "Google"]}',
 '[{"url": "/images/robots/roomba-i3-1.jpg", "alt": "Roomba i3+ in living room"}]',
 76.0,
 '{"performance": 74, "reliability": 82, "ease_of_use": 88, "intelligence": 65, "value": 90, "ecosystem": 80, "safety": 85, "design": 70}',
 'active'),

('roborock-q-revo', 'Q Revo MaxV', 'b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000003', 'QRMV', 2024, 1099, 899,
 'Mid-premium vacuum and mop with rotating mop pads',
 'The Q Revo MaxV offers dual spinning mop pads, 5500Pa suction, and Reactive AI obstacle avoidance. A compelling mid-premium option that punches above its price.',
 '{"suction_pa": 5500, "battery_min": 180, "dustbin_ml": 350, "water_tank_ml": 350, "noise_db": 66, "navigation": "LiDAR + camera AI", "smart_home": ["Alexa", "Google"]}',
 '[{"url": "/images/robots/roborock-qrevo-1.jpg", "alt": "Roborock Q Revo MaxV"}]',
 85.0,
 '{"performance": 88, "reliability": 85, "ease_of_use": 90, "intelligence": 86, "value": 88, "ecosystem": 82, "safety": 88, "design": 80}',
 'active'),

('roborock-s8-pro', 'S8 Pro Ultra', 'b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000003', 'S8PU', 2023, 1599, 1099,
 'Previous-gen flagship with excellent all-around performance',
 'The S8 Pro Ultra remains one of the best robot vacuums with 6000Pa suction, VibraRise 2.0 mopping, and comprehensive auto-dock. Great value as a previous-gen flagship.',
 '{"suction_pa": 6000, "battery_min": 180, "dustbin_ml": 350, "water_tank_ml": 300, "noise_db": 67, "navigation": "LiDAR + Reactive 3D", "smart_home": ["Alexa", "Google"]}',
 '[{"url": "/images/robots/roborock-s8pro-1.jpg", "alt": "Roborock S8 Pro Ultra"}]',
 88.5,
 '{"performance": 92, "reliability": 90, "ease_of_use": 90, "intelligence": 88, "value": 90, "ecosystem": 85, "safety": 88, "design": 85}',
 'active');

-- Robots: Healthcare (3)
INSERT INTO robots (slug, name, manufacturer_id, category_id, model_number, year_released, price_msrp, price_current, description_short, description_long, specs, images, robo_score, score_breakdown, status) VALUES
('da-vinci-5', 'da Vinci 5', 'b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000004', 'DV5', 2024, 2500000, 2500000,
 'Next-generation surgical robot with force feedback',
 'The da Vinci 5 surgical system introduces true haptic force feedback, a 10x compute upgrade, and enhanced 3D visualization. Represents a generational leap in robotic surgery.',
 '{"arms": 4, "dof_per_arm": 7, "instruments": 70, "force_feedback": true, "visualization": "3D HD stereoscopic", "footprint_m2": 6.5, "fda_cleared": true}',
 '[{"url": "/images/robots/davinci5-1.jpg", "alt": "da Vinci 5 surgical system"}]',
 95.0,
 '{"performance": 98, "reliability": 96, "ease_of_use": 82, "intelligence": 94, "value": 70, "ecosystem": 98, "safety": 99, "design": 90}',
 'active'),

('spot-healthcare', 'Spot for Healthcare', 'b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', 'SPOT-HC', 2024, 80000, 80000,
 'Quadruped robot configured for hospital patrol and delivery',
 'Spot adapted for healthcare facilities — autonomous patrol, UV-C disinfection payload, specimen transport, and facility monitoring. Navigates elevators and doors autonomously.',
 '{"payload_kg": 14, "speed_mps": 1.6, "battery_hours": 3, "weight_kg": 32, "ip_rating": "IP54", "uvc_capable": true, "autonomous_elevator": true}',
 '[{"url": "/images/robots/spot-healthcare-1.jpg", "alt": "Spot in hospital corridor"}]',
 78.0,
 '{"performance": 76, "reliability": 82, "ease_of_use": 68, "intelligence": 88, "value": 60, "ecosystem": 85, "safety": 90, "design": 92}',
 'active'),

('da-vinci-sp', 'da Vinci SP', 'b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000004', 'DVSP', 2018, 1800000, 1800000,
 'Single-port surgical robot for minimally invasive procedures',
 'The da Vinci SP performs surgery through a single 2.5cm incision. Three multi-jointed instruments and a camera all fit through one cannula. Ideal for urologic and ENT procedures.',
 '{"arms": 3, "dof_per_arm": 6, "port_diameter_mm": 25, "instruments": 40, "visualization": "3D HD flexible", "fda_cleared": true}',
 '[{"url": "/images/robots/davinci-sp-1.jpg", "alt": "da Vinci SP single-port system"}]',
 88.0,
 '{"performance": 92, "reliability": 94, "ease_of_use": 78, "intelligence": 86, "value": 65, "ecosystem": 95, "safety": 98, "design": 85}',
 'active');

-- Robots: Delivery & Last-Mile (4)
INSERT INTO robots (slug, name, manufacturer_id, category_id, model_number, year_released, price_msrp, price_current, description_short, description_long, specs, images, robo_score, score_breakdown, status) VALUES
('starship-s3', 'Starship S3', 'b0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000005', 'SS3', 2024, NULL, NULL,
 'Sidewalk delivery robot for food and grocery last-mile',
 'Starship S3 is the third-gen autonomous delivery bot. Carries groceries and food orders on sidewalks. Operates in 25+ cities with millions of deliveries completed.',
 '{"payload_kg": 10, "speed_kph": 6, "battery_hours": 12, "weight_kg": 25, "range_km": 6, "cargo_volume_l": 20, "navigation": "GPS + 12 cameras + ultrasonic", "deliveries_completed": 6000000}',
 '[{"url": "/images/robots/starship-s3-1.jpg", "alt": "Starship S3 on sidewalk"}]',
 81.0,
 '{"performance": 80, "reliability": 83, "ease_of_use": 92, "intelligence": 78, "value": 85, "ecosystem": 75, "safety": 88, "design": 72}',
 'active'),

('spot-delivery', 'Spot for Delivery', 'b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000005', 'SPOT-DL', 2025, 85000, 85000,
 'Quadruped delivery robot for rough-terrain last-mile',
 'Spot configured for delivery across terrain that wheeled robots can''t handle — stairs, gravel, snow. Experimental deployment for pharmaceutical and rural deliveries.',
 '{"payload_kg": 14, "speed_mps": 1.6, "battery_hours": 2.5, "weight_kg": 32, "terrain": ["stairs", "gravel", "snow", "grass"], "dof": 12}',
 '[{"url": "/images/robots/spot-delivery-1.jpg", "alt": "Spot delivering package"}]',
 72.0,
 '{"performance": 74, "reliability": 78, "ease_of_use": 58, "intelligence": 88, "value": 45, "ecosystem": 80, "safety": 85, "design": 92}',
 'coming_soon'),

('starship-s2', 'Starship S2', 'b0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000005', 'SS2', 2021, NULL, NULL,
 'Previous-gen delivery bot still in active deployment',
 'The Starship S2 continues operating in many campuses and neighborhoods. Slightly smaller cargo bay than S3 but proven reliability over millions of deliveries.',
 '{"payload_kg": 9, "speed_kph": 6, "battery_hours": 8, "weight_kg": 23, "range_km": 4, "cargo_volume_l": 15, "navigation": "GPS + 10 cameras + ultrasonic"}',
 '[{"url": "/images/robots/starship-s2-1.jpg", "alt": "Starship S2 on campus"}]',
 75.0,
 '{"performance": 74, "reliability": 80, "ease_of_use": 90, "intelligence": 70, "value": 82, "ecosystem": 72, "safety": 85, "design": 68}',
 'active'),

('stretch-delivery', 'Stretch for Loading', 'b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000005', 'STR-DL', 2025, 160000, 160000,
 'Stretch adapted for delivery truck loading automation',
 'A Stretch variant optimized for outbound loading — placing cases into delivery trucks in sequence for route-optimized unloading. Currently in pilot with major carriers.',
 '{"payload_kg": 23, "reach_m": 2.0, "battery_hours": 7, "weight_kg": 600, "cases_per_hour": 600, "navigation": "LiDAR + depth cameras"}',
 '[{"url": "/images/robots/stretch-delivery-1.jpg", "alt": "Stretch loading truck"}]',
 76.0,
 '{"performance": 80, "reliability": 75, "ease_of_use": 70, "intelligence": 82, "value": 65, "ecosystem": 78, "safety": 90, "design": 80}',
 'coming_soon');
