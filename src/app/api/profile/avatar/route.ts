import { NextRequest } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

// POST /api/profile/avatar - Upload avatar image
export async function POST(request: NextRequest) {
  try {
    const { error, user, supabase } = await checkAuth()
    if (error) return error
    if (!supabase || !user) return errorResponse('Unauthorized', 401)

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return errorResponse('No file provided', 400)
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('Invalid file type. Allowed: JPG, PNG, WEBP', 400)
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return errorResponse('File too large. Maximum size: 2MB', 400)
    }

    // Get file extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${user.id}/avatar.${ext}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true // Replace existing file
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return errorResponse('Failed to upload file', 500)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

    // Update profile with new avatar URL
    const { error: updateError } = await (supabase
      .from('profiles') as any)
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return errorResponse('Failed to update profile', 500)
    }

    return successResponse({ avatar_url: avatarUrl })
  } catch (error: any) {
    console.error('API Error POST /api/profile/avatar:', error)
    return errorResponse('Internal server error', 500)
  }
}

// DELETE /api/profile/avatar - Remove avatar image
export async function DELETE(request: NextRequest) {
  try {
    const { error, user, supabase } = await checkAuth()
    if (error) return error
    if (!supabase || !user) return errorResponse('Unauthorized', 401)

    // List files in user's folder
    const { data: files } = await supabase.storage
      .from('avatars')
      .list(user.id)

    // Delete all avatar files for this user
    if (files && files.length > 0) {
      const filesToDelete = files.map(f => `${user.id}/${f.name}`)
      await supabase.storage
        .from('avatars')
        .remove(filesToDelete)
    }

    // Update profile to remove avatar URL
    const { error: updateError } = await (supabase
      .from('profiles') as any)
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return errorResponse('Failed to update profile', 500)
    }

    return successResponse({ message: 'Avatar removed' })
  } catch (error: any) {
    console.error('API Error DELETE /api/profile/avatar:', error)
    return errorResponse('Internal server error', 500)
  }
}
