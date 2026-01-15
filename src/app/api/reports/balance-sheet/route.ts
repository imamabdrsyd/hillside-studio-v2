import { NextRequest } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'
import { INITIAL_CAPITAL } from '@/lib/constants'

// GET /api/reports/balance-sheet - Get balance sheet (Neraca)
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase) return errorResponse('Unauthorized', 401)

    const { supabase } = authResult
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Get all transactions up to end of selected year
    const { data: transactions, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .lte('date', `${year}-12-31`)

    if (dbError) {
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transactions', 500)
    }

    // Get assets
    const { data: assets, error: assetsError } = await (supabase
      .from('assets') as any)
      .select('*')
      .lte('purchase_date', `${year}-12-31`)

    if (assetsError) {
      console.error('Assets error:', assetsError)
    }

    // Calculate totals
    let totalIncome = 0
    let totalExpense = 0
    let capex = 0

    transactions?.forEach((t: any) => {
      totalIncome += t.income || 0
      totalExpense += t.expense || 0
      if (t.category === 'CAPEX') capex += t.expense || 0
    })

    // Assets
    const cashBalance = INITIAL_CAPITAL + totalIncome - totalExpense
    const fixedAssets = assets?.reduce((sum: number, a: any) => sum + (a.purchase_price * a.quantity), 0) || capex

    // Total Assets
    const totalAssets = cashBalance + fixedAssets

    // Liabilities (simplified - no debt tracking yet)
    const totalLiabilities = 0

    // Equity
    const retainedEarnings = totalIncome - totalExpense
    const totalEquity = INITIAL_CAPITAL + retainedEarnings

    return successResponse({
      year,
      assets: {
        cash: cashBalance,
        fixedAssets,
        totalAssets
      },
      liabilities: {
        totalLiabilities
      },
      equity: {
        initialCapital: INITIAL_CAPITAL,
        retainedEarnings,
        totalEquity
      },
      // Balance check: Assets = Liabilities + Equity
      isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1
    })
  } catch (error: any) {
    console.error('API Error GET /api/reports/balance-sheet:', error)
    return errorResponse('Internal server error', 500)
  }
}
