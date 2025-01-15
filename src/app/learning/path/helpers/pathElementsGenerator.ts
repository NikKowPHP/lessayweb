import { Node, Edge } from 'reactflow'
import { 
  LearningPath, 
  Exercise, 
  Challenge, 
  SkillType,
  ExerciseStatus 
} from '@/lib/types/learningPath'

// Define the node data structure
interface PathNodeData {
  label: string
  type: 'exercise' | 'challenge'
  status: ExerciseStatus
  skills: SkillType[]
  item: Exercise | Challenge
  difficulty: string
  description: string
}

export function generatePathElements(path: LearningPath) {
  const nodes: Node<PathNodeData>[] = []
  const edges: Edge[] = []
  let yPosition = 0
  const centerX = 400

  // Helper function to find the full item data
  const findItemData = (id: string, type: 'exercise' | 'challenge'): Exercise | Challenge | undefined => {
    if (type === 'exercise') {
      return [...path.exercises.critical, ...path.exercises.recommended, ...path.exercises.practice]
        .find(ex => ex.id === id)
    } else {
      return [...path.challenges.current, ...path.challenges.upcoming]
        .find(ch => ch.id === id)
    }
  }

  // Helper function to get skills array
  const getSkills = (item: Exercise | Challenge): SkillType[] => {
    if ('type' in item && !('skills' in item)) {
      return [item.type]
    } else {
      return (item as Challenge).skills
    }
  }

  // Get all nodes from progression
  const nodeEntries = Object.entries(path.progression.nodes)
  
  // Sort nodes based on dependencies
  const sortedNodes = nodeEntries.sort(([idA], [idB]) => {
    const isADependencyOfB = path.progression.dependencies[idB]?.includes(idA) || false
    const isBDependencyOfA = path.progression.dependencies[idA]?.includes(idB) || false
    
    if (isADependencyOfB) return -1
    if (isBDependencyOfA) return 1
    return 0
  })

  // Create nodes and edges
  sortedNodes.forEach(([nodeId, pathNode]) => {
    // Find the full item data
    const fullItem = findItemData(nodeId, pathNode.type)
    
    if (!fullItem) {
      console.error(`Could not find data for node ${nodeId}`)
      return
    }

    // Create node
    const node: Node<PathNodeData> = {
      id: nodeId,
      type: 'pathNode',
      position: { x: centerX, y: yPosition },
      data: {
        label: fullItem.title,
        type: pathNode.type,
        status: fullItem.status,
        skills: getSkills(fullItem),
        item: fullItem,
        difficulty: fullItem.difficulty,
        description: fullItem.description
      }
    }
    nodes.push(node)

    // Create edges
    pathNode.nextNodes.forEach(targetId => {
      edges.push({
        id: `e${nodeId}-${targetId}`,
        source: nodeId,
        target: targetId,
        animated: true,
        style: { stroke: '#94a3b8' }
      })
    })

    yPosition += 150
  })

  return { nodes, edges }
}

// Helper function to check if a node is available
export function isNodeAvailable(
  nodeId: string, 
  path: LearningPath
): boolean {
  const node = path.progression.nodes[nodeId]
  if (!node) return false

  // Check if node is in availableNodeIds
  if (!path.progression.availableNodeIds.includes(nodeId)) return false

  // Check required nodes
  const hasCompletedRequired = node.unlockCriteria.requiredNodes.every(reqId => 
    path.progression.nodes[reqId]?.completed
  )
  if (!hasCompletedRequired) return false

  // Check skill requirements
  const hasRequiredSkills = Object.entries(node.unlockCriteria.requiredSkills)
    .every(([skill, level]) => 
      path.skills[skill as SkillType].currentLevel >= level
    )

  return hasRequiredSkills
}