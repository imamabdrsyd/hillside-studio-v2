import { Transaction, DashboardStats } from '@/types'
import { INITIAL_CAPITAL } from './constants'

// Format currency to Indonesian Rupiah
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date to Indonesian format
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date for input field
export function formatDateInput(date: string): string {
  return new Date(date).toISOString().split('T')[0]
}

// Calculate dashboard statistics
export function calculateDashboardStats(transactions: Transaction[]): DashboardStats {
  const revenue = transactions
    .filter(t => t.category === 'EARN')
    .reduce((sum, t) => sum + t.income, 0)

  const opex = transactions
    .filter(t => t.category === 'OPEX')
    .reduce((sum, t) => sum + t.expense, 0)

  const variableCost = transactions
    .filter(t => t.category === 'VAR')
    .reduce((sum, t) => sum + t.expense, 0)

  const taxes = transactions
    .filter(t => t.category === 'TAX')
    .reduce((sum, t) => sum + t.expense, 0)

  const capex = transactions
    .filter(t => t.category === 'CAPEX')
    .reduce((sum, t) => sum + t.expense, 0)

  const netProfit = revenue - opex - variableCost - taxes

  const grossMargin = revenue > 0 ? ((revenue - variableCost) / revenue) * 100 : 0

  const totalIncome = transactions.reduce((sum, t) => sum + t.income, 0)
  const totalExpense = transactions.reduce((sum, t) => sum + t.expense, 0)
  const cashBalance = totalIncome - totalExpense

  const investedCapital = INITIAL_CAPITAL + capex
  const roiYTD = investedCapital > 0 ? (netProfit / investedCapital) * 100 : 0

  const monthlyNetProfit = netProfit / 12
  const paybackPeriod = monthlyNetProfit > 0 ? investedCapital / monthlyNetProfit : 0

  return {
    revenue,
    opex,
    variableCost,
    taxes,
    netProfit,
    grossMargin,
    cashBalance,
    roiYTD,
    paybackPeriod,
  }
}

// Get monthly data for charts
export function getMonthlyData(transactions: Transaction[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const monthlyRevenue = new Array(12).fill(0)
  const monthlyExpenses = new Array(12).fill(0)

  transactions.forEach(t => {
    const month = new Date(t.date).getMonth()
    monthlyRevenue[month] += t.income
    monthlyExpenses[month] += t.expense
  })

  return { months, monthlyRevenue, monthlyExpenses }
}

// Get expense breakdown by category
export function getExpenseBreakdown(transactions: Transaction[]) {
  const categories = ['OPEX', 'VAR', 'TAX', 'CAPEX']
  const data = categories.map(cat =>
    transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + t.expense, 0)
  )

  return {
    labels: ['OPEX', 'Variable', 'Pajak', 'CAPEX'],
    data,
  }
}

// Filter transactions by month
export function filterByMonth(transactions: Transaction[], month: number): Transaction[] {
  if (month === 0) return transactions
  return transactions.filter(t => new Date(t.date).getMonth() + 1 === month)
}

// Sort transactions by date (newest first)
export function sortByDate(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Show toast notification
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  // This will be implemented in a React component
  console.log(`[${type.toUpperCase()}] ${message}`)
}
