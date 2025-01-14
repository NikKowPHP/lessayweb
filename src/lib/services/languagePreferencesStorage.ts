// import { logger } from '../utils/logger'
import { AbstractStorage, IStorageAdapter } from './abstractStorage'
import { LocalForageAdapter } from './localForageAdapter'
import { LanguagePreferences } from '../models/languages/LanguagePreferencesModel'
import { cloneDeep } from 'lodash'

const STORAGE_KEY = 'language_preferences'
const SESSION_KEY = 'language_preferences_cache'

class LanguagePreferencesStorage extends AbstractStorage {
  private static instance: LanguagePreferencesStorage
  private sessionCache: Storage | null

  private constructor() {
    super({
      name: 'lessay',
      storeName: 'language_preferences',
      adapter: new LocalForageAdapter('lessay', 'language_preferences')
    })
    this.sessionCache = typeof window !== 'undefined' ? window.sessionStorage : null
  }

  protected getDefaultAdapter(): IStorageAdapter {
    return new LocalForageAdapter('lessay', 'language_preferences')
  }

  static getInstance(): LanguagePreferencesStorage {
    if (!LanguagePreferencesStorage.instance) {
      LanguagePreferencesStorage.instance = new LanguagePreferencesStorage()
    }
    return LanguagePreferencesStorage.instance
  }

  async getPreferences(): Promise<LanguagePreferences | null> {
    try {
      if (this.sessionCache) {
        const cached = this.sessionCache.getItem(SESSION_KEY)
        console.info('Retrieved cached language preferences', { cached })
        if (cached) {
          return JSON.parse(cached)
        }
      }

      const persisted = await this.get<LanguagePreferences>(STORAGE_KEY)
      
      if (persisted && this.sessionCache) {
        this.sessionCache.setItem(SESSION_KEY, JSON.stringify(persisted))
      }
      
      return persisted
    } catch (error) {
      console.error('Failed to get language preferences:', error as Error)
      return null
    }
  }

  async setPreferences(preferences: LanguagePreferences): Promise<void> {
    try {
      const clonedPreferences = cloneDeep(preferences)
      
      await Promise.all([
        this.set(STORAGE_KEY, clonedPreferences),
        this.sessionCache && 
          Promise.resolve(
            this.sessionCache.setItem(SESSION_KEY, JSON.stringify(clonedPreferences))
          )
      ])

      console.info('Language preferences updated', {
        native: clonedPreferences.nativeLanguage,
        target: clonedPreferences.targetLanguage
      })
    } catch (error) {
      console.error('Failed to set language preferences:', error as Error)
      throw error
    }
  }

  async clearPreferences(): Promise<void> {
    try {
      await Promise.all([
        this.remove(STORAGE_KEY),
        this.sessionCache && 
          Promise.resolve(
            this.sessionCache.removeItem(SESSION_KEY)
          )
      ])
    } catch (error) {
      console.error('Failed to clear language preferences', error as Error)
      throw error
    }
  }
}

export const languagePreferencesStorage = LanguagePreferencesStorage.getInstance()