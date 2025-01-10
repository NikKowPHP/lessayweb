import { IAuthApi } from './interfaces/IAuthApi'
import { AuthResponse, AuthCredentials, SocialProvider } from '@/lib/types/auth'
import { authStorage } from '@/lib/services/authStorage'

export class MockAuthApi implements IAuthApi {
  private mockDelay = 500

  private mockUsers = [
    {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      provider: 'email' as const,
    },
  ]

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private generateToken(): string {
    return `mock_token_${Math.random().toString(36).substr(2)}`
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    await this.delay(this.mockDelay)

    const user = this.mockUsers.find((u) => u.email === credentials.email)
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials')
    }

    const response = {
      user,
      token: this.generateToken(),
    }

    await authStorage.setAuthSession(response)
    return response
  }

  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    await this.delay(this.mockDelay)

    if (this.mockUsers.some((u) => u.email === credentials.email)) {
      throw new Error('Email already exists')
    }

    const newUser = {
      id: String(this.mockUsers.length + 1),
      email: credentials.email,
      name: credentials.email.split('@')[0],
      provider: 'email' as const,
    }

    this.mockUsers.push(newUser)
    const response = {
      user: newUser,
      token: this.generateToken(),
    }

    await authStorage.setAuthSession(response)
    return response
  }

  async socialAuth(provider: SocialProvider): Promise<AuthResponse> {
    await this.delay(this.mockDelay)

    const user = {
      id: String(this.mockUsers.length + 1),
      email: `${provider}_user@example.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      provider,
    }

    const response = {
      user,
      token: this.generateToken(),
    }

    await authStorage.setAuthSession(response)
    return response
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    await this.delay(this.mockDelay)
    const user = await authStorage.getCurrentUser()
    if (!user) throw new Error('No authenticated user')
    return user
  }

  async logout(): Promise<void> {
    await this.delay(this.mockDelay)
    await authStorage.clearAuthSession()
  }
} 