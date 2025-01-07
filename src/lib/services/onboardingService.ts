import type { LanguageCode } from '@/constants/languages'
import type { AssessmentResponse, AssessmentResultResponse, IOnboardingApi, LanguagePreferencesResponse } from '@/lib/api/interfaces/IOnboardingApi'
import { MockOnboardingApi } from '@/lib/api/mock/MockOnboardingApi'
import { OnboardingApi } from '@/lib/api/OnboardingApi'
import type { AssessmentQuestion } from '@/store/slices/onboardingSlice'


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
      const response = await this.api.submitAssessment(assessmentData)
      return response.data
    } catch (error) {
      throw new Error('Failed to submit assessment')
    }
  }

  async getAssessmentResults(assessmentId: string): Promise<AssessmentResultResponse> {
    try {
      const response = await this.api.getAssessmentResults(assessmentId)
      return response
    } catch (error) {
      throw new Error('Failed to get assessment results')
    }
  }
}

// Export a singleton instance
export const onboardingService = new OnboardingService()

// Export the class for testing purposes
export { OnboardingService } 