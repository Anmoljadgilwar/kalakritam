-- ============================================
-- QUICK SETUP SCRIPT FOR MOMENTS TABLE
-- Run this entire script in Neon SQL Editor
-- ============================================

-- Step 1: Create the moments table
CREATE TABLE IF NOT EXISTS moments (
    id UUID PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moments_event_name ON moments(event_name);
CREATE INDEX IF NOT EXISTS idx_moments_created_at ON moments(created_at DESC);

-- Step 3: Add table and column comments
COMMENT ON TABLE moments IS 'Stores event moments with multiple photos';
COMMENT ON COLUMN moments.id IS 'Unique identifier for each moment';
COMMENT ON COLUMN moments.event_name IS 'Name of the event';
COMMENT ON COLUMN moments.photos IS 'Array of photo URLs stored as JSON';
COMMENT ON COLUMN moments.created_at IS 'Timestamp when the moment was created';
COMMENT ON COLUMN moments.updated_at IS 'Timestamp when the moment was last updated';

-- Step 4: Verify the table was created
SELECT 
    'moments table created successfully!' as status,
    COUNT(*) as row_count 
FROM moments;

-- Step 5: Show table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'moments'
ORDER BY ordinal_position;

-- Done! The moments table is now ready to use.
