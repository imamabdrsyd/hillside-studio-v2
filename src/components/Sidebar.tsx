'use client'

import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { RoleBadge } from './auth/RoleBadge'
import { canViewTransactions } from '@/types/auth'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const { user, profile, signOut } = useAuth()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', group: 'Overview' },
    { id: 'transactions', label: 'Transactions', icon: '📋', group: 'Overview', requiresRole: 'managing_director' },
    { id: 'reports', label: 'Reports', icon: '📈', group: 'Overview' },
    { id: 'income', label: 'Income Statement', icon: '💰', group: 'Financial Statements' },
    { id: 'balance', label: 'Balance Sheet', icon: '⚖️', group: 'Financial Statements' },
    { id: 'cashflow', label: 'Cash Flow', icon: '💵', group: 'Financial Statements' },
    { id: 'forecast', label: 'ROI & Forecast', icon: '🔮', group: 'Analysis' },
  ]

  const groups = ['Overview', 'Financial Statements', 'Analysis']

  // Filter menu items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (item.requiresRole === 'managing_director') {
      return profile?.role === 'managing_director'
    }
    return true
  })

  const handleNavClick = (tab: string) => {
    onTabChange(tab)
    onClose() // Close mobile menu after selecting
  }

  const handleLogout = async () => {
    await signOut()
  }

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-slate-200 p-5 flex flex-col fixed h-screen z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 flex items-center justify-center">
          <Image
            src="/picture/hillside-silhouette.png"
            alt="Hillside Studio"
            width={44}
            height={44}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Hillside Studio</h1>
          <p className="text-[10px] text-slate-400 font-medium">Finance Management v2</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {groups.map((group, index) => {
          const groupItems = filteredNavItems.filter(item => item.group === group)
          if (groupItems.length === 0) return null

          return (
            <div key={group}>
              {index > 0 && <div className="mt-6" />}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                {group}
              </p>
              {groupItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center font-bold text-emerald-600 text-sm">
            {getInitials(profile?.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">
              {profile?.full_name || user?.email}
            </p>
            {profile?.role && (
              <div className="mt-1">
                <RoleBadge role={profile.role} size="sm" />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
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
    </aside>
    </>
  )
}
