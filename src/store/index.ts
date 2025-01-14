import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import learningReducer from './slices/learningSlice'
import onboardingReducer from './slices/onboardingSlice'
import recordingReducer from './slices/recordingSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    learning: learningReducer,
    onboarding: onboardingReducer,
    recording: recordingReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 