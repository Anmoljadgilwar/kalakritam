-- Create moments table for storing event photos
-- This table stores event moments with multiple photos per event

CREATE TABLE IF NOT EXISTS moments (
    id UUID PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_moments_event_name ON moments(event_name);
CREATE INDEX IF NOT EXISTS idx_moments_created_at ON moments(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE moments IS 'Stores event moments with multiple photos';
COMMENT ON COLUMN moments.id IS 'Unique identifier for each moment';
COMMENT ON COLUMN moments.event_name IS 'Name of the event';
COMMENT ON COLUMN moments.photos IS 'Array of photo URLs stored as JSON';
COMMENT ON COLUMN moments.created_at IS 'Timestamp when the moment was created';
COMMENT ON COLUMN moments.updated_at IS 'Timestamp when the moment was last updated';

-- Example insert query
-- INSERT INTO moments (id, event_name, photos, created_at, updated_at) 
-- VALUES (
--     gen_random_uuid(), 
--     'Art Workshop 2025', 
--     '["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]'::jsonb,
--     CURRENT_TIMESTAMP,
--     CURRENT_TIMESTAMP
-- );
