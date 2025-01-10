'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { selectNeedsOnboarding } from '@/store/slices/userSlice'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const needsOnboarding = useAppSelector(selectNeedsOnboarding)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (needsOnboarding) {
        router.replace('/onboarding')
      } else {
        router.replace('/learning/path')
      }
    }
  }, [isAuthenticated, loading, router, needsOnboarding])

  return !isAuthenticated ? children : null
}