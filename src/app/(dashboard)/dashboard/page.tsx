'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import Transactions from '@/components/Transactions'
import { Transaction } from '@/types'
import { calculateDashboardStats, sortByDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const supabase = createClient()

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
      // Check if Supabase is configured
      const configured = isSupabaseConfigured()
      setSupabaseConfigured(configured)

      if (!configured) {
        console.warn('Supabase is not configured. Please set environment variables.')
        setTransactions([])
        setFilteredTransactions([])
        setLoading(false)
        return
      }

      const { data, error } = await (supabase
        .from('transactions') as any)
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
      if (!supabaseConfigured) {
        alert('⚠️ Supabase belum dikonfigurasi!\n\nSilakan tambahkan environment variables di Vercel:\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\nLalu redeploy aplikasi.')
        return
      }

      const { data, error } = await (supabase
        .from('transactions') as any)
        .insert([transaction])
        .select()
        .single()

      if (error) throw error

      setTransactions([data, ...transactions])
      alert('Transaction added successfully!')
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Failed to add transaction. Check console for details.')
    }
  }

  async function handleEditTransaction(transaction: Transaction) {
    try {
      if (!supabaseConfigured) {
        alert('⚠️ Supabase belum dikonfigurasi!\n\nSilakan tambahkan environment variables di Vercel:\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\nLalu redeploy aplikasi.')
        return
      }

      const { error } = await (supabase
        .from('transactions') as any)
        .update(transaction)
        .eq('id', transaction.id)

      if (error) throw error

      setTransactions(
        transactions.map((t) => (t.id === transaction.id ? transaction : t))
      )
      alert('Transaction updated successfully!')
    } catch (error) {
      console.error('Error updating transaction:', error)
      alert('Failed to update transaction. Check console for details.')
    }
  }

  async function handleDeleteTransaction(id: string) {
    try {
      if (!supabaseConfigured) {
        alert('⚠️ Supabase belum dikonfigurasi!\n\nSilakan tambahkan environment variables di Vercel:\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\nLalu redeploy aplikasi.')
        return
      }

      const { error } = await (supabase
        .from('transactions') as any)
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(transactions.filter((t) => t.id !== id))
      alert('Transaction deleted successfully!')
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction. Check console for details.')
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
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 lg:ml-64 min-h-screen">
        <Header
          onSearch={setSearchQuery}
          onExportPDF={handleExportPDF}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Supabase Configuration Warning */}
        {!supabaseConfigured && (
          <div className="mx-4 lg:mx-8 mt-8 mb-0 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-amber-800">
                  Supabase Belum Dikonfigurasi
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>Aplikasi berjalan dalam mode demo. Untuk menggunakan fitur database:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Buka project di <strong>Vercel Dashboard</strong></li>
                    <li>Pergi ke <strong>Settings → Environment Variables</strong></li>
                    <li>Tambahkan:
                      <ul className="list-disc list-inside ml-5 mt-1">
                        <li><code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
                        <li><code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                      </ul>
                    </li>
                    <li>Redeploy aplikasi</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 lg:p-8">
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
