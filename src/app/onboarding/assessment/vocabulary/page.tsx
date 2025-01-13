'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import AssessmentLayout from '../layout'
import Image from 'next/image'

export default function VocabularyAssessmentPage() {
  const router = useRouter()
  const { prompts } = useAppSelector((state) => state.onboarding)
  const prompt = prompts[AssessmentType.Vocabulary]

  const handleSubmit = async () => {
    // Handle submission logic
    router.push('/onboarding/assessment/grammar')
  }

  return (
    <AssessmentLayout type={AssessmentType.Vocabulary} onSubmit={handleSubmit}>
      {prompt && (
        <div className="space-y-4">
          <div className="relative w-full h-64">
            <Image
              src={prompt.image_url}
              alt={prompt.topic}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Topic: {prompt.topic}</p>
            {prompt.hints && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Hints:</p>
                <ul className="list-disc list-inside">
                  {prompt.hints.map((hint: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <textarea
            className="w-full p-3 border rounded-md"
            rows={4}
            placeholder="Describe what you see in the image..."
          />
        </div>
      )}
    </AssessmentLayout>
  )
}