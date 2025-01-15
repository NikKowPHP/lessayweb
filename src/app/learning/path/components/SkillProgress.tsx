import { SkillType } from '@/lib/types/learningPath'
import { Card } from '@/components/ui/Card'
import { getSkillColor, getSkillIcon } from '@/lib/utils/skillColors'
import { Tooltip } from '@/components/ui/Tooltip'

interface SkillProgressProps {
  skill: SkillType
  currentLevel: number
  targetLevel: number
  criticalPoints: string[]
}

export function SkillProgress({
  skill,
  currentLevel,
  targetLevel,
  criticalPoints
}: SkillProgressProps) {
  const SkillIcon = getSkillIcon(skill)
  const skillColor = getSkillColor(skill)
  const progress = (currentLevel / targetLevel) * 100

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-${skillColor}-100 dark:bg-${skillColor}-900`}>
          <SkillIcon className={`w-6 h-6 text-${skillColor}-600 dark:text-${skillColor}-400`} />
        </div>
        <div>
          <h3 className="font-semibold capitalize">{skill}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(currentLevel * 100)}% → {Math.round(targetLevel * 100)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
        <div
          className={`absolute h-full bg-${skillColor}-500 rounded-full transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Critical Points */}
      <div className="mt-3">
        <h4 className="text-sm font-medium mb-2">Focus Areas:</h4>
        <div className="flex flex-wrap gap-2">
          {criticalPoints.map((point) => (
            <Tooltip key={point} content={point}>
              <span className={`
                px-2 py-1 text-xs rounded-full
                bg-${skillColor}-100 dark:bg-${skillColor}-900
                text-${skillColor}-700 dark:text-${skillColor}-300
              `}>
                {point}
              </span>
            </Tooltip>
          ))}
        </div>
      </div>
    </Card>
  )
}