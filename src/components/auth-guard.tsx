'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const publicRoutes = ['/', '/login', '/terms']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push('/')
    }
  }, [user, loading, isPublicRoute, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-[var(--text-primary)] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
