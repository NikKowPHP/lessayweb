import { authApi } from '@/lib/api/AuthApi'
import { AuthResponse, AuthCredentials, SocialProvider } from '@/types/auth'

class AuthService {
  private TOKEN_KEY = 'auth_token'

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
    const response = await authApi.login(credentials)
    this.setToken(response.token)
    return response
  }

  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await authApi.signup(credentials)
    this.setToken(response.token)
    return response
  }

  async socialAuth(provider: SocialProvider): Promise<AuthResponse> {
    const response = await authApi.socialAuth(provider)
    this.setToken(response.token)
    return response
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      return await authApi.getCurrentUser()
    } catch (error) {
      return null
    }
  }

  async logout(): Promise<void> {
    await authApi.logout()
    localStorage.removeItem(this.TOKEN_KEY)
  }
}

export const authService = new AuthService() 