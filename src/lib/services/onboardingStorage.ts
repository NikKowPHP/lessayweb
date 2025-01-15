import { AbstractStorage, IStorageAdapter } from './abstractStorage'
import { LocalForageAdapter } from './localForageAdapter'
import { OnboardingState } from '@/lib/types/onboardingTypes'
import { cloneDeep } from 'lodash'


const STORAGE_KEY = 'onboarding_session'
const SESSION_KEY = 'onboarding_session_cache'

export class OnboardingStorage extends AbstractStorage {
  private static instance: OnboardingStorage
  private sessionCache: Storage | null

  private constructor() {
    super({
      name: 'lessay',
      storeName: 'onboarding',
      adapter: new LocalForageAdapter('lessay', 'onboarding')
    })
    this.sessionCache = typeof window !== 'undefined' ? window.sessionStorage : null
  }

  protected getDefaultAdapter(): IStorageAdapter {
    return new LocalForageAdapter('lessay', 'onboarding')
  }

  static getInstance(): OnboardingStorage {
    if (!OnboardingStorage.instance) {
      OnboardingStorage.instance = new OnboardingStorage()
    }
    return OnboardingStorage.instance
  }

  private serializeState(state: OnboardingState): string {
    try {
      const clonedState = cloneDeep(state)
      return JSON.stringify(clonedState)
    } catch (error) {
      console.error('Failed to serialize state:', error as Error)
      throw error
    }
  }

  private deserializeState(serializedState: string): OnboardingState {
    try {
      const parsed = JSON.parse(serializedState);
      
      // Validate essential properties
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid state structure');
      }

      // Ensure all required properties exist with correct types
      const state: OnboardingState = {
        currentStep: parsed.currentStep ?? null,
        assessmentType: parsed.assessmentType ?? null,
        loading: Boolean(parsed.loading),
        error: parsed.error ?? null,
        assessmentProgress: Number(parsed.assessmentProgress) || 0,
        assessmentId: parsed.assessmentId ?? null,
        prompts: parsed.prompts ?? {},
        responses: parsed.responses ?? {},
        promptsLoaded: Boolean(parsed.promptsLoaded),
        sessionLoaded: Boolean(parsed.sessionLoaded),
        finalAssessment: parsed.finalAssessment ?? null,
        promptLoadStatus: parsed.promptLoadStatus ?? {},
        languagePreferences: parsed.languagePreferences ?? null,
        submissionStatus: parsed.submissionStatus ?? {
          pronunciation: { type: 'pronunciation', status: null, error: null },
          vocabulary: { type: 'vocabulary', status: null, error: null },
          grammar: { type: 'grammar', status: null, error: null },
          comprehension: { type: 'comprehension', status: null, error: null }
        }
      }
      

      return state
    } catch (error) {
      console.error('Failed to deserialize state:', error as Error);
      throw error;
    }
  }

  async getSession(): Promise<OnboardingState | null> {
    try {
      // Try session cache first
      if (this.sessionCache) {
        const cached = this.sessionCache.getItem(SESSION_KEY)
        if (cached) {
          const state = this.deserializeState(cached)
          console.debug('Retrieved state from session cache')
          return state
        }
      }

      // Fall back to persistent storage
      const persisted = await this.get<OnboardingState>(STORAGE_KEY)
      if (persisted) {
        // Update session cache
        const serialized = this.serializeState(persisted)
        this.sessionCache?.setItem(SESSION_KEY, serialized)
        console.debug('Retrieved state from persistent storage')
        return persisted
      }

      return null
    } catch (error) {
      console.error('Failed to get session:', error as Error)
      return null
    }
  }

  async setSession(state: OnboardingState): Promise<void> {
    try {
      const clonedState = cloneDeep(state)
      const serializedState = this.serializeState(clonedState)
      
      // First update session cache for immediate access
      if (this.sessionCache) {
        this.sessionCache.setItem(SESSION_KEY, serializedState)
      }
      
      // Then update persistent storage
      await this.set(STORAGE_KEY, clonedState)

      console.debug('Session state updated successfully')
    } catch (error) {
      console.error('Failed to set session:', error as Error)
      throw error
    }
  }

  async clearSession(): Promise<void> {
    try {
      await Promise.all([
        this.remove(STORAGE_KEY),
        this.sessionCache && 
          Promise.resolve(
            this.sessionCache.removeItem(SESSION_KEY)
          )
      ])
    } catch (error) {
      console.error('Failed to clear session', error as Error)
      throw error
    }
  }

  // Helper method to get specific prompt from storage
  async getPrompt<T extends keyof OnboardingState['prompts']>(
    type: T
  ): Promise<OnboardingState['prompts'][T] | null> {
    const session = await this.getSession()
    return session?.prompts[type] || null
  }
}

export const onboardingStorage = OnboardingStorage.getInstance()