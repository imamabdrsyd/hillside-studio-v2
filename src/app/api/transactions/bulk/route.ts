import { NextRequest } from 'next/server'
import { checkAuth, checkRole, errorResponse, successResponse } from '@/lib/api/helpers'

// Valid categories
const VALID_CATEGORIES = ['EARN', 'OPEX', 'VAR', 'CAPEX', 'TAX', 'FIN']

// DELETE /api/transactions/bulk - Bulk delete transactions by category (Managing Director only)
export async function DELETE(request: NextRequest) {
  try {
    const { error, user, profile, supabase } = await checkAuth()
    if (error) return error
    if (!supabase || !user) return errorResponse('Unauthorized', 401)

    // Check role
    const roleError = checkRole(profile?.role, 'managing_director')
    if (roleError) return roleError

    const body = await request.json()
    const { category, year, ids } = body

    // Option 1: Delete by IDs
    if (ids && Array.isArray(ids) && ids.length > 0) {
      const { error: deleteError, count } = await (supabase
        .from('transactions') as any)
        .delete()
        .in('id', ids)

      if (deleteError) {
        console.error('Bulk delete error:', deleteError)
        return errorResponse('Failed to delete transactions', 500)
      }

      return successResponse({
        success: true,
        message: `Deleted ${ids.length} transaction(s)`,
        count: ids.length
      })
    }

    // Option 2: Delete by category (requires year for safety)
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return errorResponse(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, 400)
      }

      if (!year) {
        return errorResponse('Year is required when deleting by category', 400)
      }

      let query = (supabase
        .from('transactions') as any)
        .delete()
        .eq('category', category)
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`)

      const { error: deleteError } = await query

      if (deleteError) {
        console.error('Bulk delete error:', deleteError)
        return errorResponse('Failed to delete transactions', 500)
      }

      return successResponse({
        success: true,
        message: `Deleted ${category} transactions for year ${year}`
      })
    }

    return errorResponse('Must provide either ids array or category with year', 400)
  } catch (error: any) {
    console.error('API Error DELETE /api/transactions/bulk:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/transactions/bulk - Bulk create transactions (Managing Director only)
export async function POST(request: NextRequest) {
  try {
    const { error, user, profile, supabase } = await checkAuth()
    if (error) return error
    if (!supabase || !user) return errorResponse('Unauthorized', 401)

    // Check role
    const roleError = checkRole(profile?.role, 'managing_director')
    if (roleError) return roleError

    const body = await request.json()
    const { transactions } = body

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return errorResponse('Transactions array is required', 400)
    }

    // Validate each transaction
    const validatedTransactions = []
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i]

      if (!t.date || !t.category || !t.description || !t.account) {
        return errorResponse(`Transaction ${i + 1}: Missing required fields`, 400)
      }

      if (!VALID_CATEGORIES.includes(t.category)) {
        return errorResponse(`Transaction ${i + 1}: Invalid category`, 400)
      }

      validatedTransactions.push({
        date: t.date,
        category: t.category,
        description: t.description,
        income: t.income || 0,
        expense: t.expense || 0,
        account: t.account,
        notes: t.notes || null,
        user_id: user.id,
        created_at: new Date().toISOString()
      })
    }

    const { data: newTransactions, error: insertError } = await (supabase
      .from('transactions') as any)
      .insert(validatedTransactions)
      .select()

    if (insertError) {
      console.error('Bulk insert error:', insertError)
      return errorResponse('Failed to create transactions', 500)
    }

    return successResponse({
      transactions: newTransactions,
      count: newTransactions?.length || 0
    }, 201)
  } catch (error: any) {
    console.error('API Error POST /api/transactions/bulk:', error)
    return errorResponse('Internal server error', 500)
  }
}
