'use client'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', group: 'Overview' },
    { id: 'transactions', label: 'Transactions', icon: '📋', group: 'Overview' },
    { id: 'reports', label: 'Reports', icon: '📈', group: 'Overview' },
    { id: 'income', label: 'Income Statement', icon: '💰', group: 'Financial Statements' },
    { id: 'balance', label: 'Balance Sheet', icon: '⚖️', group: 'Financial Statements' },
    { id: 'cashflow', label: 'Cash Flow', icon: '💵', group: 'Financial Statements' },
    { id: 'forecast', label: 'ROI & Forecast', icon: '🔮', group: 'Analysis' },
  ]

  const groups = ['Overview', 'Financial Statements', 'Analysis']

  const handleNavClick = (tab: string) => {
    onTabChange(tab)
    onClose() // Close mobile menu after selecting
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
        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/30">
          🏔️
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Hillside Studio</h1>
          <p className="text-[10px] text-slate-400 font-medium">Finance Management v2</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {groups.map((group, index) => (
          <div key={group}>
            {index > 0 && <div className="mt-6" />}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              {group}
            </p>
            {navItems
              .filter(item => item.group === group)
              .map(item => (
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
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center font-bold text-emerald-600 text-sm">
            IM
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">Imam</p>
            <p className="text-[10px] text-slate-400">Superadmin</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
