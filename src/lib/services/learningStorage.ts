import { AbstractStorage, IStorageAdapter } from './abstractStorage'
import { LocalForageAdapter } from './localForageAdapter'
import { LearningPath, Exercise, Challenge } from '@/lib/types/learningPath'
import { cloneDeep } from 'lodash'

interface LearningState {
  currentPath: LearningPath | null
  currentExercise: Exercise | null
  currentChallenge: Challenge | null
  lastActivity: string | null
  ui: {
    expandedSections: string[]
    bookmarkedExercises: string[]
    lastViewedExercise: string | null
  }
}

const STORAGE_KEY = 'learning_session'
const SESSION_KEY = 'learning_session_cache'

export class LearningStorage extends AbstractStorage {
  private static instance: LearningStorage
  private sessionCache: Storage | null

  private constructor() {
    super({
      name: 'lessay',
      storeName: 'learning',
      adapter: new LocalForageAdapter('lessay', 'learning')
    })
    this.sessionCache = typeof window !== 'undefined' ? window.sessionStorage : null
  }

  protected getDefaultAdapter(): IStorageAdapter {
    return new LocalForageAdapter('lessay', 'learning')
  }

  static getInstance(): LearningStorage {
    if (!LearningStorage.instance) {
      LearningStorage.instance = new LearningStorage()
    }
    return LearningStorage.instance
  }

  private serializeState(state: LearningState): string {
    try {
      const clonedState = cloneDeep(state)
      return JSON.stringify(clonedState)
    } catch (error) {
      console.error('Failed to serialize learning state:', error)
      throw error
    }
  }

  private deserializeState(serializedState: string): LearningState {
    try {
      const parsed = JSON.parse(serializedState)
      
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid learning state structure')
      }

      const state: LearningState = {
        currentPath: parsed.currentPath,
        currentExercise: parsed.currentExercise,
        currentChallenge: parsed.currentChallenge,
        lastActivity: parsed.lastActivity,
        ui: {
          expandedSections: parsed.ui?.expandedSections ?? [],
          bookmarkedExercises: parsed.ui?.bookmarkedExercises ?? [],
          lastViewedExercise: parsed.ui?.lastViewedExercise ?? null
        }
      }

      return state
    } catch (error) {
      console.error('Failed to deserialize learning state:', error)
      throw error
    }
  }

  async getSession(): Promise<LearningState | null> {
    try {
      if (this.sessionCache) {
        const cached = this.sessionCache.getItem(SESSION_KEY)
        if (cached) {
          return this.deserializeState(cached)
        }
      }

      const persisted = await this.get<LearningState>(STORAGE_KEY)
      if (persisted) {
        const serialized = this.serializeState(persisted)
        this.sessionCache?.setItem(SESSION_KEY, serialized)
        return persisted
      }

      return null
    } catch (error) {
      console.error('Failed to get learning session:', error)
      return null
    }
  }

  async setSession(state: LearningState): Promise<void> {
    try {
      const clonedState = cloneDeep(state)
      const serializedState = this.serializeState(clonedState)
      
      if (this.sessionCache) {
        this.sessionCache.setItem(SESSION_KEY, serializedState)
      }
      
      await this.set(STORAGE_KEY, clonedState)
    } catch (error) {
      console.error('Failed to set learning session:', error)
      throw error
    }
  }

  async clearSession(): Promise<void> {
    try {
      await Promise.all([
        this.remove(STORAGE_KEY),
        this.sessionCache && Promise.resolve(this.sessionCache.removeItem(SESSION_KEY))
      ])
    } catch (error) {
      console.error('Failed to clear learning session:', error)
      throw error
    }
  }
}

export const learningStorage = LearningStorage.getInstance()