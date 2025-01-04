import { AuthResponse, AuthCredentials, SocialProvider } from '@/types/auth'

export interface IAuthApi {
  login(credentials: AuthCredentials): Promise<AuthResponse>
  signup(credentials: AuthCredentials): Promise<AuthResponse>
  socialAuth(provider: SocialProvider): Promise<AuthResponse>
  getCurrentUser(): Promise<AuthResponse['user']>
  logout(): Promise<void>
} 