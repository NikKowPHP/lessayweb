'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import { submitAssessment } from '@/store/slices/onboardingSlice'
import { GrammarAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import AssessmentWrapper from '@/components/layout/AssessmentWrapper'

export default function GrammarAssessmentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { prompts, assessmentId } = useAppSelector((state) => state.onboarding)
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const prompt = prompts[AssessmentType.Grammar]

  const handleSubmit = async () => {
    if (!answer.trim() || !prompt) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const grammarRequest: GrammarAssessmentRequest = {
        assessmentId: assessmentId!,
        timestamp: new Date().toISOString(),
        difficulty_level: prompt.difficulty_level,
        prompt_text: prompt.prompt_text,
        targetStructures: prompt.target_structures,
        duration: 0, //todo: set response duration 
        example_sentence: prompt.example_sentence,
        userResponse: answer.trim()
      }

       dispatch(submitAssessment({
        type: AssessmentType.Grammar,
        data: grammarRequest
      })).unwrap()

      router.push('/onboarding/assessment/comprehension')
    } catch (error) {
      console.error('Failed to submit grammar assessment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AssessmentWrapper type={AssessmentType.Grammar}>
      {prompt && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium">{prompt.prompt_text}</p>
            <p className="mt-2 text-sm text-gray-600">Example: {prompt.example_sentence}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Target structures:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {prompt.target_structures.map((structure: string, index: number) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-green-100 rounded text-green-800"
                >
                  {structure}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary 
                focus:border-transparent min-h-[120px]"
              placeholder="Write your answer here..."
              disabled={isSubmitting}
            />
            {answer.length > 0 && answer.length < 20 && (
              <p className="text-sm text-yellow-600">
                Please write a complete answer (minimum 20 characters)
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={answer.trim().length < 20 || isSubmitting}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm 
              text-white bg-primary hover:bg-primary-dark focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-primary 
              disabled:bg-gray-400 disabled:cursor-not-allowed 
              transition-colors duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      )}
    </AssessmentWrapper>
  )
}