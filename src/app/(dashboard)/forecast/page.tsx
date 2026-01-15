'use client'

import { useState, useEffect } from 'react'

interface ForecastData {
  year: string
  initialCapital: number
  ytd: {
    monthsElapsed: number
    revenue: number
    expense: number
    profit: number
    roi: number
  }
  averages: {
    revenue: number
    expense: number
    profit: number
  }
  projections: {
    annualRevenue: number
    annualExpense: number
    annualProfit: number
    annualizedROI: number
  }
  metrics: {
    paybackPeriodMonths: number | null
    breakEvenMonths: number | null
    growthTrend: number
  }
  monthlyData: Array<{
    revenue: number
    expense: number
    profit: number
  }>
}

export default function ForecastPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [forecast, setForecast] = useState<ForecastData | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchForecast = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch(`/api/forecast?year=${year}`)

        if (!res.ok) {
          throw new Error('Failed to fetch forecast data')
        }

        const data = await res.json()

        if (isMounted) {
          setForecast(data.data)
        }
      } catch (err: any) {
        console.error('Error fetching forecast:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load forecast')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchForecast()

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
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading forecast...</p>
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

  if (!forecast) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-amber-600 font-semibold">No forecast data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">ROI & Forecast Analysis</h2>
            <p className="text-sm text-slate-600 mt-1">
              Investment tracking and projections for {year}
            </p>
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

      {/* Initial Capital */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Initial Capital Investment</h3>
        <p className="text-3xl font-bold text-purple-700">{formatCurrency(forecast.initialCapital)}</p>
      </div>

      {/* Year-to-Date Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Year-to-Date Performance ({forecast.ytd.monthsElapsed} months)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Revenue YTD</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {formatCurrency(forecast.ytd.revenue)}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-red-600">Expense YTD</p>
            <p className="text-2xl font-bold text-red-700 mt-1">
              {formatCurrency(forecast.ytd.expense)}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${forecast.ytd.profit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${forecast.ytd.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              Profit YTD
            </p>
            <p className={`text-2xl font-bold mt-1 ${forecast.ytd.profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(forecast.ytd.profit)}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${forecast.ytd.roi >= 0 ? 'bg-purple-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${forecast.ytd.roi >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
              ROI YTD
            </p>
            <p className={`text-2xl font-bold mt-1 ${forecast.ytd.roi >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
              {forecast.ytd.roi.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Averages */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Monthly Averages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cyan-50 rounded-lg p-4">
            <p className="text-sm font-medium text-cyan-600">Avg Revenue/Month</p>
            <p className="text-2xl font-bold text-cyan-700 mt-1">
              {formatCurrency(forecast.averages.revenue)}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-600">Avg Expense/Month</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              {formatCurrency(forecast.averages.expense)}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${forecast.averages.profit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${forecast.averages.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              Avg Profit/Month
            </p>
            <p className={`text-2xl font-bold mt-1 ${forecast.averages.profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(forecast.averages.profit)}
            </p>
          </div>
        </div>
      </div>

      {/* Full Year Projections */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Full Year Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm font-medium text-indigo-600">Projected Revenue</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">
              {formatCurrency(forecast.projections.annualRevenue)}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-600">Projected Expense</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">
              {formatCurrency(forecast.projections.annualExpense)}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${forecast.projections.annualProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${forecast.projections.annualProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              Projected Profit
            </p>
            <p className={`text-2xl font-bold mt-1 ${forecast.projections.annualProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(forecast.projections.annualProfit)}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${forecast.projections.annualizedROI >= 0 ? 'bg-violet-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${forecast.projections.annualizedROI >= 0 ? 'text-violet-600' : 'text-red-600'}`}>
              Annualized ROI
            </p>
            <p className={`text-2xl font-bold mt-1 ${forecast.projections.annualizedROI >= 0 ? 'text-violet-700' : 'text-red-700'}`}>
              {forecast.projections.annualizedROI.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Investment Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Investment Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="text-sm font-medium text-teal-600">Payback Period</p>
            <p className="text-2xl font-bold text-teal-700 mt-1">
              {forecast.metrics.paybackPeriodMonths !== null
                ? `${forecast.metrics.paybackPeriodMonths} months`
                : 'N/A'}
            </p>
            <p className="text-xs text-teal-600 mt-1">Time to recover initial investment</p>
          </div>
          <div className="bg-sky-50 rounded-lg p-4">
            <p className="text-sm font-medium text-sky-600">Break-Even Period</p>
            <p className="text-2xl font-bold text-sky-700 mt-1">
              {forecast.metrics.breakEvenMonths !== null
                ? `${forecast.metrics.breakEvenMonths} months`
                : 'N/A'}
            </p>
            <p className="text-xs text-sky-600 mt-1">Time to reach profitability</p>
          </div>
          <div className={`rounded-lg p-4 ${forecast.metrics.growthTrend >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${forecast.metrics.growthTrend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              Growth Trend
            </p>
            <p className={`text-2xl font-bold mt-1 ${forecast.metrics.growthTrend >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {forecast.metrics.growthTrend >= 0 ? '+' : ''}{forecast.metrics.growthTrend.toFixed(2)}%
            </p>
            <p className={`text-xs mt-1 ${forecast.metrics.growthTrend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              Revenue growth rate
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Monthly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Month</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Expense</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Profit</th>
              </tr>
            </thead>
            <tbody>
              {forecast.monthlyData.map((month, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-700">
                    {monthNames[index]}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-blue-600">
                    {formatCurrency(month.revenue)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-red-600">
                    {formatCurrency(month.expense)}
                  </td>
                  <td className={`py-3 px-4 text-sm text-right font-semibold ${month.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(month.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
