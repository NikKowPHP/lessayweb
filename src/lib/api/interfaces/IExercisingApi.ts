import type { 
  PronunciationExercise,
  PronunciationExerciseResult,
  RecordingAttempt,
  VideoContent,
  ExerciseProgressData
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

  // Progress tracking with detailed metrics
  getExerciseProgress(exerciseId: string): Promise<{
    data: ExerciseProgressData
  }>

  // Get available exercises
  getExercisesList(): Promise<{ 
    data: PronunciationExercise[] 
  }>

  // Submit all recordings for a single exercise
  submitAllRecordings(
    exerciseId: string,
    recordings: RecordingAttempt[]
  ): Promise<{ data: PronunciationExerciseResult }>
} 