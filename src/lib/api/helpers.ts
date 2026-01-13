import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function checkAuth() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null,
      profile: null
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    error: null,
    user,
    profile,
    supabase
  }
}

export function checkRole(role: string | null | undefined, requiredRole: 'managing_director' | 'investor') {
  if (requiredRole === 'managing_director' && role !== 'managing_director') {
    return NextResponse.json(
      { error: 'Forbidden: Only Managing Director can perform this action' },
      { status: 403 }
    )
  }
  return null
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}
