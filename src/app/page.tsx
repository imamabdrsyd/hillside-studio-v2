'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RootPage() {
  const router = useRouter()
  const { user, loading, initialized } = useAuth()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect once auth is initialized and we haven't redirected yet
    if (initialized && !hasRedirected) {
      setHasRedirected(true)
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }
  }, [user, initialized, hasRedirected, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold">Loading...</p>
      </div>
    </div>
  )
}
