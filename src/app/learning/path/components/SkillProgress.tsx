import { Exercise, SkillType } from '@/lib/types/learningPath'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { BookmarkIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { getSkillColor } from '@/lib/utils/skillColors'

interface ExerciseCardProps {
  exercise: Exercise
  isBookmarked: boolean
  isActive: boolean
  onSelect: () => void
  onBookmark: () => void
}

export function ExerciseCard({
  exercise,
  isBookmarked,
  isActive,
  onSelect,
  onBookmark
}: ExerciseCardProps) {
  const skillColor = getSkillColor(exercise.type)
  
  return (
    <Card
      onClick={onSelect}
      className={`
        relative cursor-pointer transition-all
        hover:shadow-lg hover:scale-102
        ${isActive ? 'ring-2 ring-primary' : ''}
      `}
    >
      {/* Status indicator */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onBookmark()
          }}
          className={`
            p-1 rounded-full transition-colors
            ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
            hover:text-yellow-500
          `}
        >
          <BookmarkIcon className="w-5 h-5" />
        </button>
        {exercise.status === 'completed' && (
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge color={skillColor}>{exercise.type}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="w-4 h-4 mr-1" />
            {exercise.estimatedDuration}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {exercise.description}
        </p>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-2">
          {exercise.focusAreas.map(area => (
            <Badge key={area} variant="outline" size="sm">
              {area}
            </Badge>
          ))}
        </div>

        {/* Progress indicator if in progress */}
        {exercise.metrics && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{exercise.metrics.completedAttempts} / {exercise.completionCriteria.requiredAttempts}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${(exercise.metrics.completedAttempts / exercise.completionCriteria.requiredAttempts) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}