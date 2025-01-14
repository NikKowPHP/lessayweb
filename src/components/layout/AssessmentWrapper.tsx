'use client'

import { useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import { selectResponses, selectAssessmentProgress } from '@/store/slices/onboardingSlice'

interface AssessmentWrapperProps {
  type: AssessmentType
  children: React.ReactNode
}

function getAssessmentDescription(type: AssessmentType): string {
  const descriptions = {
    [AssessmentType.Pronunciation]: 
      'Read the provided text aloud to assess your pronunciation skills.',
    [AssessmentType.Vocabulary]: 
      'Describe what you see in the image using appropriate vocabulary. You can choose to write or speak your response.',
    [AssessmentType.Grammar]: 
      'Complete the sentences using correct grammar structures.',
    [AssessmentType.Comprehension]: 
      'Listen to the audio and answer questions to demonstrate your understanding.'
  }
  return descriptions[type] || 'Assessment'
}

function getAssessmentProgress(type: AssessmentType): string {
  const assessmentOrder = [
    AssessmentType.Pronunciation,
    AssessmentType.Vocabulary,
    AssessmentType.Grammar,
    AssessmentType.Comprehension
  ]
  const currentIndex = assessmentOrder.indexOf(type)
  return `${currentIndex + 1} of ${assessmentOrder.length}`
}

function getProgressPercentage(type: AssessmentType): number {
  const assessmentOrder = [
    AssessmentType.Pronunciation,
    AssessmentType.Vocabulary,
    AssessmentType.Grammar,
    AssessmentType.Comprehension
  ]
  const currentIndex = assessmentOrder.indexOf(type)
  return ((currentIndex + 1) / assessmentOrder.length) * 100
}

export default function AssessmentWrapper({ type, children }: AssessmentWrapperProps) {
  const responses = useAppSelector(selectResponses)
  const overallProgress = useAppSelector(selectAssessmentProgress)
  
  // Calculate current assessment progress
  const currentProgress = getProgressPercentage(type)
  const progressText = getAssessmentProgress(type)

  return (
    <div className="space-y-8 mt-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {type.charAt(0).toUpperCase() + type.slice(1)} Assessment
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {getAssessmentDescription(type)}
        </p>
      </div>

      {children}

      <div className="mt-8 space-y-4">
        {/* Current Assessment Progress */}
        <div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Current Assessment</span>
            <span>{progressText}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        {/* Overall Progress */}
        <div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Overall Progress</span>
            <span>{Object.keys(responses).length} of 4 Completed</span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}