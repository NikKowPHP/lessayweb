import type { LanguageCode } from '@/constants/languages'
import type {
  PronunciationPromptResponse,
  VocabularyPromptResponse,
  GrammarPromptResponse,
  ComprehensionPromptResponse
} from '@/models/responses/prompts/PromptResponseIndex'
import type {
  PronunciationAssessmentRequest,
  VocabularyAssessmentRequest,
  GrammarAssessmentRequest,
  ComprehensionAssessmentRequest
} from '@/models/requests/assessments/AssessmentRequestIndex'
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

export interface IOnboardingApi {
  // Language preferences
  submitLanguages(
    nativeLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ): Promise<{ data: LanguagePreferences }>
  getStoredLanguages(): Promise<LanguagePreferences | null>

  // Pronunciation assessment
  getPronunciationPrompt(): Promise<{ data: PronunciationPromptResponse }>
  submitPronunciationAssessment(
    data: PronunciationAssessmentRequest
  ): Promise<{ data: PronunciationResponse }>

  // Vocabulary assessment
  getVocabularyPrompt(): Promise<{ data: VocabularyPromptResponse }>
  submitVocabularyAssessment(
    data: VocabularyAssessmentRequest
  ): Promise<{ data: VocabularyResponse }>

  // Grammar assessment
  getGrammarPrompt(): Promise<{ data: GrammarPromptResponse }>
  submitGrammarAssessment(
    data: GrammarAssessmentRequest
  ): Promise<{ data: GrammarResponse }>

  // Comprehension assessment
  getComprehensionPrompt(): Promise<{ data: ComprehensionPromptResponse }>
  submitComprehensionAssessment(
    data: ComprehensionAssessmentRequest
  ): Promise<{ data: ComprehensionResponse }>

  // Final assessment
  submitFinalAssessment(
    assessmentId: string
  ): Promise<{ data: FinalAssessmentResponse }>
} 