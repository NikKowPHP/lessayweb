'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import AssessmentLayout from '../layout'

export default function PronunciationAssessmentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { prompts } = useAppSelector((state) => state.onboarding)
  const [recording, setRecording] = useState(false)

  const prompt = prompts[AssessmentType.Pronunciation]

  const handleSubmit = async () => {
    // Handle submission logic
    router.push('/onboarding/assessment/vocabulary')
  }

  return (
    <AssessmentLayout type={AssessmentType.Pronunciation} onSubmit={handleSubmit}>
      {prompt && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium">{prompt.prompt_text}</p>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">Target sounds:</p>
            <div className="flex gap-2 mt-1">
              {prompt.target_phonemes.map((phoneme: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 rounded text-blue-800">
                  {phoneme}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setRecording(!recording)}
            className={`mt-4 px-4 py-2 rounded-full ${
              recording ? 'bg-red-500' : 'bg-blue-500'
            } text-white`}
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      )}
    </AssessmentLayout>
  )
}