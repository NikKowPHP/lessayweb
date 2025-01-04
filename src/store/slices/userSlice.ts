import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  id: string | null
  name: string | null
  email: string | null
  provider: 'email' | 'google' | 'github' | null
  nativeLanguage: string | null
  targetLanguage: string | null
  onboardingCompleted: boolean
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  provider: null,
  nativeLanguage: null,
  targetLanguage: null,
  onboardingCompleted: false
}

export const updateUserLanguages = createAsyncThunk(
  'user/updateUserLanguages',
  async (
    { native, target }: { native?: string; target?: string },
    { rejectWithValue }
  ) => {
    try {
      // You can add API call here if needed
      return { native, target }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update languages'
      )
    }
  }
)

export const completeUserOnboarding = createAsyncThunk(
  'user/completeUserOnboarding',
  async (_, { rejectWithValue }) => {
    try {
      // You can add API call here if needed
      return true
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to complete onboarding'
      )
    }
  }
)

export const selectNeedsOnboarding = (state: { user: UserState }) => {
  const { nativeLanguage, targetLanguage, onboardingCompleted } = state.user
  return !onboardingCompleted || !nativeLanguage || !targetLanguage
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload }
    },
    clearUserData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserLanguages.fulfilled, (state, action) => {
        if (action.payload.native) state.nativeLanguage = action.payload.native
        if (action.payload.target) state.targetLanguage = action.payload.target
      })
      .addCase(completeUserOnboarding.fulfilled, (state) => {
        state.onboardingCompleted = true
      })
  },
})

export const { setUserData, clearUserData } = userSlice.actions
export default userSlice.reducer