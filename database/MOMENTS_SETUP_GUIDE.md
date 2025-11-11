# Database Setup Instructions for Moments Feature

## Prerequisites
- Access to Neon Database Console (https://console.neon.tech/)
- Your Kalakritam database connection details

## Step-by-Step Instructions

### 1. Login to Neon Database Console
- Go to https://console.neon.tech/
- Login with your credentials
- Select your Kalakritam project

### 2. Open SQL Editor
- Click on "SQL Editor" in the left sidebar
- Or navigate to the database you want to use

### 3. Execute the Moments Table Creation Script

Copy and paste this SQL script into the SQL Editor and run it:

```sql
-- Create moments table for storing event photos
CREATE TABLE IF NOT EXISTS moments (
    id UUID PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_moments_event_name ON moments(event_name);
CREATE INDEX IF NOT EXISTS idx_moments_created_at ON moments(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE moments IS 'Stores event moments with multiple photos';
COMMENT ON COLUMN moments.id IS 'Unique identifier for each moment';
COMMENT ON COLUMN moments.event_name IS 'Name of the event';
COMMENT ON COLUMN moments.photos IS 'Array of photo URLs stored as JSON';
COMMENT ON COLUMN moments.created_at IS 'Timestamp when the moment was created';
COMMENT ON COLUMN moments.updated_at IS 'Timestamp when the moment was last updated';
```

### 4. Verify Table Creation

Run this query to verify the table was created successfully:

```sql
SELECT * FROM moments;
```

You should see an empty result set (no rows) but no errors.

### 5. Check Table Structure

Run this query to see the table structure:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'moments'
ORDER BY ordinal_position;
```

## Table Structure

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | UUID | Primary key, unique identifier |
| event_name | VARCHAR(255) | Name of the event |
| photos | JSONB | Array of photo URLs (JSON format) |
| created_at | TIMESTAMP | When the moment was created |
| updated_at | TIMESTAMP | When the moment was last updated |

## Sample Data (Optional)

If you want to test with sample data:

```sql
INSERT INTO moments (id, event_name, photos, created_at, updated_at) 
VALUES (
    gen_random_uuid(), 
    'Art Workshop 2025', 
    '["https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg", "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Error: "relation moments already exists"
- The table already exists. You can drop it first if you need to recreate it:
```sql
DROP TABLE IF EXISTS moments CASCADE;
```
Then run the creation script again.

### Error: "permission denied"
- Make sure you're logged in as a user with CREATE TABLE permissions
- Check with your database administrator

### Error: "database connection failed"
- Verify your connection string in the Cloudflare Worker environment variables
- Check that your database is running

## Next Steps

After creating the table:
1. The moments API endpoints in the worker file will now work
2. You can access `/admin/moments` to create new moments
3. View moments at `/moments` on the public site

## API Endpoints Available

- `GET /api/moments` - Public endpoint to fetch all moments
- `GET /admin/moments` - Admin endpoint (requires authentication)
- `POST /admin/moments` - Create new moment (requires authentication)
- `PUT /admin/moments/:id` - Update moment (requires authentication)
- `DELETE /admin/moments/:id` - Delete moment (requires authentication)
