-- ============================================
-- FIX RLS POLICIES FOR DEMO/DEVELOPMENT
-- ============================================
--
-- IMPORTANT: This script allows public access to the database
-- without authentication. This is suitable for demo/development
-- purposes only.
--
-- For production, implement proper Supabase Auth authentication!
-- ============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Superadmins can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Superadmins can update transactions" ON transactions;
DROP POLICY IF EXISTS "Superadmins can delete transactions" ON transactions;

-- Create new public policies (DEMO ONLY)
CREATE POLICY "Public can insert transactions"
    ON transactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can update transactions"
    ON transactions FOR UPDATE
    USING (true);

CREATE POLICY "Public can delete transactions"
    ON transactions FOR DELETE
    USING (true);

-- The SELECT policy already allows public access:
-- "Users can view all transactions" USING (true)

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this query to verify policies are updated:
-- SELECT * FROM pg_policies WHERE tablename = 'transactions';
