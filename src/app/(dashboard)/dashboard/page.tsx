'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/Dashboard'
import { Transaction } from '@/types'
import { calculateDashboardStats } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  const supabase = createClient()

  // Fetch transactions from Supabase
  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      // Check if Supabase is configured
      const configured = isSupabaseConfigured()
      setSupabaseConfigured(configured)

      if (!configured) {
        console.warn('Supabase is not configured. Please set environment variables.')
        setTransactions([])
        setLoading(false)
        return
      }

      const { data, error } = await (supabase
        .from('transactions') as any)
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const stats = calculateDashboardStats(transactions)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Supabase Configuration Warning */}
      {!supabaseConfigured && (
        <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
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

      <Dashboard stats={stats} transactions={transactions} />
    </>
  )
}
