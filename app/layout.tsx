import './globals.css'
import Navbar from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'

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
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased">
        <ThemeProvider>
          <div className="noise-overlay" />
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
