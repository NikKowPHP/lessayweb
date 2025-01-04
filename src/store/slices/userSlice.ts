import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  id: string | null
  name: string | null
  email: string | null
  provider: 'email' | 'google' | 'github' | null
  nativeLanguage: string | null
  targetLanguage: string | null
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  provider: null,
  nativeLanguage: null,
  targetLanguage: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload }
    },
    clearUserData: () => initialState,
    updateLanguages: (
      state,
      action: PayloadAction<{ native?: string; target?: string }>
    ) => {
      if (action.payload.native) state.nativeLanguage = action.payload.native
      if (action.payload.target) state.targetLanguage = action.payload.target
    },
  },
})

export const { setUserData, clearUserData, updateLanguages } = userSlice.actions
export default userSlice.reducer