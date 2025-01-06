'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRecording } from '@/hooks/useRecording'
import type { AssessmentQuestion } from '@/store/slices/onboardingSlice'

interface Props {
  question: AssessmentQuestion & {
    imageUrl: string
    options?: string[]
  }
  onSubmit: (answer: { audioBlob?: Blob; selectedOption?: string }) => void
}

export default function VocabularyAssessment({ question, onSubmit }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecording()

  const handleSubmit = () => {
    if (question.options) {
      // Multiple choice mode
      if (!selectedOption) return
      onSubmit({ selectedOption })
    } else {
      // Recording mode
      if (!audioBlob) return
      onSubmit({ audioBlob })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium text-gray-900 mb-4">
        {question.content}
      </div>

      <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
        <Image
          src={question.imageUrl}
          alt="Vocabulary assessment image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {question.options ? (
        // Multiple choice mode
        <div className="mt-6 space-y-4">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === option
                  ? 'border-primary-dark bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="vocabulary-answer"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-3">{option}</span>
            </label>
          ))}
        </div>
      ) : (
        // Recording mode
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
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Record Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={!(audioBlob || selectedOption)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
