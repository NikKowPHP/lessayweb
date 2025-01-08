import { AbstractStorage, IStorageAdapter } from './abstractStorage'
import { LocalForageAdapter } from './localForageAdapter'
import { AuthResponse } from '@/lib/types/auth.types'

const AUTH_KEY = 'auth_session'
const SESSION_KEY = 'auth_session_cache'

class AuthStorage extends AbstractStorage {
  private static instance: AuthStorage
  private sessionCache: Storage | null

  private constructor() {
    super({
      name: 'lessay',
      storeName: 'auth',
      adapter: new LocalForageAdapter('lessay', 'auth')
    })
    this.sessionCache = typeof window !== 'undefined' ? window.sessionStorage : null
  }

  protected getDefaultAdapter(): IStorageAdapter {
    return new LocalForageAdapter('lessay', 'auth')
  }

  static getInstance(): AuthStorage {
    if (!AuthStorage.instance) {
      AuthStorage.instance = new AuthStorage()
    }
    return AuthStorage.instance
  }

  async getAuthSession(): Promise<AuthResponse | null> {
    try {
      // Try session cache first for faster access
      if (this.sessionCache) {
        const cached = this.sessionCache.getItem(SESSION_KEY)
        if (cached) {
          return JSON.parse(cached) as AuthResponse
        }
      }

      // Fall back to persistent storage
      const persisted = await this.get<AuthResponse>(AUTH_KEY)
      
      // Update session cache if data found
      if (persisted && this.sessionCache) {
        this.sessionCache.setItem(SESSION_KEY, JSON.stringify(persisted))
      }
      
      return persisted
    } catch (error) {
      console.error('Failed to get auth session:', error)
      return null
    }
  }

  async setAuthSession(auth: AuthResponse): Promise<void> {
    try {
      // Update both storages in parallel
      await Promise.all([
        this.set(AUTH_KEY, auth),
        this.sessionCache && 
          Promise.resolve(
            this.sessionCache.setItem(SESSION_KEY, JSON.stringify(auth))
          )
      ])
    } catch (error) {
      console.error('Failed to set auth session:', error)
      throw error
    }
  }

  async clearAuthSession(): Promise<void> {
    try {
      await Promise.all([
        this.remove(AUTH_KEY),
        this.sessionCache && 
          Promise.resolve(
            this.sessionCache.removeItem(SESSION_KEY)
          )
      ])
    } catch (error) {
      console.error('Failed to clear auth session:', error)
      throw error
    }
  }

  async getToken(): Promise<string | null> {
    const session = await this.getAuthSession()
    return session?.token || null
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    const session = await this.getAuthSession()
    return session?.user || null
  }
}

export const authStorage = AuthStorage.getInstance()