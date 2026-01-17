'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface IncomeStatementData {
  period: {
    month: string | null
    year: number
    display: string
  }
  service_revenue: number
  variable_cost: number
  gross_profit: number
  gross_profit_margin: number
  operating_expenses: number
  net_profit: number
  net_profit_margin: number
}

export default function IncomeStatementPage() {
  const currentDate = new Date()
  const [year, setYear] = useState(currentDate.getFullYear().toString())
  const [month, setMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, '0'))
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<IncomeStatementData | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchIncomeStatement = async () => {
      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({
          year,
          period
        })

        if (period === 'monthly') {
          params.append('month', month)
        }

        const res = await fetch(`/api/reports/income-statement?${params.toString()}`)

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
  }, [year, month, period])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

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
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-600 font-semibold">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-amber-600 font-semibold">No income statement data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/reports"
        className="text-sm text-emerald-600 hover:text-emerald-700 inline-block"
      >
        ← Back to Reports
      </Link>

      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Month Selector (only for monthly period) */}
        {period === 'monthly' && (
          <div className="flex-1">
            <label htmlFor="month" className="block text-sm font-medium text-slate-700 mb-1">
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year Selector */}
        <div className="flex-1">
          <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-1">
            Year
          </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Period Toggle */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Period
          </label>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            <button
              onClick={() => setPeriod('monthly')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                period === 'monthly'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                period === 'yearly'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Income Statement Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-700 text-white px-6 py-4 text-center">
          <h2 className="text-lg font-bold">INCOME STATEMENT</h2>
          <p className="text-slate-300 text-sm mt-1">{data.period.display}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Service Revenue */}
          <div className="flex justify-between items-center">
            <span className="text-slate-700">
              Service Revenue <span className="text-emerald-600 font-medium text-sm">EARN</span>
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(data.service_revenue)}</span>
          </div>

          {/* Variable Cost */}
          <div className="flex justify-between items-center text-slate-600">
            <span>(-) VAR</span>
            <span>{formatCurrency(data.variable_cost)}</span>
          </div>

          {/* Divider */}
          <hr className="border-slate-300" />

          {/* Gross Profit */}
          <div className="flex justify-between items-center font-semibold">
            <span className="text-slate-900">Gross Profit</span>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${data.gross_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {data.gross_profit_margin}%
              </span>
              <span className={data.gross_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                {formatCurrency(data.gross_profit)}
              </span>
            </div>
          </div>

          {/* Operating Expenses */}
          <div className="flex justify-between items-center text-slate-600">
            <span>(-) OPEX</span>
            <span>{formatCurrency(data.operating_expenses)}</span>
          </div>

          {/* Divider */}
          <hr className="border-slate-300" />

          {/* Net Profit */}
          <div className="flex justify-between items-center font-bold text-lg">
            <span className="text-slate-900">Net Profit</span>
            <div className="flex items-center gap-4">
              <span className={`${data.net_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {data.net_profit_margin}%
              </span>
              <span className={data.net_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                {formatCurrency(data.net_profit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
          <p className="text-xs font-medium text-blue-600 mb-1">Service Revenue</p>
          <p className="text-xl font-bold text-blue-700">{formatCurrency(data.service_revenue)}</p>
        </div>
        <div className={`rounded-2xl p-4 ${
          data.gross_profit >= 0
            ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
            : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
        } border`}>
          <p className={`text-xs font-medium mb-1 ${
            data.gross_profit >= 0 ? 'text-purple-600' : 'text-orange-600'
          }`}>
            Gross Profit ({data.gross_profit_margin}%)
          </p>
          <p className={`text-xl font-bold ${
            data.gross_profit >= 0 ? 'text-purple-700' : 'text-orange-700'
          }`}>
            {formatCurrency(data.gross_profit)}
          </p>
        </div>
        <div className={`rounded-2xl p-4 ${
          data.net_profit >= 0
            ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
        } border`}>
          <p className={`text-xs font-medium mb-1 ${
            data.net_profit >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            Net Profit ({data.net_profit_margin}%)
          </p>
          <p className={`text-xl font-bold ${
            data.net_profit >= 0 ? 'text-emerald-700' : 'text-red-700'
          }`}>
            {formatCurrency(data.net_profit)}
          </p>
        </div>
      </div>

      {/* Margin Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Margin Analysis</h3>
        <div className="space-y-4">
          {/* Gross Margin */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Gross Profit Margin</span>
              <span className={`text-sm font-bold ${
                data.gross_profit_margin >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {data.gross_profit_margin}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  data.gross_profit_margin >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.max(data.gross_profit_margin, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              (Gross Profit / Service Revenue) × 100
            </p>
          </div>

          {/* Net Margin */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Net Profit Margin</span>
              <span className={`text-sm font-bold ${
                data.net_profit_margin >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {data.net_profit_margin}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  data.net_profit_margin >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.max(data.net_profit_margin, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              (Net Profit / Service Revenue) × 100
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
