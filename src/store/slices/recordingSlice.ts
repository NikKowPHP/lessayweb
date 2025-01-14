import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { RecordingHelper } from '@/lib/utils/recording'

interface RecordingState {
  isRecording: boolean
  audioData: string | null
  audioUrl: string | null
  duration: number
  error: string | null
  loading: boolean
}

const initialState: RecordingState = {
  isRecording: false,
  audioData: null,
  audioUrl: null,
  duration: 0,
  error: null,
  loading: false
}

// Create singleton instance of RecordingHelper
const recordingHelper = new RecordingHelper()

export const startRecording = createAsyncThunk(
  'recording/start',
  async () => {
    await recordingHelper.startRecording()
    return true
  }
)

export const stopRecording = createAsyncThunk(
  'recording/stop',
  async () => {
    const audioBlob = await recordingHelper.stopRecording()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audioData = await RecordingHelper.convertBlobToBase64(audioBlob)
    const duration = recordingHelper.getFinalDuration()
    
    return {
      audioData,
      audioUrl,
      duration
    }
  }
)

export const updateDuration = createAsyncThunk(
  'recording/updateDuration',
  async () => {
    return recordingHelper.getCurrentDuration()
  }
)

const recordingSlice = createSlice({
  name: 'recording',
  initialState,
  reducers: {
    resetRecording: (state) => {
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl)
      }
      return initialState
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startRecording.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startRecording.fulfilled, (state) => {
        state.isRecording = true
        state.loading = false
      })
      .addCase(startRecording.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to start recording'
        state.loading = false
      })
      .addCase(stopRecording.pending, (state) => {
        state.loading = true
      })
      .addCase(stopRecording.fulfilled, (state, action) => {
        state.isRecording = false
        state.audioData = action.payload.audioData
        state.audioUrl = action.payload.audioUrl
        state.duration = action.payload.duration
        state.loading = false
      })
      .addCase(stopRecording.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to stop recording'
        state.loading = false
      })
      .addCase(updateDuration.fulfilled, (state, action) => {
        state.duration = action.payload
      })
  }
})

// Selectors
export const selectRecordingState = (state: RootState) => state.recording
export const selectIsRecording = (state: RootState) => state.recording.isRecording
export const selectAudioData = (state: RootState) => state.recording.audioData
export const selectAudioUrl = (state: RootState) => state.recording.audioUrl
export const selectDuration = (state: RootState) => state.recording.duration
export const selectError = (state: RootState) => state.recording.error

export const { resetRecording, clearError } = recordingSlice.actions
export default recordingSlice.reducer
