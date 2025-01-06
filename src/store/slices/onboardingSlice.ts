import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { onboardingService } from '@/services/onboardingService'
import type { LanguageCode } from '@/constants/languages'

export type AssessmentType = 'pronunciation' | 'vocabulary' | 'grammar' | 'comprehension'

export interface AssessmentQuestion {
  id: string
  type: AssessmentType
  content: string
  options?: string[]
  audioUrl?: string
  imageUrl?: string
  videoId?: string
  sentence?: string
  blanks?: number[]
}

export interface AssessmentResult {
  pronunciation: number
  vocabulary: number
  grammar: number
  comprehension: number
  overall: number
  level: 'beginner' | 'intermediate' | 'advanced'
  nextSteps: string[]
}

interface OnboardingState {
  currentStep: 'language' | 'assessment-intro' | 'assessment' | 'complete'
  assessmentType: AssessmentType | null
  currentQuestion: AssessmentQuestion | null
  questions: AssessmentQuestion[]
  loading: boolean
  error: string | null
  assessmentProgress: number
  assessmentId: string | null
  assessmentResult: AssessmentResult | null
}

const initialState: OnboardingState = {
  currentStep: 'language',
  assessmentType: null,
  currentQuestion: null,
  questions: [],
  loading: false,
  error: null,
  assessmentProgress: 0,
  assessmentId: null,
  assessmentResult: null
}

export const submitLanguagePreferences = createAsyncThunk(
  'onboarding/submitLanguagePreferences',
  async (preferences: { nativeLanguage: LanguageCode; targetLanguage: LanguageCode }) => {
    const response = await onboardingService.submitLanguagePreferences(preferences)
    return response.data
  }
)

export const startAssessment = createAsyncThunk(
  'onboarding/startAssessment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await onboardingService.startAssessment()
      return response.data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to start assessment'
      )
    }
  }
)

export const submitAssessmentAnswer = createAsyncThunk(
  'onboarding/submitAssessmentAnswer',
  async (
    { questionId, answer }: { questionId: string; answer: any },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { onboarding: OnboardingState }
      const response = await onboardingService.submitAssessment({
        assessmentId: state.onboarding.assessmentId,
        questionId,
        answer,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to submit answer'
      )
    }
  }
)

export const getAssessmentResults = createAsyncThunk(
  'onboarding/getAssessmentResults',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { onboarding: OnboardingState }
      const response = await onboardingService.getAssessmentResults(
        state.onboarding.assessmentId!
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to get assessment results'
      )
    }
  }
)

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action: { payload: OnboardingState['currentStep'] }) => {
      state.currentStep = action.payload
    },
    setAssessmentProgress: (state, action: { payload: number }) => {
      state.assessmentProgress = action.payload
    },
    resetOnboarding: () => initialState,
    setAssessmentType: (state, action: { payload: AssessmentType }) => {
      state.assessmentType = action.payload
    },
    setCurrentQuestion: (state, action: { payload: AssessmentQuestion | null }) => {
      state.currentQuestion = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Assessment
      .addCase(startAssessment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startAssessment.fulfilled, (state, action) => {
        state.loading = false
        state.assessmentId = action.payload.assessmentId
        state.questions = action.payload.questions
        state.currentQuestion = action.payload.questions[0]
        state.currentStep = 'assessment'
      })
      .addCase(startAssessment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Submit Answer
      .addCase(submitAssessmentAnswer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitAssessmentAnswer.fulfilled, (state, action) => {
        state.loading = false
        const currentIndex = state.questions.findIndex(
          q => q.id === state.currentQuestion?.id
        )
        
        if (currentIndex < state.questions.length - 1) {
          state.currentQuestion = state.questions[currentIndex + 1]
        } else {
          state.currentStep = 'complete'
          state.currentQuestion = null
        }
        
        state.assessmentProgress = 
          ((currentIndex + 1) / state.questions.length) * 100
      })
      .addCase(submitAssessmentAnswer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Get Assessment Results
      .addCase(getAssessmentResults.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAssessmentResults.fulfilled, (state, action) => {
        state.loading = false
        state.assessmentResult = action.payload
      })
      .addCase(getAssessmentResults.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setCurrentStep,
  setAssessmentProgress,
  resetOnboarding,
  setAssessmentType,
  setCurrentQuestion
} = onboardingSlice.actions

export default onboardingSlice.reducer 