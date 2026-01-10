import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hillside Studio - Manajemen Keuangan Airbnb',
  description: 'Aplikasi manajemen keuangan untuk bisnis rental apartemen Airbnb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-gray-50">
        {children}
      </body>
    </html>
  )
}
