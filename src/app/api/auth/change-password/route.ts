import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { error, user, supabase } = await checkAuth()
    if (error) return error

    const body = await request.json()
    const { new_password } = body

    // Validate input
    if (!new_password || new_password.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400)
    }

    // Update password using Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      return errorResponse('Failed to update password', 500)
    }

    return successResponse({ 
      success: true, 
      message: 'Password updated successfully' 
    })
  } catch (error: any) {
    console.error('API Error /api/auth/change-password:', error)
    return errorResponse('Internal server error', 500)
  }
}
