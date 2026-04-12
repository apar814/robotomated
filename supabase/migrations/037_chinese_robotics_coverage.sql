-- Chinese Robotics Coverage: Manufacturer profiles
-- Run after ensuring manufacturers table has the required columns

-- Unitree Robotics
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('Unitree Robotics', 'unitree-robotics', 'China', 'https://www.unitree.com', 2016)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- Xiaomi Robotics
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('Xiaomi', 'xiaomi', 'China', 'https://www.mi.com', 2010)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- UBTECH Robotics
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('UBTECH Robotics', 'ubtech-robotics', 'China', 'https://www.ubtrobot.com', 2012)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- Agibot / Zhiyuan Robotics
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('Agibot', 'agibot', 'China', 'https://www.agibot.com', 2023)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- Fourier Intelligence
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('Fourier Intelligence', 'fourier-intelligence', 'China', 'https://www.fourierintelligence.com', 2015)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- DEEP Robotics
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('DEEP Robotics', 'deep-robotics', 'China', 'https://www.deeprobotics.cn', 2017)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- AgileX Robotics
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('AgileX Robotics', 'agilex-robotics', 'China', 'https://www.agilex.ai', 2018)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- EngineAI
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('EngineAI', 'engineai', 'China', 'https://www.engine.ai', 2020)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- Leju Robotics
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('Leju Robotics', 'leju-robotics', 'China', 'https://www.lejurobot.com', 2020)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;

-- Galaxy General Robot
INSERT INTO manufacturers (name, slug, country, website, founded_year)
VALUES ('Galaxy General Robot', 'galaxy-general-robot', 'China', 'https://www.galaxyrobot.cn', 2022)
ON CONFLICT (slug) DO UPDATE SET
  country = EXCLUDED.country, website = EXCLUDED.website, founded_year = EXCLUDED.founded_year;
