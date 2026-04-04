-- Extended Media Fields
-- Migration 025: Vimeo, Wistia, thumbnails, media timestamps

ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_thumbnail_url TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_channel TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS vimeo_video_id TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS wistia_video_id TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS video_embed_url TEXT;
ALTER TABLE robots ADD COLUMN IF NOT EXISTS media_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_robots_vimeo ON robots(vimeo_video_id) WHERE vimeo_video_id IS NOT NULL;
