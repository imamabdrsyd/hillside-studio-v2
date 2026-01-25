'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Dashboard from '@/components/Dashboard'
import { Transaction } from '@/types'
import { calculateDashboardStats } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoadingTimeout } from '@/hooks/useInfiniteLoopDetection'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize supabase client agar tidak di-recreate setiap render
  const supabase = useMemo(() => createClient(), [])

  // Memoize timeout handler untuk optimasi (meskipun hook sudah menggunakan ref)
  const handleLoadingTimeout = useCallback(() => {
    setError('Loading terlalu lama. Halaman mungkin mengalami infinite loop atau koneksi bermasalah.')
    setLoading(false)
  }, [])

  // Deteksi jika loading terlalu lama (timeout 30 detik)
  const hasTimedOut = useLoadingTimeout(loading, {
    timeout: 30000,
    onTimeout: handleLoadingTimeout
  })

  // Fetch transactions from Supabase
  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout | null = null

    const fetchTransactions = async () => {
      try {
        setError(null) // Reset error state

        // Check if Supabase is configured
        const configured = isSupabaseConfigured()

        if (isMounted) {
          setSupabaseConfigured(configured)
        }

        if (!configured) {
          console.warn('Supabase is not configured. Please set environment variables.')
          if (isMounted) {
            setTransactions([])
            setLoading(false)
          }
          return
        }

        // Set timeout manual untuk deteksi request yang terlalu lama
        let hasTimedOut = false
        timeoutId = setTimeout(() => {
          hasTimedOut = true
          if (isMounted) {
            setError('Koneksi terlalu lama. Silakan coba refresh halaman.')
            setLoading(false)
          }
        }, 25000) // 25 detik timeout

        // Fetch dari Supabase
        const { data, error: fetchError } = await (supabase
          .from('transactions') as any)
          .select('*')
          .order('date', { ascending: false })

        // Clear timeout jika request selesai
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        // Jika sudah timeout atau component unmounted, jangan update state
        if (hasTimedOut || !isMounted) {
          return
        }

        if (fetchError) throw fetchError

        if (isMounted) {
          setTransactions(data || [])
          setError(null)
        }
      } catch (error: any) {
        console.error('Error fetching transactions:', error)

        // Clear timeout jika ada error
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        // Ignore AbortError (terjadi saat component unmount)
        if (error.name === 'AbortError') {
          return
        }

        if (isMounted) {
          setTransactions([])

          // Set pesan error yang user-friendly
          if (error.message?.includes('timeout')) {
            setError('Koneksi terlalu lama. Silakan coba refresh halaman.')
          } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
            setError('Gagal terhubung ke server. Periksa koneksi internet Anda.')
          } else if (error.message?.includes('JWT') || error.message?.includes('auth')) {
            setError('Sesi Anda telah berakhir. Silakan login kembali.')
          } else {
            setError(`Terjadi kesalahan: ${error.message}`)
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTransactions()

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false
      // Clear timeout jika component unmount
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, []) // Empty dependency array - run once on mount

  const stats = calculateDashboardStats(transactions)

  // Tampilkan error jika ada
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900">Terjadi Kesalahan</h2>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-amber-900 mb-2">🔄 Kemungkinan Penyebab:</h3>
            <ul className="text-amber-800 text-sm space-y-1 list-disc list-inside">
              <li>Koneksi internet terputus atau lambat</li>
              <li>Server database tidak merespons</li>
              <li>Request timeout (lebih dari 25 detik)</li>
              <li>Terjadi infinite loop pada proses loading</li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Halaman
            </button>
            <button
              onClick={() => setError(null)}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl border-2 border-slate-200 transition-colors"
            >
              Tutup Pesan Error
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading...</p>
          <p className="text-slate-500 text-sm mt-2">
            Jika loading terlalu lama, halaman akan otomatis menampilkan error
          </p>
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
