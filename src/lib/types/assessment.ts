import { BaseModel, QuestionType, ProficiencyLevel } from './base'

export interface BaseQuestion extends BaseModel {
  content: string
  type: QuestionType
}
export interface PronunciationQuestion extends BaseQuestion {
  id: string
  content: string
  type: QuestionType.Pronunciation
  audioUrl?: string
}

export interface VocabularyQuestion extends BaseQuestion {
  id: string
  content: string
  type: QuestionType.Vocabulary
  imageUrl: string
  options?: string[]
}

export interface GrammarQuestion extends BaseQuestion {
  id: string
  content: string
  type: QuestionType.Grammar
  options: string[]
  sentence?: string
  blanks?: number[]
}

export interface ComprehensionQuestion extends BaseQuestion {
  id: string
  content: string
  type: QuestionType.Comprehension
  videoId?: string
  options: string[]
}

export type AssessmentQuestion =
  | PronunciationQuestion
  | VocabularyQuestion
  | GrammarQuestion
  | ComprehensionQuestion

export interface AssessmentResult {
  pronunciation: number
  vocabulary: number
  grammar: number
  comprehension: number
  overall: number
  level: ProficiencyLevel
  nextSteps: string[]
}
