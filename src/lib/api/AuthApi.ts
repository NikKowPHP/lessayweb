import { Api } from './Api'
import { IAuthApi } from './interfaces/IAuthApi'
import { AuthResponse, AuthCredentials, SocialProvider } from '@/types/auth'

export class AuthApi extends Api implements IAuthApi {
  private static instance: AuthApi
  private static readonly ENDPOINTS = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    SOCIAL: '/auth/social',
    CURRENT_USER: '/auth/me',
  }

  private constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api')
  }

  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi()
    }
    return AuthApi.instance
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.post<AuthResponse>(AuthApi.ENDPOINTS.LOGIN, credentials)
  }

  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.post<AuthResponse>(AuthApi.ENDPOINTS.SIGNUP, credentials)
  }

  async socialAuth(provider: SocialProvider): Promise<AuthResponse> {
    return this.post<AuthResponse>(AuthApi.ENDPOINTS.SOCIAL, { provider })
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    return this.get<AuthResponse['user']>(AuthApi.ENDPOINTS.CURRENT_USER)
  }

  async logout(): Promise<void> {
    return this.post(AuthApi.ENDPOINTS.LOGOUT)
  }
}

export const authApi = AuthApi.getInstance() 