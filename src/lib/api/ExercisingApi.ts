import { Api } from './Api'
import type { IExercisingApi } from './interfaces/IExercisingApi'
import type { 
  ExerciseProgressData,
  PronunciationExercise,
  PronunciationExerciseResult,
  RecordingAttempt,
  VideoContent 
} from '@/lib/types/exercises'

export class ExercisingApi extends Api implements IExercisingApi {
  private static instance: ExercisingApi
  private static readonly ENDPOINTS = {
    GET_EXERCISE: '/exercises/:id',
    GET_VIDEO_CONTENT: '/exercises/video/:id',
    SUBMIT_RECORDING: '/exercises/:id/recording',
    GET_PROGRESS: '/exercises/:id/progress',
  } as const

  private constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api')
  }

  public static getInstance(): ExercisingApi {
    if (!ExercisingApi.instance) {
      ExercisingApi.instance = new ExercisingApi()
    }
    return ExercisingApi.instance
  }

  async getExercise(exerciseId: string): Promise<{ data: PronunciationExercise }> {
    const endpoint = ExercisingApi.ENDPOINTS.GET_EXERCISE.replace(':id', exerciseId)
    const response = await this.get<PronunciationExercise>(endpoint)
    return { data: response }
  }

  async getVideoContent(videoId: string): Promise<{ data: VideoContent }> {
    const endpoint = ExercisingApi.ENDPOINTS.GET_VIDEO_CONTENT.replace(':id', videoId)
    const response = await this.get<VideoContent>(endpoint)
    return { data: response }
  }

  async submitRecording(
    exerciseId: string,
    recording: RecordingAttempt
  ): Promise<{ data: PronunciationExerciseResult }> {
    const endpoint = ExercisingApi.ENDPOINTS.SUBMIT_RECORDING.replace(':id', exerciseId)
    const response = await this.post<PronunciationExerciseResult>(endpoint, { recording })
    return { data: response }
  }

  async getExerciseProgress(exerciseId: string): Promise<{
    data: ExerciseProgressData
  }> {
    const endpoint = ExercisingApi.ENDPOINTS.GET_PROGRESS.replace(':id', exerciseId)
    const response = await this.get<ExerciseProgressData>(endpoint)
    return { data: response }
  }
}

// Export singleton instance
export const exercisingApi = ExercisingApi.getInstance()