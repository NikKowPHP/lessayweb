'use client'

import { useState } from 'react'
import { PracticeMaterial, PracticeSegment, RecordingAttempt } from '@/lib/types/exercises'
import { Icon } from '@iconify/react'

interface PracticeSectionProps {
  material: PracticeMaterial
  currentSegment: number
  onSegmentChange: (index: number) => void
  recordings: Map<number, Blob>
}

export function PracticeSection({
  material,
  currentSegment,
  onSegmentChange,
  recordings
}: PracticeSectionProps) {
  const [showPhonetics, setShowPhonetics] = useState(
    material.displayOptions?.showPhonetics ?? true
  )
  const [showTranslation, setShowTranslation] = useState(
    material.displayOptions?.showTranslation ?? false
  )
  const [showNotes, setShowNotes] = useState(
    material.displayOptions?.showNotes ?? false
  )

  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Practice</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPhonetics(!showPhonetics)}
            className={`flex items-center space-x-2 text-sm ${
              showPhonetics ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Icon icon="mdi:phonetic" />
            <span>Phonetics</span>
          </button>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex items-center space-x-2 text-sm ${
              showTranslation ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Icon icon="mdi:translate" />
            <span>Translation</span>
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center space-x-2 text-sm ${
              showNotes ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Icon icon="mdi:note" />
            <span>Notes</span>
          </button>
        </div>
      </div>

      {/* Complete text preview */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-gray-700">{material.text}</p>
      </div>

      {/* Segments with recording status */}
      <div className="space-y-4">
        {material.segments.map((segment, index) => (
          <div
            key={index}
            className={`rounded-lg border p-4 transition-all ${
              currentSegment === index
                ? 'border-primary bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            }`}
            onClick={() => onSegmentChange(index)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-lg text-gray-900">{segment.text}</p>
                {showPhonetics && (
                  <p className="font-mono text-sm text-gray-600">
                    {segment.phonetic}
                  </p>
                )}
                {showTranslation && segment.translation && (
                  <p className="text-sm text-gray-600">{segment.translation}</p>
                )}
                {showNotes && segment.notes && (
                  <p className="text-sm text-gray-500">{segment.notes}</p>
                )}
              </div>
              
              {/* Recording status indicator */}
              <div className="ml-4 flex items-center space-x-2">
                {recordings.has(index) ? (
                  <span className="flex items-center text-green-600">
                    <Icon icon="mdi:check-circle" className="mr-1 h-5 w-5" />
                    Recorded
                  </span>
                ) : (
                  <span className="flex items-center text-gray-400">
                    <Icon icon="mdi:microphone-off" className="mr-1 h-5 w-5" />
                    Not recorded
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}