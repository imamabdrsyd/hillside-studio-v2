'use client'

import { useState } from 'react'
import { Transaction, TransactionCategory, AccountType } from '@/types'
import { formatCurrency, formatDateInput } from '@/lib/utils'
import { CATEGORIES, ACCOUNTS } from '@/lib/constants'

interface TransactionsProps {
  transactions: Transaction[]
  onAdd: (transaction: Omit<Transaction, 'id'>) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export default function Transactions({ transactions, onAdd, onEdit, onDelete }: TransactionsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | 'ALL'>('ALL')
  const [formData, setFormData] = useState({
    date: '',
    category: 'EARN' as TransactionCategory,
    description: '',
    amount: '',
    account: 'BCA' as AccountType,
    notes: '',
  })

  const filteredTransactions = filterCategory === 'ALL'
    ? transactions
    : transactions.filter(t => t.category === filterCategory)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(formData.amount)
    const transaction = {
      date: formData.date,
      category: formData.category,
      description: formData.description,
      income: formData.category === 'EARN' ? amount : 0,
      expense: formData.category !== 'EARN' ? amount : 0,
      account: formData.account,
      notes: formData.notes,
    }

    if (editingId) {
      onEdit({ ...transaction, id: editingId })
    } else {
      onAdd(transaction)
    }

    resetForm()
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setFormData({
      date: formatDateInput(transaction.date),
      category: transaction.category,
      description: transaction.description,
      amount: (transaction.income || transaction.expense).toString(),
      account: transaction.account,
      notes: transaction.notes || '',
    })
    setIsFormOpen(true)
  }

  const resetForm = () => {
    setFormData({
      date: '',
      category: 'EARN',
      description: '',
      amount: '',
      account: 'BCA',
      notes: '',
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Transaction Management</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          ➕ Add Transaction
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            filterCategory === 'ALL'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value as TransactionCategory)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filterCategory === cat.value
                ? `bg-${cat.color}-500 text-white`
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Transaction Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-left py-4 px-6 font-semibold">Category</th>
                <th className="text-left py-4 px-6 font-semibold">Description</th>
                <th className="text-right py-4 px-6 font-semibold">Income</th>
                <th className="text-right py-4 px-6 font-semibold">Expense</th>
                <th className="text-left py-4 px-6 font-semibold">Account</th>
                <th className="text-center py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryClass(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{transaction.description}</td>
                  <td className="py-4 px-6 text-right text-green-600 font-semibold">
                    {transaction.income > 0 ? formatCurrency(transaction.income) : '-'}
                  </td>
                  <td className="py-4 px-6 text-right text-red-600 font-semibold">
                    {transaction.expense > 0 ? formatCurrency(transaction.expense) : '-'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">{transaction.account}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this transaction?')) {
                            onDelete(transaction.id)
                          }
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryClass(transaction.category)}`}>
                {transaction.category}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(transaction.date).toLocaleDateString('id-ID')}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700 mb-2">{transaction.description}</p>

            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1">
                {transaction.income > 0 && (
                  <div className="text-sm">
                    <span className="text-slate-500">Income: </span>
                    <span className="text-green-600 font-semibold">{formatCurrency(transaction.income)}</span>
                  </div>
                )}
                {transaction.expense > 0 && (
                  <div className="text-sm">
                    <span className="text-slate-500">Expense: </span>
                    <span className="text-red-600 font-semibold">{formatCurrency(transaction.expense)}</span>
                  </div>
                )}
                <div className="text-xs text-slate-500">Account: {transaction.account}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleEdit(transaction)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this transaction?')) {
                    onDelete(transaction.id)
                  }
                }}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Account</label>
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value as AccountType })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {ACCOUNTS.map((acc) => (
                      <option key={acc} value={acc}>
                        {acc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all"
                >
                  {editingId ? 'Update' : 'Add'} Transaction
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
