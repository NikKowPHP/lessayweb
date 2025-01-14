'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import AssessmentLayout from '../layout'
import { submitAssessment } from '@/store/slices/onboardingSlice'
import { PronunciationAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import { RecordingHelper } from '@/lib/utils/recording'

export default function PronunciationAssessmentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { prompts, loading, assessmentId } = useAppSelector((state) => state.onboarding)
  const [recording, setRecording] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)


  const prompt = prompts[AssessmentType.Pronunciation]

  const handleSubmit = async () => {
    if (!audioData || !prompt) {
      return
    }
  
    try {
      const base64Audio = await RecordingHelper.convertBlobToBase64(audioData)
      // Create properly typed pronunciation assessment request
      const pronunciationRequest: PronunciationAssessmentRequest = {
        assessmentId: assessmentId!,
        timestamp: new Date().toISOString(),
        duration: 0, // Add actual recording duration
        difficulty_level: prompt.difficulty_level,
        audioBase64: base64Audio,
        targetPhonemes: prompt.target_phonemes,
        prompt_text: prompt.prompt_text
      }
  
      // Submit with proper typing
      await dispatch(submitAssessment({
        type: AssessmentType.Pronunciation,
        data: pronunciationRequest
      })).unwrap()
  
      router.push('/onboarding/assessment/vocabulary')
    } catch (error) {
      console.error('Failed to submit pronunciation assessment:', error)
    }
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

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setRecording(!recording)}
              className={`px-4 py-2 rounded-full ${
                recording ? 'bg-red-500' : 'bg-blue-500'
              } text-white`}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !audioData}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Recording'}
            </button>
          </div>
        </div>
      )}
    </AssessmentLayout>
  )
}