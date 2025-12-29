-- ============================================
-- OTP Codes Table for Email Verification
-- ============================================
-- This table stores OTP codes for various verification purposes
-- Run this script to create the table in your database

CREATE TABLE IF NOT EXISTS otp_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) DEFAULT 'verification',
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_purpose ON otp_codes(email, purpose);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);

-- Add comment to table
COMMENT ON TABLE otp_codes IS 'Stores OTP codes for email verification, login, and password reset';

-- Optional: Create a trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_otp_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_otp_codes_updated_at ON otp_codes;
CREATE TRIGGER trigger_otp_codes_updated_at
    BEFORE UPDATE ON otp_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_otp_codes_updated_at();

-- Optional: Create a cleanup function to delete expired OTPs
-- Run this periodically via a cron job or scheduled task
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM otp_codes 
    WHERE expires_at < NOW() OR (used = TRUE AND created_at < NOW() - INTERVAL '24 hours');
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Example usage: SELECT cleanup_expired_otps();
