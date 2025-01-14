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
import AssessmentWrapper from '@/components/layout/AssessmentWrapper'
import Image from 'next/image'

type ResponseMode = 'text' | 'audio'

const ImageWrapper = ({ 
  imageUrl, 
  alt, 
  aspectRatio = 16/9  // default aspect ratio
}: { 
  imageUrl: string; 
  alt: string; 
  aspectRatio?: number;
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  return (
    <div 
      className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
    >
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
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className={`object-contain transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoadingComplete={() => setIsImageLoading(false)}
            onError={() => {
              console.error('Failed to load image:', imageUrl)
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
  )
}

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
  const [responseMode, setResponseMode] = useState<ResponseMode>('text')
  
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

  const handleModeToggle = () => {
    if (description || audioData) {
      if (!confirm('Changing mode will clear your current response. Continue?')) {
        return
      }
    }
    
    if (responseMode === 'audio') {
      dispatch(resetRecording())
    }
    setDescription('')
    setResponseMode(responseMode === 'text' ? 'audio' : 'text')
  }

  const handleSubmit = async () => {
    const hasValidResponse = responseMode === 'text' ? 
      description.trim().length >= 50 : 
      !!audioData

    if (!hasValidResponse || !prompt) {
      return
    }

    try {
      setIsSubmitting(true)

      const vocabularyRequest: VocabularyAssessmentRequest = {
        assessmentId: assessmentId!,
        timestamp: new Date().toISOString(),
        duration: responseMode === 'audio' ? duration : 0,
        difficulty_level: prompt.difficulty_level,
        topic: prompt.topic,
        image_url: prompt.image_url,
        userResponse: responseMode === 'text' ? [description.trim()] : [],
        expectedVocabulary: prompt.expected_vocabulary,
        audioBase64: responseMode === 'audio' ? audioData : null,
        responseMode
      }

      dispatch(submitAssessment({
        type: AssessmentType.Vocabulary,
        data: vocabularyRequest
      }))

      router.push('/onboarding/assessment/grammar')
    } catch (error) {
      console.error('Failed to submit vocabulary assessment:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <AssessmentWrapper type={AssessmentType.Vocabulary}>
      {prompt && (
        <div className="space-y-8">
          <div className="aspect-w-16 aspect-h-9 sm:aspect-h-7">
            <ImageWrapper 
              imageUrl={prompt.image_url} 
              alt={prompt.topic}
              aspectRatio={16/9}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Topic: {prompt.topic}</h2>
            {prompt.hints && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Hints:</h3>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {prompt.hints.map((hint: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600">
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-2 p-4">
              <button
                onClick={() => setResponseMode('text')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  responseMode === 'text' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Write Description
              </button>
              <button
                onClick={() => setResponseMode('audio')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  responseMode === 'audio' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Speak Description
              </button>
            </div>

            {responseMode === 'text' ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                placeholder="Write your description here..."
                disabled={isSubmitting}
              />
            ) : (
              <div className="p-4 bg-white rounded-lg border">
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
            )}

            <button
              onClick={handleSubmit}
              disabled={
                (responseMode === 'text' && !description.trim()) ||
                (responseMode === 'audio' && !audioData) ||
                isSubmitting
              }
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white 
                bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 
                disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>

            {responseMode === 'text' && (
              <div className="text-sm text-gray-500">
                Characters: {description.length}
                {description.length < 50 && description.length > 0 && (
                  <span className="text-yellow-600 ml-2">
                    (Minimum 50 characters recommended)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AssessmentWrapper>
  )
}