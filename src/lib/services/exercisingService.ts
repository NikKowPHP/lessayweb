import { 
  PronunciationExercise,
  PronunciationExerciseResult,
  RecordingAttempt,
  VideoContent 
} from '@/lib/types/exercises'
import { exercisingStorage } from './exercisingStorage'
import type { IExercisingApi } from '@/lib/api/interfaces/IExercisingApi'
import { MockExercisingApi } from '@/lib/api/mock/MockExercisingApi'
import { ExercisingApi } from '@/lib/api/ExercisingApi'

export class ExercisingService {
  private static instance: ExercisingService
  private api: IExercisingApi
  private submissionQueue: Map<string, Promise<any>>
  private videoLoadQueue: Map<string, Promise<VideoContent>>

  private constructor(api?: IExercisingApi) {
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockExercisingApi()
      : ExercisingApi.getInstance())
    this.submissionQueue = new Map()
    this.videoLoadQueue = new Map()
  }

  static getInstance(api?: IExercisingApi): ExercisingService {
    if (!ExercisingService.instance) {
      ExercisingService.instance = new ExercisingService(api)
    }
    return ExercisingService.instance
  }

  async startExercise(exerciseId: string): Promise<PronunciationExercise> {
    try {
      console.info('Starting exercise', { exerciseId })

      // Check if we already have this exercise in storage
      const storedExercise = await exercisingStorage.getCurrentExercise()
      if (storedExercise?.id === exerciseId) {
        console.info('Using stored exercise', { exerciseId })
        return storedExercise
      }

      const response = await this.api.getExercise(exerciseId)
      const exercise = response.data

      // Start preloading video content in background
      this.preloadVideoContent(exercise.video)
      
      await exercisingStorage.setCurrentExercise(exercise)
      console.info('Exercise started successfully', { exerciseId })
      
      return exercise
    } catch (error) {
      console.error('Failed to start exercise', error as Error, { exerciseId })
      throw new Error('Failed to start exercise')
    }
  }

  private preloadVideoContent(video: VideoContent): void {
    if (this.videoLoadQueue.has(video.videoId)) {
      return // Already loading
    }

    const loadPromise = (async () => {
      try {
        const response = await this.api.getVideoContent(video.videoId)
        return response.data
      } catch (error) {
        console.error('Failed to preload video content', error as Error)
        throw error
      } finally {
        this.videoLoadQueue.delete(video.videoId)
      }
    })()

    this.videoLoadQueue.set(video.videoId, loadPromise)
  }

  async submitRecording(
    recording: RecordingAttempt, 
    background: boolean = false
  ): Promise<PronunciationExerciseResult | { status: string, id: string }> {
    const submissionId = `recording_${Date.now()}`
    
    const submissionPromise = (async () => {
      try {
        const currentExercise = await exercisingStorage.getCurrentExercise()
        if (!currentExercise) throw new Error('No active exercise')

        console.info('Submitting recording', { 
          exerciseId: currentExercise.id,
          recordingDuration: recording.duration
        })

        const response = await this.api.submitRecording(currentExercise.id, recording)
        const result = response.data

        await exercisingStorage.setExerciseResult(result)
        
        console.info('Recording submitted successfully', {
          exerciseId: currentExercise.id,
          scores: result.scores
        })

        return result
      } catch (error) {
        console.error('Failed to submit recording', error as Error)
        throw new Error('Failed to submit recording')
      } finally {
        this.submissionQueue.delete(submissionId)
      }
    })()

    if (background) {
      this.submissionQueue.set(submissionId, submissionPromise)
      return { status: 'queued', id: submissionId }
    }

    return await submissionPromise
  }

  async getSubmissionStatus(submissionId: string) {
    const submission = this.submissionQueue.get(submissionId)
    if (!submission) {
      return { status: 'not_found' }
    }
    try {
      const result = await submission
      return { status: 'completed', result }
    } catch (error) {
      return { status: 'failed', error }
    }
  }

  async getCurrentExercise(): Promise<PronunciationExercise | null> {
    return await exercisingStorage.getCurrentExercise()
  }

  async getExerciseResult(): Promise<PronunciationExerciseResult | null> {
    return await exercisingStorage.getExerciseResult()
  }

  async clearExerciseSession(): Promise<void> {
    await exercisingStorage.clearExerciseSession()
  }
}

// Export singleton instance
export const exercisingService = ExercisingService.getInstance()
