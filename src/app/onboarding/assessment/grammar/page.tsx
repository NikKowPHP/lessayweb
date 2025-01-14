'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import AssessmentLayout from '../layout'
import AssessmentWrapper from '@/components/layout/AssessmentWrapper'

export default function GrammarAssessmentPage() {
  const router = useRouter()
  const { prompts } = useAppSelector((state) => state.onboarding)
  const prompt = prompts[AssessmentType.Grammar]

  const handleSubmit = async () => {
    // Handle submission logic
    router.push('/onboarding/assessment/comprehension')
  }

  return (
    <AssessmentWrapper type={AssessmentType.Grammar}>
      {prompt && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium">{prompt.prompt_text}</p>
            <p className="mt-2 text-sm text-gray-600">Example: {prompt.example_sentence}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Target structures:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {prompt.target_structures.map((structure: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-green-100 rounded text-green-800">
                  {structure}
                </span>
              ))}
            </div>
          </div>

          <textarea
            className="w-full p-3 border rounded-md"
            rows={4}
            placeholder="Write your answer here..."
          />
        </div>
      )}
    </AssessmentWrapper>
  )
}