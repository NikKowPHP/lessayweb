import { ReactNode } from 'react'
import { 
  LearningPath, 
  Exercise, 
  Challenge, 
  Assessment,
  SkillType, 
  ExerciseStatus
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
  <div className="flex items-center justify-center w-full h-full" style={{ transform: 'none' }}>
    <Icon 
      size={24} 
      className="stroke-current !m-0 !static"
      strokeWidth={1.5}
      style={{ 
        position: 'static',
        transform: 'none',
        margin: 0,
        left: 'auto',
        top: 'auto'
      }}
    />
  </div>
)

function findItemData(id: string, type: 'exercise' | 'challenge' | 'assessment', path: LearningPath): Exercise | Challenge | Assessment | undefined {
  switch (type) {
    case 'exercise':
      return [...path.exercises.critical, ...path.exercises.recommended, ...path.exercises.practice]
        .find(ex => ex.id === id)
    case 'challenge':
      return [...path.challenges.current, ...path.challenges.upcoming]
        .find(ch => ch.id === id)
    default:
      return undefined
  }
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

  const commonIconStyle: React.CSSProperties = {
    background: '#1e293b',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'none'
  }

  // Add assessment element first
  const assessmentElement: TimelineElement = {
    id: 'assessment',
    type: 'assessment',
    contentStyle: { 
      background: '#1e293b',
      color: '#fff',
      marginBottom: '3rem'
    },
    contentArrowStyle: { 
      borderRight: '7px solid #1e293b' 
    },
    iconStyle: commonIconStyle,
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

  // Function to check if a node is available based on requirements
  const isNodeAvailable = (nodeId: string): boolean => {
    // Check if it's in availableNodeIds
    if (path.progression.availableNodeIds.includes(nodeId)) {
      return true
    }

    const node = path.progression.nodes[nodeId]
    if (!node) return false

    // Check dependencies
    const dependencies = path.progression.dependencies[nodeId] || []
    return dependencies.every(depId => {
      const depNode = path.progression.nodes[depId]
      return depNode && depNode.completed
    })
  }

  // Add nodes in progression order
  const addedNodes = new Set<string>()
  
  const addNodeToTimeline = (nodeId: string) => {
    if (addedNodes.has(nodeId)) return
    
    const node = path.progression.nodes[nodeId]
    if (!node) return

    // Add prerequisites first
    const dependencies = path.progression.dependencies[nodeId] || []
    dependencies.forEach(depId => addNodeToTimeline(depId))

    // Find the actual exercise/challenge data
    const item = findItemData(nodeId, node.type, path)
    if (!item) return

    const isAvailable = isNodeAvailable(nodeId)
    const status: ExerciseStatus = isAvailable ? 'available' : 'locked'

    const skillColor = node.type === 'exercise' 
      ? getSkillColor((item as Exercise).type)
      : getSkillColor((item as Challenge).skills[0])

    elements.push({
      id: nodeId,
      type: node.type,
      contentStyle: { 
        background: skillColor,
        color: '#fff',
        opacity: status === 'locked' ? 0.7 : 1,
        marginTop: node.type === 'challenge' ? '5rem' : '0'
      },
      contentArrowStyle: { 
        borderRight: `7px solid ${skillColor}` 
      },
      iconStyle: {
        ...commonIconStyle,
        background: skillColor,
        opacity: status === 'locked' ? 0.7 : 1
      },
      icon: getIconForType(node.type),
      data: {
        label: item.title,
        type: node.type,
        status,
        skills: 'skills' in item ? item.skills : [item.type],
        description: item.description
      },
      item
    })

    addedNodes.add(nodeId)
  }

  // Start with available nodes
  path.progression.availableNodeIds.forEach(nodeId => {
    addNodeToTimeline(nodeId)
  })

  // Add remaining nodes in progression
  Object.keys(path.progression.nodes).forEach(nodeId => {
    addNodeToTimeline(nodeId)
  })

  // Add section divider after exercises
  elements.push({
    id: 'exercise-divider',
    type: 'exercise',
    contentStyle: { 
      background: 'transparent',
      marginBottom: '3rem'
    },
    contentArrowStyle: { 
      borderRight: 'none' 
    },
    iconStyle: {
      display: 'none'
    },
    icon: null,
    data: {
      label: '',
      type: 'divider'
    }
  })

  // Add disclaimer at the bottom
  elements.push({
    id: 'disclaimer',
    type: 'assessment',
    contentStyle: { 
      background: 'transparent',
      color: '#64748b', // slate-500
      fontSize: '0.875rem',
      fontStyle: 'italic',
      marginTop: '2rem',
      textAlign: 'center',
      padding: '1rem'
    },
    contentArrowStyle: { 
      borderRight: 'none' 
    },
    iconStyle: {
      display: 'none'
    },
    icon: null,
    data: {
      label: 'While we may not know your exact path to your target level, we do know your next steps to get there.',
      type: 'disclaimer'
    }
  })

  return elements
}