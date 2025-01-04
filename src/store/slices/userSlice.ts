import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService, AuthCredentials, SocialProvider } from '@/services/authService'

interface UserState {
  id: string | null
  name: string | null
  email: string | null
  provider: 'email' | 'google' | 'github' | null
  nativeLanguage: string | null
  targetLanguage: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  provider: null,
  nativeLanguage: null,
  targetLanguage: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'user/login',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('token', response.token)
      return response.user
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed')
    }
  }
)

export const signup = createAsyncThunk(
  'user/signup',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.signup(credentials)
      localStorage.setItem('token', response.token)
      return response.user
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Signup failed')
    }
  }
)

export const socialAuth = createAsyncThunk(
  'user/socialAuth',
  async (provider: SocialProvider, { rejectWithValue }) => {
    try {
      const response = await authService.socialAuth(provider)
      localStorage.setItem('token', response.token)
      return response.user
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : `${provider} authentication failed`
      )
    }
  }
)

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    await authService.logout()
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload }
    },
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.id = action.payload.id
        state.name = action.payload.name
        state.email = action.payload.email
        state.provider = action.payload.provider || 'email'
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.id = action.payload.id
        state.name = action.payload.name
        state.email = action.payload.email
        state.provider = action.payload.provider || 'email'
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Social Auth
      .addCase(socialAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(socialAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.id = action.payload.id
        state.name = action.payload.name
        state.email = action.payload.email
        state.provider = action.payload.provider as 'google' | 'github' | 'email'
      })
      .addCase(socialAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logout.fulfilled, () => initialState)
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer