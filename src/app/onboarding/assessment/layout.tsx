'use client'

import { AssessmentType } from '@/lib/types/onboardingTypes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { rehydrateState } from '@/store/slices/onboardingSlice'
import { useEffect } from 'react'

interface AssessmentLayoutProps {
  type: AssessmentType
  children: React.ReactNode
  onSubmit: () => void
}

export default function AssessmentLayout({ type, children, onSubmit }: AssessmentLayoutProps) {
  const { loading, error } = useAppSelector((state) => state.onboarding)
  const onboardingState = useAppSelector(state => state.onboarding)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(rehydrateState())
  }, [dispatch])
  useEffect(() => {
    // dispatch(getPrompt(AssessmentType.Pronunciation))
    console.log('onboardingState the latest', onboardingState)
  }, [onboardingState])

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Assessment
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {children}
          </div>

          <div className="mt-8">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}