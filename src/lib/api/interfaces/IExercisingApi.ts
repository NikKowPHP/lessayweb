import type { 
  PronunciationExercise,
  PronunciationExerciseResult,
  RecordingAttempt,
  VideoContent 
} from '@/lib/types/exercises'

export interface IExercisingApi {
  // Exercise management
  getExercise(exerciseId: string): Promise<{ 
    data: PronunciationExercise 
  }>

  // Video content
  getVideoContent(videoId: string): Promise<{ 
    data: VideoContent 
  }>

  // Recording submission
  submitRecording(
    exerciseId: string,
    recording: RecordingAttempt
  ): Promise<{ 
    data: PronunciationExerciseResult 
  }>

  // Progress tracking
  getExerciseProgress(exerciseId: string): Promise<{
    data: {
      completed: boolean
      attempts: number
      bestScore: number
      lastAttempt: string | null
    }
  }>
} 