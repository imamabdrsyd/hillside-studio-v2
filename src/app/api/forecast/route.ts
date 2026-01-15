import { NextRequest } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'
import { INITIAL_CAPITAL } from '@/lib/constants'

// GET /api/forecast - Get ROI & forecast projections
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase) return errorResponse('Unauthorized', 401)

    const { supabase } = authResult
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Get all transactions for the year
    const { data: transactions, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)

    if (dbError) {
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transactions', 500)
    }

    // Calculate monthly data
    const monthlyData = Array(12).fill(null).map(() => ({
      revenue: 0,
      expense: 0,
      profit: 0
    }))

    transactions?.forEach((t: any) => {
      const month = new Date(t.date).getMonth()
      if (t.category === 'EARN') {
        monthlyData[month].revenue += t.income || 0
      }
      monthlyData[month].expense += t.expense || 0
    })

    monthlyData.forEach(m => {
      m.profit = m.revenue - m.expense
    })

    // Calculate current month and YTD
    const currentMonth = new Date().getMonth()
    const monthsElapsed = currentMonth + 1

    const ytdRevenue = monthlyData.slice(0, monthsElapsed).reduce((sum, m) => sum + m.revenue, 0)
    const ytdExpense = monthlyData.slice(0, monthsElapsed).reduce((sum, m) => sum + m.expense, 0)
    const ytdProfit = ytdRevenue - ytdExpense

    // Calculate averages
    const avgMonthlyRevenue = monthsElapsed > 0 ? ytdRevenue / monthsElapsed : 0
    const avgMonthlyExpense = monthsElapsed > 0 ? ytdExpense / monthsElapsed : 0
    const avgMonthlyProfit = monthsElapsed > 0 ? ytdProfit / monthsElapsed : 0

    // Project full year
    const projectedAnnualRevenue = avgMonthlyRevenue * 12
    const projectedAnnualExpense = avgMonthlyExpense * 12
    const projectedAnnualProfit = avgMonthlyProfit * 12

    // ROI Calculations
    const currentROI = INITIAL_CAPITAL > 0 ? (ytdProfit / INITIAL_CAPITAL) * 100 : 0
    const annualizedROI = INITIAL_CAPITAL > 0 ? (projectedAnnualProfit / INITIAL_CAPITAL) * 100 : 0

    // Payback period (in months)
    const monthlyNetCashFlow = avgMonthlyProfit
    const paybackPeriodMonths = monthlyNetCashFlow > 0
      ? Math.ceil(INITIAL_CAPITAL / monthlyNetCashFlow)
      : null

    // Break-even analysis
    const breakEvenMonths = paybackPeriodMonths

    // Growth trends (compare first half vs second half if data available)
    let growthTrend = 0
    if (monthsElapsed > 6) {
      const firstHalf = monthlyData.slice(0, 6).reduce((sum, m) => sum + m.revenue, 0)
      const secondHalfMonths = Math.min(monthsElapsed - 6, 6)
      const secondHalf = monthlyData.slice(6, 6 + secondHalfMonths).reduce((sum, m) => sum + m.revenue, 0)
      const normalizedSecondHalf = (secondHalf / secondHalfMonths) * 6
      growthTrend = firstHalf > 0 ? ((normalizedSecondHalf - firstHalf) / firstHalf) * 100 : 0
    }

    return successResponse({
      year,
      initialCapital: INITIAL_CAPITAL,

      // Year-to-date actuals
      ytd: {
        monthsElapsed,
        revenue: ytdRevenue,
        expense: ytdExpense,
        profit: ytdProfit,
        roi: parseFloat(currentROI.toFixed(2))
      },

      // Monthly averages
      averages: {
        revenue: Math.round(avgMonthlyRevenue),
        expense: Math.round(avgMonthlyExpense),
        profit: Math.round(avgMonthlyProfit)
      },

      // Full year projections
      projections: {
        annualRevenue: Math.round(projectedAnnualRevenue),
        annualExpense: Math.round(projectedAnnualExpense),
        annualProfit: Math.round(projectedAnnualProfit),
        annualizedROI: parseFloat(annualizedROI.toFixed(2))
      },

      // Investment metrics
      metrics: {
        paybackPeriodMonths,
        breakEvenMonths,
        growthTrend: parseFloat(growthTrend.toFixed(2))
      },

      // Monthly breakdown
      monthlyData
    })
  } catch (error: any) {
    console.error('API Error GET /api/forecast:', error)
    return errorResponse('Internal server error', 500)
  }
}
