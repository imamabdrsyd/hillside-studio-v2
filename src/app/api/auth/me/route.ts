import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/api/helpers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { error, user, profile } = await checkAuth()

    if (error) return error

    return NextResponse.json({
      user: {
        id: user?.id,
        email: user?.email,
        created_at: user?.created_at
      },
      profile
    })
  } catch (error: any) {
    console.error('API Error /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
