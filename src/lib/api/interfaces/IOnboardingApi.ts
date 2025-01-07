import type { LanguageCode } from '@/constants/languages'

import type {
  PronunciationPromptResponse,
  VocabularyPromptResponse,
  GrammarPromptResponse,
  ComprehensionPromptResponse
} from '@/models/responses/prompts/PromptResponseIndex'
import type {
  PronunciationResponse,
  VocabularyResponse,
  GrammarResponse,
  ComprehensionResponse
} from '@/models/responses/assessments/AssessmentResponseIndex'
import type { FinalAssessmentResponse } from '@/lib/models/responses/assessments/FinalAssessmentResponse'

export interface LanguagePreferences {
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
}

export interface AssessmentQuestion {
  id: string
  type: string
  content: string
  options?: string[]
}

export interface IOnboardingApi {
  submitLanguages(
    nativeLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ): Promise<{ data: LanguagePreferences }>
  
  getStoredLanguages(): Promise<LanguagePreferences | null>
  
  startAssessment(): Promise<{
    data: {
      assessmentId: string
      questions: AssessmentQuestion[]
    }
  }>
  
 
  

  
  getPronunciationPrompt(): Promise<{ data: PronunciationPromptResponse }>
  submitPronunciationAssessment(data: any): Promise<{ data: PronunciationResponse }>
  
  getVocabularyPrompt(): Promise<{ data: VocabularyPromptResponse }>
  submitVocabularyAssessment(data: any): Promise<{ data: VocabularyResponse }>
  
  getGrammarPrompt(): Promise<{ data: GrammarPromptResponse }>
  submitGrammarAssessment(data: any): Promise<{ data: GrammarResponse }>
  
  getComprehensionPrompt(): Promise<{ data: ComprehensionPromptResponse }>
  submitComprehensionAssessment(data: any): Promise<{ data: ComprehensionResponse }>
  
  
  
  submitFinalAssessment(assessmentId: string): Promise<{ data: FinalAssessmentResponse }>
} 