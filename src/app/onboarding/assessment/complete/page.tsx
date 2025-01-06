'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { completeUserOnboarding } from '@/store/slices/userSlice'
import { resetOnboarding } from '@/store/slices/onboardingSlice'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ConfettiExplosion from 'react-confetti-explosion'

interface AssessmentResult {
  pronunciation: number
  vocabulary: number
  grammar: number
  comprehension: number
  overall: number
  level: 'beginner' | 'intermediate' | 'advanced'
  nextSteps: string[]
}

export default function AssessmentCompletePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.onboarding)
  const [isExploding, setIsExploding] = useState(true)
  const [results, setResults] = useState<AssessmentResult | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await onboardingService.getAssessmentResults()
        setResults(response.data)
        await dispatch(completeUserOnboarding()).unwrap()
      } catch (error) {
        console.error('Failed to fetch assessment results:', error)
      }
    }

    fetchResults()
  }, [dispatch])

  const handleContinue = () => {
    dispatch(resetOnboarding())
    router.push('/dashboard')
  }

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {isExploding && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ConfettiExplosion
              force={0.8}
              duration={3000}
              particleCount={100}
              width={1600}
            />
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Assessment Complete! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Based on your assessment, we've created a personalized learning path
            for you
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Overall Score */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Level:{' '}
              {results.level.charAt(0).toUpperCase() + results.level.slice(1)}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${results.overall}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Overall Score: {results.overall}%
            </p>
          </div>

          {/* Detailed Scores */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(results)
              .filter(([key]) =>
                [
                  'pronunciation',
                  'vocabulary',
                  'grammar',
                  'comprehension',
                ].includes(key)
              )
              .map(([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {skill}
                    </span>
                    <span className="text-sm text-gray-500">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Next Steps */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recommended Next Steps
            </h3>
            <ul className="space-y-3">
              {results.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    {index + 1}
                  </span>
                  <span className="ml-3 text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleContinue}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
