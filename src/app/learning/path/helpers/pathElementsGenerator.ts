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

  // Helper function to get skills array from an item
  const getSkills = (item: Exercise | Challenge): SkillType[] => {
    if ('type' in item && !('skills' in item)) {
      // It's an Exercise
      return [item.type]
    } else {
      // It's a Challenge
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
  sortedNodes.forEach(([nodeId, pathNode], index) => {
    const item = pathNode.data
    console.log('item', item)
    
    // Create node
    const node: Node<PathNodeData> = {
      id: nodeId,
      type: 'pathNode',
      position: { x: centerX, y: yPosition },
      data: {
        label: item.title,
        type: pathNode.type,
        status: item.status,
        skills: getSkills(item),
        item: item,
        difficulty: item.difficulty,
        description: item.description
      }
    }
    nodes.push(node)

    // Create edges based on nextNodes from progression
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