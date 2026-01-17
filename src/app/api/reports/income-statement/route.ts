import { NextRequest } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'

export const dynamic = 'force-dynamic'

// GET /api/reports/income-statement - Get income statement (Laba Rugi)
// Query params: month (01-12), year (2025), period (monthly/yearly)
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase) return errorResponse('Unauthorized', 401)

    const { supabase } = authResult
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()
    const month = searchParams.get('month') // "01" to "12" or null
    const period = searchParams.get('period') || 'monthly' // "monthly" or "yearly"

    // Determine date range based on period
    let startDate: string
    let endDate: string
    let periodDisplay: string

    if (period === 'yearly' || !month) {
      // Yearly period
      startDate = `${year}-01-01`
      endDate = `${year}-12-31`
      periodDisplay = `For the year ${year}`
    } else {
      // Monthly period
      const monthNum = parseInt(month, 10)
      if (monthNum < 1 || monthNum > 12) {
        return errorResponse('Invalid month. Must be between 01 and 12', 400)
      }

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]

      const lastDay = new Date(parseInt(year), monthNum, 0).getDate()
      startDate = `${year}-${month}-01`
      endDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`
      periodDisplay = `For the month of ${monthNames[monthNum - 1]} ${year}`
    }

    const { data: transactions, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)

    if (dbError) {
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transactions', 500)
    }

    // Calculate income statement
    let serviceRevenue = 0   // EARN
    let variableCost = 0     // VAR
    let operatingExpenses = 0 // OPEX

    transactions?.forEach((t: any) => {
      if (t.category === 'EARN') serviceRevenue += t.income
      else if (t.category === 'VAR') variableCost += t.expense
      else if (t.category === 'OPEX') operatingExpenses += t.expense
    })

    // Calculations per specification
    const grossProfit = serviceRevenue - variableCost
    const netProfit = grossProfit - operatingExpenses

    // Margins (rounded to whole number)
    const grossProfitMargin = serviceRevenue > 0
      ? Math.round((grossProfit / serviceRevenue) * 100)
      : 0
    const netProfitMargin = serviceRevenue > 0
      ? Math.round((netProfit / serviceRevenue) * 100)
      : 0

    return successResponse({
      period: {
        month: period === 'monthly' && month ? month : null,
        year: parseInt(year),
        display: periodDisplay
      },
      service_revenue: serviceRevenue,
      variable_cost: variableCost,
      gross_profit: grossProfit,
      gross_profit_margin: grossProfitMargin,
      operating_expenses: operatingExpenses,
      net_profit: netProfit,
      net_profit_margin: netProfitMargin
    })
  } catch (error: any) {
    console.error('API Error GET /api/reports/income-statement:', error)
    return errorResponse('Internal server error', 500)
  }
}
