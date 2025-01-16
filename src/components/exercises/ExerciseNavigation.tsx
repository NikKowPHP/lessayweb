'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { 
  selectCurrentExercise, 
  selectAvailableExercises 
} from '@/store/slices/exercisingSlice'
import { Icon } from '@iconify/react'

export function ExerciseNavigation() {
  const router = useRouter()
  const currentExercise = useAppSelector(selectCurrentExercise)
  const availableExercises = useAppSelector(selectAvailableExercises)

  const currentIndex = currentExercise 
    ? availableExercises.findIndex(ex => ex.id === currentExercise.id)
    : -1

  const prevExercise = currentIndex > 0 ? availableExercises[currentIndex - 1] : null
  const nextExercise = currentIndex < availableExercises.length - 1 
    ? availableExercises[currentIndex + 1] 
    : null

  return (
    <nav className="flex items-center justify-between py-2">
      {/* Back to exercises list */}
      <button
        onClick={() => router.push('/exercises')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <Icon icon="mdi:arrow-left" className="h-5 w-5" />
        <span>All Exercises</span>
      </button>

      {/* Navigation controls */}
      <div className="flex items-center space-x-4">
        {/* Previous exercise */}
        {prevExercise && (
          <button
            onClick={() => router.push(`/exercises/${prevExercise.id}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Icon icon="mdi:chevron-left" className="h-5 w-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>
        )}

        {/* Current exercise info */}
        {currentExercise && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">
              Exercise {currentIndex + 1} of {availableExercises.length}
            </span>
            <div className="flex items-center space-x-1">
              <Icon 
                icon={`mdi:${currentExercise.type}`} 
                className="h-4 w-4 text-primary" 
              />
              <span className="text-sm font-medium text-gray-900">
                {currentExercise.difficulty}
              </span>
            </div>
          </div>
        )}

        {/* Next exercise */}
        {nextExercise && (
          <button
            onClick={() => router.push(`/exercises/${nextExercise.id}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <span className="hidden sm:inline">Next</span>
            <Icon icon="mdi:chevron-right" className="h-5 w-5" />
          </button>
        )}
      </div>
    </nav>
  )
}