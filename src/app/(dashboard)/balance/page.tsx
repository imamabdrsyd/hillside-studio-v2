'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function BalanceSheetPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<BalanceSheetData | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchBalanceSheet = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch(`/api/reports/balance-sheet?year=${year}`)

        if (!res.ok) {
          throw new Error('Failed to fetch balance sheet')
        }

        const result = await res.json()

        if (isMounted) {
          setData(result.data)
        }
      } catch (err: any) {
        console.error('Error fetching balance sheet:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load balance sheet')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchBalanceSheet()

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
          <p className="text-slate-600 font-semibold">Loading balance sheet...</p>
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
        <p className="text-amber-600 font-semibold">No balance sheet data available</p>
      </div>
    )
  }

  const totalLiabilitiesAndEquity = data.liabilities.totalLiabilities + data.equity.totalEquity

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
            <h2 className="text-2xl font-bold text-slate-800">Balance Sheet (Neraca)</h2>
            <p className="text-sm text-slate-600 mt-1">Financial position as of December 31, {year}</p>
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

      {/* Balance Check */}
      {data.isBalanced ? (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-emerald-800">
              Balance Sheet is balanced: Assets = Liabilities + Equity
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-amber-800">
              Warning: Balance Sheet is not balanced. Please review your transactions.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm border border-purple-200">
          <p className="text-sm font-medium text-purple-600 mb-1">Total Assets</p>
          <p className="text-3xl font-bold text-purple-700">{formatCurrency(data.assets.totalAssets)}</p>
          <p className="text-xs text-purple-600 mt-2">All company resources</p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 shadow-sm border border-pink-200">
          <p className="text-sm font-medium text-pink-600 mb-1">Total Liabilities</p>
          <p className="text-3xl font-bold text-pink-700">{formatCurrency(data.liabilities.totalLiabilities)}</p>
          <p className="text-xs text-pink-600 mt-2">All company obligations</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 shadow-sm border border-indigo-200">
          <p className="text-sm font-medium text-indigo-600 mb-1">Total Equity</p>
          <p className="text-3xl font-bold text-indigo-700">{formatCurrency(data.equity.totalEquity)}</p>
          <p className="text-xs text-indigo-600 mt-2">Owner's stake in company</p>
        </div>
      </div>

      {/* Detailed Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-purple-200">
            Assets (Aset)
          </h3>

          <div className="space-y-4">
            {/* Current Assets */}
            <div>
              <p className="text-sm font-semibold text-purple-700 mb-3">Current Assets</p>
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-700">Cash & Cash Equivalents</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(data.assets.cash)}
                  </span>
                </div>
              </div>
            </div>

            {/* Fixed Assets */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-purple-700 mb-3">Fixed Assets</p>
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-700">Property, Plant & Equipment</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(data.assets.fixedAssets)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Assets */}
            <div className="mt-6 pt-4 border-t-2 border-purple-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-purple-800">Total Assets</span>
                <span className="text-lg font-bold text-purple-700">
                  {formatCurrency(data.assets.totalAssets)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-pink-200">
            Liabilities & Equity
          </h3>

          <div className="space-y-6">
            {/* Liabilities */}
            <div>
              <p className="text-sm font-semibold text-pink-700 mb-3">Liabilities (Kewajiban)</p>
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-700">Current Liabilities</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(data.liabilities.totalLiabilities)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-pink-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-pink-800">Total Liabilities</span>
                  <span className="text-base font-bold text-pink-700">
                    {formatCurrency(data.liabilities.totalLiabilities)}
                  </span>
                </div>
              </div>
            </div>

            {/* Equity */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-indigo-700 mb-3">Equity (Ekuitas)</p>
              <div className="ml-4 space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-700">Initial Capital</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(data.equity.initialCapital)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-700">Retained Earnings</span>
                  <span className={`text-sm font-semibold ${data.equity.retainedEarnings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(data.equity.retainedEarnings)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-indigo-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-indigo-800">Total Equity</span>
                  <span className="text-base font-bold text-indigo-700">
                    {formatCurrency(data.equity.totalEquity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Liabilities + Equity */}
            <div className="mt-6 pt-4 border-t-2 border-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">Total Liabilities + Equity</span>
                <span className="text-lg font-bold text-slate-700">
                  {formatCurrency(totalLiabilitiesAndEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Sheet Equation */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Balance Sheet Equation</h3>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Assets</p>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(data.assets.totalAssets)}</p>
          </div>
          <div className="text-2xl font-bold text-slate-400">=</div>
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Liabilities</p>
            <p className="text-xl font-bold text-pink-700">{formatCurrency(data.liabilities.totalLiabilities)}</p>
          </div>
          <div className="text-2xl font-bold text-slate-400">+</div>
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Equity</p>
            <p className="text-xl font-bold text-indigo-700">{formatCurrency(data.equity.totalEquity)}</p>
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Financial Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600 mb-2">Debt-to-Equity Ratio</p>
            <p className="text-2xl font-bold text-blue-700">
              {data.equity.totalEquity > 0
                ? (data.liabilities.totalLiabilities / data.equity.totalEquity).toFixed(2)
                : '0.00'}
            </p>
            <p className="text-xs text-blue-600 mt-1">Liabilities / Equity</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-sm font-medium text-emerald-600 mb-2">Equity Ratio</p>
            <p className="text-2xl font-bold text-emerald-700">
              {data.assets.totalAssets > 0
                ? ((data.equity.totalEquity / data.assets.totalAssets) * 100).toFixed(2)
                : '0.00'}%
            </p>
            <p className="text-xs text-emerald-600 mt-1">Equity / Total Assets</p>
          </div>
        </div>
      </div>
    </div>
  )
}
