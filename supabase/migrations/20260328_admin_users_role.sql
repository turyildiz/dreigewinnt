-- ============================================================================
-- Add role + full_name to admin_users
-- Enables superadmin / admin distinction for multi-admin management
-- ============================================================================

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('admin', 'superadmin'));
