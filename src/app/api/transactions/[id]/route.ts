import { NextRequest } from 'next/server'
import { checkAuth, checkRole, errorResponse, successResponse } from '@/lib/api/helpers'

export const dynamic = 'force-dynamic'

// Valid categories
const VALID_CATEGORIES = ['EARN', 'OPEX', 'VAR', 'CAPEX', 'TAX', 'FIN']

// GET /api/transactions/[id] - Get single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, supabase } = await checkAuth()
    if (error) return error
    if (!supabase) return errorResponse('Unauthorized', 401)

    const { id } = params

    const { data: transaction, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .eq('id', id)
      .single()

    if (dbError) {
      if (dbError.code === 'PGRST116') {
        return errorResponse('Transaction not found', 404)
      }
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transaction', 500)
    }

    return successResponse({ transaction })
  } catch (error: any) {
    console.error('API Error GET /api/transactions/[id]:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/transactions/[id] - Update transaction (Managing Director only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase || !authResult.user) return errorResponse('Unauthorized', 401)

    // Check role
    const roleError = checkRole(authResult.profile?.role, 'managing_director')
    if (roleError) return roleError

    const { supabase, user } = authResult

    const { id } = params
    const body = await request.json()
    const { date, category, description, income, expense, account, notes } = body

    // Check if transaction exists
    const { data: existing, error: findError } = await (supabase
      .from('transactions') as any)
      .select('id')
      .eq('id', id)
      .single()

    if (findError || !existing) {
      return errorResponse('Transaction not found', 404)
    }

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return errorResponse(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, 400)
    }

    // Validate amounts if provided
    if ((income !== undefined && income < 0) || (expense !== undefined && expense < 0)) {
      return errorResponse('Income and expense must be non-negative', 400)
    }

    // Build update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (date !== undefined) updateData.date = date
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (income !== undefined) updateData.income = income
    if (expense !== undefined) updateData.expense = expense
    if (account !== undefined) updateData.account = account
    if (notes !== undefined) updateData.notes = notes

    const { data: updatedTransaction, error: updateError } = await (supabase
      .from('transactions') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return errorResponse('Failed to update transaction', 500)
    }

    return successResponse({ transaction: updatedTransaction })
  } catch (error: any) {
    console.error('API Error PUT /api/transactions/[id]:', error)
    return errorResponse('Internal server error', 500)
  }
}

// DELETE /api/transactions/[id] - Delete transaction (Managing Director only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase || !authResult.user) return errorResponse('Unauthorized', 401)

    // Check role
    const roleError = checkRole(authResult.profile?.role, 'managing_director')
    if (roleError) return roleError

    const { supabase } = authResult
    const { id } = params

    // Check if transaction exists
    const { data: existing, error: findError } = await (supabase
      .from('transactions') as any)
      .select('id')
      .eq('id', id)
      .single()

    if (findError || !existing) {
      return errorResponse('Transaction not found', 404)
    }

    const { error: deleteError } = await (supabase
      .from('transactions') as any)
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return errorResponse('Failed to delete transaction', 500)
    }

    return successResponse({ success: true, message: 'Transaction deleted' })
  } catch (error: any) {
    console.error('API Error DELETE /api/transactions/[id]:', error)
    return errorResponse('Internal server error', 500)
  }
}
