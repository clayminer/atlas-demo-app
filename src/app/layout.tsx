import type { Metadata } from 'next'
import { AtlasClientProvider } from '@/atlas/client'
import { MockAuthProvider } from '@/lib/mock-auth'
import './globals.css'

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Atlas Demo App',
  description: 'A Next.js app showcasing Atlas SDK features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MockAuthProvider>
          <AtlasClientProvider>
            {children}
          </AtlasClientProvider>
        </MockAuthProvider>
      </body>
    </html>
  )
}