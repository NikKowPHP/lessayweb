'use client'

import { useCallback, useEffect } from 'react'
import { 
  VerticalTimeline, 
  VerticalTimelineElement 
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { motion } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { 
  selectCurrentPath, 
  selectSkillLevels,
  selectIsLoading,
  setCurrentExercise,
  rehydrateLearningState
} from '@/store/slices/learningSlice'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { PathNode } from './components/PathNode'
import { generateTimelineElements } from './helpers/pathElementsGenerator'

function LearningPath() {
  const dispatch = useAppDispatch()
  const currentPath = useAppSelector(selectCurrentPath)
  const isLoading = useAppSelector(selectIsLoading)

  useEffect(() => {
    dispatch(rehydrateLearningState())
  }, [dispatch])

  const handleElementClick = useCallback((element: any) => {
    if (element.type === 'exercise') {
      dispatch(setCurrentExercise(element.item))
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

  const timelineElements = generateTimelineElements(currentPath)

  return (
    <motion.div 
      className="mt-20 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <VerticalTimeline lineColor="#94a3b8">
        {timelineElements.map((element) => (
          <VerticalTimelineElement
            key={element.id}
            className={`vertical-timeline-element--${element.type}`}
            contentStyle={element.contentStyle}
            contentArrowStyle={element.contentArrowStyle}
            iconStyle={element.iconStyle}
            icon={element.icon}
            onTimelineElementClick={() => handleElementClick(element)}
          >
            <PathNode data={element.data} />
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </motion.div>
  )
}

export default LearningPath