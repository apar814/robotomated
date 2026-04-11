-- Add video_url column for direct MP4/WebM video files (distinct from youtube_url)
ALTER TABLE robots ADD COLUMN IF NOT EXISTS video_url TEXT;
CREATE INDEX IF NOT EXISTS idx_robots_video ON robots(video_url) WHERE video_url IS NOT NULL;
