'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  // Map pathname to activeTab
  const getActiveTabFromPath = () => {
    if (pathname === '/dashboard') return 'dashboard'
    if (pathname === '/transactions') return 'transactions'
    if (pathname === '/reports') return 'reports'
    if (pathname === '/income') return 'income'
    if (pathname === '/balance') return 'balance'
    if (pathname === '/cashflow') return 'cashflow'
    if (pathname === '/forecast') return 'forecast'
    return 'dashboard'
  }

  const activeTab = getActiveTabFromPath()

  const handleTabChange = (tab: string) => {
    router.push(`/${tab}`)
    setIsMobileMenuOpen(false)
  }

  const handleExportPDF = () => {
    alert('PDF export feature coming soon!')
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 lg:ml-64 min-h-screen">
        <Header
          onSearch={setSearchQuery}
          onExportPDF={handleExportPDF}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
