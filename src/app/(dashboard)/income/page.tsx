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

export default function IncomeStatementPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<IncomeStatementData | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchIncomeStatement = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch(`/api/reports/income-statement?year=${year}`)

        if (!res.ok) {
          throw new Error('Failed to fetch income statement')
        }

        const result = await res.json()

        if (isMounted) {
          setData(result.data)
        }
      } catch (err: any) {
        console.error('Error fetching income statement:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load income statement')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchIncomeStatement()

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
          <p className="text-slate-600 font-semibold">Loading income statement...</p>
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

  if (!data) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-amber-600 font-semibold">No income statement data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/reports"
              className="text-sm text-emerald-600 hover:text-emerald-700 mb-2 inline-block"
            >
              ← Back to Reports
            </Link>
            <h2 className="text-2xl font-bold text-slate-800">Income Statement (Laba Rugi)</h2>
            <p className="text-sm text-slate-600 mt-1">Comprehensive profit and loss statement for {year}</p>
          </div>
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

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm border border-blue-200">
          <p className="text-sm font-medium text-blue-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-700">{formatCurrency(data.revenue)}</p>
          <p className="text-xs text-blue-600 mt-2">Sales & Income</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 shadow-sm border border-amber-200">
          <p className="text-sm font-medium text-amber-600 mb-1">Operating Profit</p>
          <p className="text-3xl font-bold text-amber-700">{formatCurrency(data.operatingProfit)}</p>
          <p className="text-xs text-amber-600 mt-2">
            Margin: {data.operatingMargin.toFixed(2)}%
          </p>
        </div>
        <div className={`rounded-2xl p-6 shadow-sm border ${data.netProfit >= 0 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
          <p className={`text-sm font-medium mb-1 ${data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            Net Profit
          </p>
          <p className={`text-3xl font-bold ${data.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {formatCurrency(data.netProfit)}
          </p>
          <p className={`text-xs mt-2 ${data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            Margin: {data.netMargin.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Detailed Income Statement */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Detailed Statement</h3>

        <div className="space-y-6">
          {/* Revenue Section */}
          <div>
            <div className="flex items-center justify-between py-3 border-b-2 border-slate-300">
              <span className="text-lg font-bold text-slate-800">Revenue (Pendapatan)</span>
              <span className="text-lg font-bold text-blue-700">{formatCurrency(data.revenue)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-4">Total income from sales and services (EARN)</p>
          </div>

          {/* Variable Costs */}
          <div>
            <div className="flex items-center justify-between py-2">
              <span className="text-base text-slate-700 ml-4">Less: Variable Costs (Biaya Variabel)</span>
              <span className="text-base text-red-600">({formatCurrency(data.variableCosts)})</span>
            </div>
            <p className="text-xs text-slate-500 ml-8">Direct costs that vary with production (VAR)</p>
          </div>

          {/* Gross Profit */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold text-blue-800">Gross Profit (Laba Kotor)</span>
                <p className="text-xs text-blue-600 mt-1">Revenue - Variable Costs</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-700">{formatCurrency(data.grossProfit)}</span>
                <p className="text-xs text-blue-600 mt-1">Margin: {data.grossMargin.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          <div>
            <div className="flex items-center justify-between py-2">
              <span className="text-base text-slate-700 ml-4">Less: Operating Expenses (Biaya Operasional)</span>
              <span className="text-base text-red-600">({formatCurrency(data.operatingExpenses)})</span>
            </div>
            <p className="text-xs text-slate-500 ml-8">Fixed costs of running the business (OPEX)</p>
          </div>

          {/* Operating Profit */}
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold text-amber-800">Operating Profit (Laba Operasional)</span>
                <p className="text-xs text-amber-600 mt-1">Gross Profit - Operating Expenses</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-amber-700">{formatCurrency(data.operatingProfit)}</span>
                <p className="text-xs text-amber-600 mt-1">Margin: {data.operatingMargin.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Taxes */}
          <div>
            <div className="flex items-center justify-between py-2">
              <span className="text-base text-slate-700 ml-4">Less: Taxes (Pajak)</span>
              <span className="text-base text-red-600">({formatCurrency(data.taxes)})</span>
            </div>
            <p className="text-xs text-slate-500 ml-8">Tax obligations (TAX)</p>
          </div>

          {/* Net Profit */}
          <div className={`rounded-lg p-4 ${data.netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xl font-bold ${data.netProfit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                  Net Profit (Laba Bersih)
                </span>
                <p className={`text-xs mt-1 ${data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Operating Profit - Taxes
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xl font-bold ${data.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatCurrency(data.netProfit)}
                </span>
                <p className={`text-xs mt-1 ${data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Margin: {data.netMargin.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Margin Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Margin Analysis</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Gross Margin</span>
              <span className="text-sm font-bold text-blue-700">{data.grossMargin.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(data.grossMargin, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Percentage of revenue remaining after variable costs</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Operating Margin</span>
              <span className="text-sm font-bold text-amber-700">{data.operatingMargin.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(data.operatingMargin, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Percentage of revenue remaining after all operating expenses</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Net Margin</span>
              <span className={`text-sm font-bold ${data.netMargin >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {data.netMargin.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${data.netMargin >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.max(data.netMargin, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Final profitability after all expenses and taxes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
