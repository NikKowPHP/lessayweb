import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  learnerContext?: string;
  // Add other user info fields as needed
}

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  nativeLanguage: string | null;
  currentTargetLanguageId: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  nativeLanguage: null,
  currentTargetLanguageId: null,
  userInfo: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isAuthenticated: true, error: null };
    },
    setLanguages: (state, action: PayloadAction<{ native: string; target: string }>) => {
      state.nativeLanguage = action.payload.native;
      state.currentTargetLanguageId = action.payload.target;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      return { ...initialState };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLanguages, setUserInfo, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer; 