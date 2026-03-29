-- 015: Add Security & Surveillance, Hospitality & Service, and Humanoid categories
INSERT INTO robot_categories (id, slug, name)
VALUES
  ('c1000001-0000-0000-0000-000000000001', 'security', 'Security & Surveillance'),
  ('c1000001-0000-0000-0000-000000000002', 'hospitality', 'Hospitality & Service'),
  ('c1000001-0000-0000-0000-000000000003', 'humanoid', 'Humanoid Robots')
ON CONFLICT (id) DO NOTHING;
