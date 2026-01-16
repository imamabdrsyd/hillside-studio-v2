'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  monthly: Array<{
    month: number
    inflow: number
    outflow: number
    netFlow: number
  }>
}

export default function CashFlowPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<CashFlowData | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchCashFlow = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch(`/api/reports/cash-flow?year=${year}`)

        if (!res.ok) {
          throw new Error('Failed to fetch cash flow')
        }

        const result = await res.json()

        if (isMounted) {
          setData(result.data)
        }
      } catch (err: any) {
        console.error('Error fetching cash flow:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load cash flow')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCashFlow()

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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading cash flow...</p>
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
        <p className="text-amber-600 font-semibold">No cash flow data available</p>
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
            <h2 className="text-2xl font-bold text-slate-800">Cash Flow Statement (Arus Kas)</h2>
            <p className="text-sm text-slate-600 mt-1">Cash movements for the year {year}</p>
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

      {/* Cash Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm border border-blue-200">
          <p className="text-sm font-medium text-blue-600 mb-1">Opening Balance</p>
          <p className="text-3xl font-bold text-blue-700">{formatCurrency(data.openingBalance)}</p>
          <p className="text-xs text-blue-600 mt-2">Cash at start of year</p>
        </div>
        <div className={`rounded-2xl p-6 shadow-sm border ${data.netCashFlow >= 0 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
          <p className={`text-sm font-medium mb-1 ${data.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            Net Cash Flow
          </p>
          <p className={`text-3xl font-bold ${data.netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {formatCurrency(data.netCashFlow)}
          </p>
          <p className={`text-xs mt-2 ${data.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            Total change in cash
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm border border-purple-200">
          <p className="text-sm font-medium text-purple-600 mb-1">Closing Balance</p>
          <p className="text-3xl font-bold text-purple-700">{formatCurrency(data.closingBalance)}</p>
          <p className="text-xs text-purple-600 mt-2">Cash at end of year</p>
        </div>
      </div>

      {/* Cash Flow Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Operating Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b-2 border-cyan-200">
            Operating Activities
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Cash Inflow</span>
              <span className="text-sm font-semibold text-emerald-600">
                {formatCurrency(data.operating.inflow)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Cash Outflow</span>
              <span className="text-sm font-semibold text-red-600">
                ({formatCurrency(data.operating.outflow)})
              </span>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-800">Net Cash Flow</span>
                <span className={`text-base font-bold ${data.operating.netCashFlow >= 0 ? 'text-cyan-700' : 'text-red-700'}`}>
                  {formatCurrency(data.operating.netCashFlow)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Investing Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b-2 border-teal-200">
            Investing Activities
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Cash Outflow</span>
              <span className="text-sm font-semibold text-red-600">
                ({formatCurrency(data.investing.outflow)})
              </span>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-800">Net Cash Flow</span>
                <span className={`text-base font-bold ${data.investing.netCashFlow >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                  {formatCurrency(data.investing.netCashFlow)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financing Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b-2 border-sky-200">
            Financing Activities
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Net Financing</span>
              <span className={`text-sm font-semibold ${data.financing.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(data.financing.netCashFlow)}
              </span>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-800">Net Cash Flow</span>
                <span className={`text-base font-bold ${data.financing.netCashFlow >= 0 ? 'text-sky-700' : 'text-red-700'}`}>
                  {formatCurrency(data.financing.netCashFlow)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Cash Flow Statement */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Detailed Statement</h3>

        <div className="space-y-6">
          {/* Opening Balance */}
          <div>
            <div className="flex items-center justify-between py-3 border-b-2 border-slate-300">
              <span className="text-lg font-bold text-slate-800">Opening Cash Balance</span>
              <span className="text-lg font-bold text-blue-700">{formatCurrency(data.openingBalance)}</span>
            </div>
          </div>

          {/* Operating Activities Detail */}
          <div className="bg-cyan-50 rounded-lg p-4">
            <p className="text-base font-bold text-cyan-800 mb-3">Cash from Operating Activities</p>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Revenue received (EARN)</span>
                <span className="text-sm font-semibold text-emerald-600">
                  {formatCurrency(data.operating.inflow)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Operating expenses paid (OPEX, VAR, TAX)</span>
                <span className="text-sm font-semibold text-red-600">
                  ({formatCurrency(data.operating.outflow)})
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-cyan-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-cyan-800">Net Cash from Operating</span>
                  <span className={`text-base font-bold ${data.operating.netCashFlow >= 0 ? 'text-cyan-700' : 'text-red-700'}`}>
                    {formatCurrency(data.operating.netCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Investing Activities Detail */}
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="text-base font-bold text-teal-800 mb-3">Cash from Investing Activities</p>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Purchase of assets (CAPEX)</span>
                <span className="text-sm font-semibold text-red-600">
                  ({formatCurrency(data.investing.outflow)})
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-teal-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-teal-800">Net Cash from Investing</span>
                  <span className={`text-base font-bold ${data.investing.netCashFlow >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                    {formatCurrency(data.investing.netCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financing Activities Detail */}
          <div className="bg-sky-50 rounded-lg p-4">
            <p className="text-base font-bold text-sky-800 mb-3">Cash from Financing Activities</p>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Financing transactions (FIN)</span>
                <span className={`text-sm font-semibold ${data.financing.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(data.financing.netCashFlow)}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-sky-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-sky-800">Net Cash from Financing</span>
                  <span className={`text-base font-bold ${data.financing.netCashFlow >= 0 ? 'text-sky-700' : 'text-red-700'}`}>
                    {formatCurrency(data.financing.netCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Change in Cash */}
          <div className={`rounded-lg p-4 ${data.netCashFlow >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${data.netCashFlow >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                Net Increase/(Decrease) in Cash
              </span>
              <span className={`text-lg font-bold ${data.netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(data.netCashFlow)}
              </span>
            </div>
          </div>

          {/* Closing Balance */}
          <div>
            <div className="flex items-center justify-between py-3 border-t-2 border-slate-300">
              <span className="text-xl font-bold text-slate-800">Closing Cash Balance</span>
              <span className="text-xl font-bold text-purple-700">{formatCurrency(data.closingBalance)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Monthly Cash Flow</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Month</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Inflow</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Outflow</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Net Flow</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly.map((month) => (
                <tr key={month.month} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-700">
                    {monthNames[month.month - 1]}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-emerald-600">
                    {formatCurrency(month.inflow)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-red-600">
                    ({formatCurrency(month.outflow)})
                  </td>
                  <td className={`py-3 px-4 text-sm text-right font-semibold ${month.netFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(month.netFlow)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                <td className="py-3 px-4 text-sm text-slate-800">Total</td>
                <td className="py-3 px-4 text-sm text-right text-emerald-700">
                  {formatCurrency(data.monthly.reduce((sum, m) => sum + m.inflow, 0))}
                </td>
                <td className="py-3 px-4 text-sm text-right text-red-700">
                  ({formatCurrency(data.monthly.reduce((sum, m) => sum + m.outflow, 0))})
                </td>
                <td className={`py-3 px-4 text-sm text-right ${data.netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatCurrency(data.netCashFlow)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
