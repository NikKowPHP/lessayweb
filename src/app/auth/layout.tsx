'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { initializeAuth } from '@/store/slices/authSlice'
import { logger } from '@/lib/utils/logger'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const { isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth)
  const { currentStep } = useAppSelector((state) => state.onboarding)
  const needsOnboarding = currentStep !== 'complete'

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(initializeAuth()).unwrap()
      } catch (error) {
        logger.error('Failed to initialize auth', error as Error)
      }
    }

    initAuth()
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      logger.info('User is authenticated, checking onboarding status', {
        needsOnboarding,
        currentStep
      })

      if (needsOnboarding) {
        router.replace('/onboarding')
      } else {
        router.replace('/learning/path')
      }
    }
  }, [isAuthenticated, needsOnboarding, currentStep, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  return null
} 