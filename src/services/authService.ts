import { IAuthApi } from '@/lib/api/interfaces/IAuthApi'
import { AuthResponse, AuthCredentials, SocialProvider } from '@/types/auth'
import { AuthApi } from '@/lib/api/AuthApi'
import { MockAuthApi } from '@/lib/api/MockAuthApi'

class AuthService {
  private TOKEN_KEY = 'auth_token'
  private api: IAuthApi

  constructor(api?: IAuthApi) {
    // Use mock API in development, real API in production
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockAuthApi()
      : AuthApi.getInstance())
  }

  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.api.login(credentials)
    this.setToken(response.token)
    return response
  }

  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.api.signup(credentials)
    this.setToken(response.token)
    return response
  }

  async socialAuth(provider: SocialProvider): Promise<AuthResponse> {
    const response = await this.api.socialAuth(provider)
    this.setToken(response.token)
    return response
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      return await this.api.getCurrentUser()
    } catch (error) {
      return null
    }
  }

  async logout(): Promise<void> {
    await this.api.logout()
    localStorage.removeItem(this.TOKEN_KEY)
  }
}

// Export a singleton instance with the appropriate API implementation
export const authService = new AuthService()

// Export the class for testing purposes
export { AuthService } 