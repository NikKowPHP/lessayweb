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
  submitRecording,
  submitAllRecordings
} from '@/store/slices/exercisingSlice'
import { VideoPlayer } from '@/components/exercises/VideoPlayer'
import { PracticeSection } from '@/components/exercises/PracticeSection'
import { RecordingSection } from '@/components/exercises/RecordingSection'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { Icon } from '@iconify/react'
import { Toast } from '@/components/ui/Toast'

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
  const [recordings, setRecordings] = useState<Map<number, Blob>>(new Map())
  const [isComplete, setIsComplete] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null)

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

  const handleSegmentRecording = async (segmentIndex: number, recording: Blob) => {
    setRecordings(prev => new Map(prev).set(segmentIndex, recording))
    
    const allSegmentsRecorded = exercise.practiceMaterial.segments.every(
      (_, index) => recordings.has(index) || index === segmentIndex
    )
    setIsComplete(allSegmentsRecorded)

    // Advance to next segment if available
    const nextSegment = segmentIndex + 1
    if (nextSegment < exercise.practiceMaterial.segments.length) {
      setCurrentSegment(nextSegment)
      setToast({
        message: `Recording saved! Moving to segment ${nextSegment + 1}`,
        type: 'success'
      })
    } else if (allSegmentsRecorded) {
      setToast({
        message: 'All segments recorded! You can now submit your practice.',
        type: 'info'
      })
      const submitButton = document.querySelector('#submit-all-button')
      submitButton?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    // Clear toast after 3 seconds
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmitAll = async () => {
    try {
      const recordingPromises = Array.from(recordings.entries()).map(
        async ([segmentIndex, blob]) => {
          const base64Audio = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(',')[1]
              resolve(base64)
            }
            reader.readAsDataURL(blob)
          })

          return {
            segmentIndex,
            audioData: base64Audio,
            timestamp: new Date().toISOString(),
            duration: blob.size,
            exerciseId: exercise.id,
          }
        }
      )

      const recordingsData = await Promise.all(recordingPromises)
      
      await dispatch(submitAllRecordings({
        exerciseId: exercise.id,
        recordings: recordingsData
      })).unwrap()
      
      // Clear recordings after successful submission
      setRecordings(new Map())
      setIsComplete(false)
    } catch (error) {
      console.error('Failed to submit recordings:', error)
    }
  }

  return (
    <div className="space-y-8 relative">
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
        <>
          <PracticeSection
            material={exercise.practiceMaterial}
            currentSegment={currentSegment}
            onSegmentChange={handleSegmentChange}
            recordings={recordings}
          />

          <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Record Your Practice
            </h2>
            
            <div className="space-y-4">
              {/* Current segment recording section */}
              <RecordingSection
                exerciseId={exercise.id}
                settings={exercise.settings}
                onSubmit={(recording) => handleSegmentRecording(currentSegment, recording)}
                currentSegment={currentSegment}
                hasRecording={recordings.has(currentSegment)}
              />

              {/* Progress indicator */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Recording Progress</h3>
                <div className="mt-2 flex gap-2">
                  {exercise.practiceMaterial.segments.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-full rounded ${
                        recordings.has(index) 
                          ? 'bg-green-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit all button */}
              <button
                id="submit-all-button"
                onClick={handleSubmitAll}
                disabled={!isComplete}
                className={`mt-4 w-full rounded-md px-4 py-2 text-white
                  ${isComplete 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                Submit All Recordings
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}