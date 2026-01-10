'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
  onSearch: (query: string) => void
  onExportPDF: () => void
}

export default function Header({ onSearch, onExportPDF }: HeaderProps) {
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
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-xl w-96">
        <span className="text-slate-400">🔍</span>
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari transaksi..."
          className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">
          📅 <span>{currentDate}</span>
        </span>
        <button
          onClick={onExportPDF}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          📄 Export PDF
        </button>
      </div>
    </header>
  )
}
