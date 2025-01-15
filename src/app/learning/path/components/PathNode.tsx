import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Badge } from '@/components/ui/Badge'
import { getSkillColor, getSkillIcon } from '@/lib/utils/skillColors'
import { cn } from '@/lib/utils/cn'
import { SkillType, Exercise, Challenge } from '@/lib/types/learningPath'

interface PathNodeProps {
  data: {
    label: string
    type: 'exercise' | 'challenge'
    status: 'locked' | 'available' | 'in_progress' | 'completed'
    skills: SkillType[]
    exercise: Exercise | Challenge
  }
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
      'px-4 py-3 rounded-lg shadow-md w-64',
      'border-2 transition-all duration-200',
      data.status === 'locked' ? 'opacity-50' : 'hover:scale-105',
      statusColors[data.status]
    )}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-gray-400 dark:!bg-gray-600"
      />
      
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-white">
          {data.label}
        </h3>
        
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