import type { LanguageCode } from '@/constants/languages'
import type { IOnboardingApi } from '@/lib/api/interfaces/IOnboardingApi'
import { MockOnboardingApi } from '@/lib/api/MockOnboardingApi'
import { OnboardingApi } from '@/lib/api/OnboardingApi'


class OnboardingService {
  private api: IOnboardingApi

  constructor(api?: IOnboardingApi) {
    // Use mock API in development, real API in production
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockOnboardingApi()
      : OnboardingApi.getInstance())
  }

  async submitLanguages(
    nativeLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ) {
    try {
      const response = await this.api.submitLanguages(nativeLanguage, targetLanguage)
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

  async startAssessment() {
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
}

// Export a singleton instance
export const onboardingService = new OnboardingService()

// Export the class for testing purposes
export { OnboardingService } 