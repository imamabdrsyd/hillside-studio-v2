import { NextRequest, NextResponse } from 'next/server'
import { successResponse } from '@/lib/api/helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Sign out user (will not fail if already logged out)
    await supabase.auth.signOut()

    return successResponse({ success: true })
  } catch (error: any) {
    console.error('API Error /api/auth/logout:', error)
    // Still return success even if error, to allow client-side cleanup
    return successResponse({ success: true })
  }
}
