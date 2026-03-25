import './globals.css'
import { Inter, Fraunces } from 'next/font/google'
import Navbar from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import AuthGuard from '@/components/auth-guard'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata = {
  title: 'Sift',
  description: 'AI-powered resume screening platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full dark ${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased">
        <AuthProvider>
          <ThemeProvider>
            <AuthGuard>
              <div className="noise-overlay" />
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
