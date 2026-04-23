-- ============================================================================
-- Migration 039: Add role column to users table
-- PUNCH_LIST #1: Admin routes need a role to authorize against.
-- Admin authorization is enforced server-side in middleware.ts — we do NOT
-- expose row-level policies on this column because the existing "Users can
-- update own profile" policy already restricts writes to the owning row,
-- and we never want end users to elevate their own role. Role changes must
-- be performed via the service-role key (Supabase dashboard or scripts).
-- ============================================================================

ALTER TABLE users
  ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'editor', 'admin'));

CREATE INDEX idx_users_role ON users(role);

COMMENT ON COLUMN users.role IS
  'Authorization role. Enforced server-side (middleware.ts) for /admin routes. Not user-writable — the existing users UPDATE RLS policy permits row-ownership writes, so role changes must go through the service-role key.';
