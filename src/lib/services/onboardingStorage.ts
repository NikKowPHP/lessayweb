import { AbstractStorage, IStorageAdapter } from './abstractStorage'
import { LocalForageAdapter } from './localForageAdapter'
import { OnboardingState } from '@/lib/types/onboardingTypes'


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

  async getSession(): Promise<OnboardingState | null> {
    try {
      // Try session cache first for faster access
      if (this.sessionCache) {
        const cached = this.sessionCache.getItem(SESSION_KEY)
        if (cached) {
          return JSON.parse(cached) as OnboardingState
        }
      }

      // Fall back to persistent storage
      const persisted = await this.get<OnboardingState>(STORAGE_KEY)
      
      // Update session cache if data found
      if (persisted && this.sessionCache) {
        this.sessionCache.setItem(SESSION_KEY, JSON.stringify(persisted))
      }
      
      return persisted
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  async setSession(state: OnboardingState): Promise<void> {
    try {
      // Update both storages in parallel
      await Promise.all([
        this.set(STORAGE_KEY, state),
        this.sessionCache && 
          Promise.resolve(
            this.sessionCache.setItem(SESSION_KEY, JSON.stringify(state))
          )
      ])
    } catch (error) {
      console.error('Failed to set session:', error)
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
      console.error('Failed to clear session:', error)
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