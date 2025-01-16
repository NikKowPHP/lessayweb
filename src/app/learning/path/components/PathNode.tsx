import { memo } from 'react'
import { Badge } from '@/components/ui/Badge'
import { getSkillColor, getSkillIcon } from '@/lib/utils/skillColors'
import { cn } from '@/lib/utils/cn'
import { SkillType } from '@/lib/types/learningPath'
import { LucideProps } from 'lucide-react'

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
    description?: string
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

const SkillIconWrapper = ({ icon: Icon }: { icon: React.ComponentType<LucideProps> }) => (
  <Icon size={16} className="mr-1" />
)

export const PathNode = memo(({ data }: PathNodeProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="vertical-timeline-element-title font-semibold">
        {data.label}
      </h3>
      {data.description && (
        <p className="vertical-timeline-element-subtitle text-sm opacity-90">
          {data.description}
        </p>
      )}
      
      {data.type === 'assessment' && data.skillProgress ? (
        <div className="flex flex-col gap-4">
          {Object.entries(data.skillProgress).map(([skill, progress]) => (
            <ProgressBar
              key={skill}
              skill={skill as SkillType}
              progress={progress.progress || 0}
              currentLevel={progress.currentLevel}
              targetLevel={progress.targetLevel}
              criticalPoints={progress.criticalPoints}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.skills && data.skills.map(skill => {
            const Icon = getSkillIcon(skill)
            return (
              <Badge
                key={skill}
                color={getSkillColor(skill)}
                size="sm"
                variant="soft"
                icon={<SkillIconWrapper icon={Icon} />}
              >
                {skill}
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
})

PathNode.displayName = 'PathNode'