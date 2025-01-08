import { OnboardingSession, OnboardingState } from "../types/onboardingTypes"

class StorageService {
  private static instance: StorageService
  
  private constructor() {}
  
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  getOnboardingSession(): OnboardingState | null {
    try {
      const session = sessionStorage.getItem('onboarding_session')
      return session ? JSON.parse(session) : null
    } catch {
      return null
    }
  }

  setOnboardingSession(session: OnboardingSession): void {
    sessionStorage.setItem('onboarding_session', JSON.stringify(session))
  }

  updateOnboardingSession(updates: Partial<OnboardingSession>): void {
    const currentSession = this.getOnboardingSession()
    this.setOnboardingSession({
      ...currentSession,
      ...updates
    } as OnboardingSession)
  }
}

export const storageService = StorageService.getInstance()