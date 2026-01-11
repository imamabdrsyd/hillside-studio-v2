import { createClient } from '@supabase/supabase-js'

// Use fallback values during build time to prevent build errors
// In production, these will be replaced with actual environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client
// If environment variables are not set, the client will be created but API calls will fail gracefully
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'placeholder-key'
  )
}
