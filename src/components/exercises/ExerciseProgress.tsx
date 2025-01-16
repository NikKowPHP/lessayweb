'use client'

import { useAppSelector } from '@/store/hooks'
import { 
  selectCurrentExercise,
  selectVideoProgress,
  selectResults
} from '@/store/slices/exercisingSlice'
import { Icon } from '@iconify/react'

export function ExerciseProgress() {
  const currentExercise = useAppSelector(selectCurrentExercise)
  const videoProgress = useAppSelector(selectVideoProgress)
  const results = useAppSelector(selectResults)

  if (!currentExercise) {
    return null
  }

  const steps = [
    {
      id: 'video',
      label: 'Watch Video',
      icon: 'mdi:play-circle',
      isCompleted: videoProgress.hasWatched,
      isCurrent: !videoProgress.hasWatched,
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: 'mdi:microphone',
      isCompleted: !!results,
      isCurrent: videoProgress.hasWatched && !results,
      isDisabled: !videoProgress.hasWatched,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: 'mdi:chart-line',
      isCompleted: false,
      isCurrent: !!results,
      isDisabled: !results,
    },
  ]

  return (
    <div className="mt-4">
      {/* Progress bar */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="h-0.5 w-full bg-gray-200">
            <div
              className="h-0.5 bg-primary transition-all duration-500"
              style={{
                width: `${
                  (steps.filter(step => step.isCompleted).length /
                    (steps.length - 1)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.isDisabled ? 'opacity-50' : ''
              }`}
            >
              {/* Step indicator */}
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full
                  ${
                    step.isCompleted
                      ? 'bg-primary text-white'
                      : step.isCurrent
                      ? 'border-2 border-primary bg-white text-primary'
                      : 'border-2 border-gray-300 bg-white text-gray-500'
                  }
                `}
              >
                <Icon icon={step.icon} className="h-4 w-4" />
              </div>

              {/* Step label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    step.isCurrent ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {step.isCurrent && (
                  <p className="mt-1 text-xs text-gray-500">
                    {step.id === 'video'
                      ? 'Watch the lesson'
                      : step.id === 'practice'
                      ? 'Record your pronunciation'
                      : 'Review your results'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Focus areas */}
      <div className="mt-4 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-500">Focus Areas:</span>
        <div className="flex flex-wrap gap-2">
          {currentExercise.focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}