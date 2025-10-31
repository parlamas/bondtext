// src/app/layout.tsx

import type { Metadata } from 'next'
import Providers from './providers'
import NavBar from './components/NavBar'
import { CustomerAuthProvider } from '@/context/CustomerAuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'BondText',
  description: 'Your restaurant ordering platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <CustomerAuthProvider>
          <Providers>
            <NavBar />
            <main>{children}</main>
          </Providers>
        </CustomerAuthProvider>
      </body>
    </html>
  )
}

