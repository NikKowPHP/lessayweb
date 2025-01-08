import localforage from 'localforage'
import { OnboardingSession, OnboardingState } from "../types/onboardingTypes"

class StorageService {
  private static instance: StorageService
  private storage: LocalForage
  
  private constructor() {
    this.storage = localforage.createInstance({
      name: 'lessay',
      storeName: 'onboarding'
    })
  }
  
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  async getOnboardingSession(): Promise<OnboardingState | null> {
    try {
      // Try session storage first for quick access
      const sessionData = sessionStorage.getItem('onboarding_session')
      if (sessionData) {
        return JSON.parse(sessionData)
      }
      
      // Fall back to persistent storage
      const persistedData = await this.storage.getItem('onboarding_session')
      if (persistedData) {
        // Sync back to session storage
        sessionStorage.setItem('onboarding_session', JSON.stringify(persistedData))
        return persistedData as OnboardingState
      }
      
      return null
    } catch {
      return null
    }
  }

  async setOnboardingSession(session: OnboardingSession): Promise<void> {
    try {
      // Update both storages in parallel
      await Promise.all([
        this.storage.setItem('onboarding_session', session),
        new Promise<void>(resolve => {
          sessionStorage.setItem('onboarding_session', JSON.stringify(session))
          resolve()
        })
      ])
    } catch (error) {
      console.error('Failed to persist session:', error)
    }
  }

  async updateOnboardingSession(updates: Partial<OnboardingSession>): Promise<void> {
    const currentSession = await this.getOnboardingSession()
    if (currentSession) {
      await this.setOnboardingSession({
        ...currentSession,
        ...updates
      } as OnboardingSession)
    }
  }

  async clearOnboardingSession(): Promise<void> {
    try {
      await Promise.all([
        this.storage.removeItem('onboarding_session'),
        new Promise<void>(resolve => {
          sessionStorage.removeItem('onboarding_session')
          resolve()
        })
      ])
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }
}

export const storageService = StorageService.getInstance()