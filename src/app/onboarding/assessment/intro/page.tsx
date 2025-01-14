'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { startAssessment } from '@/store/slices/onboardingSlice'
import { AssessmentType } from '@/lib/types/onboardingTypes'

export default function AssessmentIntroPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.onboarding)

  const handleStartAssessment = async () => {
    try {
      await dispatch(startAssessment(AssessmentType.Pronunciation)).unwrap()
      router.push('/onboarding/assessment/pronunciation')
    } catch (err) {
      // Error is handled by the slice
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Initial Assessment
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Let's evaluate your current language skills through a series of exercises:
          </p>
          <ul className="mt-6 space-y-4 text-left text-gray-600">
            <li className="flex items-center">
              <span className="mr-2">🎙️</span>
              <span>Pronunciation exercises</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📝</span>
              <span>Grammar questions</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📚</span>
              <span>Vocabulary assessment</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">👂</span>
              <span>Listening comprehension</span>
            </li>
          </ul>
          
          <p className="mt-6 text-sm text-gray-500">
            This will help us create a personalized learning path for you.
            The assessment takes about 15-20 minutes to complete.
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <div>
          <button
            onClick={handleStartAssessment}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Start Assessment'}
          </button>
        </div>
      </div>
    </div>
  )
}