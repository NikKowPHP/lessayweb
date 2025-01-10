import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import { AuthCredentials, SocialProvider } from '@/types/auth'
import { setUserData, clearUserData } from './userSlice'
import { authService } from '@/services/authService'

interface AuthState {
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  token: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: AuthCredentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login(credentials)
      dispatch(setUserData(response.user))
      return response.token
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed')
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: AuthCredentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.signup(credentials)
      dispatch(setUserData(response.user))
      return response.token
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Signup failed')
    }
  }
)

export const socialAuth = createAsyncThunk(
  'auth/socialAuth',
  async (provider: SocialProvider, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.socialAuth(provider)
      dispatch(setUserData(response.user))
      return response.token
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : `${provider} authentication failed`
      )
    }
  }
)

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const user = await authService.getCurrentUser()
      console.log('user', user)
      if (!user) {
        return rejectWithValue('No authenticated user')
      }
      dispatch(setUserData(user))
      return authService.getToken()
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Initialization failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await authService.logout()
  dispatch(clearUserData())
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
        state.token = action.payload
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
        state.token = action.payload
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
        state.token = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      })
      .addCase(socialAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Initialize
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.fulfilled, () => initialState)
  },
})

export default authSlice.reducer 