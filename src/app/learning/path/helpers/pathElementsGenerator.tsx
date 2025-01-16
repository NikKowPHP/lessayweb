import { ReactNode } from 'react'
import { 
  LearningPath, 
  Exercise, 
  Challenge, 
  Assessment,
  SkillType 
} from '@/lib/types/learningPath'
import { getSkillColor } from '@/lib/utils/skillColors'
import { 
  ClipboardCheck, 
  Brain,
  Trophy,
  LucideProps
} from 'lucide-react'

interface TimelineElement {
  id: string
  type: 'assessment' | 'exercise' | 'challenge'
  contentStyle: React.CSSProperties
  contentArrowStyle: React.CSSProperties
  iconStyle: React.CSSProperties
  icon: ReactNode
  data: any
  item?: Exercise | Challenge | Assessment
}

const IconWrapper = ({ icon: Icon }: { icon: React.ComponentType<LucideProps> }) => (
  <div className="flex items-center justify-center w-full h-full">
    <Icon size={24} />
  </div>
)

function findItemData(id: string, type: 'exercise' | 'challenge' | 'assessment'): Exercise | Challenge | Assessment | undefined {
  return undefined
}

function getIconForType(type: 'exercise' | 'challenge' | 'assessment'): ReactNode {
  switch (type) {
    case 'assessment':
      return <IconWrapper icon={ClipboardCheck} />
    case 'exercise':
      return <IconWrapper icon={Brain} />
    case 'challenge':
      return <IconWrapper icon={Trophy} />
  }
}

export function generateTimelineElements(path: LearningPath): TimelineElement[] {
  const elements: TimelineElement[] = []

  const assessmentElement: TimelineElement = {
    id: 'assessment',
    type: 'assessment',
    contentStyle: { 
      background: '#1e293b',
      color: '#fff'
    },
    contentArrowStyle: { 
      borderRight: '7px solid #1e293b' 
    },
    iconStyle: { 
      background: '#1e293b',
      color: '#fff'
    },
    icon: <IconWrapper icon={ClipboardCheck} />,
    data: {
      label: 'Initial Assessment',
      type: 'assessment',
      status: 'completed',
      skills: Object.keys(path.skills) as SkillType[],
      skillProgress: path.skills
    }
  }
  elements.push(assessmentElement)

  // Add available exercises
  path.progression.availableNodeIds.forEach(nodeId => {
    const node = path.progression.nodes[nodeId]
    if (!node) return
    const exercise = findItemData(nodeId, node.type)
    if (!exercise) return

    const skillColor = getSkillColor(exercise.type as SkillType)
    elements.push({
      id: nodeId,
      type: node.type,
      contentStyle: { 
        background: skillColor,
        color: '#fff'
      },
      contentArrowStyle: { 
        borderRight: `7px solid ${skillColor}` 
      },
      iconStyle: { 
        background: skillColor,
        color: '#fff'
      },
      icon: getIconForType(node.type),
      data: {
        label: exercise.title,
        type: node.type,
        status: exercise.status,
        skills: [exercise.type],
        description: exercise.description
      },
      item: exercise
    })
  })

  // Add challenges
  path.challenges.current.forEach(challenge => {
    const mainSkill = challenge.skills[0]
    const skillColor = getSkillColor(mainSkill)
    elements.push({
      id: challenge.id,
      type: 'challenge',
      contentStyle: { 
        background: skillColor,
        color: '#fff'
      },
      contentArrowStyle: { 
        borderRight: `7px solid ${skillColor}` 
      },
      iconStyle: { 
        background: skillColor,
        color: '#fff'
      },
      icon: <IconWrapper icon={Trophy} />,
      data: {
        label: challenge.title,
        type: 'challenge',
        status: challenge.status,
        skills: challenge.skills,
        description: challenge.description
      },
      item: challenge
    })
  })

  return elements
}