export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    provider?: 'email' | 'google' | 'github'
  }
  token: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export type SocialProvider = 'google' | 'github' 