# Brevo SMTP Email Integration

This document describes the email notification system integrated into Kalakritam using Brevo (formerly Sendinblue).

## Overview

The email system automatically sends notifications for:
- 🎨 **Welcome emails** on account creation
- 🔐 **Login alerts** on each successful login
- 🔑 **OTP codes** for verification and passwordless login
- 🔒 **Password reset** links

## Setup Instructions

### 1. Configure Environment Variables

Add these environment variables to your Cloudflare Workers environment:

```bash
# In Cloudflare Dashboard -> Workers -> Your Worker -> Settings -> Variables
BREVO_KEY=your-brevo-api-key-here
```

**To get your Brevo API key:**
1. Sign up at [Brevo](https://www.brevo.com)
2. Go to **SMTP & API** → **API Keys**
3. Create a new API key with "Full Access" permissions
4. Copy the key and add it to your Cloudflare environment

### 2. Verify Sender Email

The default sender email is `noreply@kalakritam.in`. Make sure to:
1. Add and verify this email/domain in Brevo
2. Go to **Senders & IP** → **Add a sender**
3. Complete domain verification for better deliverability

### 3. Run Database Migration

Execute the OTP table creation script:

```sql
-- Run this in your Neon/Postgres database
-- File: scripts/create_otp_table.sql
```

## API Endpoints

### OTP Endpoints

#### Request OTP
```http
POST /api/auth/request-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "purpose": "verification" | "login" | "password-reset"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "expiresIn": 300
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "purpose": "verification" | "login"
}
```

**Response (verification):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}
```

**Response (login - includes auth token):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true,
  "data": { ... user object ... },
  "token": "jwt-token-here"
}
```

### Password Reset Endpoints

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

## Frontend Usage

### Using the API Functions

```javascript
import { userAuthApi } from '@/lib/adminApi';

// Request OTP for login
await userAuthApi.requestOTP('user@example.com', 'login');

// Verify OTP (for login - automatically stores token)
const result = await userAuthApi.verifyOTP('user@example.com', '123456', 'login');

// Request password reset
await userAuthApi.forgotPassword('user@example.com');

// Reset password with token
await userAuthApi.resetPassword(resetToken, 'newPassword123');
```

### Example: OTP Login Flow

```jsx
import { useState } from 'react';
import { userAuthApi } from '@/lib/adminApi';

function OTPLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    setLoading(true);
    try {
      await userAuthApi.requestOTP(email, 'login');
      setStep('otp');
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const result = await userAuthApi.verifyOTP(email, otp, 'login');
      if (result.success) {
        toast.success('Login successful!');
        // Redirect to dashboard
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      {step === 'email' ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button onClick={handleRequestOTP} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />
          <button onClick={handleVerifyOTP} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </>
      )}
    </div>
  );
}
```

## Email Templates

The system includes beautifully designed HTML email templates for:

1. **Welcome Email** - Sent on signup with gradient header and CTA button
2. **Login Alert** - Security notification with IP/device info
3. **OTP Email** - Large, easy-to-read OTP code with expiry notice
4. **Password Reset** - Reset link with 1-hour expiry

All templates are:
- Mobile-responsive
- Branded with Kalakritam colors
- Include proper headers and footers

## Security Features

1. **OTP Expiration**: All OTPs expire after 5 minutes
2. **Single Use**: OTPs can only be used once
3. **Rate Limiting**: Consider adding rate limiting for OTP requests
4. **Email Enumeration Prevention**: Password reset always returns success
5. **Token-based Reset**: Password reset uses JWT with 1-hour expiry

## Troubleshooting

### Emails not sending?
1. Check if `BREVO_KEY` is set in Cloudflare environment
2. Verify sender email in Brevo dashboard
3. Check Brevo logs for delivery issues

### OTP not working?
1. Ensure OTP table exists in database
2. Check if OTP hasn't expired (5-minute window)
3. Verify email/OTP combination is correct

### Testing locally
The email service gracefully handles missing credentials by logging a warning and returning `success: false`, so the app won't crash without Brevo configured.

## Rate Limits (Brevo Free Plan)

- 300 emails/day
- 9,000 emails/month

For production, consider upgrading to a paid plan for higher limits.
