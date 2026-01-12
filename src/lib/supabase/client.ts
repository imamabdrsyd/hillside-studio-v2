import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

// Create Supabase client for use in Client Components
// This client automatically handles session management and token refresh
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  // Support both old and new Supabase env var naming conventions
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    'placeholder-key'

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  const hasKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY !== undefined

  const keyValue =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  return (
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    hasKey &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    keyValue !== 'placeholder-key'
  )
}
