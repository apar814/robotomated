-- Add description field to manufacturers
ALTER TABLE manufacturers
  ADD COLUMN IF NOT EXISTS description TEXT;
