import {BaseQuestion } from '@/store/slices/onboardingSlice'

export interface BaseAssessmentQuestion extends BaseQuestion {
  content: string
  type: 'pronunciation' | 'vocabulary' | 'grammar' | 'comprehension'
}

export interface PronunciationQuestion extends BaseAssessmentQuestion {
  type: 'pronunciation'
  audioUrl?: string
}

export interface VocabularyQuestion extends BaseAssessmentQuestion {
  type: 'vocabulary'
  imageUrl: string
  options?: string[]
}

export interface GrammarQuestion extends BaseAssessmentQuestion {
  type: 'grammar'
  options: string[]
  sentence?: string
  blanks?: number[]
}

export interface ComprehensionQuestion extends BaseAssessmentQuestion {
  type: 'comprehension'
  videoId?: string
  options: string[]
}

export type AssessmentQuestion =
  | PronunciationQuestion
  | VocabularyQuestion
  | GrammarQuestion
  | ComprehensionQuestion
