import { IAuthApi } from '@/lib/api/interfaces/IAuthApi'
import { AuthResponse, AuthCredentials, SocialProvider } from '@/lib/types/auth'
import { AuthApi } from '@/lib/api/AuthApi'
import { MockAuthApi } from '@/lib/api/MockAuthApi'
import Cookies from 'js-cookie'

class AuthService {
  private TOKEN_KEY = 'auth_token'
  private api: IAuthApi

  constructor(api?: IAuthApi) {
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockAuthApi()
      : AuthApi.getInstance())
  }

  private setToken(token: string) {
    Cookies.set(this.TOKEN_KEY, token, { 
      expires: 7, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    })
  }

  getToken(): string | null {
    return Cookies.get(this.TOKEN_KEY) || null
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
    Cookies.remove(this.TOKEN_KEY)
  }
}

export const authService = new AuthService()
export { AuthService } 