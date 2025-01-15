import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  LearningPath, 
  Exercise, 
  Challenge, 
  SkillType,
  ExerciseStatus,
} from '@/lib/types/learningPath'
import type { RootState } from '@/store'
import { FinalAssessmentResponse } from '@/lib/models/responses/assessments/FinalAssessmentResponse'
import { learningService } from '@/lib/services/learningService'

interface LearningState {
  currentPath: LearningPath | null
  isLoading: boolean
  error: string | null
  currentExercise: Exercise | null
  currentChallenge: Challenge | null
  skillLevels: Record<SkillType, number>
  lastActivity: string | null
  ui: {
    expandedSections: string[]
    bookmarkedExercises: string[]
    lastViewedExercise: string | null
  }
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
  },
  lastActivity: null,
  ui: {
    expandedSections: [],
    bookmarkedExercises: [],
    lastViewedExercise: null
  }
}

interface SetLearningPathWithResultsPayload {
  path: LearningPath
  assessmentResults: FinalAssessmentResponse
}

// Async thunks
export const initializeLearningPath = createAsyncThunk(
  'learning/initializePath',
  async (payload: SetLearningPathWithResultsPayload) => {
    const { path, assessmentResults } = payload
    return await learningService.initializePath(path, assessmentResults)
  }
)

export const completeExercise = createAsyncThunk(
  'learning/completeExercise',
  async ({ exerciseId, metrics }: { exerciseId: string, metrics: Exercise['metrics'] }) => {
    return await learningService.completeExercise(exerciseId, metrics)
  }
)

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setCurrentExercise: (state, action: PayloadAction<Exercise>) => {
      state.currentExercise = action.payload
      state.ui.lastViewedExercise = action.payload.id
      state.lastActivity = new Date().toISOString()
    },
    completeExercise: (state, action: PayloadAction<Exercise>) => {
      state.currentExercise = action.payload
      state.ui.lastViewedExercise = action.payload.id
      state.lastActivity = new Date().toISOString()
    },

    setCurrentChallenge: (state, action: PayloadAction<Challenge>) => {
      state.currentChallenge = action.payload
      state.lastActivity = new Date().toISOString()
    },

    updateSkillLevels: (state, action: PayloadAction<Record<SkillType, number>>) => {
      state.skillLevels = { ...state.skillLevels, ...action.payload }
      
      // Update path progress if exists
      if (state.currentPath) {
        Object.entries(action.payload).forEach(([skill, level]) => {
          const skillType = skill as SkillType
          if (state.currentPath?.skills[skillType]) {
            state.currentPath.skills[skillType].currentLevel = level
          }
        })
      }
    },

    unlockNextNodes: (state, action: PayloadAction<string[]>) => {
      if (!state.currentPath) return

      action.payload.forEach((nodeId: string) => {
        const node = state.currentPath?.progression.nodes[nodeId]
        if (!node) return

        const allPrerequisitesMet = node.unlockCriteria.requiredNodes
          .every((reqId: string) => {
            const prerequisiteNode = state.currentPath?.progression.nodes[reqId]
            return prerequisiteNode?.completed === true
          })

        if (allPrerequisitesMet) {
          if (node.type === 'exercise') {
            (node.data as Exercise).status = 'available'
          } else {
            (node.data as Challenge).status = 'available'
          }
        }
      })

      // Update available node IDs
      if (state.currentPath) {
        const newAvailableNodes = Object.entries(state.currentPath.progression.nodes)
          .filter(([_, node]) => {
            if (node.type === 'exercise') {
              return (node.data as Exercise).status === 'available'
            } else {
              return (node.data as Challenge).status === 'available'
            }
          })
          .map(([id]) => id)

        state.currentPath.progression.availableNodeIds = newAvailableNodes
      }
    },

    // UI actions
    toggleSectionExpanded: (state, action: PayloadAction<string>) => {
      const sectionId = action.payload
      const index = state.ui.expandedSections.indexOf(sectionId)
      if (index === -1) {
        state.ui.expandedSections.push(sectionId)
      } else {
        state.ui.expandedSections.splice(index, 1)
      }
    },

    toggleExerciseBookmark: (state, action: PayloadAction<string>) => {
      const exerciseId = action.payload
      const index = state.ui.bookmarkedExercises.indexOf(exerciseId)
      if (index === -1) {
        state.ui.bookmarkedExercises.push(exerciseId)
      } else {
        state.ui.bookmarkedExercises.splice(index, 1)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeLearningPath.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeLearningPath.fulfilled, (state, action) => {
        state.currentPath = action.payload.path
        state.skillLevels = action.payload.skillLevels
        state.lastActivity = new Date().toISOString()
        state.isLoading = false
      })
      .addCase(initializeLearningPath.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to initialize learning path'
      })
  }
})

// Selectors
export const selectCurrentPath = (state: RootState) => state.learning.currentPath
export const selectCurrentExercise = (state: RootState) => state.learning.currentExercise
export const selectSkillLevels = (state: RootState) => state.learning.skillLevels
export const selectUIState = (state: RootState) => state.learning.ui
export const selectIsLoading = (state: RootState) => state.learning.isLoading
export const selectError = (state: RootState) => state.learning.error

export const {
  setCurrentExercise,
  setCurrentChallenge,
  updateSkillLevels,
  unlockNextNodes,
  toggleSectionExpanded,
  toggleExerciseBookmark
} = learningSlice.actions

export default learningSlice.reducer