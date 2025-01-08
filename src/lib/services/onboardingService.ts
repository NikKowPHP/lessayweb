import type { LanguageCode } from '@/constants/languages'
import type { IOnboardingApi } from '@/lib/api/interfaces/IOnboardingApi'
import { MockOnboardingApi } from '@/lib/api/mock/MockOnboardingApi'
import { OnboardingApi } from '@/lib/api/OnboardingApi'
import  { AssessmentOrder, AssessmentPrompts, AssessmentResponses, AssessmentType, OnboardingStep } from '@/store/slices/onboardingSlice'

import type {
  PronunciationPromptResponse,
  VocabularyPromptResponse,
  GrammarPromptResponse,
  ComprehensionPromptResponse
} from '@/lib/models/responses/prompts/PromptResponseIndex'
import {  LanguagePreferencesResponse } from '@/lib/models/languages/LanguagePreferencesModel'

interface OnboardingSession {
  assessmentId: string | null
  currentStep: OnboardingStep
  assessmentType: AssessmentType | null
  assessmentProgress: number
  prompts: AssessmentPrompts
  responses: AssessmentResponses
  promptLoadStatus: Record<AssessmentType, boolean>
}

class OnboardingService {
  private api: IOnboardingApi
  private promptQueue: Map<AssessmentType, Promise<any>>

  constructor(api?: IOnboardingApi) {
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockOnboardingApi()
      : OnboardingApi.getInstance())
    this.promptQueue = new Map()
  }

  async initializePromptQueue(firstType: AssessmentType) {
    const priorityPrompt = await this.fetchPrompt(firstType)
    
    const remainingTypes = AssessmentOrder.filter(type => type !== firstType)
    
    remainingTypes.forEach(type => {
      this.promptQueue.set(type, this.fetchPrompt(type))
    })
  
    return priorityPrompt
  }
  
  private async fetchPrompt(type: AssessmentType) {
    const methods = {
      [AssessmentType.Pronunciation]: this.api.getPronunciationPrompt.bind(this.api),
      [AssessmentType.Vocabulary]: this.api.getVocabularyPrompt.bind(this.api),
      [AssessmentType.Grammar]: this.api.getGrammarPrompt.bind(this.api),
      [AssessmentType.Comprehension]: this.api.getComprehensionPrompt.bind(this.api)
    }
  
    try {
      const response = await methods[type]()
      await this.updatePromptLoadStatus(type, true)
      return response.data
    } catch (error) {
      await this.updatePromptLoadStatus(type, false)
      throw new Error(`Failed to fetch ${type} prompt`)
    }
  }

 

  async getPrompt(type: AssessmentType) {
    const queuedPrompt = this.promptQueue.get(type)
    if (queuedPrompt) {
      return await queuedPrompt
    }
    return await this.fetchPrompt(type)
  }

  private async updatePromptLoadStatus(type: AssessmentType, loaded: boolean) {
    const session = await this.getStoredOnboardingSession()
    if (session) {
      await this.updateOnboardingSession({
        promptLoadStatus: {
          ...session.promptLoadStatus,
          [type]: loaded
        }
      })
    }
  }

  async startAssessment(firstType: AssessmentType) {
    try {
      // Initialize session with empty prompts and load status
      const initialSession: OnboardingSession = {
        assessmentId: null,
        currentStep: OnboardingStep.AssessmentIntro,
        assessmentType: firstType,
        assessmentProgress: 0,
        prompts: {},
        responses: {},
        promptLoadStatus: {
          pronunciation: false,
          vocabulary: false,
          grammar: false,
          comprehension: false
        }
      }
      
      await this.storeOnboardingSession(initialSession)
      
      // Start loading prompts with priority
      const firstPrompt = await this.initializePromptQueue(firstType)
      
      // Update session with first prompt
      await this.updateOnboardingSession({
        prompts: {
          [firstType]: firstPrompt
        }
      })

      return firstPrompt
    } catch (error) {
      throw new Error('Failed to start assessment')
    }
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

  async submitAssessment(assessmentData: any) {
    try {
      const response = await this.api.submitFinalAssessment(assessmentData)
      return response.data
    } catch (error) {
      throw new Error('Failed to submit assessment')
    }
  }

  // Pronunciation methods
  async getPronunciationPrompt(): Promise<PronunciationPromptResponse> {
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
  async getVocabularyPrompt(): Promise<VocabularyPromptResponse> {
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
  async getGrammarPrompt(): Promise<GrammarPromptResponse> {
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
  async getComprehensionPrompt(): Promise<ComprehensionPromptResponse> {
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

  async getStoredOnboardingSession(): Promise<OnboardingSession | null> {
    try {
      const session = sessionStorage.getItem('onboarding_session')
      return session ? JSON.parse(session) : null
    } catch {
      return null
    }
  }

  async storeOnboardingSession(session: OnboardingSession): Promise<void> {
    sessionStorage.setItem('onboarding_session', JSON.stringify(session))
  }

  async updateOnboardingSession(updates: Partial<OnboardingSession>): Promise<void> {
    const currentSession = await this.getStoredOnboardingSession()
    await this.storeOnboardingSession({
      ...currentSession,
      ...updates
    } as OnboardingSession)
  }
}

// Export a singleton instance
export const onboardingService = new OnboardingService()

// Export the class for testing purposes
export { OnboardingService } 