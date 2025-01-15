import { Challenge, SkillType } from '@/lib/types/learningPath'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LockClosedIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { getSkillColor } from '@/lib/utils/skillColors'

interface ChallengeCardProps {
  challenge: Challenge
  skillLevels: Record<SkillType, number>
}

export function ChallengeCard({ challenge, skillLevels }: ChallengeCardProps) {
  const isLocked = challenge.status === 'locked'
  const missingSkills = Object.entries(challenge.prerequisites.minSkillLevels)
    .filter(([skill, required]) => skillLevels[skill as SkillType] < required)

  return (
    <Card className={`
      relative overflow-hidden
      ${isLocked ? 'opacity-75' : 'cursor-pointer hover:shadow-lg transition-shadow'}
    `}>
      {/* Challenge Type Badge */}
      <div className="absolute top-4 right-4">
        <Badge
          color={challenge.type === 'critical' ? 'red' : 'blue'}
          size="lg"
        >
          {challenge.type}
        </Badge>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {challenge.description}
        </p>

        {/* Required Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(challenge.prerequisites.minSkillLevels).map(([skill, level]) => {
              const currentLevel = skillLevels[skill as SkillType]
              const isMet = currentLevel >= level
              const skillColor = getSkillColor(skill as SkillType)

              return (
                <div
                  key={skill}
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${isMet 
                      ? `bg-${skillColor}-100 text-${skillColor}-700 dark:bg-${skillColor}-900 dark:text-${skillColor}-300`
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }
                  `}
                >
                  {skill}: {Math.round(currentLevel * 100)}% / {Math.round(level * 100)}%
                </div>
              )
            })}
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">{challenge.rewards.xp} XP</span>
          </div>
          {Object.entries(challenge.rewards.skillPoints).map(([skill, points]) => (
            <div
              key={skill}
              className={`text-sm text-${getSkillColor(skill as SkillType)}-600`}
            >
              +{points} {skill}
            </div>
          ))}
        </div>

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-4">
              <LockClosedIcon className="w-8 h-8 text-white mx-auto mb-2" />
              <h4 className="text-white font-medium mb-2">Challenge Locked</h4>
              <ul className="text-sm text-white/80">
                {missingSkills.map(([skill, required]) => (
                  <li key={skill}>
                    Need {Math.round(required * 100)}% in {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}