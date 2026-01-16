import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Image
              src="/picture/hillside-silhouette.png"
              alt="Hillside Studio"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-slate-800">Hillside Studio</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Finance Management System 
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2025 Imam Abdurasyid. All rights reserved.
        </p>
      </div>
    </div>
  )
}
