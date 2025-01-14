import { AbstractStorage, IStorageAdapter } from './abstractStorage'
import { LocalForageAdapter } from './localForageAdapter'
import { OnboardingState } from '@/lib/types/onboardingTypes'
import { cloneDeep } from 'lodash'


const STORAGE_KEY = 'onboarding_session'
const SESSION_KEY = 'onboarding_session_cache'

class OnboardingStorage extends AbstractStorage {
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
      return JSON.parse(serializedState) as OnboardingState
    } catch (error) {
      console.error('Failed to deserialize state:', error as Error)
      throw error
    }
  }

  async getSession(): Promise<OnboardingState | null> {
    try {
      // Try session cache first for faster access
      if (this.sessionCache) {
        const cached = this.sessionCache.getItem(SESSION_KEY)
        if (cached) {
          return this.deserializeState(cached)
        }
      }

      // Fall back to persistent storage
      const persisted = await this.get<OnboardingState>(STORAGE_KEY)
      
      // Update session cache if data found
      if (persisted && this.sessionCache) {
        this.sessionCache.setItem(SESSION_KEY, this.serializeState(persisted))
      }
      
      return persisted
    } catch (error) {
      console.error('Failed to get session:', error as Error)
      return null
    }
  }

  async setSession(state: OnboardingState): Promise<void> {
    try {
      const clonedState = cloneDeep(state)
      const serializedState = this.serializeState(clonedState)
      
      // Update both storages in parallel
      await Promise.all([
        this.set(STORAGE_KEY, clonedState),
        this.sessionCache && 
          Promise.resolve(
            this.sessionCache.setItem(SESSION_KEY, serializedState)
          )
      ])

      // console.info('Session state updated', clonedState)
    } catch (error) {
      console.error('Failed to set session:', error as Error, {
        state: JSON.stringify(state, null, 2)
      })
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