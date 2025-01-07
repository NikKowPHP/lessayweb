export interface BaseModel {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface BaseQuestion extends BaseModel {
  content: string
  type: 'pronunciation' | 'vocabulary' | 'grammar' | 'comprehension'
}
export interface PronunciationQuestion extends BaseQuestion {
  id: string
  content: string
  type: 'pronunciation'
  audioUrl?: string
}

export interface VocabularyQuestion extends BaseQuestion {
  id: string
  content: string
  type: 'vocabulary'
  imageUrl: string
  options?: string[]
}

export interface GrammarQuestion extends BaseQuestion {
  id: string
  content: string
  type: 'grammar'
  options: string[]
  sentence?: string
  blanks?: number[]
}

export interface ComprehensionQuestion extends BaseQuestion {
  id: string
  content: string
  type: 'comprehension'
  videoId?: string
  options: string[]
}

export type AssessmentQuestion =
  | PronunciationQuestion
  | VocabularyQuestion
  | GrammarQuestion
  | ComprehensionQuestion
