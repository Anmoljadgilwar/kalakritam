# 🚀 IMMEDIATE ACTION REQUIRED - Create Moments Table

## The Error
You're getting a **500 Internal Server Error** because the `moments` table doesn't exist in your Neon database yet.

## Quick Fix (5 Minutes)

### Step 1: Open Neon Database Console
1. Go to: https://console.neon.tech/
2. Login to your account
3. Select your **Kalakritam** project
4. Click on **"SQL Editor"** in the left sidebar

### Step 2: Copy and Run This SQL Script

**Copy this ENTIRE script** and paste it into the SQL Editor, then click **"Run"**:

```sql
-- Create moments table
CREATE TABLE IF NOT EXISTS moments (
    id UUID PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_moments_event_name ON moments(event_name);
CREATE INDEX IF NOT EXISTS idx_moments_created_at ON moments(created_at DESC);

-- Verify
SELECT 'SUCCESS: moments table created!' as status;
```

### Step 3: Verify It Worked

After running the script, you should see:
- ✅ "SUCCESS: moments table created!"
- No error messages

### Step 4: Test Your Application

1. Go back to your application
2. Navigate to `/admin/moments`
3. Try creating a new moment
4. It should now work! 🎉

## What This Does

This creates a table to store:
- **Event Name**: The name of your event
- **Photos**: Multiple photos as a JSON array
- **Timestamps**: When created/updated

## Need Help?

If you get any errors:
1. Take a screenshot of the error
2. Check that you're in the correct database
3. Make sure you have admin permissions

## Alternative: Use pgAdmin or Any PostgreSQL Client

If you prefer using a different tool:

```sql
-- Connection details from your Neon dashboard
-- Then run the same SQL script above
```

---

**After creating the table, your moments feature will work perfectly!** ✨
