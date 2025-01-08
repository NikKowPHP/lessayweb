import type { LanguageCode } from '@/constants/languages'
import type { IOnboardingApi } from '@/lib/api/interfaces/IOnboardingApi'
import { MockOnboardingApi } from '@/lib/api/mock/MockOnboardingApi'
import { OnboardingApi } from '@/lib/api/OnboardingApi'

import type {
  PronunciationPromptResponse,
  VocabularyPromptResponse,
  GrammarPromptResponse,
  ComprehensionPromptResponse
} from '@/lib/models/responses/prompts/PromptResponseIndex'
import {  LanguagePreferenceRequest, LanguagePreferencesResponse } from '@/lib/models/languages/LanguagePreferencesModel'
import { storageService } from './storageService'
import { ComprehensionAssessmentRequest, GrammarAssessmentRequest, PronunciationAssessmentRequest, VocabularyAssessmentRequest } from '../models/requests/assessments/AssessmentRequests'
import { AssessmentOrder, OnboardingSession, OnboardingStep } from '../types/onboardingTypes'
import { AssessmentType } from '../types/onboardingTypes'


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
    // First, start fetching the first prompt immediately
    const priorityPromptPromise = this.fetchPrompt(firstType)
    
    // Start fetching remaining prompts in parallel
    const remainingTypes = AssessmentOrder.filter(type => type !== firstType)
    remainingTypes.forEach(type => {
      const promise = this.fetchPrompt(type)
      this.promptQueue.set(type, promise)
    })

    // Wait only for the first prompt to return
    const priorityPrompt = await priorityPromptPromise
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
    try {
      // Check if prompt is already in queue
      const queuedPrompt = this.promptQueue.get(type)
      if (queuedPrompt) {
        const prompt = await queuedPrompt
        // Remove from queue after retrieving
        this.promptQueue.delete(type)
        return prompt
      }
      // If not in queue, fetch directly
      return await this.fetchPrompt(type)
    } catch (error) {
      throw new Error(`Failed to get ${type} prompt`)
    }
  }

  private async updatePromptLoadStatus(type: AssessmentType, loaded: boolean) {
    const session = await storageService.getOnboardingSession()
    if (session) {
      storageService.updateOnboardingSession({
        promptLoadStatus: {
          ...session.promptLoadStatus,
          [type]: loaded
        }
      })
    }
  }

  async startAssessment(firstType: AssessmentType) {
    try {
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
      
      storageService.setOnboardingSession(initialSession)
      
      // Get first prompt while initiating other fetches
      const firstPrompt = await this.initializePromptQueue(firstType)
      
      // Update session with first prompt
      storageService.updateOnboardingSession({
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
      const request: LanguagePreferenceRequest = {
        nativeLanguage: preferences.nativeLanguage,
        targetLanguage: preferences.targetLanguage
      }
      const response = await this.api.submitLanguages(request)
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

  async submitFinalAssessment(assessmentId: string) {
    try {
      const response = await this.api.submitFinalAssessment(assessmentId)
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

  async submitPronunciationAssessment(data: PronunciationAssessmentRequest) {
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

  async submitVocabularyAssessment(data: VocabularyAssessmentRequest) {
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

  async submitGrammarAssessment(data: GrammarAssessmentRequest) {
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

  async submitComprehensionAssessment(data: ComprehensionAssessmentRequest) {
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