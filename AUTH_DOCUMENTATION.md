# Authentication System Documentation

## Overview

The MotoTaxi app now features a modern, secure authentication system powered by Supabase with support for:

- Phone number authentication with OTP verification
- Password-based login
- Google OAuth sign-in
- User profiles with role-based access control
- Student verification system
- Child profile management for parents

## Architecture

### Database Schema

#### profiles table
Extends Supabase's built-in auth.users table with:
- `phone`: Unique phone number
- `name`: User's full name
- `user_type`: customer | driver | admin
- `profile_type`: regular | student | worker | parent
- `status`: active | suspended | pending
- `discount_percentage`: Automatic discount based on profile type
- `wallet_balance`: User's wallet balance
- `is_student_verified`: Student verification status
- `is_driver_verified`: Driver verification status

#### student_verifications table
- `user_id`: Reference to profiles
- `document_url`: URL to uploaded student ID document
- `school_name`: Name of the school
- `student_id`: Student ID number
- `verification_status`: pending | approved | rejected
- `rejection_reason`: Admin reason for rejection

#### child_profiles table
- `parent_id`: Reference to parent's profile
- `name`: Child's name
- `age`: Optional age
- `school_name`: Optional school name
- `pickup_locations`: JSON array of pickup locations
- `dropoff_locations`: JSON array of dropoff locations
- `emergency_contact`: Emergency contact information

#### otp_verifications table
- `phone`: Phone number
- `otp_code`: 6-digit OTP code
- `expires_at`: Expiration timestamp (5 minutes)
- `verified`: Boolean flag
- `attempts`: Failed verification attempts counter

## API Endpoints

### POST /functions/v1/auth-register
Register a new user account.

**Request Body:**
```json
{
  "phone": "+237600000000",
  "name": "John Doe",
  "password": "securepassword123",
  "user_type": "customer",
  "profile_type": "student"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "phone": "+237600000000",
    "name": "John Doe",
    "user_type": "customer",
    "profile_type": "student",
    "discount_percentage": 15
  },
  "token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

### POST /functions/v1/auth-login
Login with phone and password or OTP.

**Request Body (Password):**
```json
{
  "phone": "+237600000000",
  "password": "securepassword123"
}
```

**Request Body (OTP):**
```json
{
  "phone": "+237600000000",
  "otp": "123456"
}
```

**Response:** Same as register

### POST /functions/v1/auth-otp-send
Send OTP to phone number.

**Request Body:**
```json
{
  "phone": "+237600000000"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "expires_in": 300,
  "dev_otp": "123456"
}
```

Note: `dev_otp` is only included in development mode.

### POST /functions/v1/auth-otp-verify
Verify OTP code.

**Request Body:**
```json
{
  "phone": "+237600000000",
  "otp": "123456"
}
```

**Response:** Same as register

### GET /functions/v1/users-me
Get current user profile. Requires authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "uuid",
  "phone": "+237600000000",
  "name": "John Doe",
  "user_type": "customer",
  "profile_type": "student",
  "status": "active",
  "discount_percentage": 15,
  "wallet_balance": 5000,
  "is_student_verified": false,
  "is_driver_verified": false,
  "zone": "Zone 1 - Douala",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### PUT /functions/v1/users-me
Update current user profile. Requires authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "zone": "Zone 2 - Akwa",
  "profile_type": "worker"
}
```

**Response:** Updated profile object

### POST /functions/v1/users-student-verify
Submit student verification document. Requires authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "document_url": "https://storage.supabase.co/...",
  "school_name": "University of Douala",
  "student_id": "STU123456"
}
```

**Response:**
```json
{
  "message": "Student verification submitted successfully",
  "verification": {
    "id": "uuid",
    "user_id": "uuid",
    "verification_status": "pending",
    "submitted_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /functions/v1/users-child-profiles
Get list of child profiles. Requires authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "parent_id": "uuid",
    "name": "Child Name",
    "age": 10,
    "school_name": "Primary School",
    "pickup_locations": ["Home", "School"],
    "dropoff_locations": ["School", "Home"],
    "emergency_contact": "+237600000001",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /functions/v1/users-child-profiles
Create a new child profile. Requires authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Child Name",
  "age": 10,
  "school_name": "Primary School",
  "pickup_locations": ["Home", "School"],
  "dropoff_locations": ["School", "Home"],
  "emergency_contact": "+237600000001"
}
```

**Response:** Created child profile object

## Frontend Integration

### Setup Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Using the Auth API

```typescript
import { authAPI } from './lib/auth';

// Register
const result = await authAPI.register({
  phone: '+237600000000',
  name: 'John Doe',
  password: 'password123',
  user_type: 'customer',
  profile_type: 'student'
});

// Login with password
const loginResult = await authAPI.login({
  phone: '+237600000000',
  password: 'password123'
});

// Send OTP
const otpResult = await authAPI.sendOTP('+237600000000');

// Verify OTP
const verifyResult = await authAPI.verifyOTP('+237600000000', '123456');

// Get profile
const profile = await authAPI.getProfile();

// Update profile
const updated = await authAPI.updateProfile({ name: 'Jane Doe' });

// Google Sign-in
await authAPI.signInWithGoogle();

// Logout
await authAPI.logout();
```

### Using ProfileContext

```typescript
import { useProfile } from './contexts/ProfileContext';

function MyComponent() {
  const { profile, loading, refreshProfile, logout } = useProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      <p>Type: {profile.user_type}</p>
      <p>Discount: {profile.discount_percentage}%</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data.

### Rate Limiting
- OTP requests limited to 3 per hour per phone number
- OTP verification limited to 3 attempts per OTP

### Password Requirements
- Minimum 6 characters
- Stored securely using Supabase Auth

### Session Management
- Automatic token refresh
- Secure session storage
- Auth state synchronization

## Google OAuth Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Enable Google provider in Supabase Dashboard > Authentication > Providers
5. Add Client ID and Secret from Google Console

## OTP Integration

For production, integrate with an SMS service:

1. Sign up for Twilio, Africa's Talking, or similar SMS service
2. Update the `auth-otp-send` Edge Function to send real SMS
3. Remove the `dev_otp` field from the response
4. Add API credentials to Supabase Secrets

Example Twilio integration:
```typescript
import { Twilio } from 'npm:twilio@4';

const client = new Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
);

await client.messages.create({
  body: `Your MotoTaxi verification code is: ${otpCode}`,
  from: Deno.env.get('TWILIO_PHONE_NUMBER'),
  to: phone
});
```

## Discount System

Automatic discounts based on profile type:
- Student: 15%
- Worker: 10%
- Regular: 0%

Discounts are applied automatically when calculating fares.

## Next Steps

1. Set up environment variables
2. Run `npm install` to install dependencies
3. Configure Google OAuth (optional)
4. Integrate SMS service for OTP (production)
5. Test authentication flow
6. Customize as needed

## Troubleshooting

### "Missing Supabase environment variables"
Make sure `.env` file exists with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### "Failed to fetch profile"
Check that the user is authenticated and the token is valid

### "OTP not received"
In development, OTP is returned in the response as `dev_otp`. For production, integrate SMS service.

### "Google sign-in not working"
Verify OAuth credentials are set up correctly in Supabase Dashboard
