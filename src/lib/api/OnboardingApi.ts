import { Api } from './Api'
import type { IOnboardingApi } from './interfaces/IOnboardingApi'
import type { LanguageCode } from '@/constants/languages'
import type {
  AssessmentQuestion,
  AssessmentResult,
  LanguagePreferences,
} from './interfaces/IOnboardingApi'

export class OnboardingApi extends Api implements IOnboardingApi {
  private static instance: OnboardingApi
  private static readonly ENDPOINTS = {
    SUBMIT_LANGUAGES: '/onboarding/languages',
    GET_LANGUAGES: '/onboarding/languages',
    START_ASSESSMENT: '/onboarding/assessment/start',
    SUBMIT_ASSESSMENT: '/onboarding/assessment/submit',
  }

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

  async submitAssessment(assessmentData: any) {
    const response = await this.post<AssessmentResult>(
      OnboardingApi.ENDPOINTS.SUBMIT_ASSESSMENT,
      assessmentData
    )

    return {
      data: response,
    }
  }
}

// Export singleton instance
export const onboardingApi = OnboardingApi.getInstance() 