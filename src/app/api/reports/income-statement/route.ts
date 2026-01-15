import { NextRequest } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'

// GET /api/reports/income-statement - Get income statement (Laba Rugi)
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase) return errorResponse('Unauthorized', 401)

    const { supabase } = authResult
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    const { data: transactions, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)

    if (dbError) {
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transactions', 500)
    }

    // Calculate income statement
    let revenue = 0          // EARN
    let variableCosts = 0    // VAR
    let operatingExpenses = 0 // OPEX
    let taxes = 0            // TAX

    transactions?.forEach((t: any) => {
      if (t.category === 'EARN') revenue += t.income
      else if (t.category === 'VAR') variableCosts += t.expense
      else if (t.category === 'OPEX') operatingExpenses += t.expense
      else if (t.category === 'TAX') taxes += t.expense
    })

    const grossProfit = revenue - variableCosts
    const operatingProfit = grossProfit - operatingExpenses
    const netProfit = operatingProfit - taxes

    const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(2) : '0.00'
    const operatingMargin = revenue > 0 ? ((operatingProfit / revenue) * 100).toFixed(2) : '0.00'
    const netMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(2) : '0.00'

    return successResponse({
      year,
      revenue,
      variableCosts,
      grossProfit,
      grossMargin: parseFloat(grossMargin),
      operatingExpenses,
      operatingProfit,
      operatingMargin: parseFloat(operatingMargin),
      taxes,
      netProfit,
      netMargin: parseFloat(netMargin)
    })
  } catch (error: any) {
    console.error('API Error GET /api/reports/income-statement:', error)
    return errorResponse('Internal server error', 500)
  }
}
