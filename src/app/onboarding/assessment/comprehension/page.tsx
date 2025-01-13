'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import AssessmentLayout from '../layout'
import { ComprehensionQuestion } from '@/lib/models/responses/prompts/PromptResponses'

export default function ComprehensionAssessmentPage() {
  const router = useRouter()
  const { prompts } = useAppSelector((state) => state.onboarding)
  const prompt = prompts[AssessmentType.Comprehension]

  const handleSubmit = async () => {
    // Handle submission logic
    router.push('/onboarding/assessment/complete')
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video">
        <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${prompt.youtube_video_id}`}
              title={prompt.title}
              allowFullScreen
              className="rounded-lg"
            />
          </div>

          <div className="space-y-6">
            {prompt.questions.map((question: ComprehensionQuestion, index: number) => (
              <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{question.question}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Time: {question.context_timestamp}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Hint: {question.hint}</p>
                </div>
                <textarea
                  className="mt-3 w-full p-3 border rounded-md"
                  rows={3}
                  placeholder="Write your answer here..."
                />
              </div>
            ))}
          </div>
    </div>
  )
}