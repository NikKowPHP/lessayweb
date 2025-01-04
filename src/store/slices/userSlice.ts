import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  id: string | null
  name: string | null
  email: string | null
  nativeLanguage: string | null
  targetLanguage: string | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  nativeLanguage: null,
  targetLanguage: null,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload }
    },
    clearUser: () => initialState,
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer