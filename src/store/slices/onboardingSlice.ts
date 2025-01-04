import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { onboardingService } from '@/services/onboardingService'
import type { LanguageCode } from '@/constants/languages'

interface OnboardingState {
  currentStep: 'language' | 'assessment' | 'complete'
  loading: boolean
  error: string | null
  assessmentProgress: number
}

const initialState: OnboardingState = {
  currentStep: 'language',
  loading: false,
  error: null,
  assessmentProgress: 0
}

export const submitLanguagePreferences = createAsyncThunk(
  'onboarding/submitLanguagePreferences',
  async (
    {
      nativeLanguage,
      targetLanguage,
    }: { nativeLanguage: LanguageCode; targetLanguage: LanguageCode },
    { rejectWithValue }
  ) => {
    try {
      const response = await onboardingService.submitLanguages(
        nativeLanguage,
        targetLanguage
      )
      return response
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to submit languages'
      )
    }
  }
)

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (
      state,
      action: { payload: OnboardingState['currentStep'] }
    ) => {
      state.currentStep = action.payload
    },
    setAssessmentProgress: (state, action: { payload: number }) => {
      state.assessmentProgress = action.payload
    },
    resetOnboarding: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLanguagePreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitLanguagePreferences.fulfilled, (state) => {
        state.loading = false
        state.currentStep = 'assessment'
      })
      .addCase(submitLanguagePreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentStep, setAssessmentProgress, resetOnboarding } =
  onboardingSlice.actions
export default onboardingSlice.reducer 