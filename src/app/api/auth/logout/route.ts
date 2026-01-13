import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, successResponse } from '@/lib/api/helpers'

export async function POST(request: NextRequest) {
  try {
    const { supabase } = await checkAuth()

    // Sign out user
    await supabase.auth.signOut()

    return successResponse({ success: true })
  } catch (error: any) {
    console.error('API Error /api/auth/logout:', error)
    // Still return success even if error, to allow client-side cleanup
    return successResponse({ success: true })
  }
}
