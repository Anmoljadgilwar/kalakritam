-- SQL Query to add profile_image_url column to users table
-- This script will add the missing column needed for custom profile images

-- STEP 1: Add the profile_image_url column to the users table
-- Run this command to add the column:
ALTER TABLE users 
ADD COLUMN profile_image_url TEXT;

-- STEP 2: Verify the column was added successfully
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'profile_image_url';

-- STEP 3: View the updated table structure
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Verify the complete users table structure after adding the column
SELECT * FROM users LIMIT 0;

-- View sample user data (without sensitive password field)
SELECT 
  id, 
  name, 
  email, 
  provider, 
  google_id, 
  photo_url, 
  profile_image_url,
  phone, 
  bio, 
  is_active, 
  created_at, 
  updated_at, 
  last_login
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- Expected users table structure should include these columns:
-- id (SERIAL PRIMARY KEY or BIGSERIAL)
-- name (VARCHAR or TEXT)
-- email (VARCHAR or TEXT, UNIQUE)
-- password (TEXT) - for email/password users
-- provider (VARCHAR) - 'email' or 'google'
-- google_id (VARCHAR or TEXT) - for Google OAuth users
-- photo_url (TEXT) - Google profile photo URL
-- profile_image_url (TEXT) - User uploaded custom profile image
-- phone (VARCHAR)
-- bio (TEXT)
-- is_active (BOOLEAN, DEFAULT true)
-- created_at (TIMESTAMP WITH TIME ZONE)
-- updated_at (TIMESTAMP WITH TIME ZONE)
-- last_login (TIMESTAMP WITH TIME ZONE)
