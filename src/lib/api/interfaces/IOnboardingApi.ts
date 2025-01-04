import type { LanguageCode } from '@/constants/languages'

export interface AssessmentQuestion {
  id: string
  type: 'pronunciation' | 'grammar' | 'vocabulary' | 'comprehension'
  content: string
  options?: string[]
}

export interface AssessmentResult {
  success: boolean
  score: number
  recommendations: {
    pronunciation: string
    grammar: string
    vocabulary: string
  }
}

export interface LanguagePreferences {
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
}

export interface IOnboardingApi {
  submitLanguages(
    nativeLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ): Promise<{ data: { success: boolean } & LanguagePreferences }>
  
  startAssessment(): Promise<{
    data: {
      assessmentId: string
      questions: AssessmentQuestion[]
    }
  }>
  
  submitAssessment(assessmentData: any): Promise<{
    data: AssessmentResult
  }>
  
  getStoredLanguages(): Promise<LanguagePreferences | null>
} 