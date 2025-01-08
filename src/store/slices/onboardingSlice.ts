import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { onboardingService } from '@/services/onboardingService'
import type { LanguageCode } from '@/constants/languages'
import type { 
  PronunciationPromptData,
  VocabularyPromptData,
  GrammarPromptData,
  ComprehensionPromptData 
} from '@/models/responses/prompts/PromptResponseIndex'
import type {
  PronunciationResponse,
  VocabularyResponse,
  GrammarResponse,
  ComprehensionResponse
} from '@/models/responses/assessments/AssessmentResponseIndex'
import type { FinalAssessmentResponse } from '@/models/responses/assessments/FinalAssessmentResponse'

export type AssessmentType = 'pronunciation' | 'vocabulary' | 'grammar' | 'comprehension'

interface AssessmentPrompts {
  pronunciation?: PronunciationPromptData
  vocabulary?: VocabularyPromptData
  grammar?: GrammarPromptData
  comprehension?: ComprehensionPromptData
}

interface AssessmentResponses {
  pronunciation?: PronunciationResponse
  vocabulary?: VocabularyResponse
  grammar?: GrammarResponse
  comprehension?: ComprehensionResponse
}

interface OnboardingState {
  currentStep: 'language' | 'assessment-intro' | 'assessment' | 'complete'
  assessmentType: AssessmentType | null
  loading: boolean
  error: string | null
  assessmentProgress: number
  assessmentId: string | null
  prompts: AssessmentPrompts
  responses: AssessmentResponses
  promptsLoaded: boolean
  sessionLoaded: boolean
  finalAssessment: FinalAssessmentResponse | null
}

const initialState: OnboardingState = {
  currentStep: 'language',
  assessmentType: null,
  loading: false,
  error: null,
  assessmentProgress: 0,
  assessmentId: null,
  prompts: {},
  responses: {},
  promptsLoaded: false,
  sessionLoaded: false,
  finalAssessment: null
}

export interface OnboardingSession {
  assessmentId: string | null
  currentStep: OnboardingState['currentStep']
  assessmentType: AssessmentType | null
  assessmentProgress: number
  prompts: AssessmentPrompts
  responses: AssessmentResponses
}

// New thunk to load session state
export const loadOnboardingSession = createAsyncThunk(
  'onboarding/loadSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await onboardingService.getStoredOnboardingSession()
      return session
    } catch (error) {
      return rejectWithValue('Failed to load session')
    }
  }
)

// New thunk to initialize all prompts
export const initializeAssessmentPrompts = createAsyncThunk(
  'onboarding/initializePrompts',
  async (_, { rejectWithValue }) => {
    try {
      const [
        pronunciationPrompt,
        vocabularyPrompt,
        grammarPrompt,
        comprehensionPrompt
      ] = await Promise.all([
        onboardingService.getPronunciationPrompt(),
        onboardingService.getVocabularyPrompt(),
        onboardingService.getGrammarPrompt(),
        onboardingService.getComprehensionPrompt()
      ])

      const prompts = {
        pronunciation: pronunciationPrompt,
        vocabulary: vocabularyPrompt,
        grammar: grammarPrompt,
        comprehension: comprehensionPrompt
      }

      // Store prompts in session
      await onboardingService.storeOnboardingSession({
        ...await onboardingService.getStoredOnboardingSession(),
        prompts
      })

      return prompts
    } catch (error) {
      return rejectWithValue('Failed to initialize prompts')
    }
  }
)

// Modified startAssessment to handle prompt initialization
export const startAssessment = createAsyncThunk(
  'onboarding/startAssessment',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      // First initialize all prompts if not already loaded
      const state = getState() as RootState
      if (!state.onboarding.promptsLoaded) {
        await dispatch(initializeAssessmentPrompts()).unwrap()
      }

      const response = await onboardingService.startAssessment()
      
      // Store assessment state in session
      await onboardingService.storeOnboardingSession({
        assessmentId: response.assessment_id,
        currentStep: 'assessment',
        questions: response.questions,
        currentQuestion: response.questions[0],
        assessmentProgress: 0
      })

      return response
    } catch (error) {
      return rejectWithValue('Failed to start assessment')
    }
  }
)

export const submitLanguagePreferences = createAsyncThunk(
  'onboarding/submitLanguagePreferences',
  async (preferences: { nativeLanguage: LanguageCode; targetLanguage: LanguageCode }) => {
    const response = await onboardingService.submitLanguagePreferences(preferences)
    return response
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
      return response
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to submit answer'
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
  },
  extraReducers: (builder) => {
    builder
      // Load Session
      .addCase(loadOnboardingSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadOnboardingSession.fulfilled, (state, action) => {
        state.loading = false
        state.sessionLoaded = true
        if (action.payload) {
          state.assessmentId = action.payload.assessmentId
          state.currentStep = action.payload.currentStep
          state.questions = action.payload.questions
          state.currentQuestion = action.payload.currentQuestion
          state.assessmentProgress = action.payload.assessmentProgress
        }
      })
      .addCase(loadOnboardingSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.sessionLoaded = true
      })

      // Initialize Prompts
      .addCase(initializeAssessmentPrompts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initializeAssessmentPrompts.fulfilled, (state, action) => {
        state.loading = false
        state.prompts = action.payload
        state.promptsLoaded = true
      })
      .addCase(initializeAssessmentPrompts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

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