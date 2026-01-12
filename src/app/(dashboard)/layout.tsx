'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar
        activeTab="dashboard"
        onTabChange={() => {}}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 lg:ml-64 min-h-screen">
        <Header
          onSearch={() => {}}
          onExportPDF={() => {}}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
