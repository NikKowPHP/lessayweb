import localforage from 'localforage'
import type { LanguageCode } from '@/constants/languages'
import type {
  IOnboardingApi,
} from '../interfaces/IOnboardingApi'
import { LanguagePreferenceRequest, LanguagePreferences, LanguagePreferencesResponse } from '@/lib/models/languages/LanguagePreferencesModel'
import { OnboardingState, OnboardingStep, initialOnboardingState } from '@/lib/types/onboardingTypes'
import { onboardingStorage } from '@/lib/services/onboardingStorage'
import { mockRoutes } from './MockRoutes'
// import { logger } from '@/lib/utils/logger'






export class MockOnboardingApi implements IOnboardingApi {
  

  private async handleMockRequest(path: string, method: 'GET' | 'POST', body?: any): Promise<any> {
    await this.delay(1000)
    
    const route = mockRoutes.find(r => 
      r.path === path && r.method === method
    )

    if (!route) {
      throw new Error(`Mock route not found: ${method} ${path}`)
    }

    if (typeof route.response === 'function') {
      return route.response(body)
    }

    return route.response
  }

  async submitLanguages(data: LanguagePreferenceRequest): Promise<{ data: LanguagePreferencesResponse }> {
    // const response = await this.handleMockRequest('/languages', 'POST', data)

    await this.delay(1000)

    const languagePrefs: LanguagePreferences = {
      nativeLanguage: data.nativeLanguage,
      targetLanguage: data.targetLanguage,
    }
    // Get current session state
    const currentState = await onboardingStorage.getSession();
    const updatedState: OnboardingState = {
      ...initialOnboardingState,
      ...currentState,
      languagePreferences: {
        ...languagePrefs,
        isSubmitting: false,
        error: null,
      },
    }
    const response: LanguagePreferencesResponse = {
      status: 'success',
      data: {
        ...languagePrefs,
        timestamp: new Date().toISOString(),
        preferences_id: '123',
      },
    }

    
    // Update state with language preferences
    await onboardingStorage.setSession(updatedState)
    return { data: response }

  }

  async getStoredLanguages(): Promise<LanguagePreferencesResponse | null> {
    try {
      const state = await onboardingStorage.getSession()
      
      console.debug('Retrieved stored languages', { 
        preferences: state?.languagePreferences 
      })

      if (!state?.languagePreferences) {
        console.info('No language preferences found')
        return null
      }

      const response: LanguagePreferencesResponse = {
        status: 'success',
        data: {
          ...state.languagePreferences,
          timestamp: new Date().toISOString(),
          preferences_id: '123',
        }
      }

      return response
    } catch (error) {
      console.error('Failed to get stored languages', error as Error)
      return null
    }
  }
  async submitAssessment(assessmentData: any) {
    const response = await this.handleMockRequest('/assessment/submit', 'POST', assessmentData)
    await onboardingStorage.setSession(response)
    return { data: response }
  }



  async getPronunciationPrompt() {
    return this.handleMockRequest('/pronunciation/prompt', 'GET')
  }

  async submitPronunciationAssessment(data: any) {
    return this.handleMockRequest('/pronunciation/submit', 'POST', data)
  }

  async getVocabularyPrompt() {
    return this.handleMockRequest('/vocabulary/prompt', 'GET')
  }

  async submitVocabularyAssessment(data: any) {
    return this.handleMockRequest('/vocabulary/submit', 'POST', data)
  }

  async getGrammarPrompt() {
    return this.handleMockRequest('/grammar/prompt', 'GET')
  }

  async submitGrammarAssessment(data: any) {
    return this.handleMockRequest('/grammar/submit', 'POST', data)
  }

  async getComprehensionPrompt() {
    return this.handleMockRequest('/comprehension/prompt', 'GET')
  }

  async submitComprehensionAssessment(data: any) {
    return this.handleMockRequest('/comprehension/submit', 'POST', data)
  }

  async submitFinalAssessment(assessmentId: string) {
    return this.handleMockRequest('/final/submit', 'POST', { assessmentId })
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
} 