'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import { submitAssessment } from '@/store/slices/onboardingSlice'
import { VocabularyAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import { 
  startRecording, 
  stopRecording, 
  resetRecording, 
  selectRecordingState 
} from '@/store/slices/recordingSlice'
import AssessmentLayout from '../layout'
import Image from 'next/image'

export default function VocabularyAssessmentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { prompts, assessmentId } = useAppSelector((state) => state.onboarding)
  const { 
    isRecording, 
    audioData, 
    audioUrl, 
    duration, 
    error: recordingError 
  } = useAppSelector(selectRecordingState)
  
  const [imageError, setImageError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const prompt = prompts[AssessmentType.Vocabulary]

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

  const handleRetry = () => {
    dispatch(resetRecording())
  }

  const handleSubmit = async () => {
    if (!description.trim() || !prompt || !audioData) {
      return
    }

    try {
      setIsSubmitting(true)

      const vocabularyRequest: VocabularyAssessmentRequest = {
        assessmentId: assessmentId!,
        timestamp: new Date().toISOString(),
        duration,
        difficulty_level: prompt.difficulty_level,
        topic: prompt.topic,
        image_url: prompt.image_url,
        userResponse: [description.trim()],
        expectedVocabulary: prompt.expected_vocabulary,
        audioBase64: audioData
      }

      // Dispatch submission in background
      dispatch(submitAssessment({
        type: AssessmentType.Vocabulary,
        data: vocabularyRequest
      }))

      // Immediately navigate to next assessment
      router.push('/onboarding/assessment/grammar')
    } catch (error) {
      console.error('Failed to submit vocabulary assessment:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <AssessmentLayout type={AssessmentType.Vocabulary} onSubmit={handleSubmit}>
      {prompt && (
        <div className="space-y-4">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {!imageError ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                )}
                <Image
                  src={prompt.image_url}
                  alt={prompt.topic}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className={`object-cover rounded-lg transition-opacity duration-300 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoadingComplete={() => setIsImageLoading(false)}
                  onError={() => {
                    console.error('Failed to load image:', prompt.image_url)
                    setImageError(true)
                    setIsImageLoading(false)
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-center p-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Failed to load image
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Topic: {prompt.topic}</p>
            {prompt.hints && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Hints:</p>
                <ul className="list-disc list-inside">
                  {prompt.hints.map((hint: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-sm font-medium mb-3">Record your description:</p>
              
              {isRecording && (
                <div className="text-center text-gray-600 mb-3">
                  Recording: {duration}s
                </div>
              )}
              
              {!audioData ? (
                <button
                  onClick={handleRecordingToggle}
                  className={`w-full px-4 py-2 rounded-full ${
                    isRecording ? 'bg-red-500' : 'bg-blue-500'
                  } text-white hover:opacity-90 transition-opacity`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              ) : (
                <div className="space-y-3">
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
                </div>
              )}

              {recordingError && (
                <p className="mt-2 text-sm text-red-600">{recordingError}</p>
              )}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="Write your description here..."
              disabled={isSubmitting}
            />

            <button
              onClick={handleSubmit}
              disabled={!description.trim() || !audioData || isSubmitting}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white 
                bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 
                disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Assessment'
              )}
            </button>

            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Text description: {description.length} characters</span>
                {description.length < 50 && description.length > 0 && (
                  <span className="text-yellow-600">
                    (Minimum 50 characters recommended)
                  </span>
                )}
              </div>
              {!audioData && (
                <div className="text-yellow-600">
                  Audio recording required
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AssessmentLayout>
  )
}