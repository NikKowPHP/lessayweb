'use client'

import { useState } from 'react'
import YouTube from 'react-youtube'
import type { ComprehensionQuestion } from '@/lib/types/assessment'

interface Props {
  question: ComprehensionQuestion
  onSubmit: (answer: { selectedOption: string }) => void
}

export default function ComprehensionAssessment({ question, onSubmit }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleVideoEnd = () => {
    setHasWatchedVideo(true)
    setIsPlaying(false)
  }

  const handleVideoStateChange = (event: { target: any; data: number }) => {
    // YouTube state: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    setIsPlaying(event.data === 1)
  }

  const handleSubmit = () => {
    if (!selectedOption || !hasWatchedVideo) return
    onSubmit({ selectedOption })
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium text-gray-900 mb-4">
        {question.content}
      </div>

      {question.videoId && (
        <div className="aspect-w-16 aspect-h-9">
          <YouTube
            videoId={question.videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
            onEnd={handleVideoEnd}
            onStateChange={handleVideoStateChange}
            className="rounded-lg overflow-hidden"
          />
        </div>
      )}

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
              name="comprehension-answer"
              value={option}
              checked={selectedOption === option}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-3">{option}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        {!hasWatchedVideo && (
          <p className="text-sm text-amber-600">
            Please watch the video before answering
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || !hasWatchedVideo}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
