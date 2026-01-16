import { NextRequest } from 'next/server'
import { checkAuth, errorResponse, successResponse } from '@/lib/api/helpers'
import { MONTHS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// GET /api/reports/monthly/[month] - Get monthly report
export async function GET(
  request: NextRequest,
  { params }: { params: { month: string } }
) {
  try {
    const authResult = await checkAuth()
    if (authResult.error) return authResult.error
    if (!authResult.supabase) return errorResponse('Unauthorized', 401)

    const { supabase } = authResult
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()
    const month = parseInt(params.month)

    if (isNaN(month) || month < 1 || month > 12) {
      return errorResponse('Invalid month. Must be 1-12', 400)
    }

    const paddedMonth = month.toString().padStart(2, '0')
    const lastDay = new Date(parseInt(year), month, 0).getDate()

    const { data: transactions, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .gte('date', `${year}-${paddedMonth}-01`)
      .lte('date', `${year}-${paddedMonth}-${lastDay}`)
      .order('date', { ascending: true })

    if (dbError) {
      console.error('Database error:', dbError)
      return errorResponse('Failed to fetch transactions', 500)
    }

    // Calculate summary by category
    const summary = {
      earn: 0,
      opex: 0,
      var: 0,
      capex: 0,
      tax: 0,
      fin: 0,
      totalIncome: 0,
      totalExpense: 0
    }

    transactions?.forEach((t: any) => {
      summary.totalIncome += t.income || 0
      summary.totalExpense += t.expense || 0

      if (t.category === 'EARN') summary.earn += t.income
      else if (t.category === 'OPEX') summary.opex += t.expense
      else if (t.category === 'VAR') summary.var += t.expense
      else if (t.category === 'CAPEX') summary.capex += t.expense
      else if (t.category === 'TAX') summary.tax += t.expense
      else if (t.category === 'FIN') summary.fin += t.expense
    })

    const netProfit = summary.earn - summary.opex - summary.var - summary.tax
    const cashFlow = summary.totalIncome - summary.totalExpense

    // Daily breakdown
    const daily: Record<string, { income: number; expense: number }> = {}
    transactions?.forEach((t: any) => {
      const day = t.date
      if (!daily[day]) {
        daily[day] = { income: 0, expense: 0 }
      }
      daily[day].income += t.income || 0
      daily[day].expense += t.expense || 0
    })

    return successResponse({
      year,
      month,
      monthName: MONTHS[month - 1],
      summary: {
        ...summary,
        netProfit,
        cashFlow
      },
      transactionCount: transactions?.length || 0,
      transactions,
      dailyBreakdown: daily
    })
  } catch (error: any) {
    console.error('API Error GET /api/reports/monthly/[month]:', error)
    return errorResponse('Internal server error', 500)
  }
}
