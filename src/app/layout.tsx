import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { config } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${config.app.name} - K-pop Group Order Management`,
  description: 'Manage K-pop group orders easily and securely',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}