'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { initializeAuth } from '@/store/slices/authSlice'
import { rehydrateState } from '@/store/slices/onboardingSlice'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const { isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth)
  const { currentStep, languagePreferences, sessionLoaded } = useAppSelector((state) => state.onboarding)
  const onboardingState = useAppSelector(state => state.onboarding)
  // Determine onboarding status
  const hasLanguagePreferences = !!languagePreferences
  const isOnboardingComplete = currentStep === 'complete'
  const needsOnboarding = !isOnboardingComplete

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(initializeAuth()).unwrap()
        await dispatch(rehydrateState()).unwrap()
        console.log('rehydrated state', onboardingState)
      } catch (error) {
        console.error('Failed to initialize app', error as Error)
      }
    }

    initializeApp()
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated && sessionLoaded) {
      console.info('User is authenticated, checking onboarding status', {
        hasLanguagePreferences,
        currentStep,
        isOnboardingComplete
      })

      if (needsOnboarding) {
        if (hasLanguagePreferences) {
          // If they have language preferences but haven't completed onboarding,
          // send them to assessment intro
          router.replace('/onboarding/assessment/intro')
        } else {
          // If they don't have language preferences, start from the beginning
          router.replace('/onboarding/language')
        }
      } else {
        // Onboarding is complete, go to learning path
        router.replace('/learning/path')
      }
    }
  }, [isAuthenticated, sessionLoaded, hasLanguagePreferences, needsOnboarding, currentStep, router])

  if (authLoading || !sessionLoaded) {
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