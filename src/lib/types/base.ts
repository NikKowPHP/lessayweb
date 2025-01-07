export interface BaseModel {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

export enum QuestionType {
  Pronunciation = 'pronunciation',
  Vocabulary = 'vocabulary',
  Grammar = 'grammar',
  Comprehension = 'comprehension',
}

export enum ProficiencyLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}
