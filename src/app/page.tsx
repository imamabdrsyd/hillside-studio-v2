'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import Transactions from '@/components/Transactions'
import { Transaction } from '@/types'
import { calculateDashboardStats, sortByDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch transactions from Supabase
  useEffect(() => {
    fetchTransactions()
  }, [])

  // Filter transactions when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.account.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTransactions(filtered)
    } else {
      setFilteredTransactions(transactions)
    }
  }, [searchQuery, transactions])

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      setTransactions(data || [])
      setFilteredTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
      // If Supabase fails, use empty array
      setTransactions([])
      setFilteredTransactions([])
    } finally {
      setLoading(false)
    }
  }

  async function handleAddTransaction(transaction: Omit<Transaction, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single()

      if (error) throw error

      setTransactions([data, ...transactions])
      alert('Transaction added successfully!')
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Failed to add transaction')
    }
  }

  async function handleEditTransaction(transaction: Transaction) {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', transaction.id)

      if (error) throw error

      setTransactions(
        transactions.map((t) => (t.id === transaction.id ? transaction : t))
      )
      alert('Transaction updated successfully!')
    } catch (error) {
      console.error('Error updating transaction:', error)
      alert('Failed to update transaction')
    }
  }

  async function handleDeleteTransaction(id: string) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(transactions.filter((t) => t.id !== id))
      alert('Transaction deleted successfully!')
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction')
    }
  }

  function handleExportPDF() {
    // TODO: Implement PDF export
    alert('PDF export feature coming soon!')
  }

  const stats = calculateDashboardStats(filteredTransactions)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 ml-64 min-h-screen">
        <Header onSearch={setSearchQuery} onExportPDF={handleExportPDF} />

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <Dashboard stats={stats} transactions={filteredTransactions} />
          )}

          {activeTab === 'transactions' && (
            <Transactions
              transactions={sortByDate(filteredTransactions)}
              onAdd={handleAddTransaction}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Reports</h2>
              <p className="text-slate-600">Reports section coming soon...</p>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Income Statement</h2>
              <p className="text-slate-600">Income statement coming soon...</p>
            </div>
          )}

          {activeTab === 'balance' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Balance Sheet</h2>
              <p className="text-slate-600">Balance sheet coming soon...</p>
            </div>
          )}

          {activeTab === 'cashflow' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Cash Flow Statement</h2>
              <p className="text-slate-600">Cash flow statement coming soon...</p>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">ROI & Forecast</h2>
              <p className="text-slate-600">ROI & forecast section coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
