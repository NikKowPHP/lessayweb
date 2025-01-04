// Mock API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    provider?: 'email' | 'google' | 'github';
  };
  token: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export type SocialProvider = 'google' | 'github';

class AuthService {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    await delay(1000);
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: '1',
          name: 'Test User',
          email: credentials.email,
          provider: 'email',
        },
        token: 'mock_jwt_token',
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    await delay(1000);
    
    return {
      user: {
        id: '1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        provider: 'email',
      },
      token: 'mock_jwt_token',
    };
  }

  async socialAuth(provider: SocialProvider): Promise<AuthResponse> {
    await delay(1000);
    
    // Mock social auth response
    const mockSocialResponses = {
      google: {
        user: {
          id: '2',
          name: 'Google User',
          email: 'google.user@gmail.com',
          provider: 'google',
        },
        token: 'mock_google_token',
      },
      github: {
        user: {
          id: '3',
          name: 'GitHub User',
          email: 'github.user@github.com',
          provider: 'github',
        },
        token: 'mock_github_token',
      },
    };

    const response = mockSocialResponses[provider];
    
    if (!response) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    return response as AuthResponse;
  }

  async logout(): Promise<void> {
    await delay(500);
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService(); 