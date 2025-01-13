import type { LanguageCode } from '@/constants/languages'
import type { IOnboardingApi } from '@/lib/api/interfaces/IOnboardingApi'
import { MockOnboardingApi } from '@/lib/api/mock/MockOnboardingApi'
import { OnboardingApi } from '@/lib/api/OnboardingApi'

import type {
  PronunciationPromptResponse,
  VocabularyPromptResponse,
  GrammarPromptResponse,
  ComprehensionPromptResponse
} from '@/lib/models/responses/prompts/PromptResponses'
import {  LanguagePreferenceRequest, LanguagePreferencesResponse } from '@/lib/models/languages/LanguagePreferencesModel'
import { storageService } from './storageService'
import { ComprehensionAssessmentRequest, GrammarAssessmentRequest, PronunciationAssessmentRequest, VocabularyAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import { AssessmentOrder, OnboardingSession, OnboardingStep } from '../types/onboardingTypes'
import { AssessmentType } from '../types/onboardingTypes'
import { logger } from '../utils/logger'
import { languagePreferencesStorage } from './languagePreferencesStorage'


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
      .then(async (prompt) => {
        await storageService.updateOnboardingSession({
          prompts: {
            [firstType]: prompt
          },
          promptLoadStatus: {
            pronunciation: firstType === AssessmentType.Pronunciation,
            vocabulary: firstType === AssessmentType.Vocabulary,
            grammar: firstType === AssessmentType.Grammar,
            comprehension: firstType === AssessmentType.Comprehension
          }
        })
        logger.info('Priority prompt loaded and stored', { type: firstType })
        return prompt
      })
      .catch((error) => {
        logger.error('Failed to fetch priority prompt', error as Error, { type: firstType })
        throw error
      })
    
    // Start fetching remaining prompts in parallel
    const remainingTypes = AssessmentOrder.filter(type => type !== firstType)
    remainingTypes.forEach(type => {
      const promise = this.fetchPrompt(type)
        .then(async (prompt) => {
          const currentSession = await storageService.getOnboardingSession()
          await storageService.updateOnboardingSession({
            prompts: {
              [type]: prompt
            },
            promptLoadStatus: {
              pronunciation: currentSession?.promptLoadStatus.pronunciation || false,
              vocabulary: currentSession?.promptLoadStatus.vocabulary || false,
              grammar: currentSession?.promptLoadStatus.grammar || false,
              comprehension: currentSession?.promptLoadStatus.comprehension || false,
              [type]: true
            }
          })
          logger.info('Background prompt loaded and stored', { type })
          return prompt
        })
        .catch((error) => {
          logger.error('Failed to fetch background prompt', error as Error, { type })
          throw error
        })
      
      this.promptQueue.set(type, promise)
    })

    // Wait only for the first prompt to return
    try {
      const priorityPrompt = await priorityPromptPromise
      return priorityPrompt
    } catch (error) {
      logger.error('Failed to initialize prompt queue', error as Error)
      throw error
    }
  }
  
  private async fetchPrompt(type: AssessmentType) {
    if (!type) {
      logger.error('Invalid assessment type provided to fetchPrompt',  type )
      throw new Error('Invalid assessment type')
    }

    const methods = {
      [AssessmentType.Pronunciation]: this.api.getPronunciationPrompt.bind(this.api),
      [AssessmentType.Vocabulary]: this.api.getVocabularyPrompt.bind(this.api),
      [AssessmentType.Grammar]: this.api.getGrammarPrompt.bind(this.api),
      [AssessmentType.Comprehension]: this.api.getComprehensionPrompt.bind(this.api)
    }

    if (!methods[type]) {
      logger.info('No fetch method found for assessment type',  {type } )
      throw new Error(`Unsupported assessment type: ${type}`)
    }

    try {
      logger.info('Fetching prompt', { type })
      const response = await methods[type]()
      
      if (!response || !response.data) {
        throw new Error('Invalid response format')
      }
      
      await this.updatePromptLoadStatus(type, true)
      logger.debug('Prompt fetched successfully', { 
        type,
        hasData: !!response?.data 
      })
      
      return response.data
    } catch (error) {
      logger.error('Failed to fetch prompt', error as Error, { type })
      await this.updatePromptLoadStatus(type, false)
      throw new Error(`Failed to fetch ${type} prompt: ${(error as Error).message}`)
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
      if (!firstType || !Object.values(AssessmentType).includes(firstType)) {
        logger.info('Invalid first assessment type', { firstType })
        throw new Error('Invalid assessment type')
      }

      logger.info('Starting assessment', { firstType })
      
      const initialSession: OnboardingSession = {
        assessmentId: null,
        currentStep: OnboardingStep.AssessmentIntro,
        assessmentType: firstType,
        assessmentProgress: 0,
        prompts: {},
        responses: {},
        promptLoadStatus: {
          [AssessmentType.Pronunciation]: false,
          [AssessmentType.Vocabulary]: false,
          [AssessmentType.Grammar]: false,
          [AssessmentType.Comprehension]: false
        }
      }
      
      await storageService.setOnboardingSession(initialSession)
      logger.debug('Initial session created', { session: initialSession })
      
      // Get first prompt while initiating other fetches
      const firstPrompt = await this.initializePromptQueue(firstType)
      
      if (!firstPrompt) {
        throw new Error('Failed to fetch initial prompt')
      }
      
      // Update session with first prompt
      await storageService.updateOnboardingSession({
        prompts: {
          [firstType]: firstPrompt
        }
      })
      
      logger.info('Assessment started successfully', { 
        type: firstType,
        hasPrompt: !!firstPrompt 
      })
      
      return firstPrompt
    } catch (error) {
      logger.error('Failed to start assessment', error as Error, {
        firstType,
        error: (error as Error).message
      })
      throw new Error(`Failed to start assessment: ${(error as Error).message}`)
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
      languagePreferencesStorage.setPreferences({
        nativeLanguage: preferences.nativeLanguage,
        targetLanguage: preferences.targetLanguage
      })
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