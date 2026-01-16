import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/api/helpers'
import { INITIAL_CAPITAL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { error, supabase } = await checkAuth()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Fetch all transactions for the year
    const { data: transactions, error: dbError } = await (supabase
      .from('transactions') as any)
      .select('*')
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)

    if (dbError) throw dbError

    // Calculate summary
    const summary = {
      earn: 0,
      opex: 0,
      var: 0,
      capex: 0,
      tax: 0,
      fin: 0,
      total_income: 0,
      total_expense: 0,
      gross_profit: 0,
      net_profit: 0,
      gross_margin: '0.00',
      net_margin: '0.00',
      cash_balance: 0,
      monthly: Array(12).fill(null).map(() => ({ income: 0, expense: 0 }))
    }

    transactions?.forEach((t: any) => {
      const month = new Date(t.date).getMonth()

      // Categorize
      if (t.category === 'EARN') summary.earn += t.income
      else if (t.category === 'OPEX') summary.opex += t.expense
      else if (t.category === 'VAR') summary.var += t.expense
      else if (t.category === 'CAPEX') summary.capex += t.expense
      else if (t.category === 'TAX') summary.tax += t.expense
      else if (t.category === 'FIN') summary.fin += t.expense

      // Total
      summary.total_income += t.income
      summary.total_expense += t.expense

      // Monthly
      summary.monthly[month].income += t.income
      summary.monthly[month].expense += t.expense
    })

    // Calculate metrics
    summary.gross_profit = summary.earn - summary.var
    summary.net_profit = summary.earn - summary.opex - summary.var - summary.tax
    summary.cash_balance = summary.total_income - summary.total_expense

    if (summary.earn > 0) {
      summary.gross_margin = ((summary.gross_profit / summary.earn) * 100).toFixed(2)
      summary.net_margin = ((summary.net_profit / summary.earn) * 100).toFixed(2)
    }

    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('API Error /api/transactions/summary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
