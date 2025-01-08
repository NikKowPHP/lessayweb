import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { onboardingService } from '@/services/onboardingService'


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

export enum OnboardingStep {
  Language = 'language',
  AssessmentIntro = 'assessment-intro',
  Assessment = 'assessment',
  Complete = 'complete'
}

export enum AssessmentType {
  Pronunciation = 'pronunciation',
  Vocabulary = 'vocabulary',
  Grammar = 'grammar',
  Comprehension = 'comprehension'
}

export const AssessmentOrder: AssessmentType[] = [
  AssessmentType.Pronunciation,
  AssessmentType.Vocabulary,
  AssessmentType.Grammar,
  AssessmentType.Comprehension
]
export interface AssessmentPrompts {
  pronunciation?: PronunciationPromptData
  vocabulary?: VocabularyPromptData
  grammar?: GrammarPromptData
  comprehension?: ComprehensionPromptData
}

export interface AssessmentResponses {
  pronunciation?: PronunciationResponse
  vocabulary?: VocabularyResponse
  grammar?: GrammarResponse
  comprehension?: ComprehensionResponse
}

interface OnboardingState {
  currentStep: OnboardingStep
  assessmentType: AssessmentType | null
  loading: boolean
  error: string | null
  assessmentProgress: number
  assessmentId: string | null
  prompts: Record<AssessmentType, any>
  responses: Record<AssessmentType, any>
  promptsLoaded: boolean
  sessionLoaded: boolean
  finalAssessment: FinalAssessmentResponse | null
}

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




export interface OnboardingStepConfig {
  step: OnboardingStep
  label: string
  description: string
  canSkip: boolean
  nextStep: OnboardingStep | null
  prevStep: OnboardingStep | null
}

export const OnboardingStepConfigs: Record<OnboardingStep, OnboardingStepConfig> = {
  [OnboardingStep.Language]: {
    step: OnboardingStep.Language,
    label: 'Language Selection',
    description: 'Choose your native and target languages',
    canSkip: false,
    nextStep: OnboardingStep.AssessmentIntro,
    prevStep: null
  },
  [OnboardingStep.AssessmentIntro]: {
    step: OnboardingStep.AssessmentIntro,
    label: 'Assessment Introduction',
    description: 'Learn about the assessment process',
    canSkip: true,
    nextStep: OnboardingStep.Assessment,
    prevStep: OnboardingStep.Language
  },
  [OnboardingStep.Assessment]: {
    step: OnboardingStep.Assessment,
    label: 'Assessment',
    description: 'Complete your language assessment',
    canSkip: false,
    nextStep: OnboardingStep.Complete,
    prevStep: OnboardingStep.AssessmentIntro
  },
  [OnboardingStep.Complete]: {
    step: OnboardingStep.Complete,
    label: 'Complete',
    description: 'View your assessment results',
    canSkip: false,
    nextStep: null,
    prevStep: OnboardingStep.Assessment
  }
}


