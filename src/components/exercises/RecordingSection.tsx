'use client'

import { useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setIsRecording, selectIsRecording } from '@/store/slices/exercisingSlice'
import { Icon } from '@iconify/react'

interface RecordingSectionProps {
  exerciseId: string
  settings: {
    minRecordingDuration: number
    maxRecordingDuration: number
    allowSegmentRecording?: boolean
  }
  onSubmit: (recording: Blob) => Promise<void>
  currentSegment?: number
}

export function RecordingSection({
  exerciseId,
  settings,
  onSubmit,
  currentSegment,
}: RecordingSectionProps) {
  const dispatch = useAppDispatch()
  const isRecording = useAppSelector(selectIsRecording)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await onSubmit(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      dispatch(setIsRecording(true))
      setError(null)

      // Start duration timer
      let seconds = 0
      timerRef.current = setInterval(() => {
        seconds++
        setDuration(seconds)
        if (seconds >= settings.maxRecordingDuration) {
          stopRecording()
        }
      }, 1000)
    } catch (err) {
      setError('Failed to access microphone')
      console.error('Failed to start recording:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      dispatch(setIsRecording(false))
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setDuration(0)
    }
  }

  return (
    <section className="mt-8">
      <div className="rounded-lg bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isRecording ? 'Recording...' : 'Ready to Record'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {settings.allowSegmentRecording && currentSegment !== undefined
                ? `Recording segment ${currentSegment + 1}`
                : 'Recording full practice text'}
            </p>
          </div>

          {/* Recording controls */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {duration}s / {settings.maxRecordingDuration}s
            </div>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-full p-4 ${
                isRecording
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              <Icon
                icon={isRecording ? 'mdi:stop' : 'mdi:microphone'}
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <Icon icon="mdi:alert" className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recording guidelines */}
        <div className="mt-4 text-sm text-gray-500">
          <ul className="list-inside list-disc space-y-1">
            <li>Speak clearly and at a natural pace</li>
            <li>
              Minimum duration: {settings.minRecordingDuration} seconds
            </li>
            <li>
              Maximum duration: {settings.maxRecordingDuration} seconds
            </li>
            {settings.allowSegmentRecording && (
              <li>You can record each segment separately</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}