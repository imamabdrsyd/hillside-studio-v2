'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeaderProps {
  onSearch: (query: string) => void
  onExportPDF: () => void
  onMenuToggle: () => void
}

export default function Header({ onSearch, onExportPDF, onMenuToggle }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const date = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    setCurrentDate(date)
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left side: Logo + Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Logo (Mobile only) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Image
            src="/picture/hillside-logo.png"
            alt="Hillside Studio"
            width={40}
            height={40}
            className="w-8 h-8 object-contain"
            priority
          />
          <span className="hidden md:block font-bold text-slate-700 text-sm">
            Hillside Studio
          </span>
        </div>

        {/* Hamburger Menu Button (Mobile only) */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-xl flex-1 max-w-md">
          <span className="text-slate-400">🔍</span>
          <input
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari transaksi..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right side: Date + Export Button */}
      <div className="flex items-center gap-2 lg:gap-4">
        <span className="text-xs lg:text-sm text-slate-500 hidden sm:flex items-center gap-1">
          <span className="hidden lg:inline">📅</span>
          <span className="hidden md:inline">{currentDate}</span>
        </span>
        <button
          onClick={onExportPDF}
          className="px-3 lg:px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs lg:text-sm font-semibold hover:bg-emerald-600 transition-all flex items-center gap-1 lg:gap-2 shadow-lg shadow-emerald-500/20"
        >
          <span>📄</span>
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </header>
  )
}
