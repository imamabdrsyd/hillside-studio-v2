import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, checkRole, errorResponse, successResponse } from '@/lib/api/helpers'

// Valid categories
const VALID_CATEGORIES = ['EARN', 'OPEX', 'VAR', 'CAPEX', 'TAX', 'FIN']

// GET /api/transactions - List all transactions with filters
export async function GET(request: NextRequest) {
  try {
    const { error, supabase } = await checkAuth()
    if (error) return error
    if (!supabase) return errorResponse('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    let query = (supabase.from('transactions') as any)
      .select('*')
      .order('date', { ascending: false })

    // Filter by year
    if (year) {
      query = query
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`)
    }

    // Filter by month (requires year)
    if (year && month) {
      const paddedMonth = month.padStart(2, '0')
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
      query = query
        .gte('date', `${year}-${paddedMonth}-01`)
        .lte('date', `${year}-${paddedMonth}-${lastDay}`)
    }

    // Filter by category
    if (category && VALID_CATEGORIES.includes(category)) {
      query = query.eq('category', category)
    }

    // Pagination
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + (parseInt(limit || '50') - 1))
    }

    const { data: transactions, error: dbError } = await query

    if (dbError) {
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transactions', 500)
    }

    return successResponse({
      transactions: transactions || [],
      count: transactions?.length || 0
    })
  } catch (error: any) {
    console.error('API Error GET /api/transactions:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/transactions - Create new transaction (Managing Director only)
export async function POST(request: NextRequest) {
  try {
    const { error, user, profile, supabase } = await checkAuth()
    if (error) return error
    if (!supabase || !user) return errorResponse('Unauthorized', 401)

    // Check role
    const roleError = checkRole(profile?.role, 'managing_director')
    if (roleError) return roleError

    const body = await request.json()
    const { date, category, description, income, expense, account, notes } = body

    // Validate required fields
    if (!date || !category || !description || !account) {
      return errorResponse('Missing required fields: date, category, description, account', 400)
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
      return errorResponse(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, 400)
    }

    // Validate amounts
    if ((income !== undefined && income < 0) || (expense !== undefined && expense < 0)) {
      return errorResponse('Income and expense must be non-negative', 400)
    }

    const transactionData = {
      date,
      category,
      description,
      income: income || 0,
      expense: expense || 0,
      account,
      notes: notes || null,
      user_id: user.id,
      created_at: new Date().toISOString()
    }

    const { data: newTransaction, error: insertError } = await (supabase
      .from('transactions') as any)
      .insert(transactionData)
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return errorResponse('Failed to create transaction', 500)
    }

    return successResponse({ transaction: newTransaction }, 201)
  } catch (error: any) {
    console.error('API Error POST /api/transactions:', error)
    return errorResponse('Internal server error', 500)
  }
}
