import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Badge } from '@/components/ui/Badge'
import { getSkillColor, getSkillIcon } from '@/lib/utils/skillColors'
import { cn } from '@/lib/utils/cn'
import { SkillType } from '@/lib/types/learningPath'

interface PathNodeProps {
  data: {
    label: string
    type: 'exercise' | 'challenge' | 'assessment'
    status: 'locked' | 'available' | 'in_progress' | 'completed'
    skills: SkillType[]
    skillProgress?: Record<SkillType, {
      currentLevel: number
      targetLevel: number
      progress: number
      criticalPoints?: string[]
    }>
  }
}

const ProgressBar = ({ 
  skill, 
  progress, 
  currentLevel, 
  targetLevel,
  criticalPoints 
}: {
  skill: SkillType
  progress: number
  currentLevel: number
  targetLevel: number
  criticalPoints?: string[]
}) => {
  const color = getSkillColor(skill)
  const SkillIcon = getSkillIcon(skill)
  
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-1">
          <SkillIcon className="w-3 h-3" />
          <span>{skill}</span>
        </div>
        <span>{Math.round(currentLevel * 100)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            `bg-${color}-500 dark:bg-${color}-400`
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {criticalPoints && criticalPoints.length > 0 && (
        <div className="mt-1">
          <div className="text-xs text-gray-300 italic">
            Focus areas:
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {criticalPoints.map((point) => (
              <span 
                key={point}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  `bg-${color}-500/20 text-${color}-200`
                )}
              >
                {point.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const PathNode = memo(({ data }: PathNodeProps) => {
  const statusColors = {
    locked: 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed',
    available: 'bg-blue-500 dark:bg-blue-400 cursor-pointer',
    in_progress: 'bg-blue-500 dark:bg-blue-400 cursor-pointer',
    completed: 'bg-green-500 dark:bg-green-400 cursor-pointer'
  }

  return (
    <div className={cn(
      'px-4 py-3 rounded-lg shadow-md',
      data.type === 'assessment' ? 'w-[400px]' : 'w-[200px]',
      'border-2 transition-all duration-200',
      data.status === 'locked' ? 'opacity-50' : 'hover:scale-105',
      statusColors[data.status]
    )}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-gray-400 dark:!bg-gray-600"
      />
      
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-sm text-white">
          {data.label}
        </h3>
        
        {data.type === 'assessment' && data.skillProgress ? (
          <div className="flex flex-col gap-4">
            {Object.entries(data.skillProgress).map(([skill, progress]) => (
              <ProgressBar
                key={skill}
                skill={skill as SkillType}
                progress={progress.progress}
                currentLevel={progress.currentLevel}
                targetLevel={progress.targetLevel}
                criticalPoints={progress.criticalPoints}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {data.skills.map(skill => {
              const SkillIcon = getSkillIcon(skill)
              const color = getSkillColor(skill)
              return (
                <Badge
                  key={skill}
                  color={color}
                  size="sm"
                  variant="soft"
                  icon={<SkillIcon className="w-3 h-3" />}
                >
                  {skill}
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom}
        className="!bg-gray-400 dark:!bg-gray-600" 
      />
    </div>
  )
})

PathNode.displayName = 'PathNode'