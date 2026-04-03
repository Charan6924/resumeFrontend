'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import LandingPage from '@/components/landing-page'

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/search')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return <LandingPage />
}
