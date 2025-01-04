// Mock API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate API call
    await delay(1000);
    
    // Mock successful response
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: '1',
          name: 'Test User',
          email: credentials.email,
        },
        token: 'mock_jwt_token',
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate API call
    await delay(1000);
    
    // Mock successful response
    return {
      user: {
        id: '1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
      },
      token: 'mock_jwt_token',
    };
  }

  async logout(): Promise<void> {
    await delay(500);
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService(); 