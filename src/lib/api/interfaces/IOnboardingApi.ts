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




export interface LanguagePreferencesResponse {
  success: boolean
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
}

export interface AssessmentResponse {
  assessmentId: string
  questions: AssessmentQuestion[]
}

export interface AssessmentResultResponse {
  pronunciation: number
  vocabulary: number
  grammar: number
  comprehension: number
  overall: number
  level: 'beginner' | 'intermediate' | 'advanced'
  nextSteps: string[]
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
  
  getAssessmentResults(assessmentId: string): Promise<AssessmentResultResponse>
} 