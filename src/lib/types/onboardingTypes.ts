import { ComprehensionPromptData, GrammarPromptData, PronunciationPromptData, VocabularyPromptData } from "../models/responses/prompts/PromptResponseIndex"
import { PronunciationResponse } from "../models/responses/assessments/PronunciationResponse"
import { VocabularyResponse } from "../models/responses/assessments/VocabularyResponse"
import { GrammarResponse } from "../models/responses/assessments/GrammarResponse"
import { ComprehensionResponse } from "../models/responses/assessments/ComprehensionResponse"
import { FinalAssessmentResponse } from "../models/responses/assessments/FinalAssessmentResponse"

export interface OnboardingSession {
  assessmentId: string | null
  currentStep: OnboardingStep
  assessmentType: AssessmentType | null
  assessmentProgress: number
  prompts: AssessmentPrompts
  responses: AssessmentResponses
  promptLoadStatus: Record<AssessmentType, boolean>
}



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

export interface OnboardingState {
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
  promptLoadStatus: Record<AssessmentType, boolean>
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