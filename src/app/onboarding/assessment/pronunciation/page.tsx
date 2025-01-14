'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import { submitAssessment } from '@/store/slices/onboardingSlice'
import { PronunciationAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import { RecordingHelper } from '@/lib/utils/recording'
import AssessmentLayout from '../layout'

import { 
  startRecording, 
  stopRecording, 
  resetRecording, 
  updateDuration,
  selectRecordingState 
} from '@/store/slices/recordingSlice'
import AssessmentWrapper from '@/components/layout/AssessmentWrapper'

export default function PronunciationAssessmentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { prompts,  assessmentId } = useAppSelector((state) => state.onboarding)
  const { 
    isRecording, 
    audioData, 
    audioUrl, 
    duration, 
    error, 
    loading 
  } = useAppSelector(selectRecordingState)

  const prompt = prompts[AssessmentType.Pronunciation]

  useEffect(() => {
    let durationTimer: NodeJS.Timeout

    if (isRecording) {
      durationTimer = setInterval(() => {
        dispatch(updateDuration())
      }, 1000)
    }

    return () => {
      if (durationTimer) {
        clearInterval(durationTimer)
      }
    }
  }, [isRecording, dispatch])

  const handleRecordingToggle = async () => {
    try {
      if (!isRecording) {
        await dispatch(startRecording()).unwrap()
      } else {
        await dispatch(stopRecording()).unwrap()
      }
    } catch (error) {
      console.error('Recording error:', error)
    }
  }


  const handleSubmit = async () => {
    if (!audioData || !prompt) {
      return
    }
  
    try {
      const pronunciationRequest: PronunciationAssessmentRequest = {
        assessmentId: assessmentId!,
        timestamp: new Date().toISOString(),
        duration: duration,
        difficulty_level: prompt.difficulty_level,
        audioBase64: audioData,
        targetPhonemes: prompt.target_phonemes,
        prompt_text: prompt.prompt_text
      }
  
      dispatch(submitAssessment({
        type: AssessmentType.Pronunciation,
        data: pronunciationRequest
      })).unwrap()
  
      router.push('/onboarding/assessment/vocabulary')
    } catch (error) {
      console.error('Failed to submit pronunciation assessment:', error)
    }
  }

  const handleRetry = () => {
    dispatch(resetRecording())
  }

  return (
    <AssessmentWrapper type={AssessmentType.Pronunciation} >
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

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isRecording && (
              <div className="text-center text-gray-600">
                Recording: {duration}s
              </div>
            )}
            
            {!audioData && (
              <button
                onClick={handleRecordingToggle}
                className={`px-4 py-2 rounded-full ${
                  isRecording ? 'bg-red-500' : 'bg-blue-500'
                } text-white`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            )}

            {audioData && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <audio controls className="flex-1">
                    <source src={audioUrl!} type="audio/webm" />
                  </audio>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Retry
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
                >
                  {loading ? 'Submitting...' : 'Submit Recording'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AssessmentWrapper>
  )
}