import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const { error, profile } = await checkAuth()
    if (error) return error

    return successResponse({ profile })
  } catch (error: any) {
    console.error('API Error GET /api/profile:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/profile - Update user's profile
export async function PUT(request: NextRequest) {
  try {
    const { error, user, profile, supabase } = await checkAuth()
    if (error) return error

    const body = await request.json()
    const { full_name } = body

    // Validate input
    if (full_name !== undefined && (typeof full_name !== 'string' || full_name.trim().length === 0)) {
      return errorResponse('Full name must be a non-empty string', 400)
    }

    // Update profile
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (full_name !== undefined) {
      updateData.full_name = full_name.trim()
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user?.id)
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return errorResponse('Failed to update profile', 500)
    }

    return successResponse({ profile: updatedProfile })
  } catch (error: any) {
    console.error('API Error PUT /api/profile:', error)
    return errorResponse('Internal server error', 500)
  }
}
