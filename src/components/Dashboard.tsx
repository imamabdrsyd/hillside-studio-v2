'use client'

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Transaction, DashboardStats } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { MONTH_SHORT } from '@/lib/constants'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement)

interface DashboardProps {
  stats: DashboardStats
  transactions: Transaction[]
}

export default function Dashboard({ stats, transactions }: DashboardProps) {
  // Monthly revenue vs expenses
  const monthlyData = {
    labels: MONTH_SHORT,
    datasets: [
      {
        label: 'Pendapatan',
        data: getMonthlyRevenue(),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Beban',
        data: getMonthlyExpenses(),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  }

  // Expense breakdown
  const expenseData = {
    labels: ['OPEX', 'Variable', 'Pajak', 'CAPEX'],
    datasets: [
      {
        data: [
          stats.opex,
          stats.variableCost,
          stats.taxes,
          transactions.filter(t => t.category === 'CAPEX').reduce((sum, t) => sum + t.expense, 0),
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
      },
    ],
  }

  function getMonthlyRevenue() {
    const data = new Array(12).fill(0)
    transactions.forEach(t => {
      if (t.category === 'EARN') {
        const month = new Date(t.date).getMonth()
        data[month] += t.income
      }
    })
    return data
  }

  function getMonthlyExpenses() {
    const data = new Array(12).fill(0)
    transactions.forEach(t => {
      const month = new Date(t.date).getMonth()
      data[month] += t.expense
    })
    return data
  }

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Revenue"
          value={stats.revenue}
          label="EARN"
          icon="💰"
          bgColor="bg-green-100"
          textColor="text-green-700"
        />
        <StatCard
          title="Operational"
          value={stats.opex}
          label="OPEX"
          icon="🏢"
          bgColor="bg-red-100"
          textColor="text-red-700"
        />
        <StatCard
          title="Variable Cost"
          value={stats.variableCost}
          label="VAR"
          icon="📦"
          bgColor="bg-purple-100"
          textColor="text-purple-700"
        />
        <StatCard
          title="Taxes"
          value={stats.taxes}
          label="TAX"
          icon="🏛️"
          bgColor="bg-blue-100"
          textColor="text-blue-700"
        />
        <StatCard
          title="Net Profit"
          value={stats.netProfit}
          label="Profit"
          icon="💎"
          bgColor="bg-emerald-100"
          textColor="text-emerald-700"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue vs Expenses</h3>
          <Bar
            data={monthlyData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
              },
            }}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Expense Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={expenseData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Gross Margin"
          value={`${stats.grossMargin.toFixed(1)}%`}
          subtitle="Revenue - Variable Cost"
        />
        <KPICard
          title="Cash Balance"
          value={formatCurrency(stats.cashBalance)}
          subtitle="Total In - Total Out"
        />
        <KPICard
          title="ROI (YTD)"
          value={`${stats.roiYTD.toFixed(1)}%`}
          subtitle="Return on Investment"
        />
        <KPICard
          title="Payback Period"
          value={`${stats.paybackPeriod.toFixed(1)} bulan`}
          subtitle="Capital Recovery Time"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Category</th>
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-right py-3 font-medium">Income</th>
                <th className="text-right py-3 font-medium">Expense</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryClass(t.category)}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3">{t.description}</td>
                  <td className="py-3 text-right text-green-600 font-semibold">
                    {t.income > 0 ? formatCurrency(t.income) : '-'}
                  </td>
                  <td className="py-3 text-right text-red-600 font-semibold">
                    {t.expense > 0 ? formatCurrency(t.expense) : '-'}
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

function StatCard({ title, value, label, icon, bgColor, textColor }: any) {
  return (
    <div className="stat-card bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase">{title}</span>
        <span className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>{icon}</span>
      </div>
      <p className="text-xl font-bold text-slate-800">{formatCurrency(value)}</p>
      <p className={`text-xs ${textColor} font-medium mt-1`}>{label}</p>
    </div>
  )
}

function KPICard({ title, value, subtitle }: any) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
      <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  )
}

function getCategoryClass(category: string) {
  const classes: Record<string, string> = {
    EARN: 'bg-green-100 text-green-700',
    OPEX: 'bg-red-100 text-red-700',
    VAR: 'bg-purple-100 text-purple-700',
    CAPEX: 'bg-gray-100 text-gray-700',
    TAX: 'bg-blue-100 text-blue-700',
    FIN: 'bg-indigo-100 text-indigo-700',
  }
  return classes[category] || 'bg-gray-100 text-gray-700'
}
