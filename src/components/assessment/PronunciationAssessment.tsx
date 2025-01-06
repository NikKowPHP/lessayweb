'use client'

import { useState, useEffect } from 'react'
import { useRecording } from '@/hooks/useRecording'
import type { AssessmentQuestion } from '@/store/slices/onboardingSlice'

interface Props {
  question: AssessmentQuestion
  onSubmit: (answer: { audioBlob: Blob }) => void
}

export default function PronunciationAssessment({ question, onSubmit }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecording()

  const handlePlayExample = async () => {
    if (!question.audioUrl || isPlaying) return

    setIsPlaying(true)
    const audio = new Audio(question.audioUrl)
    audio.onended = () => setIsPlaying(false)
    await audio.play()
  }

  const handleSubmit = async () => {
    if (!audioBlob) return
    onSubmit({ audioBlob })
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium text-gray-900">
        {question.content}
      </div>

      {question.audioUrl && (
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayExample}
            disabled={isPlaying}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
          >
            {isPlaying ? 'Playing...' : 'Listen to Example'}
          </button>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full ${
            isRecording
              ? 'text-white bg-red-600 hover:bg-red-700'
              : 'text-white bg-primary hover:bg-primary-dark'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        {audioBlob && (
          <div className="space-y-4">
            <audio src={URL.createObjectURL(audioBlob)} controls />
            <div className="flex space-x-4">
              <button
                onClick={resetRecording}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Record Again
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
