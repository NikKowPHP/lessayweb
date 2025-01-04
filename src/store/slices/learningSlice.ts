import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LearningState {
  currentStep: number
  learningPath: any[] // Define proper type based on your needs
  assessmentResults: any // Define proper type based on your needs
  progress: {
    pronunciation: number
    grammar: number
    vocabulary: number
    comprehension: number
  }
}

const initialState: LearningState = {
  currentStep: 0,
  learningPath: [],
  assessmentResults: null,
  progress: {
    pronunciation: 0,
    grammar: 0,
    vocabulary: 0,
    comprehension: 0,
  },
}

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setLearningPath: (state, action: PayloadAction<any[]>) => {
      state.learningPath = action.payload
    },
    setAssessmentResults: (state, action: PayloadAction<any>) => {
      state.assessmentResults = action.payload
    },
    updateProgress: (state, action: PayloadAction<Partial<LearningState['progress']>>) => {
      state.progress = { ...state.progress, ...action.payload }
    },
  },
})

export const { setCurrentStep, setLearningPath, setAssessmentResults, updateProgress } = learningSlice.actions
export default learningSlice.reducer