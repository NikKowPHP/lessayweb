'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { completeAssessment, resetOnboarding } from '@/store/slices/onboardingSlice'
import { setLearningPath, setAssessmentResults } from '@/store/slices/learningSlice'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Icon } from '@iconify/react'

export default function AssessmentCompletePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isCreatingPath, setIsCreatingPath] = useState(false)
  
  const { 
    loading, 
    error, 
    finalAssessment: results,
    languagePreferences 
  } = useAppSelector((state) => state.onboarding)
  
  const { learningPath } = useAppSelector((state) => state.learning)

  useEffect(() => {
    if (!results) {
      dispatch(completeAssessment())
    }
  }, [dispatch, results])

  const handleContinue = async () => {
    if (!learningPath.length) {
      setIsCreatingPath(true)
      try {
        // Simulate learning path creation
        await new Promise(resolve => setTimeout(resolve, 2000))
        dispatch(setLearningPath([
          {
            type: 'lesson',
            skill: results?.weakestSkill,
            level: results?.level,
            duration: '30min'
          },
          // ... other path items
        ]))
        dispatch(setAssessmentResults(results))
        dispatch(resetOnboarding())
        router.push('/dashboard')
      } catch (error) {
        setIsCreatingPath(false)
      }
    } else {
      dispatch(resetOnboarding())
      router.push('/dashboard')
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

  if (isCreatingPath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="large" />
        <p className="text-gray-600">Creating your personalized learning path...</p>
        <p className="text-sm text-gray-500">This may take a few moments</p>
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
          <p className="text-xl text-gray-600">
            We've analyzed your {languagePreferences?.targetLanguage} language skills
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Overall Score */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Level: <span className="text-primary">{results.level}</span>
            </h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-100">
                    Overall Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary">
                    {results.overall}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${results.overall}%` }}
                />
              </div>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(results.skill_breakdown || {})
              .map(([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {skill.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">{Math.round(score * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Recommendations */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {results.misunderstood_concepts?.map((concept, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Icon icon="mdi:target" className="w-4 h-4" />
                  </span>
                  <span className="ml-3 text-gray-700">{concept.replace('_', ' ')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <Icon icon="mdi:alert-circle" className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={loading || isCreatingPath}
            className="inline-flex items-center px-6 py-3 border border-transparent 
              text-base font-medium rounded-md text-white bg-primary 
              hover:bg-primary-dark focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-primary disabled:opacity-50 
              disabled:cursor-not-allowed transition-all duration-200"
          >
            {isCreatingPath ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Creating Learning Path...
              </>
            ) : (
              <>
                <Icon icon="mdi:arrow-right" className="w-5 h-5 mr-2" />
                Continue to Dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
