'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { RoleBadge } from './auth/RoleBadge'

interface HeaderProps {
  onSearch: (query: string) => void
  onExportPDF: () => void
  onMenuToggle: () => void
}

export default function Header({ onSearch, onExportPDF, onMenuToggle }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const date = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    setCurrentDate(date)
  }, [])

  // Get user initials
  const getInitials = (name?: string | null) => {
    if (!name) return user?.email?.substring(0, 2).toUpperCase() || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleLogout = async () => {
    await signOut()
    setShowUserMenu(false)
  }

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

      {/* Right side: Date + Export Button + User Menu */}
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

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-emerald-100 rounded-lg flex items-center justify-center font-bold text-emerald-600 text-xs lg:text-sm">
              {getInitials(profile?.full_name)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">
                {profile?.full_name || user?.email}
              </p>
              {profile?.role && (
                <div className="mt-0.5">
                  <RoleBadge role={profile.role} size="sm" />
                </div>
              )}
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${
                showUserMenu ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-700">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  {profile?.role && (
                    <div className="mt-2">
                      <RoleBadge role={profile.role} size="md" />
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      window.location.href = '/profile'
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    <span>Change Password</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
