'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface IncomeStatementData {
  year: string
  revenue: number
  variableCosts: number
  grossProfit: number
  grossMargin: number
  operatingExpenses: number
  operatingProfit: number
  operatingMargin: number
  taxes: number
  netProfit: number
  netMargin: number
}

interface BalanceSheetData {
  year: string
  assets: {
    cash: number
    fixedAssets: number
    totalAssets: number
  }
  liabilities: {
    totalLiabilities: number
  }
  equity: {
    initialCapital: number
    retainedEarnings: number
    totalEquity: number
  }
  isBalanced: boolean
}

interface CashFlowData {
  year: string
  openingBalance: number
  operating: {
    inflow: number
    outflow: number
    netCashFlow: number
  }
  investing: {
    outflow: number
    netCashFlow: number
  }
  financing: {
    netCashFlow: number
  }
  netCashFlow: number
  closingBalance: number
}

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [incomeStatement, setIncomeStatement] = useState<IncomeStatementData | null>(null)
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null)
  const [cashFlow, setCashFlow] = useState<CashFlowData | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchReports = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch all three reports in parallel
        const [incomeRes, balanceRes, cashFlowRes] = await Promise.all([
          fetch(`/api/reports/income-statement?year=${year}`),
          fetch(`/api/reports/balance-sheet?year=${year}`),
          fetch(`/api/reports/cash-flow?year=${year}`)
        ])

        if (!incomeRes.ok || !balanceRes.ok || !cashFlowRes.ok) {
          throw new Error('Failed to fetch reports')
        }

        const [incomeData, balanceData, cashFlowData] = await Promise.all([
          incomeRes.json(),
          balanceRes.json(),
          cashFlowRes.json()
        ])

        if (isMounted) {
          setIncomeStatement(incomeData.data)
          setBalanceSheet(balanceData.data)
          setCashFlow(cashFlowData.data)
        }
      } catch (err: any) {
        console.error('Error fetching reports:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load reports')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchReports()

    return () => {
      isMounted = false
    }
  }, [year])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="year" className="text-sm font-medium text-slate-600">
              Year:
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Income Statement Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Income Statement (Laba Rugi)</h3>
          <Link
            href="/income"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View Details →
          </Link>
        </div>

        {incomeStatement && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-600">Revenue</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {formatCurrency(incomeStatement.revenue)}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm font-medium text-amber-600">Operating Profit</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {formatCurrency(incomeStatement.operatingProfit)}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Margin: {incomeStatement.operatingMargin.toFixed(2)}%
              </p>
            </div>
            <div className={`rounded-lg p-4 ${incomeStatement.netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <p className={`text-sm font-medium ${incomeStatement.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                Net Profit
              </p>
              <p className={`text-2xl font-bold mt-1 ${incomeStatement.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(incomeStatement.netProfit)}
              </p>
              <p className={`text-xs mt-1 ${incomeStatement.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                Margin: {incomeStatement.netMargin.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Balance Sheet Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Balance Sheet (Neraca)</h3>
          <Link
            href="/balance"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View Details →
          </Link>
        </div>

        {balanceSheet && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-600">Total Assets</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {formatCurrency(balanceSheet.assets.totalAssets)}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Cash: {formatCurrency(balanceSheet.assets.cash)}
              </p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-sm font-medium text-pink-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-pink-700 mt-1">
                {formatCurrency(balanceSheet.liabilities.totalLiabilities)}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm font-medium text-indigo-600">Total Equity</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">
                {formatCurrency(balanceSheet.equity.totalEquity)}
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                {balanceSheet.isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cash Flow Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Cash Flow Statement (Arus Kas)</h3>
          <Link
            href="/cashflow"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View Details →
          </Link>
        </div>

        {cashFlow && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-cyan-50 rounded-lg p-4">
              <p className="text-sm font-medium text-cyan-600">Operating</p>
              <p className={`text-2xl font-bold mt-1 ${cashFlow.operating.netCashFlow >= 0 ? 'text-cyan-700' : 'text-red-700'}`}>
                {formatCurrency(cashFlow.operating.netCashFlow)}
              </p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm font-medium text-teal-600">Investing</p>
              <p className={`text-2xl font-bold mt-1 ${cashFlow.investing.netCashFlow >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                {formatCurrency(cashFlow.investing.netCashFlow)}
              </p>
            </div>
            <div className="bg-sky-50 rounded-lg p-4">
              <p className="text-sm font-medium text-sky-600">Financing</p>
              <p className={`text-2xl font-bold mt-1 ${cashFlow.financing.netCashFlow >= 0 ? 'text-sky-700' : 'text-red-700'}`}>
                {formatCurrency(cashFlow.financing.netCashFlow)}
              </p>
            </div>
            <div className={`rounded-lg p-4 ${cashFlow.netCashFlow >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <p className={`text-sm font-medium ${cashFlow.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                Net Cash Flow
              </p>
              <p className={`text-2xl font-bold mt-1 ${cashFlow.netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(cashFlow.netCashFlow)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
