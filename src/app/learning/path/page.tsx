'use client'

import { useCallback } from 'react'
import ReactFlow, { 
  Background,
  Controls,
  Node,
  Edge,
  Position,
  ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { 
  selectCurrentPath, 
  selectSkillLevels,
  selectIsLoading,
  setCurrentExercise 
} from '@/store/slices/learningSlice'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { PathNode } from './components/PathNode'
import { generatePathElements } from './helpers/pathElementsGenerator'

const nodeTypes = {
  pathNode: PathNode
}

function LearningPath() {
  const dispatch = useAppDispatch()
  const currentPath = useAppSelector(selectCurrentPath)
  const skillLevels = useAppSelector(selectSkillLevels)
  const isLoading = useAppSelector(selectIsLoading)

  const handleNodeClick = useCallback((_ : any, node: Node) => {
    if (node.data?.exercise) {
      dispatch(setCurrentExercise(node.data.exercise))
    }
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!currentPath) {
    return (
      <div className="mt-16">
        <ErrorAlert 
          title="No Learning Path Found"
          message="Please complete the assessment to generate your personalized learning path."
        />
      </div>
    )
  }

  // Generate nodes and edges from the learning path
  const { nodes, edges } = generatePathElements(currentPath)

  return (
    <motion.div 
      className="mt-22 h-[800px] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </motion.div>
  )
}

// Wrap with provider
export default function LearningPathPage() {
  return (
    <ReactFlowProvider>
      <LearningPath />
    </ReactFlowProvider>
  )
}