'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectCurrentExercise,
  selectIsProcessing,
  selectVideoProgress,
  selectError,
  startExercise,
  setVideoProgress,
  submitRecording
} from '@/store/slices/exercisingSlice'
import { VideoPlayer } from '@/components/exercises/VideoPlayer'
import { PracticeSection } from '@/components/exercises/PracticeSection'
import { RecordingSection } from '@/components/exercises/RecordingSection'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { Icon } from '@iconify/react'

export default function PronunciationExercisePage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const exercise = useAppSelector(selectCurrentExercise)
  const isProcessing = useAppSelector(selectIsProcessing)
  const videoProgress = useAppSelector(selectVideoProgress)
  const error = useAppSelector(selectError)
  const [currentSegment, setCurrentSegment] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  useEffect(() => {
    if (id && !exercise) {
      dispatch(startExercise(id as string))
    }
  }, [id, exercise, dispatch])

  if (isProcessing) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return <ErrorAlert title="Error" message={error} />
  }

  if (!exercise) {
    return <ErrorAlert title="Error" message="Exercise not found" />
  }

  const handleVideoProgress = (time: number) => {
    dispatch(setVideoProgress(time))
  }

  const handleSegmentChange = (index: number) => {
    setCurrentSegment(index)
  }

  const handleRecordingSubmit = async (recording: Blob) => {
    try {
      // Convert Blob to base64
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve(base64)
        }
        reader.readAsDataURL(recording)
      })

      await dispatch(submitRecording({
        timestamp: new Date().toISOString(),
        audioData: base64Audio, // Send base64 string instead of Blob
        duration: recording.size,
        exerciseId: exercise.id,
        segmentIndex: currentSegment
      })).unwrap()
    } catch (error) {
      console.error('Failed to submit recording:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Exercise Header */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exercise.title}</h1>
            <p className="mt-2 text-gray-600">{exercise.description}</p>
          </div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:clock-outline" />
              <span>{exercise.estimatedDuration}</span>
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <Icon icon="mdi:chart-line" />
              <span>{exercise.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Video Lesson</h2>
        <div className="space-y-4">
          <VideoPlayer
            video={exercise.video}
            onProgress={handleVideoProgress}
            playbackSpeed={playbackSpeed}
          />

          {/* Video Controls */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Playback Speed */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="rounded border px-2 py-1"
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <option key={speed} value={speed}>
                      {speed}x
                    </option>
                  ))}
                </select>
              </div>

              {/* Transcript Toggle */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <Icon
                  icon={showTranscript ? "mdi:text-box-minus" : "mdi:text-box-plus"}
                />
                <span>Transcript</span>
              </button>
            </div>
          </div>

          {/* Transcript Panel */}
          {showTranscript && (
            <div className="max-h-60 overflow-y-auto rounded-lg bg-gray-50 p-4">
              <div className="space-y-2">
                {exercise.video.transcript.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-800">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Practice Section - Only show after video is watched */}
      {videoProgress.hasWatched && (
        <PracticeSection
          material={exercise.practiceMaterial}
          currentSegment={currentSegment}
          onSegmentChange={handleSegmentChange}
        />
      )}

      {/* Recording Section - Only show after practice is available */}
      {videoProgress.hasWatched && (
        <RecordingSection
          exerciseId={exercise.id}
          settings={exercise.settings}
          onSubmit={handleRecordingSubmit}
          currentSegment={currentSegment}
        />
      )}
    </div>
  )
}