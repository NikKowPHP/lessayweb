import { Api } from './Api'
import type { IOnboardingApi } from './interfaces/IOnboardingApi'
import type { LanguageCode } from '@/constants/languages'
import type {
  AssessmentQuestion,
  LanguagePreferences,
} from './interfaces/IOnboardingApi'
import type {
  PronunciationPromptResponse,
  VocabularyPromptResponse,
  GrammarPromptResponse,
  ComprehensionPromptResponse,
} from '@/models/responses/prompts/PromptResponseIndex'
import type {
  PronunciationResponse,
  VocabularyResponse,
  GrammarResponse,
  ComprehensionResponse,
} from '@/models/responses/assessments/AssessmentResponseIndex'
import type { FinalAssessmentResponse } from '@/lib/models/responses/assessments/FinalAssessmentResponse'

export class OnboardingApi extends Api implements IOnboardingApi {
  private static instance: OnboardingApi
  private static readonly ENDPOINTS = {
    SUBMIT_LANGUAGES: '/onboarding/languages',
    GET_LANGUAGES: '/onboarding/languages',
    START_ASSESSMENT: '/onboarding/assessment/start',
    SUBMIT_ASSESSMENT: '/onboarding/assessment/submit',
    PRONUNCIATION_PROMPT: '/onboarding/assessment/pronunciation/prompt',
    PRONUNCIATION_SUBMIT: '/onboarding/assessment/pronunciation/submit',
    VOCABULARY_PROMPT: '/onboarding/assessment/vocabulary/prompt',
    VOCABULARY_SUBMIT: '/onboarding/assessment/vocabulary/submit',
    GRAMMAR_PROMPT: '/onboarding/assessment/grammar/prompt',
    GRAMMAR_SUBMIT: '/onboarding/assessment/grammar/submit',
    COMPREHENSION_PROMPT: '/onboarding/assessment/comprehension/prompt',
    COMPREHENSION_SUBMIT: '/onboarding/assessment/comprehension/submit',
    SUBMIT_FINAL_ASSESSMENT: '/onboarding/assessment/final/submit',
  } as const

  private constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api')
  }

  public static getInstance(): OnboardingApi {
    if (!OnboardingApi.instance) {
      OnboardingApi.instance = new OnboardingApi()
    }
    return OnboardingApi.instance
  }

  async submitLanguages(
    nativeLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ) {
    const response = await this.post<{ success: boolean } & LanguagePreferences>(
      OnboardingApi.ENDPOINTS.SUBMIT_LANGUAGES,
      {
        nativeLanguage,
        targetLanguage,
      }
    )

    return {
      data: {
        success: true,
        nativeLanguage: response.nativeLanguage,
        targetLanguage: response.targetLanguage,
      },
    }
  }

  async getStoredLanguages() {
    try {
      const response = await this.get<LanguagePreferences>(
        OnboardingApi.ENDPOINTS.GET_LANGUAGES
      )
      return response
    } catch {
      return null
    }
  }

  async startAssessment() {
    const response = await this.post<{
      assessmentId: string
      questions: AssessmentQuestion[]
    }>(OnboardingApi.ENDPOINTS.START_ASSESSMENT)

    return {
      data: {
        assessmentId: response.assessmentId,
        questions: response.questions,
      },
    }
  }

 

  async getPronunciationPrompt(): Promise<{ data: PronunciationPromptResponse }> {
    const response = await this.get<PronunciationPromptResponse>(
      OnboardingApi.ENDPOINTS.PRONUNCIATION_PROMPT
    )
    return { data: response }
  }

  async submitPronunciationAssessment(data: any): Promise<{ data: PronunciationResponse }> {
    const response = await this.post<PronunciationResponse>(
      OnboardingApi.ENDPOINTS.PRONUNCIATION_SUBMIT,
      data
    )
    return { data: response }
  }

  async getVocabularyPrompt(): Promise<{ data: VocabularyPromptResponse }> {
    const response = await this.get<VocabularyPromptResponse>(
      OnboardingApi.ENDPOINTS.VOCABULARY_PROMPT
    )
    return { data: response }
  }

  async submitVocabularyAssessment(data: any): Promise<{ data: VocabularyResponse }> {
    const response = await this.post<VocabularyResponse>(
      OnboardingApi.ENDPOINTS.VOCABULARY_SUBMIT,
      data
    )
    return { data: response }
  }

  async getGrammarPrompt(): Promise<{ data: GrammarPromptResponse }> {
    const response = await this.get<GrammarPromptResponse>(
      OnboardingApi.ENDPOINTS.GRAMMAR_PROMPT
    )
    return { data: response }
  }

  async submitGrammarAssessment(data: any): Promise<{ data: GrammarResponse }> {
    const response = await this.post<GrammarResponse>(
      OnboardingApi.ENDPOINTS.GRAMMAR_SUBMIT,
      data
    )
    return { data: response }
  }

  async getComprehensionPrompt(): Promise<{ data: ComprehensionPromptResponse }> {
    const response = await this.get<ComprehensionPromptResponse>(
      OnboardingApi.ENDPOINTS.COMPREHENSION_PROMPT
    )
    return { data: response }
  }

  async submitComprehensionAssessment(data: any): Promise<{ data: ComprehensionResponse }> {
    const response = await this.post<ComprehensionResponse>(
      OnboardingApi.ENDPOINTS.COMPREHENSION_SUBMIT,
      data
    )
    return { data: response }
  }

 

  async submitFinalAssessment(assessmentId: string): Promise<{ data: FinalAssessmentResponse }> {
    const response = await this.post<FinalAssessmentResponse>(
      OnboardingApi.ENDPOINTS.SUBMIT_FINAL_ASSESSMENT,
      { assessmentId }
    )
    return { data: response }
  }
}

// Export singleton instance
export const onboardingApi = OnboardingApi.getInstance() 