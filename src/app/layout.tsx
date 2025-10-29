//src/app/layout.tsx

import type { Metadata } from 'next'
import Providers from './providers'
import NavBar from './components/NavBar'

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
        <Providers>
          <NavBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

