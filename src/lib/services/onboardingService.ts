import type { LanguageCode } from '@/constants/languages'
import type { AssessmentResponse, AssessmentResultResponse, IOnboardingApi, LanguagePreferencesResponse } from '@/lib/api/interfaces/IOnboardingApi'
import { MockOnboardingApi } from '@/lib/api/mock/MockOnboardingApi'
import { OnboardingApi } from '@/lib/api/OnboardingApi'
import type { AssessmentQuestion } from '@/store/slices/onboardingSlice'
import type {
  PronunciationPromptRequest,
  VocabularyPromptRequest,
  GrammarPromptRequest,
  ComprehensionPromptRequest
} from '@/lib/models/requests/prompts/PromptRequestIndex'
import type {
  PronunciationPromptResponse,
  VocabularyPromptResponse,
  GrammarPromptResponse,
  ComprehensionPromptResponse
} from '@/lib/models/responses/prompts/PromptResponseIndex'


class OnboardingService {
  private api: IOnboardingApi

  constructor(api?: IOnboardingApi) {
    // Use mock API in development, real API in production
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockOnboardingApi()
      : OnboardingApi.getInstance())
  }

  async submitLanguagePreferences(preferences: { 
    nativeLanguage: LanguageCode
    targetLanguage: LanguageCode 
  }): Promise<LanguagePreferencesResponse> {
    try {
      const response = await this.api.submitLanguages(
        preferences.nativeLanguage, 
        preferences.targetLanguage
      )
      return response.data
    } catch (error) {
      throw new Error('Failed to submit language preferences')
    }
  }

  async getStoredLanguages() {
    try {
      return await this.api.getStoredLanguages()
    } catch {
      return null
    }
  }

  async startAssessment(): Promise<AssessmentResponse> {
    try {
      const response = await this.api.startAssessment()
      return response.data
    } catch (error) {
      throw new Error('Failed to start assessment')
    }
  }

  async submitAssessment(assessmentData: any) {
    try {
      const response = await this.api.submitFinalAssessment(assessmentData)
      return response.data
    } catch (error) {
      throw new Error('Failed to submit assessment')
    }
  }

  // Pronunciation methods
  async getPronunciationPrompt(request?: PronunciationPromptRequest): Promise<PronunciationPromptResponse> {
    try {
      const response = await this.api.getPronunciationPrompt()
      return response.data
    } catch (error) {
      throw new Error('Failed to get pronunciation prompt')
    }
  }

  async submitPronunciationAssessment(data: any) {
    try {
      const response = await this.api.submitPronunciationAssessment(data)
      return response.data
    } catch (error) {
      throw new Error('Failed to submit pronunciation assessment')
    }
  }

  // Vocabulary methods
  async getVocabularyPrompt(request?: VocabularyPromptRequest): Promise<VocabularyPromptResponse> {
    try {
      const response = await this.api.getVocabularyPrompt()
      return response.data
    } catch (error) {
      throw new Error('Failed to get vocabulary prompt')
    }
  }

  async submitVocabularyAssessment(data: any) {
    try {
      const response = await this.api.submitVocabularyAssessment(data)
      return response.data
    } catch (error) {
      throw new Error('Failed to submit vocabulary assessment')
    }
  }

  // Grammar methods
  async getGrammarPrompt(request?: GrammarPromptRequest): Promise<GrammarPromptResponse> {
    try {
      const response = await this.api.getGrammarPrompt()
      return response.data
    } catch (error) {
      throw new Error('Failed to get grammar prompt')
    }
  }

  async submitGrammarAssessment(data: any) {
    try {
      const response = await this.api.submitGrammarAssessment(data)
      return response.data
    } catch (error) {
      throw new Error('Failed to submit grammar assessment')
    }
  }

  // Comprehension methods
  async getComprehensionPrompt(request?: ComprehensionPromptRequest): Promise<ComprehensionPromptResponse> {
    try {
      const response = await this.api.getComprehensionPrompt()
      return response.data
    } catch (error) {
      throw new Error('Failed to get comprehension prompt')
    }
  }

  async submitComprehensionAssessment(data: any) {
    try {
      const response = await this.api.submitComprehensionAssessment(data)
      return response.data
    } catch (error) {
      throw new Error('Failed to submit comprehension assessment')
    }
  }
}

// Export a singleton instance
export const onboardingService = new OnboardingService()

// Export the class for testing purposes
export { OnboardingService } 