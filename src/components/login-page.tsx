'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  OAuthCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth, googleProvider, githubProvider } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState<'google' | 'github' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) router.push('/search')
  }, [user, router])

  let pendingGithubCredential: OAuthCredential | null = null

  const handleAccountConflict = async (err: unknown) => {
    const firebaseError = err as FirebaseError

    if (firebaseError.code !== 'auth/account-exists-with-different-credential') {
      throw err
    }

    pendingGithubCredential = GithubAuthProvider.credentialFromError(firebaseError)
    
    throw new Error(
      'An account already exists with this email. Please sign in with Google to link your GitHub account.'
    )
}

  const handleGoogleSignIn = async () => {
    setLoading('google')
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/search')
    } catch (err: unknown) {
      try {
        await handleAccountConflict(err)
        router.push('/search') // conflict resolved, proceed
      } catch (finalErr: unknown) {
        const message = finalErr instanceof Error ? finalErr.message : 'Failed to sign in with Google'
        setError(message)
      }
    } finally {
      setLoading(null)
    }
  }

  const handleGithubSignIn = async () => {
    setLoading('github')
    setError(null)
    try {
      await signInWithPopup(auth, githubProvider)
      router.push('/search')
    } catch (err: unknown) {
      try {
        await handleAccountConflict(err)
        router.push('/search') // conflict resolved, proceed
      } catch (finalErr: unknown) {
        const message = finalErr instanceof Error ? finalErr.message : 'Failed to sign in with GitHub'
        setError(message)
      }
    } finally {
      setLoading(null)
    }
  }


  return (
    <div className="fixed inset-0 flex">
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl text-neutral-900">Sift</h1>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading !== null}
              className="w-full flex items-center gap-4 px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'google' ? (
                <Spinner />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={loading !== null}
              className="w-full flex items-center gap-4 px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'github' ? (
                <Spinner />
              ) : (
                <GithubIcon />
              )}
              Continue with GitHub
            </button>
          </div>

          <p className="mt-8 text-neutral-500 text-sm text-center">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-neutral-950 flex-col items-center justify-center px-16">
        <p className="text-white tracking-[0.25em] text-sm font-medium mb-6">
          AI-POWERED RECRUITING
        </p>
        <h2 className="font-display text-5xl text-white text-center leading-tight">
          Find the right talent<br />with natural language
        </h2>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-neutral-500" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="h-5 w-5" fill="#24292f" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  )
}
