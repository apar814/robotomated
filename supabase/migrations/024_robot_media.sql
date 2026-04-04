-- Robot Media Pipeline
-- Migration 024: Additional image and video columns

ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_url_2 TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_url_3 TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_source TEXT DEFAULT 'unknown';
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_verified BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_width INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_height INTEGER;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS image_updated_at TIMESTAMPTZ;
-- youtube_url already exists from migration 017
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_title TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_verified BOOLEAN DEFAULT false;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_duration_seconds INTEGER;

CREATE INDEX IF NOT EXISTS idx_robots_image_source ON robots(image_source);
CREATE INDEX IF NOT EXISTS idx_robots_image_verified ON robots(image_verified);
CREATE INDEX IF NOT EXISTS idx_robots_youtube_verified ON robots(youtube_verified);
