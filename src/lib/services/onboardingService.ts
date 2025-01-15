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
import {  LanguagePreferenceRequest, LanguagePreferences, LanguagePreferencesResponse } from '@/lib/models/languages/LanguagePreferencesModel'
import { ComprehensionAssessmentRequest, GrammarAssessmentRequest, PronunciationAssessmentRequest, VocabularyAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import { AssessmentOrder, initialOnboardingState, OnboardingState, OnboardingStep, } from '../types/onboardingTypes'
import { AssessmentType } from '../types/onboardingTypes'
// import { logger } from '../utils/logger'
import { languagePreferencesStorage } from './languagePreferencesStorage'
import { OnboardingStorage, onboardingStorage } from './onboardingStorage'


class OnboardingService {
  private api: IOnboardingApi
  private promptQueue: Map<AssessmentType, Promise<any>>
  private submissionQueue: Map<string, Promise<any>>
  private storage: OnboardingStorage
  constructor(api?: IOnboardingApi) {
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockOnboardingApi()
      : OnboardingApi.getInstance())
    this.promptQueue = new Map()
    this.submissionQueue = new Map()
    this.storage = onboardingStorage
  }

  async initializePromptQueue(firstType: AssessmentType) {
    // First, start fetching the first prompt immediately
    const priorityPromptPromise = this.fetchPrompt(firstType)
      .then(async (prompt) => {
        const currentSession = await this.storage.getSession()
        await this.storage.setSession({
          ...currentSession,
          prompts: {
            ...currentSession?.prompts,
            [firstType]: prompt
          },
          promptLoadStatus: {
            ...currentSession?.promptLoadStatus,
            [firstType]: true
          }
        } as OnboardingState)
        console.info('Priority prompt loaded and stored', { type: firstType })
        return prompt
      })
      .catch((error) => {
        console.error('Failed to fetch priority prompt', error as Error, { type: firstType })
        throw error
      })
    
    // Start fetching remaining prompts in parallel
    const remainingTypes = AssessmentOrder.filter(type => type !== firstType)
    remainingTypes.forEach(type => {
      const promise = this.fetchPrompt(type)
        .then(async (prompt) => {
          const currentSession = await this.storage.getSession()
          await this.storage.setSession({
            ...currentSession,
            prompts: {
              ...currentSession?.prompts,
              [type]: prompt
            },
            promptLoadStatus: {
              ...currentSession?.promptLoadStatus,
              [type]: true
            }
          } as OnboardingState)
          console.info('Background prompt loaded and stored', { type })
          return prompt
        })
        .catch((error) => {
          console.error('Failed to fetch background prompt', error as Error, { type })
          throw error
        })
      
      this.promptQueue.set(type, promise)
    })

    // Wait only for the first prompt to return
    try {
      const priorityPrompt = await priorityPromptPromise
      return priorityPrompt
    } catch (error) {
      console.error('Failed to initialize prompt queue', error as Error)
      throw error
    }
  }
  
  private async fetchPrompt(type: AssessmentType) {
    if (!type) {
      console.error('Invalid assessment type provided to fetchPrompt',  type )
      throw new Error('Invalid assessment type')
    }

    const methods = {
      [AssessmentType.Pronunciation]: this.api.getPronunciationPrompt.bind(this.api),
      [AssessmentType.Vocabulary]: this.api.getVocabularyPrompt.bind(this.api),
      [AssessmentType.Grammar]: this.api.getGrammarPrompt.bind(this.api),
      [AssessmentType.Comprehension]: this.api.getComprehensionPrompt.bind(this.api)
    }

    if (!methods[type]) {
      console.info('No fetch method found for assessment type',  {type } )
      throw new Error(`Unsupported assessment type: ${type}`)
    }

    try {
      console.info('Fetching prompt', { type })
      const response = await methods[type]()
      
      if (!response || !response.data) {
        throw new Error('Invalid response format')
      }
      
      await this.updatePromptLoadStatus(type, true)
      console.debug('Prompt fetched successfully', { 
        type,
        hasData: !!response?.data 
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to fetch prompt', error as Error, { type })
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
    const session = await this.storage.getSession()
    if (session) {
      await this.storage.setSession({
        ...session,
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
        console.info('Invalid first assessment type', { firstType })
        throw new Error('Invalid assessment type')
      }

      console.info('Starting assessment', { firstType })
      
      // Check if we already have a session
      const existingSession = await this.storage.getSession()
      
      // If we have an existing session with prompts, use that instead
      if (existingSession?.prompts?.[firstType]) {
        console.info('Using existing session', { 
          type: firstType,
          hasPrompt: true 
        })
        return existingSession.prompts[firstType]
      }
      
      // If no existing session or no prompts, create new session
      const initialSession = existingSession || initialOnboardingState
      
      // Get first prompt while initiating other fetches
      const firstPrompt = await this.initializePromptQueue(firstType)
      
      if (!firstPrompt) {
        throw new Error('Failed to fetch initial prompt')
      }
      
      // Update session with first prompt while preserving existing data
      await this.storage.setSession({
        ...initialSession,
        prompts: {
          ...initialSession.prompts,
          [firstType]: firstPrompt
        }
      } as OnboardingState)
      
      console.info('Assessment started successfully', { 
        type: firstType,
        hasPrompt: !!firstPrompt,
        isNewSession: !existingSession
      })
      
      return firstPrompt
    } catch (error) {
      console.error('Failed to start assessment', error as Error, {
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
      // Check if we already have final results in storage
      const session = await this.storage.getSession()
      if (session?.finalAssessment) {
        console.info('Using cached final assessment results')
        return session.finalAssessment
      }

      // Add a submission lock to prevent multiple calls
      if (this.submissionQueue.has('final_assessment')) {
        console.info('Final assessment submission already in progress')
        return await this.submissionQueue.get('final_assessment')
      }

      console.info('Submitting final assessment', { assessmentId })
      
      const submissionPromise = (async () => {
        try {
          const response = await this.api.submitFinalAssessment(assessmentId)
          
          // Cache the results
          if (session) {
            await this.storage.setSession({
              ...session,
              finalAssessment: response.data,
              currentStep: OnboardingStep.Complete // Add this to mark completion
            })
          }
          console.log('final assessmentresponse.data', response)

          return response
        } finally {
          // Clear the lock
          this.submissionQueue.delete('final_assessment')
        }
      })()

      // Set the lock
      this.submissionQueue.set('final_assessment', submissionPromise)
      
      return await submissionPromise
    } catch (error) {
      console.error('Failed to submit final assessment:', error)
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

  async submitPronunciationAssessment(data: PronunciationAssessmentRequest, background: boolean = false) {
    const submissionId = `pronunciation_${Date.now()}`
    
    const submissionPromise = (async () => {
      try {
        const response = await this.api.submitPronunciationAssessment(data)
        return response.data
      } catch (error) {
        console.error('Background submission failed:', error)
        throw error
      } finally {
        // Cleanup from queue
        this.submissionQueue.delete(submissionId)
      }
    })()

    if (background) {
      // Store in queue and return immediately
      this.submissionQueue.set(submissionId, submissionPromise)
      return { status: 'queued', id: submissionId }
    }

    // If not background, wait for completion
    return await submissionPromise
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

  async submitVocabularyAssessment(data: VocabularyAssessmentRequest, background: boolean = false) {
    const submissionId = `vocabulary_${Date.now()}`
    const submissionPromise = (async () => {
      try {
        const response = await this.api.submitVocabularyAssessment(data)
        return response.data
      } catch (error) {
        console.error('Background submission failed:', error)
        throw error
      } finally {
        this.submissionQueue.delete(submissionId)
      }
    })()

    if (background) {
      this.submissionQueue.set(submissionId, submissionPromise)
      return { status: 'queued', id: submissionId }
    }

    return await submissionPromise
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

  async submitGrammarAssessment(data: GrammarAssessmentRequest, background: boolean = false) {
    const submissionId = `grammar_${Date.now()}`
    const submissionPromise = (async () => {
      try {
        const response = await this.api.submitGrammarAssessment(data)
        return response.data
      } catch (error) {
        console.error('Background submission failed:', error)
        throw error
      } finally {
        this.submissionQueue.delete(submissionId)
      }
    })()

    if (background) {
      this.submissionQueue.set(submissionId, submissionPromise)
      return { status: 'queued', id: submissionId }
    }

    return await submissionPromise
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

  async submitComprehensionAssessment(data: ComprehensionAssessmentRequest, background: boolean = false) {
    const submissionId = `comprehension_${Date.now()}`
    const submissionPromise = (async () => {
      try {
        const response = await this.api.submitComprehensionAssessment(data)
        return response.data
      } catch (error) {
        console.error('Background submission failed:', error)
        throw error
      } finally {
        this.submissionQueue.delete(submissionId)
      }
    })()

    if (background) {
      this.submissionQueue.set(submissionId, submissionPromise)
      return { status: 'queued', id: submissionId }
    }

    return await submissionPromise
  }

  // Add method to check submission status
  async getSubmissionStatus(submissionId: string) {
    const submission = this.submissionQueue.get(submissionId)
    if (!submission) {
      return { status: 'not_found' }
    }
    try {
      const result = await submission
      return { status: 'completed', result }
    } catch (error) {
      return { status: 'failed', error }
    }
  }

  async createLearningPath(params: {
    assessmentId: string
    languagePreferences: LanguagePreferences
  }) {
    try {
      const response = await this.api.createLearningPath(params)
      return response
    } catch (error) {
      throw new Error('Failed to create learning path')
    }
  }

  async getStoredState() {
    return await this.storage.getSession()
  }
  async setStoredState(state: OnboardingState) {
    return await this.storage.setSession(state)
  }
}


// Export a singleton instance
export const onboardingService = new OnboardingService()

// Export the class for testing purposes
export { OnboardingService } 