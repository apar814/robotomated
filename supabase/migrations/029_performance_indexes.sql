-- 029_performance_indexes.sql
-- Performance indexes for common query patterns

-- Robot browsing (most common query — category + score sort)
CREATE INDEX IF NOT EXISTS idx_robots_category_score
ON robots(category_id, robo_score DESC NULLS LAST)
WHERE status = 'active';

-- Robot price filtering
CREATE INDEX IF NOT EXISTS idx_robots_price
ON robots(price_current)
WHERE status = 'active' AND price_current IS NOT NULL;

-- Robot manufacturer browsing
CREATE INDEX IF NOT EXISTS idx_robots_manufacturer_score
ON robots(manufacturer_id, robo_score DESC NULLS LAST)
WHERE status = 'active';

-- Open job postings (time-sensitive queries)
CREATE INDEX IF NOT EXISTS idx_jobs_status_created
ON robowork_jobs(status, created_at DESC)
WHERE status = 'open';

-- Job market matching (city + state + status)
CREATE INDEX IF NOT EXISTS idx_jobs_market
ON robowork_jobs(city, state, status)
WHERE status = 'open';

-- RSP market matching (verified providers by location)
CREATE INDEX IF NOT EXISTS idx_rsp_market
ON robot_service_providers(city, state)
WHERE verified = true;

-- RSP specialization matching (GIN index on array)
CREATE INDEX IF NOT EXISTS idx_rsp_specializations
ON robot_service_providers USING gin(specializations);

-- Bid lookup by job
CREATE INDEX IF NOT EXISTS idx_bids_job_status
ON robowork_bids(job_id, status, created_at);

-- Bid lookup by RSP
CREATE INDEX IF NOT EXISTS idx_bids_rsp
ON robowork_bids(rsp_id, created_at DESC);

-- Fleet status by RSP
CREATE INDEX IF NOT EXISTS idx_fleet_rsp_status
ON rsp_fleet_status(rsp_id, status);

-- Newsletter subscribers (for digest queries)
CREATE INDEX IF NOT EXISTS idx_newsletter_active
ON newsletter_subscribers(active, created_at DESC)
WHERE active = true;
