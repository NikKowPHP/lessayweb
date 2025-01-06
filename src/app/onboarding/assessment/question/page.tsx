'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  submitAssessmentAnswer,
  setCurrentQuestion,
  setAssessmentType,
} from '@/store/slices/onboardingSlice'
import PronunciationAssessment from '@/components/assessment/PronunciationAssessment'
import VocabularyAssessment from '@/components/assessment/VocabularyAssessment'
import GrammarAssessment from '@/components/assessment/GrammarAssessment'
import ComprehensionAssessment from '@/components/assessment/ComprehensionAssessment'
import AssessmentProgress from '@/components/assessment/AssessmentProgress'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AssessmentQuestionPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {
    currentQuestion,
    loading,
    error,
    assessmentProgress,
    assessmentType,
  } = useAppSelector((state) => state.onboarding)

  useEffect(() => {
    if (!currentQuestion && !loading) {
      router.push('/onboarding/assessment/complete')
    }
  }, [currentQuestion, loading, router])

  const handleAnswerSubmit = async (answer: any) => {
    if (!currentQuestion) return

    try {
      await dispatch(
        submitAssessmentAnswer({
          questionId: currentQuestion.id,
          answer,
        })
      ).unwrap()
    } catch (error) {
      // Error is handled by the slice
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentQuestion) {
    return null // Will redirect in useEffect
  }

  const renderAssessmentComponent = () => {
    switch (currentQuestion.type) {
      case 'pronunciation':
        return (
          <PronunciationAssessment
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        )
      case 'vocabulary':
        return (
          <VocabularyAssessment
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        )
      case 'grammar':
        return (
          <GrammarAssessment
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        )
      case 'comprehension':
        return (
          <ComprehensionAssessment
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <AssessmentProgress progress={assessmentProgress} />

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm uppercase tracking-wide text-gray-500 mb-4">
            {currentQuestion.type} Assessment
          </div>

          {renderAssessmentComponent()}
        </div>
      </div>
    </div>
  )
}
