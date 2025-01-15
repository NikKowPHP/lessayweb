'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { completeAssessment, completeAssessmentAndCreatePath } from '@/store/slices/onboardingSlice'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Icon } from '@iconify/react'

export default function AssessmentCompletePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const { 
    loading, 
    error, 
    finalAssessment: results,
    languagePreferences 
  } = useAppSelector((state) => state.onboarding)
  
  const { currentPath, isLoading: isPathLoading } = useAppSelector((state) => state.learning)

  useEffect(() => {
    if (!results) {
      dispatch(completeAssessment())
    }
  }, [dispatch, results])

  const handleContinue = async () => {
    try {
      if (!currentPath) {
        await dispatch(completeAssessmentAndCreatePath()).unwrap()
      }
      router.push('/learning/path')
    } catch (error) {
      console.error('Failed to create learning path:', error)
    }
  }

  if (loading || !results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="large" />
        <p className="text-gray-600">Analyzing your assessment results...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <Icon icon="mdi:check-circle" className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Assessment Complete! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're creating your personalized learning path for {languagePreferences?.targetLanguage}
          </p>
          
          {isPathLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="medium" />
              <p className="text-gray-600">Creating your personalized learning path...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-gray-700">
                Your learning path is ready! Click below to start your journey.
              </p>
              
              {error && (
                <div className="w-full max-w-md p-4 bg-red-50 rounded-md">
                  <div className="flex">
                    <Icon icon="mdi:alert-circle" className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleContinue}
                disabled={isPathLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent 
                  text-base font-medium rounded-md text-white bg-primary 
                  hover:bg-primary-dark focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-primary disabled:opacity-50 
                  disabled:cursor-not-allowed transition-all duration-200"
              >
                <Icon icon="mdi:arrow-right" className="w-5 h-5 mr-2" />
                View Your Learning Path
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
