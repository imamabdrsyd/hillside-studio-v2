import { NextRequest } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'
import { INITIAL_CAPITAL } from '@/lib/constants'

// GET /api/reports/cash-flow - Get cash flow statement (Arus Kas)
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase) return errorResponse('Unauthorized', 401)

    const { supabase } = authResult
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Get transactions for selected year
    const { data: transactions, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)

    if (dbError) {
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transactions', 500)
    }

    // Get previous year transactions for opening balance
    const prevYear = (parseInt(year) - 1).toString()
    const { data: prevTransactions } = await (supabase
      .from('transactions') as any)
      .select('*')
      .lte('date', `${prevYear}-12-31`)

    // Calculate opening balance
    let prevIncome = 0
    let prevExpense = 0
    prevTransactions?.forEach((t: any) => {
      prevIncome += t.income || 0
      prevExpense += t.expense || 0
    })
    const openingBalance = INITIAL_CAPITAL + prevIncome - prevExpense

    // Calculate cash flow categories
    let operatingInflow = 0   // EARN
    let operatingOutflow = 0  // OPEX + VAR + TAX
    let investingOutflow = 0  // CAPEX
    let financingFlow = 0     // FIN

    transactions?.forEach((t: any) => {
      if (t.category === 'EARN') {
        operatingInflow += t.income || 0
      } else if (t.category === 'OPEX' || t.category === 'VAR' || t.category === 'TAX') {
        operatingOutflow += t.expense || 0
      } else if (t.category === 'CAPEX') {
        investingOutflow += t.expense || 0
      } else if (t.category === 'FIN') {
        financingFlow += (t.income || 0) - (t.expense || 0)
      }
    })

    const operatingCashFlow = operatingInflow - operatingOutflow
    const investingCashFlow = -investingOutflow
    const financingCashFlow = financingFlow

    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow
    const closingBalance = openingBalance + netCashFlow

    // Monthly breakdown
    const monthly = Array(12).fill(null).map((_, i) => ({
      month: i + 1,
      inflow: 0,
      outflow: 0,
      netFlow: 0
    }))

    transactions?.forEach((t: any) => {
      const month = new Date(t.date).getMonth()
      monthly[month].inflow += t.income || 0
      monthly[month].outflow += t.expense || 0
    })

    monthly.forEach(m => {
      m.netFlow = m.inflow - m.outflow
    })

    return successResponse({
      year,
      openingBalance,
      operating: {
        inflow: operatingInflow,
        outflow: operatingOutflow,
        netCashFlow: operatingCashFlow
      },
      investing: {
        outflow: investingOutflow,
        netCashFlow: investingCashFlow
      },
      financing: {
        netCashFlow: financingCashFlow
      },
      netCashFlow,
      closingBalance,
      monthly
    })
  } catch (error: any) {
    console.error('API Error GET /api/reports/cash-flow:', error)
    return errorResponse('Internal server error', 500)
  }
}
