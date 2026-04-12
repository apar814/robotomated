-- Add logo_url column if not exists
ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Populate logos using Clearbit Logo API (free, no key required)
-- These URLs are verified to work in production browsers
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/bostondynamics.com' WHERE slug = 'boston-dynamics' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/dji.com' WHERE slug = 'dji' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/universal-robots.com' WHERE slug = 'universal-robots' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/intuitive.com' WHERE slug = 'intuitive-surgical' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/irobot.com' WHERE slug = 'irobot' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/roborock.com' WHERE slug = 'roborock' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/unitree.com' WHERE slug = 'unitree-robotics' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/abb.com' WHERE slug = 'abb' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/fanuc.com' WHERE slug = 'fanuc' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/kuka.com' WHERE slug = 'kuka' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/yaskawa.com' WHERE slug = 'yaskawa' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/omron.com' WHERE slug = 'omron' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/locusrobotics.com' WHERE slug = 'locus-robotics' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/6river.com' WHERE slug = '6-river-systems' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/agilityrobotics.com' WHERE slug = 'agility-robotics' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/figure.ai' WHERE slug = 'figure-ai' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/apptronik.com' WHERE slug = 'apptronik' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/xiaomi.com' WHERE slug = 'xiaomi' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/ubtrobot.com' WHERE slug = 'ubtech-robotics' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/skydio.com' WHERE slug = 'skydio' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/autelrobotics.com' WHERE slug = 'autel-robotics' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/stryker.com' WHERE slug = 'stryker' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/1x.tech' WHERE slug = '1x-technologies' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/ecovacs.com' WHERE slug = 'ecovacs' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/samsung.com' WHERE slug = 'samsung' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/lg.com' WHERE slug = 'lg' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/deere.com' WHERE slug = 'john-deere' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/tesla.com' WHERE slug = 'tesla' AND logo_url IS NULL;
UPDATE manufacturers SET logo_url = 'https://logo.clearbit.com/amazon.com' WHERE slug = 'amazon-robotics' AND logo_url IS NULL;
