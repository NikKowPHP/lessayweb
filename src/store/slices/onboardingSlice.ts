import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { onboardingService } from '@/services/onboardingService'



import { AssessmentType, OnboardingStep } from '@/lib/types/onboardingTypes'


const initialState: OnboardingState = {
  currentStep: OnboardingStep.Language,
  assessmentType: null,
  loading: false,
  error: null,
  assessmentProgress: 0,
  assessmentId: null,
  prompts: {} as Record<AssessmentType, any>,
  responses: {} as Record<AssessmentType, any>,
  promptsLoaded: false,
  sessionLoaded: false,
  finalAssessment: null
}





