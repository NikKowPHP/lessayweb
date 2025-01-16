import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  PronunciationExercise,
  PronunciationExerciseResult,
  RecordingAttempt 
} from '@/lib/types/exercises'
import type { RootState } from '@/store'
import { exercisingService } from '@/lib/services/exercisingService'
import { exercisingStorage } from '@/lib/services/exercisingStorage'

export interface ExercisingState {
  currentExercise: PronunciationExercise | null
  currentRecording: RecordingAttempt | null
  isRecording: boolean
  isProcessing: boolean
  error: string | null
  results: PronunciationExerciseResult | null
  videoProgress: {
    hasWatched: boolean
    currentTime: number
    isPlaying: boolean
  }
  availableExercises: PronunciationExercise[]
  sessionLoaded: boolean
}

const initialState: ExercisingState = {
  currentExercise: null,
  currentRecording: null,
  isRecording: false,
  isProcessing: false,
  error: null,
  results: null,
  videoProgress: {
    hasWatched: false,
    currentTime: 0,
    isPlaying: false
  },
  availableExercises: [],
  sessionLoaded: false
}

// Async Thunks
export const rehydrateExercisingState = createAsyncThunk(
  'exercising/rehydrate',
  async () => {
    const [storedState, exercises] = await Promise.all([
      exercisingService.getStoredState(),
      exercisingService.getExercisesList()
    ])
    return {
      storedState,
      exercises
    }
  }
)

export const getExercisesList = createAsyncThunk(
  'exercising/getExercisesList',
  async () => {
    return await exercisingService.getExercisesList()
  }
)

export const startExercise = createAsyncThunk(
  'exercising/startExercise',
  async (exerciseId: string) => {
    return await exercisingService.startExercise(exerciseId)
  }
)

export const submitRecording = createAsyncThunk(
  'exercising/submitRecording',
  async (recording: RecordingAttempt) => {
    return await exercisingService.submitRecording(recording)
  }
)

export const invalidateExercisesCache = createAsyncThunk(
  'exercising/invalidateCache',
  async (_, { dispatch }) => {
    await exercisingService.invalidateExercisesCache()
    return dispatch(getExercisesList())
  }
)

const exercisingSlice = createSlice({
  name: 'exercising',
  initialState,
  reducers: {
    setVideoProgress: (state, action: PayloadAction<number>) => {
      state.videoProgress.currentTime = action.payload
      if (action.payload > 0) {
        state.videoProgress.hasWatched = true
      }
    },
    setIsRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload
    },
    setCurrentRecording: (state, action: PayloadAction<RecordingAttempt>) => {
      state.currentRecording = action.payload
    },
    resetExercise: (state) => {
      state.currentRecording = null
      state.results = null
      state.error = null
      state.isRecording = false
      state.isProcessing = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrateExercisingState.fulfilled, (state, action) => {
        const { storedState, exercises } = action.payload
        if (storedState.currentExercise) {
          state.currentExercise = storedState.currentExercise
        }
        if (storedState.results) {
          state.results = storedState.results
        }
        state.availableExercises = exercises
        state.sessionLoaded = true
      })
      .addCase(getExercisesList.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(getExercisesList.fulfilled, (state, action) => {
        state.availableExercises = action.payload
        state.isProcessing = false
      })
      .addCase(getExercisesList.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to get exercises'
        state.isProcessing = false
      })
      .addCase(startExercise.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(startExercise.fulfilled, (state, action) => {
        state.currentExercise = action.payload
        state.isProcessing = false
      })
      .addCase(startExercise.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to start exercise'
        state.isProcessing = false
      })
      .addCase(submitRecording.pending, (state) => {
        state.isProcessing = true
      })
      .addCase(submitRecording.fulfilled, (state, action) => {
        state.results = action.payload
        state.isProcessing = false
      })
      .addCase(submitRecording.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to submit recording'
        state.isProcessing = false
      })
  }
})

// Selectors
export const selectCurrentExercise = (state: RootState) => state.exercising.currentExercise
export const selectIsRecording = (state: RootState) => state.exercising.isRecording
export const selectCurrentRecording = (state: RootState) => state.exercising.currentRecording
export const selectResults = (state: RootState) => state.exercising.results
export const selectVideoProgress = (state: RootState) => state.exercising.videoProgress
export const selectIsProcessing = (state: RootState) => state.exercising.isProcessing
export const selectError = (state: RootState) => state.exercising.error
export const selectAvailableExercises = (state: RootState) => 
  state.exercising.availableExercises
export const selectSessionLoaded = (state: RootState) => 
  state.exercising.sessionLoaded

export const {
  setVideoProgress,
  setIsRecording,
  setCurrentRecording,
  resetExercise
} = exercisingSlice.actions

export default exercisingSlice.reducer