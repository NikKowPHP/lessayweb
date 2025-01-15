import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LearningPath, Exercise, Challenge, SkillType } from '@/lib/types/learningPath'

interface LearningState {
  currentPath: LearningPath | null
  isLoading: boolean
  error: string | null
  currentExercise: Exercise | null
  currentChallenge: Challenge | null
  skillLevels: Record<SkillType, number>
}

const initialState: LearningState = {
  currentPath: null,
  isLoading: false,
  error: null,
  currentExercise: null,
  currentChallenge: null,
  skillLevels: {
    pronunciation: 0,
    grammar: 0,
    vocabulary: 0,
    comprehension: 0
  }
}

interface SetLearningPathWithResultsPayload {
  path: LearningPath
  assessmentResults: any // Replace with proper assessment type
}

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setLearningPath: (state, action: PayloadAction<LearningPath>) => {
      state.currentPath = action.payload
    },
    setCurrentExercise: (state, action: PayloadAction<Exercise>) => {
      state.currentExercise = action.payload
    },
    setCurrentChallenge: (state, action: PayloadAction<Challenge>) => {
      state.currentChallenge = action.payload
    },
    updateSkillLevels: (state, action: PayloadAction<Record<SkillType, number>>) => {
      state.skillLevels = { ...state.skillLevels, ...action.payload }
    },
    completeExercise: (state, action: PayloadAction<{ exerciseId: string; metrics: Exercise['metrics'] }>) => {
      if (state.currentPath) {
        const node = state.currentPath.nodes[action.payload.exerciseId]
        if (node && node.type === 'exercise') {
          node.completed = true;
          (node.data as Exercise).metrics = action.payload.metrics
          
          // Update progress
          state.currentPath.progress.completedExercises++
          state.currentPath.progress.overallProgress = 
            (state.currentPath.progress.completedExercises / state.currentPath.progress.totalExercises) * 100
        }
      }
    },
    unlockNextNodes: (state, action: PayloadAction<string[]>) => {
      if (state.currentPath) {
        action.payload.forEach(nodeId => {
          const node = state.currentPath!.nodes[nodeId]
          if (node) {
            const allPrerequisitesMet = node.unlockCriteria.requiredNodes
              .every(reqId => state.currentPath!.nodes[reqId]?.completed)
            if (allPrerequisitesMet) {
              if (node.type === 'exercise') {
                (node.data as Exercise).status = 'available'
              } else {
                (node.data as Challenge).status = 'available'
              }
            }
          }
        })
      }
    },
    setLearningPathWithResults: (state, action: PayloadAction<SetLearningPathWithResultsPayload>) => {
      const { path, assessmentResults } = action.payload
      state.currentPath = path
      state.skillLevels = {
        pronunciation: assessmentResults.skill_breakdown.pronunciation || 0,
        grammar: assessmentResults.skill_breakdown.grammar || 0,
        vocabulary: assessmentResults.skill_breakdown.vocabulary || 0,
        comprehension: assessmentResults.skill_breakdown.comprehension || 0
      }
      state.isLoading = false
      state.error = null
    }
  }
})

export const { 
  setLearningPath, 
  setCurrentExercise, 
  setCurrentChallenge,
  updateSkillLevels,
  completeExercise,
  
  unlockNextNodes,
  setLearningPathWithResults
} = learningSlice.actions

export default learningSlice.reducer