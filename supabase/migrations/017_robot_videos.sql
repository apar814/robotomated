-- Migration 017: Add YouTube video URL to robots table
-- Enables manufacturer video embeds on robot detail pages

ALTER TABLE robots ADD COLUMN IF NOT EXISTS youtube_url TEXT;
