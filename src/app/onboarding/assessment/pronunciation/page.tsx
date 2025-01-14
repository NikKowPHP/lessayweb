'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import { submitAssessment } from '@/store/slices/onboardingSlice'
import { PronunciationAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import { RecordingHelper } from '@/lib/utils/recording'
import AssessmentLayout from '../layout'

export default function PronunciationAssessmentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { prompts, loading, assessmentId } = useAppSelector((state) => state.onboarding)
  const [recording, setRecording] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const recorderRef = useRef<RecordingHelper>(new RecordingHelper())
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const prompt = prompts[AssessmentType.Pronunciation]

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleRecordingToggle = async () => {
    try {
      if (!recording) {
        // Start recording
        await recorderRef.current.startRecording()
        setRecording(true)
        setError(null)
        
        // Start duration timer
        timerRef.current = setInterval(() => {
          const currentDuration = recorderRef.current.getCurrentDuration()
          setRecordingDuration(currentDuration)
        }, 1000)
      } else {
        // Stop recording
        const audioBlob = await recorderRef.current.stopRecording()
        const finalDuration = recorderRef.current.getFinalDuration()
        setAudioData(audioBlob)
        setRecordingDuration(finalDuration)
        setRecording(false)
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    } catch (error) {
      console.error('Recording error:', error)
      setError('Failed to access microphone. Please ensure microphone permissions are granted.')
      setRecording(false)
    }
  }

  const handleSubmit = async () => {
    if (!audioData || !prompt) {
      return
    }
  
    try {
      const base64Audio = await RecordingHelper.convertBlobToBase64(audioData)
      const pronunciationRequest: PronunciationAssessmentRequest = {
        assessmentId: assessmentId!,
        timestamp: new Date().toISOString(),
        duration: recordingDuration,
        difficulty_level: prompt.difficulty_level,
        audioBase64: base64Audio,
        targetPhonemes: prompt.target_phonemes,
        prompt_text: prompt.prompt_text
      }
  
      await dispatch(submitAssessment({
        type: AssessmentType.Pronunciation,
        data: pronunciationRequest
      })).unwrap()
  
      router.push('/onboarding/assessment/vocabulary')
    } catch (error) {
      console.error('Failed to submit pronunciation assessment:', error)
      setError('Failed to submit recording. Please try again.')
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

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {recording && (
              <div className="text-center text-gray-600">
                Recording: {recordingDuration}s
              </div>
            )}
            
            <button
              onClick={handleRecordingToggle}
              className={`px-4 py-2 rounded-full ${
                recording ? 'bg-red-500' : 'bg-blue-500'
              } text-white`}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>

            {audioData && (
              <audio controls className="w-full">
                <source src={URL.createObjectURL(audioData)} type="audio/webm" />
              </audio>
            )}

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