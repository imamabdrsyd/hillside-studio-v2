-- ============================================
-- Hillside Studio Finance v2 - Auth Schema
-- ============================================
-- This file contains the database schema for authentication
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Create profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('managing_director', 'investor', 'guest')) DEFAULT 'investor',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- ============================================
-- 2. Create function to handle new user signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Set role based on email
  IF NEW.email = 'imam.isyida@gmail.com' THEN
    user_role := 'managing_director';
  ELSE
    user_role := 'investor';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. Create trigger for auto-creating profile
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 4. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- ============================================
-- 5. Create RLS Policies
-- ============================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 6. Create function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. Create trigger for updating updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. Update existing tables with user_id if needed
-- ============================================
-- Add user_id column to transactions table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN user_id UUID REFERENCES auth.users(id);
    CREATE INDEX transactions_user_id_idx ON transactions(user_id);
  END IF;
END $$;

-- Add user_id column to assets table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assets' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE assets ADD COLUMN user_id UUID REFERENCES auth.users(id);
    CREATE INDEX assets_user_id_idx ON assets(user_id);
  END IF;
END $$;

-- Add user_id column to bookings table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN user_id UUID REFERENCES auth.users(id);
    CREATE INDEX bookings_user_id_idx ON bookings(user_id);
  END IF;
END $$;

-- ============================================
-- 9. Grant permissions
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- ============================================
-- 10. Update existing imam.isyida@gmail.com to managing_director
-- ============================================
-- Update role for imam.isyida@gmail.com if already exists
UPDATE profiles
SET role = 'managing_director'
WHERE email = 'imam.isyida@gmail.com';

-- ============================================
-- 11. Create Test Accounts
-- ============================================
-- NOTE: To create test accounts, use the application's register page
-- or Supabase Dashboard → Authentication → Add User
--
-- Test Account Credentials (create via register page):
-- 1. Director Account:
--    Email: imam.isyida@gmail.com
--    Password: (set your own)
--    Role: Will automatically be 'managing_director'
--
-- 2. Investor Account:
--    Email: investor@hillsidestudio.id
--    Password: Investor123
--    Role: Will automatically be 'investor'
--
-- After creating via register page, the trigger will automatically:
-- - Create profile with correct role
-- - Send verification email

-- ============================================
-- 12. Test Queries (Optional - for verification)
-- ============================================
-- To verify the setup, run:
-- SELECT * FROM profiles;
-- SELECT * FROM auth.users;
