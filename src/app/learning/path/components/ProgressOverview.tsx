import { SkillType } from '@/lib/types/learningPath'
import { Card } from '@/components/ui/Card'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { FireIcon, TrophyIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface ProgressOverviewProps {
  overall: number
  bySkill: Record<SkillType, number>
  exercises: {
    completed: number
    total: number
    recent: string[]
  }
  streak: {
    current: number
    lastActivity: string
    bestStreak: number
  }
}

export function ProgressOverview({
  overall,
  bySkill,
  exercises,
  streak
}: ProgressOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Progress */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
        <div className="flex justify-center">
          <CircularProgress
            value={overall}
            size={120}
            strokeWidth={10}
            label={`${Math.round(overall)}%`}
          />
        </div>
      </Card>

      {/* Exercise Completion */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Exercises</h3>
        <div className="flex items-center justify-between mb-2">
          <span>Completed</span>
          <span className="font-medium">{exercises.completed}/{exercises.total}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${(exercises.completed / exercises.total) * 100}%` }}
          />
        </div>
      </Card>

      {/* Streak */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Learning Streak</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak.current}</div>
            <div className="text-sm text-gray-500">Current</div>
          </div>
          <div className="text-center">
            <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak.bestStreak}</div>
            <div className="text-sm text-gray-500">Best</div>
          </div>
        </div>
      </Card>

      {/* Last Activity */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Last Activity</h3>
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-gray-500" />
          <div>
            <div className="font-medium">
              {new Date(streak.lastActivity).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(streak.lastActivity).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}