-- Migration to add avatar_url column to users table
-- Version: V3
-- Description: Add avatar_url column to users table for storing user avatar URLs

ALTER TABLE users ADD COLUMN avatar_url VARCHAR(512);

-- Add comment to the column
COMMENT ON COLUMN users.avatar_url IS 'URL to user avatar image stored in B2 storage';
